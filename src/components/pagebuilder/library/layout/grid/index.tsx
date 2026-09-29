import { Grid3x3 } from "lucide-react";
import type { ComponentDefinition } from "@/components/pagebuilder/core/types";

interface GridProps { columns: number }

const Grid: ComponentDefinition<GridProps> = {
    title: "Grid",
    group: "Layout",
    icon: Grid3x3,
    tag: "container",
    label: "Grid",
    isContainer: true,
    allowedChildren: ["Column", "Card"],
    defaultProps: () => ({ columns: 3 }),
    fields: [{ key: "columns", kind: "number", label: "Columns", min: 1, max: 6 }],
    containerStyle: (props) => ({ display: "grid", gridTemplateColumns: `repeat(${props.columns || 3}, 1fr)`, gap: 12 }),
    containerStaticStyle: (props) => `display:grid;grid-template-columns:repeat(${props.columns || 3}, 1fr);gap:12px;`,
    render: () => null,
    renderStatic: () => "",
};

export default Grid;