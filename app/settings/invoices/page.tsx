"use client";

import React, { useState, useEffect } from "react";
import {
    FileText,
    Download,
    ExternalLink,
    Search,
    Filter,
    ArrowUpRight,
    CreditCard,
    Calendar,
    CheckCircle2,
    Clock,
    AlertCircle,
    Loader2
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import { toast } from "sonner";
import Header from "@/components/Header";

export default function InvoicesPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [subscription, setSubscription] = useState<any>(null);
    const [invoices, setInvoices] = useState<any[]>([]);
    const [isAuthError, setIsAuthError] = useState(false);

    useEffect(() => {
        async function fetchBillingData() {
            setIsLoading(true);
            setIsAuthError(false);
            try {
                const [subRes, invRes] = await Promise.all([
                    api.get<any>("/api/billing/subscription"),
                    api.get<any[]>("/api/billing/invoices")
                ]);

                if (subRes.error?.status === 401 || invRes.error?.status === 401) {
                    setIsAuthError(true);
                }

                if (subRes.data) setSubscription(subRes.data);
                if (invRes.data) setInvoices(invRes.data);
            } catch (error) {
                console.error("Failed to fetch billing data:", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchBillingData();
    }, []);

    if (isAuthError) {
        return (
            <div className="flex h-full w-full flex-col items-center justify-center bg-background p-8 text-center animate-in fade-in duration-500">
                <div className="mb-6 rounded-full bg-red-500/10 p-4 text-red-500">
                    <AlertCircle size={48} />
                </div>
                <h2 className="mb-2 text-2xl font-black text-foreground">Authentication Required</h2>
                <p className="mb-8 max-w-sm text-muted-foreground font-bold">
                    Your session for billing data has expired or is invalid. Please log out and log back in to refresh your access.
                </p>
                <div className="flex gap-4">
                    <Button
                        onClick={() => window.location.reload()}
                        variant="outline"
                        className="rounded-xl px-8 h-12 font-black uppercase tracking-widest text-xs"
                    >
                        Try Refresh
                    </Button>
                    <Button
                        onClick={() => {
                            localStorage.removeItem('access_token');
                            window.location.href = '/login';
                        }}
                        className="rounded-xl px-8 h-12 bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest text-xs shadow-lg shadow-blue-500/20"
                    >
                        Log Out & Re-login
                    </Button>
                </div>
            </div>
        );
    }

    const filteredInvoices = invoices.filter(inv =>
        inv.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.plan_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isLoading) {
        return (
            <div className="flex h-full w-full items-center justify-center bg-background">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-background text-foreground animate-in fade-in duration-500">
            <Header />
            {/* Header Area */}
            <div className="p-8 border-b border-border bg-card/30 backdrop-blur-sm sticky top-0 z-10">
                <div className="flex flex-col gap-1 mb-6">
                    <h2 className="text-2xl font-bold tracking-tight">Billing & Invoices</h2>
                    <p className="text-sm text-muted-foreground">Manage your subscription, payment methods and download past invoices.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition-transform">
                            <CreditCard size={48} />
                        </div>
                        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-1">Current Plan</div>
                        <div className="text-lg font-bold text-blue-500 mb-2">{subscription?.plan_name || "Professional Plan"}</div>
                        <div className="text-[10px] text-muted-foreground flex items-center gap-1.5 uppercase font-medium">
                            <Calendar size={12} className="text-blue-500" />
                            Next billing: {subscription?.next_billing_date ? new Date(subscription.next_billing_date).toLocaleDateString() : "Next month"}
                        </div>
                    </div>

                    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition-transform">
                            <CheckCircle2 size={48} />
                        </div>
                        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-1">Payment Method</div>
                        <div className="text-lg font-semibold text-foreground mb-2">{subscription?.payment_method_summary || "Visa ending in 4242"}</div>
                        <Link href="/settings/invoices/payment" className="text-[10px] text-blue-500 flex items-center gap-1.5 uppercase font-bold cursor-pointer hover:underline underline-offset-4 decoration-2">
                            Update card <ArrowUpRight size={12} strokeWidth={4} />
                        </Link>
                    </div>

                    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm hover:shadow-md transition-all group overflow-hidden relative bg-gradient-to-br from-blue-600/5 to-transparent">
                        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-1">Total Spent</div>
                        <div className="text-2xl font-bold text-foreground mb-1 mt-1">
                            ₹0.00
                        </div>
                        <div className="text-[10px] text-muted-foreground flex items-center gap-1.5 uppercase font-medium underline decoration-border underline-offset-4 decoration-2">
                            No billing history yet
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search invoices by ID or plan..."
                            className="pl-9 h-11 bg-card/50 border-input rounded-xl focus:ring-blue-500 transition-all font-bold text-xs uppercase tracking-widest"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" className="rounded-xl h-11 gap-2 font-black text-[10px] uppercase tracking-[0.2em] border-border hover:bg-muted opacity-50 cursor-not-allowed">
                            <Filter size={14} /> Filter
                        </Button>
                        <Link href="/settings/invoices/plans">
                            <Button className="rounded-xl h-11 gap-2 bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20 font-black text-[10px] uppercase tracking-[0.2em] px-6">
                                Upgrade Plan
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Invoices List */}
            <div className="flex-1 overflow-y-auto px-8 py-6">
                <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
                    <div className="grid grid-cols-12 gap-4 border-b border-border bg-muted/40 px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground sticky top-0 z-10">
                        <div className="col-span-3">Invoice ID</div>
                        <div className="col-span-2">Date</div>
                        <div className="col-span-3">Plan / Description</div>
                        <div className="col-span-1">Amount</div>
                        <div className="col-span-2">Status</div>
                        <div className="col-span-1 text-right">Actions</div>
                    </div>

                    <div className="divide-y divide-border">
                        {filteredInvoices.length > 0 ? (
                            filteredInvoices.map((invoice) => (
                                <div
                                    key={invoice.id}
                                    className="grid grid-cols-12 gap-4 px-6 py-5 items-center hover:bg-accent/30 transition-colors group cursor-pointer"
                                    onClick={() => invoice.pdf_url && window.open(invoice.pdf_url, '_blank')}
                                >
                                    <div className="col-span-3">
                                        <div className="flex items-center gap-3">
                                            <div className="grid h-8 w-8 place-items-center rounded-lg bg-blue-500/10 text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all">
                                                <FileText size={16} />
                                            </div>
                                            <div className="font-bold text-sm text-foreground">{invoice.invoice_number}</div>
                                        </div>
                                    </div>
                                    <div className="col-span-2 text-sm text-muted-foreground font-medium">
                                        {new Date(invoice.invoice_date).toLocaleDateString()}
                                    </div>
                                    <div className="col-span-3">
                                        <div className="text-sm font-bold text-foreground">{invoice.plan_name}</div>
                                        <div className="text-[10px] text-muted-foreground uppercase font-bold mt-0.5">{invoice.payment_method}</div>
                                    </div>
                                    <div className="col-span-1 text-sm font-black text-foreground">
                                        ₹{invoice.amount.toLocaleString()}
                                    </div>
                                    <div className="col-span-2">
                                        <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-emerald-500 border border-emerald-500/20">
                                            <span className="h-1 w-1 rounded-full bg-emerald-500" />
                                            {invoice.status}
                                        </div>
                                    </div>
                                    <div className="col-span-1 text-right">
                                        <button className="p-2 hover:bg-secondary rounded-lg transition-colors text-muted-foreground hover:text-blue-500">
                                            <Download size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center py-24 text-center">
                                <div className="mb-4 rounded-full bg-muted p-4 text-muted-foreground/50">
                                    <FileText size={48} />
                                </div>
                                <h3 className="text-lg font-bold text-foreground">No invoices found</h3>
                                <p className="text-sm text-muted-foreground max-w-xs font-medium">
                                    Your billing history will appear here once you've made your first transaction.
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-8 rounded-2xl bg-blue-600/5 border border-blue-500/10 p-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-600">
                            <Clock size={24} />
                        </div>
                        <div>
                            <h4 className="font-bold text-foreground underline decoration-blue-500/30 underline-offset-4">Need help with billing?</h4>
                            <p className="text-xs text-muted-foreground mt-1">Our support team is available 24/7 to assist you with any payment issues.</p>
                        </div>
                    </div>
                    <Button variant="outline" className="border-blue-500/20 text-blue-500 hover:bg-blue-500 hover:text-white transition-all font-bold rounded-xl h-10 text-xs uppercase tracking-wider">
                        Contact Support
                    </Button>
                </div>
            </div>
        </div>
    );
}
