import { useEffect, useRef, useCallback } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { $generateHtmlFromNodes } from "@lexical/html";
import type { EditorState } from "lexical";
import { ResolvedEditorConfig } from "../config/editorConfigTypes";
import { buildThemeStyleTag } from "../utils/themeCss";

const ELEMENT_STYLES = {
    h1: "color: var(--color-titles); font-weight: bold; margin-top: 24px; margin-bottom: 16px; line-height: 1.4; font-size: 36px",
    h2: "color: var(--color-titles); font-weight: bold; margin-top: 24px; margin-bottom: 16px; line-height: 1.4; font-size: 30px",
    h3: "color: var(--color-titles); font-weight: bold; margin-top: 24px; margin-bottom: 16px; line-height: 1.4; font-size: 24px",
    h4: "color: var(--color-titles); font-weight: bold; margin-top: 24px; margin-bottom: 16px; line-height: 1.4; font-size: 20px",
    h5: "color: var(--color-titles); font-weight: bold; margin-top: 24px; margin-bottom: 16px; line-height: 1.4; font-size: 18px",
    h6: "color: var(--color-titles); font-weight: bold; margin-top: 24px; margin-bottom: 16px; line-height: 1.4; font-size: 16px",
    p: "margin-bottom: 12px; line-height: 1.6; color: var(--color-text)",
    blockquote:
        "border-left: 4px solid var(--color-primary); padding-left: 16px; margin-left: 0; font-style: italic; color: var(--color-titles); margin-bottom: 12px; margin-top: 12px",
    a: "color: var(--color-primary); text-decoration: underline; cursor: pointer; transition: all 0.2s ease",
    ul: "margin-bottom: 12px; padding-left: 24px; list-style-type: disc; color: var(--color-text)",
    ol: "margin-bottom: 12px; padding-left: 24px; list-style-type: decimal; color: var(--color-text)",
    li: "line-height: 1.6; margin-bottom: 4px; color: var(--color-text)",
    code: 'background: var(--color-background); padding: 2px 6px; font-family: "Courier New", monospace; font-size: 0.875em; border-radius: 4px; color: var(--color-secondary)',
    pre: 'background: var(--color-secondary); color: var(--color-card); padding: 16px; border-radius: 8px; font-family: "Courier New", monospace; font-size: 14px; margin-bottom: 12px; overflow-x: auto',
    strong: "font-weight: bold",
    em: "font-style: italic",
    u: "text-decoration: underline",
    s: "text-decoration: line-through",
    img: "max-width: 100%; height: auto; display: block; margin: 10px 0; border-radius: 4px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1)",
    video: "max-width: 100%; height: auto; display: block; margin: 10px 0; border-radius: 4px; border: 1px solid var(--color-border)",
};

