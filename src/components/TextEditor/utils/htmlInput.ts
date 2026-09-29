export function ensureBlockHtml(value: string): string {
    if (!value) return value;

    const looksLikeHtml = /<[a-z][^>]*>/i.test(value);
    if (looksLikeHtml) return value;

    return `<p><span>${escapeHtmlText(value)}</span></p>`;
}

function escapeHtmlText(value: string): string {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}