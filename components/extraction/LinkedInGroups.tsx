"use client";

import React from "react";
import { Users, ExternalLink, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LinkedInGroups() {
    return (
        <div className="rounded-2xl border border-border bg-card p-12 text-center shadow-sm">
            <div className="mx-auto w-20 h-20 rounded-3xl bg-blue-600/10 text-blue-600 flex items-center justify-center mb-6">
                <Users className="h-10 w-10" />
            </div>
            
            <h2 className="text-2xl font-bold text-foreground mb-3">LinkedIn Groups Scraper</h2>
            <p className="text-muted-foreground max-w-md mx-auto mb-8">
                Extract high-intent leads from professional LinkedIn groups. Reach members of targeted industry communities.
            </p>

            <div className="grid gap-6 md:grid-cols-3 max-w-2xl mx-auto mb-10">
                <div className="bg-muted/30 p-4 rounded-2xl border border-border">
                    <ShieldCheck className="h-5 w-5 text-blue-500 mx-auto mb-2" />
                    <div className="text-sm font-semibold">Member Sync</div>
                </div>
                <div className="bg-muted/30 p-4 rounded-2xl border border-border">
                    <ShieldCheck className="h-5 w-5 text-blue-500 mx-auto mb-2" />
                    <div className="text-sm font-semibold">Intent Filters</div>
                </div>
                <div className="bg-muted/30 p-4 rounded-2xl border border-border">
                    <ShieldCheck className="h-5 w-5 text-blue-500 mx-auto mb-2" />
                    <div className="text-sm font-semibold">Auto-Connect</div>
                </div>
            </div>

            <Button 
                onClick={() => window.open('https://www.linkedin.com/groups/', '_blank')}
                className="bg-blue-600 hover:bg-blue-500 text-white px-8 h-12 rounded-xl shadow-lg shadow-blue-500/20"
            >
                Open LinkedIn Groups
                <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
            
            <p className="mt-6 text-xs text-muted-foreground">
                Requires Lead Genius Chrome Extension to be active on the group members page.
            </p>
        </div>
    );
}
