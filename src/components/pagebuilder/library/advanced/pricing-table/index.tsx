import { CreditCard } from "lucide-react";
import type { ComponentDefinition } from "@/components/pagebuilder/core/types";
import { escapeHtml } from "@/components/pagebuilder/core/utils/escapeHtml";
import EditableText from "@/components/pagebuilder/core/components/EditableText";

interface PricingPlan { name: string; price: string; features: string[] }
interface PricingTableProps { plans: PricingPlan[] }

const PricingTable: ComponentDefinition<PricingTableProps> = {
    title: "Pricing Table",
    group: "E-Commerce",
    icon: CreditCard,
    tag: "commerce",
    label: "Pricing Table",
    defaultProps: () => ({
        plans: [
            { name: "Basic", price: "$9/mo", features: ["Feature 1", "Feature 2"] },
            { name: "Pro", price: "$29/mo", features: ["Everything in Basic", "Feature 3", "Feature 4"] },
        ],
    }),
    render: ({ props, set }) => (
        <div className="pb-el-pricing">
            {props.plans.map((plan, i) => (
                <div key={i} className="pb-el-pricing-plan">
                    <EditableText
                        as="h4"
                        value={plan.name}
                        onChange={(name) => { const plans = [...props.plans]; plans[i] = { ...plans[i], name }; set({ plans }); }}
                    />
                    <EditableText
                        as="p"
                        className="pb-el-pricing-price"
                        value={plan.price}
                        onChange={(price) => { const plans = [...props.plans]; plans[i] = { ...plans[i], price }; set({ plans }); }}
                    />
                    <ul>{plan.features.map((f, fi) => <li key={fi}>{f}</li>)}</ul>
                </div>
            ))}
        </div>
    ),
    renderStatic: (props) =>
        `<div class="pb-el-pricing">${props.plans
            .map((p) => `<div class="pb-el-pricing-plan"><h4>${escapeHtml(p.name)}</h4><p class="pb-el-pricing-price">${escapeHtml(p.price)}</p><ul>${p.features.map((f) => `<li>${escapeHtml(f)}</li>`).join("")}</ul></div>`)
            .join("")}</div>`,
    css: `
.pb-el-pricing { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 12px; }
.pb-el-pricing-plan { border: 1px solid var(--border-color); border-radius: 8px; padding: 12px; text-align: center; }
.pb-el-pricing-plan ul { margin-top: 8px; font-size: 11px; color: var(--text-muted-color); }
.pb-el-pricing-price { font-weight: 700; margin: 4px 0; }
`,
};

export default PricingTable;