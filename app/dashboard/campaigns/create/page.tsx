"use client";

import React, { useState, useRef, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { X, Rocket, UserPlus, Type, Send, Loader2, Sparkles, MessageSquare, CheckCircle2, Upload, Search, Users, ThumbsUp, ClipboardList, Bold, Italic, Link as LinkIcon, Type as TypeIcon, Info, Underline, Strikethrough, List, ListOrdered, AlignLeft, AlignCenter, AlignRight, AlignJustify, Baseline, Highlighter, ChevronDown, Eye } from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import CSVImport from "@/components/extraction/CSVImport";
import ManualLeadEntry from "@/components/extraction/ManualLeadEntry";
import StandardSearch from "@/components/extraction/StandardSearch";
import SalesNavigator from "@/components/extraction/SalesNavigator";
import LinkedInGroups from "@/components/extraction/LinkedInGroups";
import PostEngagement from "@/components/extraction/PostEngagement";
import TwitterSearch from "@/components/extraction/TwitterSearch";
import InstagramSearch from "@/components/extraction/InstagramSearch";
import FacebookSearch from "@/components/extraction/FacebookSearch";

function CampaignCreationContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const templateParam = searchParams.get('template') || 'invitation';
    const editorRef = useRef<HTMLDivElement>(null);

    // Form state
    const [campaignName, setCampaignName] = useState(`My ${templateParam.charAt(0).toUpperCase() + templateParam.slice(1)} Campaign`);
    const [messageContent, setMessageContent] = useState(
        templateParam === 'invitation'
            ? "<div>Hi {{first_name}},</div><div><br></div><div>I'm a marketing strategist with 10+ years helping marketing teams automating their GTM workflows. We have a team of GTM engineers who work with marketing teams to automate processes. Recently we helped startups in fintech, Insurance and retail sector to automate their processes. Would love to connect and explore how we can collaborate!</div>"
            : "<div>Hi {{first_name}},</div><div><br></div><div>I saw your profile and would love to connect and share some insights on GTM automation.</div>"
    );
    const [connectionNoteContent, setConnectionNoteContent] = useState("Hi {{first_name}}, would love to connect!");
    const [prospects, setProspects] = useState("");
    const [sendMethod, setSendMethod] = useState<'extension' | 'api'>('extension');
    const [isLaunching, setIsLaunching] = useState(false);
    const [leadMethod, setLeadMethod] = useState<'urls' | 'csv' | 'manual' | 'social'>('urls');
    const [socialSubMethod, setSocialSubMethod] = useState<'standard' | 'salesnav' | 'groups' | 'post' | 'twitter' | 'instagram' | 'facebook'>('standard');
    const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null);

    // Fetch organizations on mount and auto-select
    React.useEffect(() => {
        async function fetchOrgs() {
            const { data, error } = await api.get<any>("/api/organizations/");
            if (!error && data) {
                const activeOrgs = (data.organizations || []).filter((o: any) => o.is_active);
                const savedOrgId = localStorage.getItem("leadgenius_selected_org_id");
                const validSavedOrg = savedOrgId && activeOrgs.some((o: any) => o.id === savedOrgId);

                if (validSavedOrg) {
                    setSelectedOrgId(savedOrgId);
                } else if (data.current_org_id && activeOrgs.some((o: any) => o.id === data.current_org_id)) {
                    setSelectedOrgId(data.current_org_id);
                } else if (activeOrgs.length > 0) {
                    setSelectedOrgId(activeOrgs[0].id);
                }
            }
        }
        fetchOrgs();
    }, []);

    const handleLaunch = async () => {
        if (!campaignName.trim()) {
            toast.error("Please enter a campaign name");
            return;
        }

        const leadUrls = prospects.split('\n').map(u => u.trim()).filter(u => u.length > 0);
        if (leadUrls.length === 0 && leadMethod === 'urls') {
            toast.error("Please add at least one prospect URL");
            return;
        }

        setIsLaunching(true);
        try {
            // 1. Create Campaign
            const campaignRes = await api.post<any>("/api/campaigns/", {
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

            // 2. Create Leads and Outreach Messages (if URLs were pasted)
            if (leadMethod === 'urls') {
                let successCount = 0;
                for (const url of leadUrls) {
                    const leadRes = await api.post<any>("/api/leads/", {
                        name: "Prospective Lead",
                        linkedin_url: url,
                        status: 'new',
                        campaign_id: campaignId
                    });

                    if (leadRes.data) {
                        await api.post("/api/outreach/", {
                            lead_id: leadRes.data.id,
                            campaign_id: campaignId,
                            message: messageContent,
                            connection_note: templateParam.includes('invitation') ? connectionNoteContent.replace(/<[^>]*>?/gm, '') : null,
                            channel: 'linkedin',
                            send_method: sendMethod,
                            message_type: templateParam === 'invitation' ? 'connection' : 'inmail'
                        });
                        successCount++;
                    }
                }
                toast.success(`Started ${campaignName} with ${successCount} leads!`);
            } else {
                toast.success(`Campaign ${campaignName} created!`);
            }

            window.postMessage({ type: "LEAD_GENIUS_START_BATCH" }, "*");
            router.push("/dashboard/campaigns");
        } catch (error) {
            console.error("Launch error:", error);
            toast.error("An unexpected error occurred during launch");
        } finally {
            setIsLaunching(false);
        }
    };

    const execCommand = (command: string, value: string = "") => {
        document.execCommand(command, false, value);
        if (editorRef.current) {
            setMessageContent(editorRef.current.innerHTML);
        }
    };

    const handleAddLink = () => {
        const url = prompt("Enter full URL (e.g. https://google.com):", "https://");
        if (url) {
            execCommand('createLink', url);
        }
    };

    const insertVariable = (variable: string) => {
        execCommand('insertHTML', `{{${variable}}}`);
    };

    return (
        <div className="flex h-full w-full flex-col bg-slate-50 text-muted-foreground transition-colors duration-300">
            {/* Header */}
            <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-8 shadow-sm relative z-10">
                <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-600/10 text-blue-600">
                        <Rocket className="h-5 w-5" />
                    </div>
                    <div>
                        <h1 className="text-base font-black text-slate-800 uppercase tracking-tight">Campaign Builder</h1>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Create & Launch</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={handleLaunch}
                        disabled={isLaunching}
                        className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-bold text-white shadow-xl shadow-blue-500/20 transition hover:bg-blue-500 active:scale-95 disabled:opacity-50"
                    >
                        {isLaunching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                        Launch Campaign
                    </button>
                    <Link href="/dashboard/campaigns" className="flex items-center justify-center h-10 w-10 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition">
                        <X className="h-5 w-5" />
                    </Link>
                </div>
            </header>

            <main className="flex-1 overflow-y-auto p-12">
                <div className="mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* Left Column (Main Form - 7 cols) */}
                    <div className="lg:col-span-7 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        
                        {/* 1. Campaign Identity */}
                        <div className="rounded-[32px] border border-slate-100 bg-white p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                            <div className="mb-6 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="grid h-10 w-10 place-items-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-100">
                                        <TypeIcon className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-slate-800 tracking-tight">Campaign Identity</h3>
                                        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-tighter">Enter a recognizable name for this sequence</p>
                                    </div>
                                </div>
                            </div>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={campaignName}
                                    onChange={(e) => setCampaignName(e.target.value)}
                                    placeholder="e.g. Q1 LinkedIn Master Outreach"
                                    className="w-full h-14 rounded-2xl border-2 border-slate-50 bg-slate-50/50 px-6 text-slate-900 font-bold placeholder:text-slate-300 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all text-lg shadow-inner"
                                />
                            </div>
                        </div>

                        {/* 2. Message Composer */}
                        <div className="rounded-[32px] border border-slate-100 bg-white p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
                            <div className="mb-6 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="grid h-10 w-10 place-items-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-100">
                                        <MessageSquare className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-slate-800 tracking-tight">Compose Template</h3>
                                        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-tighter">Draft your message using formatting & variables</p>
                                    </div>
                                </div>
                            </div>

                            {/* Word-Style Toolbar */}
                            <div className="flex flex-wrap items-center bg-slate-50 border border-slate-200 rounded-2xl mb-4 p-1 divide-x divide-slate-200 shadow-sm">
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
                                        <ToolbarButton icon={<LinkIcon size={14} />} onClick={handleAddLink} />
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
                            </div>

                             <div className="relative group">
                                <div
                                    ref={editorRef}
                                    contentEditable
                                    onInput={(e) => setMessageContent(e.currentTarget.innerHTML)}
                                    className="w-full rounded-[24px] border-2 border-slate-50 bg-slate-50/30 p-6 text-base text-slate-700 font-medium leading-relaxed overflow-y-auto focus:outline-none focus:border-blue-500 focus:bg-white transition-all custom-scrollbar min-h-[300px] prose prose-sm max-w-none shadow-inner"
                                    dangerouslySetInnerHTML={{ __html: messageContent }}
                                />
                            </div>

                            <div className="mt-8 relative animate-in fade-in zoom-in-95 duration-500">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-1.5 h-4 bg-blue-600 rounded-full" />
                                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                                        <Eye size={14} className="text-blue-600" />
                                        Message Preview
                                    </h4>
                                </div>
                                
                                {/* Word-like Page */}
                                <div className="bg-white border border-slate-200 rounded-lg shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] overflow-hidden">
                                    <div className="h-2 bg-blue-600 w-full" />
                                    <div className="p-10 min-h-[300px] relative">
                                        {/* Page Watermark */}
                                        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none overflow-hidden">
                                            <Rocket size={200} className="text-slate-900 rotate-12" />
                                        </div>
                                        
                                        <div 
                                            className="relative z-10 text-sm text-slate-700 font-medium leading-relaxed whitespace-pre-wrap prose prose-sm prose-blue max-w-none"
                                            dangerouslySetInnerHTML={{ 
                                                __html: messageContent
                                                    .replace(/\{\{first_name\}\}/g, '<span class="text-blue-600 font-bold bg-blue-50 px-1 rounded">Jordan</span>')
                                                    .replace(/\{\{company\}\}/g, '<span class="text-blue-600 font-bold bg-blue-50 px-1 rounded">Google</span>')
                                                    .replace(/\{\{title\}\}/g, '<span class="text-blue-600 font-bold bg-blue-50 px-1 rounded">Marketing Manager</span>')
                                                    .replace(/\n/g, '<br/>')
                                            }}
                                        />
                                    </div>
                                    <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 flex items-center justify-between">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                            <Sparkles size={12} /> Personalized Preview
                                        </span>
                                        <span className="text-[10px] font-bold text-slate-400">1/1 Pages</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 2b. Connection Note (Conditional) */}
                        {templateParam.includes('invitation') && (
                        <div className="rounded-[32px] border border-slate-100 bg-white p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-l-4 border-l-blue-500 animate-in fade-in slide-in-from-left-4 duration-500">
                             <div className="mb-6 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="grid h-10 w-10 place-items-center rounded-2xl bg-blue-500 text-white shadow-lg shadow-blue-100">
                                        <UserPlus className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-slate-800 tracking-tight">Invitation Note</h3>
                                        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-tighter">Personalized note for the connection request (Max 300 chars)</p>
                                    </div>
                                </div>
                                <div className={`text-xs font-black ${connectionNoteContent.length > 280 ? 'text-orange-500' : 'text-slate-400'}`}>
                                    {connectionNoteContent.length}/300
                                </div>
                            </div>
                            <div className="relative group">
                                <textarea
                                    value={connectionNoteContent}
                                    onChange={(e) => setConnectionNoteContent(e.target.value.substring(0, 300))}
                                    placeholder="Hi {{first_name}}, I noticed your work and would love to connect!"
                                    className="w-full h-32 rounded-2xl border-2 border-slate-50 bg-slate-50/50 px-6 py-4 text-slate-900 font-bold placeholder:text-slate-300 focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-sm shadow-inner resize-none"
                                />
                                <div className="mt-3 flex gap-2">
                                    <VariableChip label="First Name" onClick={() => setConnectionNoteContent(prev => (prev + " {{first_name}}").substring(0, 300))} />
                                    <VariableChip label="Company" onClick={() => setConnectionNoteContent(prev => (prev + " {{company}}").substring(0, 300))} />
                                </div>
                            </div>
                        </div>
                        )}
                    </div>

                    {/* Right Column (Sidebar Settings - 5 cols) */}
                    <div className="lg:col-span-5 space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                        
                        {/* 3. Lead Acquisition */}
                        <div className="rounded-[40px] border border-slate-100 bg-white p-8 shadow-[0_15px_40px_-10px_rgb(0,0,0,0.06)] flex flex-col min-h-[600px] border-l-4 border-l-emerald-500">
                            <div className="mb-6 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="grid h-10 w-10 place-items-center rounded-2xl bg-emerald-500 text-white shadow-lg shadow-emerald-100">
                                        <UserPlus className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-slate-800 tracking-tight">Acquire Leads</h3>
                                        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-tighter">Choose how to source your contacts</p>
                                    </div>
                                </div>
                            </div>

                            {/* Method Tabs */}
                            <div className="flex bg-slate-100 p-1.5 rounded-[22px] mb-8">
                                <button 
                                    onClick={() => setLeadMethod('urls')} 
                                    className={`flex-1 py-3 text-xs font-black uppercase tracking-tight rounded-2xl transition-all ${leadMethod === 'urls' ? 'bg-white text-emerald-600 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
                                >
                                    Manual Entry
                                </button>
                                <button 
                                    onClick={() => setLeadMethod('csv')} 
                                    className={`flex-1 py-3 text-xs font-black uppercase tracking-tight rounded-2xl transition-all ${leadMethod === 'csv' ? 'bg-white text-emerald-600 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
                                >
                                    CSV Upload
                                </button>
                                <button 
                                    onClick={() => setLeadMethod('social')} 
                                    className={`flex-1 py-3 text-xs font-black uppercase tracking-tight rounded-2xl transition-all ${leadMethod === 'social' ? 'bg-white text-emerald-600 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
                                >
                                    Scraper
                                </button>
                            </div>

                            <div className="flex-1 flex flex-col">
                                {leadMethod === 'urls' && (
                                    <>
                                        <div className="mb-4 p-4 bg-emerald-50 rounded-2xl flex items-start gap-3">
                                            <Info size={16} className="text-emerald-500 mt-0.5 shrink-0" />
                                            <p className="text-[11px] font-bold text-emerald-700 leading-tight">Paste a list of LinkedIn/Email addresses here. Format: one per line.</p>
                                        </div>
                                        <textarea
                                            value={prospects}
                                            onChange={(e) => setProspects(e.target.value)}
                                            className="flex-1 w-full rounded-[24px] border-2 border-slate-50 bg-slate-50/20 p-6 text-slate-900 font-bold text-xs focus:outline-none focus:border-emerald-500 focus:bg-white transition-all resize-none shadow-inner"
                                            placeholder="https://www.linkedin.com/in/john-doe&#10;https://www.linkedin.com/in/jane-smith"
                                        />
                                        <button className="mt-4 w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-[20px] font-black text-xs uppercase tracking-widest shadow-lg shadow-emerald-100 transition-all">Import manual list</button>
                                    </>
                                )}

                                {leadMethod === 'csv' && (
                                    <div className="p-4 border-2 border-dashed border-slate-200 rounded-[32px] flex-1 flex flex-center items-center justify-center bg-slate-50/50">
                                        <CSVImport 
                                            campaignName={campaignName}
                                            onSuccess={() => {
                                                router.push("/dashboard/campaigns");
                                                toast.success("CSV Import complete. Campaign created!");
                                            }}
                                        />
                                    </div>
                                )}

                                {leadMethod === 'manual' && <ManualLeadEntry />}

                                {leadMethod === 'social' && (
                                    <div className="space-y-4">
                                        <div className="flex gap-1.5 p-1 bg-slate-100 rounded-xl">
                                            {['standard', 'salesnav', 'groups', 'post'].map(sub => (
                                                <button 
                                                    key={sub}
                                                    onClick={() => setSocialSubMethod(sub as any)} 
                                                    className={`flex-1 py-2 text-[10px] font-black uppercase rounded-lg transition-all ${socialSubMethod === sub ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400'}`}
                                                >
                                                    {sub === 'standard' ? 'Linkedin' : sub}
                                                </button>
                                            ))}
                                        </div>
                                        
                                        <div className="mt-4 animate-in fade-in zoom-in-95 duration-300">
                                            {socialSubMethod === 'standard' && <StandardSearch orgId={selectedOrgId!} campaignName={campaignName} />}
                                            {socialSubMethod === 'salesnav' && <SalesNavigator orgId={selectedOrgId!} campaignName={campaignName} />}
                                            {socialSubMethod === 'groups' && <LinkedInGroups orgId={selectedOrgId!} campaignName={campaignName} />}
                                            {socialSubMethod === 'post' && <PostEngagement orgId={selectedOrgId!} campaignName={campaignName} />}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* 4. Infrastructure Mode */}
                        <div className="rounded-[32px] border border-slate-100 bg-white p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                            <div className="mb-6 flex items-center gap-3">
                                <div className="grid h-10 w-10 place-items-center rounded-2xl bg-slate-800 text-white">
                                    <Send className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-slate-800 tracking-tight">Infrastructure Mode</h3>
                                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-tighter">Choose how this campaign is executed</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <ModeCard 
                                    active={sendMethod === 'extension'} 
                                    onClick={() => setSendMethod('extension')}
                                    title="Robot Mode"
                                    desc="Uses browser extension (1.1x speed)"
                                    color="emerald"
                                />
                                <ModeCard 
                                    active={sendMethod === 'api'} 
                                    onClick={() => setSendMethod('api')}
                                    title="Turbo Mode"
                                    desc="Direct API sending (5x speed)"
                                    color="blue"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 5px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #e2e8f0;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #cbd5e1;
                }
                [contenteditable]:empty:before {
                    content: attr(placeholder);
                    color: #cbd5e1;
                    pointer-events: none;
                    display: block;
                }
                [contenteditable] {
                    outline: none;
                }
                [contenteditable] b, [contenteditable] strong {
                    font-weight: 800;
                }
                [contenteditable] i, [contenteditable] em {
                    font-style: italic;
                }
                [contenteditable] u {
                    text-decoration: underline;
                }
                [contenteditable] ul {
                    list-style-type: disc;
                    margin-left: 1.5rem;
                    margin-top: 0.5rem;
                    margin-bottom: 0.5rem;
                }
                [contenteditable] ol {
                    list-style-type: decimal;
                    margin-left: 1.5rem;
                    margin-top: 0.5rem;
                    margin-bottom: 0.5rem;
                }
                [contenteditable] a {
                    color: #2563eb;
                    text-decoration: underline;
                    font-weight: 600;
                }
            `}</style>
        </div>
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

function ModeCard({ active, onClick, title, desc, color }: any) {
    const activeStyles = color === 'emerald' ? "border-emerald-500 bg-emerald-50/50 text-emerald-900" : "border-blue-500 bg-blue-50/50 text-blue-900";
    return (
        <button
            onClick={onClick}
            className={`p-5 rounded-[22px] border-2 transition-all text-left ${active ? activeStyles : "border-slate-50 bg-slate-50 text-slate-400 hover:border-slate-100"}`}
        >
            <div className="flex items-center justify-between mb-1">
                <span className="font-black text-xs uppercase tracking-tight">{title}</span>
                {active && <CheckCircle2 size={16} />}
            </div>
            <p className="text-[10px] font-bold leading-tight opacity-70">{desc}</p>
        </button>
    );
}

function VariableChip({ label, onClick }: any) {
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

export default function CampaignCreationPage() {
    return (
        <Suspense fallback={<div className="flex h-full w-full items-center justify-center bg-background"><Loader2 className="h-8 w-8 animate-spin text-blue-500" /></div>}>
            <CampaignCreationContent />
        </Suspense>
    );
}
