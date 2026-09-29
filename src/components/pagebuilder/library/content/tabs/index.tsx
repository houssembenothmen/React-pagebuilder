import { PanelsTopLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ComponentDefinition } from "@/components/pagebuilder/core/types";
import { escapeHtml } from "@/components/pagebuilder/core/utils/escapeHtml";
import EditableText from "@/components/pagebuilder/core/components/EditableText";

interface TabsProps { tabs: string[]; active: number }

const TabsRender = ({ props, set }: { props: TabsProps; set: (p: Partial<TabsProps>) => void }) => {
    const t = useTranslations("pagebuilder");
    return (
        <div className="pb-el-tabs">
            <div className="pb-el-tabs-head">
                {props.tabs.map((tab, i) => (
                    <button
                        key={i}
                        className={i === props.active ? "active" : ""}
                        onClick={(e) => { e.stopPropagation(); set({ active: i }); }}
                    >
                        <EditableText
                            value={tab}
                            onChange={(text) => { const tabs = [...props.tabs]; tabs[i] = text; set({ tabs }); }}
                        />
                    </button>
                ))}
            </div>
            <div className="pb-el-tabs-body">{t("tabs.contentFor", { tab: props.tabs[props.active] })}</div>
        </div>
    );
};

const Tabs: ComponentDefinition<TabsProps> = {
    title: "Tabs",
    group: "Content",
    icon: PanelsTopLeft,
    tag: "interactive",
    label: "Tabs",
    defaultProps: () => ({ tabs: ["Tab 1", "Tab 2", "Tab 3"], active: 0 }),
    fields: [
        { key: "tabs", kind: "stringList", label: "Tab labels" },
        { key: "active", kind: "number", label: "Active tab index", min: 0 },
    ],
    render: ({ props, set }) => <TabsRender props={props} set={set} />,
    // Pure CSS radio-driven tabs (same trick as the gallery carousel) — no JS
    // needed for switching tabs in the exported page.
    renderStatic: (props, node) => {
        const uid = `tabs-${node.id}`;
        const radios = props.tabs
            .map((_, i) => `<input type="radio" class="pb-el-tabs-radio" name="${uid}" id="${uid}-${i}"${i === props.active ? " checked" : ""}>`)
            .join("");
        const heads = props.tabs.map((tab, i) => `<label class="pb-el-tabs-tab" for="${uid}-${i}">${escapeHtml(tab)}</label>`).join("");
        const panels = props.tabs.map((tab) => `<div class="pb-el-tabs-panel">${escapeHtml(tab)}</div>`).join("");
        const stateCss = props.tabs
            .map(
                (_, i) => `
#${uid}-${i}:checked ~ .pb-el-tabs-head .pb-el-tabs-tab:nth-child(${i + 1}) { border-bottom-color: var(--primary-color); color: var(--primary-color); }
#${uid}-${i}:checked ~ .pb-el-tabs-body .pb-el-tabs-panel:nth-child(${i + 1}) { display: block; }`
            )
            .join("");
        return `<div class="pb-el-tabs">${radios}<div class="pb-el-tabs-head">${heads}</div><div class="pb-el-tabs-body">${panels}</div><style>${stateCss}</style></div>`;
    },
    css: `
.pb-el-tabs-radio { display: none; }
.pb-el-tabs-head { display: flex; gap: 4px; border-bottom: 1px solid var(--border-color); }
.pb-el-tabs-head button, .pb-el-tabs-tab { padding: 6px 10px; font-size: 12px; cursor: pointer; border-bottom: 2px solid transparent; color: var(--text-muted-color); }
.pb-el-tabs-head button.active { border-bottom-color: var(--primary-color); color: var(--primary-color); }
.pb-el-tabs-body { padding: 10px 0; font-size: 13px; color: var(--text-muted-color); }
.pb-el-tabs-panel { display: none; }
`,
};

export default Tabs;