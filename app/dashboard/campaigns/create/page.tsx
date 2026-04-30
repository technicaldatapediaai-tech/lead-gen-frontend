"use client";

import React, { useState, useRef, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { 
    X, Rocket, UserPlus, Type, Send, Loader2, Sparkles, MessageSquare, 
    CheckCircle2, Upload, Search, Users, ThumbsUp, ClipboardList, 
    Bold, Italic, Link as LinkIcon, Type as TypeIcon, Info, Underline, 
    Strikethrough, List, ListOrdered, AlignLeft, AlignCenter, AlignRight, 
    AlignJustify, Baseline, Highlighter, ChevronDown, Eye, ArrowLeft,
    Chrome, Cloud, Compass
} from "lucide-react";
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

function Card({ className, children }: any) {
  return (
     <div className={`rounded-xl border bg-card text-card-foreground shadow-sm ${className || ''}`}>
        {children}
     </div>
  );
}

function SectionHeading({ title, description, icon: Icon }: any) {
  return (
    <div className="flex items-start gap-4 mb-6">
      <div className="rounded-md border p-2 bg-muted/50">
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <div>
        <h3 className="text-base font-semibold tracking-tight">{title}</h3>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

function ToolbarButton({ onClick, icon, active, small, title }: any) {
    return (
        <button
            type="button"
            title={title}
            onClick={onClick}
            onMouseDown={(e) => e.preventDefault()}
            className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-muted hover:text-accent-foreground ${small ? "h-6 w-6" : "h-8 w-8"} ${active ? "bg-muted text-foreground" : "text-muted-foreground"}`}
        >
            {icon}
        </button>
    );
}

function VariableChip({ label, onClick }: any) {
    return (
        <button
            type="button"
            onClick={onClick}
            onMouseDown={(e) => e.preventDefault()}
            className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 hover:bg-muted bg-transparent text-foreground"
        >
            +{label}
        </button>
    );
}

function ModeCard({ active, onClick, title, desc, icon: Icon }: any) {
    return (
        <div
            onClick={onClick}
            className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 cursor-pointer transition-all ${active ? "border-primary bg-primary/5 text-primary" : "border-muted bg-transparent text-muted-foreground hover:border-primary/50"}`}
        >
            <Icon className="mb-2 h-5 w-5" />
            <h4 className="text-sm font-semibold">{title}</h4>
            <p className="text-xs text-center mt-1 opacity-80">{desc}</p>
        </div>
    );
}

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
        <div className="flex h-full w-full flex-col bg-background text-foreground transition-colors duration-300">
            {/* Header */}
            <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/campaigns" className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-input bg-transparent hover:bg-muted hover:text-foreground text-muted-foreground transition-colors">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                    <div>
                        <h1 className="text-lg font-semibold tracking-tight">Create Campaign</h1>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleLaunch}
                        disabled={isLaunching}
                        className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                    >
                        {isLaunching ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Rocket className="mr-2 h-4 w-4" />}
                        Launch Campaign
                    </button>
                </div>
            </header>

            <main className="flex-1 overflow-y-auto bg-muted/20 p-6 md:p-8">
                <div className="mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    
                    {/* Left Column (Main Form - 2 cols) */}
                    <div className="lg:col-span-2 space-y-6">
                        
                        {/* 1. Campaign Identity */}
                        <Card className="p-6">
                            <SectionHeading title="Campaign Basics" description="Identify your campaign run" icon={TypeIcon} />
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none text-foreground">Campaign Name</label>
                                <input
                                    type="text"
                                    value={campaignName}
                                    onChange={(e) => setCampaignName(e.target.value)}
                                    placeholder="e.g. Q1 Growth Outreach"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                />
                            </div>
                        </Card>

                        {/* 2. Message Composer */}
                        <Card className="flex flex-col overflow-hidden">
                            <div className="p-6 pb-4">
                                <SectionHeading title="Message Template" description="Draft and personalize your outreach" icon={MessageSquare} />
                            </div>
                            
                            {/* Toolbar */}
                            <div className="border-y bg-muted/30 p-2 px-6 flex items-center gap-1 flex-wrap">
                                <ToolbarButton icon={<Bold size={14} />} onClick={() => execCommand('bold')} title="Bold" />
                                <ToolbarButton icon={<Italic size={14} />} onClick={() => execCommand('italic')} title="Italic" />
                                <ToolbarButton icon={<Underline size={14} />} onClick={() => execCommand('underline')} title="Underline" />
                                <div className="w-px h-4 bg-border mx-2" />
                                <ToolbarButton icon={<List size={14} />} onClick={() => execCommand('insertUnorderedList')} title="Bullet List" />
                                <ToolbarButton icon={<ListOrdered size={14} />} onClick={() => execCommand('insertOrderedList')} title="Numbered List" />
                                <div className="w-px h-4 bg-border mx-2" />
                                <ToolbarButton icon={<LinkIcon size={14} />} onClick={handleAddLink} title="Add Link" />
                                <div className="flex-1" />
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-muted-foreground mr-1">Insert Variable:</span>
                                    <VariableChip label="First Name" onClick={() => insertVariable('first_name')} />
                                    <VariableChip label="Company" onClick={() => insertVariable('company')} />
                                </div>
                            </div>

                            <div className="p-6">
                                <div
                                    ref={editorRef}
                                    contentEditable
                                    onInput={(e) => setMessageContent(e.currentTarget.innerHTML)}
                                    className="min-h-[250px] w-full resize-none rounded-md bg-transparent text-sm focus-visible:outline-none prose prose-sm max-w-none text-foreground outline-none"
                                    dangerouslySetInnerHTML={{ __html: messageContent }}
                                />
                            </div>
                            
                            {/* Preview */}
                            <div className="border-t bg-muted/10 p-6">
                                <h4 className="text-sm font-medium flex items-center gap-2 text-muted-foreground mb-4">
                                    <Eye className="h-4 w-4" /> Message Preview
                                </h4>
                                <div className="p-4 rounded-md border bg-background text-sm text-foreground prose prose-sm max-w-none shadow-sm"
                                     dangerouslySetInnerHTML={{ 
                                         __html: messageContent
                                             .replace(/\{\{first_name\}\}/g, '<span class="text-primary font-semibold">Jordan</span>')
                                             .replace(/\{\{company\}\}/g, '<span class="text-primary font-semibold">Acme Corp</span>')
                                             .replace(/\n/g, '<br/>')
                                     }}
                                />
                            </div>
                        </Card>

                        {/* 2b. Connection Note (Conditional) */}
                        {templateParam.includes('invitation') && (
                            <Card className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <SectionHeading title="Connection Note" description="Sent alongside connection invitation" icon={UserPlus} />
                                    <span className={`text-xs ${connectionNoteContent.length > 280 ? 'text-destructive' : 'text-muted-foreground'}`}>
                                        {connectionNoteContent.length}/300
                                    </span>
                                </div>
                                <textarea
                                    value={connectionNoteContent}
                                    onChange={(e) => setConnectionNoteContent(e.target.value.substring(0, 300))}
                                    placeholder="Hi {{first_name}}, I noticed your work and would love to connect!"
                                    className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none mb-3"
                                />
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-muted-foreground mr-1">Insert Variable:</span>
                                    <VariableChip label="First Name" onClick={() => setConnectionNoteContent(prev => (prev + " {{first_name}}").substring(0, 300))} />
                                    <VariableChip label="Company" onClick={() => setConnectionNoteContent(prev => (prev + " {{company}}").substring(0, 300))} />
                                </div>
                            </Card>
                        )}
                    </div>

                    {/* Right Column (Sidebar Settings - 1 col) */}
                    <div className="lg:col-span-1 space-y-6">
                        
                        {/* 3. Lead Acquisition */}
                        <Card className="p-6">
                            <SectionHeading title="Audience Sources" description="How to find your contacts" icon={Users} />
                            
                            {/* Method Tabs */}
                            <div className="grid grid-cols-3 gap-1 p-1 rounded-md bg-muted mb-6">
                                {[
                                    { id: 'urls', label: 'Manual' },
                                    { id: 'csv', label: 'CSV' },
                                    { id: 'social', label: 'Scraper' }
                                ].map(tab => (
                                    <button 
                                        key={tab.id}
                                        onClick={() => setLeadMethod(tab.id as any)} 
                                        className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-xs font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${leadMethod === tab.id ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:bg-muted-foreground/10'}`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>

                            <div className="min-h-[300px]">
                                {leadMethod === 'urls' && (
                                    <div className="space-y-4">
                                        <p className="text-sm text-muted-foreground">Paste LinkedIn URLs below, one per line.</p>
                                        <textarea
                                            value={prospects}
                                            onChange={(e) => setProspects(e.target.value)}
                                            className="flex min-h-[250px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none whitespace-pre"
                                            placeholder="https://www.linkedin.com/in/johndoe&#10;https://www.linkedin.com/in/janesmith"
                                        />
                                    </div>
                                )}

                                {leadMethod === 'csv' && (
                                    <div className="rounded-md border border-dashed p-4 flex items-center justify-center text-center">
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
                                        <label className="text-sm font-medium text-foreground">Scraping Source</label>
                                        <select 
                                            value={socialSubMethod}
                                            onChange={(e) => setSocialSubMethod(e.target.value as any)}
                                            className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                                        >
                                            <option value="standard">LinkedIn Standard</option>
                                            <option value="salesnav">Sales Navigator</option>
                                            <option value="groups">LinkedIn Groups</option>
                                            <option value="post">Post Engagement</option>
                                        </select>
                                        
                                        <div className="pt-4">
                                            {socialSubMethod === 'standard' && <StandardSearch orgId={selectedOrgId!} campaignName={campaignName} />}
                                            {socialSubMethod === 'salesnav' && <SalesNavigator orgId={selectedOrgId!} campaignName={campaignName} />}
                                            {socialSubMethod === 'groups' && <LinkedInGroups orgId={selectedOrgId!} campaignName={campaignName} />}
                                            {socialSubMethod === 'post' && <PostEngagement orgId={selectedOrgId!} campaignName={campaignName} />}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </Card>

                        {/* 4. Execution Mode */}
                        <Card className="p-6">
                            <SectionHeading title="Execution Mode" description="Choose how this campaign runs" icon={Send} />
                            <div className="grid grid-cols-2 gap-3">
                                <ModeCard 
                                    active={sendMethod === 'extension'} 
                                    onClick={() => setSendMethod('extension')}
                                    title="Local Ext."
                                    desc="Uses browser"
                                    icon={Chrome}
                                />
                                <ModeCard 
                                    active={sendMethod === 'api'} 
                                    onClick={() => setSendMethod('api')}
                                    title="Cloud API"
                                    desc="Fast delivery"
                                    icon={Cloud}
                                />
                            </div>
                        </Card>
                    </div>
                </div>
            </main>

            <style jsx global>{`
                [contenteditable]:empty:before {
                    content: attr(placeholder);
                    color: hsl(var(--muted-foreground));
                    pointer-events: none;
                    display: block;
                }
                [contenteditable] {
                    outline: none;
                }
                [contenteditable] b, [contenteditable] strong {
                    font-weight: 700;
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
                    color: hsl(var(--primary));
                    text-decoration: underline;
                }
            `}</style>
        </div>
    );
}

export default function CampaignCreationPage() {
    return (
        <Suspense fallback={<div className="flex h-full w-full items-center justify-center bg-background"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
            <CampaignCreationContent />
        </Suspense>
    );
}
