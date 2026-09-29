// Main component
export { default as LexicalEditor } from './LexicalEditor';
export type { LexicalEditorRef } from './LexicalEditor';

// Nodes
export { ImageNode, $createImageNode, $isImageNode } from './nodes/ImageNode';
export type { SerializedImageNode } from './nodes/ImageNode';

export { VideoNode, $createVideoNode, $isVideoNode } from './nodes/VideoNode';
export type { SerializedVideoNode } from './nodes/VideoNode';

export { PDFNode, $createPDFNode, $isPDFNode } from './nodes/PDFNode';
export type { SerializedPDFNode } from './nodes/PDFNode';

export { IframeNode, $createIframeNode, $isIframeNode } from './nodes/IframeNode';
export type { SerializedIframeNode } from './nodes/IframeNode';

export { AlbumNode, $createAlbumNode, $isAlbumNode } from './nodes/AlbumNode';
export type { SerializedAlbumNode, ImageData } from './nodes/AlbumNode';

// Commands
export {
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
    OPEN_ALBUM_EDITOR_COMMAND,
     UPDATE_ALBUM_COMMAND
} from './commands/editorCommands';

// Plugins
export { MediaPlugin } from './plugins/MediaPlugin';
export { DirectionPlugin } from './plugins/DirectionPlugin';
export { InitialContentPlugin } from './plugins/InitialContentPlugin';
export { WordCountPlugin } from './plugins/WordCountPlugin';
export { AppendContentPlugin } from './plugins/AppendContentPlugin';
export { OnChangePluginComponent } from './plugins/OnChangePluginComponent';
export { ToolbarPlugin } from './plugins/ToolbarPlugin';
export { SourceEditorPlugin } from './plugins/SourceEditorPlugin';
export { ColorPlugin } from './plugins/ColorPlugin';
export { AlbumEditorPlugin } from './plugins/AlbumEditorPlugin';
export { FontPlugin } from './plugins/FontPlugin';

// Config
export { getEditorConfig, theme } from './config/editorConfig';
export { mergeEditorConfig, DEFAULT_EDITOR_CONFIG } from './config/mergeEditorConfig';
export type {
    EditorConfig,
    ResolvedEditorConfig,
    EditorMediaConfig,
    EditorTextConfig,
    EditorHistoryConfig,
    EditorFeaturesConfig,
    EditorThemeConfig,
    EditorThemeColors,
    FontFamilyOption,
} from './config/editorConfigTypes';

// Components
export { Placeholder } from './components/Placeholder';

// Utilities
export {
    isArabicText,
    isArabicTextStrict,
    getTextDirection,
    getArabicPercentage
} from './utils/textDirection';
export { uploadToExternalStorage } from './utils/uploadFile';
export { fetchMediaList } from './utils/mediaLibrary';
export type { MediaItem } from './utils/mediaLibrary';
export { getByPath } from './utils/objectPath';
export { joinUrl } from './utils/url';
export { buildThemeStyleTag } from './utils/themeCss';
export { ensureBlockHtml } from './utils/htmlInput';