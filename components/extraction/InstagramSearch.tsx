"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { 
    Instagram, 
    Search, 
    Filter, 
    Users, 
    Hash,
    MapPin,
    Zap,
    Loader2
} from "lucide-react";

export default function InstagramSearch() {
    const [isLoading, setIsLoading] = useState(false);
    const [hashtags, setHashtags] = useState("");
    const [location, setLocation] = useState("");
    const [keywords, setKeywords] = useState("");
    
    const handleSearch = () => {
        setIsLoading(true);
        
        // Construct an Instagram search URL or a Google search for targeted leads
        let searchQuery = keywords;
        if (hashtags) searchQuery += ` #${hashtags.replace('#', '')}`;
        if (location) searchQuery += ` in ${location}`;
        
        const url = `https://www.google.com/search?q=site:instagram.com ${encodeURIComponent(searchQuery)}`;
        
        window.open(url, '_blank');
        
        setIsLoading(false);
        toast.info("Instagram search results opened via Google for targeted extraction.");
    };

    return (
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm transition-colors">
            <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <span className="text-pink-500">
                        <Instagram className="h-4 w-4" />
                    </span>
                    Instagram Lead Sourcing
                </div>
            </div>

            <div className="grid gap-4">
                {/* Keywords */}
                <div>
                    <label className="mb-2 block text-xs font-semibold text-muted-foreground">
                        Profile Keywords
                    </label>
                    <div className="flex items-center gap-3 rounded-xl border border-input bg-card/50 px-4 py-3 transition focus-within:ring-1 focus-within:ring-pink-500/50">
                        <Search className="h-4 w-4 text-muted-foreground" />
                        <Input
                            value={keywords}
                            onChange={(e) => setKeywords(e.target.value)}
                            className="w-full bg-transparent border-none text-sm text-foreground outline-none placeholder:text-muted-foreground/70 focus-visible:ring-0 px-0"
                            placeholder="e.g. Fitness Coach, Real Estate Agent"
                        />
                    </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    {/* Hashtags */}
                    <div className="space-y-2">
                        <label className="block text-xs font-semibold text-muted-foreground">
                            Target Hashtags
                        </label>
                        <div className="flex items-center gap-3 rounded-xl border border-input bg-card/50 px-4 py-3 transition focus-within:ring-1 focus-within:ring-pink-500/50">
                            <Hash className="h-4 w-4 text-muted-foreground" />
                            <Input
                                value={hashtags}
                                onChange={(e) => setHashtags(e.target.value)}
                                className="w-full bg-transparent border-none text-sm text-foreground outline-none placeholder:text-muted-foreground/70 focus-visible:ring-0 px-0"
                                placeholder="e.g. startup, tech"
                            />
                        </div>
                    </div>

                    {/* Location */}
                    <div className="space-y-2">
                        <label className="block text-xs font-semibold text-muted-foreground">
                            Location
                        </label>
                        <div className="flex items-center gap-3 rounded-xl border border-input bg-card/50 px-4 py-3 transition focus-within:ring-1 focus-within:ring-pink-500/50">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <Input
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                className="w-full bg-transparent border-none text-sm text-foreground outline-none placeholder:text-muted-foreground/70 focus-visible:ring-0 px-0"
                                placeholder="e.g. New York, London"
                            />
                        </div>
                    </div>
                </div>

                {/* Info Box */}
                <div className="rounded-xl bg-pink-500/5 border border-pink-500/10 p-4">
                    <div className="flex gap-3">
                        <div className="mt-0.5 text-pink-500">
                            <Zap className="h-4 w-4" />
                        </div>
                        <div className="text-xs leading-relaxed text-muted-foreground">
                            <span className="font-bold text-pink-500">Tip:</span> Use specific niche keywords and locations. Our system will help you identify public profiles that match your criteria.
                        </div>
                    </div>
                </div>

                <div className="mt-2 flex justify-end">
                    <Button 
                        onClick={handleSearch}
                        disabled={isLoading || !keywords}
                        className="bg-pink-600 hover:bg-pink-500 text-white px-8"
                    >
                        {isLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <>
                                <Instagram className="h-4 w-4 mr-2" />
                                Find Instagram Leads
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}
