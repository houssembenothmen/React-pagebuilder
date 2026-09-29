// library/forms/phone/index.tsx
import { Phone as PhoneIcon } from "lucide-react";
import type { ComponentDefinition } from "@/components/pagebuilder/core/types";
import { escapeHtml } from "@/components/pagebuilder/core/utils/escapeHtml";
import EditableText from "@/components/pagebuilder/core/components/EditableText";

interface PhoneProps { label: string; placeholder: string; name: string }

const Phone: ComponentDefinition<PhoneProps> = {
    title: "Phone",
    group: "Forms",
    icon: PhoneIcon,
    tag: "form",
    label: "Phone",
    defaultProps: () => ({ label: "Phone", placeholder: "+1 (555) 000-0000", name: "phone" }),
    fields: [
        { key: "label", kind: "text", label: "Label" },
        { key: "placeholder", kind: "text", label: "Placeholder" },
        { key: "name", kind: "text", label: "Field name" },
    ],
    render: ({ props, set }) => (
        <label className="pb-el-field">
            <EditableText value={props.label} onChange={(label) => set({ label })} />
            <input type="tel" name={props.name} placeholder={props.placeholder} onClick={(e) => e.stopPropagation()} />
        </label>
    ),
    renderStatic: (props) =>
        `<label class="pb-el-field">${escapeHtml(props.label)}<input type="tel" name="${escapeHtml(props.name)}" placeholder="${escapeHtml(props.placeholder)}" /></label>`,
};

export default Phone;