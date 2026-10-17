import type { CanvasComponent, LayoutStyle } from "./types";
import { computeLayoutDecls } from "./utils/layoutStyle";

export const PAGE_ROOT_ID = "__page__";

export type PageProps = {
    align: "center" | "left" | "right";
    direction: "column" | "row";
    gap: number;
    alignItems: string;
    justifyContent: string;
};

export interface PageSettings {
    props?: Partial<PageProps>;
    layout?: LayoutStyle;
}

export const defaultPageProps = (): PageProps => ({
    align: "center",
    direction: "column",
    gap: 20,
    alignItems: "stretch",
    justifyContent: "flex-start",
});

// Equivalent of the old .pb-export: max-width 960px, padding 32px 24px.
export const defaultPageLayout = (): LayoutStyle => ({
    maxWidth: "960",
    maxWidthUnit: "px",
    padding: {
        sides: {
            blockStart: { value: "32", unit: "px" },
            blockEnd: { value: "32", unit: "px" },
            inlineStart: { value: "24", unit: "px" },
            inlineEnd: { value: "24", unit: "px" },
        },
    },
});

export const createPageNode = (): CanvasComponent => ({
    id: PAGE_ROOT_ID,
    title: "Page",
    tag: "page",
    props: defaultPageProps(),
    layout: defaultPageLayout(),
});

type Decls = Record<string, string | number>;

/**
 * frame = the box itself (size, margin, padding, background, border, typography)
 * flow  = how children are laid out inside it (flex direction, gap, alignment)
 */
export function computePageStyles(props?: Partial<PageProps>, layout?: LayoutStyle): { frame: Decls; flow: Decls } {
    const p = { ...defaultPageProps(), ...props };

    const frame: Decls = {};
    // Centering uses logical margins (RTL-safe). If the user sets an explicit margin, theirs wins.
    if (!layout?.margin) {
        if (p.align !== "left") frame.marginInlineStart = "auto";
        if (p.align !== "right") frame.marginInlineEnd = "auto";
    }
    Object.assign(frame, computeLayoutDecls(layout));

    const flow: Decls = {
        display: "flex",
        flexDirection: p.direction,
        gap: `${p.gap}px`,
        alignItems: p.alignItems,
        justifyContent: p.justifyContent,
    };

    return { frame, flow };
}

const kebab = (k: string) => k.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);

export const declsToString = (d: Decls): string =>
    Object.entries(d).map(([k, v]) => `${kebab(k)}:${v}`).join(";");