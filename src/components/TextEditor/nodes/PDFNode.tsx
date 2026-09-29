import { JSX as JSXPdf } from "react";
import {
    DecoratorNode as PDFDecoratorNode,
    LexicalNode as PDFLexicalNode,
    NodeKey as PDFNodeKey,
    SerializedLexicalNode as PDFSerializedLexicalNode,
    Spread as PDFSpread,
    DOMExportOutput as PDFDOMExportOutput,
    DOMConversionMap as PDFDOMConversionMap,
    DOMConversionOutput as PDFDOMConversionOutput,
} from "lexical";

export type SerializedPDFNode = PDFSpread<
    {
        src: string;
        fileName: string;
    },
    PDFSerializedLexicalNode
>;

const PDF_CSS_VARS = `<style>:root{--color-primary:#4A72AA;--color-primary-hover:#346096;--color-secondary:#121929;--color-titles:#223354;--color-text:#333;--color-background:#F9F8F8;--color-card:#ffffff;--color-border:#E5E5E5}.dark-mode,[data-theme="dark"]{--color-primary:#5A8FD8;--color-primary-hover:#4A7FCA;--color-text:#e0e0e0;--color-background:#1e1e1e;--color-card:#2a2a2a;--color-border:#3a3a3a}</style>`;

export class PDFNode extends PDFDecoratorNode<JSXPdf.Element> {
    __src: string;
    __fileName: string;

    static getType(): string {
        return "pdf";
    }

    static clone(node: PDFNode): PDFNode {
        return new PDFNode(node.__src, node.__fileName, node.__key);
    }

    constructor(src: string, fileName: string, key?: PDFNodeKey) {
        super(key);
        this.__src = src;
        this.__fileName = fileName;
    }

    createDOM(): HTMLElement {
        const div = document.createElement("div");
        div.style.margin = "10px 0";
        div.className = "pdf-node-container";
        return div;
    }

    updateDOM(): false {
        return false;
    }

    exportDOM(): PDFDOMExportOutput {
        const container = document.createElement("div");
        container.setAttribute("data-lexical-pdf", "true");
        container.setAttribute("data-src", this.__src);
        container.setAttribute("data-filename", this.__fileName);

        container.innerHTML = PDF_CSS_VARS;

        const wrapper = document.createElement("div");
        wrapper.style.cssText = `
            border: 1px solid var(--color-border);
            border-radius: 8px;
            padding: 16px;
            margin: 10px 0;
            background-color: var(--color-background);
            transition: all 0.2s ease;
        `;

        const content = document.createElement("div");
        content.style.cssText = `
            display: flex;
            align-items: center;
            gap: 12px;
        `;

        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("width", "24");
        svg.setAttribute("height", "24");
        svg.setAttribute("viewBox", "0 0 24 24");
        svg.setAttribute("fill", "none");
        svg.setAttribute("stroke", "currentColor");
        svg.setAttribute("stroke-width", "2");
        svg.innerHTML = `
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
        `;
        content.appendChild(svg);

        const textContainer = document.createElement("div");
        textContainer.style.flex = "1";

        const title = document.createElement("div");
        title.textContent = this.__fileName;
        title.style.cssText = `
            font-weight: 600;
            margin-bottom: 4px;
            color: var(--color-text);
        `;
        textContainer.appendChild(title);

        const subtitle = document.createElement("div");
        subtitle.textContent = "PDF Document";
        subtitle.style.cssText = `
            font-size: 14px;
            color: var(--color-text);
            opacity: 0.7;
        `;
        textContainer.appendChild(subtitle);

        content.appendChild(textContainer);

        const link = document.createElement("a");
        link.href = this.__src;
        link.download = this.__fileName;
        link.textContent = "Download";
        link.style.cssText = `
            padding: 8px 16px;
            background-color: var(--color-primary);
            color: white;
            border-radius: 4px;
            text-decoration: none;
            font-size: 14px;
            font-weight: 500;
            transition: all 0.2s ease;
        `;
        content.appendChild(link);

        wrapper.appendChild(content);
        container.appendChild(wrapper);
        return { element: container };
    }

    static importDOM(): PDFDOMConversionMap | null {
        return {
            div: (domNode: HTMLElement) => {
                if (!domNode.hasAttribute('data-lexical-pdf')) {
                    return null;
                }
                return {
                    conversion: (element: HTMLElement): PDFDOMConversionOutput | null => {
                        const src = element.getAttribute('data-src');
                        const fileName = element.getAttribute('data-filename');

                        if (!src || !fileName) return null;

                        const node = $createPDFNode({ src, fileName });
                        return { node };
                    },
                    priority: 1,
                };
            },
        };
    }

    exportJSON(): SerializedPDFNode {
        return {
            src: this.__src,
            fileName: this.__fileName,
            type: "pdf",
            version: 1,
        };
    }

    static importJSON(serializedNode: SerializedPDFNode): PDFNode {
        return $createPDFNode({
            src: serializedNode.src,
            fileName: serializedNode.fileName,
        });
    }

    isInline(): boolean {
        return false;
    }

    decorate(): JSXPdf.Element {
        return (
            <div style={{
                border: '1px solid var(--color-border, #E5E5E5)',
                borderRadius: '8px',
                padding: '16px',
                margin: '10px 0',
                backgroundColor: 'var(--color-background, #F9F8F8)',
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                    </svg>
                    <div style={{ flex: 1 }}>
                        <div style={{
                            fontWeight: 600,
                            marginBottom: '4px',
                            color: 'var(--color-text, #333)',
                        }}>
                            {this.__fileName}
                        </div>
                        <div style={{
                            fontSize: '14px',
                            color: 'var(--color-text, #333)',
                            opacity: 0.7,
                        }}>
                            PDF Document
                        </div>
                    </div>
                    <a
                        href={this.__src}
                        download={this.__fileName}
                        style={{
                            padding: '8px 16px',
                            backgroundColor: 'var(--color-primary, #4A72AA)',
                            color: 'white',
                            borderRadius: '4px',
                            textDecoration: 'none',
                            fontSize: '14px',
                            fontWeight: 500,
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-primary-hover, #346096)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--color-primary, #4A72AA)'}
                    >
                        Download
                    </a>
                </div>
            </div>
        );
    }
}

export function $createPDFNode({ src, fileName }: { src: string; fileName: string }): PDFNode {
    return new PDFNode(src, fileName);
}

export function $isPDFNode(node: PDFLexicalNode | null | undefined): node is PDFNode {
    return node instanceof PDFNode;
}