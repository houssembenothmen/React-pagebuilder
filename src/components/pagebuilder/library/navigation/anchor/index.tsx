import { MapPin } from "lucide-react";
import type { ComponentDefinition } from "@/components/pagebuilder/core/types";
import { escapeHtml } from "@/components/pagebuilder/core/utils/escapeHtml";
import EditableText from "@/components/pagebuilder/core/components/EditableText";

interface AnchorProps { text: string; href: string }

const Anchor: ComponentDefinition<AnchorProps> = {
    title: "Anchor",
    group: "Navigation",
    icon: MapPin,
    tag: "nav",
    label: "Anchor",
    defaultProps: () => ({ text: "Jump to section", href: "#" }),
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
};

export default Anchor;