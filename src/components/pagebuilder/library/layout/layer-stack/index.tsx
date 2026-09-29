import { Layers } from "lucide-react";
import type { ComponentDefinition } from "@/components/pagebuilder/core/types";

const LayerStack: ComponentDefinition<Record<string, never>> = {
    title: "Layer Stack",
    group: "Layout",
    icon: Layers,
    tag: "container",
    label: "Layer Stack",
    isContainer: true,
    defaultProps: () => ({}),
    containerStyle: () => ({ display: "grid" }),
    containerStaticStyle: () => "display:grid;",
    render: () => null,
    renderStatic: () => "",
};

export default LayerStack;