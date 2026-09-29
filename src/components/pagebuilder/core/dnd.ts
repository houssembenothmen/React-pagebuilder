export const DND_TYPES = {
    sidebarComponent: "component-type",
    canvasItem: "canvas-item-id",
} as const;

export type DropPosition = "before" | "after" | "inside";

export interface DropIndicator {
    zoneKey: string;
    index: number;
    position: DropPosition;
}