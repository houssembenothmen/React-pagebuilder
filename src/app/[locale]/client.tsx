"use client"

import PageBuilder from "@/components/pagebuilder/core/PageBuilder";
import { coreLibrary } from "@/components/pagebuilder/library";
import LexicalRichTextEditor from "@/components/pagebuilder/adapters/LexicalRichTextEditor";

const Client = () => {
    return <PageBuilder components={coreLibrary} richTextEditor={LexicalRichTextEditor} />;
};

export default Client;