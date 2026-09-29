import { useEffect, useRef } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $generateNodesFromDOM } from "@lexical/html";
import { $getRoot } from "lexical";
import { ensureBlockHtml } from "../utils/htmlInput";

export function InitialContentPlugin({
    initialHTML,
    locale
}: {
    initialHTML: string;
    locale: string;
}): null {
    const [editor] = useLexicalComposerContext();
    const lastLoadedHTML = useRef<string>("");

    useEffect(() => {
        // Only load if we have HTML and it's the first time we're loading
        if (initialHTML && !lastLoadedHTML.current) {
            editor.update(() => {
                const parser = new DOMParser();
                const dom = parser.parseFromString(ensureBlockHtml(initialHTML), "text/html");
                const nodes = $generateNodesFromDOM(editor, dom);
                const root = $getRoot();

                // Set direction BEFORE clearing and appending
                if (locale) {
                    const direction = locale === 'ar' ? 'rtl' : 'ltr';
                    root.setDirection(direction);
                }

                // Clear and append new content
                root.clear();
                root.append(...nodes);

                // Move selection to the end after loading content
                root.selectEnd();
            });

            lastLoadedHTML.current = initialHTML;
        }
    }, [editor, initialHTML, locale]);

    return null;
}