"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Mail, Server, Shield, Loader2, Info } from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "sonner";

export default function ConnectEmailPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        sender_name: "",
        smtp_host: "",
        smtp_port: 587,
        smtp_user: "",
        smtp_password: "",
        imap_host: "",
        imap_port: 993,
        imap_user: "",
        imap_password: "",
        is_org_shared: false
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked :
                type === 'number' ? parseInt(value) : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // If imap fields are empty, use smtp fields
            const data = {
                ...formData,
                imap_user: formData.imap_user || formData.smtp_user,
                imap_password: formData.imap_password || formData.smtp_password,
                imap_host: formData.imap_host || (formData.smtp_host ? formData.smtp_host.replace('smtp', 'imap') : "")
            };

            const res = await api.post("/api/email/accounts", data);

            if (!res.error) {
                toast.success("Email account connected successfully!");
                router.push("/settings/email");
            } else {
                toast.error(res.error.detail || "Failed to connect email account");
            }
        } catch (error) {
            toast.error("An unexpected error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex h-full flex-col bg-background">
            {/* Header */}
            <header className="flex h-16 items-center border-b border-border bg-card px-8">
                <button
                    onClick={() => router.back()}
                    className="mr-6 flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
                >
                    <ChevronLeft size={18} />
                    Back
                </button>
                <h1 className="text-xl font-bold text-foreground">Connect Custom Email</h1>
            </header>

            <div className="flex-1 overflow-y-auto px-8 py-10">
                <div className="mx-auto max-w-3xl">
                    <div className="mb-10 flex items-start gap-4 rounded-2xl border border-blue-500/20 bg-blue-500/10 p-6 text-blue-600 dark:text-blue-400">
                        <Info className="mt-1 shrink-0" size={20} />
                        <div>
                            <h3 className="font-bold">SMTP / IMAP Setup</h3>
                            <p className="text-sm opacity-90">
                                Enter your email server details below. Lead Genius uses SMTP to send your outreach emails and IMAP to track replies automatically.
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Basic Info */}
                        <section className="rounded-2xl border border-border bg-card p-8">
                            <h3 className="mb-6 flex items-center gap-2 text-lg font-bold text-foreground">
                                <Mail size={20} className="text-blue-500" />
                                Identity
                            </h3>
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-foreground">Email Address</label>
                                    <input
                                        required
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="you@company.com"
                                        className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:border-blue-500/50 transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-foreground">Sender Name</label>
                                    <input
                                        required
                                        type="text"
                                        name="sender_name"
                                        value={formData.sender_name}
                                        onChange={handleChange}
                                        placeholder="John Doe"
                                        className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:border-blue-500/50 transition-all"
                                    />
                                </div>
                            </div>
                        </section>

                        {/* SMTP Settings */}
                        <section className="rounded-2xl border border-border bg-card p-8">
                            <h3 className="mb-6 flex items-center gap-2 text-lg font-bold text-foreground">
                                <Server size={20} className="text-emerald-500" />
                                Outgoing Server (SMTP)
                            </h3>
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-foreground">SMTP Host</label>
                                    <input
                                        required
                                        type="text"
                                        name="smtp_host"
                                        value={formData.smtp_host}
                                        onChange={handleChange}
                                        placeholder="smtp.gmail.com"
                                        className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:border-blue-500/50 transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-foreground">SMTP Port</label>
                                    <input
                                        required
                                        type="number"
                                        name="smtp_port"
                                        value={formData.smtp_port}
                                        onChange={handleChange}
                                        className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:border-blue-500/50 transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-foreground">SMTP User</label>
                                    <input
                                        required
                                        type="text"
                                        name="smtp_user"
                                        value={formData.smtp_user}
                                        onChange={handleChange}
                                        placeholder="Often same as email"
                                        className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:border-blue-500/50 transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-foreground">SMTP Password</label>
                                    <input
                                        required
                                        type="password"
                                        name="smtp_password"
                                        value={formData.smtp_password}
                                        onChange={handleChange}
                                        placeholder="••••••••"
                                        className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:border-blue-500/50 transition-all"
                                    />
                                </div>
                            </div>
                        </section>

                        {/* IMAP Settings (Optional) */}
                        <section className="rounded-2xl border border-border bg-card p-8 opacity-80 hover:opacity-100 transition-opacity">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="flex items-center gap-2 text-lg font-bold text-foreground">
                                    <Server size={20} className="text-purple-500" />
                                    Incoming Server (IMAP)
                                </h3>
                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest bg-muted px-2 py-1 rounded">Optional</span>
                            </div>
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-foreground">IMAP Host</label>
                                    <input
                                        type="text"
                                        name="imap_host"
                                        value={formData.imap_host}
                                        onChange={handleChange}
                                        placeholder="imap.gmail.com"
                                        className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:border-blue-500/50 transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-foreground">IMAP Port</label>
                                    <input
                                        type="number"
                                        name="imap_port"
                                        value={formData.imap_port}
                                        onChange={handleChange}
                                        className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:border-blue-500/50 transition-all"
                                    />
                                </div>
                            </div>
                            <p className="mt-4 text-xs text-muted-foreground">
                                Leave blank to use the same credentials as SMTP. We recommend filling this for better tracking.
                            </p>
                        </section>

                        {/* Sharing */}
                        <section className="rounded-2xl border border-border bg-card p-8">
                            <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-foreground">
                                <Shield size={20} className="text-amber-500" />
                                Organization Sharing
                            </h3>
                            <label className="flex items-start gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="is_org_shared"
                                    checked={formData.is_org_shared}
                                    onChange={handleChange}
                                    className="mt-1 h-4 w-4 rounded border-input text-blue-600 focus:ring-blue-500"
                                />
                                <div>
                                    <span className="block text-sm font-bold text-foreground">Share with Organization</span>
                                    <span className="block text-xs text-muted-foreground">Allow other team members to use this email account in their campaigns.</span>
                                </div>
                            </label>
                        </section>

                        {/* Submit */}
                        <div className="flex justify-end gap-4">
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="rounded-xl px-8 py-3 text-sm font-bold text-muted-foreground hover:bg-muted transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="flex items-center gap-2 rounded-xl bg-blue-600 px-10 py-3 text-sm font-bold text-white hover:bg-blue-500 transition-all disabled:opacity-50"
                            >
                                {isLoading && <Loader2 size={18} className="animate-spin" />}
                                {isLoading ? "Connecting..." : "Connect Account"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
