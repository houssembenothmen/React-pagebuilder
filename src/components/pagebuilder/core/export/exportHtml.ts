// core/export/exportHtml.ts
import type { CanvasComponent } from "../types";
import { componentRegistry } from "../registry";
import { CORE_EXPORT_CSS } from "./exportStyles";
import { layoutToCssString } from "../utils/layoutStyle";

const renderNode = (node: CanvasComponent): string => {
    const def = componentRegistry.get(node.title);
    if (!def) return "";

    const layoutCss = layoutToCssString(node.layout);

    if (def.isContainer) {
        const children = (node.children ?? []).map(renderNode).join("");
        const style = `${def.containerStaticStyle?.(node.props) ?? ""}${def.itemPlacementStaticStyle?.(node.props) ?? ""}${layoutCss}`;
        return `<div class="pb-el-container" style="${style}">${children}</div>`;
    }

    const html = def.renderStatic(node.props, node);
    if (!layoutCss) return html;
    return `<div class="pb-el-layout-wrap" style="${layoutCss}">${html}</div>`;
};

export function buildExportHtml(items: CanvasComponent[]): string {
    const body = items.map(renderNode).join("\n");

    // Only collect JS from components actually present on the page — no
    // point shipping Countdown's interval loop if no Countdown was added.
    const usedTitles = new Set<string>();
    const collectTitles = (nodes: CanvasComponent[]) =>
        nodes.forEach((n) => {
            usedTitles.add(n.title);
            if (n.children) collectTitles(n.children);
        });
    collectTitles(items);

    const js = componentRegistry
        .getAll()
        .filter((d) => usedTitles.has(d.title) && d.js)
        .map((d) => d.js)
        .join("\n");

    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Exported Page</title>
<style>${CORE_EXPORT_CSS}
${componentRegistry.allCss()}</style>
</head>
<body>
<div class="pb-export">
${body}
</div>
${js ? `<script>${js}</script>` : ""}
</body>
</html>
`;
}
