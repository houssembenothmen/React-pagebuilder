"use client";

import { useState, type ChangeEvent } from "react";
import { useTranslations } from "next-intl";
import { usePageBuilder } from "../context/PageBuilderContext";
import { componentRegistry } from "../registry";
import type {
    FieldDef,
    LayoutStyle,
    SizeUnit,
    CursorValue,
    OverflowValue,
    TextAlign,
    TextDecoration,
} from "../types";
import SettingsSection from "./settings/SettingsSection";
import SpacingControl from "./settings/SpacingControl";
import BorderControl from "./settings/BorderControl";
import BoxShadowControl from "./settings/BoxShadowControl";

const toStringArray = (value: unknown): string[] =>
    Array.isArray(value) ? value.map(String) : [];
const toNumberArray = (value: unknown): number[] =>
    Array.isArray(value)
        ? value.map(Number).filter((n) => !Number.isNaN(n))
        : [];

const UNIT_OPTIONS: SizeUnit[] = ["px", "%", "em", "rem", "vw", "vh"];
const FONT_WEIGHT_OPTIONS = [
    "normal",
    "bold",
    "300",
    "400",
    "500",
    "600",
    "700",
    "800",
];
const TEXT_ALIGN_OPTIONS: TextAlign[] = ["left", "center", "right", "justify"];
const TEXT_DECORATION_OPTIONS: TextDecoration[] = [
    "none",
    "underline",
    "line-through",
    "overline",
];
const OVERFLOW_OPTIONS: OverflowValue[] = [
    "visible",
    "hidden",
    "scroll",
    "auto",
];
const CURSOR_OPTIONS: CursorValue[] = [
    "auto",
    "pointer",
    "default",
    "move",
    "text",
    "not-allowed",
    "grab",
    "zoom-in",
    "help",
    "wait",
];
const FONT_FAMILY_PRESETS = [
    "system-ui, sans-serif",
    "Arial, sans-serif",
    "'Georgia', serif",
    "'Times New Roman', serif",
    "'Courier New', monospace",
    "'Helvetica Neue', sans-serif",
];

// Section ids used to drive the single-open accordion behavior.
const SECTION = {
    SIZE: "size",
    SPACING: "spacing",
    BACKGROUND: "background",
    BORDER: "border",
    EFFECTS: "effects",
    TYPOGRAPHY: "typography",
    ADVANCED: "advanced",
    FIELDS: "fields",
} as const;
type SectionId = (typeof SECTION)[keyof typeof SECTION];

