"use client";

import { createContext, useContext, type ComponentType } from "react";

export interface RichTextEditorProps {
    initialValue: string;
    locale: string;
    onDone: (html: string) => void;
}

const RichTextEditorContext = createContext<ComponentType<RichTextEditorProps> | null>(null);

export const RichTextEditorProvider = RichTextEditorContext.Provider;

export const useRichTextEditor = () => useContext(RichTextEditorContext);