import { Users, User } from "lucide-react";
import type { ComponentDefinition } from "@/components/pagebuilder/core/types";
import { escapeHtml } from "@/components/pagebuilder/core/utils/escapeHtml";
import EditableText from "@/components/pagebuilder/core/components/EditableText";

interface TeamMember { name: string; role: string }
interface TeamMembersProps { members: TeamMember[] }

const TeamMembers: ComponentDefinition<TeamMembersProps> = {
    title: "Team Members",
    group: "Social",
    icon: Users,
    tag: "social",
    label: "Team Members",
    defaultProps: () => ({ members: [{ name: "Jane Doe", role: "Designer" }, { name: "John Smith", role: "Developer" }] }),
    render: ({ props, set }) => (
        <div className="pb-el-team">
            {props.members.map((m, i) => (
                <div key={i} className="pb-el-team-member">
                    <User size={28} />
                    <EditableText
                        value={m.name}
                        onChange={(name) => { const members = [...props.members]; members[i] = { ...members[i], name }; set({ members }); }}
                    />
                    <EditableText
                        as="span"
                        value={m.role}
                        onChange={(role) => { const members = [...props.members]; members[i] = { ...members[i], role }; set({ members }); }}
                    />
                </div>
            ))}
        </div>
    ),
    renderStatic: (props) =>
        `<div class="pb-el-team">${props.members
            .map((m) => `<div class="pb-el-team-member"><strong>${escapeHtml(m.name)}</strong><span>${escapeHtml(m.role)}</span></div>`)
            .join("")}</div>`,
    css: `
.pb-el-team { display: grid; grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)); gap: 12px; text-align: center; }
.pb-el-team-member { display: flex; flex-direction: column; align-items: center; gap: 2px; font-size: 12px; }
`,
};

export default TeamMembers;