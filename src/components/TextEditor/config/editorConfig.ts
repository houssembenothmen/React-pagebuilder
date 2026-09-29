import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import { ListItemNode, ListNode } from "@lexical/list";
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { Klass, LexicalNode } from "lexical";
import { ImageNode } from "../nodes/ImageNode";
import { VideoNode } from "../nodes/VideoNode";
import { PDFNode } from "../nodes/PDFNode";
import { AlbumNode } from "../nodes/AlbumNode";
import { IframeNode } from "../nodes/IframeNode";
import { ResolvedEditorConfig } from "./editorConfigTypes";

export const theme = {
    paragraph: "Editor-paragraph",
    heading: {
        h1: "Editor-heading Editor-heading--h1",
        h2: "Editor-heading Editor-heading--h2",
        h3: "Editor-heading Editor-heading--h3",
        h4: "Editor-heading Editor-heading--h4",
        h5: "Editor-heading Editor-heading--h5",
        h6: "Editor-heading Editor-heading--h6",
    },
    list: {
        nested: { listitem: "Editor-listItem--nested" },
        ol: "Editor-list Editor-list--ordered",
        ul: "Editor-list Editor-list--unordered",
    },
    text: {
        bold: "Editor-text--bold",
        italic: "Editor-text--italic",
        underline: "Editor-text--underline",
        strikethrough: "Editor-text--strikethrough",
        code: "Editor-text--code",
    },
    code: "Editor-codeBlock",
    quote: "Editor-quote",
    link: "Editor-link",
    rtl: "Editor-rtl",
    ltr: "Editor-ltr",
};

export function getEditorConfig(config: ResolvedEditorConfig) {
    const nodes: Klass<LexicalNode>[] = [
        HeadingNode,
        ListNode,
        ListItemNode,
        QuoteNode,
        CodeNode,
        CodeHighlightNode,
        TableNode,
        TableCellNode,
        TableRowNode,
        AutoLinkNode,
        LinkNode,
    ];

    if (config.media.images) nodes.push(ImageNode);
    if (config.media.videos) nodes.push(VideoNode);
    if (config.media.pdf) nodes.push(PDFNode);
    if (config.media.iframe) nodes.push(IframeNode);
    if (config.media.albums) nodes.push(AlbumNode);

    return {
        namespace: config.theme.namespace,
        theme,
        onError(error: unknown) {
            throw error;
        },
        nodes,
    };
}