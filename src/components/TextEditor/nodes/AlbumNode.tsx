import { JSX, useMemo, useState } from "react";
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
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useTranslations } from "next-intl";
import { buildAlbumCarouselMarkup, ImageData } from "../utils/carouselMarkup";
import { OPEN_ALBUM_EDITOR_COMMAND } from "../commands/editorCommands";

export type { ImageData };

export type SerializedAlbumNode = Spread<
    {
        images: ImageData[];
        uid: string;
    },
    SerializedLexicalNode
>;

function generateUid(): string {
    // must not start with a digit — used directly as CSS id/class
    return "alb" + Math.random().toString(36).slice(2, 9);
}

export class AlbumNode extends DecoratorNode<JSX.Element> {
    __images: ImageData[];
    __uid: string;

    static getType(): string {
        return "album";
    }

    static clone(node: AlbumNode): AlbumNode {
        return new AlbumNode(node.__images, node.__uid, node.__key);
    }

    constructor(images: ImageData[], uid?: string, key?: NodeKey) {
        super(key);
        this.__images = images;
        this.__uid = uid || generateUid();
    }

    createDOM(): HTMLElement {
        const div = document.createElement("div");
        div.style.margin = "10px 0";
        div.className = "album-node-container";
        return div;
    }

    updateDOM(): false {
        return false;
    }

    // Writable mutator used by the UPDATE_ALBUM_COMMAND handler to persist
    // a reordered/edited image list from the album editor modal.
    setImages(images: ImageData[]): void {
        const writable = this.getWritable();
        writable.__images = images;
    }

    getImages(): ImageData[] {
        return this.__images;
    }

    exportDOM(): DOMExportOutput {
        const container = document.createElement("div");
        container.setAttribute("data-lexical-album", "true");
        container.setAttribute("data-images", JSON.stringify(this.__images));
        container.setAttribute("data-uid", this.__uid);

        const { styleTag, bodyHtml } = buildAlbumCarouselMarkup(
            this.__images,
            this.__uid
        );
        container.innerHTML = `${styleTag}\n${bodyHtml}`;

        return { element: container };
    }

    static importDOM(): DOMConversionMap | null {
        return {
            div: (domNode: HTMLElement) => {
                if (!domNode.hasAttribute("data-lexical-album")) {
                    return null;
                }
                return {
                    conversion: (
                        element: HTMLElement
                    ): DOMConversionOutput | null => {
                        const imagesData = element.getAttribute("data-images");
                        if (!imagesData) return null;

                        try {
                            const images = JSON.parse(
                                imagesData
                            ) as ImageData[];
                            const uid =
                                element.getAttribute("data-uid") || undefined;
                            const node = $createAlbumNode({ images, uid });
                            return { node };
                        } catch (error) {
                            console.error(
                                "Failed to parse album images:",
                                error
                            );
                            return null;
                        }
                    },
                    priority: 1,
                };
            },
        };
    }

    exportJSON(): SerializedAlbumNode {
        return {
            images: this.__images,
            uid: this.__uid,
            type: "album",
            version: 1,
        };
    }

    static importJSON(serializedNode: SerializedAlbumNode): AlbumNode {
        return $createAlbumNode({
            images: serializedNode.images,
            uid: serializedNode.uid,
        });
    }

    isInline(): boolean {
        return false;
    }

    decorate(): JSX.Element {
        return (
            <AlbumCarouselHTML
                images={this.__images}
                uid={this.__uid}
                nodeKey={this.getKey()}
            />
        );
    }
}

// Renders the pure HTML/CSS carousel as-is. No React state needed for the
// carousel itself — the radios/labels drive everything. Memoizing the
// generated markup string means React won't re-touch that inner DOM (and
// won't reset which slide is active) unless the images or uid actually
// change. A sibling hover overlay (outside the dangerouslySetInnerHTML
// block) provides the "Edit Album" entry point without disturbing that.
function AlbumCarouselHTML({
    images,
    uid,
    nodeKey,
}: {
    images: ImageData[];
    uid: string;
    nodeKey: NodeKey;
}) {
    const [editor] = useLexicalComposerContext();
    const t = useTranslations("editor.toolbar");
    const [isHovered, setIsHovered] = useState(false);

    const html = useMemo(() => {
        const { styleTag, bodyHtml } = buildAlbumCarouselMarkup(images, uid);
        return `${styleTag}\n${bodyHtml}`;
    }, [images, uid]);

    if (images.length === 0) return null;

    return (
        <div
            contentEditable={false}
            style={{ position: "relative" }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div dangerouslySetInnerHTML={{ __html: html }} />
            {isHovered && (
                <button
                    type="button"
                    onClick={() =>
                        editor.dispatchCommand(OPEN_ALBUM_EDITOR_COMMAND, {
                            nodeKey,
                            images,
                        })
                    }
                    style={{
                        position: "absolute",
                        top: "22px",
                        right: "22px",
                        padding: "8px 14px",
                        border: "none",
                        borderRadius: "6px",
                        backgroundColor: "rgba(0,0,0,0.65)",
                        color: "#fff",
                        fontSize: "13px",
                        fontWeight: 600,
                        cursor: "pointer",
                        backdropFilter: "blur(3px)",
                        zIndex: 3,
                    }}
                >
                    {t("editAlbum")}
                </button>
            )}
        </div>
    );
}

export function $createAlbumNode({
    images,
    uid,
}: {
    images: ImageData[];
    uid?: string;
}): AlbumNode {
    return new AlbumNode(images, uid);
}

export function $isAlbumNode(
    node: LexicalNode | null | undefined
): node is AlbumNode {
    return node instanceof AlbumNode;
}
