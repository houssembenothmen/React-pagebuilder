import { Code2 } from "lucide-react";
import type { ComponentDefinition } from "@/components/pagebuilder/core/types";
import { escapeHtml } from "@/components/pagebuilder/core/utils/escapeHtml";
import EditableText from "@/components/pagebuilder/core/components/EditableText";

interface CodeBlockProps { code: string }

const CodeBlock: ComponentDefinition<CodeBlockProps> = {
    title: "Code Block",
    group: "Typography",
    icon: Code2,
    tag: "text",
    label: "Code Block",
    supportsTypography: true,
    defaultProps: () => ({ code: "console.log('Hello world');" }),
    fields: [{ key: "code", kind: "textarea", label: "Code" }],
    render: ({ props, set }) => (
        <pre className="pb-el-code">
            <EditableText as="code" value={props.code} onChange={(code) => set({ code })} />
        </pre>
    ),
    renderStatic: (props) => `<pre class="pb-el-code"><code>${escapeHtml(props.code)}</code></pre>`,
    css: `.pb-el-code { background: var(--secondary-color); color: var(--tertiary-color); padding: 10px 12px; border-radius: 6px; font-family: monospace; font-size: 12px; overflow-x: auto; }`,
};

export default CodeBlock;