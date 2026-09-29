import { LayoutPanelTop } from "lucide-react";
import type { ComponentDefinition } from "@/components/pagebuilder/core/types";

const Section: ComponentDefinition<Record<string, never>> = {
    title: "Section",
    group: "Layout",
    icon: LayoutPanelTop,
    tag: "container",
    label: "Section",
    isContainer: true,
    defaultProps: () => ({}),
    render: () => null,
    renderStatic: () => "",
};

export default Section;