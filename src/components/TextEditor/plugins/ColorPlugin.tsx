import { useEffect } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
    $getSelection,
    $isRangeSelection,
    COMMAND_PRIORITY_EDITOR,
} from "lexical";
import { $patchStyleText } from "@lexical/selection";
import { SET_TEXT_COLOR_COMMAND, SET_BACKGROUND_COLOR_COMMAND } from "../commands/editorCommands";

export function ColorPlugin(): null {
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        return editor.registerCommand(
            SET_TEXT_COLOR_COMMAND,
            (color: string) => {
                editor.update(() => {
                    const selection = $getSelection();
                    if ($isRangeSelection(selection)) {
                        $patchStyleText(selection, {
                            color: color === 'inherit' ? null : color,
                        });
                    }
                });
                return true;
            },
            COMMAND_PRIORITY_EDITOR
        );
    }, [editor]);

    useEffect(() => {
        return editor.registerCommand(
            SET_BACKGROUND_COLOR_COMMAND,
            (color: string) => {
                editor.update(() => {
                    const selection = $getSelection();
                    if ($isRangeSelection(selection)) {
                        $patchStyleText(selection, {
                            "background-color": color === 'transparent' ? null : color,
                        });
                    }
                });
                return true;
            },
            COMMAND_PRIORITY_EDITOR
        );
    }, [editor]);

    return null;
}