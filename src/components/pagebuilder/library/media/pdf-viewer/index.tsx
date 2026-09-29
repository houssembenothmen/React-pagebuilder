// library/media/pdf-viewer/index.tsx
"use client";
import { useState } from "react";
import { FileText } from "lucide-react";
import type { ComponentDefinition } from "@/components/pagebuilder/core/types";
import { escapeHtml } from "@/components/pagebuilder/core/utils/escapeHtml";
import { MediaPickerModal } from "../MediaPickerModal";

interface PdfViewerProps { src: string }

const PdfRender = ({ props, set }: { props: PdfViewerProps; set: (p: Partial<PdfViewerProps>) => void }) => {
    const [isPickerOpen, setIsPickerOpen] = useState(false);
    return (
        <>
            {props.src ? (
                <iframe className="pb-el-media" src={props.src} onDoubleClick={(e) => { e.stopPropagation(); setIsPickerOpen(true); }} />
            ) : (
                <div className="pb-el-media-placeholder" onDoubleClick={(e) => { e.stopPropagation(); setIsPickerOpen(true); }}>
                    Set PDF source
                </div>
            )}
            <MediaPickerModal isOpen={isPickerOpen} accept="application/pdf" currentSrc={props.src} title="Set PDF"
                onClose={() => setIsPickerOpen(false)} onSave={(src) => { set({ src }); setIsPickerOpen(false); }} />
        </>
    );
};

const PdfViewer: ComponentDefinition<PdfViewerProps> = {
    title: "PDF Viewer",
    group: "Media",
    icon: FileText,
    tag: "media",
    label: "PDF Viewer",
    defaultProps: () => ({ src: "" }),
    fields: [{ key: "src", kind: "text", label: "PDF URL" }],
    render: ({ props, set }) => <PdfRender props={props} set={set} />,
    renderStatic: (props) => (props.src ? `<iframe class="pb-el-media" src="${escapeHtml(props.src)}"></iframe>` : ""),
    css: `.pb-el-media-placeholder { display: flex; align-items: center; justify-content: center; padding: 24px; border: 1px dashed var(--border-color); border-radius: 8px; font-size: 12px; color: var(--text-muted-color); cursor: pointer; }`,
};

export default PdfViewer;