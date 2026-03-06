"use client";

import React, { useState } from "react";
import {
    List,
    Search,
    Filter,
    Download,
    FileText,
    Upload,
    CheckCircle2,
    Clock,
    AlertCircle,
    ExternalLink,
    MoreVertical
} from "lucide-react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ImportHistoryPage() {
    const [searchTerm, setSearchTerm] = useState("");

    // For now, using empty data to match "remove demo data" request
    const [imports, setImports] = useState<any[]>([]);

    const filteredImports = imports.filter(imp =>
        imp.source.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex flex-col h-full bg-background text-foreground animate-in fade-in duration-500">
            <Header />
            {/* Header Area */}
            <div className="p-8 border-b border-border bg-card/30 backdrop-blur-sm sticky top-0 z-10 w-full">
                <div className="flex flex-col gap-1 mb-6">
                    <h2 className="text-2xl font-black tracking-tight uppercase">Import History</h2>
                    <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">
                        Track and manage all your lead data imports and sync activities.
                    </p>
                </div>

                <div className="flex items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search by source or filename..."
                            className="pl-9 h-11 bg-card/50 border-input rounded-xl focus:ring-blue-500 transition-all font-bold text-xs uppercase tracking-widest"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" className="rounded-xl h-11 gap-2 font-black text-[10px] uppercase tracking-[0.2em] border-border hover:bg-muted">
                            <Filter size={14} /> Filter
                        </Button>
                        <Button className="rounded-xl h-11 gap-2 bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20 font-black text-[10px] uppercase tracking-[0.2em] px-6">
                            <Upload size={14} /> New Import
                        </Button>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto px-8 py-6">
                <div className="rounded-[2rem] border border-border bg-card overflow-hidden shadow-sm">
                    {/* Table Header */}
                    <div className="grid grid-cols-12 gap-4 border-b border-border bg-muted/40 px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground sticky top-0 z-10">
                        <div className="col-span-4">Source / Context</div>
                        <div className="col-span-2 text-center">Leads</div>
                        <div className="col-span-2 text-center">Status</div>
                        <div className="col-span-3">Date</div>
                        <div className="col-span-1 text-right">Actions</div>
                    </div>

                    {/* Table Body */}
                    <div className="divide-y divide-border">
                        {filteredImports.length > 0 ? (
                            filteredImports.map((imp) => (
                                <div
                                    key={imp.id}
                                    className="grid grid-cols-12 gap-4 px-6 py-5 items-center hover:bg-accent/30 transition-colors group cursor-pointer"
                                >
                                    <div className="col-span-4">
                                        <div className="flex items-center gap-3">
                                            <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-500/10 text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all">
                                                <List size={18} />
                                            </div>
                                            <div>
                                                <div className="font-bold text-sm text-foreground uppercase tracking-tight">{imp.source}</div>
                                                <div className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mt-0.5">{imp.method}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-span-2 text-center">
                                        <span className="text-sm font-black text-foreground">{imp.leadCount}</span>
                                    </div>
                                    <div className="col-span-2 flex justify-center">
                                        <div className={`
                                            inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider border
                                            ${imp.status === 'completed'
                                                ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                                                : imp.status === 'processing'
                                                    ? 'bg-blue-500/10 text-blue-500 border-blue-500/20 animate-pulse'
                                                    : 'bg-red-500/10 text-red-500 border-red-500/20'
                                            }
                                        `}>
                                            <span className={`h-1.5 w-1.5 rounded-full ${imp.status === 'completed' ? 'bg-emerald-500' : imp.status === 'processing' ? 'bg-blue-500' : 'bg-red-500'}`} />
                                            {imp.status}
                                        </div>
                                    </div>
                                    <div className="col-span-3 text-sm text-muted-foreground font-bold uppercase tracking-tight">
                                        {imp.date}
                                    </div>
                                    <div className="col-span-1 text-right">
                                        <button className="p-2 hover:bg-secondary rounded-xl transition-colors text-muted-foreground hover:text-foreground">
                                            <MoreVertical size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center py-32 text-center">
                                <div className="mb-6 relative">
                                    <div className="absolute -inset-4 bg-muted/20 blur-xl rounded-full"></div>
                                    <div className="relative h-20 w-20 rounded-3xl bg-muted/30 flex items-center justify-center text-muted-foreground/30 border border-border">
                                        <List size={40} />
                                    </div>
                                </div>
                                <h3 className="text-xl font-black text-foreground uppercase tracking-tighter mb-2">No import history</h3>
                                <p className="text-xs text-muted-foreground max-w-xs font-bold uppercase tracking-widest leading-relaxed">
                                    Your data imports and synchronization activities <br />
                                    will appear here.
                                </p>
                                <Button className="mt-8 rounded-xl h-11 px-6 bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest text-[10px]">
                                    Make your first import
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer Info */}
                <div className="mt-8 p-6 rounded-[2rem] bg-accent/30 border border-border flex items-center gap-6 group">
                    <div className="h-12 w-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                        <Clock size={24} />
                    </div>
                    <div>
                        <h4 className="text-xs font-black uppercase tracking-widest text-foreground">Automatic Sync</h4>
                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tight mt-1">LeadGenius automatically keeps your contact data up to date across all connected sources.</p>
                    </div>
                    <div className="ml-auto">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-500 text-[10px] font-black uppercase tracking-widest border border-blue-500/20">
                            <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" /> Live Now
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
