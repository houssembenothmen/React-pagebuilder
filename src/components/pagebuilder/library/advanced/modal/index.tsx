import { MousePointerClick } from "lucide-react";
import type { ComponentDefinition } from "@/components/pagebuilder/core/types";
import { escapeHtml } from "@/components/pagebuilder/core/utils/escapeHtml";
import EditableText from "@/components/pagebuilder/core/components/EditableText";

interface ModalProps { title: string; text: string }

const Modal: ComponentDefinition<ModalProps> = {
    title: "Modal",
    group: "Advanced",
    icon: MousePointerClick,
    tag: "advanced",
    label: "Modal",
    defaultProps: () => ({ title: "Modal title", text: "Modal content goes here." }),
    fields: [
        { key: "title", kind: "text", label: "Title" },
        { key: "text", kind: "textarea", label: "Text" },
    ],
    render: ({ props, set }) => (
        <div className="pb-el-modal">
            <EditableText as="h4" value={props.title} onChange={(t) => set({ title: t })} />
            <EditableText as="p" value={props.text} onChange={(text) => set({ text })} />
        </div>
    ),
    renderStatic: (props) => `<div class="pb-el-modal"><h4>${escapeHtml(props.title)}</h4><p>${escapeHtml(props.text)}</p></div>`,
    css: `.pb-el-modal { padding: 16px; border: 1px solid var(--border-color); border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08); }`,
};

export default Modal;