"use client";

import { useMemo, useState, type ChangeEvent, type DragEvent, type MouseEvent } from "react";
import { GripVertical, History, Pin, Search, StarOff } from "lucide-react";
import { useTranslations } from "next-intl";
import { usePageBuilder } from "../context/PageBuilderContext";
import { componentRegistry } from "../registry";
import { DND_TYPES } from "../dnd";
import type { ComponentDefinition } from "../types";

const Sidebar = () => {
    const t = useTranslations("pagebuilder");
    const { addComponent, selectedContainerForInsert, selectedInsertIndex } = usePageBuilder();
    const [searchQuery, setSearchQuery] = useState("");
    const [favorites, setFavorites] = useState<Set<string>>(new Set());
    const [recentItems, setRecentItems] = useState<ComponentDefinition[]>([]);

    const containerDef = selectedContainerForInsert ? componentRegistry.get(selectedContainerForInsert.title) : null;
    const allowedTitles = containerDef?.allowedChildren ? new Set(containerDef.allowedChildren) : null;

const isAllowed = (def: ComponentDefinition): boolean =>
    !def.hidden && (!allowedTitles || allowedTitles.has(def.title));

    const toggleFavorite = (e: MouseEvent<HTMLButtonElement>, title: string) => {
        e.stopPropagation();
        setFavorites((prev) => {
            const next = new Set(prev);
            if (next.has(title)) next.delete(title);
            else next.add(title);
            return next;
        });
    };

    const handleItemClick = (def: ComponentDefinition) => {
        const parentId = selectedContainerForInsert ? selectedContainerForInsert.id : null;
        addComponent(def.title, parentId, selectedInsertIndex);
        setRecentItems((prev) => [def, ...prev.filter((r) => r.title !== def.title)].slice(0, 5));
    };

    const groups = useMemo(() => {
        const q = searchQuery.trim().toLowerCase();
        return componentRegistry
            .getByGroup()
            .map((group) => ({
                ...group,
                items: group.items.filter((def) => {
                    if (!isAllowed(def)) return false;
                    if (!q) return true;
                    return def.title.toLowerCase().includes(q) || def.tag.toLowerCase().includes(q);
                }),
            }))
            .filter((group) => group.items.length > 0);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchQuery, allowedTitles]);

    const favItems = useMemo(
        () => componentRegistry.getAll().filter((def) => favorites.has(def.title) && isAllowed(def)),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [favorites, allowedTitles]
    );

    const visibleRecentItems = useMemo(
        () => recentItems.filter(isAllowed),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [recentItems, allowedTitles]
    );

    const label = (def: ComponentDefinition) => (def.labelKey ? t(def.labelKey) : def.label);
    const groupLabel = (group: { group: string; groupLabelKey?: string }) =>
        group.groupLabelKey ? t(group.groupLabelKey) : group.group;

    const renderItem = (def: ComponentDefinition, isFavoriteSection = false) => {
        const Icon = def.icon;
        const isFav = favorites.has(def.title);
        return (
            <li
                key={`${isFavoriteSection ? "fav-" : ""}${def.title}`}
                className="pb-sidebar-feature-item"
                onClick={() => handleItemClick(def)}
                draggable
                onDragStart={(e: DragEvent<HTMLLIElement>) => {
                    e.dataTransfer.setData(DND_TYPES.sidebarComponent, def.title);
                    e.dataTransfer.effectAllowed = "copy";
                }}
                title={t("sidebar.dragOrClickToAdd")}
            >
                <GripVertical size={14} className="pb-sidebar-drag-handle" />
                <Icon className="pb-sidebar-feature-item-icon" size={20} />
                <h4 className="pb-sidebar-feature-item-title">{label(def)}</h4>
                <button
                    className="pb-sidebar-fav-btn"
                    onClick={(e: MouseEvent<HTMLButtonElement>) => toggleFavorite(e, def.title)}
                    data-favorited={isFav}
                    title={isFav ? t("sidebar.removeFromFavorites") : t("sidebar.addToFavorites")}
                >
                    {isFav ? <Pin size={14} /> : <StarOff size={14} />}
                </button>
            </li>
        );
    };

    return (
        <div className="pb-sidebar pb-sidebar-left">
            <div className="pb-sidebar-search-wrapper">
                <Search size={16} className="pb-sidebar-search-icon" />
                <input
                    type="text"
                    placeholder={t("sidebar.searchPlaceholder")}
                    value={searchQuery}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                    className="pb-sidebar-search"
                />
            </div>

            {selectedContainerForInsert && allowedTitles && containerDef && (
                <p className="pb-sidebar-context-hint">
                    {t.rich("sidebar.showingInsideContext", {
                        title: label(containerDef),
                        strong: (chunks) => <strong>{chunks}</strong>,
                    })}
                </p>
            )}

            {favItems.length > 0 && !searchQuery && (
                <div className="pb-sidebar-feature">
                    <h3 className="pb-sidebar-feature-title"><Pin size={14} />{t("sidebar.favorites")}</h3>
                    <ul className="pb-sidebar-feature-items">{favItems.map((def) => renderItem(def, true))}</ul>
                </div>
            )}

            {visibleRecentItems.length > 0 && !searchQuery && (
                <div className="pb-sidebar-feature">
                    <h3 className="pb-sidebar-feature-title"><History size={14} />{t("sidebar.recentlyUsed")}</h3>
                    <ul className="pb-sidebar-feature-items">{visibleRecentItems.map((def) => renderItem(def, true))}</ul>
                </div>
            )}

            {groups.map((group, index) => (
                <div key={`group-${index}`} className="pb-sidebar-feature">
                    <h3 className="pb-sidebar-feature-title">{groupLabel(group)}</h3>
                    <ul className="pb-sidebar-feature-items">{group.items.map((def) => renderItem(def))}</ul>
                </div>
            ))}

            {groups.length === 0 && (
                <div className="pb-sidebar-empty">
                    <Search size={32} />
                    <p>
                        {searchQuery
                            ? t("sidebar.noComponentsFound")
                            : allowedTitles
                              ? t("sidebar.noAddableComponentsFor", {
                                    title: containerDef ? label(containerDef) : t("sidebar.thisElement"),
                                })
                              : t("sidebar.noComponentsFound")}
                    </p>
                </div>
            )}
        </div>
    );
};

export default Sidebar;