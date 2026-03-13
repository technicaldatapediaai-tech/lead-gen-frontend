"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { X, Save, Rocket, UserPlus, Search, Check, ChevronLeft, ChevronRight, List, Linkedin, Type, Send, Loader2, Sparkles, MessageSquare } from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "sonner";

function CampaignCreationContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const templateParam = searchParams.get('template') || 'invitation';

    // Step state
    const [step, setStep] = useState(1);

    // Form state
    const [campaignName, setCampaignName] = useState(`My ${templateParam.charAt(0).toUpperCase() + templateParam.slice(1)} Campaign`);
    const [messageContent, setMessageContent] = useState(
        templateParam === 'invitation'
            ? "Hi {{first_name}}, I saw your profile and would love to connect!"
            : "Hi {{first_name}}, wanted to reach out regarding..."
    );
    const [prospects, setProspects] = useState("");
    const [isLaunching, setIsLaunching] = useState(false);

    const handleLaunch = async () => {
        if (!campaignName.trim()) {
            toast.error("Please enter a campaign name");
            return;
        }

        const leadUrls = prospects.split('\n').map(u => u.trim()).filter(u => u.length > 0);
        if (leadUrls.length === 0) {
            toast.error("Please add at least one prospect URL");
            setStep(3);
            return;
        }

        setIsLaunching(true);
        try {
            // 1. Create Campaign
            const campaignRes = await api.post<any>("/api/campaigns/", {
                name: campaignName,
                type: templateParam === 'invitation' ? 'social' : 'social', // both are social for now
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
                // Create Lead
                const leadRes = await api.post<any>("/api/leads/", {
                    name: "Prospective Lead", // Placeholder, extension will update it
                    linkedin_url: url,
                    status: 'new',
                    campaign_id: campaignId
                });

                if (leadRes.data) {
                    // Create Outreach Message (Queued for Extension)
                    await api.post("/api/outreach/", {
                        lead_id: leadRes.data.id,
                        campaign_id: campaignId,
                        message: messageContent,
                        channel: 'linkedin',
                        send_method: 'extension',
                        message_type: templateParam === 'invitation' ? 'connection' : 'inmail'
                    });
                    successCount++;
                }
            }

            toast.success(`Launched ${campaignName} with ${successCount} leads!`);

            // 3. Trigger extension processing signal
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
        <div className="flex h-screen w-full flex-col bg-background text-muted-foreground transition-colors duration-300">
            {/* Top Bar */}
            <header className="flex h-16 items-center justify-between border-b border-border bg-card px-6 transition-colors duration-300">
                <div className="flex items-center gap-4">
                    <div className="font-bold text-muted-foreground text-xs tracking-widest uppercase">
                        CAMPAIGN CREATION : <span className="text-blue-500">{templateParam}</span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={handleLaunch}
                        disabled={isLaunching}
                        className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-500 disabled:opacity-50"
                    >
                        {isLaunching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Rocket className="h-4 w-4" />}
                        Launch Campaign
                    </button>
                    <Link href="/dashboard/campaigns/templates" className="flex items-center justify-center h-9 w-9 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition">
                        <X className="h-5 w-5" />
                    </Link>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* Custom Sidebar */}
                <aside className="w-72 flex-shrink-0 border-r border-border bg-card p-5 transition-colors duration-300">
                    {/* Progress Steps */}
                    <div className="space-y-2">
                        <StepButton
                            number={1}
                            label="Campaign Details"
                            active={step === 1}
                            completed={step > 1}
                            onClick={() => setStep(1)}
                            icon={<Type className="h-4 w-4" />}
                        />
                        <StepButton
                            number={2}
                            label="Outreach Message"
                            active={step === 2}
                            completed={step > 2}
                            onClick={() => setStep(2)}
                            icon={<MessageSquare className="h-4 w-4" />}
                        />
                        <StepButton
                            number={3}
                            label="Add Prospects"
                            active={step === 3}
                            completed={step > 3}
                            onClick={() => setStep(3)}
                            icon={<UserPlus className="h-4 w-4" />}
                        />
                    </div>

                    <div className="mt-8 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
                        <h4 className="mb-2 text-xs font-bold text-amber-500 uppercase tracking-widest">Extension Status</h4>
                        <p className="text-[10px] leading-relaxed">
                            Messages will be sent via your LinkedIn account using the Chrome extension. Ensure it's active.
                        </p>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto bg-background p-10 transition-colors duration-300">
                    <div className="mx-auto max-w-3xl">

                        {/* Step 1: Details */}
                        {step === 1 && (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                                <div className="mb-8 flex items-center gap-3">
                                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-500 text-white shadow-lg shadow-blue-500/20">
                                        <Type className="h-5 w-5" />
                                    </div>
                                    <h1 className="text-2xl font-bold text-foreground">Name your campaign</h1>
                                </div>

                                <div className="mb-10">
                                    <label className="mb-2 block text-sm font-bold text-foreground">Campaign Name</label>
                                    <input
                                        type="text"
                                        value={campaignName}
                                        onChange={(e) => setCampaignName(e.target.value)}
                                        placeholder="e.g. Q1 Tech Outreach"
                                        className="w-full h-14 rounded-xl border border-input bg-card px-6 text-foreground focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-lg font-medium"
                                    />
                                    <p className="mt-2 text-xs text-muted-foreground">Give your campaign a clear name to track it in your dashboard.</p>
                                </div>

                                <div className="flex justify-end">
                                    <button
                                        onClick={() => setStep(2)}
                                        className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-bold text-white transition hover:bg-blue-500"
                                    >
                                        Next: Message
                                        <ChevronRight className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Message */}
                        {step === 2 && (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                                <div className="mb-8 flex items-center gap-3">
                                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-purple-500 text-white shadow-lg shadow-purple-500/20">
                                        <MessageSquare className="h-5 w-5" />
                                    </div>
                                    <h1 className="text-2xl font-bold text-foreground">Craft your {templateParam}</h1>
                                </div>

                                <div className="mb-6">
                                    <div className="mb-3 flex items-center justify-between">
                                        <label className="text-sm font-bold text-foreground">Message Content</label>
                                        <div className="flex gap-2">
                                            <VariableChip label="First Name" onClick={() => insertVariable('first_name')} />
                                            <VariableChip label="Company" onClick={() => insertVariable('company')} />
                                        </div>
                                    </div>
                                    <textarea
                                        value={messageContent}
                                        onChange={(e) => setMessageContent(e.target.value)}
                                        rows={6}
                                        className="w-full rounded-xl border border-input bg-card p-6 text-foreground focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium leading-relaxed resize-none"
                                        placeholder="Write your LinkedIn invitation note here..."
                                    />
                                    <div className="mt-4 rounded-xl border border-border bg-accent/30 p-4">
                                        <h4 className="mb-2 text-xs font-bold text-muted-foreground uppercase flex items-center gap-2">
                                            <Sparkles className="h-3 w-3" /> Preview
                                        </h4>
                                        <p className="text-sm text-foreground italic">
                                            "{messageContent.replace('{{first_name}}', 'Jordan').replace('{{company}}', 'Google')}"
                                        </p>
                                    </div>
                                </div>

                                <div className="flex justify-between">
                                    <button
                                        onClick={() => setStep(1)}
                                        className="flex items-center gap-2 rounded-xl border border-border px-6 py-3 font-bold text-muted-foreground transition hover:bg-accent"
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                        Previous
                                    </button>
                                    <button
                                        onClick={() => setStep(3)}
                                        className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-bold text-white transition hover:bg-blue-500"
                                    >
                                        Next: Prospects
                                        <ChevronRight className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Prospects */}
                        {step === 3 && (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                                <div className="mb-8 flex items-center gap-3">
                                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-500 text-white shadow-lg shadow-emerald-500/20">
                                        <UserPlus className="h-5 w-5" />
                                    </div>
                                    <h1 className="text-2xl font-bold text-foreground">Add your targets</h1>
                                </div>

                                <div className="mb-8">
                                    <label className="mb-2 block text-sm font-bold text-foreground">LinkedIn URLs (One per line)</label>
                                    <textarea
                                        value={prospects}
                                        onChange={(e) => setProspects(e.target.value)}
                                        rows={10}
                                        placeholder="https://www.linkedin.com/in/john-doe&#10;https://www.linkedin.com/in/jane-smith"
                                        className="w-full rounded-xl border border-input bg-card p-6 text-foreground font-mono text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none"
                                    />
                                    <p className="mt-2 text-xs text-muted-foreground">Paste the profile URLs of the people you want to contact.</p>
                                </div>

                                <div className="flex justify-between">
                                    <button
                                        onClick={() => setStep(2)}
                                        className="flex items-center gap-2 rounded-xl border border-border px-6 py-3 font-bold text-muted-foreground transition hover:bg-accent"
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                        Previous
                                    </button>
                                    <button
                                        onClick={handleLaunch}
                                        disabled={isLaunching}
                                        className="flex items-center gap-2 rounded-xl bg-emerald-600 px-8 py-3 font-bold text-white shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-500 disabled:opacity-50"
                                    >
                                        {isLaunching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                                        Launch Now
                                    </button>
                                </div>
                            </div>
                        )}

                    </div>
                </main>
            </div>
        </div>
    );
}

function StepButton({ number, label, active, completed, onClick, icon }: any) {
    return (
        <button
            onClick={onClick}
            className={`flex w-full items-center gap-3 rounded-xl p-4 text-left transition ${active
                    ? "bg-blue-500/10 border border-blue-500/30 text-foreground"
                    : "hover:bg-accent text-muted-foreground"
                }`}
        >
            <div className={`grid h-8 w-8 place-items-center rounded-lg ${completed ? "bg-emerald-500 text-white" : (active ? "bg-blue-500 text-white" : "bg-muted text-muted-foreground")
                }`}>
                {completed ? <Check className="h-4 w-4" /> : icon}
            </div>
            <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-wider opacity-60">Step {number}</span>
                <span className="font-bold text-sm">{label}</span>
            </div>
        </button>
    );
}

function VariableChip({ label, onClick }: any) {
    return (
        <button
            onClick={onClick}
            className="rounded-lg bg-accent px-2 py-1 text-[10px] font-bold text-foreground hover:bg-blue-500 hover:text-white transition-colors"
        >
            +{label}
        </button>
    );
}

export default function CampaignCreationPage() {
    return (
        <Suspense fallback={<div className="flex h-screen w-full items-center justify-center bg-background"><Loader2 className="h-10 w-10 animate-spin text-blue-500" /></div>}>
            <CampaignCreationContent />
        </Suspense>
    );
}
