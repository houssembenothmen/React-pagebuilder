export function joinUrl(base: string, path: string): string {
    const cleanBase = (base || "").replace(/\/+$/, "");
    const cleanPath = (path || "").replace(/^\/+/, "");
    return cleanBase ? `${cleanBase}/${cleanPath}` : `/${cleanPath}`;
}