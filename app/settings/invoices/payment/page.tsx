"use client";

import React from "react";
import { CreditCard, ArrowLeft, ShieldCheck, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function PaymentMethodPage() {
    return (
        <div className="flex flex-col h-full bg-background animate-in fade-in duration-500 items-center justify-center p-8 text-center">
            <div className="mb-8 relative">
                <div className="absolute -inset-4 bg-emerald-500/20 blur-2xl rounded-full animate-pulse"></div>
                <div className="relative h-24 w-24 rounded-[2rem] bg-card border border-border shadow-2xl flex items-center justify-center text-emerald-500">
                    <ShieldCheck size={48} className="animate-pulse" />
                </div>
            </div>

            <h2 className="text-4xl font-black text-foreground uppercase tracking-tighter mb-4">
                Secure Payment <br />
                <span className="text-emerald-500 underline underline-offset-8 decoration-4 decoration-emerald-500/20">Coming Soon</span>
            </h2>

            <p className="max-w-md text-muted-foreground font-bold text-sm uppercase tracking-widest leading-relaxed mb-12">
                We are currently integrating with premium payment gateways (Stripe/PayPal) to ensure your data remains 100% encrypted and secure.
            </p>

            <div className="flex flex-col items-center gap-6">
                <div className="flex gap-4">
                    <Link href="/settings/invoices">
                        <Button variant="outline" className="rounded-2xl h-14 px-8 border-border hover:bg-muted font-black uppercase tracking-widest text-xs gap-2">
                            <ArrowLeft size={16} /> Dashboard
                        </Button>
                    </Link>
                    <Button className="rounded-2xl h-14 px-8 bg-black text-white hover:bg-zinc-800 shadow-lg shadow-zinc-500/20 font-black uppercase tracking-widest text-xs gap-3">
                        <Lock size={16} className="text-emerald-500" /> Secure Checkout
                    </Button>
                </div>

                <div className="flex items-center gap-2 opacity-50 grayscale scale-75">
                    <div className="h-6 w-10 bg-muted rounded-md border border-border"></div>
                    <div className="h-6 w-10 bg-muted rounded-md border border-border"></div>
                    <div className="h-6 w-10 bg-muted rounded-md border border-border"></div>
                </div>
            </div>
        </div>
    );
}
