"use client";
import { useState, useCallback, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { fetchMediaList, MediaItem } from "../utils/mediaLibrary";
import { resizeImage, readAsDataURL } from "../utils/imageResize";
import { uploadToExternalStorage } from "../utils/uploadFile";
import { ResolvedEditorConfig } from "../config/editorConfigTypes";

interface MediaLibraryModalProps {
    isOpen: boolean;
    onClose: () => void;
    mediaKind: "image" | "video" | "album";
    mediaConfig: ResolvedEditorConfig["media"];
    onInsert: (items: { src: string; alt: string }[]) => void;
}

interface PendingUpload {
    id: string;
    name: string;
    status: "uploading" | "done" | "error";
}

/**
 * Thin wrapper: mounts/unmounts the actual modal.
 * This is what gives us "fresh state every time the modal opens" for free,
 * with no reset-effect and no extra render, per:
 * https://react.dev/learn/you-might-not-need-an-effect#resetting-all-state-when-a-prop-changes
 */
export function MediaLibraryModal(props: MediaLibraryModalProps) {
    if (!props.isOpen) return null;
    return <MediaLibraryModalInner {...props} />;
}

type InnerProps = Omit<MediaLibraryModalProps, "isOpen">;

function MediaLibraryModalInner({
    onClose,
    mediaKind,
    mediaConfig,
    onInsert,
}: InnerProps) {
    const t = useTranslations("editor.mediaLibrary");
    const type: "image" | "video" = mediaKind === "video" ? "video" : "image";
    const multiple = mediaKind === "album";
    const { externalStorage, maxImageDimension, maxAlbumImages } = mediaConfig;

    // Fresh initial values on every mount == every time the modal opens.
    const [activeTab, setActiveTab] = useState<"library" | "upload">("library");
    const [items, setItems] = useState<MediaItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [isDragOver, setIsDragOver] = useState(false);
    const [pendingUploads, setPendingUploads] = useState<PendingUpload[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Tracks which item (by index in selectedIds) is currently being dragged
    // in the reorder strip. Native HTML5 DnD doesn't give this to us in
    // onDrop directly, so we stash it here between dragstart and drop.
    const dragIndexRef = useRef<number | null>(null);
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

    const loadLibrary = useCallback(() => {
        setLoading(true);
        setError(null);
        fetchMediaList({ config: mediaConfig, type })
            .then((list) => setItems(list))
            .catch((err) => setError(err.message || "Failed to load media"))
            .finally(() => setLoading(false));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mediaConfig.storageURL, mediaConfig.listEndpoint, mediaConfig.uploadToken, type]);

    // Legitimate effect: syncing with an external system (fetching data) on mount.
    useEffect(() => {
        loadLibrary();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const toggleSelect = (item: MediaItem) => {
        if (!multiple) {
            setSelectedIds([item.id]);
            return;
        }
        setSelectedIds((prev) => {
            if (prev.includes(item.id)) return prev.filter((id) => id !== item.id);
            if (prev.length >= maxAlbumImages) return prev;
            return [...prev, item.id];
        });
    };

    const removeFromSelection = (id: string) => {
        setSelectedIds((prev) => prev.filter((sid) => sid !== id));
    };

    const reorderSelected = (fromIndex: number, toIndex: number) => {
        setSelectedIds((prev) => {
            if (fromIndex === toIndex || fromIndex < 0 || toIndex < 0) return prev;
            const next = [...prev];
            const [moved] = next.splice(fromIndex, 1);
            next.splice(toIndex, 0, moved);
            return next;
        });
    };

    const handleInsert = () => {
        // Build from selectedIds (in the order the user arranged them),
        // not from `items` order, so drag-to-reorder actually matters.
        const itemsById = new Map(items.map((item) => [item.id, item]));
        const selectedItems = selectedIds
            .map((id) => itemsById.get(id))
            .filter((item): item is MediaItem => !!item)
            .map((item) => ({ src: item.src, alt: item.alt }));
        if (selectedItems.length === 0) return;
        onInsert(selectedItems);
    };

    const uploadFiles = async (files: File[]) => {
        const accepted = files.filter((f) =>
            type === "video" ? f.type.startsWith("video/") : f.type.startsWith("image/")
        );
        const limited = multiple ? accepted.slice(0, maxAlbumImages) : accepted.slice(0, 1);

        const uploadOne = async (file: File) => {
            const pendingId = `${file.name}-${Date.now()}-${Math.random()}`;
            setPendingUploads((prev) => [...prev, { id: pendingId, name: file.name, status: "uploading" }]);
            try {
                const src =
                    externalStorage && mediaConfig.storageURL
                        ? await uploadToExternalStorage(file, mediaConfig)
                        : type === "image"
                        ? await resizeImage(file, maxImageDimension, maxImageDimension)
                        : await readAsDataURL(file);

                const newItem: MediaItem = {
                    id: pendingId,
                    src,
                    alt: file.name,
                    type,
                };

                setItems((prev) => [newItem, ...prev]);
                setSelectedIds((prev) => (multiple ? [...prev, newItem.id] : [newItem.id]));
                setPendingUploads((prev) =>
                    prev.map((p) => (p.id === pendingId ? { ...p, status: "done" } : p))
                );
            } catch (err) {
                setPendingUploads((prev) =>
                    prev.map((p) => (p.id === pendingId ? { ...p, status: "error" } : p))
                );
            }
        };

        // Small batches so we don't fire 20 uploads at once
        const batchSize = 3;
        for (let i = 0; i < limited.length; i += batchSize) {
            await Promise.all(limited.slice(i, i + batchSize).map(uploadOne));
        }

        setActiveTab("library");
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragOver(false);
        const files = Array.from(e.dataTransfer.files || []);
        if (files.length) uploadFiles(files);
    };

    const filteredItems = items.filter((item) =>
        item.alt.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div
            style={{
                position: "fixed",
                inset: 0,
                backgroundColor: "rgba(0,0,0,0.6)",
                zIndex: 3000,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "24px",
            }}
            onMouseDown={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div
                style={{
                    width: "min(900px, 100%)",
                    height: "min(640px, 100%)",
                    backgroundColor: "var(--color-card, #fff)",
                    borderRadius: "12px",
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                    boxShadow: "0 20px 60px rgba(0,0,0,.35)",
                }}
            >
                {/* Header */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "16px 20px",
                        borderBottom: "1px solid var(--color-border, #E5E5E5)",
                    }}
                >
                    <h3 style={{ margin: 0, fontSize: "16px", color: "var(--color-titles, #223354)" }}>
                        {t("title")}
                    </h3>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label={t("close")}
                        style={{
                            border: "none",
                            background: "transparent",
                            fontSize: "20px",
                            cursor: "pointer",
                            color: "var(--color-text, #333)",
                            lineHeight: 1,
                        }}
                    >
                        ×
                    </button>
                </div>

                {/* Tabs */}
                <div
                    style={{
                        display: "flex",
                        gap: "4px",
                        padding: "12px 20px 0",
                        borderBottom: "1px solid var(--color-border, #E5E5E5)",
                    }}
                >
                    {(["library", "upload"] as const).map((tab) => (
                        <button
                            key={tab}
                            type="button"
                            onClick={() => setActiveTab(tab)}
                            style={{
                                padding: "8px 16px",
                                border: "none",
                                borderBottom:
                                    activeTab === tab
                                        ? "2px solid var(--color-primary, #4A72AA)"
                                        : "2px solid transparent",
                                background: "transparent",
                                cursor: "pointer",
                                fontWeight: activeTab === tab ? 600 : 400,
                                color:
                                    activeTab === tab
                                        ? "var(--color-primary, #4A72AA)"
                                        : "var(--color-text, #333)",
                            }}
                        >
                            {tab === "library" ? t("libraryTab") : t("uploadTab")}
                        </button>
                    ))}
                </div>

                {/* Body */}
                <div style={{ flex: 1, overflow: "auto", padding: "16px 20px" }}>
                    {activeTab === "library" && (
                        <>
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder={t("searchPlaceholder")}
                                style={{
                                    width: "100%",
                                    padding: "8px 12px",
                                    marginBottom: "12px",
                                    border: "1px solid var(--color-border, #E5E5E5)",
                                    borderRadius: "6px",
                                    fontSize: "14px",
                                }}
                            />

                            {loading && <p>{t("loading")}</p>}
                            {error && <p style={{ color: "#c0392b" }}>{error}</p>}
                            {!loading && !error && filteredItems.length === 0 && <p>{t("empty")}</p>}

                            {/* Original selection grid — behavior unchanged */}
                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
                                    gap: "10px",
                                }}
                            >
                                {filteredItems.map((item) => {
                                    const isSelected = selectedIds.includes(item.id);
                                    return (
                                        <div
                                            key={item.id}
                                            onClick={() => toggleSelect(item)}
                                            style={{
                                                position: "relative",
                                                aspectRatio: "1",
                                                borderRadius: "8px",
                                                overflow: "hidden",
                                                cursor: "pointer",
                                                border: isSelected
                                                    ? "3px solid var(--color-primary, #4A72AA)"
                                                    : "3px solid transparent",
                                                backgroundColor: "#000",
                                            }}
                                        >
                                            {item.type === "video" ? (
                                                <video
                                                    src={item.src}
                                                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                                    muted
                                                />
                                            ) : (
                                                <img
                                                    src={item.thumbnail || item.src}
                                                    alt={item.alt}
                                                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                                />
                                            )}
                                            {isSelected && (
                                                <div
                                                    style={{
                                                        position: "absolute",
                                                        top: "6px",
                                                        right: "6px",
                                                        width: "20px",
                                                        height: "20px",
                                                        borderRadius: "50%",
                                                        backgroundColor: "var(--color-primary, #4A72AA)",
                                                        color: "#fff",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        fontSize: "12px",
                                                    }}
                                                >
                                                    ✓
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Reorderable "Selected" strip — album mode only */}
                            {multiple && selectedIds.length > 0 && (
                                <div style={{ marginTop: "16px" }}>
                                    <p
                                        style={{
                                            margin: "0 0 8px",
                                            fontSize: "13px",
                                            fontWeight: 600,
                                            color: "var(--color-titles, #223354)",
                                        }}
                                    >
                                        {t("selectedOrder")}
                                    </p>
                                    <div
                                        style={{
                                            display: "flex",
                                            flexWrap: "wrap",
                                            gap: "8px",
                                            padding: "10px",
                                            border: "1px solid var(--color-border, #E5E5E5)",
                                            borderRadius: "8px",
                                            backgroundColor: "var(--color-background, #F9F8F8)",
                                        }}
                                    >
                                        {selectedIds.map((id, index) => {
                                            const item = items.find((i) => i.id === id);
                                            if (!item) return null;
                                            const isDragTarget = dragOverIndex === index;
                                            return (
                                                <div
                                                    key={id}
                                                    draggable
                                                    onDragStart={() => {
                                                        dragIndexRef.current = index;
                                                    }}
                                                    onDragOver={(e) => {
                                                        e.preventDefault();
                                                        if (dragOverIndex !== index) setDragOverIndex(index);
                                                    }}
                                                    onDragLeave={() => {
                                                        setDragOverIndex((prev) => (prev === index ? null : prev));
                                                    }}
                                                    onDrop={(e) => {
                                                        e.preventDefault();
                                                        const fromIndex = dragIndexRef.current;
                                                        dragIndexRef.current = null;
                                                        setDragOverIndex(null);
                                                        if (fromIndex === null) return;
                                                        reorderSelected(fromIndex, index);
                                                    }}
                                                    onDragEnd={() => {
                                                        dragIndexRef.current = null;
                                                        setDragOverIndex(null);
                                                    }}
                                                    style={{
                                                        position: "relative",
                                                        width: "72px",
                                                        height: "72px",
                                                        borderRadius: "8px",
                                                        overflow: "hidden",
                                                        cursor: "grab",
                                                        border: isDragTarget
                                                            ? "2px dashed var(--color-primary, #4A72AA)"
                                                            : "2px solid var(--color-border, #E5E5E5)",
                                                        backgroundColor: "#000",
                                                        opacity: isDragTarget ? 0.6 : 1,
                                                        transition: "opacity 0.15s ease, border-color 0.15s ease",
                                                    }}
                                                    title={t("dragToReorder")}
                                                >
                                                    {item.type === "video" ? (
                                                        <video
                                                            src={item.src}
                                                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                                            muted
                                                        />
                                                    ) : (
                                                        <img
                                                            src={item.thumbnail || item.src}
                                                            alt={item.alt}
                                                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                                            draggable={false}
                                                        />
                                                    )}
                                                    <div
                                                        style={{
                                                            position: "absolute",
                                                            top: "4px",
                                                            left: "4px",
                                                            minWidth: "18px",
                                                            height: "18px",
                                                            padding: "0 4px",
                                                            borderRadius: "9px",
                                                            backgroundColor: "var(--color-primary, #4A72AA)",
                                                            color: "#fff",
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "center",
                                                            fontSize: "11px",
                                                            fontWeight: 600,
                                                        }}
                                                    >
                                                        {index + 1}
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            removeFromSelection(id);
                                                        }}
                                                        aria-label={t("remove")}
                                                        style={{
                                                            position: "absolute",
                                                            top: "4px",
                                                            right: "4px",
                                                            width: "18px",
                                                            height: "18px",
                                                            borderRadius: "50%",
                                                            border: "none",
                                                            backgroundColor: "rgba(0,0,0,0.6)",
                                                            color: "#fff",
                                                            fontSize: "12px",
                                                            lineHeight: 1,
                                                            cursor: "pointer",
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "center",
                                                        }}
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    {activeTab === "upload" && (
                        <div>
                            <div
                                onDragOver={(e) => {
                                    e.preventDefault();
                                    setIsDragOver(true);
                                }}
                                onDragLeave={() => setIsDragOver(false)}
                                onDrop={handleDrop}
                                onClick={() => fileInputRef.current?.click()}
                                style={{
                                    border: `2px dashed ${
                                        isDragOver ? "var(--color-primary, #4A72AA)" : "var(--color-border, #E5E5E5)"
                                    }`,
                                    borderRadius: "10px",
                                    padding: "40px 20px",
                                    textAlign: "center",
                                    cursor: "pointer",
                                    backgroundColor: isDragOver ? "var(--color-background, #F9F8F8)" : "transparent",
                                }}
                            >
                                <p style={{ margin: 0, color: "var(--color-text, #333)" }}>{t("dropHint")}</p>
                                <p style={{ margin: "4px 0 0", fontSize: "13px", opacity: 0.7 }}>
                                    {t("browseHint")}
                                </p>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept={type === "video" ? "video/*" : "image/*"}
                                    multiple={multiple}
                                    style={{ display: "none" }}
                                    onChange={(e) => {
                                        const files = Array.from(e.target.files || []);
                                        if (files.length) uploadFiles(files);
                                        e.target.value = "";
                                    }}
                                />
                            </div>

                            {pendingUploads.length > 0 && (
                                <ul style={{ marginTop: "16px", paddingLeft: "18px" }}>
                                    {pendingUploads.map((p) => (
                                        <li key={p.id} style={{ fontSize: "13px", marginBottom: "4px" }}>
                                            {p.name} —{" "}
                                            {p.status === "uploading"
                                                ? t("uploading")
                                                : p.status === "done"
                                                ? t("uploaded")
                                                : t("uploadFailed")}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "12px 20px",
                        borderTop: "1px solid var(--color-border, #E5E5E5)",
                    }}
                >
                    <span style={{ fontSize: "13px", opacity: 0.7 }}>
                        {t("selectedCount", { count: selectedIds.length })}
                    </span>
                    <div style={{ display: "flex", gap: "8px" }}>
                        <button
                            type="button"
                            onClick={onClose}
                            style={{
                                padding: "8px 16px",
                                border: "1px solid var(--color-border, #E5E5E5)",
                                borderRadius: "6px",
                                background: "transparent",
                                cursor: "pointer",
                            }}
                        >
                            {t("cancel")}
                        </button>
                        <button
                            type="button"
                            onClick={handleInsert}
                            disabled={selectedIds.length === 0}
                            style={{
                                padding: "8px 16px",
                                border: "none",
                                borderRadius: "6px",
                                background: "var(--color-primary, #4A72AA)",
                                color: "#fff",
                                cursor: selectedIds.length === 0 ? "not-allowed" : "pointer",
                                opacity: selectedIds.length === 0 ? 0.5 : 1,
                            }}
                        >
                            {t("insert")}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}