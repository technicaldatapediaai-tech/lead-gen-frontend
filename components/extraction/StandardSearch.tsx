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
    LayoutGrid, 
    ChevronDown, 
    Zap,
    Loader2,
    Link as LinkIcon,
    Play,
    ShieldCheck
} from "lucide-react";

export default function StandardSearch() {
    const [isLoading, setIsLoading] = useState(false);
    const [mode, setMode] = useState<"search" | "link">("link");
    const [url, setUrl] = useState("");
    const [keywords, setKeywords] = useState("");
    const [jobTitle, setJobTitle] = useState("");
    const [location, setLocation] = useState("");
    const [industry, setIndustry] = useState("");
    
    const handleAction = () => {
        setIsLoading(true);
        if (mode === 'link') {
            if (!url) {
                toast.error("Please enter a LinkedIn search URL");
                setIsLoading(false);
                return;
            }
            window.open(url, '_blank');
            toast.info("Opening LinkedIn Search. Use the sidebar to sync leads.");
        } else {
            let searchQuery = keywords;
            if (jobTitle) searchQuery += ` "${jobTitle}"`;
            if (location) searchQuery += ` "${location}"`;
            if (industry) searchQuery += ` "${industry}"`;
            const searchUrl = `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(searchQuery)}&origin=GLOBAL_SEARCH_HEADER`;
            window.open(searchUrl, '_blank');
            toast.info("LinkedIn search opened. Use the Lead Genius sidebar to sync leads.");
        }
        setIsLoading(false);
    };

    return (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm transition-colors">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <span className="text-blue-500">
                        <Filter className="h-4 w-4" />
                    </span>
                    LinkedIn Extraction
                </div>
                <div className="flex gap-2 p-1 bg-muted rounded-xl">
                    <button 
                        onClick={() => setMode("link")}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${mode === 'link' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground'}`}
                    >
                        Paste Link
                    </button>
                    <button 
                        onClick={() => setMode("search")}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${mode === 'search' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground'}`}
                    >
                        Search Form
                    </button>
                </div>
            </div>

            <div className="grid gap-4">
                {mode === 'link' ? (
                    <div>
                        <label className="mb-2 block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            LinkedIn Search URL
                        </label>
                        <div className="flex items-center gap-3 rounded-xl border border-input bg-card/50 px-4 py-3 transition focus-within:ring-1 focus-within:ring-blue-500/50">
                            <LinkIcon className="h-4 w-4 text-muted-foreground" />
                            <Input
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                className="w-full bg-transparent border-none text-sm text-foreground outline-none placeholder:text-muted-foreground/70 focus-visible:ring-0 px-0"
                                placeholder="https://www.linkedin.com/search/results/people/?..."
                            />
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Keywords */}
                        <div>
                            <label className="mb-2 block text-xs font-semibold text-muted-foreground">Keywords / Boolean</label>
                            <div className="flex items-center gap-3 rounded-xl border border-input bg-card/50 px-4 py-3 transition focus-within:ring-1 focus-within:ring-blue-500/50">
                                <Input
                                    value={keywords}
                                    onChange={(e) => setKeywords(e.target.value)}
                                    className="w-full bg-transparent border-none text-sm text-foreground outline-none placeholder:text-muted-foreground/70 focus-visible:ring-0 px-0"
                                    placeholder={`e.g. ("SaaS" OR "Software") AND "Marketing"`}
                                />
                                <Code className="h-4 w-4 text-muted-foreground" />
                            </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <label className="block text-xs font-semibold text-muted-foreground">Job Title</label>
                                <div className="flex items-center gap-3 rounded-xl border border-input bg-card/50 px-4 py-3 transition focus-within:ring-1 focus-within:ring-blue-500/50">
                                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                                    <Input value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} className="w-full bg-transparent border-none text-sm px-0 outline-none" placeholder="Marketing Director" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="block text-xs font-semibold text-muted-foreground">Location</label>
                                <div className="flex items-center gap-3 rounded-xl border border-input bg-card/50 px-4 py-3 transition focus-within:ring-1 focus-within:ring-blue-500/50">
                                    <MapPin className="h-4 w-4 text-muted-foreground" />
                                    <Input value={location} onChange={(e) => setLocation(e.target.value)} className="w-full bg-transparent border-none text-sm px-0 outline-none" placeholder="San Francisco" />
                                </div>
                            </div>
                        </div>
                    </>
                )}

                <div className="rounded-xl bg-blue-500/5 border border-blue-500/10 p-4">
                    <div className="flex gap-3">
                        <ShieldCheck className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            {mode === 'link' ? "Directly paste a filtered LinkedIn search. The extension will automatically recognize the profiles for extraction." : "Use advanced Boolean search to find high-precision leads."}
                        </p>
                    </div>
                </div>

                <div className="mt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Zap className="h-3 w-3 text-amber-500" />
                        Live Enrichment Active
                    </div>

                    <Button 
                        onClick={handleAction}
                        disabled={isLoading || (mode === 'link' ? !url : !keywords)}
                        className="bg-blue-600 hover:bg-blue-500 text-white px-8 h-11 rounded-xl"
                    >
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : (mode === 'link' ? <Play className="h-4 w-4 mr-2" /> : <Search className="h-4 w-4 mr-2" />)}
                        {mode === 'link' ? 'Scrape From Link' : 'Generate Search'}
                    </Button>
                </div>
            </div>
        </div>
    );
}
