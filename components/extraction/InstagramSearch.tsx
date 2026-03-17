"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { 
    Instagram, 
    Search, 
    Link as LinkIcon,
    Hash,
    MapPin,
    Zap,
    Loader2,
    Play,
    ShieldCheck
} from "lucide-react";

export default function InstagramSearch() {
    const [isLoading, setIsLoading] = useState(false);
    const [mode, setMode] = useState<"link" | "search">("link");
    const [url, setUrl] = useState("");
    const [hashtags, setHashtags] = useState("");
    const [location, setLocation] = useState("");
    const [keywords, setKeywords] = useState("");
    
    const handleAction = () => {
        setIsLoading(true);
        if (mode === 'link') {
            if (!url) {
                toast.error("Please enter an Instagram URL");
                setIsLoading(false);
                return;
            }
            window.open(url, '_blank');
            toast.info("Opening Instagram page. Use the sidebar to extract profile data or post likers.");
        } else {
            let searchQuery = keywords;
            if (hashtags) searchQuery += ` #${hashtags.replace('#', '')}`;
            if (location) searchQuery += ` in ${location}`;
            const searchUrl = `https://www.google.com/search?q=site:instagram.com ${encodeURIComponent(searchQuery)}`;
            window.open(searchUrl, '_blank');
            toast.info("Instagram search results opened via Google for targeted extraction.");
        }
        setIsLoading(false);
    };

    return (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm transition-colors">
            <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-pink-500/10 text-pink-500 flex items-center justify-center">
                    <Instagram className="h-6 w-6" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-foreground">Instagram Scraper</h2>
                    <p className="text-xs text-muted-foreground">Source leads from profiles, tags, or locations</p>
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
                    Lead Discovery
                </button>
            </div>

            <div className="grid gap-4">
                {mode === 'link' ? (
                    <div>
                        <label className="mb-2 block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            Instagram Profile or Post URL
                        </label>
                        <div className="flex items-center gap-3 rounded-xl border border-input bg-card/50 px-4 py-3 transition focus-within:ring-1 focus-within:ring-pink-500/50">
                            <LinkIcon className="h-4 w-4 text-muted-foreground" />
                            <Input
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                className="w-full bg-transparent border-none text-sm text-foreground outline-none placeholder:text-muted-foreground/70 focus-visible:ring-0 px-0"
                                placeholder="https://www.instagram.com/p/..."
                            />
                        </div>
                    </div>
                ) : (
                    <>
                        <div>
                            <label className="mb-2 block text-xs font-semibold text-muted-foreground">Profile Keywords</label>
                            <div className="flex items-center gap-3 rounded-xl border border-input bg-card/50 px-4 py-3 transition focus-within:ring-1 focus-within:ring-pink-500/50">
                                <Search className="h-4 w-4 text-muted-foreground" />
                                <Input
                                    value={keywords}
                                    onChange={(e) => setKeywords(e.target.value)}
                                    className="w-full bg-transparent border-none text-sm text-foreground outline-none placeholder:text-muted-foreground/70 focus-visible:ring-0 px-0"
                                    placeholder="e.g. Fitness Coach"
                                />
                            </div>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <label className="block text-xs font-semibold text-muted-foreground">Tags</label>
                                <div className="flex items-center gap-3 rounded-xl border border-input bg-card/50 px-4 py-3">
                                    <Hash className="h-4 w-4 text-muted-foreground" />
                                    <Input
                                        value={hashtags}
                                        onChange={(e) => setHashtags(e.target.value)}
                                        className="w-full bg-transparent border-none text-sm outline-none px-0"
                                        placeholder="startup"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="block text-xs font-semibold text-muted-foreground">Location</label>
                                <div className="flex items-center gap-3 rounded-xl border border-input bg-card/50 px-4 py-3">
                                    <MapPin className="h-4 w-4 text-muted-foreground" />
                                    <Input
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                        className="w-full bg-transparent border-none text-sm outline-none px-0"
                                        placeholder="New York"
                                    />
                                </div>
                            </div>
                        </div>
                    </>
                )}

                <div className="rounded-xl bg-pink-500/5 border border-pink-500/10 p-4">
                    <div className="flex gap-3">
                        <ShieldCheck className="h-4 w-4 text-pink-500 shrink-0 mt-0.5" />
                        <div className="text-xs leading-relaxed text-muted-foreground">
                            {mode === 'link' ? "Paste a link to a profile or post. The extension will help you scrape account details or engagement data." : "Discover public profiles matching your niche. Use specific keywords for better results."}
                        </div>
                    </div>
                </div>

                <div className="mt-2 flex justify-end">
                    <Button 
                        onClick={handleAction}
                        disabled={isLoading || (mode === 'link' ? !url : !keywords)}
                        className="bg-pink-600 hover:bg-pink-500 text-white px-8"
                    >
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : (
                            <>
                                {mode === 'link' ? <Play className="h-4 w-4 mr-2" /> : <Instagram className="h-4 w-4 mr-2" />}
                                {mode === 'link' ? 'Open & Scrape' : 'Find Instagram Leads'}
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}
