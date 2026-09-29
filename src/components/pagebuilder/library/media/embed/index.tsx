import { Frame } from "lucide-react";
import type { ComponentDefinition } from "@/components/pagebuilder/core/types";

interface EmbedProps { html: string }

const Embed: ComponentDefinition<EmbedProps> = {
    title: "Embed",
    group: "Media",
    icon: Frame,
    tag: "media",
    label: "Embed",
    defaultProps: () => ({ html: "<p>Embed code goes here</p>" }),
    fields: [{ key: "html", kind: "textarea", label: "HTML" }],
    render: ({ props }) => <div className="pb-el-embed" dangerouslySetInnerHTML={{ __html: props.html }} />,
    renderStatic: (props) => `<div class="pb-el-embed">${props.html}</div>`,
    css: `.pb-el-embed { font-size: 13px; }`,
};

export default Embed;