const SettingsPanel = () => {
    const t = useTranslations("pagebuilder");
    const ts = useTranslations("pagebuilder.settings");
    const { selectedComponent, updateComponentProps, updateComponentLayout } =
        usePageBuilder();

    const def = selectedComponent
        ? componentRegistry.get(selectedComponent.title)
        : undefined;
    const fields: FieldDef[] = def?.fields ?? [];
    const hasFields = fields.length > 0;

    // Only one section open at a time. Default to the per-component fields
    // section when the selected element has any (that's what the user picked
    // it for); otherwise default to Size (most commonly touched).
    const [openSection, setOpenSection] = useState<SectionId | null>(
        hasFields ? SECTION.FIELDS : SECTION.SIZE,
    );
    const [prevSelectedId, setPrevSelectedId] = useState(selectedComponent?.id);
    if (selectedComponent?.id !== prevSelectedId) {
        setPrevSelectedId(selectedComponent?.id);
        setOpenSection(hasFields ? SECTION.FIELDS : SECTION.SIZE);
    }

    if (!selectedComponent) {
        return (
            <aside className="pb-settings-sidebar">
                <div className="pb-settings-empty">
                    <p>{t("settings.selectPrompt")}</p>
                </div>
            </aside>
        );
    }

    const node = selectedComponent;
    const props = node.props as Record<string, unknown>;
    const title = def
        ? def.labelKey
            ? t(def.labelKey)
            : def.label
        : node.title;
    const isTypography = Boolean(def?.supportsTypography);

    const setField = (key: string, value: unknown) =>
        updateComponentProps(node.id, { [key]: value });
    const setLayout = (patch: Partial<LayoutStyle>) =>
        updateComponentLayout(node.id, patch);
    const fieldLabel = (field: FieldDef) =>
        field.labelKey ? t(field.labelKey) : field.label;
    const toggleSection = (id: SectionId) =>
        setOpenSection((current) => (current === id ? null : id));

    const sizeField = (
        valueKey: keyof LayoutStyle,
        unitKey: keyof LayoutStyle,
        labelText: string,
        placeholder: string,
    ) => (
        <div className="pb-settings-field" key={valueKey}>
            <span>{labelText}</span>
            <div className="pb-settings-size-row">
                <input
                    type="number"
                    placeholder={placeholder}
                    value={(node.layout?.[valueKey] as string) ?? ""}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setLayout({
                            [valueKey]: e.target.value,
                        } as Partial<LayoutStyle>)
                    }
                    aria-label={labelText}
                />
                <select
                    value={(node.layout?.[unitKey] as string) ?? "px"}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                        setLayout({
                            [unitKey]: e.target.value as SizeUnit,
                        } as Partial<LayoutStyle>)
                    }
                    aria-label={ts("unit")}
                >
                    {UNIT_OPTIONS.map((u) => (
                        <option key={u} value={u}>
                            {u}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );

    return (
        <aside className="pb-settings-sidebar">
            <div className="pb-settings-header">
                <h3 className="pb-settings-title">{title}</h3>
                <span className="pb-settings-subtitle">
                    {t("settings.elementSettings")}
                </span>
            </div>

            {/* SIZE */}
            <SettingsSection
                title={ts("sizeSectionTitle")}
                isOpen={openSection === SECTION.SIZE}
                onToggle={() => toggleSection(SECTION.SIZE)}
            >
                <div className="pb-settings-fields">
                    {sizeField("width", "widthUnit", ts("width"), ts("auto"))}
                    {sizeField("minWidth", "minWidthUnit", ts("minWidth"), "0")}
                    {sizeField(
                        "maxWidth",
                        "maxWidthUnit",
                        ts("maxWidth"),
                        ts("none"),
                    )}
                    {sizeField(
                        "height",
                        "heightUnit",
                        ts("height"),
                        ts("auto"),
                    )}
                    {sizeField(
                        "minHeight",
                        "minHeightUnit",
                        ts("minHeight"),
                        "0",
                    )}
                    {sizeField(
                        "maxHeight",
                        "maxHeightUnit",
                        ts("maxHeight"),
                        ts("none"),
                    )}
                </div>
            </SettingsSection>

            {/* SPACING */}
            <SettingsSection
                title={ts("spacingSectionTitle")}
                isOpen={openSection === SECTION.SPACING}
                onToggle={() => toggleSection(SECTION.SPACING)}
            >
                <SpacingControl
                    label={ts("margin")}
                    value={node.layout?.margin}
                    onChange={(margin) => setLayout({ margin })}
                />
                <SpacingControl
                    label={ts("padding")}
                    value={node.layout?.padding}
                    onChange={(padding) => setLayout({ padding })}
                />
            </SettingsSection>

            {/* BACKGROUND */}
            <SettingsSection
                title={ts("backgroundSectionTitle")}
                isOpen={openSection === SECTION.BACKGROUND}
                onToggle={() => toggleSection(SECTION.BACKGROUND)}
            >
                <label
                    className="pb-settings-field"
                    htmlFor="pb-layout-bg-text"
                >
                    <span>{ts("backgroundColor")}</span>
                    <div className="pb-settings-color-row">
                        <input
                            type="color"
                            aria-label={ts("backgroundColor")}
                            value={node.layout?.backgroundColor || "#ffffff"}
                            onChange={(e) =>
                                setLayout({ backgroundColor: e.target.value })
                            }
                        />
                        <input
                            id="pb-layout-bg-text"
                            type="text"
                            placeholder={ts("transparent")}
                            value={node.layout?.backgroundColor ?? ""}
                            onChange={(e) =>
                                setLayout({
                                    backgroundColor:
                                        e.target.value || undefined,
                                })
                            }
                        />
                    </div>
                </label>
            </SettingsSection>

            {/* BORDER */}
            <SettingsSection
                title={ts("borderSectionTitle")}
                isOpen={openSection === SECTION.BORDER}
                onToggle={() => toggleSection(SECTION.BORDER)}
            >
                <BorderControl
                    value={node.layout?.border}
                    onChange={(border) => setLayout({ border })}
                />
                <div className="pb-settings-fields" style={{ marginTop: 10 }}>
                    {sizeField(
                        "borderRadius",
                        "borderRadiusUnit",
                        ts("borderRadius"),
                        "0",
                    )}
                </div>
            </SettingsSection>

            {/* EFFECTS */}
            <SettingsSection
                title={ts("effectsSectionTitle")}
                isOpen={openSection === SECTION.EFFECTS}
                onToggle={() => toggleSection(SECTION.EFFECTS)}
            >
                <p className="pb-settings-subsection-title">
                    {ts("boxShadow")}
                </p>
                <BoxShadowControl
                    value={node.layout?.boxShadow}
                    onChange={(boxShadow) => setLayout({ boxShadow })}
                />
                <label
                    className="pb-settings-field"
                    htmlFor="pb-layout-opacity"
                    style={{ marginTop: 10 }}
                >
                    <span>
                        {ts("opacity", { value: node.layout?.opacity ?? 100 })}
                    </span>
                    <input
                        id="pb-layout-opacity"
                        type="range"
                        min={0}
                        max={100}
                        value={node.layout?.opacity ?? 100}
                        onChange={(e) =>
                            setLayout({ opacity: Number(e.target.value) })
                        }
                    />
                </label>
            </SettingsSection>

            {/* TYPOGRAPHY — only shown for components that opt in via supportsTypography */}
            {isTypography && (
                <SettingsSection
                    title={ts("typographySectionTitle")}
                    isOpen={openSection === SECTION.TYPOGRAPHY}
                    onToggle={() => toggleSection(SECTION.TYPOGRAPHY)}
                >
                    <div className="pb-settings-fields">
                        <label className="pb-settings-field">
                            <span>{ts("textColor")}</span>
                            <div className="pb-settings-color-row">
                                <input
                                    type="color"
                                    value={node.layout?.color || "#111827"}
                                    onChange={(e) =>
                                        setLayout({ color: e.target.value })
                                    }
                                />
                                <input
                                    type="text"
                                    placeholder={ts("inherit")}
                                    value={node.layout?.color ?? ""}
                                    onChange={(e) =>
                                        setLayout({
                                            color: e.target.value || undefined,
                                        })
                                    }
                                />
                            </div>
                        </label>

                        <label className="pb-settings-field">
                            <span>{ts("fontFamily")}</span>
                            <input
                                type="text"
                                list="pb-font-family-presets"
                                value={node.layout?.fontFamily ?? ""}
                                placeholder={ts("inherit")}
                                onChange={(e) =>
                                    setLayout({
                                        fontFamily: e.target.value || undefined,
                                    })
                                }
                            />
                            <datalist id="pb-font-family-presets">
                                {FONT_FAMILY_PRESETS.map((f) => (
                                    <option key={f} value={f} />
                                ))}
                            </datalist>
                        </label>

                        {sizeField(
                            "fontSize",
                            "fontSizeUnit",
                            ts("fontSize"),
                            ts("inherit"),
                        )}

                        <label className="pb-settings-field">
                            <span>{ts("fontWeight")}</span>
                            <select
                                value={node.layout?.fontWeight ?? ""}
                                onChange={(e) =>
                                    setLayout({
                                        fontWeight: e.target.value || undefined,
                                    })
                                }
                            >
                                <option value="">{ts("inherit")}</option>
                                {FONT_WEIGHT_OPTIONS.map((w) => (
                                    <option key={w} value={w}>
                                        {w}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label className="pb-settings-field">
                            <span>{ts("lineHeight")}</span>
                            <input
                                type="text"
                                placeholder={ts("inherit")}
                                value={node.layout?.lineHeight ?? ""}
                                onChange={(e) =>
                                    setLayout({
                                        lineHeight: e.target.value || undefined,
                                    })
                                }
                            />
                        </label>

                        {sizeField(
                            "letterSpacing",
                            "letterSpacingUnit",
                            ts("letterSpacing"),
                            "0",
                        )}

                        <label className="pb-settings-field">
                            <span>{ts("textAlign")}</span>
                            <select
                                value={node.layout?.textAlign ?? ""}
                                onChange={(e) =>
                                    setLayout({
                                        textAlign: (e.target.value ||
                                            undefined) as TextAlign | undefined,
                                    })
                                }
                            >
                                <option value="">{ts("inherit")}</option>
                                {TEXT_ALIGN_OPTIONS.map((a) => (
                                    <option key={a} value={a}>
                                        {ts(`textAlignOption.${a}`)}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label className="pb-settings-field">
                            <span>{ts("textDecoration")}</span>
                            <select
                                value={node.layout?.textDecoration ?? ""}
                                onChange={(e) =>
                                    setLayout({
                                        textDecoration: (e.target.value ||
                                            undefined) as
                                            | TextDecoration
                                            | undefined,
                                    })
                                }
                            >
                                <option value="">{ts("inherit")}</option>
                                {TEXT_DECORATION_OPTIONS.map((d) => (
                                    <option key={d} value={d}>
                                        {ts(`textDecorationOption.${d}`)}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>
                </SettingsSection>
            )}

            {/* ADVANCED */}
            <SettingsSection
                title={ts("advancedSectionTitle")}
                isOpen={openSection === SECTION.ADVANCED}
                onToggle={() => toggleSection(SECTION.ADVANCED)}
            >
                <div className="pb-settings-fields">
                    <label className="pb-settings-field">
                        <span>{ts("overflow")}</span>
                        <select
                            value={node.layout?.overflow ?? ""}
                            onChange={(e) =>
                                setLayout({
                                    overflow: (e.target.value || undefined) as
                                        | OverflowValue
                                        | undefined,
                                })
                            }
                        >
                            <option value="">{ts("inherit")}</option>
                            {OVERFLOW_OPTIONS.map((o) => (
                                <option key={o} value={o}>
                                    {ts(`overflowOption.${o}`)}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label className="pb-settings-field">
                        <span>{ts("transform")}</span>
                        <input
                            type="text"
                            placeholder="rotate(5deg)"
                            value={node.layout?.transform ?? ""}
                            onChange={(e) =>
                                setLayout({
                                    transform: e.target.value || undefined,
                                })
                            }
                        />
                    </label>

                    <label className="pb-settings-field">
                        <span>{ts("cursor")}</span>
                        <select
                            value={node.layout?.cursor ?? ""}
                            onChange={(e) =>
                                setLayout({
                                    cursor: (e.target.value || undefined) as
                                        | CursorValue
                                        | undefined,
                                })
                            }
                        >
                            <option value="">{ts("inherit")}</option>
                            {CURSOR_OPTIONS.map((c) => (
                                <option key={c} value={c}>
                                    {ts(`cursorOption.${c}`)}
                                </option>
                            ))}
                        </select>
                    </label>
                </div>
            </SettingsSection>

            {/* PER-COMPONENT FIELDS */}
            {fields.length === 0 ? (
                <div className="pb-settings-empty">
                    <p>{t("settings.noExtraSettings")}</p>
                </div>
            ) : (
                <SettingsSection
                    title={t("settings.elementSettings")}
                    isOpen={openSection === SECTION.FIELDS}
                    onToggle={() => toggleSection(SECTION.FIELDS)}
                >
                    <div className="pb-settings-fields">
                        {fields.map((field) => {
                            const value = props[field.key];
                            const fieldId = `pb-field-${node.id}-${field.key}`;

                            switch (field.kind) {
                                case "text":
                                    return (
                                        <label
                                            key={field.key}
                                            className="pb-settings-field"
                                            htmlFor={fieldId}
                                        >
                                            <span>{fieldLabel(field)}</span>
                                            <input
                                                id={fieldId}
                                                type="text"
                                                value={String(value ?? "")}
                                                onChange={(
                                                    e: ChangeEvent<HTMLInputElement>,
                                                ) =>
                                                    setField(
                                                        field.key,
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </label>
                                    );
                                case "date":
                                    return (
                                        <label
                                            key={field.key}
                                            className="pb-settings-field"
                                            htmlFor={fieldId}
                                        >
                                            <span>{fieldLabel(field)}</span>
                                            <input
                                                id={fieldId}
                                                type="date"
                                                value={String(value ?? "")}
                                                onChange={(
                                                    e: ChangeEvent<HTMLInputElement>,
                                                ) =>
                                                    setField(
                                                        field.key,
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </label>
                                    );
                                case "textarea":
                                    return (
                                        <label
                                            key={field.key}
                                            className="pb-settings-field"
                                            htmlFor={fieldId}
                                        >
                                            <span>{fieldLabel(field)}</span>
                                            <textarea
                                                id={fieldId}
                                                value={String(value ?? "")}
                                                onChange={(
                                                    e: ChangeEvent<HTMLTextAreaElement>,
                                                ) =>
                                                    setField(
                                                        field.key,
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </label>
                                    );
                                case "number":
                                    return (
                                        <label
                                            key={field.key}
                                            className="pb-settings-field"
                                            htmlFor={fieldId}
                                        >
                                            <span>{fieldLabel(field)}</span>
                                            <input
                                                id={fieldId}
                                                type="number"
                                                min={field.min}
                                                max={field.max}
                                                value={Number(value ?? 0)}
                                                onChange={(
                                                    e: ChangeEvent<HTMLInputElement>,
                                                ) =>
                                                    setField(
                                                        field.key,
                                                        Number(e.target.value),
                                                    )
                                                }
                                            />
                                        </label>
                                    );
                                case "boolean":
                                    return (
                                        <label
                                            key={field.key}
                                            className="pb-settings-field pb-settings-field-inline"
                                            htmlFor={fieldId}
                                        >
                                            <input
                                                id={fieldId}
                                                type="checkbox"
                                                checked={Boolean(value)}
                                                onChange={(
                                                    e: ChangeEvent<HTMLInputElement>,
                                                ) =>
                                                    setField(
                                                        field.key,
                                                        e.target.checked,
                                                    )
                                                }
                                            />
                                            <span>{fieldLabel(field)}</span>
                                        </label>
                                    );
                                case "select":
                                    return (
                                        <label
                                            key={field.key}
                                            className="pb-settings-field"
                                            htmlFor={fieldId}
                                        >
                                            <span>{fieldLabel(field)}</span>
                                            <select
                                                id={fieldId}
                                                value={String(value ?? "")}
                                                onChange={(
                                                    e: ChangeEvent<HTMLSelectElement>,
                                                ) =>
                                                    setField(
                                                        field.key,
                                                        e.target.value,
                                                    )
                                                }
                                            >
                                                {(field.options ?? []).map(
                                                    (opt) => (
                                                        <option
                                                            key={opt}
                                                            value={opt}
                                                        >
                                                            {opt}
                                                        </option>
                                                    ),
                                                )}
                                            </select>
                                        </label>
                                    );
                                case "stringList":
                                    return (
                                        <label
                                            key={field.key}
                                            className="pb-settings-field"
                                            htmlFor={fieldId}
                                        >
                                            <span>{fieldLabel(field)}</span>
                                            <textarea
                                                id={fieldId}
                                                className="pb-settings-list-input"
                                                defaultValue={toStringArray(
                                                    value,
                                                ).join("\n")}
                                                placeholder={t(
                                                    "settings.oneItemPerLine",
                                                )}
                                                onBlur={(e) =>
                                                    setField(
                                                        field.key,
                                                        e.target.value
                                                            .split("\n")
                                                            .map((v) =>
                                                                v.trim(),
                                                            )
                                                            .filter(Boolean),
                                                    )
                                                }
                                            />
                                        </label>
                                    );
                                case "numberList":
                                    return (
                                        <label
                                            key={field.key}
                                            className="pb-settings-field"
                                            htmlFor={fieldId}
                                        >
                                            <span>{fieldLabel(field)}</span>
                                            <input
                                                id={fieldId}
                                                type="text"
                                                defaultValue={toNumberArray(
                                                    value,
                                                ).join(", ")}
                                                placeholder={t(
                                                    "settings.commaSeparatedNumbers",
                                                )}
                                                onBlur={(e) =>
                                                    setField(
                                                        field.key,
                                                        e.target.value
                                                            .split(",")
                                                            .map((v) =>
                                                                Number(
                                                                    v.trim(),
                                                                ),
                                                            )
                                                            .filter(
                                                                (n) =>
                                                                    !Number.isNaN(
                                                                        n,
                                                                    ),
                                                            ),
                                                    )
                                                }
                                            />
                                        </label>
                                    );
                                default:
                                    return null;
                            }
                        })}
                    </div>
                </SettingsSection>
            )}
        </aside>
    );
};

export default SettingsPanel;
