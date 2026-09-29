// library/forms/date-picker/index.tsx
import { CalendarDays } from "lucide-react";
import type { ComponentDefinition } from "@/components/pagebuilder/core/types";
import { escapeHtml } from "@/components/pagebuilder/core/utils/escapeHtml";
import EditableText from "@/components/pagebuilder/core/components/EditableText";

interface DatePickerProps { label: string; name: string }

const DatePicker: ComponentDefinition<DatePickerProps> = {
    title: "Date Picker",
    group: "Forms",
    icon: CalendarDays,
    tag: "form",
    label: "Date Picker",
    defaultProps: () => ({ label: "Date", name: "date" }),
    fields: [
        { key: "label", kind: "text", label: "Label" },
        { key: "name", kind: "text", label: "Field name" },
    ],
    render: ({ props, set }) => (
        <label className="pb-el-field">
            <EditableText value={props.label} onChange={(label) => set({ label })} />
            <input type="date" name={props.name} onClick={(e) => e.stopPropagation()} />
        </label>
    ),
    renderStatic: (props) => `<label class="pb-el-field">${escapeHtml(props.label)}<input type="date" name="${escapeHtml(props.name)}" /></label>`,
};

export default DatePicker;