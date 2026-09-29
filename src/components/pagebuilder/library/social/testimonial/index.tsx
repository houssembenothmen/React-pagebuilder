import { MessageCircle } from "lucide-react";
import type { ComponentDefinition } from "@/components/pagebuilder/core/types";
import { escapeHtml } from "@/components/pagebuilder/core/utils/escapeHtml";
import EditableText from "@/components/pagebuilder/core/components/EditableText";

interface TestimonialProps { text: string; author: string }

const Testimonial: ComponentDefinition<TestimonialProps> = {
    title: "Testimonial",
    group: "Social",
    icon: MessageCircle,
    tag: "social",
    label: "Testimonial",
    defaultProps: () => ({ text: "This product changed the way we work!", author: "Happy Customer" }),
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
};

export default Testimonial;