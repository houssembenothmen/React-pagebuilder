import { ChevronsDownUp } from "lucide-react";
import type { ComponentDefinition } from "@/components/pagebuilder/core/types";
import { escapeHtml } from "@/components/pagebuilder/core/utils/escapeHtml";
import EditableText from "@/components/pagebuilder/core/components/EditableText";

interface AccordionProps { title: string; body: string; open: boolean }

const Accordion: ComponentDefinition<AccordionProps> = {
    title: "Accordion",
    group: "Content",
    icon: ChevronsDownUp,
    tag: "interactive",
    label: "Accordion",
    defaultProps: () => ({ title: "Accordion item", body: "Accordion content goes here.", open: false }),
    fields: [
        { key: "title", kind: "text", label: "Title" },
        { key: "body", kind: "textarea", label: "Body" },
        { key: "open", kind: "boolean", label: "Open by default" },
    ],
    render: ({ props, set }) => (
        <div className="pb-el-accordion">
            <button className="pb-el-accordion-head" onClick={(e) => { e.stopPropagation(); set({ open: !props.open }); }}>
                <EditableText value={props.title} onChange={(t) => set({ title: t })} />
                <span>{props.open ? "−" : "+"}</span>
            </button>
            {props.open && (
                <div className="pb-el-accordion-body">
                    <EditableText as="p" value={props.body} onChange={(body) => set({ body })} />
                </div>
            )}
        </div>
    ),
    // Native <details>/<summary> toggles with zero JS — this is what actually
    // fixes the "doesn't work in the exported file" bug.
    renderStatic: (props) =>
        `<details class="pb-el-accordion"${props.open ? " open" : ""}><summary class="pb-el-accordion-head">${escapeHtml(
            props.title
        )}</summary><div class="pb-el-accordion-body"><p>${escapeHtml(props.body)}</p></div></details>`,
    css: `
.pb-el-accordion { border: 1px solid var(--border-color); border-radius: 8px; padding: 0 12px; }
.pb-el-accordion-head { display: flex; width: 100%; align-items: center; justify-content: space-between; padding: 10px 0; font-weight: 500; cursor: pointer; }
summary.pb-el-accordion-head { list-style: none; }
summary.pb-el-accordion-head::-webkit-details-marker { display: none; }
summary.pb-el-accordion-head::after { content: "+"; color: var(--text-muted-color); }
.pb-el-accordion[open] summary.pb-el-accordion-head::after { content: "\\2212"; }
.pb-el-accordion-body { padding: 0 0 12px; color: var(--text-muted-color); }
`,
};

export default Accordion;