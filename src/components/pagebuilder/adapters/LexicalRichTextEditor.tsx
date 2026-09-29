"use client";

import { useRef } from "react";
import LexicalEditor from "@/components/TextEditor/LexicalEditor";
import type { RichTextEditorProps } from "@/components/pagebuilder/core/context/RichTextEditorContext";

const LexicalRichTextEditor = ({ initialValue, locale, onDone }: RichTextEditorProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const latestHtml = useRef(initialValue);

    const handleSetValue = (html: string) => {
        latestHtml.current = html;
    };

    const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
        const nextFocusTarget = e.relatedTarget as Node | null;
        // Ignore blur if focus moved to something still inside this editor
        // (e.g. a toolbar button, a dropdown, a color picker popover).
        if (containerRef.current && nextFocusTarget && containerRef.current.contains(nextFocusTarget)) {
            return;
        }
        onDone(latestHtml.current);
    };

    return (
        <div ref={containerRef} onBlur={handleBlur}>
            <LexicalEditor
                initialValue={initialValue}
                locale={locale}
                setValue={handleSetValue}
            />
        </div>
    );
};

export default LexicalRichTextEditor;