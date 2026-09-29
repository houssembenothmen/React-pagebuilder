import React, { useEffect } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $generateNodesFromDOM } from "@lexical/html";
import { $getRoot, $createParagraphNode } from "lexical";
import { ensureBlockHtml } from "../utils/htmlInput";

export function AppendContentPlugin({
    appendRef
}: {
    appendRef: React.MutableRefObject<((html: string) => void) | null>
}): null {
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        appendRef.current = (html: string) => {
            editor.update(() => {
                const parser = new DOMParser();
                const dom = parser.parseFromString(ensureBlockHtml(html), "text/html");
                const nodes = $generateNodesFromDOM(editor, dom);
                const root = $getRoot();

                const paragraphBreak = $createParagraphNode();
                root.append(paragraphBreak);
                root.append(...nodes);
            });
        };
    }, [editor, appendRef]);

    return null;
}