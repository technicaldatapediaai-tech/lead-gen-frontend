"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { 
    Facebook, 
    Search, 
    Users, 
    LayoutGrid,
    Globe,
    Zap,
    Loader2
} from "lucide-react";

export default function FacebookSearch() {
    const [isLoading, setIsLoading] = useState(false);
    const [groupName, setGroupName] = useState("");
    const [keywords, setKeywords] = useState("");
    
    const handleSearch = () => {
        setIsLoading(true);
        
        let url = "https://www.facebook.com/search/groups/?q=";
        if (groupName) {
            url += encodeURIComponent(groupName);
        } else if (keywords) {
            url += encodeURIComponent(keywords);
        }
        
        window.open(url, '_blank');
        
        setIsLoading(false);
        toast.info("Facebook search opened. Focus on groups and public pages for the best lead data.");
    };

    return (
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm transition-colors">
            <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <span className="text-blue-600">
                        <Facebook className="h-4 w-4" />
                    </span>
                    Facebook Group & Page Discovery
                </div>
            </div>

            <div className="grid gap-4">
                {/* Keywords */}
                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                        <label className="block text-xs font-semibold text-muted-foreground">
                            Group/Page Topics
                        </label>
                        <div className="flex items-center gap-3 rounded-xl border border-input bg-card/50 px-4 py-3 transition focus-within:ring-1 focus-within:ring-blue-600/50">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <Input
                                value={groupName}
                                onChange={(e) => setGroupName(e.target.value)}
                                className="w-full bg-transparent border-none text-sm text-foreground outline-none placeholder:text-muted-foreground/70 focus-visible:ring-0 px-0"
                                placeholder="e.g. Founders Network"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-xs font-semibold text-muted-foreground">
                            Profile Keywords
                        </label>
                        <div className="flex items-center gap-3 rounded-xl border border-input bg-card/50 px-4 py-3 transition focus-within:ring-1 focus-within:ring-blue-600/50">
                            <Search className="h-4 w-4 text-muted-foreground" />
                            <Input
                                value={keywords}
                                onChange={(e) => setKeywords(e.target.value)}
                                className="w-full bg-transparent border-none text-sm text-foreground outline-none placeholder:text-muted-foreground/70 focus-visible:ring-0 px-0"
                                placeholder="e.g. CEO, Marketing"
                            />
                        </div>
                    </div>
                </div>

                {/* Info Box */}
                <div className="rounded-xl bg-blue-600/5 border border-blue-600/10 p-4">
                    <div className="flex gap-3">
                        <div className="mt-0.5 text-blue-600">
                            <Globe className="h-4 w-4" />
                        </div>
                        <div className="text-xs leading-relaxed text-muted-foreground">
                            <span className="font-bold text-blue-600">Strategy:</span> FB Groups are goldmines for B2B leads. Focus on "Public" groups where member lists or recent posters are visible.
                        </div>
                    </div>
                </div>

                <div className="mt-2 flex justify-end">
                    <Button 
                        onClick={handleSearch}
                        disabled={isLoading || (!groupName && !keywords)}
                        className="bg-blue-700 hover:bg-blue-600 text-white px-8"
                    >
                        {isLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <>
                                <Facebook className="h-4 w-4 mr-2" />
                                Search Facebook
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}
