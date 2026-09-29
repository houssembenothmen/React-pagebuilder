// library/forms/checkbox/index.tsx
import { CheckSquare } from "lucide-react";
import type { ComponentDefinition } from "@/components/pagebuilder/core/types";
import { escapeHtml } from "@/components/pagebuilder/core/utils/escapeHtml";
import EditableText from "@/components/pagebuilder/core/components/EditableText";

interface CheckboxProps { label: string; name: string }

const Checkbox: ComponentDefinition<CheckboxProps> = {
    title: "Checkbox",
    group: "Forms",
    icon: CheckSquare,
    tag: "form",
    label: "Checkbox",
    defaultProps: () => ({ label: "I agree to the terms", name: "agree" }),
    fields: [
        { key: "label", kind: "text", label: "Label" },
        { key: "name", kind: "text", label: "Field name" },
    ],
    render: ({ props, set }) => (
        <label className="pb-el-checkbox">
            <input type="checkbox" name={props.name} onClick={(e) => e.stopPropagation()} />
            <EditableText value={props.label} onChange={(label) => set({ label })} />
        </label>
    ),
    renderStatic: (props) => `<label class="pb-el-checkbox"><input type="checkbox" name="${escapeHtml(props.name)}" />${escapeHtml(props.label)}</label>`,
    css: `.pb-el-checkbox { display: flex; align-items: center; gap: 6px; font-size: 13px; }`,
};

export default Checkbox;