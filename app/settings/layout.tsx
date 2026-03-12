"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    User,
    Linkedin,
    Activity,
    Mail,
    Bot,
    FileText,
    List,
    ChevronDown
} from "lucide-react";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function SettingsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    const isActive = (path: string) => {
        if (path === "/settings" && pathname === "/settings") return true;
        if (path !== "/settings" && pathname?.startsWith(path)) return true;
        return false;
    };

    return (
        <ProtectedRoute>
            <div className="flex h-screen w-full bg-background text-foreground transition-colors duration-300">
                {/* Settings Sidebar */}
                <aside className="flex w-[260px] flex-col border-r border-border bg-card transition-colors duration-300">
                    <div className="p-6 pb-2">
                        <h1 className="text-xl font-bold text-foreground">Settings</h1>
                    </div>

                    <nav className="flex-1 space-y-1 px-3 py-4">
                        <NavItem
                            href="/settings"
                            label="My account"
                            active={isActive("/settings")}
                            icon={<div className="h-5 w-5 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400"></div>}
                        />
                        <NavItem href="/settings/linkedin" label="LinkedIn Account" active={isActive("/settings/linkedin")} icon={<Linkedin size={18} />} />
                        <NavItem href="/settings/activity" label="Account activity" active={isActive("/settings/activity")} icon={<Activity size={18} />} />
                        <NavItem href="/settings/email" label="Email accounts" active={isActive("/settings/email")} icon={<Mail size={18} />} />
                        <NavItem
                            href="/settings/call-bot"
                            label="AI Call Bot"
                            active={isActive("/settings/call-bot")}
                            icon={<Bot size={18} />}
                            badge="Coming Soon"
                        />
                        <NavItem href="/settings/invoices" label="Invoices" active={isActive("/settings/invoices")} icon={<FileText size={18} />} />
                        <NavItem href="/settings/import" label="Import history" active={isActive("/settings/import")} icon={<List size={18} />} />
                    </nav>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-background">
                    {children}
                </main>
            </div>
        </ProtectedRoute>
    );
}

function NavItem({ href, label, icon, active, badge }: any) {
    return (
        <Link
            href={href}
            className={`
                group flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition
                ${active
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                }
            `}
        >
            <div className="flex items-center gap-3">
                <span className={active ? "opacity-100" : "opacity-70 group-hover:opacity-100"}>{icon}</span>
                <span>{label}</span>
            </div>
            {badge && (
                <span className="text-[10px] font-bold text-blue-500">{badge}</span>
            )}
        </Link>
    )
}
