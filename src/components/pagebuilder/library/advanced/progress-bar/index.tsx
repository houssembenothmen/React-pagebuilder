import { Sparkles } from "lucide-react";
import type { ComponentDefinition } from "@/components/pagebuilder/core/types";

interface ProgressBarProps { value: number }

const ProgressBar: ComponentDefinition<ProgressBarProps> = {
    title: "Progress Bar",
    group: "Advanced",
    icon: Sparkles,
    tag: "advanced",
    label: "Progress Bar",
    defaultProps: () => ({ value: 60 }),
    fields: [{ key: "value", kind: "number", label: "Value (%)", min: 0, max: 100 }],
    render: ({ props }) => (
        <div className="pb-el-progress">
            <div className="pb-el-progress-fill" style={{ width: `${props.value}%` }} />
        </div>
    ),
    renderStatic: (props) => `<div class="pb-el-progress"><div class="pb-el-progress-fill" style="width:${props.value}%"></div></div>`,
    css: `
.pb-el-progress { height: 8px; background: var(--border-color); border-radius: 4px; overflow: hidden; }
.pb-el-progress-fill { height: 100%; background: var(--primary-color); }
`,
};

export default ProgressBar;