"use client";

import { useState, useEffect, useCallback } from "react";
import { Mail, Loader2, X, CheckCircle2, ChevronLeft, ChevronRight, Edit2, Trash2, Send, AlertCircle, Clock, Bold, Italic, Link as LinkIcon, Sparkles, Underline, Strikethrough, List, ListOrdered, AlignLeft, AlignCenter, AlignRight, AlignJustify, Baseline, Highlighter, ChevronDown } from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import useEmblaCarousel from 'embla-carousel-react';

import {
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface Lead {
    id: string;
    name?: string | null;
    email?: string;
    company?: string;
    title?: string;
}

interface BatchEmailMessagingProps {
    leads: Lead[];
    onComplete: (results: BatchResults) => void;
    onCancel: () => void;
    campaignId?: string;
}

interface BatchResults {
    total: number;
    successful: number;
    failed: number;
    results: Array<{ lead_id: string; success: boolean; error?: string }>;
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

export default function BatchEmailMessaging({
    leads,
    onComplete,
    onCancel,
    campaignId
}: BatchEmailMessagingProps) {
    const [templates, setTemplates] = useState<Template[]>([
        { id: '1', name: 'Strategy Outreach', content: "Subject: Streamlining your GTM workflows\n\nHi {{first_name}},\n\nI'm a marketing strategist with 10+ years helping marketing teams automating their GTM workflows. We have a team of GTM engineers who work with marketing teams to automate processes.\n\nRecently we helped startups in fintech, Insurance and retail sector to automate their processes.\n\nWould love to connect and explore how we can collaborate!" }
    ]);
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });
    const [selectedIndex, setSelectedIndex] = useState(0);

    const [isSending, setIsSending] = useState(false);
    const [progress, setProgress] = useState<SendingProgress[]>([]);
    const [schedulingStatus, setSchedulingStatus] = useState<{is_active: boolean, message: string, type: string, next_available?: string} | null>(null);

    // Add state for dynamically entering emails in the modal
    const [editedEmails, setEditedEmails] = useState<Record<string, string>>({});
    const [enrichingIds, setEnrichingIds] = useState<string[]>([]);

    useEffect(() => {
        // Load templates from API if available
        const fetchTemplates = async () => {
            try {
                const res = await api.get<{ items: Template[] }>("/api/outreach/templates/?channel=email");
                if (res.data?.items && res.data.items.length > 0) {
                    setTemplates(res.data.items.map(t => ({ id: t.id, name: t.name, content: t.content })));
                } else {
                    setTemplates([{ id: '1', name: 'Email Template', content: 'Subject: Your Subject Line\n\nHi {{first_name}},\n\nI noticed you work at {{company}}...' }]);
                }
            } catch (error) {
                console.error("Failed to fetch templates", error);
            }
        };

        const fetchStatus = async () => {
            if (!campaignId) return;
            try {
                const { data } = await api.get<any>(`/api/campaigns/${campaignId}/scheduling-status/?channel=email`);
                if (data) setSchedulingStatus(data);
            } catch (err) {
                console.error("Failed to fetch scheduling status", err);
            }
        };

        fetchTemplates();
        fetchStatus();
    }, [campaignId]);


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
            content: 'Subject: Your Subject Line\n\nHi {{first_name}}...'
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

    const execCommand = (command: string, value: string = "") => {
        document.execCommand(command, false, value);
        const editor = document.querySelector(`[data-template-id="${selectedTemplate.id}"]`) as HTMLDivElement;
        if (editor) {
            handleUpdateTemplate(selectedTemplate.id, editor.innerHTML);
        }
    };

    const handleSend = async () => {
        if (!messageTemplate.trim()) {
            toast.error("Please enter a message template");
            return;
        }

        setIsSending(true);

        const leadsWithEmail = leads.filter(lead => lead.email || editedEmails[lead.id]);
        const initialProgress = leadsWithEmail.map(lead => ({
            leadId: lead.id,
            status: "pending" as const
        }));
        setProgress(initialProgress);

        let successCount = 0;
        let failCount = 0;
        const resultsArray: any[] = [];

        // Direct sending loop
        for (const lead of leadsWithEmail) {
            // Update UI to 'sending'
            setProgress(prev => prev.map(p =>
                p.leadId === lead.id ? { ...p, status: "sending" } : p
            ));

            try {
                const resolvedEmail = lead.email || editedEmails[lead.id];

                // Fire update and await so the backend has the email before creating message and sending
                if (!lead.email && editedEmails[lead.id]) {
                    const patchRes = await api.patch(`/api/leads/${lead.id}`, { email: editedEmails[lead.id] });
                    if (patchRes.error) {
                        throw new Error(patchRes.error.detail || "Invalid email format or failed to save.");
                    }
                }

                if (!resolvedEmail) {
                    throw new Error("Missing email address");
                }

                // 1. Create the message
                const msgRes = await api.post<any>("/api/outreach/", {
                    lead_id: lead.id,
                    channel: "email",
                    message: messageTemplate,
                    status: "pending"
                });

                if (msgRes.error) {
                    throw new Error(msgRes.error.detail || "Failed to create message");
                }

                // 2. Trigger the send
                const sendRes = await api.post<any>(`/api/outreach/${msgRes.data.id}/send`);

                if (sendRes.error) {
                    throw new Error(sendRes.error.detail || "Failed to send");
                }

                const finalStatus = sendRes.data.status === "sent" ? "success" : "pending";
                const isScheduled = sendRes.data.status === "scheduled" || sendRes.data.status === "pending";

                setProgress(prev => prev.map(p =>
                    p.leadId === lead.id ? { 
                        ...p, 
                        status: finalStatus as any,
                        // We can store a custom label if needed, or just let status: "success" be the UI "Sent" 
                        // but if it's "pending", maybe we show a different icon?
                    } : p
                ));
                
                if (isScheduled) {
                    // It was queued/scheduled by backend
                }

                successCount++;
                resultsArray.push({ lead_id: lead.id, success: true });

            } catch (err: any) {
                setProgress(prev => prev.map(p =>
                    p.leadId === lead.id ? { ...p, status: "failed", error: err.message || "Failed" } : p
                ));
                failCount++;
                resultsArray.push({ lead_id: lead.id, success: false, error: err.message });
            }
        }

        toast.success(`Batch email completed: ${successCount} sent, ${failCount} failed.`);
        setTimeout(() => {
            onComplete({
                total: leadsWithEmail.length,
                successful: successCount,
                failed: failCount,
                results: resultsArray
            });
        }, 1500);
    };

    const leadsWithEmail = leads.filter(lead => lead.email || editedEmails[lead.id]);
    const leadsWithoutEmail = leads.filter(lead => !lead.email);

    const handleEnrich = async (leadId: string) => {
        setEnrichingIds(prev => [...prev, leadId]);
        try {
            const res = await api.post<Lead>(`/api/leads/${leadId}/enrich`);
            const foundEmail = res.data?.email;
            if (foundEmail) {
                setEditedEmails(prev => ({ ...prev, [leadId]: foundEmail }));
                toast.success("Email found automatically!");
            } else {
                toast.error("Could not find email for this lead.");
            }
        } catch (error) {
            toast.error("Failed to automatically find email.");
        } finally {
            setEnrichingIds(prev => prev.filter(id => id !== leadId));
        }
    };

    const insertVariable = (variable: string) => {
        execCommand('insertHTML', `{{${variable}}}`);
    };

    // Personalize template for preview using first lead's data
    const personalizePreview = (template: string, lead: Lead) => {
        const name = lead.name || "";
        const parts = (name || "").split(" ");
        const firstName = parts[0] || "";
        const lastName = parts.slice(1).join(" ") || "";

        return template
            .replace(/\{\{name\}\}|\[name\]/gi, name)
            .replace(/\{\{first_?name\}\}|\[first\s*name\]/gi, firstName)
            .replace(/\{\{last_?name\}\}|\[last\s*name\]/gi, lastName)
            .replace(/\{\{company\}\}|\[company\]/gi, lead.company || "")
            .replace(/\{\{title\}\}|\[title\]/gi, lead.title || "")
            .replace(/\{\{email\}\}|\[email\]/gi, lead.email || "")
            .replace(/\{\{location\}\}|\[location\]/gi, "")
            .replace(/\{\{industry\}\}|\[industry\]/gi, "");
    };

    return (
        <div className="flex flex-col h-full max-h-[90vh]">
            <DialogHeader className="sr-only">
                <DialogTitle>Send Batch Email</DialogTitle>
                <DialogDescription>Setup your batch email</DialogDescription>
            </DialogHeader>

            {/* Header Area */}
            <div className="flex items-center justify-between p-6 border-b border-border">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-emerald-500 grid place-items-center text-white">
                        <Mail size={20} fill="currentColor" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-foreground">
                            Batch Email Send
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            {isSending
                                ? `Sending to ${leadsWithEmail.length} leads...`
                                : `${leadsWithEmail.length} valid emails • ${leads.length - leadsWithEmail.length} without email`
                            }
                        </p>
                    </div>
                </div>
                <button onClick={onCancel} disabled={isSending} className="text-muted-foreground hover:text-foreground transition">
                    <X size={20} />
                </button>
            </div>
            
            {/* Scheduling Alert Container */}
            {schedulingStatus && !schedulingStatus.is_active && (
                <div className="mx-6 mt-4 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 flex gap-3 text-blue-600 dark:text-blue-400 animate-in slide-in-from-top-4 duration-300">
                    <AlertCircle size={20} className="shrink-0" />
                    <div className="text-sm">
                        <p className="font-bold mb-0.5">Scheduling Note</p>
                        <p>{schedulingStatus.message}</p>
                    </div>
                </div>
            )}

            {/* Leads Missing Email Warning section */}
            {!isSending && progress.length === 0 && leadsWithoutEmail.length > 0 && (
                <div className="mx-6 mt-6 p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 mb-2 shrink-0">
                    <h4 className="text-sm font-bold text-amber-500 mb-3 flex items-center gap-2">
                        <AlertCircle size={16} /> {leadsWithoutEmail.length} leads selected do not have an email address.
                    </h4>
                    <p className="text-xs text-amber-500/80 mb-4">Add them manually below, or try to find them automatically via scraping to include them in the batch:</p>
                    <div className="space-y-3 max-h-48 overflow-y-auto pr-2 scrollbar-thin">
                        {leadsWithoutEmail.map(lead => (
                            <div key={lead.id} className="flex gap-3 items-center bg-background/50 p-2 rounded-lg border border-border/50">
                                <span className="text-sm font-medium w-[30%] truncate text-foreground">{lead.name || "Unknown"}</span>
                                <Input
                                    type="email"
                                    placeholder="Enter or scrape email..."
                                    className="h-8 flex-1 bg-background text-foreground"
                                    value={editedEmails[lead.id] || ''}
                                    onChange={(e) => setEditedEmails(prev => ({ ...prev, [lead.id]: e.target.value }))}
                                />
                                <button
                                    onClick={() => handleEnrich(lead.id)}
                                    disabled={enrichingIds.includes(lead.id)}
                                    className="h-8 px-3 flex items-center gap-1.5 text-xs font-medium rounded-md bg-amber-500 hover:bg-amber-600 text-white disabled:opacity-50 transition-colors"
                                >
                                    {enrichingIds.includes(lead.id) ? <Loader2 size={14} className="animate-spin" /> : <Mail size={14} />}
                                    Auto-Find
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Body */}
            <div className="flex-1 overflow-y-auto bg-muted/10 relative">

                {isSending || progress.length > 0 ? (
                    <div className="p-8 max-w-2xl mx-auto animate-in fade-in duration-500 min-h-[400px]">
                        <div className="text-center mb-10">
                            {progress.every(p => p.status === 'success' || p.status === 'failed') ? (
                                <div className="inline-flex items-center justify-center p-4 bg-emerald-500/10 text-emerald-500 rounded-full mb-4">
                                    <CheckCircle2 size={40} />
                                </div>
                            ) : (
                                <div className="inline-flex items-center justify-center p-4 bg-blue-500/10 text-blue-500 rounded-full mb-4">
                                    <Loader2 size={40} className="animate-spin" />
                                </div>
                            )}
                            <h2 className="text-2xl font-bold text-foreground">
                                {progress.every(p => p.status === 'success' || p.status === 'failed')
                                    ? "Batch Completed"
                                    : "Sending Outreach..."}
                            </h2>
                            <p className="text-muted-foreground mt-2">
                                Sending directly through your connected email account.
                            </p>
                        </div>

                        {/* Progress Tracker */}
                        <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
                            <div className="p-4 bg-muted/30 border-b border-border flex justify-between items-center">
                                <span className="font-bold text-sm text-foreground">Progress</span>
                                <span className="text-xs font-bold text-muted-foreground bg-background px-2 py-1 rounded-md border border-border">
                                    {progress.filter(p => p.status === 'success').length} / {progress.length} Sent
                                </span>
                            </div>
                            <div className="max-h-[250px] overflow-y-auto divide-y divide-border scrollbar-thin">
                                {progress.map((p) => {
                                    const lead = leads.find(l => l.id === p.leadId);
                                    return (
                                        <div key={p.leadId} className="p-4 flex items-center justify-between hover:bg-muted/10 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-full bg-blue-500/10 text-blue-500 font-bold flex items-center justify-center text-xs">
                                                    {(lead?.name || '??').substring(0, 2).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-sm text-foreground">{lead?.name || 'Unknown User'}</p>
                                                    <p className="text-xs text-muted-foreground">{lead?.company || 'No Company'}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                {p.status === 'pending' && (
                                                    <span className="flex items-center gap-1.5 text-xs font-bold text-blue-500 bg-blue-500/10 px-2 py-1 rounded">
                                                        <Clock size={12} /> Queued
                                                    </span>
                                                )}
                                                {p.status === 'sending' && (
                                                    <span className="flex items-center gap-1.5 text-xs font-bold text-blue-500 bg-blue-500/10 px-2 py-1 rounded">
                                                        <Loader2 size={12} className="animate-spin" /> Sending
                                                    </span>
                                                )}
                                                {p.status === 'success' && (
                                                    <span className="flex items-center gap-1 text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded">
                                                        <CheckCircle2 size={12} /> Sent
                                                    </span>
                                                )}
                                                {p.status === 'failed' && (
                                                    <span className="flex items-center gap-1 text-xs font-bold text-rose-500 bg-rose-500/10 px-2 py-1 rounded" title={p.error}>
                                                        <X size={12} /> Failed
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                ) : (
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
                                    {templates.map((template, idx) => {
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

                                                    {/* Toolbar and Textarea */}
                                                    <div className="flex flex-col gap-0 border border-input rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 transition-all bg-background/50">                                                        {/* Word-Style Toolbar */}
                                                        <div className="flex flex-wrap items-center bg-slate-50 border-b border-border p-1 divide-x divide-slate-200">
                                                            {/* Font Group */}
                                                            <div className="flex flex-col px-3 py-1 gap-1 min-w-[280px]">
                                                                <div className="flex items-center gap-1.5 mb-1">
                                                                    <div className="flex h-7 items-center justify-between gap-1 rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-[10px] font-bold text-slate-700 shadow-sm w-[110px]">
                                                                        <span className="truncate">Inter</span>
                                                                        <ChevronDown size={10} className="text-slate-400 shrink-0" />
                                                                    </div>
                                                                    <div className="flex h-7 items-center justify-between gap-1 rounded-lg border border-slate-300 bg-white px-2 py-1 text-[10px] font-bold text-slate-700 shadow-sm w-[45px]">
                                                                        <span>12</span>
                                                                        <ChevronDown size={10} className="text-slate-400 shrink-0" />
                                                                    </div>
                                                                    <div className="flex gap-1 pl-1">
                                                                        <ToolbarButton small icon={<Baseline size={13} />} />
                                                                        <ToolbarButton small icon={<Highlighter size={13} className="text-yellow-600" />} />
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center gap-1">
                                                                    <ToolbarButton icon={<Bold size={14} />} onClick={() => execCommand('bold')} />
                                                                    <ToolbarButton icon={<Italic size={14} />} onClick={() => execCommand('italic')} />
                                                                    <ToolbarButton icon={<Underline size={14} />} onClick={() => execCommand('underline')} />
                                                                    <ToolbarButton icon={<Strikethrough size={14} />} onClick={() => execCommand('strikeThrough')} />
                                                                    <div className="w-px h-4 bg-slate-200 mx-1.5" />
                                                                    <ToolbarButton icon={<LinkIcon size={14} />} onClick={() => {
                                                                        const url = prompt("Enter URL:", "https://");
                                                                        if (url) execCommand('createLink', url);
                                                                    }} />
                                                                </div>
                                                                <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1.5 text-center">Font</div>
                                                            </div>

                                                            {/* Paragraph Group */}
                                                            <div className="flex flex-col px-4 py-1 gap-1 min-w-[200px]">
                                                                <div className="flex items-center gap-1 mb-1">
                                                                    <ToolbarButton icon={<List size={14} />} onClick={() => execCommand('insertUnorderedList')} />
                                                                    <ToolbarButton icon={<ListOrdered size={14} />} onClick={() => execCommand('insertOrderedList')} />
                                                                    <div className="w-px h-4 bg-slate-200 mx-1.5" />
                                                                    <div className="flex gap-1">
                                                                        <VariableChip label="First Name" onClick={() => insertVariable('first_name')} />
                                                                        <VariableChip label="Company" onClick={() => insertVariable('company')} />
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center gap-1">
                                                                    <ToolbarButton icon={<AlignLeft size={14} />} onClick={() => execCommand('justifyLeft')} active />
                                                                    <ToolbarButton icon={<AlignCenter size={14} />} onClick={() => execCommand('justifyCenter')} />
                                                                    <ToolbarButton icon={<AlignRight size={14} />} onClick={() => execCommand('justifyRight')} />
                                                                    <ToolbarButton icon={<AlignJustify size={14} />} onClick={() => execCommand('justifyFull')} />
                                                                </div>
                                                                <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1.5 text-center">Paragraph</div>
                                                            </div>

                                                            <div className="flex-1 flex items-end justify-end px-3 pb-1">
                                                                <button
                                                                    onClick={() => {
                                                                        toast.info("AI Personalization coming soon!");
                                                                    }}
                                                                    className="p-1.5 rounded-lg hover:bg-emerald-500/10 text-emerald-500 transition-all flex items-center justify-center gap-1.5"
                                                                    title="AI Rewrite"
                                                                >
                                                                    <Sparkles size={14} />
                                                                    <span className="text-[10px] font-bold uppercase tracking-wider">Magic</span>
                                                                </button>
                                                            </div>
                                                        </div>


                                                         <div
                                                            data-template-id={template.id}
                                                            contentEditable={!isSending}
                                                            onInput={(e) => handleUpdateTemplate(template.id, e.currentTarget.innerHTML)}
                                                            className="w-full h-[35vh] px-4 py-4 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none overflow-y-auto font-sans text-sm leading-relaxed prose prose-sm max-w-none"
                                                            dangerouslySetInnerHTML={{ __html: template.content }}
                                                        />
                                                    </div>

                                                    {/* Variables (Secondary) */}
                                                    <div className="cursor-default">
                                                        <div className="flex flex-wrap gap-2">
                                                            {["[name]", "[last name]", "[email]"].map(v => (
                                                                <button
                                                                    key={v}
                                                                    onClick={(e) => { e.stopPropagation(); insertVariable(v); }}
                                                                    disabled={isSending}
                                                                    className="px-2.5 py-1.5 text-xs rounded-md bg-muted text-foreground hover:bg-emerald-500 hover:text-white transition-colors border border-border cursor-pointer disabled:opacity-50 font-medium"
                                                                >
                                                                    {v}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    {/* Live Preview for first leads */}
                                                    {template.content.trim() && leadsWithEmail.length > 0 && (
                                                        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.03] overflow-hidden shadow-inner">
                                                            <div className="px-3 py-2 text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 border-b border-emerald-500/10 flex items-center justify-between">
                                                                <span>📨 Email Preview</span>
                                                                <span className="text-[9px] text-muted-foreground font-normal normal-case">Recipient: {leadsWithEmail[0].name}</span>
                                                            </div>
                                                            <div className="p-4 overflow-y-auto bg-white/5">
                                                                <div 
                                                                    className="text-xs text-foreground whitespace-pre-wrap leading-relaxed prose prose-sm prose-emerald dark:prose-invert max-w-none"
                                                                    dangerouslySetInnerHTML={{ 
                                                                        __html: personalizePreview(template.content, leadsWithEmail[0]).replace(/\n/g, '<br/>') 
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Action Buttons */}
                                                    <div className="pt-2 flex gap-3">
                                                        <button
                                                            className="flex-1 py-3 rounded-lg bg-emerald-500 text-white font-semibold hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                                                            onClick={handleSend}
                                                            disabled={!template.content.trim() || leadsWithEmail.length === 0 || isSending}
                                                        >
                                                            <Send size={18} />
                                                            Send to {leadsWithEmail.length} Leads
                                                        </button>
                                                    </div>

                                                </div>
                                            </div>
                                        );
                                    })}

                                    {/* Add New Template Slide */}
                                    <div className="min-w-0 flex-[0_0_100%] pl-4 pr-4">
                                        <div
                                            onClick={handleAddTemplate}
                                            className="h-full min-h-[400px] border-2 border-dashed border-border rounded-2xl flex flex-col items-center justify-center text-muted-foreground hover:bg-muted/30 hover:text-foreground transition cursor-pointer group"
                                        >
                                            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-emerald-500/10 group-hover:text-emerald-500 transition-all">
                                                <Edit2 size={24} />
                                            </div>
                                            <h3 className="text-lg font-bold">Create New Template</h3>
                                            <p className="text-sm mt-1">Add another email variation to your set</p>
                                        </div>
                                    </div>
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
                    </div>
                )}
            </div>

            {!isSending && progress.length === 0 && (
                <div className="border-t border-border bg-card p-4 flex justify-center pb-6">
                    {/* Pagination Dots */}
                    <div className="flex gap-2">
                        {templates.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => emblaApi?.scrollTo(idx)}
                                className={`h-2.5 rounded-full transition-all ${idx === selectedIndex ? "w-8 bg-emerald-500" : "w-2.5 bg-muted-foreground/30 hover:bg-muted-foreground/50"}`}
                            />
                        ))}
                        <button
                            onClick={() => emblaApi?.scrollTo(templates.length)}
                            className={`h-2.5 rounded-full transition-all ${templates.length === selectedIndex ? "w-8 bg-foreground" : "w-2.5 bg-muted-foreground/30 hover:bg-muted-foreground/50"}`}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
function VariableChip({ label, onClick }: { label: string; onClick: () => void }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="rounded-lg bg-white border border-slate-200 px-2 py-0.5 text-[10px] font-black uppercase text-slate-500 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all shadow-sm active:scale-95 whitespace-nowrap box-border"
        >
            +{label}
        </button>
    );
}

function ToolbarButton({ onClick, icon, active, small }: any) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`flex items-center justify-center rounded-lg transition-all hover:bg-white hover:text-blue-600 hover:shadow-sm active:scale-90 ${small ? "h-7 w-7" : "h-8 w-9"} ${active ? "bg-white text-blue-600 shadow-sm border border-slate-200" : "text-slate-500"}`}
        >
            {icon}
        </button>
    );
}
