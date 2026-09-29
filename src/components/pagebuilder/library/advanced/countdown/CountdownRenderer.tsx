"use client";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

const CountdownRenderer = ({ target, onSet }: { target: string; onSet: (v: string) => void }) => {
    const t = useTranslations("pagebuilder");
    const [now, setNow] = useState(() => Date.now());

    useEffect(() => {
        const id = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(id);
    }, []);

    if (!target) {
        return (
            <div
                className="pb-el-media-placeholder"
                onDoubleClick={(e) => { e.stopPropagation(); const value = window.prompt(t("media.targetDatePrompt")); if (value) onSet(value); }}
            >
                {t("media.setTargetDate")}
            </div>
        );
    }

    const diff = Math.max(0, new Date(target).getTime() - now);
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);

    return (
        <div className="pb-el-countdown">
            <span>{t("countdown.days", { count: days })}</span>{" "}
            <span>{t("countdown.hours", { count: hours })}</span>{" "}
            <span>{t("countdown.minutes", { count: minutes })}</span>{" "}
            <span>{t("countdown.seconds", { count: seconds })}</span>
        </div>
    );
};

export default CountdownRenderer;