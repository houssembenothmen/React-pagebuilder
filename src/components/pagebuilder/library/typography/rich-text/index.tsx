import { PenLine } from "lucide-react";
import type { ComponentDefinition } from "@/components/pagebuilder/core/types";
import RichTextBlock from "./RichTextBlock";

interface RichTextProps {
    html: string;
}

const RichText: ComponentDefinition<RichTextProps> = {
    title: "Rich Text",
    group: "Typography",
    icon: PenLine,
    tag: "rich-text",
    label: "Rich Text",
    defaultProps: () => ({ html: "" }),
    fields: [], // rich text is edited inline, not via a field panel
    render: ({ props, set }) => (
        <RichTextBlock
            html={props.html}
            onChange={(html) => set({ html })}
        />
    ),
    renderStatic: (props) => `<div class="pb-el-richtext">${props.html ?? ""}</div>`,
};

export default RichText;