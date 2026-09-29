import { Bell } from "lucide-react";
import type { ComponentDefinition } from "@/components/pagebuilder/core/types";
import { escapeHtml } from "@/components/pagebuilder/core/utils/escapeHtml";
import EditableText from "@/components/pagebuilder/core/components/EditableText";

type NotificationVariant = "info" | "warning" | "error";
interface NotificationProps { text: string; variant: NotificationVariant }

const Notification: ComponentDefinition<NotificationProps> = {
    title: "Notification",
    group: "Advanced",
    icon: Bell,
    tag: "advanced",
    label: "Notification",
    defaultProps: () => ({ text: "This is a notification message.", variant: "info" }),
    fields: [
        { key: "text", kind: "textarea", label: "Text" },
        { key: "variant", kind: "select", label: "Variant", options: ["info", "warning", "error"] },
    ],
    render: ({ props, set }) => (
        <div className={`pb-el-notification pb-el-notification-${props.variant}`}>
            <EditableText value={props.text} onChange={(text) => set({ text })} />
        </div>
    ),
    renderStatic: (props) => `<div class="pb-el-notification pb-el-notification-${props.variant}">${escapeHtml(props.text)}</div>`,
    css: `
.pb-el-notification { padding: 10px 12px; border-radius: 6px; font-size: 13px; }
.pb-el-notification-info { background: var(--info-bg-color, #eef2ff); color: var(--info-color, #4338ca); }
.pb-el-notification-warning { background: var(--warning-bg-color, #fffbeb); color: var(--warning-color, #b45309); }
.pb-el-notification-error { background: var(--error-bg-color, #fef2f2); color: var(--error-color, #b91c1c); }
`,
};

export default Notification;