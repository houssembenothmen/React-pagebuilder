// core/ui/settings/BorderControl.tsx
"use client";
import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import type { BorderLineStyle, BorderSideValue, BorderSpacing, BoxSide, SizeUnit } from "../../types";

const SIDES: BoxSide[] = ["blockStart", "blockEnd", "inlineStart", "inlineEnd"];
const UNIT_OPTIONS: SizeUnit[] = ["px", "em", "rem"];
const STYLE_OPTIONS: BorderLineStyle[] = ["solid", "dashed", "dotted", "double", "none"];
const EMPTY: BorderSideValue = { width: { value: "1", unit: "px" }, style: "solid", color: "#e5e7eb" };

const BorderRow = ({ entry, onChange, trailing }: {
    entry?: BorderSideValue;
    onChange: (patch: Partial<BorderSideValue>) => void;
    trailing?: ReactNode;
}) => {
    const t = useTranslations("pagebuilder.settings");
    return (
        <div className="pb-settings-border-row">
            <input type="number" className="pb-settings-border-width" placeholder="0" aria-label={t("borderWidth")}
                value={entry?.width?.value ?? ""}
                onChange={(e) => onChange({ width: { value: e.target.value, unit: entry?.width?.unit ?? "px" } })} />
            <select aria-label={t("unit")} value={entry?.width?.unit ?? "px"}
                onChange={(e) => onChange({ width: { value: entry?.width?.value ?? "1", unit: e.target.value as SizeUnit } })}>
                {UNIT_OPTIONS.map((u) => <option key={u} value={u}>{u}</option>)}
            </select>
            <select aria-label={t("borderStyle")} value={entry?.style ?? "solid"}
                onChange={(e) => onChange({ style: e.target.value as BorderLineStyle })}>
                {STYLE_OPTIONS.map((s) => <option key={s} value={s}>{t(`borderStyleOption.${s}`)}</option>)}
            </select>
            <input type="color" aria-label={t("borderColor")} value={entry?.color ?? "#e5e7eb"}
                onChange={(e) => onChange({ color: e.target.value })} />
            {trailing}
        </div>
    );
};

interface BorderControlProps {
    value?: BorderSpacing;
    onChange: (next: BorderSpacing) => void;
}

const BorderControl = ({ value, onChange }: BorderControlProps) => {
    const t = useTranslations("pagebuilder.settings");
    const sideLabel = (side: BoxSide) => t(`side.${side}`);
    const activeSides = Object.keys(value?.sides ?? {}) as BoxSide[];
    const availableSides = SIDES.filter((s) => !activeSides.includes(s));

    const setAll = (patch: Partial<BorderSideValue>) => onChange({ ...value, all: { ...(value?.all ?? EMPTY), ...patch } });
    const setSide = (side: BoxSide, patch: Partial<BorderSideValue>) =>
        onChange({ ...value, sides: { ...value?.sides, [side]: { ...(value?.sides?.[side] ?? value?.all ?? EMPTY), ...patch } } });
    const removeSide = (side: BoxSide) => {
        const nextSides = { ...value?.sides };
        delete nextSides[side];
        onChange({ ...value, sides: nextSides });
    };

    return (
        <div className="pb-settings-spacing">
            <p className="pb-settings-subsection-title">{t("allSides")}</p>
            <BorderRow entry={value?.all} onChange={setAll} />

            {activeSides.map((side) => (
                <div key={side}>
                    <p className="pb-settings-inline-hint">{sideLabel(side)}</p>
                    <BorderRow
                        entry={value?.sides?.[side]}
                        onChange={(patch) => setSide(side, patch)}
                        trailing={<button type="button" className="pb-settings-remove-side" onClick={() => removeSide(side)} title={t("removeOverride")}>×</button>}
                    />
                </div>
            ))}

            {availableSides.length > 0 && (
                <select className="pb-settings-add-side" value="" onChange={(e) => e.target.value && setSide(e.target.value as BoxSide, {})}>
                    <option value="" disabled>{t("addSideOverride")}</option>
                    {availableSides.map((s) => <option key={s} value={s}>{sideLabel(s)}</option>)}
                </select>
            )}
        </div>
    );
};

export default BorderControl;