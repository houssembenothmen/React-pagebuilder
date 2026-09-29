// library/forms/radio/index.tsx
import { CircleDot } from "lucide-react";
import type { ComponentDefinition } from "@/components/pagebuilder/core/types";
import { escapeHtml } from "@/components/pagebuilder/core/utils/escapeHtml";
import EditableText from "@/components/pagebuilder/core/components/EditableText";

interface RadioProps { label: string; options: string[]; name: string }

const Radio: ComponentDefinition<RadioProps> = {
    title: "Radio",
    group: "Forms",
    icon: CircleDot,
    tag: "form",
    label: "Radio Group",
    defaultProps: () => ({ label: "Choose one", options: ["Option A", "Option B"], name: "choice" }),
    fields: [
        { key: "label", kind: "text", label: "Label" },
        { key: "options", kind: "stringList", label: "Options" },
        { key: "name", kind: "text", label: "Field name" },
    ],
    render: ({ node, props, set }) => (
        <div className="pb-el-radio-group">
            <EditableText value={props.label} onChange={(label) => set({ label })} />
            {props.options.map((opt, i) => (
                <label key={i}>
                    <input type="radio" name={props.name || node.id} onClick={(e) => e.stopPropagation()} />
                    <EditableText
                        value={opt}
                        onChange={(text) => {
                            const options = [...props.options];
                            options[i] = text;
                            set({ options });
                        }}
                    />
                </label>
            ))}
        </div>
    ),
    renderStatic: (props, node) =>
        `<div class="pb-el-radio-group">${escapeHtml(props.label)}${props.options
            .map((o) => `<label><input type="radio" name="${escapeHtml(props.name || node.id)}" />${escapeHtml(o)}</label>`)
            .join("")}</div>`,
    css: `
.pb-el-radio-group { display: flex; flex-direction: column; gap: 6px; }
.pb-el-radio-group label { display: flex; align-items: center; gap: 6px; font-size: 13px; }
`,
};

export default Radio;