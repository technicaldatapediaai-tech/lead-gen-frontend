"use client";

import React, { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { 
    Rocket, MessageSquare, UserPlus, CheckCircle2, 
    BarChart3, TrendingUp, Users, Clock, ArrowUpRight,
    Search, Filter, Calendar, ChevronRight, Loader2
} from "lucide-react";
import { 
    LineChart, Line, AreaChart, Area, 
    XAxis, YAxis, CartesianGrid, Tooltip, 
    ResponsiveContainer, BarChart, Bar 
} from "recharts";
import { toast } from "sonner";

export default function OutreachDashboard() {
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState<any>(null);
    const [timeRange, setTimeRange] = useState("7D");

    useEffect(() => {
        async function fetchStats() {
            setIsLoading(true);
            try {
                // We'll use the existing dashboard stats but focus on outreach
                const res = await api.get<any>("/api/dashboard/stats");
                if (!res.error && res.data) {
                    setStats(res.data);
                }
            } catch (error) {
                console.error("Failed to fetch outreach stats:", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchStats();
    }, []);

    const outreachMetrics = [
        {
            title: "Total Sent",
            value: stats?.total_sent || "1,280",
            change: "+12.5%",
            trend: "up",
            icon: Rocket,
            color: "text-blue-500",
            bgColor: "bg-blue-500/10"
        },
        {
            title: "Connections",
            value: stats?.connections_accepted || "452",
            change: "+8.2%",
            trend: "up",
            icon: UserPlus,
            color: "text-emerald-500",
            bgColor: "bg-emerald-500/10"
        },
        {
            title: "Response Rate",
            value: stats?.response_rate || "18.4%",
            change: "+2.1%",
            trend: "up",
            icon: MessageSquare,
            color: "text-purple-500",
            bgColor: "bg-purple-500/10"
        },
        {
            title: "Meetings Booked",
            value: stats?.meetings || "24",
            change: "+4.1%",
            trend: "up",
            icon: CheckCircle2,
            color: "text-amber-500",
            bgColor: "bg-amber-500/10"
        }
    ];

    const chartData = [
        { date: "Mon", sent: 120, replies: 12 },
        { date: "Tue", sent: 150, replies: 18 },
        { date: "Wed", sent: 100, replies: 25 },
        { date: "Thu", sent: 180, replies: 30 },
        { date: "Fri", sent: 210, replies: 42 },
        { date: "Sat", sent: 150, replies: 28 },
        { date: "Sun", sent: 130, replies: 15 },
    ];

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-background">
                <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
            </div>
        );
    }

    return (
        <div className="flex h-full flex-col bg-background p-8 overflow-y-auto">
            <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-black text-foreground tracking-tight">Outreach Performance</h1>
                    <p className="text-sm font-medium text-muted-foreground mt-1 uppercase tracking-widest opacity-60">Analytics & Activity Hub</p>
                </div>
                <div className="flex items-center gap-3 bg-card border border-border p-1.5 rounded-2xl shadow-sm">
                    {["24H", "7D", "30D", "90D"].map((range) => (
                        <button
                            key={range}
                            onClick={() => setTimeRange(range)}
                            className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${
                                timeRange === range 
                                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" 
                                : "text-muted-foreground hover:text-foreground hover:bg-accent"
                            }`}
                        >
                            {range}
                        </button>
                    ))}
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                {outreachMetrics.map((metric, i) => (
                    <div key={i} className="group relative overflow-hidden rounded-3xl border border-border bg-card p-6 transition-all hover:shadow-2xl hover:shadow-blue-500/5 hover:-translate-y-1">
                        <div className="mb-4 flex items-center justify-between">
                            <div className={`rounded-2xl p-3 ${metric.bgColor} transition-transform group-hover:rotate-6`}>
                                <metric.icon className={`h-6 w-6 ${metric.color}`} />
                            </div>
                            <div className={`flex items-center gap-1 text-xs font-black uppercase tracking-widest ${metric.trend === 'up' ? "text-emerald-500" : "text-rose-500"}`}>
                                {metric.change}
                                <TrendingUp className="h-3 w-3" />
                            </div>
                        </div>
                        <div className="text-3xl font-black text-foreground">{metric.value}</div>
                        <div className="mt-1 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-60">{metric.title}</div>
                        <div className="absolute -bottom-2 -right-2 h-16 w-16 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
                            <metric.icon className="h-full w-full" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Charts Row */}
            <div className="mb-10 grid grid-cols-1 gap-8 lg:grid-cols-12">
                <div className="rounded-3xl border border-border bg-card p-8 lg:col-span-8 shadow-sm">
                    <div className="mb-8 flex items-center justify-between">
                        <div>
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Daily Activity</h3>
                            <div className="mt-1 h-1 w-12 bg-blue-500 rounded-full" />
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-blue-500" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Sent</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-purple-500" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Replies</span>
                            </div>
                        </div>
                    </div>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorSent" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                    </linearGradient>
                                    <linearGradient id="colorReplies" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#a855f7" stopOpacity={0.1}/>
                                        <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(100,100,100,0.1)" />
                                <XAxis 
                                    dataKey="date" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{fontSize: 10, fontWeight: 700, fill: "#94a3b8"}}
                                    dy={10}
                                />
                                <YAxis 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{fontSize: 10, fontWeight: 700, fill: "#94a3b8"}}
                                />
                                <Tooltip 
                                    contentStyle={{ 
                                        backgroundColor: 'var(--card)', 
                                        borderColor: 'var(--border)', 
                                        borderRadius: '16px',
                                        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' 
                                    }}
                                />
                                <Area type="monotone" dataKey="sent" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorSent)" />
                                <Area type="monotone" dataKey="replies" stroke="#a855f7" strokeWidth={3} fillOpacity={1} fill="url(#colorReplies)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="rounded-3xl border border-border bg-card p-8 lg:col-span-4 shadow-sm">
                    <h3 className="mb-8 text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Account Rotation</h3>
                    <div className="space-y-6">
                        <AccountStatsItem label="Personal" sent={45} limit={100} color="bg-blue-500" />
                        <AccountStatsItem label="Org: growth_team" sent={82} limit={150} color="bg-purple-500" />
                        <AccountStatsItem label="Org: sales_bot" sent={12} limit={150} color="bg-emerald-500" />
                        
                        <div className="mt-8 rounded-2xl bg-accent p-6">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-foreground flex items-center gap-2 mb-2">
                                <Clock className="h-3.5 w-3.5 text-blue-500" /> Next Batch
                            </h4>
                            <p className="text-sm font-bold text-foreground">12:45 PM Today</p>
                            <p className="text-[10px] text-muted-foreground mt-1">45 queued messages across 3 accounts</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Campaign Performance Table */}
            <div className="rounded-3xl border border-border bg-card shadow-sm overflow-hidden">
                <div className="border-b border-border bg-muted/30 px-8 py-5 flex items-center justify-between">
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Active Campaigns</h3>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-border text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                <th className="px-8 py-4">Campaign Name</th>
                                <th className="px-8 py-4">Status</th>
                                <th className="px-8 py-4">Leads</th>
                                <th className="px-8 py-4">Connected</th>
                                <th className="px-8 py-4">Replied</th>
                                <th className="px-8 py-4">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {[
                                { name: "Q1 Outreach", status: "Running", leads: 450, connected: 120, replied: 45 },
                                { name: "Technical Recruitment", status: "Paused", leads: 120, connected: 30, replied: 8 },
                                { name: "Founder Cold Reach", status: "Running", leads: 840, connected: 210, replied: 62 },
                            ].map((campaign, i) => (
                                <tr key={i} className="group hover:bg-muted/30 transition-colors">
                                    <td className="px-8 py-4 font-bold text-foreground text-sm">{campaign.name}</td>
                                    <td className="px-8 py-4">
                                        <span className={`rounded-full px-2 py-1 text-[8px] font-black uppercase tracking-tight ${
                                            campaign.status === 'Running' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
                                        }`}>
                                            {campaign.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-4 text-xs font-bold text-muted-foreground">{campaign.leads}</td>
                                    <td className="px-8 py-4 text-xs font-bold text-foreground">
                                        {campaign.connected} <span className="text-[10px] text-muted-foreground opacity-50 ml-1">({Math.round(campaign.connected / campaign.leads * 100)}%)</span>
                                    </td>
                                    <td className="px-8 py-4 text-xs font-bold text-foreground">
                                        {campaign.replied} <span className="text-[10px] text-muted-foreground opacity-50 ml-1">({Math.round(campaign.replied / campaign.connected * 100)}%)</span>
                                    </td>
                                    <td className="px-8 py-4">
                                        <button className="text-[10px] font-black uppercase tracking-widest text-blue-500 hover:text-blue-600 transition-colors">Manage</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function AccountStatsItem({ label, sent, limit, color }: any) {
    const percentage = (sent / limit) * 100;
    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-foreground">{label}</span>
                <span className="text-[10px] font-bold text-muted-foreground uppercase">{sent} / {limit}</span>
            </div>
            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                <div 
                    className={`h-full ${color} transition-all duration-1000`} 
                    style={{ width: `${percentage}%` }} 
                />
            </div>
        </div>
    );
}
