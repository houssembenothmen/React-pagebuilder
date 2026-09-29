import { Zap } from "lucide-react";
import type { ComponentDefinition } from "@/components/pagebuilder/core/types";
import { escapeHtml } from "@/components/pagebuilder/core/utils/escapeHtml";
import EditableText from "@/components/pagebuilder/core/components/EditableText";

interface SubmitButtonProps { text: string; name: string }

const SubmitButton: ComponentDefinition<SubmitButtonProps> = {
    title: "Submit Button",
    group: "Forms",
    icon: Zap,
    tag: "form",
    label: "Submit Button",
    defaultProps: () => ({ text: "Submit", name: "submit" }),
    fields: [
        { key: "text", kind: "text", label: "Text" },
        { key: "name", kind: "text", label: "Field name" },
    ],
    render: ({ props, set }) => (
        <button className="pb-el-button" onClick={(e) => e.stopPropagation()}>
            <EditableText value={props.text} onChange={(text) => set({ text })} />
        </button>
    ),
    // Fixed: this used to render an <a href="#">, which does nothing in a real <form>.
    renderStatic: (props) => `<button type="submit" class="pb-el-button" name="${escapeHtml(props.name)}">${escapeHtml(props.text)}</button>`,
};

export default SubmitButton;