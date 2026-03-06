"use client";

import React, { useState, useRef } from "react";
import {
    Search,
    LayoutTemplate,
    Mail,
    Clock,
    Zap,
    Download,
    ArrowRight,
    MousePointer2,
    CalendarCheck,
    BarChart3,
    MessageSquareText
} from "lucide-react";
import Link from "next/link";

export default function EmailTemplatesPage() {
    const templatesRef = useRef<HTMLDivElement>(null);
    const [searchQuery, setSearchQuery] = useState("");

    return (
        <div className="flex h-full overflow-hidden bg-background text-muted-foreground transition-colors duration-300">
            {/* Sidebar Filters */}
            <aside className="w-64 flex-shrink-0 border-r border-border bg-card p-6 overflow-y-auto">
                <h2 className="mb-6 text-lg font-bold text-foreground">Filters</h2>

                <div className="mb-8">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search for a template"
                            className="w-full rounded-xl border border-input bg-background py-2.5 pl-10 pr-4 text-sm text-foreground focus:border-emerald-500 focus:outline-none transition-all"
                        />
                    </div>
                </div>

                <div className="space-y-8">
                    {/* Target Filter */}
                    <div>
                        <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Target</h3>
                        <div className="flex flex-wrap gap-2">
                            <FilterChip label="My network" active />
                            <FilterChip label="Out of network" />
                        </div>
                    </div>

                    {/* Tone Filter */}
                    <div>
                        <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Tone</h3>
                        <div className="flex flex-wrap gap-2">
                            <FilterChip label="Professional" />
                            <FilterChip label="Casual" active />
                            <FilterChip label="Direct" />
                        </div>
                    </div>

                    {/* Channel Filter */}
                    <div>
                        <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Channel</h3>
                        <div className="flex flex-wrap gap-2">
                            <Link href="/dashboard/campaigns/templates">
                                <FilterChip label="LinkedIn" />
                            </Link>
                            <FilterChip label="Email" active />
                        </div>
                    </div>

                    {/* Steps Counter */}
                    <div>
                        <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Email Steps</h3>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, "5+"].map((n) => (
                                <CountChip key={n} label={n.toString()} />
                            ))}
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-8">
                <div className="mx-auto max-w-6xl">
                    <h1 className="mb-6 text-2xl font-bold text-foreground">All campaigns templates</h1>

                    {/* Hero Banner */}
                    <div className="mb-8 relative overflow-hidden rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-6 shadow-xl">
                        <div className="relative z-10 max-w-2xl">
                            <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-medium text-white ring-1 ring-white/20">
                                <LayoutTemplate className="h-3.5 w-3.5" />
                                <span>Template Library</span>
                            </div>
                            <h2 className="mb-2 text-xl font-bold text-white">
                                Find your ideal campaign template ✨
                            </h2>
                            <p className="mb-4 text-emerald-100/90 text-sm font-normal">
                                Answer a few questions, and we'll suggest campaign templates tailored to your needs!
                            </p>
                            <button
                                onClick={() => templatesRef.current?.scrollIntoView({ behavior: 'smooth' })}
                                className="rounded-lg bg-white px-4 py-2 text-xs font-normal text-emerald-600 shadow-md transition hover:bg-emerald-50"
                            >
                                Get started!
                            </button>
                        </div>
                    </div>

                    {/* Templates Grid */}
                    <div ref={templatesRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
                        {/* Template 1: The Triple Threat */}
                        <TemplateCard
                            platform="Email"
                            title="The Triple Threat"
                            usageCount="142.1K"
                        >
                            <div className="flex items-center justify-center h-24">
                                <SequenceVisual
                                    steps={[
                                        { icon: <Mail />, label: "Day 1", color: "bg-emerald-500" },
                                        { icon: <Clock />, label: "+2d", color: "bg-slate-700" },
                                        { icon: <Mail />, label: "Day 3", color: "bg-emerald-500" },
                                        { icon: <Clock />, label: "+4d", color: "bg-slate-700" },
                                        { icon: <Mail />, label: "Day 7", color: "bg-emerald-500" },
                                    ]}
                                />
                            </div>
                        </TemplateCard>

                        {/* Template 2: Executive Intro */}
                        <TemplateCard
                            platform="Email"
                            title="Executive Introduction"
                            usageCount="89.5K"
                            active
                        >
                            <div className="flex items-center justify-center h-24">
                                <SequenceVisual
                                    steps={[
                                        { icon: <Zap />, label: "Priority", color: "bg-amber-500" },
                                        { icon: <Clock />, label: "+3d", color: "bg-slate-700" },
                                        { icon: <Mail />, label: "Body", color: "bg-emerald-500" },
                                    ]}
                                />
                            </div>
                        </TemplateCard>

                        {/* Template 3: The 'Bump' Sequence */}
                        <TemplateCard
                            platform="Email"
                            title="The Persistent Bump"
                            usageCount="210.4K"
                        >
                            <div className="flex items-center justify-center h-24">
                                <div className="relative flex items-center gap-1.5">
                                    <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-emerald-500 text-white shadow-lg">
                                        <Mail className="h-5 w-5" />
                                    </div>
                                    <div className="h-0.5 w-4 bg-border" />
                                    <div className="relative">
                                        <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-800 text-white">
                                            <Zap className="h-5 w-5" />
                                        </div>
                                        <span className="absolute -top-2 -right-2 bg-pink-500 text-[10px] font-bold px-1.5 py-0.5 rounded-full text-white ring-2 ring-background">x4</span>
                                    </div>
                                </div>
                            </div>
                        </TemplateCard>

                        {/* Template 4: Webinar Invite */}
                        <TemplateCard
                            platform="Email"
                            title="Webinar Engagement"
                            usageCount="45.2K"
                        >
                            <div className="flex items-center justify-center h-24">
                                <SequenceVisual
                                    steps={[
                                        { icon: <CalendarCheck />, label: "Invite", color: "bg-purple-500" },
                                        { icon: <Clock />, label: "Delay", color: "bg-slate-700" },
                                        { icon: <Zap />, label: "Remind", color: "bg-emerald-500" },
                                    ]}
                                />
                            </div>
                        </TemplateCard>

                        {/* Template 5: Feedback Request */}
                        <TemplateCard
                            platform="Email"
                            title="Post-Demo Feedback"
                            usageCount="122.8K"
                        >
                            <div className="flex items-center justify-center h-24">
                                <SequenceVisual
                                    steps={[
                                        { icon: <MessageSquareText />, label: "Ask", color: "bg-orange-500" },
                                        { icon: <ArrowRight />, label: "Link", color: "bg-slate-700" },
                                        { icon: <BarChart3 />, label: "Data", color: "bg-indigo-500" },
                                    ]}
                                />
                            </div>
                        </TemplateCard>

                        {/* Template 6: Advanced Multi-Channel */}
                        <TemplateCard
                            platform="Email"
                            title="Advanced Multi-Channel"
                            usageCount="31.9K"
                        >
                            <div className="flex items-center justify-center h-24">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-emerald-500 text-white">
                                        <Mail className="h-5 w-5" />
                                    </div>
                                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                                    <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-blue-500 text-white">
                                        <MousePointer2 className="h-5 w-5" />
                                    </div>
                                </div>
                            </div>
                        </TemplateCard>
                    </div>
                </div>
            </main>
        </div>
    );
}

