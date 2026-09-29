import { Home } from "lucide-react";
import type { ComponentDefinition } from "@/components/pagebuilder/core/types";
import { escapeHtml } from "@/components/pagebuilder/core/utils/escapeHtml";
import EditableText from "@/components/pagebuilder/core/components/EditableText";

interface HomeLinkProps { text: string; href: string }

const HomeLink: ComponentDefinition<HomeLinkProps> = {
    title: "Home Link",
    group: "Navigation",
    icon: Home,
    tag: "nav",
    label: "Home Link",
    defaultProps: () => ({ text: "Home", href: "/" }),
    fields: [
        { key: "text", kind: "text", label: "Text" },
        { key: "href", kind: "text", label: "Link" },
    ],
    render: ({ props, set }) => (
        <a className="pb-el-link" href={props.href} onClick={(e) => e.preventDefault()}>
            <EditableText value={props.text} onChange={(text) => set({ text })} />
        </a>
    ),
    renderStatic: (props) => `<a class="pb-el-link" href="${escapeHtml(props.href)}">${escapeHtml(props.text)}</a>`,
    css: `.pb-el-link { color: var(--primary-color); font-size: 13px; }`,
};

export default HomeLink;