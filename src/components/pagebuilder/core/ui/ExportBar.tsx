"use client";

import { Download } from "lucide-react";
import { useTranslations } from "next-intl";
import { usePageBuilder } from "../context/PageBuilderContext";

const downloadHtml = (html: string) => {
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "page.html";
    link.click();
    URL.revokeObjectURL(url);
};

const ExportBar = () => {
    const t = useTranslations("pagebuilder");
    const { exportAsHtml, canvasItems } = usePageBuilder();

    return (
        <div className="pb-export-bar">
            <span className="pb-export-bar-label">{t("exportBar.title")}</span>
            <button className="pb-export-bar-btn" onClick={() => downloadHtml(exportAsHtml())} disabled={canvasItems.length === 0}>
                <Download size={14} />
                {t("exportBar.exportAsHtml")}
            </button>
        </div>
    );
};

export default ExportBar;