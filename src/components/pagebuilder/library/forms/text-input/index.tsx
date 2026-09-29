// library/forms/text-input/index.tsx
import { FormInput } from "lucide-react";
import type { ComponentDefinition } from "@/components/pagebuilder/core/types";
import { escapeHtml } from "@/components/pagebuilder/core/utils/escapeHtml";
import EditableText from "@/components/pagebuilder/core/components/EditableText";

interface TextInputProps { label: string; placeholder: string; name: string }

const TextInput: ComponentDefinition<TextInputProps> = {
    title: "Text Input",
    group: "Forms",
    icon: FormInput,
    tag: "form",
    label: "Text Input",
    defaultProps: () => ({ label: "Label", placeholder: "Enter text...", name: "field" }),
    fields: [
        { key: "label", kind: "text", label: "Label" },
        { key: "placeholder", kind: "text", label: "Placeholder" },
        { key: "name", kind: "text", label: "Field name" },
    ],
    render: ({ props, set }) => (
        <label className="pb-el-field">
            <EditableText value={props.label} onChange={(label) => set({ label })} />
            <input type="text" name={props.name} placeholder={props.placeholder} onClick={(e) => e.stopPropagation()} />
        </label>
    ),
    renderStatic: (props) =>
        `<label class="pb-el-field">${escapeHtml(props.label)}<input type="text" name="${escapeHtml(props.name)}" placeholder="${escapeHtml(props.placeholder)}" /></label>`,
    css: `
.pb-el-field { display: flex; flex-direction: column; gap: 4px; font-size: 12px; font-weight: 500; }
.pb-el-field input, .pb-el-field textarea { padding: 8px 10px; border: 1px solid var(--border-color); border-radius: 6px; font-size: 13px; }
.pb-el-field input:focus, .pb-el-field textarea:focus { outline: none; border-color: var(--primary-color); }
`,
};

export default TextInput;