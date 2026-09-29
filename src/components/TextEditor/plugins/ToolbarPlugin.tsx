import React, {
    useState,
    useCallback,
    useEffect,
    useRef,
    useMemo,
} from "react";
import { useTranslations } from "next-intl";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
    $getSelection,
    $isRangeSelection,
    FORMAT_TEXT_COMMAND,
    FORMAT_ELEMENT_COMMAND,
    UNDO_COMMAND,
    REDO_COMMAND,
    $createParagraphNode,
    ElementFormatType,
    LexicalNode,
} from "lexical";
import {
    INSERT_ORDERED_LIST_COMMAND,
    INSERT_UNORDERED_LIST_COMMAND,
} from "@lexical/list";
import {
    $createHeadingNode,
    $createQuoteNode,
    $isHeadingNode,
    $isQuoteNode,
    HeadingTagType,
} from "@lexical/rich-text";
import { $setBlocksType } from "@lexical/selection";
import { TOGGLE_LINK_COMMAND, $isLinkNode } from "@lexical/link";
import { Icon } from "../components/Icon";
import {
    INSERT_IMAGE_COMMAND,
    INSERT_VIDEO_COMMAND,
    INSERT_PDF_COMMAND,
    INSERT_IFRAME_COMMAND,
    INSERT_ALBUM_COMMAND,
    TOGGLE_SOURCE_EDITOR_COMMAND,
    SET_TEXT_COLOR_COMMAND,
    SET_BACKGROUND_COLOR_COMMAND,
    SET_FONT_FAMILY_COMMAND,
    SET_FONT_SIZE_COMMAND,
} from "../commands/editorCommands";
import { ResolvedEditorConfig, FontFamilyOption } from "../config/editorConfigTypes";
import { uploadToExternalStorage } from "../utils/uploadFile";
import { MediaLibraryModal } from "../components/MediaLibraryModal";
import { resizeImage } from "../utils/imageResize";
import { ICONS } from "../components/icons";
import { DEFAULT_COLOR_PRESETS, DEFAULT_FONT_SIZE_VALUES, HEADING_TAGS } from "../utils/defaults";

// Custom Tooltip Component
const Tooltip = ({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) => {
    return (
        <div className="EditorToolbar-tooltipWrapper" data-title={title}>
            {children}
        </div>
    );
};

// Custom Dropdown Component
const Dropdown = ({
    trigger,
    isOpen,
    onClose,
    children,
}: {
    trigger: React.ReactNode;
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}) => {
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen, onClose]);

    return (
        <div className="EditorToolbar-group" ref={dropdownRef}>
            {trigger}
            {isOpen && <div className="EditorToolbar-dropdown">{children}</div>}
        </div>
    );
};

