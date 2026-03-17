"use client";

import React, { useState } from "react";
import { Users, ExternalLink, ShieldCheck, Link as LinkIcon, Loader2, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function LinkedInGroups() {
    const [groupUrl, setGroupUrl] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleScrape = () => {
        if (!groupUrl.includes("linkedin.com/groups/")) {
            toast.error("Please enter a valid LinkedIn Group URL");
            return;
        }
        
        setIsLoading(true);
        // Open the URL and the sidebar will handle it
        window.open(groupUrl, '_blank');
        toast.info("Opening LinkedIn Group. Use the Lead Genius sidebar to start extraction.");
        setIsLoading(false);
    };

    return (
        <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
            <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-blue-600/10 text-blue-600 flex items-center justify-center">
                    <Users className="h-6 w-6" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-foreground">LinkedIn Groups Scraper</h2>
                    <p className="text-xs text-muted-foreground">Extract leads from specific LinkedIn groups by URL</p>
                </div>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="mb-2 block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        LinkedIn Group URL
                    </label>
                    <div className="flex items-center gap-3 rounded-xl border border-input bg-card/50 px-4 py-3 transition focus-within:ring-1 focus-within:ring-blue-500/50">
                        <LinkIcon className="h-4 w-4 text-muted-foreground" />
                        <Input
                            value={groupUrl}
                            onChange={(e) => setGroupUrl(e.target.value)}
                            className="w-full bg-transparent border-none text-sm text-foreground outline-none placeholder:text-muted-foreground/70 focus-visible:ring-0 px-0"
                            placeholder="https://www.linkedin.com/groups/1234567/"
                        />
                    </div>
                </div>

                <div className="rounded-xl bg-blue-500/5 border border-blue-500/10 p-4">
                    <div className="flex gap-3">
                        <ShieldCheck className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            Once the group page opens, navigate to the <span className="font-bold text-foreground">"Members"</span> tab. The Lead Genius extension will automatically detect the members for extraction.
                        </p>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                    <button 
                        onClick={() => window.open('https://www.linkedin.com/groups/', '_blank')}
                        className="text-xs font-medium text-blue-500 hover:underline flex items-center gap-1"
                    >
                        Browse Groups <ExternalLink size={12} />
                    </button>
                    
                    <Button 
                        onClick={handleScrape}
                        disabled={isLoading || !groupUrl}
                        className="bg-blue-600 hover:bg-blue-500 text-white px-8 h-11 rounded-xl shadow-lg shadow-blue-500/20"
                    >
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4 mr-2" />}
                        Start Scraping
                    </Button>
                </div>
            </div>
        </div>
    );
}
