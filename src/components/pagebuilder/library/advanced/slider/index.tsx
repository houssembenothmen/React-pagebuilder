import { SlidersHorizontal } from "lucide-react";
import type { ComponentDefinition } from "@/components/pagebuilder/core/types";

interface SliderProps { min: number; max: number; value: number }

const Slider: ComponentDefinition<SliderProps> = {
    title: "Slider",
    group: "Advanced",
    icon: SlidersHorizontal,
    tag: "advanced",
    label: "Slider",
    defaultProps: () => ({ min: 0, max: 100, value: 50 }),
    fields: [
        { key: "min", kind: "number", label: "Min" },
        { key: "max", kind: "number", label: "Max" },
        { key: "value", kind: "number", label: "Value" },
    ],
    render: ({ props, set }) => (
        <input
            className="pb-el-slider"
            type="range"
            min={props.min}
            max={props.max}
            value={props.value}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => set({ value: Number(e.target.value) })}
        />
    ),
    renderStatic: (props) => `<input class="pb-el-slider" type="range" min="${props.min}" max="${props.max}" value="${props.value}" />`,
    css: `.pb-el-slider { width: 100%; }`,
};

export default Slider;