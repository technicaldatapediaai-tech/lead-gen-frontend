"use client";

import React, { useState } from "react";
import { Compass, Link as LinkIcon, Loader2, Play, ExternalLink, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function SalesNavigator() {
    const [url, setUrl] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleAction = () => {
        if (!url) {
            toast.error("Please enter a Sales Navigator list or search URL");
            return;
        }
        
        setIsLoading(true);
        window.open(url, '_blank');
        toast.info("Opening Sales Navigator. Use the Lead Genius extension to start scraping the list.");
        setIsLoading(false);
    };

    return (
        <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
            <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-[#0077b5]/10 text-[#0077b5] flex items-center justify-center">
                    <Compass className="h-6 w-6" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-foreground">Sales Navigator Link Scrape</h2>
                    <p className="text-xs text-muted-foreground">Extract leads directly from your Sales Navigator lists or search result URLs</p>
                </div>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="mb-2 block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Sales Navigator URL
                    </label>
                    <div className="flex items-center gap-3 rounded-xl border border-input bg-card/50 px-4 py-3 transition focus-within:ring-1 focus-within:ring-[#0077b5]/50">
                        <LinkIcon className="h-4 w-4 text-muted-foreground" />
                        <Input
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            className="w-full bg-transparent border-none text-sm text-foreground outline-none placeholder:text-muted-foreground/70 focus-visible:ring-0 px-0"
                            placeholder="https://www.linkedin.com/sales/search/people?..."
                        />
                    </div>
                </div>

                <div className="rounded-xl bg-[#0077b5]/5 border border-[#0077b5]/10 p-4">
                    <div className="flex gap-3">
                        <ShieldCheck className="h-4 w-4 text-[#0077b5] shrink-0 mt-0.5" />
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            Once the link is opened, the extension will automatically detect the list or search results. Click <span className="font-bold text-foreground">"Sync List"</span> in the sidebar to extract all leads.
                        </p>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                    <button 
                        onClick={() => window.open('https://www.linkedin.com/sales', '_blank')}
                        className="text-xs font-medium text-[#0077b5] hover:underline flex items-center gap-1"
                    >
                        Go to Sales Navigator <ExternalLink size={12} />
                    </button>
                    
                    <Button 
                        onClick={handleAction}
                        disabled={isLoading || !url}
                        className="bg-[#0077b5] hover:bg-[#006396] text-white px-8 h-11 rounded-xl shadow-lg shadow-[#0077b5]/20"
                    >
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4 mr-2" />}
                        Open & Scrape
                    </Button>
                </div>
            </div>
        </div>
    );
}
