import { HeadingTagType } from "@lexical/rich-text";

// Fallback preset swatches, only used when config.texts.colorPresets is empty.
export const DEFAULT_COLOR_PRESETS = [
    "#000000", "#434343", "#666666", "#999999", "#b7b7b7", "#cccccc", "#d9d9d9", "#efefef", "#f3f3f3", "#ffffff",
    "#980000", "#ff0000", "#ff9900", "#ffff00", "#00ff00", "#00ffff", "#4a86e8", "#0000ff", "#9900ff", "#ff00ff",
    "#e6b8af", "#f4cccc", "#fce5cd", "#fff2cc", "#d9ead3", "#d0e0e3", "#c9daf8", "#cfe2f3", "#d9d2e9", "#ead1dc",
    "#dd7e6b", "#ea9999", "#f9cb9c", "#ffe599", "#b6d7a8", "#a2c4c9", "#a4c2f4", "#9fc5e8", "#b4a7d6", "#d5a6bd",
    "#cc4125", "#e06666", "#f6b26b", "#ffd966", "#93c47d", "#76a5af", "#6d9eeb", "#6fa8dc", "#8e7cc3", "#c27ba0",
    "#a61c00", "#cc0000", "#e69138", "#f1c232", "#6aa84f", "#45818e", "#3c78d8", "#3d85c6", "#674ea7", "#a64d79",
    "#85200c", "#990000", "#b45f06", "#bf9000", "#38761d", "#134f5c", "#1155cc", "#0b5394", "#351c75", "#741b47",
    "#5b0f00", "#660000", "#783f04", "#7f6000", "#274e13", "#0c343d", "#1c4587", "#073763", "#20124d", "#4c1130",
];

// Fallback font-size options, only used when config.texts.fontSizes is empty.
export const DEFAULT_FONT_SIZE_VALUES = [
    "10px", "12px", "14px", "16px", "18px", "20px", "24px", "28px", "32px", "36px", "48px",
];

// (tag, display size in the heading dropdown) for each supported level.
export const HEADING_TAGS: Record<number, { tag: HeadingTagType; size: string }> = {
    1: { tag: "h1", size: "24px" },
    2: { tag: "h2", size: "20px" },
    3: { tag: "h3", size: "18px" },
    4: { tag: "h4", size: "16px" },
    5: { tag: "h5", size: "14px" },
    6: { tag: "h6", size: "12px" },
};