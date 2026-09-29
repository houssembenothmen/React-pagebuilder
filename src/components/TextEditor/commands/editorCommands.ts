import { LexicalCommand, createCommand } from "lexical";
import { ImageData } from "../nodes/AlbumNode";

export const INSERT_IMAGE_COMMAND: LexicalCommand<{
    src: string;
    alt: string;
}> = createCommand();

export const INSERT_VIDEO_COMMAND: LexicalCommand<{ src: string }> = createCommand();

export const INSERT_PDF_COMMAND: LexicalCommand<{
    src: string;
    fileName: string;
}> = createCommand();

export const INSERT_IFRAME_COMMAND: LexicalCommand<{
    src: string;
    width?: number;
    height?: number;
}> = createCommand();

export const INSERT_ALBUM_COMMAND: LexicalCommand<{
    images: ImageData[];
}> = createCommand();

// Dispatched by the AlbumNode's "Edit Album" overlay button to ask the
// AlbumEditorPlugin to open the reorder/edit modal for that specific node.
export const OPEN_ALBUM_EDITOR_COMMAND: LexicalCommand<{
    nodeKey: string;
    images: ImageData[];
}> = createCommand();

// Dispatched by the album editor modal on Save to write the new image
// list (order, additions, removals) back onto the actual AlbumNode.
export const UPDATE_ALBUM_COMMAND: LexicalCommand<{
    nodeKey: string;
    images: ImageData[];
}> = createCommand();

export const TOGGLE_SOURCE_EDITOR_COMMAND: LexicalCommand<void> = createCommand();

export const SET_TEXT_COLOR_COMMAND: LexicalCommand<string> = createCommand();

export const SET_BACKGROUND_COLOR_COMMAND: LexicalCommand<string> = createCommand();

export const SET_FONT_FAMILY_COMMAND: LexicalCommand<string> = createCommand();

export const SET_FONT_SIZE_COMMAND: LexicalCommand<string> = createCommand();