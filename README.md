# Page Builder

A drag-and-drop page builder for Next.js. It is designed to be embedded in dashboards (OTT platforms, media sites) so editors can create custom pages, which are then exported as HTML or JSON and rendered by a Next.js frontend.

## Features

- Drag-and-drop canvas with nested containers (Section, Row, Column, Grid, Card, Layer Stack, Container)
- 55+ components: layout, typography, content, media, navigation, forms, social, advanced, e-commerce
- Universal style settings for every element: size, spacing (per-side, RTL-safe logical properties), background, border, shadow, opacity, typography, overflow, transform, cursor
- **Page root**: a non-deletable element wrapping everything, with its own settings (max-width, padding, margin, background, direction, gap, alignment)
- Inline editing (`contentEditable`) plus a settings panel for per-component fields
- Pluggable rich-text editor (Lexical adapter included)
- Sidebar search, favorites, recently used, and context-aware filtering (`allowedChildren`)
- Exports: standalone HTML, and JSON for a runtime renderer
- i18n through `next-intl` (LTR and RTL; `ar` is supported)

## Tech stack

Next.js (App Router), React, TypeScript, SCSS, `next-intl`, `lucide-react`.

## Project structure

```
components/pagebuilder/
├── core/
│   ├── PageBuilder.tsx          # Entry component (registers components, providers)
│   ├── StyleInjector.tsx        # Injects every component's `css` into the editor
│   ├── registry.ts              # Component registry (singleton)
│   ├── types.ts                 # CanvasComponent, ComponentDefinition, LayoutStyle...
│   ├── page.ts                  # Page root node, defaults, style computation
│   ├── pageDefinition.ts        # Hidden "Page" definition used by the settings panel
│   ├── dnd.ts, ids.ts
│   ├── context/                 # PageBuilderContext, RichTextEditorContext
│   ├── components/              # EditableText
│   ├── export/                  # exportHtml.ts, exportStyles.ts
│   ├── render/                  # CanvasNode, ComponentRenderer, DropZone
│   ├── ui/                      # Layout, Canvas, Sidebar, SettingsPanel, ExportBar
│   │   └── settings/            # SettingsSection, SpacingControl, BorderControl, BoxShadowControl
│   ├── utils/                   # layoutStyle.ts, escapeHtml.ts, mixins
│   └── styles/                  # SCSS (variables, reset, layout, sidebar, settings)
├── library/                     # All component definitions, grouped by category
│   └── index.ts                 # exports `coreLibrary`
├── adapters/
│   └── LexicalRichTextEditor.tsx
└── renderer/                    # Runtime renderer for exported JSON
    ├── PageRenderer.tsx
    └── runtime.tsx
```

## Usage

```tsx
"use client";

import PageBuilder from "@/components/pagebuilder/core/PageBuilder";
import { coreLibrary } from "@/components/pagebuilder/library";
import LexicalRichTextEditor from "@/components/pagebuilder/adapters/LexicalRichTextEditor";

export default function Client() {
    return <PageBuilder components={coreLibrary} richTextEditor={LexicalRichTextEditor} />;
}
```

| Prop             | Description                                                              |
| ---------------- | ------------------------------------------------------------------------ |
| `components`     | Every component the builder should offer (core library plus your extras) |
| `richTextEditor` | Optional component powering the "Rich Text" element                      |

## Core concepts

### Document model

```ts
interface CanvasComponent {
    id: string;
    title: string;               // key into the registry
    tag: string;
    props: Record<string, unknown>;
    children?: CanvasComponent[];
    layout?: LayoutStyle;        // universal styles
}
```

The page is `{ page, nodes }`. `page` holds the root's `props` and `layout`; `nodes` is the tree of components.

### Component definition

Each component is a `ComponentDefinition` with:

| Field                                    | Purpose                                                                  |
| ---------------------------------------- | ------------------------------------------------------------------------ |
| `title`, `group`, `icon`, `tag`, `label` | Identity and sidebar placement                                           |
| `defaultProps()`                         | Initial props                                                            |
| `fields`                                 | Settings panel fields (`text`, `textarea`, `number`, `boolean`, `select`, `stringList`, `numberList`, `date`) |
| `render({ node, props, set })`           | Editor rendering (inline editing)                                        |
| `renderStatic(props, node)`              | HTML string used by the exports and renderer fallback                    |
| `css`, `js`                              | Styles and scripts shipped with the export (JS only if the component is used) |
| `isContainer`, `allowedChildren`         | Container behaviour and restrictions                                     |
| `containerStyle`, `itemPlacementStyle`   | Layout of a container and of its children (editor and static variants)   |
| `supportsTypography`                     | Enables the Typography section in settings                               |
| `hidden`                                 | Registered but not shown in the sidebar (used by the Page root)          |

### The page root

