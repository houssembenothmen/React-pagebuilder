import { Type } from "lucide-react";
import type { ComponentDefinition } from "@/components/pagebuilder/core/types";
import { escapeHtml } from "@/components/pagebuilder/core/utils/escapeHtml";
import EditableText from "@/components/pagebuilder/core/components/EditableText";

interface ParagraphProps { text: string }

const Paragraph: ComponentDefinition<ParagraphProps> = {
    title: "Paragraph",
    group: "Typography",
    icon: Type,
    tag: "text",
    label: "Paragraph",
    supportsTypography: true,
    defaultProps: () => ({ text: "This is a paragraph of body text. Click to edit." }),
    fields: [{ key: "text", kind: "textarea", label: "Text" }],
    render: ({ props, set }) => (
        <EditableText as="p" className="pb-el-paragraph" value={props.text} onChange={(text) => set({ text })} />
    ),
    renderStatic: (props) => `<p class="pb-el-paragraph">${escapeHtml(props.text)}</p>`,
    css: `.pb-el-paragraph { line-height: 1.5; outline: none; }`,
};

export default Paragraph;