function FilterChip({ label, active }: { label: string; active?: boolean }) {
    return (
        <button
            className={`rounded-full px-4 py-1.5 text-xs font-medium border transition ${active
                ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                : "border-border bg-card text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
        >
            {label}
        </button>
    );
}

function CountChip({ label }: { label: string }) {
    return (
        <button className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card text-xs font-medium text-muted-foreground transition hover:bg-accent hover:text-foreground">
            {label}
        </button>
    );
}

function TemplateCard({ children, platform, title, usageCount, active }: any) {
    return (
        <div className={`group relative overflow-hidden rounded-xl border bg-card transition-all hover:-translate-y-1 hover:shadow-lg ${active ? 'border-emerald-500/50 shadow-emerald-500/10' : 'border-border shadow-sm'}`}>
            <div className="relative p-4">
                <div className="mb-3 flex items-center gap-2 text-xs font-medium text-muted-foreground">
                    <span className="text-emerald-500"><Mail className="h-3 w-3" /></span>
                    {platform}
                </div>

                <div className="mb-4 rounded-lg bg-background/50 p-3 border border-border backdrop-blur-sm">
                    {children}
                </div>

                <div>
                    <h3 className="text-sm font-bold text-foreground group-hover:text-emerald-400 transition-colors">{title}</h3>
                    <div className="mt-1 flex items-center gap-1.5 text-[10px] text-muted-foreground">
                        <Download className="h-2.5 w-2.5" />
                        {usageCount} used
                    </div>
                </div>
            </div>
        </div>
    )
}

function SequenceVisual({ steps }: { steps: any[] }) {
    return (
        <div className="flex items-center gap-2">
            {steps.map((step, i) => (
                <React.Fragment key={i}>
                    <div className="flex flex-col items-center gap-1.5">
                        <div className={`h-10 w-10 flex items-center justify-center rounded-xl ${step.color} text-white shadow-lg transition-transform hover:scale-110`}>
                            {React.cloneElement(step.icon, { className: "h-5 w-5" })}
                        </div>
                        <span className="text-[9px] font-bold text-muted-foreground uppercase opacity-60">{step.label}</span>
                    </div>
                    {i < steps.length - 1 && (
                        <div className="h-0.5 w-3 bg-border/50" />
                    )}
                </React.Fragment>
            ))}
        </div>
    )
}
