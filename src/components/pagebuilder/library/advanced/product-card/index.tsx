import { Package } from "lucide-react";
import type { ComponentDefinition } from "@/components/pagebuilder/core/types";
import { escapeHtml } from "@/components/pagebuilder/core/utils/escapeHtml";
import EditableText from "@/components/pagebuilder/core/components/EditableText";

interface ProductCardProps { name: string; price: string; image: string }

const ProductCard: ComponentDefinition<ProductCardProps> = {
    title: "Product Card",
    group: "E-Commerce",
    icon: Package,
    tag: "commerce",
    label: "Product Card",
    defaultProps: () => ({ name: "Product name", price: "$49.00", image: "https://placehold.co/300x200" }),
    fields: [
        { key: "name", kind: "text", label: "Name" },
        { key: "price", kind: "text", label: "Price" },
        { key: "image", kind: "text", label: "Image URL" },
    ],
    render: ({ props, set }) => (
        <div className="pb-el-product">
            <img src={props.image} alt={props.name} />
            <EditableText as="h4" value={props.name} onChange={(name) => set({ name })} />
            <EditableText as="span" value={props.price} onChange={(price) => set({ price })} />
        </div>
    ),
    renderStatic: (props) =>
        `<div class="pb-el-product"><img src="${escapeHtml(props.image)}" alt="${escapeHtml(props.name)}" /><h4>${escapeHtml(props.name)}</h4><span>${escapeHtml(props.price)}</span></div>`,
    css: `
.pb-el-product { border: 1px solid var(--border-color); border-radius: 8px; padding: 10px; text-align: center; }
.pb-el-product img { width: 100%; border-radius: 6px; margin-bottom: 6px; }
`,
};

export default ProductCard;