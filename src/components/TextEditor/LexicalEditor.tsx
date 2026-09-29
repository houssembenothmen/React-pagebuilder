"use client";
import {
    useState,
    useRef,
    useImperativeHandle,
    forwardRef,
    useMemo,
} from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { TRANSFORMERS } from "@lexical/markdown";
import { getEditorConfig } from "./config/editorConfig";
import { mergeEditorConfig } from "./config/mergeEditorConfig";
import { EditorConfig } from "./config/editorConfigTypes";
import { ToolbarPlugin } from "./plugins/ToolbarPlugin";
import { MediaPlugin } from "./plugins/MediaPlugin";
import { DirectionPlugin } from "./plugins/DirectionPlugin";
import { InitialContentPlugin } from "./plugins/InitialContentPlugin";
import { WordCountPlugin } from "./plugins/WordCountPlugin";
import { AlbumEditorPlugin } from "./plugins/AlbumEditorPlugin";
import { AppendContentPlugin } from "./plugins/AppendContentPlugin";
import { OnChangePluginComponent } from "./plugins/OnChangePluginComponent";
import { SourceEditorPlugin } from "./plugins/SourceEditorPlugin";
import { ColorPlugin } from "./plugins/ColorPlugin";
import { FontPlugin } from "./plugins/FontPlugin";
import { Placeholder } from "./components/Placeholder";
import { useTranslations } from "next-intl";
import { buildThemeStyleTag } from "./utils/themeCss";

import "./styles/main.scss";

export interface LexicalEditorRef {
    appendContent: (html: string) => void;
}

const LexicalEditor = forwardRef<
    LexicalEditorRef,
    {
        onChange?: (html: string) => void;
        setValue: (value: string) => void;
        initialValue?: string;
        locale?: string;
        config?: EditorConfig;
    }
>(({ onChange, setValue, initialValue = "", locale = "en", config }, ref) => {
    const t = useTranslations("editor.footer");
    const [wordCount, setWordCount] = useState(0);
    const appendRef = useRef<((html: string) => void) | null>(null);

    // Merge user config with defaults once per config change
    const resolvedConfig = useMemo(() => mergeEditorConfig(config), [config]);
    const initialConfig = useMemo(
        () => getEditorConfig(resolvedConfig),
        [resolvedConfig]
    );

    const themeStyleTag = useMemo(
        () => buildThemeStyleTag(resolvedConfig.theme.colors, resolvedConfig.theme.darkColors),
        [resolvedConfig.theme]
    );

    useImperativeHandle(ref, () => ({
        appendContent: (html: string) => {
            if (appendRef.current) {
                appendRef.current(html);
            }
        },
    }));

    const handleChange = (html: string) => {
        onChange?.(html);
        setValue(html);
    };

    const direction = locale === "ar" ? "rtl" : "ltr";

    const anyMediaEnabled =
        resolvedConfig.media.images ||
        resolvedConfig.media.videos ||
        resolvedConfig.media.pdf ||
        resolvedConfig.media.iframe ||
        resolvedConfig.media.albums;

    const colorEnabled =
        resolvedConfig.texts.color || resolvedConfig.texts.backgroundColor;
    const fontEnabled =
        resolvedConfig.texts.fontFamily || resolvedConfig.texts.fontSize;

    return (
        <div className="Editor" dir={direction}>
            <style
                // theme colors come from config (resolvedConfig.theme); the
                // rest are static structural rules for this component.
                dangerouslySetInnerHTML={{
                    __html: `
                .Editor-text--underline {
                    text-decoration: underline;
                }

                .Editor-text--strikethrough {
                    text-decoration: line-through;
                }

                .Editor-quote {
                    background-color: var(--color-background)
                }
            `,
                }}
            />
            <div
                dangerouslySetInnerHTML={{ __html: themeStyleTag }}
            />
            <LexicalComposer initialConfig={initialConfig}>
                <div
                    className="Editor-container"
                    style={{ position: "relative" }}
                >
                    <ToolbarPlugin config={resolvedConfig} />
                    <div className="Editor-contentWrapper">
                        <RichTextPlugin
                            contentEditable={
                                <ContentEditable
                                    className="Editor-content"
                                    dir={direction}
                                />
                            }
                            placeholder={<Placeholder />}
                            ErrorBoundary={LexicalErrorBoundary}
                        />
                    </div>
                    {resolvedConfig.features.sourceEditor && (
                        <SourceEditorPlugin />
                    )}
                </div>
                {(resolvedConfig.history.undo ||
                    resolvedConfig.history.redo) && <HistoryPlugin />}
                {resolvedConfig.features.autoFocus && <AutoFocusPlugin />}
                {resolvedConfig.texts.lists && <ListPlugin />}
                <LinkPlugin />
                {anyMediaEnabled && <MediaPlugin />}
                {resolvedConfig.media.albums && (
                    <AlbumEditorPlugin config={resolvedConfig} />
                )}
                {colorEnabled && <ColorPlugin />}
                {fontEnabled && <FontPlugin />}
                {resolvedConfig.texts.markdownShortcuts && (
                    <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
                )}
                <InitialContentPlugin
                    locale={locale}
                    initialHTML={initialValue}
                />
                {resolvedConfig.texts.direction && (
                    <DirectionPlugin locale={locale} />
                )}
                <OnChangePluginComponent
                    onChange={handleChange}
                    delay={1000}
                    theme={resolvedConfig.theme}
                />
                {resolvedConfig.features.wordCount && (
                    <WordCountPlugin onWordCountChange={setWordCount} />
                )}
                <AppendContentPlugin appendRef={appendRef} />
            </LexicalComposer>
            {resolvedConfig.features.wordCount && (
                <div className="Editor-footer">
                    <div className="Editor-wordCount">
                        {t("wordCount", { count: wordCount })}
                    </div>
                </div>
            )}
        </div>
    );
});

LexicalEditor.displayName = "LexicalEditor";

export default LexicalEditor;