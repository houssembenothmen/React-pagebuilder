// components/pagebuilder/renderer/PageRenderer.tsx
import { componentRegistry } from "../core/registry";
import { coreLibrary } from "../library";
import { CORE_EXPORT_CSS } from "../core/export/exportStyles";
import { layoutToCssObject } from "../core/utils/layoutStyle";
import type { CanvasComponent } from "../core/types";
import { runtime } from "./runtime";
import type { CSSProperties } from "react";
import { computePageStyles, type PageSettings } from "../core/page";

componentRegistry.registerAll(coreLibrary);

function RenderNode({ node }: { node: CanvasComponent }) {
    const def = componentRegistry.get(node.title);
    if (!def) return null;

    const layout = layoutToCssObject(node.layout);

    if (def.isContainer) {
        // Same merge order as exportHtml.ts so editor, HTML export and this stay consistent.
        const style = {
            ...def.containerStyle?.(node.props),
            ...def.itemPlacementStyle?.(node.props),
            ...layout,
        };
        return (
            <div className="pb-el-container" style={style}>
                {(node.children ?? []).map((c) => (
                    <RenderNode key={c.id} node={c} />
                ))}
            </div>
        );
    }

    const Real = runtime[node.title];
    if (Real) {
        return (
            <div className="pb-el-layout-wrap" style={layout}>
                <Real {...node.props} />
            </div>
        );
    }

    // Fallback: reuse the static HTML from the definition
    return (
        <div
            className="pb-el-layout-wrap"
            style={layout}
            dangerouslySetInnerHTML={{
                __html: def.renderStatic(node.props, node),
            }}
        />
    );
}

export function PageRenderer({
    nodes,
    page,
}: {
    nodes: CanvasComponent[];
    page?: PageSettings;
}) {
    const { frame, flow } = computePageStyles(page?.props, page?.layout);

    const used = new Set<string>();
    const walk = (ns: CanvasComponent[]) =>
        ns.forEach((n) => {
            used.add(n.title);
            if (n.children) walk(n.children);
        });
    walk(nodes);

    const js = componentRegistry
        .getAll()
        .filter((d) => used.has(d.title) && d.js)
        .map((d) => d.js)
        .join("\n");

    return (
        <>
            <style>{`${CORE_EXPORT_CSS}\n${componentRegistry.allCss()}`}</style>
            <div
                className="pb-export"
                style={{ ...flow, ...frame } as CSSProperties}
            >
                {nodes.map((n) => (
                    <RenderNode key={n.id} node={n} />
                ))}
            </div>
            {js && <script dangerouslySetInnerHTML={{ __html: js }} />}
        </>
    );
}
