import { SeparatorHorizontal } from "lucide-react";
import type { ComponentDefinition } from "@/components/pagebuilder/core/types";

const Divider: ComponentDefinition<Record<string, never>> = {
    title: "Divider",
    group: "Layout",
    icon: SeparatorHorizontal,
    tag: "decorative",
    label: "Divider",
    defaultProps: () => ({}),
    render: () => <hr className="pb-el-divider" />,
    renderStatic: () => `<hr class="pb-el-divider" />`,
    css: `.pb-el-divider { border: none; border-top: 1px solid var(--border-color); margin: 8px 0; }`,
};

export default Divider;