export function ToolbarPlugin({ config }: { config: ResolvedEditorConfig }) {
    const [editor] = useLexicalComposerContext();
    const t = useTranslations("editor.toolbar");
    const tPrompts = useTranslations("editor.prompts");
    const tAlerts = useTranslations("editor.alerts");
    const tFonts = useTranslations("editor.fonts");

    // Memoized so identity is stable across renders (only changes if the
    // translation function itself changes) - needed so callbacks that
    // depend on these arrays don't get invalidated on every render.
    const FONT_FAMILIES: FontFamilyOption[] = useMemo(() => {
        if (config.texts.fontFamilies.length > 0) {
            return config.texts.fontFamilies;
        }
        return [
            { label: tFonts("default"), value: "default" },
            { label: tFonts("arial"), value: "Arial, sans-serif" },
            { label: tFonts("georgia"), value: "Georgia, serif" },
            {
                label: tFonts("timesNewRoman"),
                value: '"Times New Roman", Times, serif',
            },
            {
                label: tFonts("courierNew"),
                value: '"Courier New", Courier, monospace',
            },
            { label: tFonts("verdana"), value: "Verdana, sans-serif" },
            {
                label: tFonts("trebuchetMS"),
                value: '"Trebuchet MS", sans-serif',
            },
            { label: tFonts("impact"), value: "Impact, sans-serif" },
            { label: tFonts("comicSansMS"), value: '"Comic Sans MS", cursive' },
        ];
    }, [tFonts, config.texts.fontFamilies]);

    const FONT_SIZES = useMemo(() => {
        const sizeValues =
            config.texts.fontSizes.length > 0 ? config.texts.fontSizes : DEFAULT_FONT_SIZE_VALUES;
        return [
            { label: tFonts("default"), value: "default" },
            ...sizeValues.map((size) => ({ label: size, value: size })),
        ];
    }, [tFonts, config.texts.fontSizes]);

    const COLOR_PRESETS =
        config.texts.colorPresets.length > 0 ? config.texts.colorPresets : DEFAULT_COLOR_PRESETS;

    const HEADING_LEVELS = config.texts.headingLevels;

    const [isBold, setIsBold] = useState(false);
    const [isItalic, setIsItalic] = useState(false);
    const [isUnderline, setIsUnderline] = useState(false);
    const [isStrikethrough, setIsStrikethrough] = useState(false);
    const [isLink, setIsLink] = useState(false);
    const [elementFormat, setElementFormat] =
        useState<ElementFormatType>("left");
    const [currentBlockType, setCurrentBlockType] = useState("paragraph");
    const [currentFontFamily, setCurrentFontFamily] = useState("Default");
    const [currentFontSize, setCurrentFontSize] = useState("16px");
    const [currentTextColor, setCurrentTextColor] = useState("#000000");
    const [currentBgColor, setCurrentBgColor] = useState("transparent");
    const [mediaModal, setMediaModal] = useState<null | "image" | "video" | "album">(null);

    // Dropdown states
    const [isHeadingOpen, setIsHeadingOpen] = useState(false);
    const [isFontFamilyOpen, setIsFontFamilyOpen] = useState(false);
    const [isFontSizeOpen, setIsFontSizeOpen] = useState(false);
    const [isColorOpen, setIsColorOpen] = useState(false);
    const [colorMode, setColorMode] = useState<"text" | "background">("text");

    const imageInputRef = useRef<HTMLInputElement>(null);
    const videoInputRef = useRef<HTMLInputElement>(null);
    const pdfInputRef = useRef<HTMLInputElement>(null);
    const albumInputRef = useRef<HTMLInputElement>(null);
    const colorPickerRef = useRef<HTMLDivElement>(null);

    const updateToolbar = useCallback(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
            // Update text formatting
            setIsBold(selection.hasFormat("bold"));
            setIsItalic(selection.hasFormat("italic"));
            setIsUnderline(selection.hasFormat("underline"));
            setIsStrikethrough(selection.hasFormat("strikethrough"));

            const anchorNode = selection.anchor.getNode();
            const element = anchorNode.getTopLevelElementOrThrow();

            // Walk up from the anchor to see if the cursor/selection sits
            // inside a LinkNode, so the toolbar button can show an active
            // state and the prompt can be pre-filled with the existing URL.
            let linkAncestor: LexicalNode | null = anchorNode;
            let foundLink = false;
            while (linkAncestor !== null) {
                if ($isLinkNode(linkAncestor)) {
                    foundLink = true;
                    break;
                }
                linkAncestor = linkAncestor.getParent();
            }
            setIsLink(foundLink);

            // Get element format - always set it, even if it's the default
            const format = element.getFormatType();
            setElementFormat(format || "left");

            // Get block type (paragraph, heading, quote, etc.)
            if ($isHeadingNode(element)) {
                setCurrentBlockType(element.getTag());
            } else if ($isQuoteNode(element)) {
                setCurrentBlockType("quote");
            } else {
                setCurrentBlockType("paragraph");
            }

            // Get the actual text node to read inline styles (font size, color, etc.)
            // These are applied as inline styles on text nodes, not block elements
            const nodes = selection.getNodes();
            const textNode = nodes.length > 0 ? nodes[0] : anchorNode;
            const textNodeDOM = editor.getElementByKey(textNode.getKey());

            // Only update inline styles if we have actual text content
            // This prevents resetting to defaults when cursor is in empty paragraph
            const hasTextContent =
                textNode.getTextContent && textNode.getTextContent().length > 0;

            if (textNodeDOM && hasTextContent) {
                const computedStyle = window.getComputedStyle(textNodeDOM);

                // Get font family
                const fontFamily =
                    computedStyle.getPropertyValue("font-family");
                if (fontFamily) {
                    // Clean up the font family string - remove quotes and get first font
                    const cleanedFamily = fontFamily
                        .split(",")[0]
                        .replace(/['"]/g, "")
                        .trim()
                        .toLowerCase();

                    const matchedFont = FONT_FAMILIES.find((f) => {
                        const cleanedValue = f.value
                            .split(",")[0]
                            .replace(/['"]/g, "")
                            .trim()
                            .toLowerCase();
                        return (
                            cleanedFamily === cleanedValue ||
                            cleanedFamily.includes(cleanedValue)
                        );
                    });

                    if (matchedFont) {
                        setCurrentFontFamily(matchedFont.label);
                    }
                }

                // Get font size - read actual computed value
                const fontSize = computedStyle.getPropertyValue("font-size");
                if (fontSize) {
                    // Round to nearest pixel for cleaner display
                    const pxValue = Math.round(parseFloat(fontSize));
                    setCurrentFontSize(`${pxValue}px`);
                }

                // Get text color
                const color = computedStyle.getPropertyValue("color");
                if (color) {
                    const rgbMatch = color.match(
                        /rgb\((\d+),\s*(\d+),\s*(\d+)\)/
                    );
                    if (rgbMatch) {
                        const hex =
                            "#" +
                            [1, 2, 3]
                                .map((i) =>
                                    parseInt(rgbMatch[i])
                                        .toString(16)
                                        .padStart(2, "0")
                                )
                                .join("");
                        setCurrentTextColor(hex);
                    } else if (color.startsWith("#")) {
                        setCurrentTextColor(color);
                    }
                }

                // Get background color
                const bgColor =
                    computedStyle.getPropertyValue("background-color");
                if (
                    bgColor &&
                    bgColor !== "rgba(0, 0, 0, 0)" &&
                    bgColor !== "transparent"
                ) {
                    const rgbMatch = bgColor.match(
                        /rgb\((\d+),\s*(\d+),\s*(\d+)\)/
                    );
                    if (rgbMatch) {
                        const hex =
                            "#" +
                            [1, 2, 3]
                                .map((i) =>
                                    parseInt(rgbMatch[i])
                                        .toString(16)
                                        .padStart(2, "0")
                                )
                                .join("");
                        setCurrentBgColor(hex);
                    } else if (bgColor.startsWith("#")) {
                        setCurrentBgColor(bgColor);
                    }
                } else if (hasTextContent) {
                    // Only reset to transparent if we're reading from actual text
                    setCurrentBgColor("transparent");
                }
            }
            // If no text content, keep the current toolbar states (don't reset them)
        }
    }, [editor, FONT_FAMILIES]);

    useEffect(() => {
        return editor.registerUpdateListener(({ editorState }) => {
            editorState.read(() => {
                updateToolbar();
            });
        });
    }, [editor, updateToolbar]);

    // Close color picker when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                colorPickerRef.current &&
                !colorPickerRef.current.contains(event.target as Node)
            ) {
                setIsColorOpen(false);
            }
        };

        if (isColorOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isColorOpen]);

    const handleColorMenuOpen = (mode: "text" | "background") => {
        setColorMode(mode);
        setIsColorOpen(true);
    };

    const handleColorSelect = (color: string) => {
        if (colorMode === "text") {
            editor.dispatchCommand(SET_TEXT_COLOR_COMMAND, color);
            setCurrentTextColor(color === "inherit" ? "#000000" : color);
        } else {
            editor.dispatchCommand(SET_BACKGROUND_COLOR_COMMAND, color);
            setCurrentBgColor(color === "transparent" ? "transparent" : color);
        }
        setIsColorOpen(false);
    };

    const handleFontFamilySelect = (fontFamily: string, label: string) => {
        editor.dispatchCommand(SET_FONT_FAMILY_COMMAND, fontFamily);
        setCurrentFontFamily(label);
        setIsFontFamilyOpen(false);
    };

    const handleFontSizeSelect = (fontSize: string) => {
        editor.dispatchCommand(SET_FONT_SIZE_COMMAND, fontSize);
        setCurrentFontSize(fontSize === "default" ? "16px" : fontSize);
        setIsFontSizeOpen(false);
    };

    const formatHeading = (headingSize: HeadingTagType) => {
        editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
                $setBlocksType(selection, () =>
                    $createHeadingNode(headingSize)
                );
            }
        });
        setIsHeadingOpen(false);
    };

    const formatQuote = () => {
        editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
                $setBlocksType(selection, () => $createQuoteNode());
            }
        });
    };

    const formatParagraph = () => {
        editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
                $setBlocksType(selection, () => $createParagraphNode());
            }
        });
        setIsHeadingOpen(false);
    };

    // Reads the current selection to see if it's already inside a link
    // (so we can pre-fill the prompt with the existing URL for editing),
    // then prompts for a URL. An empty/cleared value removes the link;
    // Cancel leaves everything untouched.
    const insertLink = useCallback(() => {
        let existingUrl = "";
        editor.getEditorState().read(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
                let node: LexicalNode | null = selection.anchor.getNode();
                while (node !== null) {
                    if ($isLinkNode(node)) {
                        existingUrl = node.getURL();
                        break;
                    }
                    node = node.getParent();
                }
            }
        });

        const url = prompt(tPrompts("enterLinkURL"), existingUrl);
        if (url === null) return;

        const trimmed = url.trim();
        editor.dispatchCommand(TOGGLE_LINK_COMMAND, trimmed === "" ? null : trimmed);
    }, [editor, tPrompts]);

    const handleImageUpload = useCallback(
        async (event: React.ChangeEvent<HTMLInputElement>) => {
            const file = event.target.files?.[0];
            if (file && file.type.startsWith("image/")) {
                try {
                    let src: string;
                    if (config.media.externalStorage && config.media.storageURL) {
                        src = await uploadToExternalStorage(file, config.media);
                    } else {
                        src = await resizeImage(
                            file,
                            config.media.maxImageDimension,
                            config.media.maxImageDimension
                        );
                    }
                    editor.dispatchCommand(INSERT_IMAGE_COMMAND, {
                        src,
                        alt: file.name,
                    });
                } catch (error) {
                    console.error("Error processing image:", error);
                }
            }
            if (imageInputRef.current) {
                imageInputRef.current.value = "";
            }
        },
        [editor, config]
    );

    const handleVideoUpload = useCallback(
        async (event: React.ChangeEvent<HTMLInputElement>) => {
            const file = event.target.files?.[0];
            if (file && file.type.startsWith("video/")) {
                if (config.media.externalStorage && config.media.storageURL) {
                    try {
                        const src = await uploadToExternalStorage(file, config.media);
                        editor.dispatchCommand(INSERT_VIDEO_COMMAND, { src });
                    } catch (error) {
                        console.error("Error uploading video:", error);
                    }
                } else {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        const src = e.target?.result as string;
                        editor.dispatchCommand(INSERT_VIDEO_COMMAND, { src });
                    };
                    reader.readAsDataURL(file);
                }
            }
            if (videoInputRef.current) {
                videoInputRef.current.value = "";
            }
        },
        [editor, config]
    );

    const handlePDFUpload = useCallback(
        async (event: React.ChangeEvent<HTMLInputElement>) => {
            const file = event.target.files?.[0];
            if (file && file.type === "application/pdf") {
                if (config.media.externalStorage && config.media.storageURL) {
                    try {
                        const src = await uploadToExternalStorage(file, config.media);
                        editor.dispatchCommand(INSERT_PDF_COMMAND, {
                            src,
                            fileName: file.name,
                        });
                    } catch (error) {
                        console.error("Error uploading PDF:", error);
                    }
                } else {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        const src = e.target?.result as string;
                        editor.dispatchCommand(INSERT_PDF_COMMAND, {
                            src,
                            fileName: file.name,
                        });
                    };
                    reader.readAsDataURL(file);
                }
            }
            if (pdfInputRef.current) {
                pdfInputRef.current.value = "";
            }
        },
        [editor, config]
    );

    const handleAlbumUpload = useCallback(
        async (event: React.ChangeEvent<HTMLInputElement>) => {
            const files = event.target.files;
            if (files && files.length > 0) {
                const imageFiles = Array.from(files).filter((file) =>
                    file.type.startsWith("image/")
                );
                const limit = config.media.maxAlbumImages;
                const limitedFiles = imageFiles.slice(0, limit);

                if (limitedFiles.length < imageFiles.length) {
                    alert(
                        tAlerts("limitedImages", {
                            count: imageFiles.length - limit,
                        })
                    );
                }

                try {
                    const batchSize = 3;
                    const images = [];

                    for (let i = 0; i < limitedFiles.length; i += batchSize) {
                        const batch = limitedFiles.slice(i, i + batchSize);
                        const batchResults = await Promise.all(
                            batch.map(async (file) => ({
                                src:
                                    config.media.externalStorage &&
                                    config.media.storageURL
                                        ? await uploadToExternalStorage(file, config.media)
                                        : await resizeImage(
                                              file,
                                              config.media.maxImageDimension,
                                              config.media.maxImageDimension
                                          ),
                                alt: file.name,
                            }))
                        );
                        images.push(...batchResults);
                    }

                    if (images.length > 0) {
                        editor.dispatchCommand(INSERT_ALBUM_COMMAND, {
                            images,
                        });
                    }
                } catch (error) {
                    console.error("Error processing album:", error);
                    alert(tAlerts("errorProcessingImages"));
                }
            }
            if (albumInputRef.current) {
                albumInputRef.current.value = "";
            }
        },
        [editor, config, tAlerts]
    );

    const insertImageURL = useCallback(() => {
        const url = prompt(tPrompts("enterImageURL"));
        if (url) {
            editor.dispatchCommand(INSERT_IMAGE_COMMAND, {
                src: url,
                alt: "Image",
            });
        }
    }, [editor, tPrompts]);

    const insertIframe = useCallback(() => {
        const helpText = tPrompts("iframeHelp");

        alert(helpText);

        const url = prompt(tPrompts("enterIframeURL"));
        if (url) {
            const embedPatterns = [
                /youtube\.com\/embed\//,
                /player\.vimeo\.com/,
                /codepen\.io.*\/embed\//,
                /google\.com\/maps\/embed/,
                /spotify\.com\/embed/,
                /soundcloud\.com\/player/,
            ];

            const isLikelyEmbedUrl = embedPatterns.some((pattern) =>
                pattern.test(url)
            );

            if (!isLikelyEmbedUrl && !url.includes("/embed")) {
                const confirmAnyway = confirm(tPrompts("notEmbedURL"));
                if (!confirmAnyway) return;
            }

            const widthStr = prompt(tPrompts("enterWidth"));
            const heightStr = prompt(tPrompts("enterHeight"));

            const width = widthStr ? parseInt(widthStr, 10) : 800;
            const height = heightStr ? parseInt(heightStr, 10) : 450;

            editor.dispatchCommand(INSERT_IFRAME_COMMAND, {
                src: url,
                width,
                height,
            });
        }
    }, [editor, tPrompts]);

    const toggleSourceEditor = useCallback(() => {
        editor.dispatchCommand(TOGGLE_SOURCE_EDITOR_COMMAND, undefined);
    }, [editor]);

    const showHistory = config.history.undo || config.history.redo;
    const showFonts = config.texts.fontFamily || config.texts.fontSize;
    const showTextFormats =
        config.texts.bold ||
        config.texts.italic ||
        config.texts.underline ||
        config.texts.strikethrough ||
        config.texts.link;
    const showColors = config.texts.color || config.texts.backgroundColor;
    const showListsOrQuote = config.texts.lists || config.texts.quote;
    const showMedia =
        config.media.images ||
        config.media.albums ||
        config.media.videos ||
        config.media.pdf ||
        config.media.iframe;

    return (
        <>
            <div className="EditorToolbar">
                {showHistory && (
                    <>
                        <div className="EditorToolbar-group">
                            {config.history.undo && (
                                <Tooltip title={t("undo")}>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            editor.dispatchCommand(
                                                UNDO_COMMAND,
                                                undefined
                                            )
                                        }
                                        className="EditorToolbar-button"
                                        aria-label={t("undo")}
                                    >
                                        <Icon
                                            src={ICONS.arrowCounterClockwise}
                                            size={20}
                                        />
                                    </button>
                                </Tooltip>
                            )}
                            {config.history.redo && (
                                <Tooltip title={t("redo")}>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            editor.dispatchCommand(
                                                REDO_COMMAND,
                                                undefined
                                            )
                                        }
                                        className="EditorToolbar-button"
                                        aria-label={t("redo")}
                                    >
                                        <Icon
                                            src={ICONS.arrowClockwise}
                                            size={20}
                                        />
                                    </button>
                                </Tooltip>
                            )}
                        </div>
                        <div className="EditorToolbar-divider"></div>
                    </>
                )}

                {config.texts.headings && (
                    <>
                        <Dropdown
                            isOpen={isHeadingOpen}
                            onClose={() => setIsHeadingOpen(false)}
                            trigger={
                                <Tooltip title={t("heading")}>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setIsHeadingOpen(!isHeadingOpen)
                                        }
                                        className="EditorToolbar-button"
                                        aria-label={t("heading")}
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "4px",
                                            minWidth: "60px",
                                        }}
                                    >
                                        <span
                                            style={{
                                                fontSize: "14px",
                                                fontWeight: 500,
                                            }}
                                        >
                                            {currentBlockType === "paragraph"
                                                ? "P"
                                                : currentBlockType === "quote"
                                                ? "Q"
                                                : currentBlockType.toUpperCase()}
                                        </span>
                                        <Icon
                                            src={ICONS.caretDown}
                                            size={12}
                                        />
                                    </button>
                                </Tooltip>
                            }
                        >
                            <button
                                type="button"
                                className="EditorToolbar-dropdown-item"
                                onClick={() => formatParagraph()}
                            >
                                <span style={{ fontSize: "14px" }}>
                                    {t("paragraph")}
                                </span>
                            </button>
                            {HEADING_LEVELS.map((level) => {
                                const { tag, size } = HEADING_TAGS[level];
                                return (
                                    <button
                                        key={tag}
                                        type="button"
                                        className="EditorToolbar-dropdown-item"
                                        onClick={() => formatHeading(tag)}
                                    >
                                        <span
                                            style={{
                                                fontSize: size,
                                                fontWeight: "bold",
                                            }}
                                        >
                                            {t(`heading${level}` as "heading1")}
                                        </span>
                                    </button>
                                );
                            })}
                        </Dropdown>

                        <div className="EditorToolbar-divider"></div>
                    </>
                )}

                {showFonts && (
                    <>
                        {config.texts.fontFamily && (
                            <Dropdown
                                isOpen={isFontFamilyOpen}
                                onClose={() => setIsFontFamilyOpen(false)}
                                trigger={
                                    <Tooltip title={t("fontFamily")}>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setIsFontFamilyOpen(
                                                    !isFontFamilyOpen
                                                )
                                            }
                                            className="EditorToolbar-button"
                                            aria-label={t("fontFamily")}
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "4px",
                                                minWidth: "10rem",
                                            }}
                                        >
                                            <span
                                                style={{
                                                    fontSize: "14px",
                                                    flex: 1,
                                                    textAlign: "start",
                                                }}
                                            >
                                                {currentFontFamily}
                                            </span>
                                            <Icon
                                                src={ICONS.caretDown}
                                                size={12}
                                            />
                                        </button>
                                    </Tooltip>
                                }
                            >
                                {FONT_FAMILIES.map((font) => (
                                    <button
                                        type="button"
                                        key={font.value}
                                        className="EditorToolbar-dropdown-item"
                                        onClick={() =>
                                            handleFontFamilySelect(
                                                font.value,
                                                font.label
                                            )
                                        }
                                    >
                                        <span
                                            style={{
                                                fontFamily:
                                                    font.value === "default"
                                                        ? "inherit"
                                                        : font.value,
                                            }}
                                        >
                                            {font.label}
                                        </span>
                                    </button>
                                ))}
                            </Dropdown>
                        )}

                        {config.texts.fontSize && (
                            <Dropdown
                                isOpen={isFontSizeOpen}
                                onClose={() => setIsFontSizeOpen(false)}
                                trigger={
                                    <Tooltip title={t("fontSize")}>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setIsFontSizeOpen(
                                                    !isFontSizeOpen
                                                )
                                            }
                                            className="EditorToolbar-button"
                                            aria-label={t("fontSize")}
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "4px",
                                                minWidth: "4rem",
                                                fontWeight: "400",
                                            }}
                                        >
                                            <span style={{ fontSize: "14px" }}>
                                                {currentFontSize}
                                            </span>
                                            <Icon
                                                src={ICONS.caretDown}
                                                size={12}
                                            />
                                        </button>
                                    </Tooltip>
                                }
                            >
                                {FONT_SIZES.map((size) => (
                                    <button
                                        type="button"
                                        key={size.value}
                                        className="EditorToolbar-dropdown-item"
                                        onClick={() =>
                                            handleFontSizeSelect(size.value)
                                        }
                                    >
                                        <span
                                            style={{
                                                fontSize:
                                                    size.value === "default"
                                                        ? "14px"
                                                        : size.value,
                                            }}
                                        >
                                            {size.label}
                                        </span>
                                    </button>
                                ))}
                            </Dropdown>
                        )}

                        <div className="EditorToolbar-divider"></div>
                    </>
                )}

                {showTextFormats && (
                    <>
                        <div className="EditorToolbar-group">
                            {config.texts.bold && (
                                <Tooltip title={t("bold")}>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            editor.dispatchCommand(
                                                FORMAT_TEXT_COMMAND,
                                                "bold"
                                            )
                                        }
                                        className={`EditorToolbar-button ${
                                            isBold
                                                ? "EditorToolbar-button--active"
                                                : ""
                                        }`}
                                        aria-label={t("bold")}
                                    >
                                        <Icon src={ICONS.bold} size={20} />
                                    </button>
                                </Tooltip>
                            )}
                            {config.texts.italic && (
                                <Tooltip title={t("italic")}>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            editor.dispatchCommand(
                                                FORMAT_TEXT_COMMAND,
                                                "italic"
                                            )
                                        }
                                        className={`EditorToolbar-button ${
                                            isItalic
                                                ? "EditorToolbar-button--active"
                                                : ""
                                        }`}
                                        aria-label={t("italic")}
                                    >
                                        <Icon src={ICONS.italic} size={20} />
                                    </button>
                                </Tooltip>
                            )}
                            {config.texts.underline && (
                                <Tooltip title={t("underline")}>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            editor.dispatchCommand(
                                                FORMAT_TEXT_COMMAND,
                                                "underline"
                                            )
                                        }
                                        className={`EditorToolbar-button ${
                                            isUnderline
                                                ? "EditorToolbar-button--active"
                                                : ""
                                        }`}
                                        aria-label={t("underline")}
                                    >
                                        <Icon
                                            src={ICONS.underline}
                                            size={20}
                                        />
                                    </button>
                                </Tooltip>
                            )}
                            {config.texts.strikethrough && (
                                <Tooltip title={t("strikethrough")}>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            editor.dispatchCommand(
                                                FORMAT_TEXT_COMMAND,
                                                "strikethrough"
                                            )
                                        }
                                        className={`EditorToolbar-button ${
                                            isStrikethrough
                                                ? "EditorToolbar-button--active"
                                                : ""
                                        }`}
                                        aria-label={t("strikethrough")}
                                    >
                                        <Icon
                                            src={ICONS.strikethrough}
                                            size={20}
                                        />
                                    </button>
                                </Tooltip>
                            )}
                            {config.texts.link && (
                                <Tooltip title={t("insertLink")}>
                                    <button
                                        type="button"
                                        onClick={insertLink}
                                        className={`EditorToolbar-button ${
                                            isLink
                                                ? "EditorToolbar-button--active"
                                                : ""
                                        }`}
                                        aria-label={t("insertLink")}
                                    >
                                        <Icon src={ICONS.link} size={20} />
                                    </button>
                                </Tooltip>
                            )}
                        </div>

                        <div className="EditorToolbar-divider"></div>
                    </>
                )}

                {showColors && (
                    <>
                        <div
                            className="EditorToolbar-group"
                            ref={colorPickerRef}
                            style={{ position: "relative" }}
                        >
                            {config.texts.color && (
                                <Tooltip title={t("textColor")}>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleColorMenuOpen("text")
                                        }
                                        className="EditorToolbar-button"
                                        aria-label={t("textColor")}
                                        style={{ position: "relative" }}
                                    >
                                        <Icon
                                            src={ICONS.paintBrush}
                                            size={20}
                                        />
                                        <div
                                            style={{
                                                position: "absolute",
                                                bottom: "4px",
                                                right: "4px",
                                                width: "12px",
                                                height: "12px",
                                                borderRadius: "50%",
                                                backgroundColor:
                                                    currentTextColor,
                                                border: "2px solid white",
                                                boxShadow:
                                                    "0 1px 3px rgba(0,0,0,0.3)",
                                            }}
                                        />
                                    </button>
                                </Tooltip>
                            )}
                            {config.texts.backgroundColor && (
                                <Tooltip title={t("backgroundColor")}>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleColorMenuOpen("background")
                                        }
                                        className="EditorToolbar-button"
                                        aria-label={t("backgroundColor")}
                                        style={{
                                            position: "relative",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "4px",
                                        }}
                                    >
                                        <Icon
                                            src={ICONS.paintBrush}
                                            size={20}
                                        />
                                        <div
                                            style={{
                                                position: "absolute",
                                                bottom: "4px",
                                                right: "4px",
                                                width: "12px",
                                                height: "12px",
                                                borderRadius: "50%",
                                                backgroundColor:
                                                    currentBgColor ===
                                                    "transparent"
                                                        ? "#ffffff"
                                                        : currentBgColor,
                                                border: "2px solid white",
                                                boxShadow:
                                                    "0 1px 3px rgba(0,0,0,0.3)",
                                            }}
                                        />
                                    </button>
                                </Tooltip>
                            )}

                            {isColorOpen && (
                                <div className="EditorToolbar-popover">
                                    <div
                                        style={{
                                            padding: "4px",
                                            maxWidth: "300px",
                                        }}
                                    >
                                        <div
                                            style={{
                                                display: "grid",
                                                gridTemplateColumns:
                                                    "repeat(10, 1fr)",
                                                gap: "4px",
                                                marginBottom: "8px",
                                            }}
                                        >
                                            {COLOR_PRESETS.map((color) => (
                                                <button
                                                    type="button"
                                                    key={color}
                                                    onClick={() =>
                                                        handleColorSelect(color)
                                                    }
                                                    style={{
                                                        width: "24px",
                                                        height: "24px",
                                                        backgroundColor: color,
                                                        border: "1px solid #ccc",
                                                        borderRadius: "4px",
                                                        cursor: "pointer",
                                                        padding: 0,
                                                    }}
                                                    aria-label={`Color ${color}`}
                                                />
                                            ))}
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleColorSelect(
                                                    colorMode === "text"
                                                        ? "inherit"
                                                        : "transparent"
                                                )
                                            }
                                            style={{
                                                width: "100%",
                                                padding: "8px",
                                                backgroundColor: "#f5f5f5",
                                                border: "1px solid #ccc",
                                                borderRadius: "4px",
                                                cursor: "pointer",
                                                fontSize: "14px",
                                            }}
                                        >
                                            {t("resetColor")}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="EditorToolbar-divider"></div>
                    </>
                )}

                {config.texts.alignment && (
                    <>
                        <div className="EditorToolbar-group">
                            <Tooltip title={t("alignLeft")}>
                                <button
                                    type="button"
                                    onClick={() =>
                                        editor.dispatchCommand(
                                            FORMAT_ELEMENT_COMMAND,
                                            "left"
                                        )
                                    }
                                    className={`EditorToolbar-button ${
                                        elementFormat === "left"
                                            ? "EditorToolbar-button--active"
                                            : ""
                                    }`}
                                    aria-label={t("alignLeft")}
                                >
                                    <Icon src={ICONS.alignLeft} size={20} />
                                </button>
                            </Tooltip>
                            <Tooltip title={t("alignCenter")}>
                                <button
                                    type="button"
                                    onClick={() =>
                                        editor.dispatchCommand(
                                            FORMAT_ELEMENT_COMMAND,
                                            "center"
                                        )
                                    }
                                    className={`EditorToolbar-button ${
                                        elementFormat === "center"
                                            ? "EditorToolbar-button--active"
                                            : ""
                                    }`}
                                    aria-label={t("alignCenter")}
                                >
                                    <Icon src={ICONS.alignCenter} size={20} />
                                </button>
                            </Tooltip>
                            <Tooltip title={t("alignRight")}>
                                <button
                                    type="button"
                                    onClick={() =>
                                        editor.dispatchCommand(
                                            FORMAT_ELEMENT_COMMAND,
                                            "right"
                                        )
                                    }
                                    className={`EditorToolbar-button ${
                                        elementFormat === "right"
                                            ? "EditorToolbar-button--active"
                                            : ""
                                    }`}
                                    aria-label={t("alignRight")}
                                >
                                    <Icon src={ICONS.alignRight} size={20} />
                                </button>
                            </Tooltip>
                            <Tooltip title={t("justify")}>
                                <button
                                    type="button"
                                    onClick={() =>
                                        editor.dispatchCommand(
                                            FORMAT_ELEMENT_COMMAND,
                                            "justify"
                                        )
                                    }
                                    className={`EditorToolbar-button ${
                                        elementFormat === "justify"
                                            ? "EditorToolbar-button--active"
                                            : ""
                                    }`}
                                    aria-label={t("justify")}
                                >
                                    <Icon
                                        src={ICONS.alignJustify}
                                        size={20}
                                    />
                                </button>
                            </Tooltip>
                        </div>

                        <div className="EditorToolbar-divider"></div>
                    </>
                )}

                {showListsOrQuote && (
                    <>
                        <div className="EditorToolbar-group">
                            {config.texts.lists && (
                                <>
                                    <Tooltip title={t("bulletList")}>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                editor.dispatchCommand(
                                                    INSERT_UNORDERED_LIST_COMMAND,
                                                    undefined
                                                )
                                            }
                                            className="EditorToolbar-button"
                                            aria-label={t("bulletList")}
                                        >
                                            <Icon
                                                src={ICONS.listBullets}
                                                size={20}
                                            />
                                        </button>
                                    </Tooltip>
                                    <Tooltip title={t("numberedList")}>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                editor.dispatchCommand(
                                                    INSERT_ORDERED_LIST_COMMAND,
                                                    undefined
                                                )
                                            }
                                            className="EditorToolbar-button"
                                            aria-label={t("numberedList")}
                                        >
                                            <Icon
                                                src={ICONS.listNumber}
                                                size={20}
                                            />
                                        </button>
                                    </Tooltip>
                                </>
                            )}
                            {config.texts.quote && (
                                <Tooltip title={t("quote")}>
                                    <button
                                        type="button"
                                        onClick={() => formatQuote()}
                                        className="EditorToolbar-button"
                                        aria-label={t("quote")}
                                    >
                                        <Icon src={ICONS.quotes} size={20} />
                                    </button>
                                </Tooltip>
                            )}
                        </div>

                        <div className="EditorToolbar-divider"></div>
                    </>
                )}

                {showMedia && (
                    <>
                        <div className="EditorToolbar-group">
                            {config.media.images && (
                                <Tooltip title={t("uploadImage")}>
                                    <button
                                        type="button"
                                        onClick={() => setMediaModal("image")}
                                        className="EditorToolbar-button"
                                        aria-label={t("uploadImage")}
                                    >
                                        <Icon
                                            src={ICONS.imageSquare}
                                            size={20}
                                        />
                                    </button>
                                </Tooltip>
                            )}

                            {config.media.albums && (
                                <Tooltip
                                    title={t("uploadPhotoAlbum", {
                                        max: config.media.maxAlbumImages,
                                    })}
                                >
                                    <button
                                        type="button"
                                        onClick={() => setMediaModal("album")}
                                        className="EditorToolbar-button"
                                        aria-label={t("uploadPhotoAlbum", {
                                            max: config.media.maxAlbumImages,
                                        })}
                                    >
                                        <Icon src={ICONS.album} size={20} />
                                    </button>
                                </Tooltip>
                            )}

                            {config.media.videos && (
                                <Tooltip title={t("uploadVideo")}>
                                    <button
                                        type="button"
                                        onClick={() => setMediaModal("video")}
                                        className="EditorToolbar-button"
                                        aria-label={t("uploadVideo")}
                                    >
                                        <Icon
                                            src={ICONS.videoFile}
                                            size={20}
                                        />
                                    </button>
                                </Tooltip>
                            )}

                            {config.media.pdf && (
                                <>
                                    <input
                                        type="file"
                                        ref={pdfInputRef}
                                        accept="application/pdf"
                                        onChange={handlePDFUpload}
                                        style={{ display: "none" }}
                                    />
                                    <Tooltip title={t("uploadPDF")}>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                pdfInputRef.current?.click()
                                            }
                                            className="EditorToolbar-button"
                                            aria-label={t("uploadPDF")}
                                        >
                                            <Icon
                                                src={ICONS.pdfDocument}
                                                size={20}
                                            />
                                        </button>
                                    </Tooltip>
                                </>
                            )}

                            {config.media.iframe && (
                                <Tooltip title={t("insertIframe")}>
                                    <button
                                        type="button"
                                        onClick={insertIframe}
                                        className="EditorToolbar-button"
                                        aria-label={t("insertIframe")}
                                    >
                                        <Icon
                                            src={ICONS.frameCorners}
                                            size={20}
                                        />
                                    </button>
                                </Tooltip>
                            )}

                            {config.media.images && (
                                <Tooltip title={t("insertImageURL")}>
                                    <button
                                        type="button"
                                        onClick={insertImageURL}
                                        className="EditorToolbar-button"
                                        aria-label={t("insertImageURL")}
                                    >
                                        <Icon src={ICONS.link} size={20} />
                                    </button>
                                </Tooltip>
                            )}
                        </div>

                        <div className="EditorToolbar-divider"></div>
                    </>
                )}

                {config.features.sourceEditor && (
                    <div className="EditorToolbar-group">
                        <Tooltip title={t("htmlSourceEditor")}>
                            <button
                                type="button"
                                onClick={toggleSourceEditor}
                                className="EditorToolbar-button"
                                aria-label={t("htmlSourceEditor")}
                            >
                                <Icon src={ICONS.code} size={20} />
                            </button>
                        </Tooltip>
                    </div>
                )}
            </div>

            {mediaModal && (
                <MediaLibraryModal
                    isOpen={!!mediaModal}
                    onClose={() => setMediaModal(null)}
                    mediaKind={mediaModal}
                    mediaConfig={config.media}
                    onInsert={(selected) => {
                        if (mediaModal === "video") {
                            if (selected[0])
                                editor.dispatchCommand(INSERT_VIDEO_COMMAND, {
                                    src: selected[0].src,
                                });
                        } else if (mediaModal === "album") {
                            if (selected.length === 1) {
                                editor.dispatchCommand(INSERT_IMAGE_COMMAND, {
                                    src: selected[0].src,
                                    alt: selected[0].alt,
                                });
                            } else if (selected.length > 1) {
                                editor.dispatchCommand(INSERT_ALBUM_COMMAND, {
                                    images: selected,
                                });
                            }
                        } else {
                            if (selected[0])
                                editor.dispatchCommand(INSERT_IMAGE_COMMAND, {
                                    src: selected[0].src,
                                    alt: selected[0].alt,
                                });
                        }
                        setMediaModal(null);
                    }}
                />
            )}
        </>
    );
}