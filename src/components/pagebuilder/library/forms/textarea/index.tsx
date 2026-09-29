// library/forms/textarea/index.tsx
import { FileEdit } from "lucide-react";
import type { ComponentDefinition } from "@/components/pagebuilder/core/types";
import { escapeHtml } from "@/components/pagebuilder/core/utils/escapeHtml";
import EditableText from "@/components/pagebuilder/core/components/EditableText";

interface TextareaProps { label: string; placeholder: string; name: string }

const TextareaField: ComponentDefinition<TextareaProps> = {
    title: "Textarea",
    group: "Forms",
    icon: FileEdit,
    tag: "form",
    label: "Textarea",
    defaultProps: () => ({ label: "Message", placeholder: "Enter your message...", name: "message" }),
    fields: [
        { key: "label", kind: "text", label: "Label" },
        { key: "placeholder", kind: "text", label: "Placeholder" },
        { key: "name", kind: "text", label: "Field name" },
    ],
    render: ({ props, set }) => (
        <label className="pb-el-field">
            <EditableText value={props.label} onChange={(label) => set({ label })} />
            <textarea name={props.name} placeholder={props.placeholder} onClick={(e) => e.stopPropagation()} />
        </label>
    ),
    renderStatic: (props) =>
        `<label class="pb-el-field">${escapeHtml(props.label)}<textarea name="${escapeHtml(props.name)}" placeholder="${escapeHtml(props.placeholder)}"></textarea></label>`,
};

export default TextareaField;