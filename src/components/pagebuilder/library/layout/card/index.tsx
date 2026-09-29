import { Square } from "lucide-react";
import type { ComponentDefinition } from "@/components/pagebuilder/core/types";

const Card: ComponentDefinition<Record<string, never>> = {
    title: "Card",
    group: "Layout",
    icon: Square,
    tag: "container",
    label: "Card",
    isContainer: true,
    defaultProps: () => ({}),
    render: () => null,
    renderStatic: () => "",
};

export default Card;