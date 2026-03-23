"use client";

import React, { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { 
    Loader2, 
    MessageSquareReply, 
    Search, 
    Linkedin,
    Mail,
    Ban,
    Rocket,
    Clock,
    Play,
    Users,
    ChevronRight,
    Zap,
    AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Campaign {
    id: string;
    name: string;
    status: string;
    type: string;
    settings: any;
    contacted_count: number;
    leads_count: number;
    created_at: string;
}

export default function FollowupsPage() {
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const refreshData = () => setRefreshTrigger(prev => prev + 1);

    useEffect(() => {
        async function fetchData() {
            setIsLoading(true);
            try {
                const { data } = await api.get<any>("/api/campaigns/");
                if (data) {
                    const items = data.items || data;
                    // Filter for active campaigns with follow-ups
                    const activeFollowupCamps = items.filter((c: any) => 
                        c.status === 'active' && 
                        c.settings?.follow_ups && 
                        c.settings.follow_ups.length > 0
                    );
                    setCampaigns(activeFollowupCamps);
                }
            } catch (err) {
                console.error("Failed to load follow-up campaigns", err);
                toast.error("Error loading follow-up list");
            } finally {
                setIsLoading(false);
            }
        }
        fetchData();
    }, [refreshTrigger]);

    const handleStopCampaign = async (campId: string) => {
        if (!confirm("Are you sure you want to stop all upcoming follow-ups for this campaign?")) return;
        
        try {
            const { error } = await api.patch(`/api/campaigns/${campId}/`, {
                status: 'completed'
            });
            
            if (!error) {
                toast.success("Follow-up campaign stopped and marked as completed");
                refreshData();
            } else {
                toast.error("Failed to stop follow-up campaign");
            }
        } catch (err) {
            console.error(err);
            toast.error("Error stopping follow-up campaign");
        }
    };

    const filteredCampaigns = campaigns.filter(c => 
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const linkedinCamps = filteredCampaigns.filter(c => {
        const fus = c.settings.follow_ups || [];
        return fus.some((f: any) => f.channel === 'linkedin' || !f.channel); // Default to linkedin if no channel set (legacy)
    });

    const emailCamps = filteredCampaigns.filter(c => {
        const fus = c.settings.follow_ups || [];
        return fus.some((f: any) => f.channel === 'email');
    });

    const CampaignCard = ({ camp }: { camp: Campaign }) => (
        <div key={camp.id} className="group relative rounded-2xl border border-border bg-card p-6 hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1 transition-all duration-300">
            <div className="flex flex-col h-full">
                <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <div className="h-14 w-14 rounded-2xl bg-blue-600/10 text-blue-600 flex items-center justify-center border border-blue-500/20 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                            <Rocket className="h-7 w-7" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-foreground leading-tight">{camp.name}</h3>
                            <div className="flex items-center gap-2 mt-1">
                                <span className={cn(
                                    "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest border",
                                    "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                                )}>
                                    Active Sequence
                                </span>
                                <span className="text-[10px] text-muted-foreground">• {new Date(camp.created_at).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="p-4 rounded-xl bg-muted/50 border border-border/50">
                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                            <Users className="h-3.5 w-3.5" />
                            <span className="text-[10px] uppercase font-bold tracking-wider">Leads in Funnel</span>
                        </div>
                        <p className="text-xl font-bold text-foreground">{camp.contacted_count || 0}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-muted/50 border border-border/50">
                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                            <Clock className="h-3.5 w-3.5" />
                            <span className="text-[10px] uppercase font-bold tracking-wider">Follow-up Length</span>
                        </div>
                        <p className="text-xl font-bold text-foreground">{camp.settings?.follow_ups?.length || 0} Steps</p>
                    </div>
                </div>

                <div className="mt-auto flex items-center gap-3">
                    <Link href={`/dashboard/campaigns/${camp.id}`} className="flex-1">
                        <Button variant="outline" className="w-full gap-2 font-bold h-11 rounded-xl">
                            View Campaign <ChevronRight className="h-4 w-4" />
                        </Button>
                    </Link>
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-11 w-11 rounded-xl text-red-500 hover:bg-red-50 hover:text-red-600 border border-red-500/10"
                        onClick={() => handleStopCampaign(camp.id)}
                        title="Cancel Follow-ups"
                    >
                        <Ban className="h-5 w-5" />
                    </Button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="flex h-full flex-col bg-background text-foreground animate-in fade-in duration-700">
            {/* Header */}
            <div className="border-b border-border bg-card/50 backdrop-blur-xl px-8 py-10">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <div className="relative">
                            <div className="grid h-16 w-16 place-items-center rounded-[24px] bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-2xl shadow-blue-500/30">
                                <MessageSquareReply className="h-8 w-8" />
                            </div>
                            <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-emerald-500 border-4 border-card flex items-center justify-center">
                                <Zap className="h-3 w-3 text-white fill-current" />
                            </div>
                        </div>
                        <div>
                            <h1 className="text-3xl font-black tracking-tight text-foreground">Follow-up Control Room</h1>
                            <p className="text-sm text-muted-foreground mt-1.5 font-medium max-w-lg">
                                Monitor and manage multi-channel automated outreach campaigns currently in progress.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Body */}
            <div className="flex-1 p-8 space-y-8 max-w-7xl mx-auto w-full">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="relative w-full md:max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/50" />
                        <Input 
                            placeholder="Find follow-up campaigns..." 
                            className="pl-12 h-14 bg-card border-border rounded-2xl text-base shadow-sm focus:ring-blue-500/20"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    
                    <div className="flex items-center gap-4 bg-muted/30 p-1.5 rounded-2xl border border-border overflow-x-auto w-full md:w-auto">
                        <div className="px-5 py-2.5 rounded-xl bg-blue-500/10 text-blue-600 flex items-center gap-2 border border-blue-500/10">
                            <Linkedin className="h-4 w-4" />
                            <span className="text-xs font-black uppercase tracking-wider">{linkedinCamps.length} LinkedIn</span>
                        </div>
                        <div className="px-5 py-2.5 rounded-xl bg-purple-500/10 text-purple-600 flex items-center gap-2 border border-purple-500/10">
                            <Mail className="h-4 w-4" />
                            <span className="text-xs font-black uppercase tracking-wider">{emailCamps.length} Email</span>
                        </div>
                    </div>
                </div>

                <Tabs defaultValue="linkedin" className="w-full">
                    <TabsList className="mb-8 w-full md:w-auto h-16 bg-muted/30 p-2 rounded-2xl border border-border">
                        <TabsTrigger value="linkedin" className="h-full px-8 rounded-xl font-bold flex gap-3 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                            <Linkedin className="h-5 w-5" /> LinkedIn Follow-ups
                        </TabsTrigger>
                        <TabsTrigger value="email" className="h-full px-8 rounded-xl font-bold flex gap-3 data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                            <Mail className="h-5 w-5" /> Email Sequences
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="linkedin" className="mt-0">
                        {isLoading ? (
                            <div className="flex h-96 flex-col items-center justify-center">
                                <Loader2 className="h-12 w-12 animate-spin text-blue-500 mb-4" />
                                <p className="text-muted-foreground font-medium">Scanning LinkedIn sequences...</p>
                            </div>
                        ) : linkedinCamps.length === 0 ? (
                            <EmptyState channel="LinkedIn" />
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {linkedinCamps.map(camp => <CampaignCard key={camp.id} camp={camp} />)}
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="email" className="mt-0">
                        {isLoading ? (
                            <div className="flex h-96 flex-col items-center justify-center">
                                <Loader2 className="h-12 w-12 animate-spin text-purple-500 mb-4" />
                                <p className="text-muted-foreground font-medium">Loading email automation...</p>
                            </div>
                        ) : emailCamps.length === 0 ? (
                            <EmptyState channel="Email" />
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {emailCamps.map(camp => <CampaignCard key={camp.id} camp={camp} />)}
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}

function EmptyState({ channel }: { channel: string }) {
    return (
        <div className="flex h-96 flex-col items-center justify-center p-8 text-center rounded-[32px] border-2 border-dashed border-border bg-card/30 backdrop-blur-sm">
            <div className="h-20 w-20 rounded-3xl bg-muted/50 grid place-items-center mb-6 border border-border">
                {channel === 'LinkedIn' ? <Linkedin className="h-10 w-10 text-muted-foreground" /> : <Mail className="h-10 w-10 text-muted-foreground" />}
            </div>
            <h3 className="text-xl font-black text-foreground">No {channel} Follow-ups</h3>
            <p className="max-w-xs text-sm text-muted-foreground mt-3 font-medium leading-relaxed">
                You don't have any active {channel} campaigns with automated follow-ups scheduled.
            </p>
            <Link href="/dashboard/campaigns/create" className="mt-8">
                <Button className={cn(
                    "font-bold px-8 h-12 rounded-xl border shadow-lg transition-all",
                    channel === 'LinkedIn' ? "bg-blue-600 hover:bg-blue-500 shadow-blue-500/20" : "bg-purple-600 hover:bg-purple-500 shadow-purple-500/20"
                )}>
                    Launch {channel} Campaign
                </Button>
            </Link>
        </div>
    );
}

function AlertState({ message }: { message: string }) {
    return (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-3 text-amber-600">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <p className="text-xs font-bold">{message}</p>
        </div>
    );
}
