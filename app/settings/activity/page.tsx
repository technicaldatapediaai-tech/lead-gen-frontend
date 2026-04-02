"use client";

import { Bell, ChevronDown, Info, Clock, Mail, Linkedin, X, ChevronUp, Save } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import { toast } from "sonner";
import Header from "@/components/Header";
import { motion, AnimatePresence } from "framer-motion";

interface WorkingDays {
    MONDAY: boolean;
    TUESDAY: boolean;
    WEDNESDAY: boolean;
    THURSDAY: boolean;
    FRIDAY: boolean;
    SATURDAY: boolean;
    SUNDAY: boolean;
}

const DEFAULT_DAYS: WorkingDays = {
    MONDAY: true, TUESDAY: true, WEDNESDAY: true, THURSDAY: true, FRIDAY: true, SATURDAY: true, SUNDAY: true
};

export default function AccountActivityPage() {
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [timezone, setTimezone] = useState("Asia/Calcutta (GMT+5:30)");
    const [activeTab, setActiveTab] = useState<"email" | "linkedin">("email");

    // Email state
    const [emailDays, setEmailDays] = useState<WorkingDays>(DEFAULT_DAYS);
    const [emailStartTime, setEmailStartTime] = useState("09:00");
    const [emailEndTime, setEmailEndTime] = useState("17:00");
    const [emailCustom, setEmailCustom] = useState(false);

    // LinkedIn state
    const [linkedinDays, setLinkedinDays] = useState<WorkingDays>(DEFAULT_DAYS);
    const [linkedinStartTime, setLinkedinStartTime] = useState("09:00");
    const [linkedinEndTime, setLinkedinEndTime] = useState("17:00");
    const [linkedinCustom, setLinkedinCustom] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        setIsLoading(true);
        try {
            const res = await api.get<any>("/api/users/me/settings");
            if (res.data) {
                if (res.data.timezone) setTimezone(res.data.timezone);
                
                // Email prefs
                const eP = res.data.email_preferences;
                if (eP) {
                    if (eP.working_days) setEmailDays(eP.working_days);
                    if (eP.start_time) setEmailStartTime(eP.start_time);
                    if (eP.end_time) setEmailEndTime(eP.end_time);
                    if (eP.daily_custom_mode !== undefined) setEmailCustom(eP.daily_custom_mode);
                }

                // LinkedIn prefs
                const lP = res.data.linkedin_preferences;
                if (lP) {
                    if (lP.working_days) setLinkedinDays(lP.working_days);
                    if (lP.start_time) setLinkedinStartTime(lP.start_time);
                    if (lP.end_time) setLinkedinEndTime(lP.end_time);
                    if (lP.daily_custom_mode !== undefined) setLinkedinCustom(lP.daily_custom_mode);
                }
            }
        } catch (error) {
            console.error("Failed to fetch settings:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveSettings = async () => {
        setIsSaving(true);
        try {
            const preferencesPayload = {
                timezone,
                email_preferences: {
                    timezone, // Include in pref object for backend service priority
                    working_days: emailDays,
                    start_time: emailStartTime,
                    end_time: emailEndTime,
                    daily_custom_mode: emailCustom
                },
                linkedin_preferences: {
                    timezone, // Include in pref object for backend service priority
                    working_days: linkedinDays,
                    start_time: linkedinStartTime,
                    end_time: linkedinEndTime,
                    daily_custom_mode: linkedinCustom
                }
            };
            
            console.log("Syncing preferences:", preferencesPayload);
            const res = await api.patch("/api/users/me/settings", preferencesPayload);

            if (res.error) {
                toast.error("Failed to save settings");
            } else {
                toast.success("Settings saved successfully!");
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
                <div className="text-muted-foreground text-sm font-bold">Initializing tactical modules...</div>
            </div>
        );
    }

    return (
        <div className="flex h-screen flex-col bg-background text-foreground overflow-hidden">
            <Header />
            
            <div className="flex-1 flex overflow-hidden">
                {/* Main Content Area */}
                <div className="flex-1 flex flex-col p-6 max-w-6xl mx-auto w-full overflow-hidden">
                    
                    {/* Header Row */}
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-xl font-black tracking-tight flex items-center gap-2">
                                <Clock className="h-5 w-5 text-blue-500" />
                                Operation Windows
                            </h2>
                            <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-widest mt-0.5 opacity-60">Schedule outreach cycles</p>
                        </div>
                        
                        <div className="flex items-center gap-4">
                            {/* Compact Timezone Selector */}
                            <div className="flex items-center gap-2 bg-muted/30 px-3 py-1.5 rounded-lg border border-border/50">
                                <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground/60">TZ:</span>
                                <select
                                    value={timezone}
                                    onChange={(e) => setTimezone(e.target.value)}
                                    className="bg-transparent text-xs font-bold outline-none cursor-pointer"
                                >
                                    <option>Asia/Calcutta (GMT+5:30)</option>
                                    <option>America/New_York (GMT-5:00)</option>
                                    <option>Europe/London (GMT+0:00)</option>
                                    <option>UTC (GMT+0:00)</option>
                                </select>
                            </div>

                            <button
                                onClick={handleSaveSettings}
                                disabled={isSaving}
                                className="flex items-center gap-2 bg-blue-600 px-4 py-2 rounded-lg text-xs font-bold text-white shadow-lg shadow-blue-500/10 hover:bg-blue-500 active:scale-95 transition-all disabled:opacity-50"
                            >
                                {isSaving ? "Saving..." : "Save Changes"}
                                {!isSaving && <Save size={14} />}
                            </button>
                        </div>
                    </div>

                    {/* Compact Toggler */}
                    <div className="mb-6 flex">
                        <div className="bg-muted p-1 rounded-xl flex gap-1 relative border border-border/50">
                            <motion.div
                                layoutId="activeTabSelection"
                                className="absolute bg-white dark:bg-zinc-800 rounded-lg shadow-md z-0 h-[calc(100%-8px)] top-1 bottom-1"
                                style={{ width: "calc(50% - 4px)" }}
                                transition={{ type: "spring", bounce: 0.1, duration: 0.4 }}
                                animate={{ x: activeTab === "email" ? 0 : "100%" }}
                            />
                            
                            <button
                                onClick={() => setActiveTab("email")}
                                className={`flex items-center gap-2 px-6 py-2 rounded-lg text-xs font-bold z-10 transition-colors duration-300 relative ${activeTab === "email" ? "text-blue-600 dark:text-blue-400" : "text-muted-foreground"}`}
                            >
                                <Mail className="h-3.5 w-3.5" />
                                Email
                            </button>
                            
                            <button
                                onClick={() => setActiveTab("linkedin")}
                                className={`flex items-center gap-2 px-6 py-2 rounded-lg text-xs font-bold z-10 transition-colors duration-300 relative ${activeTab === "linkedin" ? "text-blue-600 dark:text-blue-400" : "text-muted-foreground"}`}
                            >
                                <Linkedin className="h-3.5 w-3.5" />
                                LinkedIn
                            </button>
                        </div>
                    </div>

                    {/* Panels Area - Scrollable if needed but intended to fit */}
                    <div className="flex-1 min-h-0">
                        <AnimatePresence mode="wait">
                            {activeTab === "email" ? (
                                <motion.div
                                    key="email"
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 10 }}
                                    className="h-full"
                                >
                                    <SchedulingPanel 
                                        colorName="blue"
                                        days={emailDays}
                                        setDays={setEmailDays}
                                        startTime={emailStartTime}
                                        setStartTime={setEmailStartTime}
                                        endTime={emailEndTime}
                                        setEndTime={setEmailEndTime}
                                        customMode={emailCustom}
                                        setCustomMode={setEmailCustom}
                                    />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="linkedin"
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 10 }}
                                    className="h-full"
                                >
                                    <SchedulingPanel 
                                        colorName="indigo"
                                        days={linkedinDays}
                                        setDays={setLinkedinDays}
                                        startTime={linkedinStartTime}
                                        setStartTime={setLinkedinStartTime}
                                        endTime={linkedinEndTime}
                                        setEndTime={setLinkedinEndTime}
                                        customMode={linkedinCustom}
                                        setCustomMode={setLinkedinCustom}
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Micro-Help Footer */}
                    <div className="mt-4 flex items-center gap-2 text-[10px] text-muted-foreground font-medium bg-muted/20 px-4 py-2 rounded-lg border border-border/50">
                        <Info size={12} className="text-blue-500/50" />
                        Outreach will strictly observe these windows to maintain account health and safety.
                    </div>
                </div>
            </div>
        </div>
    );
}

