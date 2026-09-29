"use client";
import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { ImageData } from "./carouselMarkup";
import { resizeImage } from "./imageResize";

const MAX_IMAGE_DIMENSION = 1600;

interface EditableImage extends ImageData { id: string }
interface PendingUpload { id: string; name: string; status: "uploading" | "error" }

interface GalleryEditorModalProps {
    isOpen: boolean;
    initialImages: ImageData[];
    onClose: () => void;
    onSave: (images: ImageData[]) => void;
}

export function GalleryEditorModal(props: GalleryEditorModalProps) {
    if (!props.isOpen) return null;
    return <GalleryEditorModalInner {...props} />;
}

type InnerProps = Omit<GalleryEditorModalProps, "isOpen">;

function toEditable(images: ImageData[]): EditableImage[] {
    return images.map((img, i) => ({ ...img, id: `${i}-${img.src}-${Math.random().toString(36).slice(2, 8)}` }));
}

function GalleryEditorModalInner({ initialImages, onClose, onSave }: InnerProps) {
    const t = useTranslations("pagebuilder.galleryEditor");
    const [images, setImages] = useState<EditableImage[]>(() => toEditable(initialImages));
    const [pendingUploads, setPendingUploads] = useState<PendingUpload[]>([]);
    const [isDragOver, setIsDragOver] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const dragIndexRef = useRef<number | null>(null);
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

    const removeImage = (id: string) => setImages((prev) => prev.filter((img) => img.id !== id));

    const reorder = (fromIndex: number, toIndex: number) => {
        setImages((prev) => {
            if (fromIndex === toIndex || fromIndex < 0 || toIndex < 0) return prev;
            const next = [...prev];
            const [moved] = next.splice(fromIndex, 1);
            next.splice(toIndex, 0, moved);
            return next;
        });
    };

    const addFromPrompt = () => {
        const src = window.prompt(t("imageUrlPrompt"));
        if (!src) return;
        const alt = window.prompt(t("imageAltPrompt")) || "";
        setImages((prev) => [...prev, ...toEditable([{ src, alt }])]);
    };

    const uploadFiles = async (files: File[]) => {
        const accepted = files.filter((f) => f.type.startsWith("image/"));
        const uploadOne = async (file: File) => {
            const pendingId = `${file.name}-${Date.now()}-${Math.random()}`;
            setPendingUploads((prev) => [...prev, { id: pendingId, name: file.name, status: "uploading" }]);
            try {
                const src = await resizeImage(file, MAX_IMAGE_DIMENSION, MAX_IMAGE_DIMENSION);
                setImages((prev) => [...prev, ...toEditable([{ src, alt: file.name }])]);
                setPendingUploads((prev) => prev.filter((p) => p.id !== pendingId));
            } catch {
                setPendingUploads((prev) => prev.map((p) => (p.id === pendingId ? { ...p, status: "error" } : p)));
            }
        };
        const batchSize = 3;
        for (let i = 0; i < accepted.length; i += batchSize) {
            await Promise.all(accepted.slice(i, i + batchSize).map(uploadOne));
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragOver(false);
        const files = Array.from(e.dataTransfer.files || []);
        if (files.length) uploadFiles(files);
    };

    const handleSave = () => onSave(images.map(({ src, alt }) => ({ src, alt })));

    return (
        <div
            style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.6)", zIndex: 3000, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}
            onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div style={{ width: "min(760px, 100%)", maxHeight: "min(680px, 100%)", backgroundColor: "var(--surface-color, #fff)", borderRadius: "12px", display: "flex", flexDirection: "column", overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,.35)" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid var(--border-color, #E5E5E5)" }}>
                    <h3 style={{ margin: 0, fontSize: "16px", color: "var(--text-color, #223354)" }}>{t("title")}</h3>
                    <button type="button" onClick={onClose} aria-label={t("close")} style={{ border: "none", background: "transparent", fontSize: "20px", cursor: "pointer", color: "var(--text-color, #333)", lineHeight: 1 }}>×</button>
                </div>

                <div style={{ flex: 1, overflow: "auto", padding: "16px 20px" }}>
                    <div
                        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                        onDragLeave={() => setIsDragOver(false)}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        style={{
                            border: `2px dashed ${isDragOver ? "var(--primary-color, #4A72AA)" : "var(--border-color, #E5E5E5)"}`,
                            borderRadius: "10px", padding: "24px 16px", textAlign: "center", cursor: "pointer", marginBottom: "16px",
                            backgroundColor: isDragOver ? "var(--surface-hover-color, #F9F8F8)" : "transparent",
                        }}
                    >
                        <p style={{ margin: 0, color: "var(--text-color, #333)" }}>{t("dropHint")}</p>
                        <p style={{ margin: "4px 0 0", fontSize: "13px", opacity: 0.7 }}>{t("browseHint")}</p>
                        <input
                            ref={fileInputRef} type="file" accept="image/*" multiple style={{ display: "none" }}
                            onChange={(e) => { const files = Array.from(e.target.files || []); if (files.length) uploadFiles(files); e.target.value = ""; }}
                        />
                    </div>

                    {pendingUploads.length > 0 && (
                        <ul style={{ margin: "0 0 16px", paddingLeft: "18px" }}>
                            {pendingUploads.map((p) => (
                                <li key={p.id} style={{ fontSize: "13px", marginBottom: "4px" }}>
                                    {p.name} — {p.status === "uploading" ? t("uploading") : t("uploadFailed")}
                                </li>
                            ))}
                        </ul>
                    )}

                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
                        <p style={{ margin: 0, fontSize: "13px", fontWeight: 600, color: "var(--text-color, #223354)" }}>{t("dragToReorder")}</p>
                        <span style={{ fontSize: "12px", opacity: 0.7 }}>{t("count", { count: images.length })}</span>
                    </div>

                    {images.length === 0 && <p style={{ opacity: 0.7 }}>{t("empty")}</p>}

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: "10px" }}>
                        {images.map((img, index) => {
                            const isDragTarget = dragOverIndex === index;
                            return (
                                <div
                                    key={img.id}
                                    draggable
                                    onDragStart={() => { dragIndexRef.current = index; }}
                                    onDragOver={(e) => { e.preventDefault(); if (dragOverIndex !== index) setDragOverIndex(index); }}
                                    onDragLeave={() => setDragOverIndex((prev) => (prev === index ? null : prev))}
                                    onDrop={(e) => { e.preventDefault(); const fromIndex = dragIndexRef.current; dragIndexRef.current = null; setDragOverIndex(null); if (fromIndex === null) return; reorder(fromIndex, index); }}
                                    onDragEnd={() => { dragIndexRef.current = null; setDragOverIndex(null); }}
                                    style={{
                                        position: "relative", aspectRatio: "1", borderRadius: "8px", overflow: "hidden", cursor: "grab",
                                        border: isDragTarget ? "2px dashed var(--primary-color, #4A72AA)" : "2px solid var(--border-color, #E5E5E5)",
                                        backgroundColor: "#000", opacity: isDragTarget ? 0.6 : 1, transition: "opacity 0.15s ease, border-color 0.15s ease",
                                    }}
                                    title={t("dragToReorder")}
                                >
                                    <img src={img.src} alt={img.alt} style={{ width: "100%", height: "100%", objectFit: "cover" }} draggable={false} />
                                    <div style={{ position: "absolute", top: "6px", left: "6px", minWidth: "20px", height: "20px", padding: "0 5px", borderRadius: "10px", backgroundColor: "var(--primary-color, #4A72AA)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 600 }}>
                                        {index + 1}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={(e) => { e.stopPropagation(); removeImage(img.id); }}
                                        aria-label={t("remove")}
                                        style={{ position: "absolute", top: "6px", right: "6px", width: "20px", height: "20px", borderRadius: "50%", border: "none", backgroundColor: "rgba(0,0,0,0.6)", color: "#fff", fontSize: "13px", lineHeight: 1, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                                    >×</button>
                                </div>
                            );
                        })}

                        <button
                            type="button"
                            onClick={addFromPrompt}
                            style={{ aspectRatio: "1", borderRadius: "8px", border: "2px dashed var(--border-color, #E5E5E5)", backgroundColor: "var(--surface-hover-color, #F9F8F8)", color: "var(--primary-color, #4A72AA)", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "4px", fontSize: "13px", fontWeight: 600 }}
                        >
                            <span style={{ fontSize: "22px", lineHeight: 1 }}>+</span>
                            {t("addImageUrl")}
                        </button>
                    </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "8px", padding: "12px 20px", borderTop: "1px solid var(--border-color, #E5E5E5)" }}>
                    <button type="button" onClick={onClose} style={{ padding: "8px 16px", border: "1px solid var(--border-color, #E5E5E5)", borderRadius: "6px", background: "transparent", cursor: "pointer" }}>{t("cancel")}</button>
                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={images.length === 0}
                        style={{ padding: "8px 16px", border: "none", borderRadius: "6px", background: "var(--primary-color, #4A72AA)", color: "#fff", cursor: images.length === 0 ? "not-allowed" : "pointer", opacity: images.length === 0 ? 0.5 : 1 }}
                    >{t("save")}</button>
                </div>
            </div>
        </div>
    );
}