// app/[locale]/dev/upload/page.tsx
"use client";

import { useState } from "react";
import { useLocale } from "next-intl";

export default function DevUpload() {
    const locale = useLocale();
    const [slug, setSlug] = useState("test");
    const [status, setStatus] = useState("");

    const onFile = async (file?: File) => {
        if (!file) return;
        const body = new FormData();
        body.append("file", file);
        const res = await fetch(`/api/dev/pages/${slug}`, { method: "POST", body });
        const json = await res.json();
        setStatus(res.ok ? `Uploaded. Open /${locale}/${slug}` : json.error);
    };

    return (
        <div style={{ padding: 32, display: "flex", flexDirection: "column", gap: 12, maxWidth: 420 }}>
            <label>
                Slug <input value={slug} onChange={(e) => setSlug(e.target.value)} style={{ border: "1px solid #ccc", padding: 6 }} />
            </label>
            <input type="file" accept="application/json" onChange={(e) => onFile(e.target.files?.[0])} />
            <p>{status}</p>
            {status.startsWith("Uploaded") && <a href={`/${locale}/${slug}`} style={{ color: "blue" }}>Open page</a>}
        </div>
    );
}