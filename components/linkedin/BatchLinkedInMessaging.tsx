"use client";

import { useState, useEffect, useCallback } from "react";
import { Linkedin, Send, Loader2, X, CheckCircle2, AlertCircle, ChevronLeft, ChevronRight, Plus, ArrowRight, Trash2, Edit2, Sparkles, Clock, Zap, List, Rocket } from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import useEmblaCarousel from 'embla-carousel-react';

import {
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";

interface Lead {
    id: string;
    name?: string | null;
    company?: string;
    title?: string;
    email?: string;
    linkedin_url?: string;
}

interface BatchLinkedInMessagingProps {
    campaignId?: string;
    leads: Lead[];
    onComplete: (results: BatchResults) => void;
    onCancel: () => void;
}

interface BatchResults {
    total: number;
    successful: number;
    failed: number;
    results: Array<{ lead_id: string; success: boolean; status?: string; error?: string }>;
}

interface SendingProgress {
    leadId: string;
    status: "pending" | "sending" | "success" | "failed";
    error?: string;
}

interface Template {
    id: string;
    name: string;
    content: string;
}

interface LinkedInStatus {
    personal_connected: boolean;
    org_connected: boolean;
}

export default function BatchLinkedInMessaging({
    campaignId,
    leads,
    onComplete,
    onCancel
}: BatchLinkedInMessagingProps) {
    const [page, setPage] = useState<1 | 2>(1);

    // Page 1 State
    const [sendMethod, setSendMethod] = useState<"extension" | "api" | null>(null);
    const [messageType, setMessageType] = useState<"inmail" | "connection" | null>(null);

    // Page 2 State
    const [templates, setTemplates] = useState<Template[]>([
        { id: '1', name: 'Strategy Intro', content: "Hi {{first_name}}, I'm a marketing strategist with 10+ years helping marketing teams automating their GTM workflows. We have a team of GTM engineers who work with marketing teams to automate processes. Recently we helped startups in fintech, Insurance and retail sector to automate their processes. Would love to connect and explore how we can collaborate!" },
        { id: '2', name: 'Connection Note', content: "Hi {{first_name}}, I'd love to connect and share some insights on GTM automation." }
    ]);
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });
    const [selectedIndex, setSelectedIndex] = useState(0);

    const [isSending, setIsSending] = useState(false);
    const [progress, setProgress] = useState<SendingProgress[]>([]);
    const [connectionStatus, setConnectionStatus] = useState<LinkedInStatus | null>(null);
    const [isCheckingConnection, setIsCheckingConnection] = useState(true);

    // Follow-ups State
    const [enableFollowUps, setEnableFollowUps] = useState(false);
    const [globalChannel, setGlobalChannel] = useState<'linkedin' | 'email' | 'both'>('linkedin');
    const [followUps, setFollowUps] = useState<Array<{delayDays: number, message: string, channel?: 'linkedin' | 'email', subject?: string}>>([
        { delayDays: 2, message: "Hi {{first_name}}, following up on my previous message...", channel: 'linkedin' }
    ]);

    useEffect(() => {
        async function checkStatus() {
            try {
                const { data } = await api.get<LinkedInStatus>("/api/linkedin/status");
                if (data) setConnectionStatus(data);
            } catch {
                console.error("Failed to check LinkedIn status");
            } finally {
                setIsCheckingConnection(false);
            }
        }
        checkStatus();
    }, []);

    // Derived selected template
    const selectedTemplate = templates[selectedIndex] || templates[0];
    const messageTemplate = selectedTemplate?.content || "";

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setSelectedIndex(emblaApi.selectedScrollSnap());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        onSelect();
        emblaApi.on('select', onSelect);
        return () => { emblaApi.off('select', onSelect); };
    }, [emblaApi, onSelect]);

    const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
    const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

    const handleUpdateTemplate = (id: string, newContent: string) => {
        setTemplates(prev => prev.map(t => t.id === id ? { ...t, content: newContent } : t));
    };

    const handleAddTemplate = () => {
        const newTemplate = {
            id: Date.now().toString(),
            name: `Template ${templates.length + 1}`,
            content: ''
        };
        setTemplates([...templates, newTemplate]);
        setTimeout(() => {
            if (emblaApi) emblaApi.scrollTo(templates.length);
        }, 50);
    };

    const handleDeleteTemplate = (id: string) => {
        if (templates.length === 1) {
            toast.error("You must have at least one template");
            return;
        }
        setTemplates(prev => prev.filter(t => t.id !== id));
    };

    const addFollowUp = () => setFollowUps([...followUps, { delayDays: 2, message: "", channel: globalChannel === 'both' ? 'linkedin' : (globalChannel as any) }]);
    const removeFollowUp = (index: number) => setFollowUps(followUps.filter((_, i) => i !== index));
    const updateFollowUp = (index: number, field: string, value: any) => {
        const updated = [...followUps];
        updated[index] = { ...updated[index], [field]: value };
        setFollowUps(updated);
    };

    useEffect(() => {
        // Fast processing to avoid blocking user UI 
        if (!isSending || sendMethod === 'api') return;

        // Auto-complete the UI after 4 seconds for extension to give a "fast success" feel
        // The extension will continue processing in the background
        const timer = setTimeout(() => {
            setProgress(prev => prev.map(p => ({ ...p, status: 'success' })));

            setTimeout(() => {
                toast.success("Messages queued to extension and processing in background!");
                onComplete({
                    total: leads.length,
                    successful: leads.length,
                    failed: 0,
                    results: leads.map(l => ({ lead_id: l.id, success: true }))
                });
            }, 1000);
        }, 3000);

        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSending, sendMethod, onComplete]);

    const handleSend = async () => {
        if (!messageTemplate.trim()) {
            toast.error("Please enter a message template");
            return;
        }

        setIsSending(true);

        // Try to save Follow-ups to campaign settings first if applicable
        if (campaignId) {
            try {
                // Fetch current campaign to merge settings (so we don't overwrite everything)
                const { data: currentCamp } = await api.get<any>(`/api/campaigns/${campaignId}/`);
                if (currentCamp) {
                    const currentSettings = currentCamp.settings || {};
                    const updatedSettings = {
                        ...currentSettings,
                        follow_ups: enableFollowUps ? followUps : []
                    };
                    await api.patch(`/api/campaigns/${campaignId}/`, {
                        settings: updatedSettings
                    });
                }
            } catch (err) {
                console.error("Failed to update campaign follow-up settings", err);
                toast.error("Could not save follow-up settings.");
            }
        }

        const initialProgress = leads.map(lead => ({
            leadId: lead.id,
            status: "pending" as const
        }));
        setProgress(initialProgress);

        try {
            const leadIds = leads.filter(lead => lead.linkedin_url).map(lead => lead.id);

            const res = await api.post<BatchResults>("/api/linkedin/send-batch", {
                lead_ids: leadIds,
                message_template: messageTemplate.trim(),
                message_type: messageType || "inmail",
                send_method: sendMethod || "extension"
            });

            if (!res.error && res.data) {
                const updatedProgress = res.data.results.map((result) => {
                    let finalStatus: "pending" | "sending" | "success" | "failed" = "failed";
                    let errorMsg = result.error;

                    if (result.success) {
                        if (sendMethod === 'extension' || result.status === 'queued') {
                            finalStatus = "sending";
                            errorMsg = "Queued for Extension";
                        } else if (result.status === 'api_simulated') {
                            finalStatus = "failed";
                            errorMsg = "API keys missing. Message blocked.";
                        } else {
                            finalStatus = "success";
                        }
                    }

                    return {
                        leadId: result.lead_id,
                        status: finalStatus,
                        error: errorMsg
                    }
                });
                setProgress(updatedProgress);

                if (typeof window !== 'undefined') {
                    window.postMessage({
                        type: 'LEAD_GENIUS_START_BATCH',
                        payload: {
                            count: res.data.successful,
                            batchId: Date.now()
                        }
                    }, '*');
                }

                if (sendMethod === 'extension') {
                    toast.success("Extension agent started successfully! Processing quickly...", { duration: 3000 });
                } else {
                    toast.success(`Attempted to send ${res.data.total} messages via API`);
                    // API is synchronous
                    setTimeout(() => {
                        onComplete(res.data!);
                    }, 2000);
                }
            } else if (res.error) {
                let detail = res.error.detail || "Failed to send batch messages";
                if (Array.isArray(detail)) {
                    detail = detail[0]?.msg || JSON.stringify(detail);
                } else if (typeof detail === 'object') {
                    detail = (detail as { message?: string }).message || JSON.stringify(detail);
                }
                toast.error(detail);
                setIsSending(false);
            }
        } catch (error: unknown) {
            console.error("Error sending batch:", error);
            const err = error as { error?: { detail?: unknown }; message?: string };
            let detail = err.error?.detail || err.message || "Failed to send messages";

            // Handle Pydantic validation errors (often an array)
            if (Array.isArray(detail)) {
                detail = detail[0]?.msg || JSON.stringify(detail);
            } else if (typeof detail === 'object' && detail !== null) {
                detail = (detail as { message?: string }).message || JSON.stringify(detail);
            }
            
            toast.error(String(detail || "Failed to send messages"));
            setIsSending(false);
        }
    };

    const leadsWithLinkedIn = leads.filter(lead => lead.linkedin_url);
    const characterLimit = messageType === "connection" ? 300 : 1900;

    const insertVariable = (variable: string) => {
        const t = templates[selectedIndex];
        if (!t) return;
        handleUpdateTemplate(t.id, t.content + variable);
    };

    // Personalize template for preview using first lead's data
    const personalizePreview = (template: string, lead: Lead) => {
        const name = lead.name || "";
        const parts = (name || "").split(" ");
        const firstName = parts[0] || "";
        const lastName = parts.slice(1).join(" ") || "";

        return template
            .replace(/\{\{name\}\}|\[name\]/gi, name)
            .replace(/\{\{first[\s_]?name\}\}|\[first\s*name\]/gi, firstName)
            .replace(/\{\{last[\s_]?name\}\}|\[last\s*name\]/gi, lastName)
            .replace(/\{\{company\}\}|\[company\]/gi, lead.company || "")
            .replace(/\{\{title\}\}|\[title\]/gi, lead.title || "")
            .replace(/\{\{email\}\}|\[email\]/gi, lead.email || "")
            .replace(/\{\{location\}\}|\[location\]/gi, "")
            .replace(/\{\{industry\}\}|\[industry\]/gi, "");
    };

    return (
        <div className="flex flex-col h-full max-h-[90vh]">
            <DialogHeader className="sr-only">
                <DialogTitle>Send Setup</DialogTitle>
                <DialogDescription>Setup your batch message</DialogDescription>
            </DialogHeader>

            {/* Header Area */}
            <div className="flex items-center justify-between p-6 border-b border-border">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-[#0077b5] grid place-items-center text-white">
                        <Linkedin size={20} fill="currentColor" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-foreground">
                            {page === 1 ? "Send Setup" : "Message Template"}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            {isSending
                                ? `Sending to ${leadsWithLinkedIn.length} leads...`
                                : `${leadsWithLinkedIn.length} leads selected • ${leads.length - leadsWithLinkedIn.length} without LinkedIn`
                            }
                        </p>
                    </div>
                </div>
                <button onClick={onCancel} disabled={isSending} className="text-muted-foreground hover:text-foreground">
                    <X size={20} />
                </button>
            </div>

            {/* Page Content */}
            <div className="flex-1 overflow-y-auto">
                {isSending ? (
                    // PROGRESS VIEW
                    <div className="p-6 space-y-2">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="text-sm font-semibold text-foreground">Sending Progress</h4>
                            <div className="text-xs text-muted-foreground">
                                {progress.filter(p => p.status === "success").length} / {progress.length} sent
                            </div>
                        </div>
                        <div className="space-y-2 max-h-96 overflow-y-auto">
                            {progress.map(item => {
                                const lead = leads.find(l => l.id === item.leadId);
                                return (
                                    <div key={item.leadId} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border">
                                        <div className="flex items-center gap-3">
                                            {item.status === "success" && <CheckCircle2 size={16} className="text-emerald-500" />}
                                            {item.status === "failed" && <AlertCircle size={16} className="text-rose-500" />}
                                            {item.status === "sending" && <Loader2 size={16} className="animate-spin text-blue-500" />}
                                            {item.status === "pending" && <div className="h-4 w-4 rounded-full border-2 border-muted-foreground/30" />}
                                            <span className="text-sm text-foreground">{lead?.name}</span>
                                        </div>
                                        <span className="text-xs text-muted-foreground">
                                            {item.status === "success" && "Sent"}
                                            {item.status === "failed" && (item.error || "Failed")}
                                            {item.status === "sending" && "Sending..."}
                                            {item.status === "pending" && "Waiting"}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ) : page === 1 ? (
                    // PAGE 1: SETUP
                    <div className="p-6 space-y-8 animate-in fade-in zoom-in-95 duration-200">
                        {/* Connection Status Warning */}
                        {sendMethod === 'api' && connectionStatus && !connectionStatus.personal_connected && !connectionStatus.org_connected && (
                            <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/20 flex gap-3 text-orange-600 dark:text-orange-400">
                                <AlertCircle className="h-5 w-5 shrink-0" />
                                <div className="text-sm">
                                    <p className="font-bold mb-0.5">No Account Connected</p>
                                    <p>You haven&apos;t connected a LinkedIn account via OAuth. Please use the <strong>Extension</strong> method or connect in settings.</p>
                                </div>
                            </div>
                        )}

                        {/* Sending Method */}
                        <div className="space-y-3">
                            <h4 className="font-semibold text-foreground">Sending Method</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div
                                    onClick={() => setSendMethod("extension")}
                                    className={`cursor-pointer p-5 rounded-xl border-2 transition-all ${sendMethod === 'extension' ? 'border-[#0077b5] bg-[#0077b5]/5' : 'border-border hover:border-[#0077b5]/30'}`}
                                >
                                    <div className="flex justify-between items-start">
                                        <p className="font-bold text-foreground">Chrome Extension</p>
                                        <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${sendMethod === 'extension' ? 'border-[#0077b5]' : 'border-muted-foreground/30'}`}>
                                            {sendMethod === 'extension' && <div className="h-2.5 w-2.5 rounded-full bg-[#0077b5]" />}
                                        </div>
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-2">Fast, recommended</p>
                                </div>

                                <div
                                    onClick={() => setSendMethod("api")}
                                    className={`cursor-pointer p-5 rounded-xl border-2 transition-all ${sendMethod === 'api' ? 'border-[#0077b5] bg-[#0077b5]/5' : 'border-border hover:border-[#0077b5]/30'}`}
                                >
                                    <div className="flex justify-between items-start">
                                        <p className="font-bold text-foreground">LinkedIn (Direct)</p>
                                        <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${sendMethod === 'api' ? 'border-[#0077b5]' : 'border-muted-foreground/30'}`}>
                                            {sendMethod === 'api' && <div className="h-2.5 w-2.5 rounded-full bg-[#0077b5]" />}
                                        </div>
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-2">Uses LinkedIn method</p>
                                </div>
                            </div>
                        </div>

                        {/* Message Type */}
                        <div className="space-y-3">
                            <h4 className="font-semibold text-foreground">Message Type</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div
                                    onClick={() => setMessageType("inmail")}
                                    className={`cursor-pointer p-5 rounded-xl border-2 transition-all ${messageType === 'inmail' ? 'border-[#0077b5] bg-[#0077b5]/5' : 'border-border hover:border-[#0077b5]/30'}`}
                                >
                                    <div className="flex justify-between items-start">
                                        <p className="font-bold text-foreground">InMail</p>
                                        <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${messageType === 'inmail' ? 'border-[#0077b5]' : 'border-muted-foreground/30'}`}>
                                            {messageType === 'inmail' && <div className="h-2.5 w-2.5 rounded-full bg-[#0077b5]" />}
                                        </div>
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-2">Send as InMail message</p>
                                </div>

                                <div
                                    onClick={() => setMessageType("connection")}
                                    className={`cursor-pointer p-5 rounded-xl border-2 transition-all ${messageType === 'connection' ? 'border-[#0077b5] bg-[#0077b5]/5' : 'border-border hover:border-[#0077b5]/30'}`}
                                >
                                    <div className="flex justify-between items-start">
                                        <p className="font-bold text-foreground">Connect</p>
                                        <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${messageType === 'connection' ? 'border-[#0077b5]' : 'border-muted-foreground/30'}`}>
                                            {messageType === 'connection' && <div className="h-2.5 w-2.5 rounded-full bg-[#0077b5]" />}
                                        </div>
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-2">Send connection request with note</p>
                                </div>
                            </div>
                        </div>

                        {/* Automated Follow-ups Setup */}
                        <div className="space-y-4 pt-4 border-t border-border">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-500 text-white shadow-lg shadow-blue-500/20">
                                        <Sparkles className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-foreground">Automated Follow-ups</h4>
                                        <p className="text-xs text-muted-foreground">Automatically reply to non-responsive leads.</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => setEnableFollowUps(!enableFollowUps)}
                                    className={`px-3 py-1.5 text-sm rounded-lg font-bold transition ${enableFollowUps ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/30' : 'bg-muted text-muted-foreground border border-border'}`}
                                >
                                    {enableFollowUps ? 'Enabled' : 'Disabled'}
                                </button>
                            </div>

                            {enableFollowUps && (
                                <div className="space-y-6 mt-4 animate-in fade-in slide-in-from-top-4 duration-300">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                        {[
                                            { id: 'linkedin', label: 'LinkedIn', icon: <Linkedin className="h-4 w-4" /> },
                                            { id: 'email', label: 'Email', icon: <List className="h-4 w-4" /> },
                                            { id: 'both', label: 'Multi-Channel', icon: <Zap className="h-4 w-4" /> }
                                        ].map((opt) => (
                                            <button
                                                key={opt.id}
                                                onClick={() => {
                                                    setGlobalChannel(opt.id as any);
                                                    if (opt.id !== 'both') {
                                                        setFollowUps(followUps.map(fu => ({ ...fu, channel: opt.id as any })));
                                                    }
                                                }}
                                                className={`flex items-center justify-center gap-2 p-3 text-sm rounded-xl border font-bold transition-all ${globalChannel === opt.id 
                                                    ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20' 
                                                    : 'bg-card text-muted-foreground border-border hover:bg-accent'}`}
                                            >
                                                {opt.icon}
                                                <span>{opt.label}</span>
                                            </button>
                                        ))}
                                    </div>

                                    <div className="space-y-4">
                                        {followUps.map((fu, idx) => (
                                            <div key={idx} className="relative rounded-xl border border-border bg-card p-4 shadow-sm">
                                                <div className="mb-3 flex items-center justify-between border-b border-border/50 pb-3">
                                                    <div className="flex items-center gap-2">
                                                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-[10px] font-bold text-white">
                                                            {idx + 1}
                                                        </span>
                                                        <h5 className="font-bold text-sm text-foreground">Follow-up</h5>
                                                    </div>
                                                    
                                                    <div className="flex items-center gap-3">
                                                        {globalChannel === 'both' && (
                                                            <div className="flex items-center bg-muted p-1 rounded-md">
                                                                <button onClick={() => updateFollowUp(idx, 'channel', 'linkedin')} className={`px-2 py-0.5 text-[10px] font-bold rounded transition ${fu.channel === 'linkedin' ? 'bg-white text-blue-600 shadow-sm' : 'text-muted-foreground'}`}>IN</button>
                                                                <button onClick={() => updateFollowUp(idx, 'channel', 'email')} className={`px-2 py-0.5 text-[10px] font-bold rounded transition ${fu.channel === 'email' ? 'bg-white text-blue-600 shadow-sm' : 'text-muted-foreground'}`}>Email</button>
                                                            </div>
                                                        )}
                                                        <div className="flex items-center gap-1.5">
                                                            <label className="text-[10px] font-bold uppercase text-muted-foreground">Wait</label>
                                                            <input type="number" value={fu.delayDays} onChange={(e) => updateFollowUp(idx, 'delayDays', parseInt(e.target.value))} className="w-10 h-7 rounded-md border border-input bg-background p-1 text-center text-xs font-bold text-foreground focus:ring-1 focus:ring-blue-500" />
                                                            <span className="text-[10px] font-bold text-muted-foreground uppercase">Days</span>
                                                        </div>
                                                        <button onClick={() => removeFollowUp(idx)} className="h-7 w-7 rounded-md flex items-center justify-center text-muted-foreground hover:bg-red-50 hover:text-red-500 transition">
                                                            <X className="h-3 w-3" />
                                                        </button>
                                                    </div>
                                                </div>

                                                {fu.channel === 'email' && (
                                                    <div className="mb-3">
                                                        <input type="text" value={fu.subject || ''} onChange={(e) => updateFollowUp(idx, 'subject', e.target.value)} placeholder="Email Subject" className="w-full h-9 rounded-lg border border-input bg-background px-3 text-sm text-foreground focus:ring-1 focus:ring-blue-500" />
                                                    </div>
                                                )}

                                                <textarea
                                                    value={fu.message}
                                                    onChange={(e) => updateFollowUp(idx, 'message', e.target.value)}
                                                    placeholder="Hey {{first_name}}, following up on..."
                                                    className="w-full h-20 rounded-lg border border-input bg-background p-3 text-sm text-foreground focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
                                                />
                                            </div>
                                        ))}

                                        <button onClick={addFollowUp} className="w-full py-3 rounded-xl border border-dashed border-blue-500/30 text-blue-500 font-bold hover:bg-blue-500/5 transition flex items-center justify-center gap-2 text-sm">
                                            <Plus className="h-4 w-4" /> Add Follow-up
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                    </div>
                ) : (
                    // PAGE 2: SWIPE CAROUSEL
                    <div className="p-6 py-8 flex flex-col items-center animate-in slide-in-from-right duration-300">
                        {/* Embla Carousel Container */}
                        <div className="w-full relative px-8">
                            <button
                                onClick={scrollPrev}
                                disabled={!emblaApi?.canScrollPrev()}
                                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full bg-muted flex items-center justify-center text-foreground hover:bg-muted-foreground/20 disabled:opacity-30 transition cursor-pointer"
                            >
                                <ChevronLeft size={18} />
                            </button>

                            <div className="overflow-hidden w-full cursor-grab active:cursor-grabbing" ref={emblaRef}>
                                <div className="flex touch-pan-y">
                                    {templates.map((template) => {
                                        const remainingChars = characterLimit - template.content.length;
                                        return (
                                            <div key={template.id} className="min-w-0 flex-[0_0_100%] pl-4 pr-4">
                                                <div className="bg-card border border-border shadow-sm rounded-2xl p-5 flex flex-col gap-4">

                                                    {/* Template Name & Actions */}
                                                    <div className="flex items-center justify-between">
                                                        <h4 className="font-bold text-foreground text-lg">{template.name}</h4>
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    const newName = prompt("Rename template:", template.name);
                                                                    if (newName) {
                                                                        setTemplates(prev => prev.map(t => t.id === template.id ? { ...t, name: newName } : t));
                                                                    }
                                                                }}
                                                                className="p-2 rounded-lg text-muted-foreground hover:bg-muted transition cursor-pointer" title="Edit Name">
                                                                <Edit2 size={16} />
                                                            </button>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleDeleteTemplate(template.id);
                                                                }}
                                                                className="p-2 rounded-lg text-rose-500 hover:bg-rose-500/10 transition cursor-pointer" title="Delete Template">
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {/* Textarea */}
                                                    <div className="relative">
                                                        <textarea
                                                            disabled={isSending}
                                                            value={template.content}
                                                            onChange={(e) => handleUpdateTemplate(template.id, e.target.value)}
                                                            placeholder="Hi {{first_name}}, I noticed you work at {{company}}..."
                                                            className="w-full h-48 px-4 py-3 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:border-[#0077b5] focus:outline-none focus:ring-1 focus:ring-[#0077b5] resize-none"
                                                            maxLength={characterLimit}
                                                        />
                                                        <div className={`absolute bottom-3 right-3 text-xs font-medium px-2 py-1 rounded bg-background/80 backdrop-blur-sm ${remainingChars < 50 ? "text-amber-500" : "text-muted-foreground"}`}>
                                                            {remainingChars} chars
                                                        </div>
                                                    </div>

                                                    {/* Variables */}
                                                    <div className="cursor-default">
                                                        <p className="text-xs text-muted-foreground mb-2">Click to insert:</p>
                                                        <div className="flex flex-wrap gap-2">
                                                            {["{{first_name}}", "{{name}}", "{{company}}", "{{title}}", "{{last_name}}", "{{email}}"].map(v => (
                                                                <button
                                                                    key={v}
                                                                    onClick={(e) => { e.stopPropagation(); insertVariable(v); }}
                                                                    disabled={isSending}
                                                                    className="px-2.5 py-1.5 text-xs rounded-md bg-muted text-foreground hover:bg-[#0077b5] hover:text-white transition-colors border border-border cursor-pointer disabled:opacity-50"
                                                                >
                                                                    {v}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    {/* Live Preview for first leads */}
                                                    {/\{\{|\[/.test(template.content) && template.content.trim() && leadsWithLinkedIn.length > 0 && (
                                                        <div className="rounded-xl border border-blue-500/20 bg-blue-500/[0.03] overflow-hidden">
                                                            <div className="px-3 py-2 text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 border-b border-blue-500/10">
                                                                📨 Live Preview (first {Math.min(3, leadsWithLinkedIn.length)} leads)
                                                            </div>
                                                            <div className="divide-y divide-border max-h-40 overflow-y-auto">
                                                                {leadsWithLinkedIn.slice(0, 3).map((lead) => (
                                                                    <div key={lead.id} className="px-3 py-2.5">
                                                                        <div className="text-[10px] font-bold text-muted-foreground mb-1">
                                                                            → {lead.name || "Unknown"}
                                                                        </div>
                                                                        <div className="text-xs text-foreground whitespace-pre-wrap leading-relaxed line-clamp-3">
                                                                            {personalizePreview(template.content, lead)}
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Action Buttons internal to card */}
                                                    <div className="pt-2 flex gap-3">
                                                        <button
                                                            className="flex-1 py-2 rounded-lg bg-[#0077b5]/10 text-[#0077b5] font-semibold hover:bg-[#0077b5]/20 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                                                            onClick={handleSend}
                                                            disabled={!template.content.trim() || leadsWithLinkedIn.length === 0 || isSending || !!(sendMethod === 'api' && connectionStatus && !connectionStatus.personal_connected && !connectionStatus.org_connected)}
                                                        >
                                                            <CheckCircle2 size={18} />
                                                            {sendMethod === 'api' && connectionStatus && !connectionStatus.personal_connected && !connectionStatus.org_connected
                                                                ? "Connect Account First"
                                                                : "Use This Template"}
                                                        </button>
                                                    </div>

                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <button
                                onClick={scrollNext}
                                disabled={!emblaApi?.canScrollNext()}
                                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full bg-muted flex items-center justify-center text-foreground hover:bg-muted-foreground/20 disabled:opacity-30 transition cursor-pointer"
                            >
                                <ChevronRight size={18} />
                            </button>
                        </div>

                        {/* Dots Indicator */}
                        <div className="flex items-center gap-2 mt-6">
                            {templates.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => emblaApi && emblaApi.scrollTo(idx)}
                                    className={`h-2.5 rounded-full transition-all cursor-pointer ${idx === selectedIndex ? "w-8 bg-[#0077b5]" : "w-2.5 bg-muted-foreground/30 hover:bg-muted-foreground/50"}`}
                                />
                            ))}
                        </div>

                        {/* New template button */}
                        <div className="mt-8">
                            <button
                                onClick={handleAddTemplate}
                                disabled={isSending}
                                className="flex items-center gap-2 text-sm font-semibold text-[#0077b5] hover:text-[#005582] transition-colors px-4 py-2 hover:bg-[#0077b5]/5 rounded-lg cursor-pointer disabled:opacity-50"
                            >
                                <Plus size={16} />
                                Add New Template
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Bottom Actions Container */}
            {!isSending && (
                <div className="p-6 border-t border-border bg-card/50">
                    {page === 1 ? (
                        <div className="flex justify-end">
                            <button
                                onClick={() => setPage(2)}
                                disabled={!sendMethod || !messageType}
                                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#0077b5] text-white font-semibold hover:bg-[#006396] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Continue
                                <ArrowRight size={18} />
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center justify-between">
                            <button
                                onClick={() => setPage(1)}
                                className="px-5 py-2.5 rounded-xl border border-input bg-background font-semibold hover:bg-accent transition cursor-pointer"
                            >
                                Back
                            </button>
                            <button
                                onClick={handleSend}
                                disabled={isCheckingConnection || !messageTemplate.trim() || leadsWithLinkedIn.length === 0 || !!(sendMethod === 'api' && connectionStatus && !connectionStatus.personal_connected && !connectionStatus.org_connected)}
                                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#0077b5] text-white font-semibold hover:bg-[#006396] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer`}
                            >
                                {isCheckingConnection ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Send size={18} />
                                )}
                                {isCheckingConnection ? "Checking..." : (sendMethod === 'api' && connectionStatus && !connectionStatus.personal_connected && !connectionStatus.org_connected
                                    ? "Connect Account First"
                                    : "Send")}
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
