// core/export/exportStyles.ts
export const CORE_EXPORT_CSS = `
:root {
    --primary-color: #0070f3;
    --secondary-color: #1c1c1e;
    --tertiary-color: #f0f0f0;
    --surface-color: #ffffff;
    --surface-hover-color: #f5f5ff;
    --surface-active-color: #ececfe;
    --border-color: #e5e7eb;
    --border-strong-color: #d1d5db;
    --text-color: #111827;
    --text-muted-color: #6b7280;
    --accent-primary-color: #ff4081;
    --accent-secondary-color: #df40ff;
    --accent-tertiary-color: #ff8c00;
    --accent-quaternary-color: #00ff00;
    --accent-quinary-color: #00ffff;
    --accent-senary-color: #001aff;
}
* { box-sizing: border-box; }
body {
    margin: 0;
    font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
    color: var(--text-color);
    background: var(--surface-color);
    line-height: 1.5;
}
h1, h2, h3, h4, h5, h6 { line-height: 1.25; margin: 0 0 8px; }
p { margin: 0 0 8px; }
a { color: var(--primary-color); }
button, input, textarea, select { font: inherit; }
@media (max-width: 640px) {
    .pb-export { padding: 20px 16px; gap: 16px; }
}
.pb-el-button, .pb-el-cart, .pb-el-like {
    transition: opacity 0.15s ease, transform 0.1s ease;
}
.pb-el-button:hover { opacity: 0.9; }
.pb-el-button:active { transform: translateY(1px); }
.pb-el-layout-wrap { display: inline-block; max-width: 100%; box-sizing: border-box; }
`;