import { Box } from "lucide-react";
import type { ComponentDefinition } from "@/components/pagebuilder/core/types";

const Container: ComponentDefinition<Record<string, never>> = {
    title: "Container",
    group: "Layout",
    icon: Box,
    tag: "container",
    label: "Container",
    isContainer: true,
    defaultProps: () => ({}),
    render: () => null,
    renderStatic: () => "",
};

export default Container;