function applyInlineStyles(html: string): string {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    const mergeStyles = (element: HTMLElement, newStyles: string) => {
        const currentStyle = element.getAttribute("style") || "";

        // Parse existing styles into a map
        const existingStylesMap = new Map<string, string>();
        if (currentStyle) {
            currentStyle.split(";").forEach((style) => {
                const [prop, value] = style.split(":").map((s) => s.trim());
                if (prop && value) {
                    existingStylesMap.set(prop, value);
                }
            });
        }

        // Parse new styles and only add if they don't exist
        newStyles.split(";").forEach((style) => {
            const [prop, value] = style.split(":").map((s) => s.trim());
            if (prop && value && !existingStylesMap.has(prop)) {
                existingStylesMap.set(prop, value);
            }
        });

        // Rebuild style string, preserving existing styles first
        const styleString = Array.from(existingStylesMap.entries())
            .map(([prop, value]) => `${prop}: ${value}`)
            .join("; ");

        if (styleString) {
            element.setAttribute("style", styleString);
        }
    };

    const elementsToStyle = [
        { tag: "h1", style: ELEMENT_STYLES.h1 },
        { tag: "h2", style: ELEMENT_STYLES.h2 },
        { tag: "h3", style: ELEMENT_STYLES.h3 },
        { tag: "h4", style: ELEMENT_STYLES.h4 },
        { tag: "h5", style: ELEMENT_STYLES.h5 },
        { tag: "h6", style: ELEMENT_STYLES.h6 },
        { tag: "p", style: ELEMENT_STYLES.p },
        { tag: "blockquote", style: ELEMENT_STYLES.blockquote },
        { tag: "a", style: ELEMENT_STYLES.a },
        { tag: "ul", style: ELEMENT_STYLES.ul },
        { tag: "ol", style: ELEMENT_STYLES.ol },
        { tag: "li", style: ELEMENT_STYLES.li },
        { tag: "pre", style: ELEMENT_STYLES.pre },
        { tag: "strong", style: ELEMENT_STYLES.strong },
        { tag: "em", style: ELEMENT_STYLES.em },
        { tag: "u", style: ELEMENT_STYLES.u },
        { tag: "s", style: ELEMENT_STYLES.s },
        { tag: "img", style: ELEMENT_STYLES.img },
        { tag: "video", style: ELEMENT_STYLES.video },
    ];

    elementsToStyle.forEach(({ tag, style }) => {
        const elements = doc.getElementsByTagName(tag);
        for (let i = 0; i < elements.length; i++) {
            const el = elements[i] as HTMLElement;
            if (tag === "code" && el.parentElement?.tagName === "PRE") {
                continue;
            }
            // Skip elements belonging to a self-contained widget like the
            // album carousel — it ships its own CSS and forcing inline
            // styles (especially on <img>) overrides that styling.
            if (el.closest("[data-lexical-album]")) {
                continue;
            }
            mergeStyles(el, style);
        }
    });

    const codeElements = doc.getElementsByTagName("code");
    for (let i = 0; i < codeElements.length; i++) {
        const el = codeElements[i] as HTMLElement;
        if (el.parentElement?.tagName !== "PRE") {
            mergeStyles(el, ELEMENT_STYLES.code);
        }
    }

    return doc.body.innerHTML;
}

export function OnChangePluginComponent({
    onChange,
    delay = 200,
    theme,
}: {
    onChange: (html: string, json?: string) => void;
    delay?: number;
    theme: ResolvedEditorConfig["theme"];
}) {
    const [editor] = useLexicalComposerContext();
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const lastHtmlRef = useRef<string>("");
    const processingRef = useRef<boolean>(false);

    const wrapWithStyles = useCallback(
        (html: string): string => {
            return `${buildThemeStyleTag(theme.colors, theme.darkColors)}\n${html}`;
        },
        [theme]
    );

    const processAndNotify = useCallback(
        (html: string, json: string) => {
            if (processingRef.current) return;

            processingRef.current = true;

            const processStyles = () => {
                try {
                    const styledHtml = wrapWithStyles(applyInlineStyles(html));

                    // Only call onChange if the HTML actually changed
                    if (styledHtml !== lastHtmlRef.current) {
                        lastHtmlRef.current = styledHtml;
                        onChange(styledHtml, json);
                    }
                } finally {
                    processingRef.current = false;
                }
            };

            if ("requestIdleCallback" in window) {
                requestIdleCallback(processStyles, { timeout: 500 });
            } else {
                setTimeout(processStyles, 0);
            }
        },
        [onChange, wrapWithStyles]
    );

    const debouncedOnChange = useCallback(
        (html: string, json: string) => {
            // Clear any pending timeout
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            timeoutRef.current = setTimeout(() => {
                processAndNotify(html, json);
            }, delay);
        },
        [delay, processAndNotify]
    );

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    return (
        <OnChangePlugin
            ignoreSelectionChange={true}
            ignoreHistoryMergeTagChange={true}
            onChange={(editorState: EditorState) => {
                // Use queueMicrotask to ensure state is fully updated
                queueMicrotask(() => {
                    editorState.read(() => {
                        const html: string = $generateHtmlFromNodes(editor);
                        const json: string = JSON.stringify(
                            editorState.toJSON()
                        );
                        debouncedOnChange(html, json);
                    });
                });
            }}
        />
    );
}