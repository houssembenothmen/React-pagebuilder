import { BarChart3 } from "lucide-react";
import type { ComponentDefinition } from "@/components/pagebuilder/core/types";

interface ChartProps { data: number[] }

const Chart: ComponentDefinition<ChartProps> = {
    title: "Chart",
    group: "Advanced",
    icon: BarChart3,
    tag: "advanced",
    label: "Chart",
    defaultProps: () => ({ data: [40, 65, 30, 80, 55] }),
    fields: [{ key: "data", kind: "numberList", label: "Values" }],
    render: ({ props }) => (
        <div className="pb-el-chart">
            {props.data.map((v, i) => <div key={i} className="pb-el-chart-bar" style={{ height: `${v}%` }} />)}
        </div>
    ),
    renderStatic: (props) => `<div class="pb-el-chart">${props.data.map((v) => `<div class="pb-el-chart-bar" style="height:${v}%"></div>`).join("")}</div>`,
    css: `
.pb-el-chart { display: flex; align-items: flex-end; gap: 6px; height: 100px; }
.pb-el-chart-bar { flex: 1; background: var(--primary-color); border-radius: 2px 2px 0 0; }
`,
};

export default Chart;