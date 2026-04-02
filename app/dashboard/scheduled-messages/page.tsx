"use client";

import React, { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { 
    Clock, 
    Send, 
    Trash2, 
    Pause, 
    Play, 
    Mail, 
    Linkedin, 
    Calendar,
    Search,
    Filter,
    MoreHorizontal,
    Loader2,
    RefreshCw,
    XCircle,
    CheckCircle2,
    AlertCircle,
    Building2,
    ChevronDown,
    ChevronUp
} from "lucide-react";
import { format } from "date-fns";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface QueuedMessage {
    id: string;
    lead_id: string;
    channel: string;
    subject?: string;
    status: string;
    scheduled_at: string;
    sent_at?: string;
    error_message?: string;
    lead_name?: string;
    lead_email?: string;
}

interface QueueStats {
    scheduled: number;
    pending: number;
    sending: number;
    sent: number;
    failed: number;
    total: number;
}

export default function ScheduledMessagesPage() {
    const [messages, setMessages] = useState<QueuedMessage[]>([]);
    const [stats, setStats] = useState<QueueStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState<string>("scheduled");
    const [filterChannel, setFilterChannel] = useState<string>("");
    const [searchTerm, setSearchTerm] = useState("");

    const fetchQueue = async () => {
        setIsLoading(true);
        try {
            // Get messages with specific status and channel
            let url = "/api/outreach?limit=100";
            if (filterStatus) {
                url += `&status=${filterStatus}`;
            }
            if (filterChannel) {
                url += `&channel=${filterChannel}`;
            }
            
            const [msgRes, statsRes] = await Promise.all([
                api.get<any>(url),
                api.get<QueueStats>("/api/outreach/queue/stats")
            ]);

            if (msgRes.data) {
                setMessages(msgRes.data.items || []);
            }
            if (statsRes.data) {
                setStats(statsRes.data);
            }
        } catch (error) {
            console.error("Failed to fetch queue:", error);
            toast.error("Failed to load outreach queue");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchQueue();
        const interval = setInterval(fetchQueue, 30000); // 30s auto-refresh
        return () => clearInterval(interval);
    }, [filterStatus, filterChannel]);

    const handleAction = async (id: string, action: string, data?: any) => {
        try {
            let res;
            if (action === "send-now") {
                res = await api.post(`/api/outreach/${id}/send?force=true`);
            } else if (action === "delete") {
                res = await api.delete(`/api/outreach/${id}`);
            } else if (action === "update-status") {
                res = await api.patch(`/api/outreach/${id}/status?status=${data.status}`);
            }

            if (res?.error) {
                toast.error(`Action failed: ${res.error.detail || "Unknown error"}`);
            } else {
                toast.success(`Action successful`);
                fetchQueue();
            }
        } catch (error) {
            toast.error("An unexpected error occurred");
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status?.toLowerCase()) {
            case "scheduled": return <Clock className="h-4 w-4 text-blue-500" />;
            case "pending": return <RefreshCw className="h-4 w-4 text-emerald-500" />;
            case "sending": return <Loader2 className="h-4 w-4 text-emerald-500 animate-spin" />;
            case "sent": return <CheckCircle2 className="h-4 w-4 text-blue-500" />;
            case "failed": return <XCircle className="h-4 w-4 text-rose-500" />;
            default: return <AlertCircle className="h-4 w-4 text-gray-500" />;
        }
    };

    const getStatusStyle = (status: string) => {
        switch (status?.toLowerCase()) {
            case "scheduled": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
            case "pending": return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
            case "sending": return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
            case "sent": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
            case "failed": return "bg-rose-500/10 text-rose-500 border-rose-500/20";
            default: return "bg-gray-500/10 text-gray-500 border-gray-500/20";
        }
    };

    return (
        <div className="flex h-full flex-col bg-background text-muted-foreground transition-colors duration-300">
            {/* Header */}
            <header className="flex items-center justify-between border-b border-border bg-card px-6 py-4">
                <div>
                    <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
                        <Clock className="h-6 w-6 text-blue-500" />
                        Automation Queue
                    </h1>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                        Manage your multi-channel outreach pipeline.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <button 
                        onClick={fetchQueue}
                        className="flex items-center gap-2 rounded-[7px] border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-accent transition"
                    >
                        <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                        Sync Engine
                    </button>
                    <div className="h-6 w-px bg-border mx-1"></div>
                    <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-[7px] bg-blue-600/10 text-blue-500 border border-blue-500/20 text-[10px] font-black">
                        <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse"></div>
                        ACTIVE
                    </div>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
                {/* Stats Grid */}
                <div className="mb-8 grid grid-cols-5 gap-4">
                    <StatCard 
                        label="Scheduled" 
                        value={stats?.scheduled ?? 0} 
                        icon={<Clock className="h-5 w-5" />} 
                        active={filterStatus === "scheduled"}
                        color="blue"
                        onClick={() => setFilterStatus("scheduled")}
                    />
                    <StatCard 
                        label="Queued" 
                        value={stats?.pending ?? 0} 
                        icon={<RefreshCw className="h-5 w-5" />} 
                        active={filterStatus === "pending"}
                        color="emerald"
                        onClick={() => setFilterStatus("pending")}
                    />
                    <StatCard 
                        label="Sent" 
                        value={stats?.sent ?? 0} 
                        icon={<CheckCircle2 className="h-5 w-5" />} 
                        active={filterStatus === "sent"}
                        color="blue"
                        onClick={() => setFilterStatus("sent")}
                    />
                    <StatCard 
                        label="Failed" 
                        value={stats?.failed ?? 0} 
                        icon={<XCircle className="h-5 w-5" />} 
                        active={filterStatus === "failed"}
                        color="rose"
                        onClick={() => setFilterStatus("failed")}
                    />
                    <StatCard 
                        label="Total" 
                        value={stats?.total ?? 0} 
                        icon={<Calendar className="h-5 w-5" />} 
                        active={filterStatus === ""}
                        color="gray"
                        onClick={() => setFilterStatus("")}
                    />
                </div>

                {/* Filter and Search Bar */}
                <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 ml-1">Channel Selection</label>
                        <div className="flex items-center gap-1 rounded-[7px] bg-card border border-border p-1 shadow-sm w-[320px]">
                            {[
                                { id: "", label: "All", icon: <Building2 className="h-3.5 w-3.5" /> },
                                { id: "email", label: "Email", icon: <Mail className="h-3.5 w-3.5" /> },
                                { id: "linkedin", label: "LinkedIn", icon: <Linkedin className="h-3.5 w-3.5" /> }
                            ].map((c) => (
                                <button
                                    key={c.id}
                                    onClick={() => setFilterChannel(c.id)}
                                    className={`flex-1 px-3 py-1.5 text-[10px] font-bold uppercase tracking-tight rounded-[5px] transition-all flex items-center justify-center gap-1.5 ${
                                        filterChannel === c.id 
                                        ? "bg-slate-800 text-white shadow-sm" 
                                        : "text-muted-foreground hover:bg-accent hover:text-foreground"
                                    }`}
                                >
                                    {c.icon}
                                    {c.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 flex-1 max-w-sm">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 ml-1">Process State</label>
                        <div className="flex items-center gap-1 rounded-[7px] bg-card border border-border p-1 shadow-sm">
                            {[
                                { id: "scheduled", label: "Scheduled" },
                                { id: "pending", label: "Queued" },
                                { id: "sent", label: "Done" },
                                { id: "failed", label: "Fail" }
                            ].map((s) => (
                                <button
                                    key={s.id}
                                    onClick={() => setFilterStatus(s.id)}
                                    className={`flex-1 px-3 py-1.5 text-[10px] font-bold uppercase tracking-tight rounded-[5px] transition-all ${
                                        filterStatus === s.id 
                                        ? "bg-blue-600 text-white shadow-sm" 
                                        : "text-muted-foreground hover:bg-accent hover:text-foreground"
                                    }`}
                                >
                                    {s.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 w-full lg:w-[220px]">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 ml-1">Recipient Sync</label>
                        <div className="relative">
                            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground/40">
                                <Search className="h-4 w-4" />
                            </span>
                            <input 
                                type="text" 
                                placeholder="Filter results..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-card border border-border rounded-[7px] pl-9 pr-3 py-1.5 text-xs focus:ring-1 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition shadow-sm"
                            />
                        </div>
                    </div>
                </div>

                {/* Queue Table */}
                <div className="rounded-[7px] border border-border bg-card shadow-sm overflow-hidden">
                    <div className="grid grid-cols-12 gap-3 border-b border-border bg-muted/40 px-6 py-3 text-[9px] font-black uppercase tracking-widest text-muted-foreground/70">
                        <div className="col-span-3">IDENTIFIER</div>
                        <div className="col-span-1">CHANNEL</div>
                        <div className="col-span-3">HEADLINE</div>
                        <div className="col-span-2 text-center">STATUS</div>
                        <div className="col-span-2">WINDOW</div>
                        <div className="col-span-1 text-right">MGMT</div>
                    </div>

                    <div className="divide-y divide-border">
                        {isLoading && messages.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20">
                                <Loader2 className="h-8 w-8 animate-spin text-blue-500 mb-4" />
                                <p className="text-[10px] font-black text-foreground tracking-widest">CONNECTING TO PIPELINE...</p>
                            </div>
                        ) : messages.length === 0 ? (
                            <div className="py-24 text-center">
                                <div className="mx-auto w-14 h-14 bg-muted/50 rounded-[7px] flex items-center justify-center mb-6 ring-1 ring-border">
                                    <Clock className="h-7 w-7 text-muted-foreground/30" />
                                </div>
                                <h3 className="text-md font-bold text-foreground">Operational Silence</h3>
                                <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                                    Everything is quiet in the {filterStatus || 'automation'} queue.
                                </p>
                            </div>
                        ) : (
                            messages
                                .filter(m => 
                                    (m.lead_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                     m.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                     m.lead_email?.toLowerCase().includes(searchTerm.toLowerCase()))
                                )
                                .map((msg) => (
                                <div key={msg.id} className="grid grid-cols-12 gap-3 px-6 py-4 items-center hover:bg-accent/40 transition group cursor-default">
                                    <div className="col-span-3">
                                        <div className="font-bold text-foreground text-xs group-hover:text-blue-500 transition">{msg.lead_name || "Prospect"}</div>
                                        <div className="text-[10px] text-muted-foreground/60 flex items-center gap-1.5 mt-0.5 font-medium">
                                            {msg.lead_email || "ID: " + msg.lead_id.slice(0,8)}
                                        </div>
                                    </div>
                                    
                                    <div className="col-span-1">
                                        <div className="flex items-center gap-2">
                                            <div className={`p-1.5 rounded-[5px] ring-1 ${
                                                msg.channel === 'email' 
                                                ? 'bg-emerald-500/10 text-emerald-500 ring-emerald-500/20' 
                                                : 'bg-blue-500/10 text-blue-500 ring-blue-500/20'
                                            }`}>
                                                {msg.channel === 'email' ? <Mail className="h-3 w-3" /> : <Linkedin className="h-3 w-3" />}
                                            </div>
                                            <span className="text-[9px] font-black uppercase opacity-40">{msg.channel}</span>
                                        </div>
                                    </div>

                                    <div className="col-span-3">
                                        <div className="text-xs text-foreground truncate font-bold">
                                            {msg.subject || "No headline"}
                                        </div>
                                        {msg.error_message && (
                                            <div className="text-[9px] text-rose-500 flex items-center gap-1 mt-0.5 font-bold">
                                                <AlertCircle className="h-2.5 w-2.5 shrink-0" />
                                                <span className="truncate">{msg.error_message}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="col-span-2 flex justify-center">
                                        <div className={`flex items-center gap-1.5 px-2 py-1 rounded-[5px] border text-[9px] font-black uppercase tracking-widest ${getStatusStyle(msg.status)}`}>
                                            {getStatusIcon(msg.status)}
                                            {msg.status}
                                        </div>
                                    </div>

                                    <div className="col-span-2">
                                        <div className="text-[10px] font-bold text-foreground/80">
                                            {msg.scheduled_at ? format(new Date(msg.scheduled_at), "MMM d, HH:mm") : "ASAP"}
                                        </div>
                                        <div className="text-[9px] text-muted-foreground/40 font-black uppercase mt-0.5">
                                            {msg.status === 'sent' ? 'DELIVERED' : 'WINDOW ID'}
                                        </div>
                                    </div>

                                    <div className="col-span-1 text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <button className="p-1.5 hover:bg-accent rounded-[5px] transition-all border border-transparent hover:border-border text-muted-foreground hover:text-foreground">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-48 p-1.5 rounded-[7px] border-border shadow-2xl">
                                                <DropdownMenuLabel className="px-2 pb-1.5 text-[9px] font-black uppercase tracking-widest text-muted-foreground/50">Actions</DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                
                                                {['scheduled', 'pending', 'failed'].includes(msg.status) && (
                                                    <DropdownMenuItem onClick={() => handleAction(msg.id, 'send-now')} className="rounded-[5px] py-2 px-2.5">
                                                        <Send className="mr-2 h-3.5 w-3.5 text-blue-500" />
                                                        <span className="font-bold text-[10px] uppercase">Force Send</span>
                                                    </DropdownMenuItem>
                                                )}

                                                {msg.status === 'scheduled' && (
                                                    <DropdownMenuItem onClick={() => handleAction(msg.id, 'update-status', { status: 'pending' })} className="rounded-[5px] py-2 px-2.5">
                                                        <Pause className="mr-2 h-3.5 w-3.5 text-amber-500" />
                                                        <span className="font-bold text-[10px] uppercase">Pause</span>
                                                    </DropdownMenuItem>
                                                )}

                                                <DropdownMenuSeparator />
                                                
                                                <DropdownMenuItem 
                                                    onClick={() => handleAction(msg.id, 'delete')}
                                                    className="rounded-[5px] py-2 px-2.5 text-rose-500 focus:text-rose-600 focus:bg-rose-500/5 group/del"
                                                >
                                                    <Trash2 className="mr-2 h-3.5 w-3.5" />
                                                    <span className="font-bold text-[10px] uppercase">Cancel</span>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ label, value, icon, active, onClick, color }: { label: string, value: string | number, icon: React.ReactNode, active?: boolean, onClick: () => void, color: string }) {
    const colorMap: any = {
        blue: active ? "bg-blue-600 border-blue-500 shadow-md text-white" : "hover:border-blue-500/20",
        emerald: active ? "bg-emerald-600 border-emerald-500 shadow-md text-white" : "hover:border-emerald-500/20",
        rose: active ? "bg-rose-600 border-rose-500 shadow-md text-white" : "hover:border-rose-500/20",
        gray: active ? "bg-slate-800 border-slate-700 shadow-md text-white" : "hover:border-slate-500/20"
    };

    return (
        <button 
            onClick={onClick}
            className={`flex items-center gap-4 p-4 rounded-[7px] border transition-all duration-200 text-left overflow-hidden ${
                active ? colorMap[color] : "bg-card border-border text-muted-foreground"
            }`}
        >
            <div className={`p-2 rounded-[5px] ${
                active ? "bg-white/10 text-white" : `text-${color}-500 bg-${color}-500/5`
            }`}>
                {icon}
            </div>
            <div>
                <div className={`text-xl font-black ${active ? "text-white" : "text-foreground"}`}>
                    {value}
                </div>
                <div className={`text-[9px] font-black uppercase tracking-widest ${active ? "text-white/60" : "text-muted-foreground/60"}`}>
                    {label}
                </div>
            </div>
        </button>
    );
}
