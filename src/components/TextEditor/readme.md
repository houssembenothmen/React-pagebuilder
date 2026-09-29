# TextEditor – Configurable Rich Text Editor for Next.js

A fully configurable WYSIWYG rich text editor built on [Lexical](https://lexical.dev/), React, and Next.js (App Router), with i18n via `next-intl`, RTL (Arabic) support, a media library, and a pure HTML/CSS photo-album carousel that exports as self-contained HTML.

---

## Features

**Text formatting**
- Bold, italic, underline, strikethrough, links (edit existing links in place)
- Headings (H1–H6, configurable levels), quotes, ordered/unordered lists
- Font family, font size, text color, background color (with preset swatches)
- Text alignment (left / center / right / justify)
- Markdown shortcuts
- Undo / redo history
- Live word count
- Automatic LTR/RTL direction (`ar` locale → RTL)

**Media**
- Images, videos, PDFs, and iframes (embeds)
- Photo albums: a no-JavaScript, radio-driven carousel with a synced thumbnail strip
- **Media library modal**: browse, search, and upload (drag & drop or file picker)
- **Album editor modal**: drag-to-reorder, remove, and add more images
- Upload to an external storage API, or fall back to inline base64 (images are resized client-side)

**Output**
- HTML output with inline styles and an embedded theme `<style>` block (light + dark mode via CSS variables)
- HTML source editor toggle
- Custom nodes round-trip: exported HTML can be re-imported into the editor (`data-lexical-*` attributes)

**Customization**
- Every toolbar feature can be toggled through a single config object
- Full theme control (light and dark palettes)
- Custom font lists, font sizes, heading levels, and color presets

---

## Tech Stack

| Area | Library |
|---|---|
| Framework | Next.js (App Router), React |
| Editor core | Lexical (`lexical`, `@lexical/react`, `@lexical/rich-text`, `@lexical/list`, `@lexical/link`, `@lexical/code`, `@lexical/table`, `@lexical/html`, `@lexical/selection`, `@lexical/markdown`) |
| i18n | `next-intl` |
| Styling | SCSS + CSS variables |
| Language | TypeScript |

---

## Project Structure

```
TextEditor/
├── index.tsx                     # Public exports
├── LexicalEditor.tsx             # Main editor component (forwardRef)
├── assets/icons/*.svg            # Toolbar icons
├── commands/
│   └── editorCommands.ts         # Custom Lexical commands
├── components/
│   ├── AlbumEditorModal.tsx      # Reorder / edit album images
│   ├── MediaLibraryModal.tsx     # Library browser + uploader
│   ├── Icon.tsx                  # Inline SVG icon (inherits currentColor)
│   ├── icons.ts                  # Icon name → asset map
│   └── Placeholder.tsx
├── config/
│   ├── editorConfig.ts           # Lexical initial config + registered nodes
│   ├── editorConfigTypes.ts      # EditorConfig / ResolvedEditorConfig types
│   └── mergeEditorConfig.ts      # Defaults + user config merge
├── nodes/
│   ├── ImageNode.tsx
│   ├── VideoNode.tsx
│   ├── PDFNode.tsx
│   ├── IframeNode.tsx
│   └── AlbumNode.tsx
├── plugins/
│   ├── ToolbarPlugin.tsx
│   ├── MediaPlugin.tsx           # INSERT_* / UPDATE_ALBUM handlers
│   ├── AlbumEditorPlugin.tsx
│   ├── ColorPlugin.tsx
│   ├── FontPlugin.tsx
│   ├── DirectionPlugin.tsx
│   ├── InitialContentPlugin.tsx
│   ├── AppendContentPlugin.tsx
│   ├── OnChangePluginComponent.tsx  # Debounced HTML export + inline styling
│   ├── SourceEditorPlugin.tsx
│   └── WordCountPlugin.tsx
├── styles/
│   ├── main.scss
│   └── toolbar.scss
└── utils/
    ├── carouselMarkup.ts         # Builds the album carousel HTML + CSS
    ├── defaults.ts
    ├── htmlInput.ts
    ├── imageResize.ts
    ├── mediaLibrary.ts           # fetchMediaList()
    ├── objectPath.ts             # getByPath()
    ├── textDirection.ts
    ├── themeCss.ts               # buildThemeStyleTag()
    ├── uploadFile.ts             # uploadToExternalStorage()
    └── url.ts
```

---

## Getting Started

### 1. Install dependencies

```bash
npm install lexical @lexical/react @lexical/rich-text @lexical/list @lexical/link \
  @lexical/code @lexical/table @lexical/html @lexical/selection @lexical/markdown \
  next-intl sass
```

### 2. SVG imports (Next.js)

The `Icon` component accepts both a plain URL string and the `{ src }` object Next.js produces for static imports, so no extra loader is needed.

### 3. Set up `next-intl`

Wrap your layout in `NextIntlClientProvider` (see `app/[locale]/layout.tsx`) and provide the translation namespaces listed [below](#translations).

### 4. Use the editor

```tsx
"use client";
import { useRef, useState } from "react";
import { LexicalEditor, LexicalEditorRef } from "@/components/TextEditor";
import type { EditorConfig } from "@/components/TextEditor/config/editorConfigTypes";

const config: EditorConfig = {
  media: { externalStorage: false },
};

export default function EditorClient({ locale }: { locale: string }) {
  const [value, setValue] = useState("");
  const editorRef = useRef<LexicalEditorRef>(null);

  return (
    <LexicalEditor
      ref={editorRef}
      setValue={setValue}
      initialValue={value}
      locale={locale}
      config={config}
    />
  );
}
```

---

## Component API

### `<LexicalEditor />`

| Prop | Type | Default | Description |
|---|---|---|---|
| `setValue` | `(html: string) => void` | required | Receives the styled HTML on every (debounced) change |
| `onChange` | `(html: string) => void` | – | Optional extra change callback |
| `initialValue` | `string` | `""` | Initial HTML (plain text is auto-wrapped in `<p>`) |
| `locale` | `string` | `"en"` | `"ar"` switches the editor to RTL |
| `config` | `EditorConfig` | defaults | See [Configuration](#configuration) |
| `ref` | `LexicalEditorRef` | – | Exposes `appendContent(html)` |

Changes are debounced (1000 ms) and processed during browser idle time. `onChange` fires only if the resulting HTML actually changed.

---

## Configuration

All options are optional and deep-merged with `DEFAULT_EDITOR_CONFIG`.

```ts
interface EditorConfig {
  media?:    EditorMediaConfig;
  texts?:    EditorTextConfig;
  history?:  { undo?: boolean; redo?: boolean };
  features?: { sourceEditor?: boolean; wordCount?: boolean; autoFocus?: boolean };
  theme?:    { namespace?: string; colors?: EditorThemeColors; darkColors?: EditorThemeColors };
}
```

### `media`

| Option | Default | Description |
|---|---|---|
| `images` / `albums` / `videos` / `pdf` / `iframe` | `true` | Enable each media type |
| `externalStorage` | `false` | Upload to your API instead of embedding base64 |
| `storageURL` | `""` | Base URL of your storage API |
| `uploadEndpoint` | `api/bo/content/upload/media` | POST endpoint (relative to `storageURL`) |
| `listEndpoint` | `api/bo/content/upload/media` | GET endpoint for the media library |
| `uploadToken` | `""` | Bearer token for upload + list requests |
| `maxAlbumImages` | `20` | Max images per album |
| `maxImageDimension` | `1200` | Max width/height when resizing locally (px) |
| `responseFilePaths` | `["url", "media"]` | Dot-paths tried in order to find the uploaded file URL |
| `responseListPaths` | `["medias","media","items","data"]` | Dot-paths tried in order to find the media array |

### `texts`

Boolean toggles: `bold`, `italic`, `underline`, `strikethrough`, `fontFamily`, `fontSize`, `color`, `backgroundColor`, `alignment`, `headings`, `lists`, `quote`, `link`, `direction`, `markdownShortcuts`.

Overrides: `fontFamilies` (`{label, value}[]`), `fontSizes` (`string[]`), `headingLevels` (`(1–6)[]`), `colorPresets` (`string[]`). Empty arrays fall back to built-in defaults.

### `theme`

Colors are emitted as CSS variables (`--color-primary`, `--color-text`, `--color-border`, …). Dark values apply under `.dark-mode` or `[data-theme="dark"]`.

---

## Storage API Contract

When `externalStorage` is enabled, the editor expects:

**Upload** – `POST {storageURL}/{uploadEndpoint}`
- `multipart/form-data` with the file in the `media` field
- `Authorization: Bearer <uploadToken>` header
- JSON response containing the file path/URL at one of `responseFilePaths` (relative paths are prefixed with `storageURL`)

**List** – `GET {storageURL}/{listEndpoint}`
- JSON response containing an array at one of `responseListPaths`
- Each entry may use: `_id`/`id`, `url`/`src`/`path`/`media`, `name`/`fileName`/`filename`, `mimetype`/`mimeType`/`type`, `thumbnail`/`thumbnailUrl`, `createdAt`

> ⚠️ **Never hardcode tokens in source.** Load `uploadToken` from a secure runtime source (session, server-issued short-lived token, etc.).

---

## Custom Commands

| Command | Payload |
|---|---|
| `INSERT_IMAGE_COMMAND` | `{ src, alt }` |
| `INSERT_VIDEO_COMMAND` | `{ src }` |
| `INSERT_PDF_COMMAND` | `{ src, fileName }` |
| `INSERT_IFRAME_COMMAND` | `{ src, width?, height? }` |
| `INSERT_ALBUM_COMMAND` | `{ images: {src, alt}[] }` |
| `OPEN_ALBUM_EDITOR_COMMAND` | `{ nodeKey, images }` |
| `UPDATE_ALBUM_COMMAND` | `{ nodeKey, images }` |
| `TOGGLE_SOURCE_EDITOR_COMMAND` | – |
| `SET_TEXT_COLOR_COMMAND` / `SET_BACKGROUND_COLOR_COMMAND` | `string` |
| `SET_FONT_FAMILY_COMMAND` / `SET_FONT_SIZE_COMMAND` | `string` |

---

## Album Carousel

`AlbumNode` renders a pure HTML/CSS carousel generated by `buildAlbumCarouselMarkup()`:

- Radio inputs + labels drive slides (no JavaScript at runtime)
- Synced sliding thumbnail strip, prev/next arrows, and slide counter
- Responsive thumbnail count (5 / 3 / 2)
- All IDs and classes are namespaced with a per-album `uid`, so multiple albums can coexist on one page
- Hovering an album in the editor shows an **Edit Album** button that opens the reorder modal

---

## Translations

Provide these `next-intl` namespaces:

| Namespace | Keys |
|---|---|
| `editor` | `placeholder` |
| `editor.footer` | `wordCount` (`{count}`) |
| `editor.toolbar` | `undo`, `redo`, `heading`, `paragraph`, `heading1`–`heading6`, `fontFamily`, `fontSize`, `bold`, `italic`, `underline`, `strikethrough`, `insertLink`, `textColor`, `backgroundColor`, `resetColor`, `alignLeft`, `alignCenter`, `alignRight`, `justify`, `bulletList`, `numberedList`, `quote`, `uploadImage`, `uploadPhotoAlbum` (`{max}`), `uploadVideo`, `uploadPDF`, `insertIframe`, `insertImageURL`, `htmlSourceEditor`, `editAlbum` |
| `editor.prompts` | `enterLinkURL`, `enterImageURL`, `iframeHelp`, `enterIframeURL`, `notEmbedURL`, `enterWidth`, `enterHeight` |
| `editor.alerts` | `limitedImages` (`{count}`), `errorProcessingImages` |
| `editor.fonts` | `default`, `arial`, `georgia`, `timesNewRoman`, `courierNew`, `verdana`, `trebuchetMS`, `impact`, `comicSansMS` |
| `editor.albumEditor` | `title`, `close`, `dragToReorder`, `countOfMax` (`{count}`, `{max}`), `empty`, `remove`, `addMore`, `cancel`, `save` |
| `editor.mediaLibrary` | `title`, `close`, `libraryTab`, `uploadTab`, `searchPlaceholder`, `loading`, `empty`, `selectedOrder`, `dragToReorder`, `remove`, `dropHint`, `browseHint`, `uploading`, `uploaded`, `uploadFailed`, `selectedCount` (`{count}`), `cancel`, `insert` |

---

## Exported HTML

`OnChangePluginComponent` post-processes the Lexical HTML:

1. Generates HTML from the editor state
2. Merges inline styles for headings, paragraphs, lists, links, code, images, etc. (existing inline styles win; album carousels are skipped)
3. Prepends a `<style>` block with theme CSS variables

The result is portable: drop it into any page and it renders correctly with light/dark themes.

---

## Notes & Known Limitations

- `dangerouslySetInnerHTML` is used for the album carousel and icons. Icons come from trusted local assets; album `src`/`alt` values are attribute-escaped.
- Iframes are rendered with `sandbox="allow-same-origin allow-scripts allow-popups allow-forms"`. Only embed sources you trust.
- Remove the leftover `console.log(album, typeof album)` in `components/icons.ts` before production.
- The `underline` icon is an inline placeholder; drop a real `underline.svg` into `assets/icons` to replace it.
- Selecting "Insert image by URL" uses `prompt()`; swap for a custom modal if you need a consistent UX.

---

## License

Add your license here (e.g., MIT).