import { Megaphone } from "lucide-react";
import type { ComponentDefinition } from "@/components/pagebuilder/core/types";
import { escapeHtml } from "@/components/pagebuilder/core/utils/escapeHtml";
import EditableText from "@/components/pagebuilder/core/components/EditableText";

interface CtaBannerProps { title: string; text: string; buttonText: string }

const CtaBanner: ComponentDefinition<CtaBannerProps> = {
    title: "CTA Banner",
    group: "Typography",
    icon: Megaphone,
    tag: "interactive",
    label: "CTA Banner",
    supportsTypography: true,
    defaultProps: () => ({ title: "Ready to get started?", text: "Join us today.", buttonText: "Get Started" }),
    fields: [
        { key: "title", kind: "text", label: "Title" },
        { key: "text", kind: "textarea", label: "Text" },
        { key: "buttonText", kind: "text", label: "Button text" },
    ],
    render: ({ props, set }) => (
        <div className="pb-el-cta">
            <EditableText as="h3" value={props.title} onChange={(title) => set({ title })} />
            <EditableText as="p" value={props.text} onChange={(text) => set({ text })} />
            <span className="pb-el-button">
                <EditableText value={props.buttonText} onChange={(buttonText) => set({ buttonText })} />
            </span>
        </div>
    ),
    renderStatic: (props) =>
        `<div class="pb-el-cta"><h3>${escapeHtml(props.title)}</h3><p>${escapeHtml(props.text)}</p><span class="pb-el-button">${escapeHtml(props.buttonText)}</span></div>`,
    css: `
.pb-el-cta { text-align: center; padding: 24px; background: var(--surface-hover-color); border-radius: 8px; }
.pb-el-cta h3 { margin-bottom: 6px; }
.pb-el-cta p { margin-bottom: 12px; color: var(--text-muted-color); }
`,
};

export default CtaBanner;