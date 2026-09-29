import { Tag } from "lucide-react";
import type { ComponentDefinition } from "@/components/pagebuilder/core/types";
import { escapeHtml } from "@/components/pagebuilder/core/utils/escapeHtml";
import EditableText from "@/components/pagebuilder/core/components/EditableText";

interface BadgeProps { text: string }

const Badge: ComponentDefinition<BadgeProps> = {
    title: "Badge",
    group: "Content",
    icon: Tag,
    tag: "decorative",
    label: "Badge",
    defaultProps: () => ({ text: "New" }),
    fields: [{ key: "text", kind: "text", label: "Text" }],
    render: ({ props, set }) => (
        <span className="pb-el-badge">
            <EditableText value={props.text} onChange={(text) => set({ text })} />
        </span>
    ),
    renderStatic: (props) => `<span class="pb-el-badge">${escapeHtml(props.text)}</span>`,
    css: `.pb-el-badge { display: inline-block; padding: 2px 8px; background: var(--primary-color); color: var(--surface-color); border-radius: 999px; font-size: 11px; }`,
};

export default Badge;