"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useRichTextEditor } from "@/components/pagebuilder/core/context/RichTextEditorContext";

interface RichTextBlockProps {
    html: string;
    onChange: (html: string) => void;
}

const RichTextBlock = ({ html, onChange }: RichTextBlockProps) => {
    const locale = useLocale();
    const t = useTranslations("pagebuilder.richText");
    const Editor = useRichTextEditor();
    const [isEditing, setIsEditing] = useState(false);
    const [editorInitialValue, setEditorInitialValue] = useState(html);

    const handleEditStart = () => {
        setEditorInitialValue(html);
        setIsEditing(true);
    };

    const handleDone = (nextHtml: string) => {
        onChange(nextHtml);
        setIsEditing(false);
    };

    if (!Editor) {
        return (
            <div className="pb-el-media-placeholder">
                Rich Text editing needs a `richTextEditor` passed to &lt;PageBuilder /&gt;.
            </div>
        );
    }

    if (!isEditing) {
        const isEmpty = !html || !html.trim();
        return (
            <div className="pb-el-richtext-preview" onDoubleClick={(e) => { e.stopPropagation(); handleEditStart(); }}>
                {isEmpty ? (
                    <div className="pb-el-media-placeholder">{t("placeholder")}</div>
                ) : (
                    <div className="pb-el-richtext" dangerouslySetInnerHTML={{ __html: html }} />
                )}
                <button type="button" className="pb-el-richtext-edit-btn" onClick={(e) => { e.stopPropagation(); handleEditStart(); }}>
                    <Pencil size={13} />
                    {t("edit")}
                </button>
            </div>
        );
    }

    return (
        <div className="pb-el-richtext-editing" onClick={(e) => e.stopPropagation()} onKeyDown={(e) => e.stopPropagation()}>
            <Editor initialValue={editorInitialValue} locale={locale} onDone={handleDone} />
        </div>
    );
};

export default RichTextBlock;