import { Rows3 } from "lucide-react";
import type { ComponentDefinition } from "@/components/pagebuilder/core/types";

const Row: ComponentDefinition<Record<string, never>> = {
    title: "Row",
    group: "Layout",
    icon: Rows3,
    tag: "container",
    label: "Row",
    isContainer: true,
    allowedChildren: ["Column"],
    defaultProps: () => ({}),
    containerStyle: () => ({ display: "flex", flexDirection: "row", gap: 12, flexWrap: "wrap" }),
    containerStaticStyle: () => "display:flex;flex-direction:row;gap:12px;flex-wrap:wrap;",
    render: () => null,
    renderStatic: () => "",
};

export default Row;