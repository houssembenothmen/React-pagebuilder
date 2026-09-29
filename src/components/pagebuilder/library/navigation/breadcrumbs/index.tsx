import { Link as LinkIcon } from "lucide-react";
import type { ComponentDefinition } from "@/components/pagebuilder/core/types";
import { escapeHtml } from "@/components/pagebuilder/core/utils/escapeHtml";
import EditableText from "@/components/pagebuilder/core/components/EditableText";

interface CrumbItem { text: string; href: string }
interface BreadcrumbsProps { items: CrumbItem[] }

const Breadcrumbs: ComponentDefinition<BreadcrumbsProps> = {
    title: "Breadcrumbs",
    group: "Navigation",
    icon: LinkIcon,
    tag: "nav",
    label: "Breadcrumbs",
    defaultProps: () => ({
        items: [
            { text: "Home", href: "/" },
            { text: "Category", href: "/category" },
            { text: "Current Page", href: "" },
        ],
    }),
    render: ({ props, set }) => (
        <div className="pb-el-breadcrumbs">
            {props.items.map((item, i) => (
                <span key={i}>
                    <a
                        href={item.href || "#"}
                        onClick={(e) => e.preventDefault()}
                        onDoubleClick={(e) => {
                            e.stopPropagation();
                            const href = window.prompt("Link URL", item.href);
                            if (href != null) {
                                const items = [...props.items];
                                items[i] = { ...items[i], href };
                                set({ items });
                            }
                        }}
                        title="Double-click to edit link"
                    >
                        <EditableText
                            value={item.text}
                            onChange={(text) => { const items = [...props.items]; items[i] = { ...items[i], text }; set({ items }); }}
                        />
                    </a>
                    {i < props.items.length - 1 && <span className="pb-el-breadcrumb-sep">/</span>}
                </span>
            ))}
        </div>
    ),
    renderStatic: (props) =>
        `<div class="pb-el-breadcrumbs">${props.items
            .map((item, idx) => {
                const link = item.href ? `<a href="${escapeHtml(item.href)}">${escapeHtml(item.text)}</a>` : escapeHtml(item.text);
                return `<span>${link}${idx < props.items.length - 1 ? '<span class="pb-el-breadcrumb-sep">/</span>' : ""}</span>`;
            })
            .join("")}</div>`,
    css: `
.pb-el-breadcrumbs { display: flex; gap: 6px; font-size: 12px; color: var(--text-muted-color); }
.pb-el-breadcrumbs a { color: inherit; }
.pb-el-breadcrumb-sep { margin-left: 6px; }
`,
};

export default Breadcrumbs;