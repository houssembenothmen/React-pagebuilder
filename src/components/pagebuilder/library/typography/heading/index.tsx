import { Heading1 } from "lucide-react";
import type { ComponentDefinition } from "@/components/pagebuilder/core/types";
import { escapeHtml } from "@/components/pagebuilder/core/utils/escapeHtml";
import EditableText from "@/components/pagebuilder/core/components/EditableText";

interface HeadingProps { text: string; level: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" }

const Heading: ComponentDefinition<HeadingProps> = {
    title: "Heading",
    group: "Typography",
    icon: Heading1,
    tag: "text",
    label: "Heading",
    supportsTypography: true,
    defaultProps: () => ({ text: "Heading text", level: "h2" }),
    fields: [
        { key: "text", kind: "text", label: "Text" },
        { key: "level", kind: "select", label: "Level", options: ["h1", "h2", "h3", "h4", "h5", "h6"] },
    ],
    render: ({ props, set }) => (
        <EditableText as={props.level} className="pb-el-heading" value={props.text} onChange={(text) => set({ text })} />
    ),
    renderStatic: (props) => `<${props.level} class="pb-el-heading">${escapeHtml(props.text)}</${props.level}>`,
    css: `.pb-el-heading { font-weight: 600; outline: none; }`,
};

export default Heading;