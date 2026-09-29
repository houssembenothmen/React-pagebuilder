// library/content/timeline/index.tsx
import { History, Plus, X } from "lucide-react";
import type { ComponentDefinition } from "@/components/pagebuilder/core/types";
import { escapeHtml } from "@/components/pagebuilder/core/utils/escapeHtml";
import EditableText from "@/components/pagebuilder/core/components/EditableText";

interface TimelineEvent {
    date: string;
    text: string;
}
interface TimelineProps {
    events: TimelineEvent[];
}

const Timeline: ComponentDefinition<TimelineProps> = {
    title: "Timeline",
    group: "Content",
    icon: History,
    tag: "content",
    label: "Timeline",
    // No `fields` — like Table/Gallery, this is edited entirely inline
    // because it's an array of objects, which doesn't map to a single
    // settings-panel field kind.
    defaultProps: () => ({
        events: [
            { date: "2024", text: "Event one" },
            { date: "2025", text: "Event two" },
        ],
    }),
    render: ({ props, set }) => {
        const updateEvent = (i: number, patch: Partial<TimelineEvent>) => {
            const events = [...props.events];
            events[i] = { ...events[i], ...patch };
            set({ events });
        };

        const addEvent = (e: React.MouseEvent) => {
            e.stopPropagation();
            set({
                events: [
                    ...props.events,
                    { date: "New date", text: "New event" },
                ],
            });
        };

        const removeEvent = (e: React.MouseEvent, i: number) => {
            e.stopPropagation();
            if (props.events.length <= 1) return; // keep at least one row
            set({ events: props.events.filter((_, idx) => idx !== i) });
        };

        return (
            <div className="pb-el-timeline-wrap">
                <ul className="pb-el-timeline">
                    {props.events.map((ev, i) => (
                        <li key={i}>
                            <div className="pb-el-timeline-content">
                                <EditableText
                                    as="span"
                                    className="pb-el-timeline-date"
                                    value={ev.date}
                                    onChange={(date) =>
                                        updateEvent(i, { date })
                                    }
                                />
                                <EditableText
                                    value={ev.text}
                                    onChange={(text) =>
                                        updateEvent(i, { text })
                                    }
                                />
                            </div>
                            <button
                                type="button"
                                className="pb-el-timeline-remove"
                                onClick={(e) => removeEvent(e, i)}
                                title="Remove event"
                            >
                                <X size={12} />
                            </button>
                        </li>
                    ))}
                </ul>
                <button
                    type="button"
                    className="pb-el-timeline-add"
                    onClick={addEvent}
                >
                    <Plus size={13} /> Add event
                </button>
            </div>
        );
    },
    renderStatic: (props) =>
        `<ul class="pb-el-timeline">${props.events
            .map(
                (ev) =>
                    `<li><span class="pb-el-timeline-date">${escapeHtml(ev.date)}</span>${escapeHtml(ev.text)}</li>`,
            )
            .join("")}</ul>`,
    css: `
.pb-el-timeline-wrap { display: flex; flex-direction: column; gap: 8px; }
.pb-el-timeline { list-style: none; margin: 0; padding: 0; }
.pb-el-timeline li {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 10px;
    padding: 6px 0;
    border-inline-start: 2px solid var(--border-color);
    padding-inline-start: 12px;
}
.pb-el-timeline-content { display: flex; flex-direction: column; gap: 2px; }
.pb-el-timeline-date { font-weight: 600; color: var(--primary-color); font-size: 12px; }
.pb-el-timeline-remove {
    flex-shrink: 0;
    width: 18px;
    height: 18px;
    border-radius: 4px;
    color: var(--text-muted-color);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
}
.pb-el-timeline-remove:hover { background: var(--error-bg-color, #fef2f2); color: var(--error-color, #b91c1c); }
.pb-el-timeline-add {
    align-self: flex-start;
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 4px 10px;
    border: 1px dashed var(--border-strong-color);
    border-radius: 6px;
    font-size: 11px;
    color: var(--text-muted-color);
    cursor: pointer;
}
.pb-el-timeline-add:hover { color: var(--primary-color); border-color: var(--primary-color); }
`,
};

export default Timeline;
