"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, X, Mail, Eye, EyeOff, ChevronDown, ChevronUp, Loader2, CheckCircle2 } from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "sonner";

export default function ConnectEmailPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [testingSmtp, setTestingSmtp] = useState(false);
    const [testingImap, setTestingImap] = useState(false);

    const [formData, setFormData] = useState({
        email: "",
        sender_name: "",
        smtp_password: "",
        smtp_host: "",
        smtp_port: 587,
        imap_host: "",
        imap_port: 993,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? parseInt(value) : value
        }));
    };

    const handleTestSmtp = async () => {
        if (!formData.smtp_host || !formData.email || !formData.smtp_password) {
            toast.error("Please fill SMTP host, email, and password first");
            return;
        }
        setTestingSmtp(true);
        try {
            const res = await api.post("/api/email/test-smtp", {
                host: formData.smtp_host,
                port: formData.smtp_port,
                user: formData.email,
                password: formData.smtp_password
            });
            if (!res.error) {
                toast.success("SMTP Connection successful!");
            } else {
                toast.error(res.error.detail || "SMTP Connection failed");
            }
        } catch (error) {
            toast.error("SMTP Test failed");
        } finally {
            setTestingSmtp(false);
        }
    };

    const handleTestImap = async () => {
        const imapHost = formData.imap_host || formData.smtp_host.replace('smtp', 'imap');
        const imapPort = formData.imap_port;

        if (!imapHost || !formData.email || !formData.smtp_password) {
            toast.error("Please fill IMAP host, email, and password first");
            return;
        }
        setTestingImap(true);
        try {
            const res = await api.post("/api/email/test-imap", {
                host: imapHost,
                port: imapPort,
                user: formData.email,
                password: formData.smtp_password
            });
            if (!res.error) {
                toast.success("IMAP Connection successful!");
            } else {
                toast.error(res.error.detail || "IMAP Connection failed");
            }
        } catch (error) {
            toast.error("IMAP Test failed");
        } finally {
            setTestingImap(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const data = {
                ...formData,
                smtp_user: formData.email,
                imap_user: formData.email,
                imap_password: formData.smtp_password,
                // If fields are empty in advanced, we should probably handle that
                is_org_shared: false
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
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="w-full max-w-[650px] bg-white rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden animate-in fade-in zoom-in duration-300">
                {/* Header Actions */}
                <div className="relative flex items-center justify-between px-8 py-6">
                    <button 
                        onClick={() => router.back()}
                        className="flex items-center gap-1 text-slate-900 font-semibold hover:opacity-70 transition-opacity"
                    >
                        <ChevronLeft size={20} />
                        <span>Back</span>
                    </button>
                    
                    <button 
                        onClick={() => router.push("/settings/email")}
                        className="absolute right-8 top-1/2 -translate-y-1/2 p-2.5 bg-slate-50 rounded-2xl text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="px-12 pb-12">
                    {/* Centered Title & Icon */}
                    <div className="flex flex-col items-center mb-10 text-center">
                        <h1 className="text-[32px] font-bold text-[#0f172a] mb-6">Set up mail account</h1>
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-[#7c3aed] rounded-2xl flex items-center justify-center text-white shadow-xl shadow-purple-100">
                                <Mail size={28} />
                            </div>
                            <span className="text-xl font-bold text-slate-800">Other</span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Main Fields */}
                        <div className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-[15px] font-bold text-slate-600 ml-1">Email*</label>
                                <div className="relative">
                                    <input
                                        required
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="donald.duck@mail.com"
                                        className="w-full px-6 py-4 bg-white border-2 border-slate-100 rounded-[22px] text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-indigo-500 transition-all font-semibold"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[15px] font-bold text-slate-600 ml-1">Sender Name*</label>
                                <input
                                    required
                                    type="text"
                                    name="sender_name"
                                    value={formData.sender_name}
                                    onChange={handleChange}
                                    placeholder="Donald Duck Official"
                                    className="w-full px-6 py-4 bg-white border-2 border-slate-100 rounded-[22px] text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-indigo-500 transition-all font-semibold"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[15px] font-bold text-slate-600 ml-1">Password*</label>
                                <div className="relative">
                                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400">
                                        <Server size={18} className="opacity-50" /> {/* Symbolizing a secure server/lock */}
                                    </div>
                                    <input
                                        required
                                        type={showPassword ? "text" : "password"}
                                        name="smtp_password"
                                        value={formData.smtp_password}
                                        onChange={handleChange}
                                        placeholder="Enter your password"
                                        className="w-full pl-14 pr-14 py-4 bg-white border-2 border-slate-100 rounded-[22px] text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-indigo-500 transition-all font-semibold"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Advanced Settings */}
                        <div>
                            <button
                                type="button"
                                onClick={() => setShowAdvanced(!showAdvanced)}
                                className="flex items-center gap-1.5 text-blue-600 font-bold text-[15px] hover:opacity-80 transition-all"
                            >
                                <span>Advanced settings</span>
                                {showAdvanced ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                            </button>

                            {showAdvanced && (
                                <div className="mt-8 space-y-8 animate-in slide-in-from-top-4 duration-500">
                                    {/* SMTP Connection */}
                                    <div className="space-y-4">
                                        <h3 className="text-[17px] font-bold text-slate-900 uppercase tracking-tight">SMTP connection</h3>
                                        <div className="grid grid-cols-12 gap-4">
                                            <div className="col-span-8 space-y-2">
                                                <label className="text-xs font-bold text-slate-400 ml-1 uppercase">SMTP Host*</label>
                                                <input
                                                    type="text"
                                                    name="smtp_host"
                                                    value={formData.smtp_host}
                                                    onChange={handleChange}
                                                    placeholder="Search on google"
                                                    className="w-full px-5 py-3.5 bg-white border-2 border-slate-100 rounded-2xl text-slate-900 font-bold placeholder:text-slate-300 focus:outline-none focus:border-indigo-500"
                                                />
                                            </div>
                                            <div className="col-span-4 space-y-2">
                                                <label className="text-xs font-bold text-slate-400 ml-1 uppercase">SMTP Port*</label>
                                                <div className="flex gap-2">
                                                    <input
                                                        type="number"
                                                        name="smtp_port"
                                                        value={formData.smtp_port}
                                                        onChange={handleChange}
                                                        placeholder="xxx"
                                                        className="w-full px-4 py-3.5 bg-white border-2 border-slate-100 rounded-2xl text-slate-900 font-bold placeholder:text-slate-300 focus:outline-none"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={handleTestSmtp}
                                                        disabled={testingSmtp}
                                                        className="px-6 py-3.5 border-2 border-blue-600 rounded-2xl text-blue-600 font-bold hover:bg-blue-50 transition-all disabled:opacity-50 text-sm"
                                                    >
                                                        {testingSmtp ? <Loader2 size={18} className="animate-spin" /> : "Test"}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* IMAP Connection */}
                                    <div className="space-y-4">
                                        <h3 className="text-[17px] font-bold text-slate-900 uppercase tracking-tight">IMAP connection</h3>
                                        <div className="grid grid-cols-12 gap-4">
                                            <div className="col-span-8 space-y-2">
                                                <label className="text-xs font-bold text-slate-400 ml-1 uppercase">IMAP Host*</label>
                                                <input
                                                    type="text"
                                                    name="imap_host"
                                                    value={formData.imap_host}
                                                    onChange={handleChange}
                                                    placeholder="Search on google"
                                                    className="w-full px-5 py-3.5 bg-white border-2 border-slate-100 rounded-2xl text-slate-900 font-bold placeholder:text-slate-300 focus:outline-none focus:border-indigo-500"
                                                />
                                            </div>
                                            <div className="col-span-4 space-y-2">
                                                <label className="text-xs font-bold text-slate-400 ml-1 uppercase">IMAP Port*</label>
                                                <div className="flex gap-2">
                                                    <input
                                                        type="number"
                                                        name="imap_port"
                                                        value={formData.imap_port}
                                                        onChange={handleChange}
                                                        placeholder="xxx"
                                                        className="w-full px-4 py-3.5 bg-white border-2 border-slate-100 rounded-2xl text-slate-900 font-bold placeholder:text-slate-300 focus:outline-none"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={handleTestImap}
                                                        disabled={testingImap}
                                                        className="px-6 py-3.5 border-2 border-blue-600 rounded-2xl text-blue-600 font-bold hover:bg-blue-50 transition-all disabled:opacity-50 text-sm"
                                                    >
                                                        {testingImap ? <Loader2 size={18} className="animate-spin" /> : "Test"}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end pt-6">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="px-12 py-4.5 bg-[#2563eb] rounded-[24px] text-white font-bold text-lg hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all disabled:opacity-50 flex items-center justify-center min-w-[180px]"
                            >
                                {isLoading ? (
                                    <div className="flex items-center gap-3">
                                        <Loader2 size={22} className="animate-spin" />
                                        <span>Validating...</span>
                                    </div>
                                ) : "Validate"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
