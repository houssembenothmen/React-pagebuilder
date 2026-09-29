import { EditorThemeColors } from "../config/editorConfigTypes";

function colorsToCssVars(colors: Required<EditorThemeColors>): string {
    return `
    --color-primary: ${colors.primary};
    --color-primary-hover: ${colors.primaryHover};
    --color-secondary: ${colors.secondary};
    --color-titles: ${colors.titles};
    --color-text: ${colors.text};
    --color-background: ${colors.background};
    --color-card: ${colors.card};
    --color-divider: ${colors.divider};
    --color-disabled: ${colors.disabled};
    --color-border: ${colors.border};
    --color-border-light: ${colors.borderLight};
`;
}
export function buildThemeStyleTag(
    colors: Required<EditorThemeColors>,
    darkColors: Required<EditorThemeColors>
): string {
    return `<style>
:root {
${colorsToCssVars(colors)}
}

.dark-mode,
[data-theme="dark"] {
${colorsToCssVars(darkColors)}
}
</style>`;
}