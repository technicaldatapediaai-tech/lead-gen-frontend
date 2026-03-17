"use client";

import React, { useState } from "react";
import { Search, Link as LinkIcon, Loader2, Play, Twitter, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function TwitterSearch() {
    const [target, setTarget] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [mode, setMode] = useState<"search" | "link">("link");

    const handleAction = () => {
        if (!target) {
            toast.error(`Please enter a ${mode === 'search' ? 'search query' : 'Twitter URL'}`);
            return;
        }
        
        setIsLoading(true);
        let url = target;
        if (mode === 'search') {
            url = `https://twitter.com/search?q=${encodeURIComponent(target)}&f=user`;
        }
        
        window.open(url, '_blank');
        toast.info(mode === 'search' ? "Opening Twitter search results." : "Opening Twitter profile/list.");
        setIsLoading(false);
    };

    return (
        <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
            <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-sky-500/10 text-sky-500 flex items-center justify-center">
                    <Twitter className="h-6 w-6" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-foreground">Twitter / X Scraper</h2>
                    <p className="text-xs text-muted-foreground">Source leads from Twitter searches, profiles, or follower lists</p>
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
                    User Search
                </button>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="mb-2 block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        {mode === 'link' ? 'Twitter Profile/List URL' : 'Search Keywords'}
                    </label>
                    <div className="flex items-center gap-3 rounded-xl border border-input bg-card/50 px-4 py-3 transition focus-within:ring-1 focus-within:ring-sky-500/50">
                        {mode === 'link' ? <LinkIcon className="h-4 w-4 text-muted-foreground" /> : <Search className="h-4 w-4 text-muted-foreground" />}
                        <Input
                            value={target}
                            onChange={(e) => setTarget(e.target.value)}
                            className="w-full bg-transparent border-none text-sm text-foreground outline-none placeholder:text-muted-foreground/70 focus-visible:ring-0 px-0"
                            placeholder={mode === 'link' ? "https://twitter.com/elonmusk" : "e.g. Marketing Managers in London"}
                        />
                    </div>
                </div>

                <div className="rounded-xl bg-sky-500/5 border border-sky-500/10 p-4">
                    <div className="flex gap-3">
                        <ShieldCheck className="h-4 w-4 text-sky-500 shrink-0 mt-0.5" />
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            Open the page and use the extension to extract bios, followers, or search results directly into your lead list.
                        </p>
                    </div>
                </div>

                <div className="flex justify-end pt-2">
                    <Button 
                        onClick={handleAction}
                        disabled={isLoading || !target}
                        className="bg-sky-500 hover:bg-sky-400 text-white px-8 h-11 rounded-xl shadow-lg shadow-sky-500/20"
                    >
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4 mr-2" />}
                        {mode === 'link' ? 'Open & Scrape' : 'Search Twitter'}
                    </Button>
                </div>
            </div>
        </div>
    );
}
