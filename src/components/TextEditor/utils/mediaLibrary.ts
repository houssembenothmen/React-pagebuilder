import { EditorMediaConfig } from "../config/editorConfigTypes";
import { getByPath } from "./objectPath";
import { joinUrl } from "./url";

export interface MediaItem {
    id: string;
    src: string;
    alt: string;
    type: "image" | "video";
    thumbnail?: string;
    createdAt?: string;
}

interface RawMediaEntry {
    _id?: string;
    id?: string;
    url?: string;
    src?: string;
    path?: string;
    media?: string;
    name?: string;
    fileName?: string;
    filename?: string;
    mimetype?: string;
    mimeType?: string;
    type?: string;
    thumbnail?: string;
    thumbnailUrl?: string;
    createdAt?: string;
}

function inferType(entry: RawMediaEntry): "image" | "video" {
    const mime = entry.mimetype || entry.mimeType || entry.type || "";
    if (mime.startsWith("video")) return "video";
    if (mime.startsWith("image")) return "image";
    const url = entry.url || entry.src || entry.path || entry.media || "";
    return /\.(mp4|webm|mov|m4v)$/i.test(url) ? "video" : "image";
}

function normalize(entry: RawMediaEntry, storageURL: string): MediaItem | null {
    const rawPath = entry.url || entry.src || entry.path || entry.media;
    if (!rawPath) return null;

    const src = rawPath.startsWith("http") ? rawPath : `${storageURL}${rawPath}`;

    return {
        id: entry._id || entry.id || src,
        src,
        alt: entry.name || entry.fileName || entry.filename || "",
        type: inferType(entry),
        thumbnail: entry.thumbnail || entry.thumbnailUrl,
        createdAt: entry.createdAt,
    };
}

type ListConfig = Pick<
    EditorMediaConfig,
    "storageURL" | "listEndpoint" | "uploadToken" | "responseListPaths"
>;

export async function fetchMediaList({
    config,
    type,
}: {
    config: ListConfig;
    type?: "image" | "video";
}): Promise<MediaItem[]> {
    const {
        storageURL = "",
        listEndpoint = "api/bo/content/upload/media",
        uploadToken,
        responseListPaths = ["medias", "media", "items", "data"],
    } = config;

    const res = await fetch(joinUrl(storageURL, listEndpoint), {
        method: "GET",
        headers: uploadToken ? { Authorization: `Bearer ${uploadToken}` } : {},
    });

    if (!res.ok) {
        throw new Error(`Failed to fetch media list (status ${res.status})`);
    }

    const data = await res.json();

    let rawList: RawMediaEntry[] = [];
    for (const path of responseListPaths) {
        const value = getByPath(data, path);
        if (Array.isArray(value)) {
            rawList = value as RawMediaEntry[];
            break;
        }
    }
    if (rawList.length === 0 && Array.isArray(data)) {
        rawList = data as RawMediaEntry[];
    }

    const normalized = rawList
        .map((entry) => normalize(entry, storageURL))
        .filter((item): item is MediaItem => item !== null);

    return type ? normalized.filter((item) => item.type === type) : normalized;
}