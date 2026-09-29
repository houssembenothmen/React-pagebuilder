import { List as ListIcon } from "lucide-react";
import type { ComponentDefinition } from "@/components/pagebuilder/core/types";
import { escapeHtml } from "@/components/pagebuilder/core/utils/escapeHtml";
import EditableText from "@/components/pagebuilder/core/components/EditableText";

interface ListProps { items: string[] }

const ListDef: ComponentDefinition<ListProps> = {
    title: "List",
    group: "Content",
    icon: ListIcon,
    tag: "content",
    label: "List",
    defaultProps: () => ({ items: ["List item one", "List item two", "List item three"] }),
    fields: [{ key: "items", kind: "stringList", label: "Items" }],
    render: ({ props, set }) => (
        <ul className="pb-el-list">
            {props.items.map((li, i) => (
                <li key={i}>
                    <EditableText
                        value={li}
                        onChange={(text) => {
                            const items = [...props.items];
                            items[i] = text;
                            set({ items });
                        }}
                    />
                </li>
            ))}
        </ul>
    ),
    renderStatic: (props) => `<ul class="pb-el-list">${props.items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`,
    css: `
.pb-el-list { padding-left: 18px; }
.pb-el-list li { list-style: disc; margin-bottom: 4px; }
`,
};

export default ListDef;