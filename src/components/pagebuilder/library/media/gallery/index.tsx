import { GalleryHorizontal } from "lucide-react";
import type { ComponentDefinition } from "@/components/pagebuilder/core/types";
import type { ImageData } from "./carouselMarkup";
import { buildAlbumCarouselMarkup } from "./carouselMarkup";
import GalleryBlock from "./GalleryBlock";

interface GalleryProps { images: ImageData[] }

const Gallery: ComponentDefinition<GalleryProps> = {
    title: "Gallery",
    group: "Media",
    icon: GalleryHorizontal,
    tag: "media",
    label: "Gallery",
    // Editing happens via the dedicated modal (double-click / hover button),
    // not the generic settings panel — object arrays don't map to a field kind.
    defaultProps: () => ({
        images: [
            { src: "https://placehold.co/300x200", alt: "Gallery image 1" },
            { src: "https://placehold.co/300x200", alt: "Gallery image 2" },
            { src: "https://placehold.co/300x200", alt: "Gallery image 3" },
        ],
    }),
    render: ({ node, props, set }) => (
        <GalleryBlock images={props.images} uid={`gal-${node.id}`} onChange={(images) => set({ images })} />
    ),
    renderStatic: (props, node) => {
        const { styleTag, bodyHtml } = buildAlbumCarouselMarkup(props.images, `gal-${node.id}`);
        return `${styleTag}\n${bodyHtml}`;
    },
    css: `
.pb-el-gallery-carousel { position: relative; }
.pb-el-gallery-edit-btn {
    position: absolute; top: 22px; right: 22px; padding: 8px 14px; border: none; border-radius: 6px;
    background-color: rgba(0, 0, 0, 0.65); color: #fff; font-size: 13px; font-weight: 600; cursor: pointer;
    backdrop-filter: blur(3px); z-index: 3;
}
.pb-el-media-placeholder {
    display: flex; align-items: center; justify-content: center; padding: 24px;
    border: 1px dashed var(--border-color); border-radius: 6px; font-size: 12px;
    color: var(--text-muted-color); cursor: pointer;
}
`,
};

export default Gallery;