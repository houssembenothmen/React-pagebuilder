// library/forms/password/index.tsx
import { Lock } from "lucide-react";
import type { ComponentDefinition } from "@/components/pagebuilder/core/types";
import { escapeHtml } from "@/components/pagebuilder/core/utils/escapeHtml";
import EditableText from "@/components/pagebuilder/core/components/EditableText";

interface PasswordProps { label: string; name: string }

const Password: ComponentDefinition<PasswordProps> = {
    title: "Password",
    group: "Forms",
    icon: Lock,
    tag: "form",
    label: "Password",
    defaultProps: () => ({ label: "Password", name: "password" }),
    fields: [
        { key: "label", kind: "text", label: "Label" },
        { key: "name", kind: "text", label: "Field name" },
    ],
    render: ({ props, set }) => (
        <label className="pb-el-field">
            <EditableText value={props.label} onChange={(label) => set({ label })} />
            <input type="password" name={props.name} onClick={(e) => e.stopPropagation()} />
        </label>
    ),
    renderStatic: (props) => `<label class="pb-el-field">${escapeHtml(props.label)}<input type="password" name="${escapeHtml(props.name)}" /></label>`,
};

export default Password;