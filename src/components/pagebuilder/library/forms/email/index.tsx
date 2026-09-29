// library/forms/email/index.tsx
import { Mail } from "lucide-react";
import type { ComponentDefinition } from "@/components/pagebuilder/core/types";
import { escapeHtml } from "@/components/pagebuilder/core/utils/escapeHtml";
import EditableText from "@/components/pagebuilder/core/components/EditableText";

interface EmailProps { label: string; placeholder: string; name: string }

const Email: ComponentDefinition<EmailProps> = {
    title: "Email",
    group: "Forms",
    icon: Mail,
    tag: "form",
    label: "Email",
    defaultProps: () => ({ label: "Email", placeholder: "you@example.com", name: "email" }),
    fields: [
        { key: "label", kind: "text", label: "Label" },
        { key: "placeholder", kind: "text", label: "Placeholder" },
        { key: "name", kind: "text", label: "Field name" },
    ],
    render: ({ props, set }) => (
        <label className="pb-el-field">
            <EditableText value={props.label} onChange={(label) => set({ label })} />
            <input type="email" name={props.name} placeholder={props.placeholder} onClick={(e) => e.stopPropagation()} />
        </label>
    ),
    renderStatic: (props) =>
        `<label class="pb-el-field">${escapeHtml(props.label)}<input type="email" name="${escapeHtml(props.name)}" placeholder="${escapeHtml(props.placeholder)}" /></label>`,
};

export default Email;