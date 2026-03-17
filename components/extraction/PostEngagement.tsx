"use client";

import React, { useState } from "react";
import { ThumbsUp, Link as LinkIcon, Loader2, Play, ExternalLink, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function PostEngagement() {
    const [postUrl, setPostUrl] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [platform, setPlatform] = useState<"linkedin" | "twitter">("linkedin");

    const handleScrape = () => {
        if (!postUrl) {
            toast.error("Please enter a post URL");
            return;
        }
        
        setIsLoading(true);
        window.open(postUrl, '_blank');
        toast.info("Opening post page. Use the Lead Genius sidebar to extract engaged users (likes/comments).");
        setIsLoading(false);
    };

    return (
        <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
            <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-purple-600/10 text-purple-600 flex items-center justify-center">
                    <ThumbsUp className="h-6 w-6" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-foreground">Post Engagement Scraper</h2>
                    <p className="text-xs text-muted-foreground">Extract leads who liked or commented on specific posts</p>
                </div>
            </div>

            <div className="flex gap-2 p-1 bg-muted rounded-xl mb-6">
                <button 
                    onClick={() => setPlatform("linkedin")}
                    className={`flex-1 py-2 text-xs font-semibold rounded-lg transition ${platform === 'linkedin' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground'}`}
                >
                    LinkedIn
                </button>
                <button 
                    onClick={() => setPlatform("twitter")}
                    className={`flex-1 py-2 text-xs font-semibold rounded-lg transition ${platform === 'twitter' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground'}`}
                >
                    Twitter / X
                </button>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="mb-2 block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        {platform === 'linkedin' ? 'LinkedIn' : 'Twitter'} Post URL
                    </label>
                    <div className="flex items-center gap-3 rounded-xl border border-input bg-card/50 px-4 py-3 transition focus-within:ring-1 focus-within:ring-purple-500/50">
                        <LinkIcon className="h-4 w-4 text-muted-foreground" />
                        <Input
                            value={postUrl}
                            onChange={(e) => setPostUrl(e.target.value)}
                            className="w-full bg-transparent border-none text-sm text-foreground outline-none placeholder:text-muted-foreground/70 focus-visible:ring-0 px-0"
                            placeholder={platform === 'linkedin' ? "https://www.linkedin.com/posts/..." : "https://twitter.com/user/status/..."}
                        />
                    </div>
                </div>

                <div className="rounded-xl bg-purple-500/5 border border-purple-500/10 p-4">
                    <div className="flex gap-3">
                        <ShieldCheck className="h-4 w-4 text-purple-500 shrink-0 mt-0.5" />
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            Open the post and click on the <span className="font-bold text-foreground">"Reactions"</span> count or open the comments section. The sidebar will let you sync those leads instantly.
                        </p>
                    </div>
                </div>

                <div className="flex justify-end pt-2">
                    <Button 
                        onClick={handleScrape}
                        disabled={isLoading || !postUrl}
                        className="bg-purple-600 hover:bg-purple-500 text-white px-8 h-11 rounded-xl shadow-lg shadow-purple-500/20"
                    >
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4 mr-2" />}
                        Open Post & Scrape
                    </Button>
                </div>
            </div>
        </div>
    );
}
