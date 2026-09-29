import { useEffect } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getRoot } from "lexical";

export function DirectionPlugin({ locale }: { locale: string }): null {
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        editor.update(() => {
            const root = $getRoot();
            const direction = locale === 'ar' ? 'rtl' : 'ltr';
            root.setDirection(direction);
        });
    }, [editor, locale]);

    return null;
}