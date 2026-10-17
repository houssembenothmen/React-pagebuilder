// app/api/dev/pages/[slug]/route.ts
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

export const DEV_DIR = path.join(process.cwd(), ".pb-dev");

export async function POST(req: Request, { params }: { params: Promise<{ slug: string }> }) {
    if (process.env.NODE_ENV === "production") {
        return NextResponse.json({ error: "Disabled in production" }, { status: 403 });
    }

    const { slug } = await params;
    if (!/^[a-z0-9-_]+$/i.test(slug)) {
        return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
    }

    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
        return NextResponse.json({ error: "No file" }, { status: 400 });
    }

    const text = await file.text();
    try {
        const doc = JSON.parse(text);
        if (!Array.isArray(doc?.nodes)) throw new Error("Missing nodes[]");
    } catch (e) {
        return NextResponse.json({ error: `Invalid page JSON: ${(e as Error).message}` }, { status: 400 });
    }

    await mkdir(DEV_DIR, { recursive: true });
    await writeFile(path.join(DEV_DIR, `${slug}.json`), text, "utf8");
    return NextResponse.json({ ok: true, slug });
}