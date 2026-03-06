"use client";

import { Bell, ChevronDown, Info } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import { toast } from "sonner";
import Header from "@/components/Header";

interface WorkingDays {
    MONDAY: boolean;
    TUESDAY: boolean;
    WEDNESDAY: boolean;
    THURSDAY: boolean;
    FRIDAY: boolean;
    SATURDAY: boolean;
    SUNDAY: boolean;
}

export default function AccountActivityPage() {
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [dailyCustomMode, setDailyCustomMode] = useState(false);
    const [timezone, setTimezone] = useState("Asia/Calcutta (GMT+5:30)");

    // Days state
    const [days, setDays] = useState<WorkingDays>({
        MONDAY: true,
        TUESDAY: true,
        WEDNESDAY: true,
        THURSDAY: true,
        FRIDAY: true,
        SATURDAY: true,
        SUNDAY: true,
    });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        setIsLoading(true);
        try {
            const res = await api.get<any>("/api/users/me/settings");
            if (res.data) {
                setTimezone(res.data.timezone || "UTC");

                // Parse working days from email_preferences if exists
                if (res.data.email_preferences?.working_days) {
                    setDays(res.data.email_preferences.working_days);
                }
                if (res.data.email_preferences?.daily_custom_mode !== undefined) {
                    setDailyCustomMode(res.data.email_preferences.daily_custom_mode);
                }
            }
        } catch (error) {
            console.error("Failed to fetch settings:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleDay = (day: keyof WorkingDays) => {
        setDays(prev => ({ ...prev, [day]: !prev[day] }));
    };

    const handleSaveSettings = async () => {
        setIsSaving(true);
        try {
            const res = await api.patch("/api/users/me/settings", {
                timezone,
                email_preferences: {
                    working_days: days,
                    daily_custom_mode: dailyCustomMode
                }
            });

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
                <div className="text-muted-foreground">Loading...</div>
            </div>
        );
    }

    return (
        <div className="flex h-full flex-col bg-background text-foreground transition-colors duration-300">
            {/* Top Header */}
            <Header />

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto bg-background px-8 py-8 transition-colors duration-300">

                {/* Header Section */}
                <div className="mb-8">
                    <div className="flex items-center gap-3">
                        <h2 className="text-2xl font-bold text-foreground">Account activity</h2>
                        <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5">
                            <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Currently active</span>
                        </div>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">Choose when you want your campaign actions to be sent</p>
                </div>

                {/* Main Settings Card */}
                <div className="rounded-2xl border border-border bg-card p-8 transition-colors duration-300">

                    {/* Time Zone */}
                    <div className="mb-8 max-w-md">
                        <label className="mb-3 block text-sm font-bold text-foreground">Select time zone</label>
                        <div className="relative">
                            <select
                                value={timezone}
                                onChange={(e) => setTimezone(e.target.value)}
                                className="w-full appearance-none rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-blue-500/50 transition-colors"
                            >
                                <option>Asia/Calcutta (GMT+5:30)</option>
                                <option>America/New_York (GMT-5:00)</option>
                                <option>Europe/London (GMT+0:00)</option>
                                <option>UTC (GMT+0:00)</option>
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" size={16} />
                        </div>
                    </div>

                    {/* Working Days Header */}
                    <div className="mb-6 flex items-center justify-between">
                        <label className="text-sm font-bold text-foreground">Select Working days</label>
                        <div className="flex items-center gap-3">
                            <span className="text-sm text-muted-foreground">Daily custom mode</span>
                            <button
                                onClick={() => setDailyCustomMode(!dailyCustomMode)}
                                className={`relative h-6 w-11 rounded-full transition-colors ${dailyCustomMode ? 'bg-blue-600' : 'bg-muted'}`}
                            >
                                <div className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-transform ${dailyCustomMode ? 'left-6' : 'left-1'}`}></div>
                            </button>
                        </div>
                    </div>

                    {/* Working Days Grid */}
                    <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {Object.entries(days).map(([day, isActive]) => (
                            <div key={day} className="flex items-center justify-between rounded-xl border border-border bg-background p-4 transition-colors">
                                <span className="text-xs font-bold text-foreground">{day}</span>
                                <button
                                    onClick={() => toggleDay(day as keyof WorkingDays)}
                                    className={`relative h-6 w-11 rounded-full transition-colors ${isActive ? 'bg-blue-600' : 'bg-muted'}`}
                                >
                                    <div className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-transform ${isActive ? 'left-6' : 'left-1'}`}></div>
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Time Range Slider (Visual Mock) */}
                    <div className="mb-12">
                        <div className="flex justify-between text-xs font-semibold text-blue-500 mb-2">
                            <span>12:00 AM</span>
                            <span>11:59 PM</span>
                        </div>
                        <div className="relative h-2 w-full rounded-full bg-muted">
                            {/* Active Range Bar */}
                            <div className="absolute left-0 right-0 h-full rounded-full bg-blue-500"></div>
                            {/* Knobs */}
                            <div className="absolute left-0 top-1/2 -ml-2 h-5 w-5 -translate-y-1/2 rounded-full border-2 border-primary bg-background ring-2 ring-blue-500/30 shadow-sm"></div>
                            <div className="absolute right-0 top-1/2 -mr-2 h-5 w-5 -translate-y-1/2 rounded-full border-2 border-primary bg-background ring-2 ring-blue-500/30 shadow-sm"></div>
                        </div>
                        <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                            <span>12:00 AM</span>
                            <span>11:59 PM</span>
                        </div>
                    </div>

                    {/* Save Button */}
                    <div className="flex justify-end">
                        <button
                            onClick={handleSaveSettings}
                            disabled={isSaving}
                            className="rounded-xl bg-blue-600 px-8 py-3 text-sm font-medium text-white hover:bg-blue-500 transition-colors disabled:opacity-50"
                        >
                            {isSaving ? "Saving..." : "Save Activity Settings"}
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}
