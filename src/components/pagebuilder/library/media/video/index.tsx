// library/media/video/index.tsx
"use client";
import { useState } from "react";
import { Video as VideoIcon } from "lucide-react";
import type { ComponentDefinition } from "@/components/pagebuilder/core/types";
import { escapeHtml } from "@/components/pagebuilder/core/utils/escapeHtml";
import { MediaPickerModal } from "../MediaPickerModal";

interface VideoProps { src: string }

const VideoRender = ({ props, set }: { props: VideoProps; set: (p: Partial<VideoProps>) => void }) => {
    const [isPickerOpen, setIsPickerOpen] = useState(false);
    return props.src ? (
        <video
            className="pb-el-media"
            src={props.src}
            controls
            onClick={(e) => e.stopPropagation()}
            onDoubleClick={(e) => { e.stopPropagation(); setIsPickerOpen(true); }}
        >
            <MediaPickerModal isOpen={isPickerOpen} accept="video/*" currentSrc={props.src} title="Set video"
                onClose={() => setIsPickerOpen(false)} onSave={(src) => { set({ src }); setIsPickerOpen(false); }} />
        </video>
    ) : (
        <div className="pb-el-media-placeholder" onDoubleClick={(e) => { e.stopPropagation(); setIsPickerOpen(true); }}>
            Set video source
            <MediaPickerModal isOpen={isPickerOpen} accept="video/*" currentSrc={props.src} title="Set video"
                onClose={() => setIsPickerOpen(false)} onSave={(src) => { set({ src }); setIsPickerOpen(false); }} />
        </div>
    );
};

const Video: ComponentDefinition<VideoProps> = {
    title: "Video",
    group: "Media",
    icon: VideoIcon,
    tag: "media",
    label: "Video",
    defaultProps: () => ({ src: "" }),
    fields: [{ key: "src", kind: "text", label: "Video URL" }],
    render: ({ props, set }) => <VideoRender props={props} set={set} />,
    renderStatic: (props) => (props.src ? `<video class="pb-el-media" src="${escapeHtml(props.src)}" controls></video>` : ""),
    css: `
.pb-el-media { width: 100%; border-radius: 8px; }
.pb-el-media-placeholder { display: flex; align-items: center; justify-content: center; padding: 24px; border: 1px dashed var(--border-color); border-radius: 8px; font-size: 12px; color: var(--text-muted-color); cursor: pointer; }
`,
};

export default Video;