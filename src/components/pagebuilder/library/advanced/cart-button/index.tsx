import { useTranslations } from "next-intl";
import { ShoppingCart } from "lucide-react";
import type { ComponentDefinition } from "@/components/pagebuilder/core/types";

interface CartButtonProps { count: number }

const CartButtonRender = ({ props, set }: { props: CartButtonProps; set: (p: Partial<CartButtonProps>) => void }) => {
    const t = useTranslations("pagebuilder");
    return (
        <button className="pb-el-cart" onClick={(e) => { e.stopPropagation(); set({ count: props.count + 1 }); }}>
            {t("commerce.cart", { count: props.count })}
        </button>
    );
};

const CartButton: ComponentDefinition<CartButtonProps> = {
    title: "Cart Button",
    group: "E-Commerce",
    icon: ShoppingCart,
    tag: "commerce",
    label: "Cart Button",
    defaultProps: () => ({ count: 0 }),
    fields: [{ key: "count", kind: "number", label: "Count", min: 0 }],
    render: ({ props, set }) => <CartButtonRender props={props} set={set} />,
    renderStatic: (props) => `<button class="pb-el-cart">Cart (${props.count})</button>`,
    css: `.pb-el-cart { display: inline-flex; align-items: center; gap: 6px; padding: 8px 14px; background: var(--secondary-color); color: var(--surface-color); border-radius: 6px; font-size: 13px; }`,
};

export default CartButton;