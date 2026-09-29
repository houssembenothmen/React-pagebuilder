"use client";
import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { buildAlbumCarouselMarkup, ImageData } from "./carouselMarkup";
import { GalleryEditorModal } from "./GalleryEditorModal";

interface GalleryBlockProps {
    images: ImageData[];
    uid: string;
    onChange: (images: ImageData[]) => void;
}

function GalleryBlock({ images, uid, onChange }: GalleryBlockProps) {
    const t = useTranslations("pagebuilder");
    const [isHovered, setIsHovered] = useState(false);
    const [isEditorOpen, setIsEditorOpen] = useState(false);

    const html = useMemo(() => {
        const { styleTag, bodyHtml } = buildAlbumCarouselMarkup(images, uid);
        return `${styleTag}\n${bodyHtml}`;
    }, [images, uid]);

    const modal = (
        <GalleryEditorModal
            isOpen={isEditorOpen}
            initialImages={images}
            onClose={() => setIsEditorOpen(false)}
            onSave={(next) => { onChange(next); setIsEditorOpen(false); }}
        />
    );

    if (images.length === 0) {
        return (
            <div className="pb-el-media-placeholder" onDoubleClick={(e) => { e.stopPropagation(); setIsEditorOpen(true); }}>
                {t("media.setGalleryImages")}
                {modal}
            </div>
        );
    }

    return (
        <div className="pb-el-gallery-carousel" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
            <div dangerouslySetInnerHTML={{ __html: html }} />
            {isHovered && (
                <button type="button" className="pb-el-gallery-edit-btn" onClick={(e) => { e.stopPropagation(); setIsEditorOpen(true); }}>
                    {t("media.editGallery")}
                </button>
            )}
            {modal}
        </div>
    );
}

export default GalleryBlock;