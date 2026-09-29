import { useEffect } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getRoot } from "lexical";

export function WordCountPlugin({
    onWordCountChange
}: {
    onWordCountChange: (count: number) => void
}): null {
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        return editor.registerUpdateListener(({ editorState }) => {
            editorState.read(() => {
                const root = $getRoot();
                const text: string = root.getTextContent();
                const words: string[] = text
                    .trim()
                    .split(/\s+/)
                    .filter((word: string) => word.length > 0);
                const wordCount: number = words.length;
                onWordCountChange(wordCount);
            });
        });
    }, [editor, onWordCountChange]);

    return null;
}