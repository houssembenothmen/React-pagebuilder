import type { ReactNode, CSSProperties } from "react";
import type { LucideIcon } from "lucide-react";

export interface CanvasComponent<P = Record<string, unknown>> {
    id: string;
    title: string;
    tag: string;
    props: P;
    children?: CanvasComponent[];
    layout?: LayoutStyle;
}

export type FieldKind =
    | "text" | "textarea" | "number" | "boolean"
    | "select" | "stringList" | "numberList" | "date";

export interface FieldDef<P = Record<string, unknown>> {
    key: keyof P & string;
    kind: FieldKind;
    label: string;
    labelKey?: string;
    options?: string[];
    min?: number;
    max?: number;
}

export interface RenderArgs<P> {
    node: CanvasComponent<P>;
    props: P;
    set: (patch: Partial<P>) => void;
}

export interface ComponentDefinition<P = Record<string, unknown>> {
    title: string;
    group: string;
    groupLabelKey?: string;
    icon: LucideIcon;
    tag: string;
    label: string;
    labelKey?: string;
    isContainer?: boolean;
    allowedChildren?: string[];
    containerStyle?: (props: P) => CSSProperties;
    containerStaticStyle?: (props: P) => string;
    itemPlacementStyle?: (props: P) => CSSProperties | undefined;
    itemPlacementStaticStyle?: (props: P) => string;
    defaultProps: () => P;
    fields?: FieldDef<P>[];
    render: (args: RenderArgs<P>) => ReactNode;
    renderStatic: (props: P, node: CanvasComponent<P>) => string;
    css?: string;
    js?: string;
    /** Opt-in flag: only components that set this get the Typography section in settings. */
    supportsTypography?: boolean;
}

// ---------------------------------------------------------------------------
// Universal layout / style model
// ---------------------------------------------------------------------------

export type SizeUnit = "px" | "%" | "em" | "rem" | "vw" | "vh";

export interface SizeValue {
    value: string;
    unit: SizeUnit;
}

/**
 * Logical sides, not physical ones. blockStart/blockEnd map to top/bottom in
 * standard horizontal writing modes; inlineStart/inlineEnd map to left/right
 * in LTR and flip to right/left automatically in RTL — that's the whole
 * point of using them instead of "left"/"right".
 */
export type BoxSide = "blockStart" | "blockEnd" | "inlineStart" | "inlineEnd";

export interface BoxSpacing {
    /** Applied to every side unless a specific side below overrides it. */
    all?: SizeValue;
    /** Only the sides the user explicitly added get an entry here. */
    sides?: Partial<Record<BoxSide, SizeValue>>;
}

export type BorderLineStyle = "solid" | "dashed" | "dotted" | "double" | "none";

export interface BorderSideValue {
    width?: SizeValue;
    style?: BorderLineStyle;
    color?: string;
}

export interface BorderSpacing {
    all?: BorderSideValue;
    sides?: Partial<Record<BoxSide, BorderSideValue>>;
}

export interface BoxShadowValue {
    offsetX?: string;
    offsetY?: string;
    blur?: string;
    spread?: string;
    color?: string;
    inset?: boolean;
}

export type TextAlign = "left" | "center" | "right" | "justify";
export type TextDecoration = "none" | "underline" | "line-through" | "overline";
export type OverflowValue = "visible" | "hidden" | "scroll" | "auto";
export type CursorValue =
    | "auto" | "pointer" | "default" | "move" | "text"
    | "not-allowed" | "grab" | "zoom-in" | "help" | "wait";

export interface LayoutStyle {
    // Size
    width?: string; widthUnit?: SizeUnit;
    minWidth?: string; minWidthUnit?: SizeUnit;
    maxWidth?: string; maxWidthUnit?: SizeUnit;
    height?: string; heightUnit?: SizeUnit;
    minHeight?: string; minHeightUnit?: SizeUnit;
    maxHeight?: string; maxHeightUnit?: SizeUnit;

    // Spacing (per-side capable)
    margin?: BoxSpacing;
    padding?: BoxSpacing;

    // Background
    backgroundColor?: string;

    // Border (per-side capable) + radius
    border?: BorderSpacing;
    borderRadius?: string; borderRadiusUnit?: SizeUnit;

    // Effects
    boxShadow?: BoxShadowValue;
    opacity?: number; // 0–100 in the UI, divided by 100 when applied

    // Typography — only surfaced in the UI for components with supportsTypography
    color?: string;
    fontFamily?: string;
    fontSize?: string; fontSizeUnit?: SizeUnit;
    fontWeight?: string;
    lineHeight?: string;
    letterSpacing?: string; letterSpacingUnit?: SizeUnit;
    textAlign?: TextAlign;
    textDecoration?: TextDecoration;

    // Advanced
    overflow?: OverflowValue;
    transform?: string;
    cursor?: CursorValue;
}