import { AlignVerticalSpaceAround } from "lucide-react";
import type { ComponentDefinition } from "@/components/pagebuilder/core/types";

interface SpacerProps { height: number }

const Spacer: ComponentDefinition<SpacerProps> = {
    title: "Spacer",
    group: "Layout",
    icon: AlignVerticalSpaceAround,
    tag: "decorative",
    label: "Spacer",
    defaultProps: () => ({ height: 40 }),
    fields: [{ key: "height", kind: "number", label: "Height (px)", min: 0, max: 400 }],
    render: ({ props }) => <div className="pb-el-spacer" style={{ height: props.height }} />,
    renderStatic: (props) => `<div class="pb-el-spacer" style="height:${props.height}px"></div>`,
    css: `.pb-el-spacer { width: 100%; }`,
};

export default Spacer;