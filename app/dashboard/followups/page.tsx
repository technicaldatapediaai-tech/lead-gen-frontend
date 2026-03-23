"use client";

import React, { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { 
    Loader2, 
    MessageSquareReply, 
    Search, 
    Filter, 
    ExternalLink, 
    Ban,
    User,
    Calendar,
    Clock,
    Play
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

interface Lead {
    id: string;
    name: string;
    title?: string;
    company?: string;
    email?: string;
    linkedin_url?: string;
    status: string;
    campaign_id?: string;
    last_contacted_at?: string;
    custom_fields?: any;
}

interface LeadsResponse {
    items: Lead[];
    total: number;
}

export default function FollowupsPage() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [campaigns, setCampaigns] = useState<Record<string, any>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const refreshData = () => setRefreshTrigger(prev => prev + 1);

    useEffect(() => {
        async function fetchData() {
            setIsLoading(true);
            try {
                // Fetch Campaigns first to map names/settings
                const { data: campData } = await api.get<any>("/api/campaigns/");
                if (campData) {
                    const cmap: Record<string, any> = {};
                    (campData.items || campData).forEach((c: any) => {
                        cmap[c.id] = c;
                    });
                    setCampaigns(cmap);
                }

                // Filter for contacted leads
                const query = new URLSearchParams({
                    status: "contacted",
                    limit: "100",
                    search: searchTerm
                });
                const { data } = await api.get<LeadsResponse>(`/api/leads/?${query.toString()}`);
                if (data) {
                    setLeads(data.items);
                }
            } catch (err) {
                console.error("Failed to load follow-ups", err);
                toast.error("Error loading follow-up list");
            } finally {
                setIsLoading(false);
            }
        }

        const timer = setTimeout(fetchData, searchTerm ? 500 : 0);
        return () => clearTimeout(timer);
    }, [searchTerm, refreshTrigger]);

    const handleStopFollowup = async (leadId: string) => {
        try {
            const { error } = await api.patch(`/api/leads/${leadId}/`, {
                status: 'stopped'
            });
            
            if (!error) {
                toast.success("Follow-up sequence stopped");
                refreshData();
            } else {
                toast.error("Failed to stop follow-up");
            }
        } catch (err) {
            console.error(err);
            toast.error("Error stopping follow-up");
        }
    };

    return (
        <div className="flex h-full flex-col bg-background text-foreground animate-in fade-in duration-500">
            {/* Header */}
            <div className="border-b border-border bg-card px-8 py-8">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-500/20">
                            <MessageSquareReply className="h-6 w-6" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">Automated Follow-ups</h1>
                            <p className="text-sm text-muted-foreground mt-1">
                                Manage leads currently in automated messaging sequences.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-hidden p-8 flex flex-col gap-6">
                {/* Filters */}
                <div className="flex items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input 
                            placeholder="Search leads in sequence..." 
                            className="pl-10 h-11 bg-card border-border"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="text-xs font-bold text-muted-foreground bg-muted px-3 py-2 rounded-lg border border-border">
                            {leads.length} ACTIVE SEQUENCES
                        </div>
                    </div>
                </div>

                {/* Main List */}
                <div className="flex-1 overflow-y-auto rounded-2xl border border-border bg-card shadow-sm">
                    {isLoading ? (
                        <div className="flex h-64 items-center justify-center">
                            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                        </div>
                    ) : leads.length === 0 ? (
                        <div className="flex h-64 flex-col items-center justify-center p-8 text-center">
                            <div className="h-16 w-16 rounded-full bg-muted grid place-items-center mb-4">
                                <Clock className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <h3 className="text-lg font-bold">No leads in sequence</h3>
                            <p className="max-w-xs text-sm text-muted-foreground mt-2">
                                When you launch a campaign with automated follow-ups, leads will appear here.
                            </p>
                            <Link href="/dashboard/campaigns/create" className="mt-6">
                                <Button className="bg-blue-600 hover:bg-blue-500 gap-2 font-bold px-6">
                                    <Play className="h-4 w-4" /> Start New Campaign
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="divide-y divide-border">
                            {leads.map((lead) => (
                                <div key={lead.id} className="group flex items-center justify-between p-6 hover:bg-muted/30 transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-full bg-blue-500/10 text-blue-500 grid place-items-center border border-blue-500/20 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                            <User className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-bold text-foreground">{lead.name}</h4>
                                                <span className="text-[10px] font-bold bg-muted text-muted-foreground px-2 py-0.5 rounded border border-border">
                                                    Sequence #{lead.custom_fields?.followup_sequence || 0}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                                                <span>{lead.title} @ <b>{lead.company}</b></span>
                                                <span>•</span>
                                                <span className="text-blue-500 font-semibold">
                                                    {lead.campaign_id && campaigns[lead.campaign_id] ? campaigns[lead.campaign_id].name : 'Unknown Campaign'}
                                                </span>
                                            </div>
                                            
                                            {/* Preview of next message */}
                                            {lead.campaign_id && campaigns[lead.campaign_id] && (
                                                <div className="mt-3 rounded-lg bg-muted/50 p-3 text-[11px] italic border border-border/50 max-w-lg">
                                                    <span className="font-bold block mb-1 not-italic text-[10px] text-muted-foreground uppercase">Next Message Preview:</span>
                                                    {(() => {
                                                        const camp = campaigns[lead.campaign_id];
                                                        const seqIdx = lead.custom_fields?.followup_sequence || 0;
                                                        const followUps = camp.settings?.follow_ups || [];
                                                        if (followUps[seqIdx]) {
                                                            return `"${followUps[seqIdx].message.substring(0, 100)}${followUps[seqIdx].message.length > 100 ? '...' : ''}"`;
                                                        }
                                                        return "No pending follow-ups defined in campaign settings.";
                                                    })()}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="flex flex-col items-end mr-4">
                                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Status</span>
                                            <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded mt-1 border border-emerald-500/20">
                                                In Progress
                                            </span>
                                        </div>
                                        {lead.linkedin_url && (
                                            <a 
                                                href={lead.linkedin_url} 
                                                target="_blank" 
                                                className="h-10 w-10 rounded-xl border border-border bg-card grid place-items-center hover:bg-accent transition"
                                                title="View Linkedin"
                                            >
                                                <ExternalLink className="h-4 w-4 text-blue-500" />
                                            </a>
                                        )}
                                        <Link href={`/dashboard/crm/${lead.id}`} className="h-10 w-10 rounded-xl border border-border bg-card grid place-items-center hover:bg-accent transition">
                                            <User className="h-4 w-4 text-muted-foreground" />
                                        </Link>
                                        <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            className="h-10 w-10 text-amber-500 hover:text-red-500 hover:bg-red-50 transition-colors border border-border"
                                            onClick={() => handleStopFollowup(lead.id)}
                                            title="Stop Follow-ups"
                                        >
                                            <Ban className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
