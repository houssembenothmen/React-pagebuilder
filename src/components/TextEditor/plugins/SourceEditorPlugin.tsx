import React, { JSX, useEffect, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { COMMAND_PRIORITY_EDITOR } from "lexical";
import { $generateHtmlFromNodes } from "@lexical/html";
import { $generateNodesFromDOM } from "@lexical/html";
import { $getRoot } from "lexical";
import { TOGGLE_SOURCE_EDITOR_COMMAND } from "../commands/editorCommands";

export function SourceEditorPlugin(): JSX.Element | null {
    const [editor] = useLexicalComposerContext();
    const [isSourceMode, setIsSourceMode] = useState(false);
    const [sourceHTML, setSourceHTML] = useState("");

    useEffect(() => {
        return editor.registerCommand(
            TOGGLE_SOURCE_EDITOR_COMMAND,
            () => {
                if (!isSourceMode) {
                    // Switch to source mode
                    editor.getEditorState().read(() => {
                        const html = $generateHtmlFromNodes(editor);
                        setSourceHTML(html);
                    });
                    setIsSourceMode(true);
                } else {
                    // Switch back to visual mode
                    editor.update(() => {
                        const parser = new DOMParser();
                        const dom = parser.parseFromString(sourceHTML, "text/html");
                        const nodes = $generateNodesFromDOM(editor, dom);
                        const root = $getRoot();
                        root.clear();
                        root.append(...nodes);
                    });
                    setIsSourceMode(false);
                }
                return true;
            },
            COMMAND_PRIORITY_EDITOR
        );
    }, [editor, isSourceMode, sourceHTML]);

    if (!isSourceMode) {
        return null;
    }

    return (
        <div
            style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "white",
                zIndex: 1000,
                display: "flex",
                flexDirection: "column",
            }}
        >
            <div
                style={{
                    padding: "12px",
                    borderBottom: "1px solid #ddd",
                    backgroundColor: "#f5f5f5",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 600 }}>
                    HTML Source Editor
                </h3>
                <button
                    type="button"
                    onClick={() => editor.dispatchCommand(TOGGLE_SOURCE_EDITOR_COMMAND, undefined)}
                    style={{
                        padding: "8px 16px",
                        backgroundColor: "#007bff",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontSize: "14px",
                    }}
                >
                    Apply & Close
                </button>
            </div>
            <textarea
                value={sourceHTML}
                onChange={(e) => setSourceHTML(e.target.value)}
                style={{
                    flex: 1,
                    padding: "16px",
                    fontFamily: "monospace",
                    fontSize: "14px",
                    border: "none",
                    outline: "none",
                    resize: "none",
                }}
                spellCheck={false}
            />
        </div>
    );
}