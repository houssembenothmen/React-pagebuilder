// lib/pages.ts
import { readFile } from "node:fs/promises";
import path from "node:path";
import type { CanvasComponent } from "@/components/pagebuilder/core/types";
import type { PageSettings } from "@/components/pagebuilder/core/page";

export interface PageDoc {
    schemaVersion: number;
    nodes: CanvasComponent[];
    page?: PageSettings;
}

// DEV VERSION: reads the uploaded export. Swap the body for your API/DB call later.
export async function getPublishedPage(slug: string): Promise<PageDoc | null> {
    if (!/^[a-z0-9-_]+$/i.test(slug)) return null;
    try {
        const raw = await readFile(path.join(process.cwd(), ".pb-dev", `${slug}.json`), "utf8");
        return JSON.parse(raw) as PageDoc;
    } catch {
        return null;
    }
}