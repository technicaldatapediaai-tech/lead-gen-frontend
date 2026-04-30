"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { 
    Search, 
    Filter, 
    Code, 
    Briefcase, 
    MapPin, 
    Zap,
    Loader2,
    Link as LinkIcon,
    Play,
    ShieldCheck
} from "lucide-react";

import { api } from "@/lib/api";

export default function StandardSearch({ orgId, campaignName }: { orgId: string, campaignName: string }) {
    const [isLoading, setIsLoading] = useState(false);
    const [mode, setMode] = useState<"search" | "link">("link");
    const [url, setUrl] = useState("");
    const [keywords, setKeywords] = useState("");
    const [jobTitle, setJobTitle] = useState("");
    const [location, setLocation] = useState("");
    const [industry, setIndustry] = useState("");
    
    const handleAction = async () => {
        setIsLoading(true);
        try {
            if (mode === 'link') {
                if (!url) {
                    toast.error("Please enter a LinkedIn search URL");
                    setIsLoading(false);
                    return;
                }
                
                toast.loading("Starting LinkedIn search extraction...");
                const { data, error } = await api.post("/ingest/analysis/", {
                    post_urls: [url],
                    org_id: orgId,
                    campaign_name: campaignName || `LinkedIn Search ${new Date().toLocaleDateString()}`
                });

                if (error) {
                    toast.error(error.detail || "Failed to start extraction");
                } else {
                    toast.success("LinkedIn extraction started in background. Leads will appear in your CRM shortly.");
                }
            } else {
                let searchQuery = keywords;
                if (jobTitle) searchQuery += ` "${jobTitle}"`;
                if (location) searchQuery += ` "${location}"`;
                if (industry) searchQuery += ` "${industry}"`;
                const searchUrl = `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(searchQuery)}&origin=GLOBAL_SEARCH_HEADER`;
                window.open(searchUrl, '_blank');
                toast.info("LinkedIn search results opened. You can copy the browser URL and paste it in 'Link' mode for automated scraping.");
            }
        } catch (err) {
            toast.error("An unexpected error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="rounded-md border bg-card p-5 shadow-sm text-left">
            <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <div className="rounded-md border p-1 border-primary/20 bg-primary/10">
                        <Filter className="h-4 w-4 text-primary" />
                    </div>
                    LinkedIn Extraction
                </div>
                <div className="flex gap-1 p-1 bg-muted rounded-md shrink-0">
                    <button 
                        onClick={() => setMode("link")}
                        className={`px-3 py-1 text-xs font-medium rounded-sm transition ${mode === 'link' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:bg-muted-foreground/10'}`}
                    >
                        Paste Link
                    </button>
                    <button 
                        onClick={() => setMode("search")}
                        className={`px-3 py-1 text-xs font-medium rounded-sm transition ${mode === 'search' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:bg-muted-foreground/10'}`}
                    >
                        Search Form
                    </button>
                </div>
            </div>

            <div className="grid gap-4">
                {mode === 'link' ? (
                    <div>
                        <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">
                            LINKEDIN SEARCH URL
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <LinkIcon className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <Input
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                className="pl-9 h-9 w-full bg-background text-sm"
                                placeholder="https://www.linkedin.com/search/results/people..."
                            />
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Keywords */}
                        <div>
                            <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">
                                KEYWORDS / BOOLEAN
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Code className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <Input
                                    value={keywords}
                                    onChange={(e) => setKeywords(e.target.value)}
                                    className="pl-9 h-9 w-full bg-background text-sm"
                                    placeholder={`e.g. ("SaaS" OR "Software") AND "Marketing"`}
                                />
                            </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">
                                    JOB TITLE
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                    <Input 
                                        value={jobTitle} 
                                        onChange={(e) => setJobTitle(e.target.value)} 
                                        className="pl-9 h-9 w-full bg-background text-sm" 
                                        placeholder="Marketing Director" 
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">
                                    LOCATION
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <MapPin className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                    <Input 
                                        value={location} 
                                        onChange={(e) => setLocation(e.target.value)} 
                                        className="pl-9 h-9 w-full bg-background text-sm" 
                                        placeholder="San Francisco" 
                                    />
                                </div>
                            </div>
                        </div>
                    </>
                )}

                <div className="rounded-md bg-muted/40 border p-3 flex gap-3">
                    <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
                    <p className="text-xs text-muted-foreground leading-relaxed">
                        {mode === 'link' 
                            ? "Directly paste a filtered LinkedIn search. The extension will automatically recognize the profiles for extraction." 
                            : "Use advanced Boolean search to organically find high-precision leads."}
                    </p>
                </div>

                <div className="mt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                        <Zap className="h-3 w-3 text-amber-500" />
                        Live Enrichment Active
                    </div>

                    <Button 
                        onClick={handleAction}
                        disabled={isLoading || (mode === 'link' ? !url : !keywords)}
                        className="w-full sm:w-auto h-9"
                        size="sm"
                    >
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : (mode === 'link' ? <Play className="h-4 w-4 mr-2" /> : <Search className="h-4 w-4 mr-2" />)}
                        {mode === 'link' ? 'Scrape From Link' : 'Generate Search'}
                    </Button>
                </div>
            </div>
        </div>
    );
}
