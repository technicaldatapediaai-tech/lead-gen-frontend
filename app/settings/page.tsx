"use client";

import { Bell, ChevronDown, Mail } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import { toast } from "sonner";
import Header from "@/components/Header";

interface UserSettings {
    language_preference: string;
    timezone: string;
    email_preferences: Record<string, any>;
}

const avatarOptions = [
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Jack",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Milo",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Luna",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Patches",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Simba",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Nala",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Sven",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Olaf",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Elsa",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Anna",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Kristoff",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Hans",
];

export default function SettingsPage() {
    const { user, refreshUser } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // User profile state
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [avatarUrl, setAvatarUrl] = useState(avatarOptions[0]);
    const [showAvatarPicker, setShowAvatarPicker] = useState(false);

    // Settings state
    const [language, setLanguage] = useState("English");
    const [settings, setSettings] = useState<UserSettings | null>(null);

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        setIsLoading(true);
        try {
            // Fetch user profile
            const userRes = await api.get<any>("/api/users/me");
            if (userRes.data) {
                const fullName = userRes.data.full_name || "";
                const names = fullName.split(" ");
                setFirstName(names[0] || "");
                setLastName(names.slice(1).join(" ") || "");
                setEmail(userRes.data.email || "");
                setAvatarUrl(userRes.data.avatar_url || avatarOptions[0]);
            }

            // Fetch user settings
            const settingsRes = await api.get<UserSettings>("/api/users/me/settings");
            if (settingsRes.data) {
                setSettings(settingsRes.data);
                setLanguage(settingsRes.data.language_preference === "en" ? "English" : settingsRes.data.language_preference);
            }
        } catch (error) {
            console.error("Failed to fetch user data:", error);
            toast.error("Failed to load settings");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveProfile = async () => {
        setIsSaving(true);
        try {
            const fullName = `${firstName} ${lastName}`.trim();
            const res = await api.patch("/api/users/me", {
                full_name: fullName,
                avatar_url: avatarUrl
            });

            if (res.error) {
                toast.error("Failed to update profile");
            } else {
                toast.success("Profile updated successfully!");
                // Refresh local user state in AuthContext
                await refreshUser();
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setIsSaving(false);
        }
    };

    const handleSaveLanguage = async () => {
        setIsSaving(true);
        try {
            const langCode = language === "English" ? "en" : language.toLowerCase();
            const res = await api.patch("/api/users/me/settings", {
                language_preference: langCode
            });

            if (res.error) {
                toast.error("Failed to update language");
            } else {
                toast.success("Language updated successfully!");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center bg-background">
                <div className="text-muted-foreground animate-pulse font-bold tracking-widest text-xs uppercase">Loading Settings...</div>
            </div>
        );
    }

    return (
        <div className="flex h-full flex-col bg-background text-foreground transition-colors duration-300">
            {/* Top Header */}
            <Header />

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto bg-background px-8 py-8 transition-colors duration-300">
                <h2 className="mb-8 text-2xl font-black tracking-tight uppercase">My account</h2>

                {/* About You Section */}
                <div className="mb-6 rounded-3xl border border-border bg-card p-8 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/5 group">
                    <h3 className="mb-8 text-xs font-black uppercase tracking-[0.2em] text-muted-foreground group-hover:text-blue-500 transition-colors">About you</h3>

                    <div className="flex flex-col lg:flex-row gap-12">
                        {/* Avatar Section */}
                        <div className="flex flex-col items-center gap-6">
                            <div className="relative">
                                <div className="h-32 w-32 overflow-hidden rounded-full border-4 border-blue-500/20 bg-muted/30 p-1.5 ring-4 ring-blue-500/5 shadow-2xl transition-transform duration-500 hover:scale-105">
                                    <img
                                        src={avatarUrl}
                                        alt="Avatar"
                                        className="h-full w-full rounded-full object-cover bg-white transition-opacity duration-300"
                                    />
                                </div>
                                <button
                                    onClick={() => setShowAvatarPicker(!showAvatarPicker)}
                                    className={`absolute -bottom-2 -right-2 h-10 w-10 rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-300 z-20 ${showAvatarPicker ? 'bg-red-500 rotate-45' : 'bg-blue-600 hover:scale-110'}`}
                                >
                                    {showAvatarPicker ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                    ) : (
                                        <PenIcon size={16} />
                                    )}
                                </button>

                                {/* Pop-in Avatar Picker */}
                                {showAvatarPicker && (
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 z-30 w-64 bg-card border border-border rounded-2xl p-4 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                                        <div className="flex flex-col items-center gap-3">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Choose your style</span>
                                            <div className="grid grid-cols-4 gap-2">
                                                {avatarOptions.map((opt, i) => (
                                                    <button
                                                        key={i}
                                                        onClick={() => {
                                                            setAvatarUrl(opt);
                                                            setShowAvatarPicker(false);
                                                        }}
                                                        className={`h-11 w-11 rounded-full border-2 transition-all overflow-hidden relative group/btn ${avatarUrl === opt ? 'border-blue-500 scale-110 ring-4 ring-blue-500/20' : 'border-border grayscale hover:grayscale-0 hover:border-blue-500/50'}`}
                                                    >
                                                        <img src={opt} alt={`Option ${i}`} className="h-full w-full object-cover bg-white" />
                                                        {avatarUrl === opt && (
                                                            <div className="absolute inset-0 bg-blue-500/10 flex items-center justify-center">
                                                                <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-ping" />
                                                            </div>
                                                        )}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Details Inputs */}
                        <div className="flex-1 space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <InputField label="First name" value={firstName} onChange={setFirstName} />
                                <InputField label="Last name" value={lastName} onChange={setLastName} />
                            </div>

                            <div className="pt-4 flex justify-end">
                                <button
                                    onClick={handleSaveProfile}
                                    disabled={isSaving}
                                    className="group relative overflow-hidden rounded-2xl bg-blue-600 px-12 py-4 text-xs font-black uppercase tracking-[0.2em] text-white transition-all hover:bg-blue-500 hover:scale-[1.02] active:scale-95 shadow-xl shadow-blue-500/20 disabled:opacity-50"
                                >
                                    <span className="relative z-10">{isSaving ? "Synchronizing..." : "Save Profile Details"}</span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Email Preferences */}
                <div className="mb-6 rounded-3xl border border-border bg-card p-8 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/5">
                    <div className="flex items-center justify-between mb-10">
                        <div className="flex items-start gap-5">
                            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-secondary border border-border text-foreground transition-transform hover:rotate-3">
                                <Mail size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-foreground">Email preferences</h3>
                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mt-1.5">Choose the communication channels you prefer</p>
                            </div>
                        </div>
                        <button className="rounded-xl border border-border px-5 py-2.5 text-[10px] font-black uppercase tracking-widest text-foreground hover:bg-muted transition-colors">
                            Manage Subscriptions
                        </button>
                    </div>

                    <div className="flex flex-col md:flex-row items-end gap-6 max-w-3xl">
                        <div className="flex-1 w-full">
                            <label className="mb-3 block text-[10px] font-black uppercase tracking-widest text-muted-foreground mr-auto">Primary contact email</label>
                            <input
                                type="text"
                                value={email}
                                readOnly
                                className="w-full rounded-2xl border border-input bg-background/50 px-5 py-4 text-sm text-muted-foreground outline-none cursor-not-allowed font-medium"
                            />
                        </div>
                        <button className="rounded-2xl bg-secondary px-8 py-4 text-xs font-black uppercase tracking-widest text-muted-foreground cursor-not-allowed border border-border/50">
                            Locked
                        </button>
                    </div>
                </div>

                {/* Application Language */}
                <div className="rounded-3xl border border-border bg-card p-8 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/5">
                    <div className="flex items-start gap-5 mb-10">
                        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-secondary border border-border text-foreground transition-transform hover:-rotate-3">
                            <span className="text-xl font-black">文</span>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-foreground">Application language</h3>
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mt-1.5">Your interface experience across LeadGenius</p>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row items-end gap-6 max-w-2xl">
                        <div className="flex-1 w-full">
                            <div className="relative">
                                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-2xl z-10">
                                    {language === "English" ? "🇬🇧" : language === "French" ? "🇫🇷" : "🇪🇸"}
                                </div>
                                <select
                                    value={language}
                                    onChange={(e) => setLanguage(e.target.value)}
                                    className="w-full appearance-none rounded-2xl border border-input bg-background px-5 pl-16 py-4 text-sm text-foreground outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 transition-all font-bold"
                                >
                                    <option>English</option>
                                    <option>French</option>
                                    <option>Spanish</option>
                                </select>
                                <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" size={18} />
                            </div>
                        </div>
                        <button
                            onClick={handleSaveLanguage}
                            disabled={isSaving}
                            className="rounded-2xl bg-blue-600 px-10 py-4 text-xs font-black uppercase tracking-widest text-white hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20 active:scale-95 disabled:opacity-50"
                        >
                            {isSaving ? "Saving..." : "Apply Language"}
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}

function InputField({ label, value, onChange }: { label: string, value: string, onChange: (val: string) => void }) {
    return (
        <div className="w-full">
            <label className="mb-3 block text-[10px] font-black uppercase tracking-widest text-muted-foreground">{label}</label>
            <div className="relative group">
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full rounded-2xl border border-input bg-background px-5 py-4 text-sm text-foreground outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 transition-all font-medium placeholder:text-muted-foreground"
                    placeholder={`Enter your ${label.toLowerCase()}...`}
                />
            </div>
        </div>
    )
}

function PenIcon({ size }: { size: number }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
            <path d="m15 5 4 4" />
        </svg>
    )
}
