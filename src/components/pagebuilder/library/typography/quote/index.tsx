import { Quote as QuoteIcon } from "lucide-react";
import type { ComponentDefinition } from "@/components/pagebuilder/core/types";
import { escapeHtml } from "@/components/pagebuilder/core/utils/escapeHtml";
import EditableText from "@/components/pagebuilder/core/components/EditableText";

interface QuoteProps { text: string; author: string }

const Quote: ComponentDefinition<QuoteProps> = {
    title: "Quote",
    group: "Typography",
    icon: QuoteIcon,
    tag: "text",
    label: "Quote",
    supportsTypography: true,
    defaultProps: () => ({ text: "This is an inspiring quote.", author: "Author Name" }),
    fields: [
        { key: "text", kind: "textarea", label: "Text" },
        { key: "author", kind: "text", label: "Author" },
    ],
    render: ({ props, set }) => (
        <blockquote className="pb-el-quote">
            <EditableText as="p" value={props.text} onChange={(text) => set({ text })} />
            <EditableText as="cite" value={props.author} onChange={(author) => set({ author })} />
        </blockquote>
    ),
    renderStatic: (props) => `<blockquote class="pb-el-quote"><p>${escapeHtml(props.text)}</p>${escapeHtml(props.author)}</blockquote>`,
    css: `
.pb-el-quote { border-left: 3px solid var(--primary-color); padding-left: 12px; font-style: italic; }
.pb-el-quote cite { display: block; margin-top: 6px; font-size: 12px; font-style: normal; color: var(--text-muted-color); }
`,
};

export default Quote;