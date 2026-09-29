// library/media/MediaPickerModal.tsx
"use client";
import { useRef, useState } from "react";
import { readAsDataURL } from "../gallery/imageResize";

interface MediaPickerModalProps {
    isOpen: boolean;
    accept: string;
    currentSrc?: string;
    title?: string;
    onClose: () => void;
    onSave: (src: string) => void;
}

export function MediaPickerModal({ isOpen, ...rest }: MediaPickerModalProps) {
    if (!isOpen) return null;
    return <MediaPickerModalInner {...rest} />;
}

function MediaPickerModalInner({
    accept,
    currentSrc,
    title = "Set media source",
    onClose,
    onSave,
}: Omit<MediaPickerModalProps, "isOpen">) {
    const [tab, setTab] = useState<"url" | "upload">("url");
    const [url, setUrl] = useState(currentSrc ?? "");
    const [isUploading, setIsUploading] = useState(false);
    const [isDragOver, setIsDragOver] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFile = async (file: File | undefined) => {
        if (!file) return;
        setIsUploading(true);
        try {
            const dataUrl = await readAsDataURL(file);
            onSave(dataUrl);
        } finally {
            setIsUploading(false);
        }
    };

    const tabBtnStyle = (active: boolean): React.CSSProperties => ({
        flex: 1,
        padding: "10px",
        border: "none",
        background: "transparent",
        cursor: "pointer",
        fontWeight: 600,
        fontSize: 13,
        color: active ? "var(--primary-color, #4A72AA)" : "var(--text-muted-color, #888)",
        borderBottom: active ? "2px solid var(--primary-color, #4A72AA)" : "2px solid transparent",
    });

    return (
        <div
            style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.6)", zIndex: 3000, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}
            onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div style={{ width: "min(420px, 100%)", backgroundColor: "var(--surface-color, #fff)", borderRadius: "12px", overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,.35)" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px", borderBottom: "1px solid var(--border-color, #E5E5E5)" }}>
                    <h3 style={{ margin: 0, fontSize: "15px", color: "var(--text-color, #223354)" }}>{title}</h3>
                    <button type="button" onClick={onClose} style={{ border: "none", background: "transparent", fontSize: "20px", cursor: "pointer", lineHeight: 1 }}>×</button>
                </div>

                <div style={{ display: "flex", borderBottom: "1px solid var(--border-color, #E5E5E5)" }}>
                    <button type="button" onClick={() => setTab("url")} style={tabBtnStyle(tab === "url")}>By URL</button>
                    <button type="button" onClick={() => setTab("upload")} style={tabBtnStyle(tab === "upload")}>Upload</button>
                </div>

                <div style={{ padding: "18px" }}>
                    {tab === "url" ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                            <input
                                type="text"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                placeholder="https://example.com/file.jpg"
                                style={{ padding: "8px 10px", border: "1px solid var(--border-color, #E5E5E5)", borderRadius: "6px", fontSize: 13 }}
                            />
                            <button
                                type="button"
                                onClick={() => url.trim() && onSave(url.trim())}
                                disabled={!url.trim()}
                                style={{ padding: "8px 14px", border: "none", borderRadius: "6px", background: "var(--primary-color, #4A72AA)", color: "#fff", cursor: url.trim() ? "pointer" : "not-allowed", opacity: url.trim() ? 1 : 0.5, fontSize: 13, fontWeight: 600 }}
                            >
                                Use this URL
                            </button>
                        </div>
                    ) : (
                        <div
                            onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                            onDragLeave={() => setIsDragOver(false)}
                            onDrop={(e) => { e.preventDefault(); setIsDragOver(false); handleFile(e.dataTransfer.files?.[0]); }}
                            onClick={() => fileInputRef.current?.click()}
                            style={{
                                border: `2px dashed ${isDragOver ? "var(--primary-color, #4A72AA)" : "var(--border-color, #E5E5E5)"}`,
                                borderRadius: "10px", padding: "28px 16px", textAlign: "center", cursor: "pointer",
                                backgroundColor: isDragOver ? "var(--surface-hover-color, #F9F8F8)" : "transparent",
                            }}
                        >
                            <p style={{ margin: 0 }}>{isUploading ? "Uploading…" : "Drop a file here or click to browse"}</p>
                            <input
                                ref={fileInputRef} type="file" accept={accept} style={{ display: "none" }}
                                onChange={(e) => handleFile(e.target.files?.[0])}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}