// components/pagebuilder/renderer/runtime.tsx
import type { ComponentType } from "react";

// Real runtime components, keyed by definition title. Add more as you split them out.
const Heading = ({ text, level }: { text: string; level: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" }) => {
    const Tag = level;
    return <Tag className="pb-el-heading">{text}</Tag>;
};

const Paragraph = ({ text }: { text: string }) => <p className="pb-el-paragraph">{text}</p>;

const Button = ({ text, href }: { text: string; href: string }) => (
    <a className="pb-el-button" href={href}>{text}</a>
);

export const runtime: Record<string, ComponentType<any>> = { Heading, Paragraph, Button };