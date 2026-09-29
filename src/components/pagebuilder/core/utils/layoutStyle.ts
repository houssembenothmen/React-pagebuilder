// core/utils/layoutStyle.ts
import type { CSSProperties } from "react";
import type { BorderSpacing, BoxSide, BoxSpacing, LayoutStyle } from "../types";

const SIDES: BoxSide[] = ["blockStart", "blockEnd", "inlineStart", "inlineEnd"];

// CSS logical property names use these suffixes, e.g. margin-inline-start,
// border-block-end. Browsers also support the matching camelCase JS names
// (marginInlineStart, borderBlockEnd, ...) directly on element.style.
const CSS_SIDE_SUFFIX: Record<BoxSide, string> = {
    blockStart: "BlockStart",
    blockEnd: "BlockEnd",
    inlineStart: "InlineStart",
    inlineEnd: "InlineEnd",
};

function sizeStr(value?: string, unit?: string): string | undefined {
    if (value === undefined || value === "") return undefined;
    return `${value}${unit ?? "px"}`;
}

function applyBoxSpacing(decls: Record<string, string>, cssProp: "margin" | "padding", box?: BoxSpacing) {
    if (!box) return;
    const hasOverrides = box.sides && Object.keys(box.sides).length > 0;

    // No per-side overrides: emit the plain shorthand, cheapest and clearest output.
    if (!hasOverrides) {
        const v = sizeStr(box.all?.value, box.all?.unit);
        if (v) decls[cssProp] = v;
        return;
    }

    // Overrides exist: emit one logical longhand per side, falling back to
    // `all` for any side the user didn't specifically override.
    for (const side of SIDES) {
        const entry = box.sides?.[side] ?? box.all;
        const v = sizeStr(entry?.value, entry?.unit);
        if (v) decls[`${cssProp}${CSS_SIDE_SUFFIX[side]}`] = v;
    }
}

function applyBorder(decls: Record<string, string>, border?: BorderSpacing) {
    if (!border) return;

    const shorthand = (v?: { width?: { value: string; unit: string }; style?: string; color?: string }) => {
        if (!v) return undefined;
        const width = sizeStr(v.width?.value, v.width?.unit);
        const parts = [width, v.style, v.color].filter(Boolean);
        return parts.length ? parts.join(" ") : undefined;
    };

    const hasOverrides = border.sides && Object.keys(border.sides).length > 0;

    if (!hasOverrides) {
        const s = shorthand(border.all);
        if (s) decls.border = s;
        return;
    }

    for (const side of SIDES) {
        const entry = border.sides?.[side] ?? border.all;
        const s = shorthand(entry);
        if (s) decls[`border${CSS_SIDE_SUFFIX[side]}`] = s; // e.g. borderInlineStart shorthand
    }
}

/** Returns camelCase CSS declarations — the single computation both the editor and export read from. */
export function computeLayoutDecls(layout?: LayoutStyle): Record<string, string | number> {
    const decls: Record<string, string | number> = {};
    if (!layout) return decls;

    // Size
    const w = sizeStr(layout.width, layout.widthUnit); if (w) decls.width = w;
    const minW = sizeStr(layout.minWidth, layout.minWidthUnit); if (minW) decls.minWidth = minW;
    const maxW = sizeStr(layout.maxWidth, layout.maxWidthUnit); if (maxW) decls.maxWidth = maxW;
    const h = sizeStr(layout.height, layout.heightUnit); if (h) decls.height = h;
    const minH = sizeStr(layout.minHeight, layout.minHeightUnit); if (minH) decls.minHeight = minH;
    const maxH = sizeStr(layout.maxHeight, layout.maxHeightUnit); if (maxH) decls.maxHeight = maxH;

    // Spacing
    applyBoxSpacing(decls as Record<string, string>, "margin", layout.margin);
    applyBoxSpacing(decls as Record<string, string>, "padding", layout.padding);

    // Background
    if (layout.backgroundColor) decls.backgroundColor = layout.backgroundColor;

    // Border
    applyBorder(decls as Record<string, string>, layout.border);
    const br = sizeStr(layout.borderRadius, layout.borderRadiusUnit); if (br) decls.borderRadius = br;

    // Effects
    if (layout.boxShadow) {
        const s = layout.boxShadow;
        if (s.offsetX || s.offsetY || s.blur || s.spread || s.color) {
            decls.boxShadow = `${s.inset ? "inset " : ""}${s.offsetX || "0"}px ${s.offsetY || "0"}px ${s.blur || "0"}px ${s.spread || "0"}px ${s.color || "rgba(0,0,0,0.15)"}`;
        }
    }
    if (layout.opacity !== undefined) decls.opacity = layout.opacity / 100;

    // Typography
    if (layout.color) decls.color = layout.color;
    if (layout.fontFamily) decls.fontFamily = layout.fontFamily;
    const fs = sizeStr(layout.fontSize, layout.fontSizeUnit); if (fs) decls.fontSize = fs;
    if (layout.fontWeight) decls.fontWeight = layout.fontWeight;
    if (layout.lineHeight) decls.lineHeight = layout.lineHeight;
    const ls = sizeStr(layout.letterSpacing, layout.letterSpacingUnit); if (ls) decls.letterSpacing = ls;
    if (layout.textAlign) decls.textAlign = layout.textAlign;
    if (layout.textDecoration) decls.textDecoration = layout.textDecoration;

    // Advanced
    if (layout.overflow) decls.overflow = layout.overflow;
    if (layout.transform) decls.transform = layout.transform;
    if (layout.cursor) decls.cursor = layout.cursor;

    return decls;
}

const camelToKebab = (key: string): string => key.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);

/** For the live React editor. Cast is safe: logical/shorthand props aren't in csstype's strict list but every modern browser applies them fine via element.style. */
export function layoutToCssObject(layout?: LayoutStyle): CSSProperties {
    return computeLayoutDecls(layout) as CSSProperties;
}

/** For the exported static HTML's inline style attribute. */
export function layoutToCssString(layout?: LayoutStyle): string {
    return Object.entries(computeLayoutDecls(layout))
        .map(([k, v]) => `${camelToKebab(k)}:${v}`)
        .join(";");
}