import { ThumbsUp } from "lucide-react";
import type { ComponentDefinition } from "@/components/pagebuilder/core/types";

interface LikeButtonProps { count: number }

const LikeButton: ComponentDefinition<LikeButtonProps> = {
    title: "Like Button",
    group: "Social",
    icon: ThumbsUp,
    tag: "social",
    label: "Like Button",
    defaultProps: () => ({ count: 0 }),
    fields: [{ key: "count", kind: "number", label: "Count", min: 0 }],
    render: ({ props, set }) => (
        <button className="pb-el-like" onClick={(e) => { e.stopPropagation(); set({ count: props.count + 1 }); }}>
            <ThumbsUp size={16} /> {props.count}
        </button>
    ),
    renderStatic: (props) => `<button class="pb-el-like">&#128077; ${props.count}</button>`,
    css: `.pb-el-like { display: inline-flex; align-items: center; gap: 6px; font-size: 13px; }`,
};

export default LikeButton;