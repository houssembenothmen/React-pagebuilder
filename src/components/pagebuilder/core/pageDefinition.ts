import { LayoutTemplate } from "lucide-react";
import type { ComponentDefinition } from "./types";
import { defaultPageProps, type PageProps } from "./page";

export const PageDefinition: ComponentDefinition<PageProps> = {
    title: "Page",
    group: "Page",
    icon: LayoutTemplate,
    tag: "page",
    label: "Page",
    hidden: true,
    supportsTypography: true, // text colour / font on the page are inherited by everything inside
    defaultProps: defaultPageProps,
    fields: [
        { key: "direction", kind: "select", label: "Direction", options: ["column", "row"] },
        { key: "gap", kind: "number", label: "Gap between elements (px)", min: 0, max: 200 },
        { key: "align", kind: "select", label: "Page alignment", options: ["center", "left", "right"] },
        { key: "alignItems", kind: "select", label: "Align items", options: ["stretch", "flex-start", "center", "flex-end"] },
        { key: "justifyContent", kind: "select", label: "Justify content", options: ["flex-start", "center", "flex-end", "space-between", "space-around"] },
    ],
    render: () => null,
    renderStatic: () => "",
};