import { Star } from "lucide-react";
import type { ComponentDefinition } from "@/components/pagebuilder/core/types";

interface StarRatingProps { rating: number; max: number }

const StarRating: ComponentDefinition<StarRatingProps> = {
    title: "Star Rating",
    group: "Content",
    icon: Star,
    tag: "interactive",
    label: "Star Rating",
    defaultProps: () => ({ rating: 4, max: 5 }),
    fields: [
        { key: "rating", kind: "number", label: "Rating", min: 0, max: 10 },
        { key: "max", kind: "number", label: "Max stars", min: 1, max: 10 },
    ],
    render: ({ props, set }) => (
        <div className="pb-el-rating">
            {Array.from({ length: props.max }).map((_, i) => (
                <Star
                    key={i}
                    size={18}
                    fill={i < props.rating ? "currentColor" : "none"}
                    onClick={(e) => { e.stopPropagation(); set({ rating: i + 1 }); }}
                />
            ))}
        </div>
    ),
    renderStatic: (props) => `<div class="pb-el-rating">${"★".repeat(props.rating)}${"☆".repeat(Math.max(0, props.max - props.rating))}</div>`,
    css: `.pb-el-rating { display: flex; gap: 2px; color: var(--accent-tertiary-color); cursor: pointer; }`,
};

export default StarRating;