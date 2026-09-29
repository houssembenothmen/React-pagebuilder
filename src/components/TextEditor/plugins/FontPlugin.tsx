import { useEffect } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
    $getSelection,
    $isRangeSelection,
    COMMAND_PRIORITY_EDITOR,
} from "lexical";
import { $patchStyleText } from "@lexical/selection";
import { SET_FONT_FAMILY_COMMAND, SET_FONT_SIZE_COMMAND } from "../commands/editorCommands";

export function FontPlugin(): null {
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        return editor.registerCommand(
            SET_FONT_FAMILY_COMMAND,
            (fontFamily: string) => {
                editor.update(() => {
                    const selection = $getSelection();
                    if ($isRangeSelection(selection)) {
                        $patchStyleText(selection, {
                            "font-family": fontFamily === 'default' ? null : fontFamily,
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
            SET_FONT_SIZE_COMMAND,
            (fontSize: string) => {
                editor.update(() => {
                    const selection = $getSelection();
                    if ($isRangeSelection(selection)) {
                        $patchStyleText(selection, {
                            "font-size": fontSize === 'default' ? null : fontSize,
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