"use client";

import "./styles/main.scss";
import { useMemo, type ComponentType } from "react";
import { PageBuilderProvider } from "./context/PageBuilderContext";
import { RichTextEditorProvider, type RichTextEditorProps } from "./context/RichTextEditorContext";
import { componentRegistry } from "./registry";
import type { ComponentDefinition } from "./types";
import Layout from "./ui/Layout";
import Canvas from "./ui/Canvas";
import StyleInjector from "./StyleInjector";

interface PageBuilderProps {
    /** Every component this instance should offer — core library + project extras. */
    components: ComponentDefinition[];
    /** Optional: wire up this project's rich-text editor for the "Rich Text" component. */
    richTextEditor?: ComponentType<RichTextEditorProps> | null;
}

const PageBuilder = ({ components, richTextEditor = null }: PageBuilderProps) => {
    // Runs during render (correct timing — children need the registry populated
    // before their first paint) and re-runs only when `components` identity changes.
    useMemo(() => {
        componentRegistry.registerAll(components);
    }, [components]);

    return (
        <RichTextEditorProvider value={richTextEditor}>
            <PageBuilderProvider>
                <StyleInjector />
                <Layout>
                    <Canvas />
                </Layout>
            </PageBuilderProvider>
        </RichTextEditorProvider>
    );
};

export default PageBuilder;