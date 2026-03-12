"use client";

import { Bell, ChevronDown, AtSign, PenTool, MoreHorizontal, Plus, Mail, Server, Loader2, Trash2 } from "lucide-react";
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

        // Handle success redirect
        const params = new URLSearchParams(window.location.search);
        if (params.get("connected") === "google") {
            toast.success("Google account connected successfully!");
            // Clean up URL
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }, []);

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
            <div className="flex-1 overflow-y-auto bg-background px-8 py-8 transition-colors duration-300">
                <h2 className="mb-8 text-2xl font-bold text-foreground">Manage my email accounts</h2>

                {/* Accounts Card */}
                <div className="mb-6 rounded-2xl border border-border bg-card p-8 transition-colors duration-300">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="grid h-10 w-10 place-items-center rounded-xl bg-secondary border border-border text-foreground">
                            <AtSign size={20} />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-foreground">Accounts</h3>
                            <p className="text-sm text-muted-foreground">Add, edit, or delete your email accounts.</p>
                        </div>
                    </div>

                    {/* Table Header */}
                    <div className="mb-2 grid grid-cols-12 px-4 text-xs font-bold uppercase tracking-wider text-muted-foreground font-mono">
                        <div className="col-span-3">Provider / Identity</div>
                        <div className="col-span-4">Email Address</div>
                        <div className="col-span-3">Daily Limit / Activity</div>
                        <div className="col-span-2 text-right px-2">Actions</div>
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
                                <div key={item.id} className="grid grid-cols-12 items-center rounded-xl border border-border bg-background/50 backdrop-blur-sm px-4 py-4 transition-all hover:border-blue-500/30 hover:bg-background/80 group">
                                    <div className="col-span-3 flex items-center gap-3">
                                        <div className={`grid h-8 w-8 place-items-center rounded-lg ${item.provider === 'google' ? 'bg-red-500/10 text-red-500' :
                                            item.provider === 'microsoft' ? 'bg-blue-500/10 text-blue-500' :
                                                'bg-indigo-500/10 text-indigo-500'
                                            }`}>
                                            <Mail size={16} />
                                        </div>
                                        <span className="text-sm font-semibold text-foreground capitalize">{item.provider}</span>
                                        {item.is_org_shared && (
                                            <span className="text-[10px] bg-amber-500/10 text-amber-600 px-1.5 py-0.5 rounded font-bold uppercase tracking-tight">Org</span>
                                        )}
                                    </div>
                                    <div className="col-span-4 text-sm font-medium text-foreground/80">
                                        {item.email}
                                        <div className="text-[10px] text-muted-foreground mt-0.5">{item.sender_name || "Not set"}</div>
                                    </div>
                                    <div className="col-span-3">
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1 h-1.5 rounded-full bg-secondary overflow-hidden max-w-[100px]">
                                                <div 
                                                    className={`h-full transition-all duration-500 ${item.sent_count_today >= item.daily_limit ? 'bg-rose-500' : 'bg-blue-500'}`}
                                                    style={{ width: `${Math.min((item.sent_count_today / item.daily_limit) * 100, 100)}%` }}
                                                />
                                            </div>
                                            <span className="text-xs font-mono font-bold text-foreground">
                                                {item.sent_count_today}/{item.daily_limit}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="col-span-2 flex justify-end gap-2">
                                        <button
                                            onClick={() => handleDeleteAccount(item.id)}
                                            disabled={isDeleting === item.id}
                                            className="p-2 text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all"
                                        >
                                            {isDeleting === item.id ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                                        </button>
                                        <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-all">
                                            <MoreHorizontal size={18} />
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
                            <DialogContent className="max-w-2xl bg-card border-border">
                                <DialogHeader>
                                    <DialogTitle className="text-2xl font-bold tracking-tight text-foreground">Connect an email account</DialogTitle>
                                    <DialogDescription className="text-base text-muted-foreground mt-2">
                                        Select your email provider to connect it for sending out outreach campaigns. We support one-click OAuth for Google and Microsoft.
                                    </DialogDescription>
                                </DialogHeader>

                                <div className="grid grid-cols-2 gap-4 mt-6">
                                    <button
                                        onClick={() => handleConnectGoogle(false)}
                                        disabled={isConnectingGoogle}
                                        className="flex flex-col items-center justify-center gap-4 p-8 rounded-2xl border-2 border-border bg-background hover:border-red-500 hover:bg-red-500/5 transition-all group text-center disabled:opacity-50"
                                    >
                                        <div className="h-14 w-14 rounded-full bg-red-500/10 text-red-500 grid place-items-center group-hover:scale-110 group-hover:bg-red-500/20 transition-all">
                                            {isConnectingGoogle ? <Loader2 className="animate-spin" size={28} /> : <Mail size={28} />}
                                        </div>
                                        <div>
                                            <span className="block font-bold text-foreground text-lg mb-1">Google</span>
                                            <span className="text-sm text-muted-foreground">Gmail, Google Workspace</span>
                                        </div>
                                    </button>

                                    <button
                                        onClick={() => toast.info("Microsoft OAuth coming soon! Use Custom IMAP/SMTP for now.")}
                                        className="flex flex-col items-center justify-center gap-4 p-8 rounded-2xl border-2 border-border bg-background hover:border-blue-500 hover:bg-blue-500/5 transition-all group text-center"
                                    >
                                        <div className="h-14 w-14 rounded-full bg-blue-500/10 text-blue-500 grid place-items-center group-hover:scale-110 group-hover:bg-blue-500/20 transition-all">
                                            <Mail size={28} />
                                        </div>
                                        <div>
                                            <span className="block font-bold text-foreground text-lg mb-1">Microsoft</span>
                                            <span className="text-sm text-muted-foreground">Outlook, Office 365, Exchange</span>
                                        </div>
                                    </button>

                                    <button
                                        onClick={() => (window as any).location.href = "/settings/email/connect"}
                                        className="flex items-center justify-center gap-4 p-6 rounded-2xl border-2 border-border bg-background hover:border-indigo-500 hover:bg-indigo-500/5 transition-all group col-span-2 text-left"
                                    >
                                        <div className="h-12 w-12 rounded-full bg-indigo-500/10 text-indigo-500 grid place-items-center group-hover:scale-110 group-hover:bg-indigo-500/20 transition-all">
                                            <Server size={24} />
                                        </div>
                                        <div className="flex-1">
                                            <span className="block font-bold text-foreground text-lg">Any Other Provider (IMAP / SMTP)</span>
                                            <span className="text-sm text-muted-foreground">Connect any email using IMAP and SMTP credentials manually.</span>
                                        </div>
                                    </button>
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
                <div className="rounded-2xl border border-border bg-card p-8 transition-colors duration-300">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="grid h-10 w-10 place-items-center rounded-xl bg-secondary border border-border text-foreground">
                            <PenTool size={18} />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-foreground">Signatures</h3>
                            <p className="text-sm text-muted-foreground">Add your signature at the end of every email you send</p>
                        </div>
                    </div>

                    <div className="grid gap-8 lg:grid-cols-3">
                        {/* Sidebar controls */}
                        <div className="lg:col-span-1">
                            <label className="mb-2 block text-xs font-semibold text-muted-foreground">Default signature</label>
                            <div className="relative mb-6">
                                <select className="w-full appearance-none rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-blue-500/50 transition-colors">
                                    <option>No signature</option>
                                    <option>My Business Sig</option>
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" size={16} />
                            </div>

                            <div className="mb-2 block text-xs font-semibold text-muted-foreground font-mono uppercase tracking-widest opacity-60">Your signatures</div>
                            <button className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-500 mt-2">
                                <Plus size={16} />
                                Add a signature
                            </button>
                        </div>

                        {/* Preview Area */}
                        <div className="rounded-xl border border-dashed border-border bg-muted/30 p-12 text-center lg:col-span-2 transition-colors">
                            <h4 className="text-lg font-semibold text-foreground">Find your signatures here</h4>
                            <p className="mt-2 text-sm text-muted-foreground">Select a signature to edit or preview it</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
