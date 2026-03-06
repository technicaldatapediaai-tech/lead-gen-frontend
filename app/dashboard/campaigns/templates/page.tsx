"use client";

import React, { useState, useRef } from "react";
import { Search, ChevronRight, LayoutTemplate, MessageSquare, UserPlus, Mail, Eye, Link as LinkIcon, Download } from "lucide-react";
import Link from "next/link";

export default function CampaignTemplatesPage() {
    const templatesRef = useRef<HTMLDivElement>(null);
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
                            placeholder="Search for a template"
                            className="w-full rounded-xl border border-input bg-background py-2.5 pl-10 pr-4 text-sm text-foreground placeholder-muted-foreground focus:border-blue-500 focus:outline-none"
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

                    {/* Channel Filter (Canal -> Channel) */}
                    <div>
                        <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Channel</h3>
                        <div className="flex flex-wrap gap-2">
                            <FilterChip label="LinkedIn" active />
                            <Link href="/dashboard/campaigns/templates/email">
                                <FilterChip label="Email" />
                            </Link>
                        </div>
                    </div>

                    {/* Actions Filter */}
                    <div>
                        <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Actions</h3>
                        <div className="flex flex-wrap gap-2">
                            <FilterChip label="Follow" />
                            <FilterChip label="Message" />
                            <FilterChip label="Visit" />
                            <FilterChip label="Invitation" />
                            <FilterChip label="CRM Sync" />
                        </div>
                    </div>

                    {/* Message Count Filters */}
                    <div>
                        <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">LinkedIn Messages</h3>
                        <div className="flex gap-2">
                            {[0, 1, 2, 3, "4+"].map((n) => (
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

                    {/* Banner */}
                    <div className="mb-8 relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-6 shadow-xl">
                        <div className="relative z-10 max-w-2xl">
                            <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-medium text-white ring-1 ring-white/20">
                                <LayoutTemplate className="h-3 w-3" />
                                <span>Template Library</span>
                            </div>
                            <h2 className="mb-2 text-xl font-bold text-white">
                                Find your ideal campaign template ✨
                            </h2>
                            <p className="mb-4 text-blue-100/90 text-sm">
                                Answer a few questions, and we'll suggest campaign templates tailored to your needs!
                            </p>
                            <button onClick={() => templatesRef.current?.scrollIntoView({ behavior: 'smooth' })} className="rounded-lg bg-white px-4 py-2 text-xs font-bold text-blue-600 shadow-md transition hover:bg-blue-50">
                                Get started!
                            </button>
                        </div>

                        {/* Decorative Background Elements */}
                        <div className="absolute top-0 right-0 h-full w-1/3 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none" />
                        <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-indigo-400 blur-3xl opacity-30" />
                        <div className="absolute right-20 -bottom-20 h-72 w-72 rounded-full bg-blue-300 blur-3xl opacity-20" />
                    </div>

                    {/* Templates Grid */}
                    <div ref={templatesRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <Link href="/dashboard/campaigns/create?template=invitation" className="contents">
                            <TemplateCard
                                platform="LinkedIn"
                                title="Invitation"
                                usageCount="297.2K"
                                gradient="from-slate-800 to-slate-900"
                            >
                                <div className="flex items-center justify-center h-24 gap-4">
                                    <StepIcon icon={<LinkIcon className="h-4 w-4" />} label="Invitation" color="bg-blue-500" />
                                </div>
                            </TemplateCard>
                        </Link>

                        {/* Template 2: Invitation + 2 Messages */}
                        <Link href="/dashboard/campaigns/create?template=invitation_followup" className="contents">
                            <TemplateCard
                                platform="LinkedIn"
                                title="Invitation + 2 Messages"
                                usageCount="338.1K"
                                gradient="from-blue-600/20 to-blue-900/40"
                                active
                            >
                                <div className="flex items-center justify-center h-24 gap-2">
                                    <StepIcon icon={<LinkIcon className="h-4 w-4" />} label="Invitation" color="bg-blue-500" />
                                    <div className="h-0.5 w-6 bg-blue-500/30" />
                                    <div className="relative">
                                        <StepIcon icon={<MessageSquare className="h-4 w-4" />} label="Message" color="bg-blue-500" />
                                        <span className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-pink-500 text-[9px] font-bold flex items-center justify-center text-white ring-2 ring-background">x2</span>
                                    </div>
                                </div>
                            </TemplateCard>
                        </Link>



                        {/* Template 4: Message */}
                        <Link href="/dashboard/campaigns/create?template=message" className="contents">
                            <TemplateCard
                                platform="LinkedIn"
                                title="Message"
                                usageCount="152.4K"
                                gradient="from-slate-800 to-slate-900"
                            >
                                <div className="flex items-center justify-center h-24 gap-4">
                                    <StepIcon icon={<MessageSquare className="h-4 w-4" />} label="Message" color="bg-blue-500" />
                                </div>
                            </TemplateCard>
                        </Link>

                        {/* Template 5: Invitation + Message */}
                        <Link href="/dashboard/campaigns/create?template=invitation_message" className="contents">
                            <TemplateCard
                                platform="LinkedIn"
                                title="Invitation + Message"
                                usageCount="189.2K"
                                gradient="from-blue-600/10 to-indigo-900/20"
                            >
                                <div className="flex items-center justify-center h-24 gap-2">
                                    <StepIcon icon={<LinkIcon className="h-4 w-4" />} label="Invitation" color="bg-blue-500" />
                                    <div className="h-0.5 w-6 bg-muted-foreground/30" />
                                    <StepIcon icon={<MessageSquare className="h-4 w-4" />} label="Message" color="bg-blue-500" />
                                </div>
                            </TemplateCard>
                        </Link>

                        {/* Template 6: Visit */}
                        <TemplateCard
                            platform="LinkedIn"
                            title="Visit"
                            usageCount="88.5K"
                            gradient="from-slate-800 to-slate-900"
                        >
                            <div className="flex items-center justify-center h-24 gap-4">
                                <StepIcon icon={<Eye className="h-4 w-4" />} label="Visit" color="bg-blue-500" />
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
                ? "border-blue-500 bg-blue-500/10 text-blue-400"
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

function TemplateCard({ children, platform, platformIcon, platformColor = "text-blue-400", title, usageCount, gradient, active }: any) {
    return (
        <div className={`group relative overflow-hidden rounded-xl border bg-card transition-all hover:-translate-y-1 hover:shadow-lg ${active ? 'border-blue-500/50 shadow-blue-500/10' : 'border-border shadow-sm'}`}>

            {/* Unified Background: Removed dynamic gradient, using consistent card background */}
            <div className="absolute inset-0 bg-card opacity-100" />

            <div className="relative p-4">
                <div className="mb-3 flex items-center gap-2 text-xs font-medium text-muted-foreground">
                    <span className={platformColor}>{platformIcon || <LayoutTemplate className="h-3 w-3" />}</span>
                    {platform}
                </div>

                <div className="mb-4 rounded-lg bg-background/50 p-3 border border-border backdrop-blur-sm">
                    {children}
                    {/* Note: children (the visualization) might need size adjustments too if passed in fixed height */}
                </div>

                <div>
                    <h3 className="text-sm font-bold text-foreground group-hover:text-blue-400 transition-colors">{title}</h3>
                    <div className="mt-1 flex items-center gap-1.5 text-[10px] text-muted-foreground">
                        <Download className="h-2.5 w-2.5" />
                        {usageCount} used
                    </div>
                </div>
            </div>
        </div>
    )
}

function StepIcon({ icon, label, color }: any) {
    return (
        <div className="flex flex-col items-center gap-1.5">
            <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${color} text-white shadow-md shadow-black/20`}>
                {icon}
            </div>
            <span className="text-[9px] font-medium text-muted-foreground bg-background px-1.5 py-0.5 rounded-full border border-border">{label}</span>
        </div>
    )
}
