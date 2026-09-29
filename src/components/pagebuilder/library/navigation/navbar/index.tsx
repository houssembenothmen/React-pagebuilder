import { Menu } from "lucide-react";
import type { ComponentDefinition } from "@/components/pagebuilder/core/types";
import { escapeHtml } from "@/components/pagebuilder/core/utils/escapeHtml";
import EditableText from "@/components/pagebuilder/core/components/EditableText";

interface NavLink { text: string; href: string }
interface NavbarProps { links: NavLink[] }

const Navbar: ComponentDefinition<NavbarProps> = {
    title: "Navbar",
    group: "Navigation",
    icon: Menu,
    tag: "nav",
    label: "Navbar",
    defaultProps: () => ({
        links: [
            { text: "Home", href: "/" },
            { text: "About", href: "/about" },
            { text: "Services", href: "/services" },
            { text: "Contact", href: "/contact" },
        ],
    }),
    render: ({ props, set }) => (
        <nav className="pb-el-navbar">
            {props.links.map((link, i) => (
                <a
                    key={i}
                    href={link.href}
                    className="pb-el-navbar-link"
                    onClick={(e) => e.preventDefault()}
                    onDoubleClick={(e) => {
                        e.stopPropagation();
                        const href = window.prompt("Link URL", link.href);
                        if (href != null) {
                            const links = [...props.links];
                            links[i] = { ...links[i], href };
                            set({ links });
                        }
                    }}
                    title="Double-click to edit link"
                >
                    <EditableText
                        value={link.text}
                        onChange={(text) => { const links = [...props.links]; links[i] = { ...links[i], text }; set({ links }); }}
                    />
                </a>
            ))}
        </nav>
    ),
    renderStatic: (props) =>
        `<nav class="pb-el-navbar">${props.links.map((l) => `<a href="${escapeHtml(l.href)}">${escapeHtml(l.text)}</a>`).join("")}</nav>`,
    css: `.pb-el-navbar { display: flex; gap: 16px; font-size: 13px; font-weight: 500; }
.pb-el-navbar a { color: inherit; }`,
};

export default Navbar;