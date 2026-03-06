"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
    Search,
    Play,
    MoreHorizontal,
    Plus,
    Rocket,
    Settings,
    Pause,
    Edit3,
    Archive,
    Users,
} from "lucide-react";

export default function CampaignsPage() {
    const [activeTab, setActiveTab] = useState("Running");

    return (
        <div className="flex h-full flex-col bg-background text-muted-foreground transition-colors duration-300">
            {/* Header */}
            <header className="flex items-center justify-between px-8 py-8 transition-colors">
                <h1 className="text-2xl font-bold text-foreground">My campaigns</h1>
                <Link
                    href="/dashboard/campaigns/templates"
                    className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-[0_4px_20px_rgba(37,99,255,0.3)] hover:bg-blue-500 transition"
                >
                    Start a campaign
                    <Plus className="h-4 w-4" />
                </Link>
            </header>

            {/* Controls Bar */}
            <div className="px-8 mb-8">
                <div className="flex items-center justify-between">
                    {/* Tabs */}
                    <div className="flex items-center gap-1 rounded-xl bg-card p-1 border border-border transition-colors">
                        <TabButton
                            label="Running"
                            count={5}
                            icon={<Play className="h-3 w-3 fill-current" />}
                            active={activeTab === "Running"}
                            onClick={() => setActiveTab("Running")}
                            activeColor="bg-blue-600 text-white"
                        />
                        <div className="w-px h-4 bg-border mx-1" />
                        <TabButton
                            label="Paused"
                            count={3}
                            icon={<Pause className="h-3 w-3 fill-current" />}
                            active={activeTab === "Paused"}
                            onClick={() => setActiveTab("Paused")}
                        />
                        <div className="w-px h-4 bg-border mx-1" />
                        <TabButton
                            label="Draft"
                            count={0}
                            icon={<Edit3 className="h-3 w-3" />}
                            active={activeTab === "Draft"}
                            onClick={() => setActiveTab("Draft")}
                        />
                        <div className="w-px h-4 bg-border mx-1" />
                        <TabButton
                            label="Archived"
                            count={25}
                            icon={<Archive className="h-3 w-3" />}
                            active={activeTab === "Archived"}
                            onClick={() => setActiveTab("Archived")}
                        />
                    </div>

                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search"
                            className="h-10 w-64 rounded-xl border border-input bg-card pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-colors"
                        />
                    </div>
                </div>
            </div>

            {/* Campaigns Grid */}
            <div className="px-8 pb-8 overflow-y-auto flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Link href="/dashboard/campaigns/prospects" className="block group">
                        <CampaignCard
                            title="Retail"
                            users={0}
                            status="error"
                            logoGradient="from-purple-600 to-rose-600"
                        />
                    </Link>
                    <Link href="/dashboard/campaigns/prospects" className="block group">
                        <CampaignCard
                            title="Real Estate Call Agents"
                            users={0}
                            status="error"
                            logoGradient="from-purple-600 to-rose-600"
                        />
                    </Link>
                    <Link href="/dashboard/campaigns/prospects" className="block group">
                        <CampaignCard
                            title="Restaurants Call Agent"
                            users={960}
                            status="success"
                            logoGradient="from-amber-600 to-purple-600"
                        />
                    </Link>

                    <Link href="/dashboard/campaigns/prospects" className="block group">
                        <CampaignCard
                            title="Invitation + 2 Messages #5"
                            users={94}
                            status="warning"
                            logoGradient="from-blue-600 to-cyan-500"
                            active
                        />
                    </Link>

                    <Link href="/dashboard/campaigns/prospects" className="block group">
                        <CampaignCard
                            title="GTM Campaign"
                            users={0}
                            status="error"
                            logoGradient="from-amber-700 to-pink-600"
                        />
                    </Link>
                </div>
            </div>

            {/* Help Bubble */}
            <div className="fixed bottom-6 right-6 z-50">
                <button className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500 text-white shadow-lg shadow-blue-500/30 transition hover:bg-blue-400">
                    <Settings className="h-6 w-6 animate-spin-slow" />
                </button>
            </div>
        </div>
    );
}

/* --- Components --- */

function TabButton({
    label,
    count,
    icon,
    active,
    onClick,
    activeColor = "bg-accent/50 text-foreground", // fallback for active
}: any) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition ${active
                ? activeColor
                : "text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
        >
            {icon}
            {label}
            <span
                className={`ml-1 rounded px-1.5 py-0.5 text-[10px] ${active ? "bg-black/20 dark:bg-white/20" : "bg-muted text-muted-foreground"
                    }`}
            >
                {count}
            </span>
        </button>
    );
}

function CampaignCard({
    title,
    users,
    status,
    logoGradient,
    active,
}: {
    title: string;
    users: number;
    status: "success" | "warning" | "error";
    logoGradient: string;
    active?: boolean;
}) {
    let statusColor = "bg-red-500";
    if (status === 'success') statusColor = "bg-emerald-500";
    if (status === 'warning') statusColor = "bg-amber-400";

    return (
        <div
            className={`relative h-48 rounded-2xl border bg-card p-6 transition flex flex-col justify-between ${active
                ? "border-blue-500/30 shadow-[0_0_30px_rgba(37,99,255,0.1)]"
                : "border-border hover:border-blue-500/20 hover:bg-accent/50"
                }`}
        >
            <div className="flex items-start justify-between">
                <div
                    className={`h-12 w-12 rounded-full bg-gradient-to-br ${logoGradient} p-0.5 shadow-inner`}
                >
                    <div className="h-full w-full rounded-full bg-card backdrop-blur-sm flex items-center justify-center">
                        <Rocket className="h-5 w-5 text-foreground/90" />
                    </div>
                </div>
                <button className="text-muted-foreground hover:text-foreground transition">
                    <MoreHorizontal className="h-5 w-5" />
                </button>
            </div>

            <div>
                <h3 className="text-base font-bold text-foreground mb-4 line-clamp-1" title={title}>{title}</h3>

                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground bg-accent px-2 py-1 rounded-md">
                        {users} <Users className="h-3 w-3" />
                    </div>
                    <div className={`h-2.5 w-2.5 rounded-full ${statusColor} shadow-[0_0_10px_currentColor] opacity-80`}></div>
                </div>
            </div>
        </div>
    );
}
