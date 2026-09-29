import { Table as TableIcon } from "lucide-react";
import type { ComponentDefinition } from "@/components/pagebuilder/core/types";
import { escapeHtml } from "@/components/pagebuilder/core/utils/escapeHtml";
import EditableText from "@/components/pagebuilder/core/components/EditableText";

interface TableProps { headers: string[]; rows: string[][] }

const Table: ComponentDefinition<TableProps> = {
    title: "Table",
    group: "Content",
    icon: TableIcon,
    tag: "content",
    label: "Table",
    defaultProps: () => ({
        headers: ["Column A", "Column B", "Column C"],
        rows: [
            ["Row 1A", "Row 1B", "Row 1C"],
            ["Row 2A", "Row 2B", "Row 2C"],
        ],
    }),
    render: ({ props, set }) => {
        const addColumn = (e: React.MouseEvent) => {
            e.stopPropagation();
            set({ headers: [...props.headers, `Column ${props.headers.length + 1}`], rows: props.rows.map((r) => [...r, ""]) });
        };
        const removeColumn = (e: React.MouseEvent, idx: number) => {
            e.stopPropagation();
            if (props.headers.length <= 1) return;
            set({ headers: props.headers.filter((_, i) => i !== idx), rows: props.rows.map((r) => r.filter((_, i) => i !== idx)) });
        };
        const addRow = (e: React.MouseEvent) => {
            e.stopPropagation();
            set({ rows: [...props.rows, props.headers.map(() => "")] });
        };
        const removeRow = (e: React.MouseEvent, idx: number) => {
            e.stopPropagation();
            if (props.rows.length <= 1) return;
            set({ rows: props.rows.filter((_, i) => i !== idx) });
        };

        return (
            <div className="pb-el-table-wrap">
                <table className="pb-el-table">
                    <thead>
                        <tr>
                            {props.headers.map((h, i) => (
                                <th key={i}>
                                    <div className="pb-el-table-th-inner">
                                        <EditableText
                                            value={h}
                                            onChange={(text) => { const headers = [...props.headers]; headers[i] = text; set({ headers }); }}
                                        />
                                        <button className="pb-el-table-col-remove" onClick={(e) => removeColumn(e, i)} title="Remove column">×</button>
                                    </div>
                                </th>
                            ))}
                            <th className="pb-el-table-add-cell">
                                <button className="pb-el-table-add-btn" onClick={addColumn} title="Add column">+</button>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {props.rows.map((row, ri) => (
                            <tr key={ri}>
                                {row.map((cell, ci) => (
                                    <td key={ci}>
                                        <EditableText
                                            value={cell}
                                            onChange={(text) => { const rows = props.rows.map((r) => [...r]); rows[ri][ci] = text; set({ rows }); }}
                                        />
                                    </td>
                                ))}
                                <td className="pb-el-table-add-cell">
                                    <button className="pb-el-table-row-remove" onClick={(e) => removeRow(e, ri)} title="Remove row">×</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <button className="pb-el-table-add-row-btn" onClick={addRow}>+ Add row</button>
            </div>
        );
    },
    renderStatic: (props) =>
        `<table class="pb-el-table"><thead><tr>${props.headers
            .map((h) => `<th>${escapeHtml(h)}</th>`)
            .join("")}</tr></thead><tbody>${props.rows
            .map((row) => `<tr>${row.map((c) => `<td>${escapeHtml(c)}</td>`).join("")}</tr>`)
            .join("")}</tbody></table>`,
    css: `
.pb-el-table-wrap { display: flex; flex-direction: column; gap: 8px; }
.pb-el-table { width: 100%; border-collapse: collapse; font-size: 12px; }
.pb-el-table th, .pb-el-table td { border: 1px solid var(--border-color); padding: 6px 8px; text-align: left; }
.pb-el-table th { background: var(--surface-hover-color); }
.pb-el-table-th-inner { display: flex; align-items: center; justify-content: space-between; gap: 6px; }
.pb-el-table-col-remove, .pb-el-table-row-remove {
    flex-shrink: 0; width: 16px; height: 16px; border-radius: 3px; line-height: 1; font-size: 11px;
    color: var(--text-muted-color); display: flex; align-items: center; justify-content: center; cursor: pointer;
}
.pb-el-table-col-remove:hover, .pb-el-table-row-remove:hover { background: var(--error-bg-color, #fef2f2); color: var(--error-color, #b91c1c); }
.pb-el-table-add-cell { border: none !important; background: transparent !important; width: 26px; padding: 0 !important; text-align: center; }
.pb-el-table-add-btn {
    width: 20px; height: 20px; border-radius: 4px; border: 1px dashed var(--border-strong-color);
    color: var(--text-muted-color); cursor: pointer; font-size: 13px; line-height: 1;
}
.pb-el-table-add-btn:hover { color: var(--primary-color); border-color: var(--primary-color); }
.pb-el-table-add-row-btn {
    align-self: flex-start; padding: 4px 10px; border: 1px dashed var(--border-strong-color); border-radius: 6px;
    font-size: 11px; color: var(--text-muted-color); cursor: pointer;
}
.pb-el-table-add-row-btn:hover { color: var(--primary-color); border-color: var(--primary-color); }
`,
};

export default Table;