`PAGE_ROOT_ID` (`"__page__"`) is a virtual node outside `canvasItems`, so it cannot be moved or deleted. It is selected by default and by clicking the canvas background. Styles are computed by `computePageStyles()` in `core/page.ts`, which returns:

- `frame`: the box (size, margin, padding, background, border, typography)
- `flow`: how children are laid out (direction, gap, alignment)

The editor canvas, HTML export and `PageRenderer` all use this function, so output stays consistent.

## Adding a component

1. Create `library/<group>/<name>/index.tsx` exporting a `ComponentDefinition`.
2. Add it to `library/index.ts` (`coreLibrary`).

```tsx
import { Star } from "lucide-react";
import type { ComponentDefinition } from "@/components/pagebuilder/core/types";
import { escapeHtml } from "@/components/pagebuilder/core/utils/escapeHtml";
import EditableText from "@/components/pagebuilder/core/components/EditableText";

interface NoteProps { text: string }

const Note: ComponentDefinition<NoteProps> = {
    title: "Note",
    group: "Content",
    icon: Star,
    tag: "content",
    label: "Note",
    defaultProps: () => ({ text: "A note" }),
    fields: [{ key: "text", kind: "text", label: "Text" }],
    render: ({ props, set }) => (
        <div className="pb-el-note">
            <EditableText value={props.text} onChange={(text) => set({ text })} />
        </div>
    ),
    renderStatic: (props) => `<div class="pb-el-note">${escapeHtml(props.text)}</div>`,
    css: `.pb-el-note { padding: 8px; border: 1px solid var(--border-color); }`,
};

export default Note;
```

Rules to keep in mind:

- Always `escapeHtml` user values in `renderStatic`.
- Call `e.stopPropagation()` on interactive elements inside `render` so clicks don't change the selection.
- Prefer logical CSS properties (`border-inline-start`, `padding-inline-start`) so RTL works.
- Interactive behaviour in the export should use CSS-only techniques (`<details>`, radio inputs) or the `js` field.

## Exporting

### HTML

The **Export as HTML** button calls `buildExportHtml(canvasItems, page)` and downloads a self-contained `page.html`.

### JSON

The **Export JSON** button downloads:

```json
{
  "schemaVersion": 1,
  "page": { "props": {}, "layout": {} },
  "nodes": []
}
```

This is the format a Next.js frontend renders with `PageRenderer`.

## Rendering exported JSON (dev workflow)

For testing without a backend:

1. Build a page and click **Export JSON**.
2. Open `/<locale>/dev/upload`, choose a slug and upload the file. It is saved to `.pb-dev/<slug>.json` (disabled in production; add `.pb-dev` to `.gitignore`).
3. Open `/<locale>/<slug>`. The page route calls `getPublishedPage(slug)` and renders it with `<PageRenderer nodes={doc.nodes} page={doc.page} />`.

To go to production, replace the body of `getPublishedPage` in `lib/pages.ts` with a call to your API or database. Nothing else changes.

`PageRenderer` uses real React components from `renderer/runtime.tsx` when one exists for a component, and falls back to the definition's `renderStatic` otherwise. Migrate components to real runtime components one at a time.

## Styling

- Design tokens are CSS variables defined in `styles/utils/variables.scss` (`--primary-color`, `--surface-color`, ...). The export embeds equivalents in `exportStyles.ts`.
- Per-element styles are stored in `node.layout` and converted by `computeLayoutDecls()` in `utils/layoutStyle.ts`, which is the single source for both the editor (`layoutToCssObject`) and the export (`layoutToCssString`).

## Known limitations and roadmap

**Before embedding in other dashboards**

- Global CSS reset and `:root` variables leak into the host app. Scope everything under a `.pb-root` class and prefix variables (`--pb-*`).
- `Embed` renders raw HTML. Sanitize it or restrict it to allowlisted providers, and allowlist URL protocols for `href`/`src` (block `javascript:`).
- Media is stored as base64 data URLs. Add a `mediaAdapter` (`upload`, `browse`) so hosts provide their own storage.
- `allowedChildren` is enforced only when inserting from the sidebar, not on drag-and-drop or move.
- The builder has no controlled API yet (`value`, `onChange`, `onSave`), so saved pages can't be loaded back into the editor.
- `next-intl` is required. Consider a translation adapter prop.

**Planned**

- Undo/redo, duplicate, keyboard shortcuts, layer tree, preview mode
- Responsive overrides (mobile/tablet/desktop) with class-based styles. The old responsive page padding was removed because inline styles can't hold media queries
- Schema versioning and migrations
- OTT blocks that hold a query instead of content (hero, content rail, episode list, player) resolved by the host
- Export as React components using a shared runtime package

## Scripts

Standard Next.js scripts:

```bash
npm run dev
npm run build
npm run start
```