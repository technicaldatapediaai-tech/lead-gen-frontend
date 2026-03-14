"use client";

import { Linkedin, Lock, X, Loader2, Rocket } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import { toast } from "sonner";
import Header from "@/components/Header";

interface LinkedInCredential {
    id: string;
    type: "personal" | "organization";
    profile_name?: string;
    profile_url?: string;
    has_sales_navigator: boolean;
    connected_by?: string;
    connected_at: string;
    sent_count_today: number;
    daily_limit: number;
}

interface LinkedInStatus {
    credentials: LinkedInCredential[];
    using_personal: boolean;
    has_personal: boolean;
    has_organization: boolean;
}

export default function LinkedInSettingsPage() {
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [status, setStatus] = useState<LinkedInStatus | null>(null);
    const [isConnecting, setIsConnecting] = useState(false);
    const [isDisconnecting, setIsDisconnecting] = useState(false);

    // Credentials Modal State
    const [showCredentialModal, setShowCredentialModal] = useState(false);
    const [credentialModalType, setCredentialModalType] = useState<"personal" | "organization">("personal");
    const [linkedinEmail, setLinkedinEmail] = useState("");
    const [linkedinPassword, setLinkedinPassword] = useState("");
    const [linkedinName, setLinkedinName] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isSavingCredentials, setIsSavingCredentials] = useState(false);

    useEffect(() => {
        fetchLinkedInStatus();

        // Sync with extension if available
        const token = localStorage.getItem("access_token");
        if (token) {
            window.postMessage({ type: "LEAD_GENIUS_CONNECT", payload: { token } }, "*");
        }
    }, []);

    const fetchLinkedInStatus = async () => {
        setIsLoading(true);
        try {
            const res = await api.get<LinkedInStatus>("/api/linkedin/credentials");
            if (res.data) {
                setStatus(res.data);
            }
        } catch (error) {
            console.error("Failed to fetch LinkedIn status:", error);
            toast.error("Failed to load LinkedIn status");
        } finally {
            setIsLoading(false);
        }
    };

    const handleConnect = async (credentialType: "personal" | "organization") => {
        setIsConnecting(true);
        try {
            const res = await api.get<{ auth_url: string }>(`/api/linkedin/auth/url?credential_type=${credentialType}`);
            if (res.data?.auth_url) {
                window.location.href = res.data.auth_url;
            } else {
                toast.error("Failed to initiate LinkedIn connection");
            }
        } catch (error: any) {
            console.error("Error connecting LinkedIn:", error);
            toast.error(error?.message || "Failed to connect LinkedIn");
        } finally {
            setIsConnecting(false);
        }
    };

    const handleConnectWithCredentials = async () => {
        if (!linkedinEmail.trim() || !linkedinPassword.trim()) {
            toast.error("Please enter your LinkedIn email and password");
            return;
        }

        setIsSavingCredentials(true);
        try {
            const res = await api.post("/api/linkedin/connect-credentials", {
                linkedin_email: linkedinEmail.trim(),
                linkedin_password: linkedinPassword.trim(),
                profile_name: linkedinName.trim() || undefined,
                credential_type: credentialModalType,
            });

            if (!res.error) {
                toast.success(`${credentialModalType === "personal" ? "Personal" : "Organization"} LinkedIn connected successfully!`);
                setShowCredentialModal(false);
                setLinkedinEmail("");
                setLinkedinPassword("");
                setLinkedinName("");
                await fetchLinkedInStatus();
            } else {
                toast.error(res.error?.detail || "Failed to connect");
            }
        } catch (error: any) {
            console.error("Error connecting with credentials:", error);
            toast.error("Failed to connect LinkedIn");
        } finally {
            setIsSavingCredentials(false);
        }
    };

    const handleDisconnect = async (credentialType: "personal" | "organization", credentialId?: string) => {
        if (!confirm(`Are you sure you want to disconnect this ${credentialType} LinkedIn account?`)) {
            return;
        }

        setIsDisconnecting(true);
        try {
            const endpoint = credentialId 
                ? `/api/linkedin/credentials/${credentialId}`
                : `/api/linkedin/disconnect/${credentialType}`;
                
            const res = await api.delete(endpoint);
            if (!res.error) {
                toast.success("Account disconnected");
                await fetchLinkedInStatus();
            } else {
                toast.error(res.error.detail || "Failed to disconnect");
            }
        } catch (error) {
            console.error("Error disconnecting:", error);
            toast.error("Failed to disconnect LinkedIn");
        } finally {
            setIsDisconnecting(false);
        }
    };

    const handleUpdateLimit = async (credentialId: string, limit: number) => {
        try {
            const res = await api.patch(`/api/linkedin/credentials/${credentialId}/limit`, { daily_limit: limit });
            if (!res.error) {
                toast.success("Daily limit updated");
                await fetchLinkedInStatus();
            } else {
                toast.error(res.error.detail || "Failed to update limit");
            }
        } catch (error) {
            console.error("Error updating limit:", error);
            toast.error("Failed to update limit");
        }
    };

    const handleSetPreference = async (usePersonal: boolean) => {
        try {
            const res = await api.post("/api/linkedin/preference", { use_personal: usePersonal });
            if (!res.error) {
                toast.success(`Now using ${usePersonal ? "personal" : "organization"} LinkedIn`);
                await fetchLinkedInStatus();
            } else {
                toast.error("Failed to update preference");
            }
        } catch (error) {
            console.error("Error setting preference:", error);
            toast.error("Failed to update preference");
        }
    };

    const openCredentialModal = (type: "personal" | "organization") => {
        setCredentialModalType(type);
        setLinkedinEmail("");
        setLinkedinPassword("");
        setLinkedinName("");
        setShowPassword(false);
        setShowCredentialModal(true);
    };

    const personalCredential = status?.credentials.find(c => c.type === "personal");
    const orgCredentials = status?.credentials.filter(c => c.type === "organization") || [];
    const hasOrgCredential = orgCredentials.length > 0;

    return (
        <div className="flex h-full flex-col bg-background text-foreground transition-colors duration-300">
            {/* Top Header */}
            <Header />

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto bg-background px-8 py-8 transition-colors duration-300">
                <h2 className="mb-8 text-2xl font-bold text-foreground">LinkedIn Account</h2>

                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                ) : (
                    <>
                        {/* Personal LinkedIn */}
                        <div className="mb-6 rounded-2xl border border-border bg-card p-8 transition-colors duration-300">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="grid h-8 w-8 place-items-center rounded bg-[#0077b5] text-white">
                                    <Linkedin size={18} fill="currentColor" />
                                </div>
                                <h3 className="text-lg font-bold text-foreground">Personal LinkedIn</h3>
                            </div>

                            {personalCredential ? (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between rounded-xl border border-border bg-background p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 p-[2px]">
                                                <div className="h-full w-full rounded-full bg-white grid place-items-center">
                                                    <Linkedin size={20} className="text-[#0077b5]" />
                                                </div>
                                            </div>
                                            <div>
                                                <div className="font-semibold text-foreground">
                                                    {personalCredential.profile_name || "LinkedIn Profile"}
                                                </div>
                                                {personalCredential.has_sales_navigator && (
                                                    <div className="text-xs text-blue-600">Sales Navigator enabled</div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                                                {personalCredential.sent_count_today}/{personalCredential.daily_limit} SENT TODAY
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Limit</span>
                                                <input
                                                    type="number"
                                                    className="w-16 h-8 rounded-lg border border-border bg-background px-2 text-xs font-bold"
                                                    defaultValue={personalCredential.daily_limit}
                                                    onBlur={(e) => handleUpdateLimit(personalCredential.id, parseInt(e.target.value))}
                                                />
                                            </div>
                                            <button
                                                onClick={() => handleDisconnect("personal")}
                                                disabled={isDisconnecting}
                                                className="p-1.5 rounded-lg hover:bg-rose-500/10 text-rose-500 transition-colors disabled:opacity-50"
                                            >
                                                <X size={18} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Preference Toggle */}
                                    {hasOrgCredential && (
                                        <div className="flex items-center justify-between rounded-xl border border-border bg-muted/30 px-4 py-3">
                                            <span className="text-sm font-medium text-foreground">Use for campaigns</span>
                                            <button
                                                onClick={() => handleSetPreference(true)}
                                                className={`relative w-11 h-6 rounded-full transition-colors ${status?.using_personal ? "bg-blue-600" : "bg-gray-300"
                                                    }`}
                                            >
                                                <div
                                                    className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform ${status?.using_personal ? "translate-x-5" : "translate-x-0"
                                                        }`}
                                                />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between rounded-xl border border-border bg-background p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-muted grid place-items-center">
                                                <Linkedin size={20} />
                                            </div>
                                            <span className="font-semibold text-muted-foreground">Not Connected</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleConnect("personal")}
                                                disabled={isConnecting}
                                                className="flex items-center gap-2 rounded-lg bg-[#0077b5] px-4 py-2 text-xs font-bold text-white hover:bg-[#006396] transition-colors disabled:opacity-50"
                                            >
                                                {isConnecting && <Loader2 className="h-3 w-3 animate-spin" />}
                                                Connect via OAuth
                                            </button>
                                            <button
                                                onClick={() => openCredentialModal("personal")}
                                                className="flex items-center gap-2 rounded-lg border border-[#0077b5] bg-transparent px-4 py-2 text-xs font-bold text-[#0077b5] hover:bg-[#0077b5]/10 transition-colors"
                                            >
                                                <Linkedin size={14} />
                                                Connect with Credentials
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Organization LinkedIn */}
                        <div className="mb-6 rounded-2xl border border-border bg-card p-8 transition-colors duration-300">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="grid h-8 w-8 place-items-center rounded bg-[#0077b5] text-white">
                                        <Linkedin size={18} fill="currentColor" />
                                    </div>
                                    <h3 className="text-lg font-bold text-foreground">Organization LinkedIn</h3>
                                    <span className="text-xs text-muted-foreground">(Shared across team)</span>
                                </div>
                                {hasOrgCredential && (
                                    <div className="flex gap-4">
                                        <button
                                            onClick={() => handleConnect("organization")}
                                            className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0077b5] hover:text-blue-400 transition-colors"
                                        >
                                            + Add OAuth
                                        </button>
                                        <button
                                            onClick={() => openCredentialModal("organization")}
                                            className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0077b5] hover:text-blue-400 transition-colors"
                                        >
                                            + Add Account
                                        </button>
                                    </div>
                                )}
                            </div>

                            {hasOrgCredential ? (
                                <div className="space-y-4">
                                    {orgCredentials.map((cred) => (
                                        <div key={cred.id} className="flex flex-col gap-4 p-5 rounded-2xl border border-border bg-background hover:border-[#0077b5]/30 transition-all group">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 p-[2px] transition-transform group-hover:rotate-6">
                                                        <div className="h-full w-full rounded-2xl bg-white grid place-items-center">
                                                            <Linkedin size={24} className="text-[#0077b5]" />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-foreground text-lg">
                                                            {cred.profile_name || "Organization Account"}
                                                        </div>
                                                        {cred.connected_by && (
                                                            <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-1">
                                                                Linked by {cred.connected_by}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-6">
                                                    <div className="flex flex-col items-end">
                                                        <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Daily Usage</div>
                                                        <div className="flex items-center gap-2">
                                                            <div className="h-2 w-24 bg-muted rounded-full overflow-hidden">
                                                                <div
                                                                    className="h-full bg-blue-500"
                                                                    style={{ width: `${Math.min(100, (cred.sent_count_today / cred.daily_limit) * 100)}%` }}
                                                                />
                                                            </div>
                                                            <span className="text-xs font-bold text-foreground">{cred.sent_count_today}/{cred.daily_limit}</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col items-start">
                                                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Quota</span>
                                                        <input
                                                            type="number"
                                                            className="w-20 h-9 rounded-xl border border-border bg-muted/50 px-3 text-xs font-bold focus:border-blue-500/50 outline-none transition-all"
                                                            defaultValue={cred.daily_limit}
                                                            onBlur={(e) => handleUpdateLimit(cred.id, parseInt(e.target.value))}
                                                        />
                                                    </div>
                                                    <button
                                                        onClick={() => handleDisconnect("organization", cred.id)}
                                                        className="p-2.5 rounded-xl hover:bg-rose-500/10 text-rose-500 transition-colors"
                                                        title="Disconnect account"
                                                    >
                                                        <X size={20} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    {/* Rotation Mode Selector */}
                                    {personalCredential && (
                                        <div className="mt-8 flex items-center justify-between rounded-2xl border border-blue-500/10 bg-blue-500/5 p-6 border-dashed">
                                            <div className="flex items-start gap-4">
                                                <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-500/10 text-blue-500">
                                                    <Rocket size={20} />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-foreground">Outreach Priority: Team Shared</span>
                                                    <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mt-1">
                                                        Campaigns will use organization accounts in a round-robin rotation
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleSetPreference(false)}
                                                className={`relative w-14 h-7 rounded-full transition-all duration-300 ${!status?.using_personal ? "bg-blue-600 shadow-lg shadow-blue-500/20" : "bg-muted"}`}
                                            >
                                                <div
                                                    className={`absolute top-1 left-1 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-300 ${!status?.using_personal ? "translate-x-7 scale-110" : "translate-x-0"}`}
                                                />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div className="flex flex-col items-center justify-center py-12 px-6 rounded-3xl border border-dashed border-border bg-muted/5">
                                        <div className="h-16 w-16 rounded-3xl bg-muted/20 grid place-items-center mb-6">
                                            <Linkedin size={32} className="text-muted-foreground/40" />
                                        </div>
                                        <div className="text-center mb-8">
                                            <h4 className="font-bold text-foreground mb-2">No organization accounts connected</h4>
                                            <p className="text-xs text-muted-foreground max-w-[280px] mx-auto leading-relaxed">
                                                Share account access with your entire team to scale your LinkedIn outreach safely.
                                            </p>
                                        </div>
                                        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                                            <button
                                                onClick={() => handleConnect("organization")}
                                                disabled={isConnecting}
                                                className="group relative overflow-hidden rounded-2xl bg-[#0077b5] px-8 py-4 text-xs font-black uppercase tracking-widest text-white transition-all hover:bg-[#006396] hover:scale-[1.02] active:scale-95 shadow-xl shadow-[#0077b5]/20 disabled:opacity-50"
                                            >
                                                <span className="relative z-10 flex items-center justify-center gap-2">
                                                    {isConnecting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Linkedin size={16} />}
                                                    Connect via OAuth
                                                </span>
                                            </button>
                                            <button
                                                onClick={() => openCredentialModal("organization")}
                                                className="rounded-2xl border border-border bg-card px-8 py-4 text-xs font-black uppercase tracking-widest text-foreground transition-all hover:bg-muted hover:scale-[1.02] active:scale-95"
                                            >
                                                Use Credentials
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Security Card */}
                        <div className="rounded-2xl border border-border bg-card p-8 transition-colors duration-300">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="grid h-8 w-8 place-items-center rounded bg-[#00cfa6] text-white">
                                        <Lock size={18} />
                                    </div>
                                    <h3 className="text-lg font-bold text-foreground">Securely automate LinkedIn with Lead Genius + 2FA</h3>
                                </div>
                                <a href="#" className="flex items-center gap-1 text-sm font-semibold text-blue-500 hover:text-blue-400 hover:underline">
                                    <span className="text-lg">↗</span> Learn more
                                </a>
                            </div>

                            <div className="space-y-4 text-sm text-muted-foreground">
                                <p>
                                    Lead Genius connects to your LinkedIn account via <strong className="text-foreground">OAuth</strong> or your <strong className="text-foreground">LinkedIn credentials</strong>. Once connected, it allows the tool to
                                    <strong className="text-foreground"> send messages</strong> on your behalf.
                                </p>
                                <p>
                                    You can use your <strong className="text-foreground">personal LinkedIn</strong> account for campaigns, or connect your
                                    <strong className="text-foreground"> organization's shared account</strong> that multiple team members can use.
                                </p>
                                <p>
                                    Two-factor authentication (2FA) is an <strong className="text-foreground">additional security method</strong> to protect your LinkedIn account. Enabling 2FA makes your account more secure and reduces the risk of <strong className="text-foreground">temporary suspension</strong> by LinkedIn.
                                </p>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* LinkedIn Sign In Modal */}
            {showCredentialModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
                    onClick={(e) => { if (e.target === e.currentTarget) setShowCredentialModal(false); }}
                >
                    <div className="w-full max-w-[400px] rounded-2xl bg-white dark:bg-card border border-border shadow-2xl mx-4 overflow-hidden">
                        {/* Top section with logo */}
                        <div className="px-8 pt-8 pb-4 flex flex-col items-center">
                            <Linkedin size={34} className="text-[#0077b5]" fill="#0077b5" />
                            <h2 className="mt-3 text-xl font-semibold text-gray-800 dark:text-foreground">
                                Sign in to LinkedIn
                            </h2>
                            <p className="mt-1 text-xs text-gray-500 dark:text-muted-foreground">
                                Connect your {credentialModalType} account to Lead Genius
                            </p>
                        </div>

                        {/* Divider */}
                        <div className="px-8 flex items-center gap-4 my-2">
                            <div className="flex-1 h-px bg-border" />
                            <span className="text-xs text-gray-400 dark:text-muted-foreground">or</span>
                            <div className="flex-1 h-px bg-border" />
                        </div>

                        {/* Form */}
                        <div className="px-8 pb-8 pt-4">
                            <div className="space-y-4">
                                {/* Email / Phone field */}
                                <div className="relative">
                                    <input
                                        type="email"
                                        id="linkedin-email"
                                        value={linkedinEmail}
                                        onChange={(e) => setLinkedinEmail(e.target.value)}
                                        placeholder=" "
                                        className="peer w-full rounded-md border border-gray-300 dark:border-input bg-transparent px-3 pt-5 pb-2 text-sm text-gray-800 dark:text-foreground outline-none focus:border-[#0077b5] focus:ring-1 focus:ring-[#0077b5] transition-all"
                                        autoComplete="off"
                                    />
                                    <label
                                        htmlFor="linkedin-email"
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 dark:text-muted-foreground transition-all pointer-events-none peer-focus:top-3 peer-focus:text-xs peer-focus:text-[#0077b5] peer-[:not(:placeholder-shown)]:top-3 peer-[:not(:placeholder-shown)]:text-xs"
                                    >
                                        Email or phone
                                    </label>
                                </div>

                                {/* Password field */}
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="linkedin-password"
                                        value={linkedinPassword}
                                        onChange={(e) => setLinkedinPassword(e.target.value)}
                                        placeholder=" "
                                        className="peer w-full rounded-md border border-gray-300 dark:border-input bg-transparent px-3 pt-5 pb-2 pr-16 text-sm text-gray-800 dark:text-foreground outline-none focus:border-[#0077b5] focus:ring-1 focus:ring-[#0077b5] transition-all"
                                        autoComplete="off"
                                    />
                                    <label
                                        htmlFor="linkedin-password"
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 dark:text-muted-foreground transition-all pointer-events-none peer-focus:top-3 peer-focus:text-xs peer-focus:text-[#0077b5] peer-[:not(:placeholder-shown)]:top-3 peer-[:not(:placeholder-shown)]:text-xs"
                                    >
                                        Password
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#0077b5] hover:text-[#006396] transition-colors"
                                    >
                                        {showPassword ? "Hide" : "Show"}
                                    </button>
                                </div>

                                {/* Forgot password */}
                                <div>
                                    <a href="https://www.linkedin.com/uas/request-password-reset" target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-[#0077b5] hover:underline hover:text-[#006396]">
                                        Forgot password?
                                    </a>
                                </div>

                                {/* Sign in button */}
                                <button
                                    onClick={handleConnectWithCredentials}
                                    disabled={isSavingCredentials || !linkedinEmail.trim() || !linkedinPassword.trim()}
                                    className="w-full rounded-full bg-[#0077b5] py-3 text-base font-semibold text-white hover:bg-[#006396] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isSavingCredentials && <Loader2 className="h-4 w-4 animate-spin" />}
                                    {isSavingCredentials ? "Signing in..." : "Sign in"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
