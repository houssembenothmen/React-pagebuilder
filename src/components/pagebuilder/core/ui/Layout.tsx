import type { ReactNode } from "react";
import Sidebar from "./Sidebar";
import SettingsPanel from "./SettingsPanel";
import ExportBar from "./ExportBar";

const Layout = ({ children }: { children: ReactNode }) => (
    <div className="pb-shell">
        <ExportBar />
        <main className="pb-main">
            <Sidebar />
            <div className="pb-content">{children}</div>
            <SettingsPanel />
        </main>
    </div>
);

export default Layout;