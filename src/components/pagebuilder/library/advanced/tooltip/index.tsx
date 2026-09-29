import { Eye } from "lucide-react";
import type { ComponentDefinition } from "@/components/pagebuilder/core/types";
import { escapeHtml } from "@/components/pagebuilder/core/utils/escapeHtml";
import EditableText from "@/components/pagebuilder/core/components/EditableText";

interface TooltipProps { text: string; tooltip: string }

const Tooltip: ComponentDefinition<TooltipProps> = {
    title: "Tooltip",
    group: "Advanced",
    icon: Eye,
    tag: "advanced",
    label: "Tooltip",
    defaultProps: () => ({ text: "Hover me", tooltip: "Tooltip text" }),
    fields: [
        { key: "text", kind: "text", label: "Text" },
        { key: "tooltip", kind: "text", label: "Tooltip" },
    ],
    render: ({ props, set }) => (
        <span className="pb-el-tooltip" title={props.tooltip}>
            <EditableText value={props.text} onChange={(text) => set({ text })} />
        </span>
    ),
    renderStatic: (props) => `<span class="pb-el-tooltip" title="${escapeHtml(props.tooltip)}">${escapeHtml(props.text)}</span>`,
    css: `.pb-el-tooltip { border-bottom: 1px dotted var(--text-muted-color); cursor: help; }`,
};

export default Tooltip;