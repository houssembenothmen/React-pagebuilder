// library/media/audio/index.tsx
"use client";
import { useState } from "react";
import { Music } from "lucide-react";
import type { ComponentDefinition } from "@/components/pagebuilder/core/types";
import { escapeHtml } from "@/components/pagebuilder/core/utils/escapeHtml";
import { MediaPickerModal } from "../MediaPickerModal";

interface AudioProps { src: string }

const AudioRender = ({ props, set }: { props: AudioProps; set: (p: Partial<AudioProps>) => void }) => {
    const [isPickerOpen, setIsPickerOpen] = useState(false);
    return (
        <>
            {props.src ? (
                <audio className="pb-el-media" src={props.src} controls onClick={(e) => e.stopPropagation()}
                    onDoubleClick={(e) => { e.stopPropagation(); setIsPickerOpen(true); }} />
            ) : (
                <div className="pb-el-media-placeholder" onDoubleClick={(e) => { e.stopPropagation(); setIsPickerOpen(true); }}>
                    Set audio source
                </div>
            )}
            <MediaPickerModal isOpen={isPickerOpen} accept="audio/*" currentSrc={props.src} title="Set audio"
                onClose={() => setIsPickerOpen(false)} onSave={(src) => { set({ src }); setIsPickerOpen(false); }} />
        </>
    );
};

const Audio: ComponentDefinition<AudioProps> = {
    title: "Audio",
    group: "Media",
    icon: Music,
    tag: "media",
    label: "Audio",
    defaultProps: () => ({ src: "" }),
    fields: [{ key: "src", kind: "text", label: "Audio URL" }],
    render: ({ props, set }) => <AudioRender props={props} set={set} />,
    renderStatic: (props) => (props.src ? `<audio class="pb-el-media" src="${escapeHtml(props.src)}" controls></audio>` : ""),
    css: `.pb-el-media-placeholder { display: flex; align-items: center; justify-content: center; padding: 24px; border: 1px dashed var(--border-color); border-radius: 8px; font-size: 12px; color: var(--text-muted-color); cursor: pointer; }`,
};

export default Audio;