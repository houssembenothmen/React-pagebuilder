
import { JSX as JSXIframe } from "react";
import {
    DecoratorNode as IframeDecoratorNode,
    LexicalNode as IframeLexicalNode,
    NodeKey as IframeNodeKey,
    SerializedLexicalNode as IframeSerializedLexicalNode,
    Spread as IframeSpread,
    DOMExportOutput as IframeDOMExportOutput,
    DOMConversionMap as IframeDOMConversionMap,
    DOMConversionOutput as IframeDOMConversionOutput,
} from "lexical";

export type SerializedIframeNode = IframeSpread<
    {
        src: string;
        width?: number;
        height?: number;
    },
    IframeSerializedLexicalNode
>;

const IFRAME_CSS_VARS = `<style>:root{--color-border:#E5E5E5;--color-text:#333}.dark-mode,[data-theme="dark"]{--color-border:#3a3a3a;--color-text:#b0b0b0}</style>`;

export class IframeNode extends IframeDecoratorNode<JSXIframe.Element> {
    __src: string;
    __width?: number;
    __height?: number;

    static getType(): string {
        return "iframe";
    }

    static clone(node: IframeNode): IframeNode {
        return new IframeNode(node.__src, node.__width, node.__height, node.__key);
    }

    constructor(src: string, width?: number, height?: number, key?: IframeNodeKey) {
        super(key);
        this.__src = src;
        this.__width = width || 800;
        this.__height = height || 450;
    }

    createDOM(): HTMLElement {
        const div = document.createElement("div");
        div.style.margin = "10px 0";
        div.className = "iframe-node-container";
        return div;
    }

    updateDOM(): false {
        return false;
    }

    exportDOM(): IframeDOMExportOutput {
        const container = document.createElement("div");
        container.innerHTML = IFRAME_CSS_VARS;

        const wrapper = document.createElement("div");
        wrapper.setAttribute("data-lexical-iframe", "true");
        wrapper.setAttribute("data-src", this.__src);
        wrapper.setAttribute("data-width", String(this.__width));
        wrapper.setAttribute("data-height", String(this.__height));
        wrapper.style.cssText = "position: relative; margin: 10px 0;";

        const iframe = document.createElement("iframe");
        iframe.setAttribute("src", this.__src);
        iframe.setAttribute("width", String(this.__width));
        iframe.setAttribute("height", String(this.__height));
        iframe.setAttribute("allowfullscreen", "true");
        iframe.style.cssText = `
            border: 1px solid var(--color-border);
            border-radius: 4px;
            max-width: 100%;
            display: block;
        `;

        wrapper.appendChild(iframe);

        // const hint = document.createElement("div");
        // hint.style.cssText = `
        //     margin-top: 8px;
        //     font-size: 12px;
        //     color: var(--color-text);
        //     opacity: 0.7;
        //     font-style: italic;
        //     line-height: 1.5;
        // `;
        // hint.innerHTML = `
        //     If iframe doesn't load, the website may not allow embedding. Use embed URLs:<br>
        //     • YouTube: https://www.youtube.com/embed/VIDEO_ID<br>
        //     • Google Maps: Use the "Embed a map" option from Share menu
        // `;
        // wrapper.appendChild(hint);

        container.appendChild(wrapper);
        return { element: container };
    }

    static importDOM(): IframeDOMConversionMap | null {
        return {
            div: (domNode: HTMLElement) => {
                if (!domNode.hasAttribute('data-lexical-iframe')) {
                    return null;
                }
                return {
                    conversion: (element: HTMLElement): IframeDOMConversionOutput | null => {
                        const src = element.getAttribute('data-src');
                        const widthStr = element.getAttribute('data-width');
                        const heightStr = element.getAttribute('data-height');

                        if (!src) return null;

                        const width = widthStr ? parseInt(widthStr, 10) : 800;
                        const height = heightStr ? parseInt(heightStr, 10) : 450;

                        const node = $createIframeNode({ src, width, height });
                        return { node };
                    },
                    priority: 1,
                };
            },
            iframe: () => ({
                conversion: (element: HTMLElement): IframeDOMConversionOutput | null => {
                    const iframe = element as HTMLIFrameElement;
                    const src = iframe.src;

                    if (!src) return null;

                    const width = iframe.width ? parseInt(iframe.width, 10) : 800;
                    const height = iframe.height ? parseInt(iframe.height, 10) : 450;

                    const node = $createIframeNode({ src, width, height });
                    return { node };
                },
                priority: 0,
            }),
        };
    }

    exportJSON(): SerializedIframeNode {
        return {
            src: this.__src,
            width: this.__width,
            height: this.__height,
            type: "iframe",
            version: 1,
        };
    }

    static importJSON(serializedNode: SerializedIframeNode): IframeNode {
        return $createIframeNode({
            src: serializedNode.src,
            width: serializedNode.width,
            height: serializedNode.height,
        });
    }

    isInline(): boolean {
        return false;
    }

    decorate(): JSXIframe.Element {
        return (
            <div style={{ position: 'relative', margin: '10px 0' }}>
                <iframe
                    src={this.__src}
                    width={this.__width}
                    height={this.__height}
                    style={{
                        border: '1px solid var(--color-border, #E5E5E5)',
                        borderRadius: '4px',
                        maxWidth: '100%',
                        display: 'block',
                    }}
                    allowFullScreen
                    sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                    loading="lazy"
                />
                {/* <div style={{
                    marginTop: '8px',
                    fontSize: '12px',
                    color: 'var(--color-text, #333)',
                    opacity: 0.7,
                    fontStyle: 'italic',
                    lineHeight: 1.5,
                }}>
                    If iframe doesn&apos;t load, the website may not allow embedding. Use embed URLs:
                    <br />
                    • YouTube: https://www.youtube.com/embed/VIDEO_ID
                    <br />
                    • Google Maps: Use the &quot;Embed a map&quot; option from Share menu
                </div> */}
            </div>
        );
    }
}

export function $createIframeNode({ src, width, height }: { src: string; width?: number; height?: number; }): IframeNode {
    return new IframeNode(src, width, height);
}

export function $isIframeNode(node: IframeLexicalNode | null | undefined): node is IframeNode {
    return node instanceof IframeNode;
}