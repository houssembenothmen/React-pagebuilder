import { RectangleHorizontal } from "lucide-react";
import type { ComponentDefinition } from "@/components/pagebuilder/core/types";
import { escapeHtml } from "@/components/pagebuilder/core/utils/escapeHtml";
import EditableText from "@/components/pagebuilder/core/components/EditableText";

interface ButtonProps { text: string; href: string }

const Button: ComponentDefinition<ButtonProps> = {
    title: "Button",
    group: "Typography",
    icon: RectangleHorizontal,
    tag: "interactive",
    label: "Button",
    supportsTypography: true,
    defaultProps: () => ({ text: "Click me", href: "#" }),
    fields: [
        { key: "text", kind: "text", label: "Text" },
        { key: "href", kind: "text", label: "Link" },
    ],
    render: ({ props, set }) => (
        <button className="pb-el-button" onClick={(e) => e.stopPropagation()}>
            <EditableText value={props.text} onChange={(text) => set({ text })} />
        </button>
    ),
    renderStatic: (props) => `<a class="pb-el-button" href="${escapeHtml(props.href)}">${escapeHtml(props.text)}</a>`,
    css: `.pb-el-button { display: inline-block; padding: 8px 16px; background: var(--primary-color); color: var(--surface-color); border-radius: 6px; font-size: 13px; font-weight: 500; }`,
};

export default Button;