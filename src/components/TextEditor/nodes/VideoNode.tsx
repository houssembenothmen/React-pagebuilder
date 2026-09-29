import { JSX as VideoJSX, memo } from "react";
import {
    DecoratorNode as VideoDecoratorNode,
    LexicalNode as VideoLexicalNode,
    NodeKey as VideoNodeKey,
    SerializedLexicalNode as VideoSerializedLexicalNode,
    Spread as VideoSpread,
    DOMExportOutput as VideoDOMExportOutput,
    DOMConversionMap as VideoDOMConversionMap,
    DOMConversionOutput as VideoDOMConversionOutput,
} from "lexical";

export type SerializedVideoNode = VideoSpread<
    {
        src: string;
        width?: number;
        height?: number;
    },
    VideoSerializedLexicalNode
>;

const VIDEO_CSS_VARS = `<style>:root{--color-border:#E5E5E5}.dark-mode,[data-theme="dark"]{--color-border:#3a3a3a}</style>`;

// Memoized video component to prevent re-renders
const VideoComponent = memo(({
    src,
    width,
    height
}: {
    src: string;
    width?: number;
    height?: number;
}) => {
    return (
        <video
            src={src}
            controls
            width={width}
            height={height}
            style={{
                maxWidth: '100%',
                height: 'auto',
                display: 'block',
                margin: '10px 0',
                borderRadius: '4px',
                border: '1px solid var(--color-border, #E5E5E5)',
            }}
        />
    );
});

VideoComponent.displayName = 'VideoComponent';

export class VideoNode extends VideoDecoratorNode<VideoJSX.Element> {
    __src: string;
    __width?: number;
    __height?: number;

    static getType(): string {
        return "video";
    }

    static clone(node: VideoNode): VideoNode {
        return new VideoNode(
            node.__src,
            node.__width,
            node.__height,
            node.__key
        );
    }

    constructor(src: string, width?: number, height?: number, key?: VideoNodeKey) {
        super(key);
        this.__src = src;
        this.__width = width;
        this.__height = height;
    }

    createDOM(): HTMLElement {
        const div = document.createElement("div");
        div.style.display = "inline-block";
        div.style.margin = "10px 0";
        return div;
    }

    updateDOM(): false {
        return false;
    }

    exportDOM(): VideoDOMExportOutput {
        const container = document.createElement("div");
        container.innerHTML = VIDEO_CSS_VARS;

        const element = document.createElement("video");
        element.setAttribute("src", this.__src);
        element.setAttribute("controls", "true");
        if (this.__width) element.setAttribute("width", String(this.__width));
        if (this.__height) element.setAttribute("height", String(this.__height));

        element.style.cssText = `
            max-width: 100%;
            height: auto;
            display: block;
            margin: 10px 0;
            border-radius: 4px;
            border: 1px solid var(--color-border);
        `;

        container.appendChild(element);
        return { element: container };
    }

    static importDOM(): VideoDOMConversionMap | null {
        return {
            video: () => ({
                conversion: (element: HTMLElement): VideoDOMConversionOutput | null => {
                    const video = element as HTMLVideoElement;
                    const node = $createVideoNode({
                        src: video.src,
                        width: video.width,
                        height: video.height,
                    });
                    return { node };
                },
                priority: 0,
            }),
        };
    }

    exportJSON(): SerializedVideoNode {
        return {
            src: this.__src,
            width: this.__width,
            height: this.__height,
            type: "video",
            version: 1,
        };
    }

    static importJSON(serializedNode: SerializedVideoNode): VideoNode {
        return $createVideoNode({
            src: serializedNode.src,
            width: serializedNode.width,
            height: serializedNode.height,
        });
    }

    decorate(): VideoJSX.Element {
        return (
            <VideoComponent
                src={this.__src}
                width={this.__width}
                height={this.__height}
            />
        );
    }
}

export function $createVideoNode({
    src,
    width,
    height,
}: {
    src: string;
    width?: number;
    height?: number;
}): VideoNode {
    return new VideoNode(src, width, height);
}

export function $isVideoNode(
    node: VideoLexicalNode | null | undefined
): node is VideoNode {
    return node instanceof VideoNode;
}