import { Columns3 } from "lucide-react";
import type { ComponentDefinition } from "@/components/pagebuilder/core/types";

interface ColumnProps { span: number }

// `span` is a CSS Grid track span. Meaningful when this Column sits directly
// inside a Grid; a harmless no-op in any other parent (Row, root, etc).
const Column: ComponentDefinition<ColumnProps> = {
    title: "Column",
    group: "Layout",
    icon: Columns3,
    tag: "container",
    label: "Column",
    isContainer: true,
    defaultProps: () => ({ span: 1 }),
    fields: [{ key: "span", kind: "number", label: "Grid span", min: 1, max: 12 }],
    containerStyle: () => ({ display: "flex", flexDirection: "column", gap: 12 }),
    containerStaticStyle: () => "display:flex;flex-direction:column;gap:12px;",
    itemPlacementStyle: (props) => (props.span > 1 ? { gridColumn: `span ${props.span}` } : undefined),
    itemPlacementStaticStyle: (props) => (props.span > 1 ? `grid-column:span ${props.span};` : ""),
    render: () => null,
    renderStatic: () => "",
};

export default Column;