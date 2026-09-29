// library/media/image/index.tsx
"use client";
import { useState } from "react";
import { Image as ImageIcon } from "lucide-react";
import type { ComponentDefinition } from "@/components/pagebuilder/core/types";
import { escapeHtml } from "@/components/pagebuilder/core/utils/escapeHtml";
import { MediaPickerModal } from "../MediaPickerModal";

interface ImageProps { src: string; alt: string }

const ImageRender = ({ props, set }: { props: ImageProps; set: (p: Partial<ImageProps>) => void }) => {
    const [isPickerOpen, setIsPickerOpen] = useState(false);
    return (
        <figure className="pb-el-image">
            <img src={props.src} alt={props.alt} onDoubleClick={(e) => { e.stopPropagation(); setIsPickerOpen(true); }} />
            <MediaPickerModal
                isOpen={isPickerOpen}
                accept="image/*"
                currentSrc={props.src}
                title="Set image"
                onClose={() => setIsPickerOpen(false)}
                onSave={(src) => { set({ src }); setIsPickerOpen(false); }}
            />
        </figure>
    );
};

const Image: ComponentDefinition<ImageProps> = {
    title: "Image",
    group: "Media",
    icon: ImageIcon,
    tag: "media",
    label: "Image",
    defaultProps: () => ({ src: "https://placehold.co/600x360", alt: "Placeholder image" }),
    fields: [
        { key: "src", kind: "text", label: "Image URL" },
        { key: "alt", kind: "text", label: "Alt text" },
    ],
    render: ({ props, set }) => <ImageRender props={props} set={set} />,
    renderStatic: (props) => `<figure class="pb-el-image"><img src="${escapeHtml(props.src)}" alt="${escapeHtml(props.alt)}" /></figure>`,
    css: `.pb-el-image img { width: 100%; border-radius: 8px; cursor: zoom-in; display: block; }`,
};

export default Image;