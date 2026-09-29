
import { JSX } from "react";
import {
    DecoratorNode,
    LexicalNode,
    NodeKey,
    SerializedLexicalNode,
    Spread,
    DOMExportOutput,
    DOMConversionMap,
    DOMConversionOutput,
} from "lexical";

export type SerializedImageNode = Spread<
    {
        src: string;
        alt: string;
        width?: number;
        height?: number;
    },
    SerializedLexicalNode
>;

const IMAGE_CSS_VARS = `<style>:root{--color-border:#E5E5E5}.dark-mode,[data-theme="dark"]{--color-border:#3a3a3a}</style>`;

export class ImageNode extends DecoratorNode<JSX.Element> {
    __src: string;
    __alt: string;
    __width?: number;
    __height?: number;

    static getType(): string {
        return "image";
    }

    static clone(node: ImageNode): ImageNode {
        return new ImageNode(
            node.__src,
            node.__alt,
            node.__width,
            node.__height,
            node.__key
        );
    }

    constructor(
        src: string,
        alt: string,
        width?: number,
        height?: number,
        key?: NodeKey
    ) {
        super(key);
        this.__src = src;
        this.__alt = alt;
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

    exportDOM(): DOMExportOutput {
        const container = document.createElement("div");
        container.innerHTML = IMAGE_CSS_VARS;

        const element = document.createElement("img");
        element.setAttribute("src", this.__src);
        element.setAttribute("alt", this.__alt);
        if (this.__width) element.setAttribute("width", String(this.__width));
        if (this.__height) element.setAttribute("height", String(this.__height));

        element.style.cssText = `
            max-width: 100%;
            height: auto;
            display: block;
            margin: 10px 0;
            border-radius: 4px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        `;

        container.appendChild(element);
        return { element: container };
    }

    static importDOM(): DOMConversionMap | null {
        return {
            img: () => ({
                conversion: (element: HTMLElement): DOMConversionOutput | null => {
                    const img = element as HTMLImageElement;
                    const node = $createImageNode({
                        src: img.src,
                        alt: img.alt,
                        width: img.width,
                        height: img.height,
                    });
                    return { node };
                },
                priority: 0,
            }),
        };
    }

    exportJSON(): SerializedImageNode {
        return {
            src: this.__src,
            alt: this.__alt,
            width: this.__width,
            height: this.__height,
            type: "image",
            version: 1,
        };
    }

    static importJSON(serializedNode: SerializedImageNode): ImageNode {
        return $createImageNode({
            src: serializedNode.src,
            alt: serializedNode.alt,
            width: serializedNode.width,
            height: serializedNode.height,
        });
    }

    decorate(): JSX.Element {
        return (
            <img
                src={this.__src}
                alt={this.__alt}
                style={{
                    maxWidth: '100%',
                    height: 'auto',
                    display: 'block',
                    margin: '10px 0',
                    borderRadius: '4px',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                }}
            />
        );
    }
}

export function $createImageNode({
    src,
    alt,
    width,
    height,
}: {
    src: string;
    alt: string;
    width?: number;
    height?: number;
}): ImageNode {
    return new ImageNode(src, alt, width, height);
}

export function $isImageNode(
    node: LexicalNode | null | undefined
): node is ImageNode {
    return node instanceof ImageNode;
}