"use client";
import { useState, useRef } from "react";
import { useTranslations } from "next-intl";
import { ImageData } from "../nodes/AlbumNode";
import { MediaLibraryModal } from "./MediaLibraryModal";
import { ResolvedEditorConfig } from "../config/editorConfigTypes";

interface EditableImage extends ImageData {
    id: string;
}

interface AlbumEditorModalProps {
    isOpen: boolean;
    initialImages: ImageData[];
    onClose: () => void;
    onSave: (images: ImageData[]) => void;
    mediaConfig: ResolvedEditorConfig["media"];
}

export function AlbumEditorModal(props: AlbumEditorModalProps) {
    if (!props.isOpen) return null;
    return <AlbumEditorModalInner {...props} />;
}

type InnerProps = Omit<AlbumEditorModalProps, "isOpen">;

function toEditable(images: ImageData[]): EditableImage[] {
    return images.map((img, i) => ({
        ...img,
        id: `${i}-${img.src}-${Math.random().toString(36).slice(2, 8)}`,
    }));
}

function AlbumEditorModalInner({
    initialImages,
    onClose,
    onSave,
    mediaConfig,
}: InnerProps) {
    const t = useTranslations("editor.albumEditor");
    const maxAlbumImages = mediaConfig.maxAlbumImages;

    // Fresh copy on every open (component remounts each time via the
    // isOpen-gated wrapper above), so edits here don't leak until Save.
    const [images, setImages] = useState<EditableImage[]>(() => toEditable(initialImages));
    const [isLibraryOpen, setIsLibraryOpen] = useState(false);

    const dragIndexRef = useRef<number | null>(null);
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

    const removeImage = (id: string) => {
        setImages((prev) => prev.filter((img) => img.id !== id));
    };

    const reorder = (fromIndex: number, toIndex: number) => {
        setImages((prev) => {
            if (fromIndex === toIndex || fromIndex < 0 || toIndex < 0) return prev;
            const next = [...prev];
            const [moved] = next.splice(fromIndex, 1);
            next.splice(toIndex, 0, moved);
            return next;
        });
    };

    const handleAddFromLibrary = (selected: { src: string; alt: string }[]) => {
        setImages((prev) => {
            const room = Math.max(0, maxAlbumImages - prev.length);
            const additions = toEditable(selected.slice(0, room));
            return [...prev, ...additions];
        });
        setIsLibraryOpen(false);
    };

    const handleSave = () => {
        onSave(images.map(({ src, alt }) => ({ src, alt })));
    };

    const atLimit = images.length >= maxAlbumImages;

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
                    width: "min(760px, 100%)",
                    maxHeight: "min(640px, 100%)",
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

                {/* Body */}
                <div style={{ flex: 1, overflow: "auto", padding: "16px 20px" }}>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            marginBottom: "10px",
                        }}
                    >
                        <p
                            style={{
                                margin: 0,
                                fontSize: "13px",
                                fontWeight: 600,
                                color: "var(--color-titles, #223354)",
                            }}
                        >
                            {t("dragToReorder")}
                        </p>
                        <span style={{ fontSize: "12px", opacity: 0.7 }}>
                            {t("countOfMax", { count: images.length, max: maxAlbumImages })}
                        </span>
                    </div>

                    {images.length === 0 && <p style={{ opacity: 0.7 }}>{t("empty")}</p>}

                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
                            gap: "10px",
                        }}
                    >
                        {images.map((img, index) => {
                            const isDragTarget = dragOverIndex === index;
                            return (
                                <div
                                    key={img.id}
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
                                        reorder(fromIndex, index);
                                    }}
                                    onDragEnd={() => {
                                        dragIndexRef.current = null;
                                        setDragOverIndex(null);
                                    }}
                                    style={{
                                        position: "relative",
                                        aspectRatio: "1",
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
                                    <img
                                        src={img.src}
                                        alt={img.alt}
                                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                        draggable={false}
                                    />
                                    <div
                                        style={{
                                            position: "absolute",
                                            top: "6px",
                                            left: "6px",
                                            minWidth: "20px",
                                            height: "20px",
                                            padding: "0 5px",
                                            borderRadius: "10px",
                                            backgroundColor: "var(--color-primary, #4A72AA)",
                                            color: "#fff",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            fontSize: "12px",
                                            fontWeight: 600,
                                        }}
                                    >
                                        {index + 1}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeImage(img.id);
                                        }}
                                        aria-label={t("remove")}
                                        style={{
                                            position: "absolute",
                                            top: "6px",
                                            right: "6px",
                                            width: "20px",
                                            height: "20px",
                                            borderRadius: "50%",
                                            border: "none",
                                            backgroundColor: "rgba(0,0,0,0.6)",
                                            color: "#fff",
                                            fontSize: "13px",
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

                        <button
                            type="button"
                            onClick={() => setIsLibraryOpen(true)}
                            disabled={atLimit}
                            style={{
                                aspectRatio: "1",
                                borderRadius: "8px",
                                border: "2px dashed var(--color-border, #E5E5E5)",
                                backgroundColor: "var(--color-background, #F9F8F8)",
                                color: "var(--color-primary, #4A72AA)",
                                cursor: atLimit ? "not-allowed" : "pointer",
                                opacity: atLimit ? 0.5 : 1,
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "4px",
                                fontSize: "13px",
                                fontWeight: 600,
                            }}
                        >
                            <span style={{ fontSize: "22px", lineHeight: 1 }}>+</span>
                            {t("addMore")}
                        </button>
                    </div>
                </div>

                {/* Footer */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-end",
                        gap: "8px",
                        padding: "12px 20px",
                        borderTop: "1px solid var(--color-border, #E5E5E5)",
                    }}
                >
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
                        onClick={handleSave}
                        disabled={images.length === 0}
                        style={{
                            padding: "8px 16px",
                            border: "none",
                            borderRadius: "6px",
                            background: "var(--color-primary, #4A72AA)",
                            color: "#fff",
                            cursor: images.length === 0 ? "not-allowed" : "pointer",
                            opacity: images.length === 0 ? 0.5 : 1,
                        }}
                    >
                        {t("save")}
                    </button>
                </div>
            </div>

            {isLibraryOpen && (
                <MediaLibraryModal
                    isOpen={isLibraryOpen}
                    onClose={() => setIsLibraryOpen(false)}
                    mediaKind="album"
                    mediaConfig={{
                        ...mediaConfig,
                        maxAlbumImages: Math.max(0, maxAlbumImages - images.length),
                    }}
                    onInsert={handleAddFromLibrary}
                />
            )}
        </div>
    );
}