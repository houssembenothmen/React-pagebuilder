import { FileEdit } from "lucide-react";
import type { ComponentDefinition } from "@/components/pagebuilder/core/types";
import { escapeHtml } from "@/components/pagebuilder/core/utils/escapeHtml";
import EditableText from "@/components/pagebuilder/core/components/EditableText";

interface TextBlockProps { text: string }

const TextBlock: ComponentDefinition<TextBlockProps> = {
    title: "Text Block",
    group: "Typography",
    icon: FileEdit,
    tag: "text",
    label: "Text Block",
    defaultProps: () => ({ text: "Editable text block. Click to edit this content." }),
    fields: [{ key: "text", kind: "textarea", label: "Text" }],
    render: ({ props, set }) => (
        <EditableText as="div" className="pb-el-text-block" value={props.text} onChange={(text) => set({ text })} />
    ),
    renderStatic: (props) => `<div class="pb-el-text-block">${escapeHtml(props.text)}</div>`,
    css: `.pb-el-text-block { line-height: 1.5; outline: none; }`,
    supportsTypography: true,
};

export default TextBlock;