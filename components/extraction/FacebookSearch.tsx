"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { 
    Facebook, 
    Search, 
    Link as LinkIcon,
    Users, 
    Globe,
    Zap,
    Loader2,
    Play,
    ShieldCheck
} from "lucide-react";

export default function FacebookSearch() {
    const [isLoading, setIsLoading] = useState(false);
    const [mode, setMode] = useState<"link" | "search">("link");
    const [url, setUrl] = useState("");
    const [groupName, setGroupName] = useState("");
    const [keywords, setKeywords] = useState("");
    
    const handleAction = () => {
        setIsLoading(true);
        if (mode === 'link') {
            if (!url) {
                toast.error("Please enter a Facebook Group or Page URL");
                setIsLoading(false);
                return;
            }
            window.open(url, '_blank');
            toast.info("Opening Facebook page. Use the Lead Genius sidebar to extract members or participants.");
        } else {
            let searchUrl = "https://www.facebook.com/search/groups/?q=";
            if (groupName) {
                searchUrl += encodeURIComponent(groupName);
            } else if (keywords) {
                searchUrl += encodeURIComponent(keywords);
            }
            window.open(searchUrl, '_blank');
            toast.info("Facebook search results opened. Extract leads from public groups.");
        }
        setIsLoading(false);
    };

    return (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm transition-colors">
            <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-blue-600/10 text-blue-600 flex items-center justify-center">
                    <Facebook className="h-6 w-6" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-foreground">Facebook Scraper</h2>
                    <p className="text-xs text-muted-foreground">Source leads from groups, pages, or search results</p>
                </div>
            </div>

            <div className="flex gap-2 p-1 bg-muted rounded-xl mb-6">
                <button 
                    onClick={() => setMode("link")}
                    className={`flex-1 py-2 text-xs font-semibold rounded-lg transition ${mode === 'link' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground'}`}
                >
                    Paste Link
                </button>
                <button 
                    onClick={() => setMode("search")}
                    className={`flex-1 py-2 text-xs font-semibold rounded-lg transition ${mode === 'search' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground'}`}
                >
                    Group Discovery
                </button>
            </div>

            <div className="grid gap-4">
                {mode === 'link' ? (
                    <div>
                        <label className="mb-2 block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            Facebook Group or Page URL
                        </label>
                        <div className="flex items-center gap-3 rounded-xl border border-input bg-card/50 px-4 py-3 transition focus-within:ring-1 focus-within:ring-blue-600/50">
                            <LinkIcon className="h-4 w-4 text-muted-foreground" />
                            <Input
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                className="w-full bg-transparent border-none text-sm text-foreground outline-none placeholder:text-muted-foreground/70 focus-visible:ring-0 px-0"
                                placeholder="https://www.facebook.com/groups/..."
                            />
                        </div>
                    </div>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <label className="block text-xs font-semibold text-muted-foreground">Topics</label>
                            <div className="flex items-center gap-3 rounded-xl border border-input bg-card/50 px-4 py-3">
                                <Users className="h-4 w-4 text-muted-foreground" />
                                <Input
                                    value={groupName}
                                    onChange={(e) => setGroupName(e.target.value)}
                                    className="w-full bg-transparent border-none text-sm outline-none px-0"
                                    placeholder="Founders Network"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="block text-xs font-semibold text-muted-foreground">Role Keywords</label>
                            <div className="flex items-center gap-3 rounded-xl border border-input bg-card/50 px-4 py-3">
                                <Search className="h-4 w-4 text-muted-foreground" />
                                <Input
                                    value={keywords}
                                    onChange={(e) => setKeywords(e.target.value)}
                                    className="w-full bg-transparent border-none text-sm outline-none px-0"
                                    placeholder="CEO, Marketing"
                                />
                            </div>
                        </div>
                    </div>
                )}

                <div className="rounded-xl bg-blue-600/5 border border-blue-600/10 p-4">
                    <div className="flex gap-3">
                        <ShieldCheck className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                        <div className="text-xs leading-relaxed text-muted-foreground">
                            {mode === 'link' ? "Directly open a group or page. Navigation to the member list is required for the extension to sync data." : "Focus on public groups with visible participant lists for the best extraction results."}
                        </div>
                    </div>
                </div>

                <div className="mt-2 flex justify-end">
                    <Button 
                        onClick={handleAction}
                        disabled={isLoading || (mode === 'link' ? !url : (!groupName && !keywords))}
                        className="bg-blue-700 hover:bg-blue-600 text-white px-8"
                    >
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : (
                            <>
                                {mode === 'link' ? <Play className="h-4 w-4 mr-2" /> : <Facebook className="h-4 w-4 mr-2" />}
                                {mode === 'link' ? 'Open & Scrape' : 'Discover Facebook Leads'}
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}
