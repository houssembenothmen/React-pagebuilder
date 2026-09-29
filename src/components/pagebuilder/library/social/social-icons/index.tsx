import { Share2 } from "lucide-react";
import type { ComponentDefinition } from "@/components/pagebuilder/core/types";
import { escapeHtml } from "@/components/pagebuilder/core/utils/escapeHtml";
import { FacebookIcon, TwitterIcon, InstagramIcon, LinkedinIcon } from "./BrandIcons";

const SOCIAL_ICONS: Record<string, typeof FacebookIcon> = {
    facebook: FacebookIcon,
    twitter: TwitterIcon,
    instagram: InstagramIcon,
    linkedin: LinkedinIcon,
};

interface SocialNetwork { network: string; href: string }
interface SocialIconsProps { networks: SocialNetwork[] }

const SocialIcons: ComponentDefinition<SocialIconsProps> = {
    title: "Social Icons",
    group: "Social",
    icon: Share2,
    tag: "social",
    label: "Social Icons",
    defaultProps: () => ({
        networks: [
            { network: "facebook", href: "#" },
            { network: "twitter", href: "#" },
            { network: "instagram", href: "#" },
            { network: "linkedin", href: "#" },
        ],
    }),
    render: ({ props, set }) => (
        <div className="pb-el-social-icons">
            {props.networks.map((n, i) => {
                const Icon = SOCIAL_ICONS[n.network] || FacebookIcon;
                return (
                    <a
                        key={i}
                        href={n.href}
                        onClick={(e) => e.preventDefault()}
                        onDoubleClick={(e) => {
                            e.stopPropagation();
                            const href = window.prompt("Link URL", n.href);
                            if (href != null) {
                                const networks = [...props.networks];
                                networks[i] = { ...networks[i], href };
                                set({ networks });
                            }
                        }}
                        title="Double-click to edit link"
                    >
                        <Icon size={18} />
                    </a>
                );
            })}
        </div>
    ),
    renderStatic: (props) =>
        `<div class="pb-el-social-icons">${props.networks
            .map((n) => `<a href="${escapeHtml(n.href)}" aria-label="${escapeHtml(n.network)}">${escapeHtml(n.network)}</a>`)
            .join("")}</div>`,
    css: `.pb-el-social-icons { display: flex; gap: 10px; color: var(--text-muted-color); }
.pb-el-social-icons a { color: inherit; display: inline-flex; }`,
};

export default SocialIcons;