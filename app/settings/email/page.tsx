"use client";

import { Bell, ChevronDown, AtSign, PenTool, MoreHorizontal, Plus, Mail, Server as ServerIcon, Loader2, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { toast } from "sonner";
import Header from "@/components/Header";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface EmailAccount {
    id: string;
    email: string;
    provider: string;
    sender_name?: string;
    is_active: boolean;
    is_org_shared: boolean;
    daily_limit: number;
    sent_count_today: number;
}

export default function EmailSettingsPage() {
    const { user } = useAuth();
    const [emails, setEmails] = useState<EmailAccount[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);
    const [isConnectingGoogle, setIsConnectingGoogle] = useState(false);
    const router = useRouter();

    useEffect(() => {
        fetchEmailAccounts();

        // Handle success/error redirects from OAuth callback
        const params = new URLSearchParams(window.location.search);
        const error = params.get("error");
        const connected = params.get("connected");

        if (connected === "google") {
            toast.success("Google account connected successfully!");
        } else if (error === "missing_gmail_permissions") {
            toast.error("Permission Denied: Please RE-CONNECT and check the 'Gmail Send' checkbox to enable bulk mailing.", {
                duration: 6000
            });
        } else if (error) {
            toast.error(`Connection failed: ${error.replace(/_/g, ' ')}`);
        }

        if (connected || error) {
            // Clean up URL
            const url = new URL(window.location.href);
            url.searchParams.delete("connected");
            url.searchParams.delete("error");
            window.history.replaceState({}, document.title, url.pathname);
        }
    }, [router]);

    const fetchEmailAccounts = async () => {
        setIsLoading(true);
        try {
            const res = await api.get<EmailAccount[]>("/api/email/accounts");
            if (res.data) {
                setEmails(res.data);
            }
        } catch (error) {
            console.error("Failed to fetch email accounts:", error);
            toast.error("Failed to load email accounts");
        } finally {
            setIsLoading(false);
        }
    };

    const handleConnectGoogle = async (isOrgShared = false) => {
        setIsConnectingGoogle(true);
        try {
            const res = await api.get<{ url: string }>(`/api/email/auth/google/url?is_org_shared=${isOrgShared}`);
            if (res.data?.url) {
                window.location.href = res.data.url;
            } else {
                toast.error("Failed to get Google authorization URL");
            }
        } catch (error) {
            toast.error("An error occurred while connecting Google");
        } finally {
            setIsConnectingGoogle(false);
        }
    };

    const handleBulkUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (event) => {
            const text = event.target?.result as string;
            const lines = text.split("\n");
            const headers = lines[0].split(",").map(h => h.trim().toLowerCase());
            
            const accounts = lines.slice(1).filter(l => l.trim()).map(line => {
                const values = line.split(",").map(v => v.trim());
                const acc: any = {};
                headers.forEach((h, i) => {
                    if (h === "name" || h === "sender_name") acc.sender_name = values[i];
                    else if (h === "email") acc.email = values[i];
                    else if (h === "password" || h === "smtp_password") acc.smtp_password = values[i];
                    else acc[h] = values[i];
                });
                return acc;
            });

            if (accounts.length === 0) return;

            setIsLoading(true);
            try {
                const res = await api.post("/api/email/accounts/bulk-upload", accounts);
                if (!res.error) {
                    toast.success(`Successfully uploaded ${accounts.length} email accounts`);
                    fetchEmailAccounts();
                } else {
                    toast.error(res.error.detail || "Bulk upload failed");
                }
            } catch (error) {
                toast.error("Failed to process CSV file");
            } finally {
                setIsLoading(false);
            }
        };
        reader.readAsText(file);
    };

    const handleDeleteAccount = async (id: string) => {
        if (!confirm("Are you sure you want to disconnect this email account?")) return;

        setIsDeleting(id);
        try {
            const res = await api.delete(`/api/email/accounts/${id}`);
            if (!res.error) {
                toast.success("Email account disconnected");
                setEmails(emails.filter(e => e.id !== id));
            } else {
                toast.error("Failed to disconnect account");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setIsDeleting(null);
        }
    };

    return (
        <div className="flex h-full flex-col bg-background text-foreground transition-colors duration-300">
            {/* Top Header */}
            <Header />

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto bg-slate-50/50 px-12 py-10">
                <div className="max-w-[1200px] mx-auto">
                    <h2 className="mb-10 text-[32px] font-bold text-[#0f172a] tracking-tight">Manage my email accounts</h2>

                {/* Accounts Card */}
                <div className="mb-8 rounded-[32px] border border-slate-100 bg-white p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                    <div className="flex items-center justify-between mb-10">
                        <div className="flex items-center gap-5">
                            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-indigo-50 text-indigo-600 shadow-sm">
                                <AtSign size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-[#0f172a]">Active Accounts</h3>
                                <p className="text-[15px] text-slate-500 font-medium">Add and manage your outreach identities.</p>
                            </div>
                        </div>
                    </div>

                    {/* Table Header */}
                    <div className="mb-4 grid grid-cols-12 px-6 text-[11px] font-bold uppercase tracking-[0.1em] text-slate-400">
                        <div className="col-span-3">Provider</div>
                        <div className="col-span-4">identity</div>
                        <div className="col-span-3">Activity</div>
                        <div className="col-span-2 text-right">Actions</div>
                    </div>

                    {/* Email List */}
                    <div className="space-y-3">
                        {isLoading ? (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                            </div>
                        ) : emails.length === 0 ? (
                            <div className="text-center py-12 rounded-xl border border-dashed border-border bg-muted/20">
                                <Mail className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                                <p className="text-muted-foreground font-medium">No email accounts connected yet.</p>
                                <p className="text-xs text-muted-foreground/60 mt-1">Connect an account to start sending campaigns.</p>
                            </div>
                        ) : (
                            emails.map((item) => (
                                <div key={item.id} className="grid grid-cols-12 items-center rounded-2xl border border-slate-50 bg-slate-50/30 px-6 py-5 transition-all hover:border-indigo-500/20 hover:bg-white hover:shadow-md group">
                                    <div className="col-span-3 flex items-center gap-4">
                                        <div className={`grid h-10 w-10 place-items-center rounded-xl ${item.provider === 'google' ? 'bg-red-50 text-red-500' :
                                            item.provider === 'microsoft' ? 'bg-blue-50 text-blue-500' :
                                                'bg-indigo-50 text-indigo-600'
                                            }`}>
                                            <Mail size={18} />
                                        </div>
                                        <span className="text-sm font-bold text-[#0f172a] capitalize">{item.provider}</span>
                                        {item.is_org_shared && (
                                            <span className="text-[10px] bg-amber-500/10 text-amber-600 px-1.5 py-0.5 rounded font-bold uppercase tracking-tight">Org</span>
                                        )}
                                    </div>
                                    <div className="col-span-4 text-[15px] font-bold text-slate-700">
                                        {item.email}
                                        <div className="text-xs text-slate-400 font-medium mt-0.5">{item.sender_name || "No sender name"}</div>
                                    </div>
                                    <div className="col-span-3">
                                        <div className="flex items-center gap-3">
                                            <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden max-w-[120px]">
                                                <div 
                                                    className={`h-full transition-all duration-500 ${item.sent_count_today >= item.daily_limit ? 'bg-rose-500' : 'bg-[#2563eb]'}`}
                                                    style={{ width: `${Math.min((item.sent_count_today / item.daily_limit) * 100, 100)}%` }}
                                                />
                                            </div>
                                            <span className="text-xs font-mono font-bold text-foreground">
                                                {item.sent_count_today}/{item.daily_limit}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="col-span-2 flex justify-end gap-3">
                                        <button
                                            onClick={() => handleDeleteAccount(item.id)}
                                            disabled={isDeleting === item.id}
                                            className="p-3 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                                        >
                                            {isDeleting === item.id ? <Loader2 size={20} className="animate-spin" /> : <Trash2 size={20} />}
                                        </button>
                                        <button className="p-3 text-slate-400 hover:text-[#0f172a] hover:bg-slate-50 rounded-xl transition-all">
                                            <MoreHorizontal size={20} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="flex items-center gap-4 mt-8">
                        <Dialog>
                            <DialogTrigger asChild>
                                <button className="flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-500 transition-colors group">
                                    <div className="p-1 rounded-md bg-blue-600/10 group-hover:bg-blue-600/20 transition-all">
                                        <Plus size={16} />
                                    </div>
                                    <span>Add an account</span>
                                </button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl bg-white border-none rounded-[40px] p-0 overflow-hidden shadow-2xl">
                                <div className="p-10">
                                    <DialogHeader className="mb-8">
                                        <DialogTitle className="text-3xl font-bold text-[#0f172a] text-center">Connect an email account</DialogTitle>
                                        <DialogDescription className="text-center text-[15px] text-slate-500 font-medium mt-3 max-w-md mx-auto">
                                            Choose your provider to scale your outreach safely.
                                        </DialogDescription>
                                    </DialogHeader>

                                    <div className="grid grid-cols-2 gap-5">
                                        <button
                                            onClick={() => handleConnectGoogle(false)}
                                            disabled={isConnectingGoogle}
                                            className="flex flex-col items-center justify-center gap-5 p-10 rounded-[32px] border-2 border-slate-50 bg-slate-50/30 hover:border-red-500/20 hover:bg-red-500/5 transition-all group text-center disabled:opacity-50"
                                        >
                                            <div className="h-16 w-16 rounded-3xl bg-white shadow-sm grid place-items-center group-hover:scale-110 group-hover:shadow-md transition-all">
                                                {isConnectingGoogle ? <Loader2 className="animate-spin text-red-500" size={32} /> : <div className="text-2xl font-bold text-red-500">G</div>}
                                            </div>
                                            <div>
                                                <span className="block font-bold text-[#0f172a] text-xl mb-1">Google</span>
                                                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Workspace</span>
                                            </div>
                                        </button>

                                        <button
                                            onClick={() => toast.info("Microsoft OAuth coming soon!")}
                                            className="flex flex-col items-center justify-center gap-5 p-10 rounded-[32px] border-2 border-slate-50 bg-slate-50/30 hover:border-blue-500/20 hover:bg-blue-500/5 transition-all group text-center"
                                        >
                                            <div className="h-16 w-16 rounded-3xl bg-white shadow-sm grid place-items-center group-hover:scale-110 group-hover:shadow-md transition-all">
                                                <div className="text-2xl font-bold text-blue-500">M</div>
                                            </div>
                                            <div>
                                                <span className="block font-bold text-[#0f172a] text-xl mb-1">Microsoft</span>
                                                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Office 365</span>
                                            </div>
                                        </button>

                                        <button
                                            onClick={() => (window as any).location.href = "/settings/email/connect"}
                                            className="flex items-center gap-6 p-8 rounded-[32px] border-2 border-slate-50 bg-slate-50/30 hover:border-indigo-500/20 hover:bg-indigo-500/5 transition-all group col-span-2 text-left shadow-sm"
                                        >
                                            <div className="h-16 w-16 rounded-3xl bg-white shadow-sm grid place-items-center group-hover:scale-110 group-hover:shadow-md transition-all">
                                                <ServerIcon size={32} className="text-[#6366f1]" />
                                            </div>
                                            <div className="flex-1">
                                                <span className="block font-bold text-[#0f172a] text-xl mb-1">Custom SMTP / IMAP</span>
                                                <span className="text-[15px] text-slate-500 font-medium font-medium">Connect any other provider manually.</span>
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>

                        <div className="h-4 w-px bg-border mx-2" />

                        <label className="flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-500 transition-colors group cursor-pointer">
                            <input type="file" accept=".csv" onChange={handleBulkUpload} className="hidden" />
                            <div className="p-1 rounded-md bg-blue-600/10 group-hover:bg-blue-600/20 transition-all">
                                <Mail size={16} />
                            </div>
                            <span>Bulk upload Employees (CSV)</span>
                        </label>
                    </div>
                </div>

                {/* Signatures Card */}
                <div className="rounded-[32px] border border-slate-100 bg-white p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] mb-10">
                    <div className="flex items-center gap-5 mb-10">
                        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-slate-50 text-slate-600 shadow-sm">
                            <PenTool size={22} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-[#0f172a]">Signatures</h3>
                            <p className="text-[15px] text-slate-500 font-medium">Add your signature at the end of every email.</p>
                        </div>
                    </div>

                    <div className="grid gap-8 lg:grid-cols-3">
                        {/* Sidebar controls */}
                        <div className="lg:col-span-1">
                            <label className="mb-3 block text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">Default signature</label>
                            <div className="relative mb-8">
                                <select className="w-full appearance-none rounded-2xl border-2 border-slate-50 bg-slate-50/50 px-5 py-3.5 text-sm font-semibold text-slate-900 outline-none focus:border-indigo-500/30 transition-all cursor-pointer">
                                    <option>No signature</option>
                                    <option>My Business Sig</option>
                                </select>
                                <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                            </div>

                            <div className="mb-4 block text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">Your signatures</div>
                            <button className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-500 mt-2">
                                <Plus size={16} />
                                Add a signature
                            </button>
                        </div>

                        {/* Preview Area */}
                        <div className="rounded-[24px] border-2 border-dashed border-slate-100 bg-slate-50/30 p-16 text-center lg:col-span-2 transition-all">
                            <h4 className="text-xl font-bold text-[#0f172a]">Find your signatures here</h4>
                            <p className="mt-3 text-[15px] text-slate-500 font-medium">Select a signature from the list to edit or preview it in real-time.</p>
                        </div>
                    </div>
                </div>

                </div>
            </div>
        </div>
    );
}
