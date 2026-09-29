"use client";

import { type CSSProperties, type DragEvent, useState } from "react";
import { useTranslations } from "next-intl";
import { DND_TYPES, type DropPosition } from "../dnd";
import { usePageBuilder } from "../context/PageBuilderContext";
import { componentRegistry } from "../registry";
import type { CanvasComponent } from "../types";
import CanvasNode from "./CanvasNode";

interface DropZoneProps {
    parentId: string | null;
    items: CanvasComponent[];
    empty?: boolean;
    style?: CSSProperties;
}

interface HoverState {
    index: number;
    position: DropPosition;
}

const getItemPlacementStyle = (item: CanvasComponent): CSSProperties | undefined => {
    const def = componentRegistry.get(item.title);
    return def?.itemPlacementStyle?.(item.props);
};

const DropZone = ({ parentId, items, empty, style }: DropZoneProps) => {
    const t = useTranslations("pagebuilder");
    const { addComponent, moveComponent } = usePageBuilder();
    const [hover, setHover] = useState<HoverState | null>(null);
    const [zoneActive, setZoneActive] = useState(false);

    const resolveTargetIndex = (): number => {
        if (!hover) return items.length;
        return hover.position === "before" ? hover.index : hover.index + 1;
    };

    const handleRowDragOver = (e: DragEvent<HTMLDivElement>, index: number) => {
        e.preventDefault();
        e.stopPropagation();
        e.dataTransfer.dropEffect = e.dataTransfer.types.includes(DND_TYPES.canvasItem) ? "move" : "copy";
        const rect = e.currentTarget.getBoundingClientRect();
        const position: DropPosition = e.clientY - rect.top < rect.height / 2 ? "before" : "after";
        setHover({ index, position });
        setZoneActive(true);
    };

    const handleZoneDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = e.dataTransfer.types.includes(DND_TYPES.canvasItem) ? "move" : "copy";
        if (items.length === 0) setHover({ index: 0, position: "after" });
        setZoneActive(true);
    };

    const handleZoneDragLeave = (e: DragEvent<HTMLDivElement>) => {
        const next = e.relatedTarget as Node | null;
        if (next && e.currentTarget.contains(next)) return;
        setHover(null);
        setZoneActive(false);
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        const index = resolveTargetIndex();
        setHover(null);
        setZoneActive(false);

        const draggedCanvasItemId = e.dataTransfer.getData(DND_TYPES.canvasItem);
        if (draggedCanvasItemId) {
            moveComponent(draggedCanvasItemId, parentId, index);
            return;
        }

        const droppedTitle = e.dataTransfer.getData(DND_TYPES.sidebarComponent);
        if (droppedTitle && componentRegistry.get(droppedTitle)) {
            addComponent(droppedTitle, parentId, index);
        }
    };

    return (
        <div
            className={`pb-drop-zone${empty ? " pb-drop-zone-empty" : ""}${zoneActive ? " pb-drop-zone-active" : ""}`}
            style={style}
            onDragOver={handleZoneDragOver}
            onDragLeave={handleZoneDragLeave}
            onDrop={handleDrop}
        >
            {items.length === 0 && empty && (
                <div className="pb-canvas-empty">
                    <p>{t("canvas.dropHint")}</p>
                </div>
            )}

            {items.length === 0 && hover && <div className="pb-drop-line pb-drop-line-empty" />}

            {items.map((item, index) => (
                <div
                    key={item.id}
                    className="pb-drop-row"
                    style={getItemPlacementStyle(item)}
                    onDragOver={(e) => handleRowDragOver(e, index)}
                >
                    {hover?.index === index && hover.position === "before" && <div className="pb-drop-line" />}
                    <CanvasNode node={item} />
                    {hover?.index === index && hover.position === "after" && <div className="pb-drop-line" />}
                </div>
            ))}
        </div>
    );
};

export default DropZone;