import { useEffect } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
    $getSelection,
    $isRangeSelection,
    COMMAND_PRIORITY_EDITOR,
    $getRoot,
    $createParagraphNode,
} from "lexical";
import {
    INSERT_IMAGE_COMMAND,
    INSERT_VIDEO_COMMAND,
    INSERT_PDF_COMMAND,
    INSERT_IFRAME_COMMAND,
    INSERT_ALBUM_COMMAND,
} from "../commands/editorCommands";
import { $createImageNode } from "../nodes/ImageNode";
import { $createVideoNode } from "../nodes/VideoNode";
import { $createPDFNode } from "../nodes/PDFNode";
import { $createIframeNode } from "../nodes/IframeNode";
import { $createAlbumNode } from "../nodes/AlbumNode";
import { $getNodeByKey } from "lexical";
import { UPDATE_ALBUM_COMMAND } from "../commands/editorCommands";
import { $isAlbumNode } from "../nodes/AlbumNode";

export function MediaPlugin(): null {
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        return editor.registerCommand(
            UPDATE_ALBUM_COMMAND,
            (payload) => {
                editor.update(() => {
                    const node = $getNodeByKey(payload.nodeKey);
                    if ($isAlbumNode(node)) {
                        node.setImages(payload.images);
                    }
                });
                return true;
            },
            COMMAND_PRIORITY_EDITOR
        );
    }, [editor]);

    useEffect(() => {
        return editor.registerCommand(
            INSERT_IMAGE_COMMAND,
            (payload) => {
                editor.update(() => {
                    const imageNode = $createImageNode(payload);
                    const selection = $getSelection();
                    if ($isRangeSelection(selection)) {
                        selection.insertNodes([imageNode]);
                        // Create a new paragraph after the image and focus it
                        const newParagraph = $createParagraphNode();
                        selection.insertNodes([newParagraph]);
                        newParagraph.select();
                    } else {
                        const root = $getRoot();
                        const paragraph = $createParagraphNode();
                        paragraph.append(imageNode);
                        root.append(paragraph);
                        // Create a new paragraph after and focus it
                        const newParagraph = $createParagraphNode();
                        root.append(newParagraph);
                        newParagraph.select();
                    }
                });
                return true;
            },
            COMMAND_PRIORITY_EDITOR
        );
    }, [editor]);

    useEffect(() => {
        return editor.registerCommand(
            INSERT_VIDEO_COMMAND,
            (payload) => {
                editor.update(() => {
                    const videoNode = $createVideoNode(payload);
                    const selection = $getSelection();
                    if ($isRangeSelection(selection)) {
                        selection.insertNodes([videoNode]);
                        // Create a new paragraph after the video and focus it
                        const newParagraph = $createParagraphNode();
                        selection.insertNodes([newParagraph]);
                        newParagraph.select();
                    } else {
                        const root = $getRoot();
                        const paragraph = $createParagraphNode();
                        paragraph.append(videoNode);
                        root.append(paragraph);
                        // Create a new paragraph after and focus it
                        const newParagraph = $createParagraphNode();
                        root.append(newParagraph);
                        newParagraph.select();
                    }
                });
                return true;
            },
            COMMAND_PRIORITY_EDITOR
        );
    }, [editor]);

    useEffect(() => {
        return editor.registerCommand(
            INSERT_PDF_COMMAND,
            (payload) => {
                editor.update(() => {
                    const pdfNode = $createPDFNode(payload);
                    const selection = $getSelection();
                    if ($isRangeSelection(selection)) {
                        selection.insertNodes([pdfNode]);
                        // Create a new paragraph after the PDF and focus it
                        const newParagraph = $createParagraphNode();
                        selection.insertNodes([newParagraph]);
                        newParagraph.select();
                    } else {
                        const root = $getRoot();
                        const paragraph = $createParagraphNode();
                        paragraph.append(pdfNode);
                        root.append(paragraph);
                        // Create a new paragraph after and focus it
                        const newParagraph = $createParagraphNode();
                        root.append(newParagraph);
                        newParagraph.select();
                    }
                });
                return true;
            },
            COMMAND_PRIORITY_EDITOR
        );
    }, [editor]);

    useEffect(() => {
        return editor.registerCommand(
            INSERT_IFRAME_COMMAND,
            (payload) => {
                editor.update(() => {
                    const iframeNode = $createIframeNode(payload);
                    const selection = $getSelection();
                    if ($isRangeSelection(selection)) {
                        selection.insertNodes([iframeNode]);
                        // Create a new paragraph after the iframe and focus it
                        const newParagraph = $createParagraphNode();
                        selection.insertNodes([newParagraph]);
                        newParagraph.select();
                    } else {
                        const root = $getRoot();
                        const paragraph = $createParagraphNode();
                        paragraph.append(iframeNode);
                        root.append(paragraph);
                        // Create a new paragraph after and focus it
                        const newParagraph = $createParagraphNode();
                        root.append(newParagraph);
                        newParagraph.select();
                    }
                });
                return true;
            },
            COMMAND_PRIORITY_EDITOR
        );
    }, [editor]);

    useEffect(() => {
        return editor.registerCommand(
            INSERT_ALBUM_COMMAND,
            (payload) => {
                editor.update(() => {
                    const albumNode = $createAlbumNode(payload);
                    const selection = $getSelection();
                    if ($isRangeSelection(selection)) {
                        selection.insertNodes([albumNode]);
                        // Create a new paragraph after the album and focus it
                        const newParagraph = $createParagraphNode();
                        selection.insertNodes([newParagraph]);
                        newParagraph.select();
                    } else {
                        const root = $getRoot();
                        const paragraph = $createParagraphNode();
                        paragraph.append(albumNode);
                        root.append(paragraph);
                        // Create a new paragraph after and focus it
                        const newParagraph = $createParagraphNode();
                        root.append(newParagraph);
                        newParagraph.select();
                    }
                });
                return true;
            },
            COMMAND_PRIORITY_EDITOR
        );
    }, [editor]);

    return null;
}
