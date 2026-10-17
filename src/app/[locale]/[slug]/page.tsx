// app/[locale]/[slug]/page.tsx
import { notFound } from "next/navigation";
import { getPublishedPage } from "@/lib/pages";
import { PageRenderer } from "@/components/pagebuilder/renderer/PageRenderer";

export const dynamic = "force-dynamic"; // re-read the file on every request while testing

export default async function Page({ params }: { params: Promise<{ locale: string; slug: string }> }) {
    const { slug } = await params;
    const doc = await getPublishedPage(slug);
    if (!doc) notFound();
    return <PageRenderer nodes={doc.nodes} page={doc.page} />;
}