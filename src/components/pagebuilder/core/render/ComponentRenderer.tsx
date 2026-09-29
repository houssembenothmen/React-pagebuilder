"use client";

import { usePageBuilder } from "../context/PageBuilderContext";
import { componentRegistry } from "../registry";
import type { CanvasComponent } from "../types";

const ComponentRenderer = ({ node }: { node: CanvasComponent }) => {
    const { updateComponentProps } = usePageBuilder();
    const def = componentRegistry.get(node.title);

    if (!def || def.isContainer) return null;

    return (
        <>
            {def.render({
                node,
                props: node.props,
                set: (patch) => updateComponentProps(node.id, patch as Record<string, unknown>),
            })}
        </>
    );
};

export default ComponentRenderer;