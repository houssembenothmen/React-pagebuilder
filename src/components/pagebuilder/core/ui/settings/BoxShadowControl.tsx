// core/ui/settings/BoxShadowControl.tsx
"use client";
import { useTranslations } from "next-intl";
import type { BoxShadowValue } from "../../types";

interface BoxShadowControlProps {
    value?: BoxShadowValue;
    onChange: (next: BoxShadowValue) => void;
}

const BoxShadowControl = ({ value, onChange }: BoxShadowControlProps) => {
    const t = useTranslations("pagebuilder.settings");
    const set = (patch: Partial<BoxShadowValue>) => onChange({ ...value, ...patch });

    return (
        <div className="pb-settings-shadow-grid">
            <label className="pb-settings-field"><span>{t("shadowOffsetX")}</span>
                <input type="number" value={value?.offsetX ?? ""} onChange={(e) => set({ offsetX: e.target.value })} /></label>
            <label className="pb-settings-field"><span>{t("shadowOffsetY")}</span>
                <input type="number" value={value?.offsetY ?? ""} onChange={(e) => set({ offsetY: e.target.value })} /></label>
            <label className="pb-settings-field"><span>{t("shadowBlur")}</span>
                <input type="number" value={value?.blur ?? ""} onChange={(e) => set({ blur: e.target.value })} /></label>
            <label className="pb-settings-field"><span>{t("shadowSpread")}</span>
                <input type="number" value={value?.spread ?? ""} onChange={(e) => set({ spread: e.target.value })} /></label>
            <label className="pb-settings-field"><span>{t("shadowColor")}</span>
                <input type="color" value={value?.color ?? "#000000"} onChange={(e) => set({ color: e.target.value })} /></label>
            <label className="pb-settings-field pb-settings-field-inline">
                <input type="checkbox" checked={Boolean(value?.inset)} onChange={(e) => set({ inset: e.target.checked })} />
                <span>{t("shadowInset")}</span>
            </label>
        </div>
    );
};

export default BoxShadowControl;