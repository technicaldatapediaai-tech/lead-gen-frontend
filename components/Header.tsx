"use client";

import { Bell, ChevronDown } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

export default function Header() {
    const { user } = useAuth();

    return (
        <header className="flex h-20 items-center justify-between border-b border-border/50 bg-card/80 backdrop-blur-md px-8 sticky top-0 z-50 transition-all duration-300 shadow-sm">
            <div className="flex gap-4">
                {/* Left side actions if any */}
            </div>

            <div className="flex items-center gap-6">
                <Link href="/dashboard/campaigns/create">
                    <button className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 transition-colors">
                        Start a campaign
                    </button>
                </Link>

                <div className="flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1.5 focus:outline-none hover:bg-amber-500/20 transition-colors cursor-default">
                    <span className="text-amber-600 dark:text-amber-400 text-sm font-medium">{user?.credits ?? 500} credits</span>
                </div>

                <button className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-full hover:bg-muted">
                    <Bell size={20} />
                </button>

                <Link href="/settings">
                    <div className="flex items-center gap-3 cursor-pointer hover:bg-muted p-1 pr-2 rounded-full transition-all">
                        <div className="h-8 w-8 rounded-full bg-blue-500/10 ring-2 ring-blue-500/20 overflow-hidden flex-shrink-0">
                            <img
                                src={user?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.id || 'User'}`}
                                alt="Avatar"
                                className="h-full w-full rounded-full object-cover bg-white"
                            />
                        </div>
                        <div className="hidden md:flex flex-col items-start leading-none">
                            <span className="text-sm font-semibold text-foreground truncate max-w-[120px]">
                                {user?.full_name || user?.email?.split('@')[0]}
                            </span>
                            <span className="text-[10px] text-muted-foreground mt-0.5">My account</span>
                        </div>
                        <ChevronDown size={14} className="text-muted-foreground" />
                    </div>
                </Link>
            </div>
        </header>
    );
}
