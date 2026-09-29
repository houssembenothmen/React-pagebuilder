export interface EditorMediaConfig {
    images?: boolean;
    albums?: boolean;
    videos?: boolean;
    pdf?: boolean;
    iframe?: boolean;
    externalStorage?: boolean;
    storageURL?: string;
    /** Endpoint (relative to storageURL) used to POST new media, e.g. "api/bo/content/upload/media" */
    uploadEndpoint?: string;
    /** Endpoint (relative to storageURL) used to GET the media library list */
    listEndpoint?: string;
    /** Bearer token used for both upload and list requests. Never hardcode this in code — always pass it in. */
    uploadToken?: string;
    maxAlbumImages?: number;
    maxImageDimension?: number;
    /**
     * Dot-notation paths checked, in order, against the upload endpoint's
     * JSON response to find the uploaded file's path/URL. First path that
     * resolves to a non-empty string wins. Example: ["url", "media.cleanFilePath"]
     */
    responseFilePaths?: string[];
    /**
     * Dot-notation paths checked, in order, against the list endpoint's
     * JSON response to find the array of media entries.
     * Example: ["medias", "data.items"]
     */
    responseListPaths?: string[];
}

export interface FontFamilyOption {
    label: string;
    value: string;
}

export interface EditorTextConfig {
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    strikethrough?: boolean;
    fontFamily?: boolean;
    fontSize?: boolean;
    color?: boolean;
    backgroundColor?: boolean;
    alignment?: boolean;
    headings?: boolean;
    lists?: boolean;
    quote?: boolean;
    link?: boolean;
    direction?: boolean;
    markdownShortcuts?: boolean;
    /** Overrides the toolbar's font-family dropdown options entirely. */
    fontFamilies?: FontFamilyOption[];
    /** Overrides the toolbar's font-size dropdown options, e.g. ["12px","14px","16px"] */
    fontSizes?: string[];
    /** Which heading levels (1-6) to expose in the heading dropdown, in order. */
    headingLevels?: (1 | 2 | 3 | 4 | 5 | 6)[];
    /** Overrides the color-picker preset swatches. */
    colorPresets?: string[];
}

export interface EditorHistoryConfig {
    undo?: boolean;
    redo?: boolean;
}

export interface EditorFeaturesConfig {
    sourceEditor?: boolean;
    wordCount?: boolean;
    autoFocus?: boolean;
}

export interface EditorThemeColors {
    primary?: string;
    primaryHover?: string;
    secondary?: string;
    titles?: string;
    text?: string;
    background?: string;
    card?: string;
    divider?: string;
    disabled?: string;
    border?: string;
    borderLight?: string;
}

export interface EditorThemeConfig {
    /** Lexical namespace, also usable to scope CSS if multiple editors share a page. */
    namespace?: string;
    colors?: EditorThemeColors;
    darkColors?: EditorThemeColors;
}

export interface EditorConfig {
    media?: EditorMediaConfig;
    texts?: EditorTextConfig;
    history?: EditorHistoryConfig;
    features?: EditorFeaturesConfig;
    theme?: EditorThemeConfig;
}

type Resolved<T> = { [K in keyof T]-?: T[K] };

export interface ResolvedEditorConfig {
    media: Resolved<EditorMediaConfig>;
    texts: Resolved<EditorTextConfig>;
    history: Resolved<EditorHistoryConfig>;
    features: Resolved<EditorFeaturesConfig>;
    theme: {
        namespace: string;
        colors: Required<EditorThemeColors>;
        darkColors: Required<EditorThemeColors>;
    };
}