"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { X, Rocket, UserPlus, Type, Send, Loader2, Sparkles, MessageSquare, CheckCircle2 } from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "sonner";

function CampaignCreationContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const templateParam = searchParams.get('template') || 'invitation';

    // Form state
    const [campaignName, setCampaignName] = useState(`My ${templateParam.charAt(0).toUpperCase() + templateParam.slice(1)} Campaign`);
    const [messageContent, setMessageContent] = useState(
        templateParam === 'invitation'
            ? "Hi {{first_name}}, I saw your profile and would love to connect!"
            : "Hi {{first_name}}, wanted to reach out regarding..."
    );
    const [prospects, setProspects] = useState("");
    const [sendMethod, setSendMethod] = useState<'extension' | 'api'>('extension');
    const [isLaunching, setIsLaunching] = useState(false);

    const handleLaunch = async () => {
        if (!campaignName.trim()) {
            toast.error("Please enter a campaign name");
            return;
        }

        const leadUrls = prospects.split('\n').map(u => u.trim()).filter(u => u.length > 0);
        if (leadUrls.length === 0) {
            toast.error("Please add at least one prospect URL");
            return;
        }

        setIsLaunching(true);
        try {
            // 1. Create Campaign
            const campaignRes = await api.post<any>("/api/campaigns", {
                name: campaignName,
                type: 'social',
                status: 'active',
                settings: {
                    template: templateParam,
                    message: messageContent
                }
            });

            if (campaignRes.error) {
                toast.error(`Failed to create campaign: ${campaignRes.error.detail}`);
                setIsLaunching(false);
                return;
            }

            const campaignId = campaignRes.data.id;

            // 2. Create Leads and Outreach Messages
            let successCount = 0;
            for (const url of leadUrls) {
                const leadRes = await api.post<any>("/api/leads", {
                    name: "Prospective Lead",
                    linkedin_url: url,
                    status: 'new',
                    campaign_id: campaignId
                });

                if (leadRes.data) {
                    await api.post("/api/outreach", {
                        lead_id: leadRes.data.id,
                        campaign_id: campaignId,
                        message: messageContent,
                        channel: 'linkedin',
                        send_method: sendMethod,
                        message_type: templateParam === 'invitation' ? 'connection' : 'inmail'
                    });
                    successCount++;
                }
            }

            toast.success(`Started ${campaignName} with ${successCount} leads!`);
            window.postMessage({ type: "LEAD_GENIUS_START_BATCH" }, "*");
            router.push("/dashboard/campaigns");
        } catch (error) {
            console.error("Launch error:", error);
            toast.error("An unexpected error occurred during launch");
        } finally {
            setIsLaunching(false);
        }
    };

    const insertVariable = (variable: string) => {
        setMessageContent(prev => prev + ` {{${variable}}}`);
    };

    return (
        <div className="flex h-full w-full flex-col bg-background text-muted-foreground transition-colors duration-300">
            {/* Header */}
            <header className="flex h-16 items-center justify-between border-b border-border bg-card px-8">
                <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-600/10 text-blue-600">
                        <Rocket className="h-5 w-5" />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-foreground">Start Simple LinkedIn Outreach</h1>
                        <p className="text-xs text-muted-foreground">Fill in the details below to begin sending messages automatically.</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={handleLaunch}
                        disabled={isLaunching}
                        className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-500 disabled:opacity-50"
                    >
                        {isLaunching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                        Start Outreach
                    </button>
                    <Link href="/dashboard/campaigns" className="flex items-center justify-center h-10 w-10 rounded-xl text-muted-foreground hover:text-foreground hover:bg-accent transition">
                        <X className="h-5 w-5" />
                    </Link>
                </div>
            </header>

            <main className="flex-1 overflow-y-auto p-8">
                <div className="mx-auto max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* Left Side: Config */}
                    <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
                        {/* Campaign Name */}
                        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                            <div className="mb-4 flex items-center gap-3">
                                <div className="grid h-8 w-8 place-items-center rounded-lg bg-blue-500 text-white">
                                    <Type className="h-4 w-4" />
                                </div>
                                <h3 className="font-bold text-foreground">Campaign Name</h3>
                            </div>
                            <input
                                type="text"
                                value={campaignName}
                                onChange={(e) => setCampaignName(e.target.value)}
                                placeholder="e.g. Q1 LinkedIn Outreach"
                                className="w-full h-12 rounded-xl border border-input bg-background px-4 text-foreground focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-base"
                            />
                        </div>

                        {/* Sending Method */}
                        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                            <div className="mb-4 flex items-center gap-3">
                                <div className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-500 text-white">
                                    <Rocket className="h-4 w-4" />
                                </div>
                                <h3 className="font-bold text-foreground">Outreach Method</h3>
                            </div>
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setSendMethod('extension')}
                                    className={`flex-1 p-4 rounded-xl border-2 transition-all text-left ${sendMethod === 'extension'
                                        ? "border-emerald-500 bg-emerald-50/30"
                                        : "border-border bg-card hover:border-emerald-200"
                                        }`}
                                >
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="font-bold text-sm text-foreground">Chrome Extension</span>
                                        {sendMethod === 'extension' && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
                                    </div>
                                    <p className="text-[10px] leading-tight text-muted-foreground">Uses your browser to mimic human activity. Safest for LinkedIn.</p>
                                </button>
                                <button
                                    onClick={() => setSendMethod('api')}
                                    className={`flex-1 p-4 rounded-xl border-2 transition-all text-left ${sendMethod === 'api'
                                        ? "border-blue-500 bg-blue-50/30"
                                        : "border-border bg-card hover:border-blue-200"
                                        }`}
                                >
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="font-bold text-sm text-foreground">Direct API</span>
                                        {sendMethod === 'api' && <CheckCircle2 className="h-4 w-4 text-blue-500" />}
                                    </div>
                                    <p className="text-[10px] leading-tight text-muted-foreground">High-speed background delivery. Requires connected LinkedIn account.</p>
                                </button>
                            </div>
                        </div>

                        {/* Message Content */}
                        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                            <div className="mb-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="grid h-8 w-8 place-items-center rounded-lg bg-purple-500 text-white">
                                        <MessageSquare className="h-4 w-4" />
                                    </div>
                                    <h3 className="font-bold text-foreground">Message Body</h3>
                                </div>
                                <div className="flex gap-2">
                                    <VariableChip label="First Name" onClick={() => insertVariable('first_name')} />
                                    <VariableChip label="Company" onClick={() => insertVariable('company')} />
                                </div>
                            </div>
                            <textarea
                                value={messageContent}
                                onChange={(e) => setMessageContent(e.target.value)}
                                rows={8}
                                className="w-full rounded-xl border border-input bg-background p-4 text-sm text-foreground focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium leading-relaxed resize-none"
                                placeholder="Hi {{first_name}}, I saw your profile..."
                            />
                            <div className="mt-4 rounded-xl border border-border bg-accent/30 p-4">
                                <h4 className="mb-1 text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1.5">
                                    <Sparkles className="h-3 w-3" /> Real-time Preview
                                </h4>
                                <p className="text-xs text-foreground italic opacity-90">
                                    "{messageContent.replace('{{first_name}}', 'Jordan').replace('{{company}}', 'Google')}"
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Prospects */}
                    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                        <div className="h-full rounded-2xl border border-border bg-card p-6 shadow-sm flex flex-col">
                            <div className="mb-4 flex items-center gap-3">
                                <div className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-500 text-white">
                                    <UserPlus className="h-4 w-4" />
                                </div>
                                <h3 className="font-bold text-foreground">Paste LinkedIn URLs</h3>
                            </div>
                            <p className="mb-4 text-xs text-muted-foreground">Add the profiles you want to contact. One URL per line.</p>
                            <textarea
                                value={prospects}
                                onChange={(e) => setProspects(e.target.value)}
                                className="flex-1 w-full rounded-xl border border-input bg-background p-4 text-foreground font-mono text-xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none min-h-[300px]"
                                placeholder="https://www.linkedin.com/in/john-doe&#10;https://www.linkedin.com/in/jane-smith"
                            />
                            <p className="mt-4 text-[10px] text-center text-muted-foreground uppercase tracking-widest font-bold">
                                Chrome Extension required for automation
                            </p>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}

function VariableChip({ label, onClick }: any) {
    return (
        <button
            onClick={onClick}
            className="rounded bg-accent px-1.5 py-0.5 text-[9px] font-bold text-foreground hover:bg-blue-500 hover:text-white transition-colors"
        >
            +{label}
        </button>
    );
}

export default function CampaignCreationPage() {
    return (
        <Suspense fallback={<div className="flex h-full w-full items-center justify-center bg-background"><Loader2 className="h-8 w-8 animate-spin text-blue-500" /></div>}>
            <CampaignCreationContent />
        </Suspense>
    );
}