function SchedulingPanel({ colorName, days, setDays, startTime, setStartTime, endTime, setEndTime, customMode, setCustomMode }: any) {
    const toggleDay = (day: string) => {
        setDays({ ...days, [day]: !days[day as keyof WorkingDays] });
    };

    const themes: any = {
        blue: {
            bg: "bg-blue-500/5",
            dot: "bg-blue-500",
            text: "text-blue-600 dark:text-blue-400",
            border: "border-blue-500/10",
            btn: "bg-blue-600",
            btnActive: "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
        },
        indigo: {
            bg: "bg-indigo-500/5",
            dot: "bg-indigo-500",
            text: "text-indigo-600 dark:text-indigo-400",
            border: "border-indigo-500/10",
            btn: "bg-indigo-600",
            btnActive: "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
        }
    };

    const theme = themes[colorName] || themes.blue;

    return (
        <div className="h-full bg-card rounded-2xl border border-border p-6 shadow-sm flex flex-col gap-6 relative overflow-hidden">
            {/* Ambient Background - Subtle */}
            <div className={`absolute top-0 right-0 w-64 h-64 ${theme.bg} blur-3xl rounded-full -mr-32 -mt-32 opacity-20`} />
            
            <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-3">
                    <div className={`h-8 w-8 rounded-lg ${theme.bg} flex items-center justify-center border ${theme.border}`}>
                        <Clock size={16} className={theme.text} />
                    </div>
                    <div>
                        <h3 className="text-sm font-black uppercase tracking-tight">Window Config</h3>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <div className="h-1 w-1 rounded-full bg-emerald-500" />
                            <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-tighter">System operational</span>
                        </div>
                    </div>
                </div>

                {/* Custom Toggle */}
                <div className="flex items-center gap-4 bg-muted/30 px-3 py-2 rounded-xl border border-border/50">
                    <div className="flex flex-col text-right">
                        <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground opacity-60">Custom Mode</span>
                        <span className="text-[8px] font-medium text-muted-foreground/60 leading-none">Global override</span>
                    </div>
                    <button
                        onClick={() => setCustomMode(!customMode)}
                        className={`relative h-6 w-11 rounded-full transition-all duration-300 ${customMode ? 'bg-blue-600 shadow-md' : 'bg-zinc-200 dark:bg-zinc-800'}`}
                    >
                        <motion.div 
                            className="absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm"
                            animate={{ x: customMode ? 24 : 4 }}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                    </button>
                </div>
            </div>

            {/* Days Section */}
            <div className="space-y-3 relative z-10">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 ml-1">Engagement Days</label>
                <div className="grid grid-cols-7 gap-2">
                    {Object.entries(days).map(([day, isActive]) => (
                        <button
                            key={day}
                            onClick={() => toggleDay(day)}
                            className={`h-12 rounded-xl flex flex-col items-center justify-center transition-all duration-300 border ${
                                isActive 
                                ? theme.btnActive + " border-transparent" 
                                : 'bg-muted/20 border-border/50 text-muted-foreground hover:bg-muted/40'
                            }`}
                        >
                            <span className="text-[10px] font-black uppercase leading-none">{day.substring(0, 3)}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Premium Compact Watch Time Picker Section */}
            <div className="flex-1 min-h-0 flex flex-col gap-3 relative z-10">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 ml-1">Precision Timers</label>
                <div className="grid grid-cols-2 gap-4 flex-1 items-center">
                    <CompactWatchPicker label="START" value={startTime} onChange={setStartTime} theme={theme} />
                    <CompactWatchPicker label="END" value={endTime} onChange={setEndTime} theme={theme} />
                </div>
            </div>
        </div>
    );
}

function CompactWatchPicker({ label, value, onChange, theme }: any) {
    const [isOpen, setIsOpen] = useState(false);
    const [hour, setHour] = useState(value.split(":")[0]);
    const [minute, setMinute] = useState(value.split(":")[1]);
    const pickerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: any) => {
            if (pickerRef.current && !pickerRef.current.contains(e.target)) setIsOpen(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative h-full" ref={pickerRef}>
            <div 
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full h-full min-h-[140px] bg-muted/20 hover:bg-muted/40 border border-border rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${isOpen ? 'ring-2 ring-blue-500/20 border-blue-500' : ''}`}
            >
                <span className="text-[9px] font-black text-muted-foreground/40 tracking-[0.2em] mb-2">{label}</span>
                <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black tracking-tighter font-mono tabular-nums">{hour}</span>
                    <span className="text-xl font-bold opacity-20">:</span>
                    <span className="text-3xl font-black tracking-tighter font-mono tabular-nums opacity-60">{minute}</span>
                </div>
                <div className={`mt-3 h-1 w-8 rounded-full ${theme.dot} opacity-20`} />
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        className="absolute bottom-full left-0 right-0 z-50 mb-3 p-4 bg-white dark:bg-zinc-900 border border-border shadow-2xl rounded-2xl flex flex-col"
                        style={{ height: "240px" }}
                    >
                        <div className="flex justify-between items-center mb-2 px-1">
                            <span className="text-[9px] font-black uppercase tracking-tight text-muted-foreground">Select {label}</span>
                            <X size={12} className="cursor-pointer opacity-40" onClick={() => setIsOpen(false)} />
                        </div>
                        
                        <div className="flex-1 flex gap-2 min-h-0">
                            {/* Hours */}
                            <div className="flex-1 overflow-y-auto no-scrollbar scroll-smooth snap-y snap-mandatory py-16 bg-muted/10 rounded-lg">
                                {Array.from({ length: 24 }).map((_, i) => {
                                    const h = i.toString().padStart(2, '0');
                                    return (
                                        <button 
                                            key={h}
                                            onClick={() => { setHour(h); onChange(`${h}:${minute}`); }}
                                            className={`snap-center w-full h-10 flex items-center justify-center text-sm font-black transition-all ${hour === h ? theme.text + ' scale-125' : 'text-muted-foreground/40 hover:text-foreground'}`}
                                        >
                                            {h}
                                        </button>
                                    );
                                })}
                            </div>
                            {/* Minutes */}
                            <div className="flex-1 overflow-y-auto no-scrollbar scroll-smooth snap-y snap-mandatory py-16 bg-muted/10 rounded-lg">
                                {Array.from({ length: 60 }).map((_, i) => {
                                    const m = i.toString().padStart(2, '0');
                                    return (
                                        <button 
                                            key={m}
                                            onClick={() => { setMinute(m); onChange(`${hour}:${m}`); }}
                                            className={`snap-center w-full h-10 flex items-center justify-center text-sm font-black transition-all ${minute === m ? theme.text + ' scale-125' : 'text-muted-foreground/40 hover:text-foreground'}`}
                                        >
                                            {m}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
