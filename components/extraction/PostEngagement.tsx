"use client";

import React, { useState } from "react";
import { MessageSquare, ThumbsUp, ExternalLink, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PostEngagement() {
    const [platform, setPlatform] = useState<"linkedin" | "twitter">("linkedin");

    return (
        <div className="rounded-2xl border border-border bg-card p-12 text-center shadow-sm">
            <div className="mx-auto w-20 h-20 rounded-3xl bg-purple-600/10 text-purple-600 flex items-center justify-center mb-6">
                <ThumbsUp className="h-10 w-10" />
            </div>
            
            <h2 className="text-2xl font-bold text-foreground mb-3">Social Post Engagement</h2>
            <p className="text-muted-foreground max-w-md mx-auto mb-8">
                Extract leads who liked or commented on specific viral posts. Target users showing active interest in relevant topics.
            </p>

            <div className="flex justify-center gap-4 mb-8">
                <button 
                    onClick={() => setPlatform("linkedin")}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${platform === 'linkedin' ? 'bg-blue-600 text-white' : 'bg-muted text-muted-foreground hover:bg-accent'}`}
                >
                    LinkedIn
                </button>
                <button 
                    onClick={() => setPlatform("twitter")}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${platform === 'twitter' ? 'bg-blue-600 text-white' : 'bg-muted text-muted-foreground hover:bg-accent'}`}
                >
                    Twitter / X
                </button>
            </div>

            <div className="grid gap-6 md:grid-cols-3 max-w-2xl mx-auto mb-10">
                <div className="bg-muted/30 p-4 rounded-2xl border border-border">
                    <ThumbsUp className="h-5 w-5 text-purple-500 mx-auto mb-2" />
                    <div className="text-sm font-semibold">Likers Sync</div>
                </div>
                <div className="bg-muted/30 p-4 rounded-2xl border border-border">
                    <MessageSquare className="h-5 w-5 text-purple-500 mx-auto mb-2" />
                    <div className="text-sm font-semibold">Commenters</div>
                </div>
                <div className="bg-muted/30 p-4 rounded-2xl border border-border">
                    <ShieldCheck className="h-5 w-5 text-purple-500 mx-auto mb-2" />
                    <div className="text-sm font-semibold">1-Click Extract</div>
                </div>
            </div>

            <Button 
                onClick={() => window.open(platform === 'linkedin' ? 'https://www.linkedin.com/feed/' : 'https://twitter.com/home', '_blank')}
                className="bg-purple-600 hover:bg-purple-500 text-white px-8 h-12 rounded-xl shadow-lg shadow-purple-500/20"
            >
                Open {platform === 'linkedin' ? 'LinkedIn' : 'Twitter'}
                <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
            
            <p className="mt-6 text-xs text-muted-foreground">
                Paste a post URL in the browser and use the Lead Genius sidebar to extract engaged users.
            </p>
        </div>
    );
}
