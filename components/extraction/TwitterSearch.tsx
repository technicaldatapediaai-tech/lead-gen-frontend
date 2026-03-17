"use client";

import React, { useState } from "react";
import { Search, ExternalLink, ShieldCheck, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function TwitterSearch() {
    const [query, setQuery] = useState("");

    const handleSearch = () => {
        const url = `https://twitter.com/search?q=${encodeURIComponent(query)}&f=user`;
        window.open(url, '_blank');
    };

    return (
        <div className="rounded-2xl border border-border bg-card p-12 text-center shadow-sm">
            <div className="mx-auto w-20 h-20 rounded-3xl bg-sky-500/10 text-sky-500 flex items-center justify-center mb-6">
                <Twitter className="h-10 w-10" />
            </div>
            
            <h2 className="text-2xl font-bold text-foreground mb-3">Twitter / X Search</h2>
            <p className="text-muted-foreground max-w-md mx-auto mb-8">
                Identify leads on Twitter using keywords, bios, and location. Extract profiles directly into your CRM.
            </p>

            <div className="max-w-md mx-auto mb-8">
                <div className="flex gap-2">
                    <Input 
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="e.g. SaaS Founder New York"
                        className="rounded-xl h-12"
                    />
                    <Button 
                        onClick={handleSearch}
                        className="bg-sky-500 hover:bg-sky-400 text-white h-12 px-6 rounded-xl"
                    >
                        <Search className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3 max-w-2xl mx-auto mb-10">
                <div className="bg-muted/30 p-4 rounded-2xl border border-border">
                    <ShieldCheck className="h-5 w-5 text-sky-500 mx-auto mb-2" />
                    <div className="text-sm font-semibold">User Scraping</div>
                </div>
                <div className="bg-muted/30 p-4 rounded-2xl border border-border">
                    <ShieldCheck className="h-5 w-5 text-sky-500 mx-auto mb-2" />
                    <div className="text-sm font-semibold">Bio Intelligence</div>
                </div>
                <div className="bg-muted/30 p-4 rounded-2xl border border-border">
                    <ShieldCheck className="h-5 w-5 text-sky-500 mx-auto mb-2" />
                    <div className="text-sm font-semibold">CRM Sync</div>
                </div>
            </div>
            
            <p className="mt-6 text-xs text-muted-foreground">
                Requires Lead Genius Chrome Extension to be active on Twitter search results.
            </p>
        </div>
    );
}
