"use client";

import React from "react";
import { Timer, ArrowLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function PlansPage() {
    return (
        <div className="flex flex-col h-full bg-background animate-in fade-in duration-500 items-center justify-center p-8 text-center">
            <div className="mb-8 relative">
                <div className="absolute -inset-4 bg-blue-500/20 blur-2xl rounded-full animate-pulse"></div>
                <div className="relative h-24 w-24 rounded-[2rem] bg-card border border-border shadow-2xl flex items-center justify-center text-blue-500">
                    <Sparkles size={40} className="animate-bounce" />
                </div>
            </div>

            <h2 className="text-4xl font-black text-foreground uppercase tracking-tighter mb-4">
                Subscription Plans <br />
                <span className="text-blue-500">Coming Soon</span>
            </h2>

            <p className="max-w-md text-muted-foreground font-bold text-sm uppercase tracking-widest leading-relaxed mb-12">
                We are currently refining our pricing tiers to provide the best value for your outreach team. Stay tuned for our official launch!
            </p>

            <div className="flex gap-4">
                <Link href="/settings/invoices">
                    <Button variant="outline" className="rounded-2xl h-14 px-8 border-border hover:bg-muted font-black uppercase tracking-widest text-xs gap-2">
                        <ArrowLeft size={16} /> Back to Invoices
                    </Button>
                </Link>
                <Button className="rounded-2xl h-14 px-8 bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20 font-black uppercase tracking-widest text-xs">
                    Notify Me
                </Button>
            </div>
        </div>
    );
}
