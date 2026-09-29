// core/ui/settings/SettingsSection.tsx
"use client";
import { type ReactNode } from "react";
import { ChevronDown } from "lucide-react";

interface SettingsSectionProps {
    title: string;
    children: ReactNode;
    /** Controlled: whether this section is currently expanded. */
    isOpen: boolean;
    /** Called when the user clicks the header to toggle this section. */
    onToggle: () => void;
}

const SettingsSection = ({ title, children, isOpen, onToggle }: SettingsSectionProps) => (
    <details className="pb-settings-section" open={isOpen}>
        <summary
            className="pb-settings-section-title"
            onClick={(e) => {
                // We control "open" ourselves via the isOpen prop, so prevent the
                // native <details> toggle and let the parent decide instead.
                e.preventDefault();
                onToggle();
            }}
        >
            <span>{title}</span>
            <ChevronDown size={14} className="pb-settings-section-chevron" />
        </summary>
        <div className="pb-settings-section-body">{children}</div>
    </details>
);

export default SettingsSection;