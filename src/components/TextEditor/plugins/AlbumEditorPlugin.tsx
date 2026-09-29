"use client";
import { useEffect, useState, useCallback } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { COMMAND_PRIORITY_EDITOR } from "lexical";
import { OPEN_ALBUM_EDITOR_COMMAND, UPDATE_ALBUM_COMMAND } from "../commands/editorCommands";
import { AlbumEditorModal } from "../components/AlbumEditorModal";
import { ResolvedEditorConfig } from "../config/editorConfigTypes";
import { ImageData } from "../nodes/AlbumNode";

interface EditorSession {
    nodeKey: string;
    images: ImageData[];
}

export function AlbumEditorPlugin({ config }: { config: ResolvedEditorConfig }) {
    const [editor] = useLexicalComposerContext();
    const [session, setSession] = useState<EditorSession | null>(null);

    useEffect(() => {
        return editor.registerCommand(
            OPEN_ALBUM_EDITOR_COMMAND,
            (payload) => {
                setSession(payload);
                return true;
            },
            COMMAND_PRIORITY_EDITOR
        );
    }, [editor]);

    const handleSave = useCallback(
        (images: ImageData[]) => {
            if (!session) return;
            editor.dispatchCommand(UPDATE_ALBUM_COMMAND, {
                nodeKey: session.nodeKey,
                images,
            });
            setSession(null);
        },
        [editor, session]
    );

    if (!session) return null;

    return (
        <AlbumEditorModal
            isOpen={!!session}
            initialImages={session.images}
            onClose={() => setSession(null)}
            onSave={handleSave}
            mediaConfig={config.media}
        />
    );
}