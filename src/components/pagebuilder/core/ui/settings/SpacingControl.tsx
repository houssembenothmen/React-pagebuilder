// core/ui/settings/SpacingControl.tsx
"use client";
import { useTranslations } from "next-intl";
import type { BoxSide, BoxSpacing, SizeUnit, SizeValue } from "../../types";

const SIDES: BoxSide[] = ["blockStart", "blockEnd", "inlineStart", "inlineEnd"];
const UNIT_OPTIONS: SizeUnit[] = ["px", "%", "em", "rem", "vw", "vh"];
const EMPTY: SizeValue = { value: "", unit: "px" };

interface SpacingControlProps {
    label: string;
    value?: BoxSpacing;
    onChange: (next: BoxSpacing) => void;
}

const SpacingControl = ({ label, value, onChange }: SpacingControlProps) => {
    const t = useTranslations("pagebuilder.settings");
    const sideLabel = (side: BoxSide) => t(`side.${side}`);

    const activeSides = Object.keys(value?.sides ?? {}) as BoxSide[];
    const availableSides = SIDES.filter((s) => !activeSides.includes(s));

    const setAll = (patch: Partial<SizeValue>) => onChange({ ...value, all: { ...(value?.all ?? EMPTY), ...patch } });
    const setSide = (side: BoxSide, patch: Partial<SizeValue>) =>
        onChange({ ...value, sides: { ...value?.sides, [side]: { ...(value?.sides?.[side] ?? value?.all ?? EMPTY), ...patch } } });
    const removeSide = (side: BoxSide) => {
        const nextSides = { ...value?.sides };
        delete nextSides[side];
        onChange({ ...value, sides: nextSides });
    };

    return (
        <div className="pb-settings-spacing">
            <p className="pb-settings-subsection-title">{label}</p>

            <div className="pb-settings-size-row">
                <input type="number" placeholder="0" aria-label={t("allSides")}
                    value={value?.all?.value ?? ""} onChange={(e) => setAll({ value: e.target.value })} />
                <select aria-label={t("unit")} value={value?.all?.unit ?? "px"}
                    onChange={(e) => setAll({ unit: e.target.value as SizeUnit })}>
                    {UNIT_OPTIONS.map((u) => <option key={u} value={u}>{u}</option>)}
                </select>
                <span className="pb-settings-inline-hint">{t("allSides")}</span>
            </div>

            {activeSides.map((side) => (
                <div className="pb-settings-size-row pb-settings-side-row" key={side}>
                    <input type="number" placeholder="0" aria-label={sideLabel(side)}
                        value={value?.sides?.[side]?.value ?? ""}
                        onChange={(e) => setSide(side, { value: e.target.value })} />
                    <select aria-label={t("unit")} value={value?.sides?.[side]?.unit ?? "px"}
                        onChange={(e) => setSide(side, { unit: e.target.value as SizeUnit })}>
                        {UNIT_OPTIONS.map((u) => <option key={u} value={u}>{u}</option>)}
                    </select>
                    <span className="pb-settings-inline-hint">{sideLabel(side)}</span>
                    <button type="button" className="pb-settings-remove-side" onClick={() => removeSide(side)} title={t("removeOverride")}>×</button>
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

export default SpacingControl;