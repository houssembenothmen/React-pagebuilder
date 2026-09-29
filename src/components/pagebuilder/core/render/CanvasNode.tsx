"use client";

import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import { usePageBuilder } from "../context/PageBuilderContext";
import { componentRegistry } from "../registry";
import type { CanvasComponent } from "../types";
import ComponentRenderer from "./ComponentRenderer";
import DropZone from "./DropZone";
import { layoutToCssObject } from "../utils/layoutStyle";

const CanvasNode = ({ node }: { node: CanvasComponent }) => {
    const t = useTranslations("pagebuilder");
    const { selectedId, selectComponent, removeComponent } = usePageBuilder();
    const def = componentRegistry.get(node.title);
    const isSelected = selectedId === node.id;
    const label = def
        ? def.labelKey
            ? t(def.labelKey)
            : def.label
        : node.title;

    if (!def) {
        return (
            <div className="pb-canvas-item pb-canvas-item-unknown">
                <div className="pb-canvas-item-toolbar">
                    <span className="pb-canvas-item-label">
                        {label} (unregistered)
                    </span>
                    <button
                        className="pb-canvas-item-remove"
                        onClick={() => removeComponent(node.id)}
                    >
                        <X size={14} />
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div
            className={[
                "pb-canvas-item",
                `pb-type-${node.tag}`,
                def.isContainer ? "pb-container" : "",
                isSelected ? "selected" : "",
            ]
                .filter(Boolean)
                .join(" ")}
            style={layoutToCssObject(node.layout)}
            draggable
            onDragStart={(e) => {
                /* unchanged */
            }}
            onClick={(e) => {
                e.stopPropagation();
                selectComponent(node.id);
            }}
        >
            <div className="pb-canvas-item-toolbar">
                <span className="pb-canvas-item-label">{label}</span>
                <button
                    className="pb-canvas-item-remove"
                    onClick={(e) => {
                        e.stopPropagation();
                        removeComponent(node.id);
                    }}
                    aria-label={t("canvas.remove", { title: label })}
                >
                    <X size={14} />
                </button>
            </div>

            <div className="pb-canvas-item-body">
                <ComponentRenderer node={node} />
            </div>

            {def.isContainer && (
                <DropZone
                    parentId={node.id}
                    items={node.children ?? []}
                    style={def.containerStyle?.(node.props)}
                    empty
                />
            )}
        </div>
    );
};

export default CanvasNode;
