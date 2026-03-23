"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { api } from "@/lib/api";

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [view, setView] = useState<"email" | "otp">("email");
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [countdown, setCountdown] = useState(0);

    // Initial countdown check/timer
    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) {
            toast.error("Please enter your email");
            return;
        }
        setIsSubmitting(true);

        try {
            const res = await api.post<any>("/api/auth/forgot-password", { email });
            if (res.error) throw res.error;
            
            const data = res.data;
            if (data?._dev_reset_token) {
                console.log("OTP Backup Information (Forgot Password):", data._dev_reset_token);
                if (data.message?.includes("could not send")) {
                    toast.warning(data.message);
                } else {
                    toast.success("If the email exists, a reset code has been sent!");
                }
            } else {
                toast.success("If the email exists, a reset code has been sent!");
            }
            
            setView("otp");
            setCountdown(60); // Start 60s cooldown
        } catch (error: any) {
            toast.error(error?.detail || "Failed to send reset code. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleResendCode = async () => {
        if (countdown > 0 || isResending) return;
        setIsResending(true);
        try {
            const res = await api.post<any>("/api/auth/forgot-password", { email });
            if (res.error) throw res.error;
            
            if (res.data?._dev_reset_token) {
                console.log("OTP Backup Information (Resend Forgot):", res.data._dev_reset_token);
            }
            
            toast.success("A new verification code has been generated.");
            setCountdown(60);
        } catch (error: any) {
            toast.error("Failed to resend code.");
        } finally {
            setIsResending(false);
        }
    };

    const handleResetSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!otp || !newPassword) {
            toast.error("Please enter the verification code and your new password");
            return;
        }
        setIsSubmitting(true);

        try {
            const res = await api.post("/api/auth/reset-password", { token: otp, new_password: newPassword });
            if (res.error) throw res.error;
            toast.success("Password reset successfully! Please log in.");
            router.push("/login");
        } catch (error: any) {
            let msg = error?.detail || error?.message || "Failed to reset password.";
            if (Array.isArray(msg)) msg = msg[0]?.msg;
            toast.error(typeof msg === 'string' ? msg : "Failed to reset password. Please check your code.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="min-h-screen w-full bg-background text-foreground transition-colors duration-300">
            <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[460px_1fr]">
                {/* LEFT */}
                <section className="border-r border-border bg-card px-6 py-10 sm:px-10 flex flex-col justify-center transition-colors duration-300">
                    {/* Logo */}
                    <div className="absolute top-10 left-6 sm:left-10 flex items-center gap-3">
                        <div className="grid h-9 w-9 place-items-center rounded-xl border border-border bg-secondary/50">
                            <div className="grid h-6 w-6 place-items-center rounded-lg bg-blue-600">
                                <span className="text-xs font-bold text-white">LG</span>
                            </div>
                        </div>
                        <div className="text-sm font-semibold text-foreground">
                            LeadGenius
                        </div>
                    </div>

                    {view === "email" ? (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
                                Forgot password?
                            </h1>
                            <p className="mt-2 text-sm text-muted-foreground">
                                Enter your email below to receive a 6-digit verification code.
                            </p>

                            <form onSubmit={handleEmailSubmit} className="mt-8 space-y-4">
                                <div>
                                    <label 
                                        htmlFor="email-input"
                                        className="mb-2 block text-xs font-medium text-muted-foreground"
                                    >
                                        Work Email
                                    </label>
                                    <input
                                        id="email-input"
                                        name="email"
                                        className="h-11 w-full rounded-xl border border-input bg-background px-4 text-sm text-foreground outline-none placeholder:text-muted-foreground/50 focus:border-blue-500/60 focus:ring-4 focus:ring-blue-500/10 transition-colors"
                                        placeholder="name@company.com"
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        disabled={isSubmitting}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting || !email}
                                    className="mt-4 flex h-11 w-full items-center justify-center rounded-xl bg-blue-600 text-sm font-semibold text-white hover:bg-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? (
                                        <div className="flex items-center gap-2">
                                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                            Sending...
                                        </div>
                                    ) : (
                                        "Send Code"
                                    )}
                                </button>

                                <p className="pt-2 text-center text-xs text-muted-foreground">
                                    Remember your password?{" "}
                                    <button
                                        type="button"
                                        onClick={() => router.push("/login")}
                                        className="font-semibold text-blue-400 hover:text-blue-300"
                                    >
                                        Back to login
                                    </button>
                                </p>
                            </form>
                        </div>
                    ) : (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
                                Reset password
                            </h1>
                            <p className="mt-2 text-sm text-muted-foreground">
                                We've sent a code to <span className="font-semibold text-foreground">{email}</span>.
                            </p>

                            <form onSubmit={handleResetSubmit} className="mt-8 space-y-4">
                                <div>
                                    <label 
                                        htmlFor="otp-input"
                                        className="mb-2 block text-xs font-medium text-muted-foreground"
                                    >
                                        6-Digit Verification Code
                                    </label>
                                    <input
                                        id="otp-input"
                                        name="otp"
                                        className="h-11 w-full rounded-xl border border-input bg-background px-4 text-center tracking-widest text-lg font-mono text-foreground outline-none placeholder:text-muted-foreground/50 focus:border-blue-500/60 focus:ring-4 focus:ring-blue-500/10 transition-colors"
                                        placeholder="000000"
                                        type="text"
                                        maxLength={6}
                                        autoComplete="one-time-code"
                                        required
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        disabled={isSubmitting}
                                    />
                                </div>

                                <div>
                                    <label 
                                        htmlFor="new-password-input"
                                        className="mb-2 mt-4 block text-xs font-medium text-muted-foreground"
                                    >
                                        New Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="new-password-input"
                                            name="new-password"
                                            className="h-11 w-full rounded-xl border border-input bg-background px-4 pr-12 text-sm text-foreground outline-none placeholder:text-muted-foreground/50 focus:border-blue-500/60 focus:ring-4 focus:ring-blue-500/10 transition-colors"
                                            placeholder="••••••••"
                                            type={showPassword ? "text" : "password"}
                                            autoComplete="new-password"
                                            required
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            disabled={isSubmitting}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword((v) => !v)}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg border border-input bg-secondary/50 px-3 py-2 text-xs text-muted-foreground hover:bg-secondary transition-colors"
                                        >
                                            {showPassword ? "Hide" : "Show"}
                                        </button>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting || !otp || !newPassword}
                                    className="mt-6 flex h-11 w-full items-center justify-center rounded-xl bg-blue-600 text-sm font-semibold text-white hover:bg-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? (
                                        <div className="flex items-center gap-2">
                                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                            Resetting...
                                        </div>
                                    ) : (
                                        "Reset Password"
                                    )}
                                </button>

                                <div className="text-center space-y-4 pt-4 mt-2">
                                    <p className="text-xs text-muted-foreground p-2 rounded-lg bg-secondary/30">
                                        OTP not received?{" "}
                                        {countdown > 0 ? (
                                            <span className="font-semibold text-blue-400">Resend in {countdown}s</span>
                                        ) : (
                                            <button 
                                                type="button"
                                                onClick={handleResendCode}
                                                disabled={isResending}
                                                className="font-semibold text-blue-400 hover:text-blue-300 hover:underline disabled:opacity-50"
                                            >
                                                {isResending ? "Click resend" : "Resend Code"}
                                            </button>
                                        )}
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() => setView("email")}
                                        className="text-xs text-muted-foreground hover:text-foreground hover:underline transition-colors"
                                    >
                                        ← Back to email entry
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </section>

                {/* RIGHT */}
                <aside className="relative hidden overflow-hidden lg:block bg-[#050814]">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(37,99,255,0.16),transparent_55%),radial-gradient(circle_at_70%_30%,rgba(34,211,238,0.12),transparent_55%),linear-gradient(180deg,#050814,#070B13)]" />

                    {/* Network style SVG */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-90">
                        <svg viewBox="0 0 900 520" className="w-[92%]">
                            <defs>
                                <filter id="glow">
                                    <feGaussianBlur stdDeviation="3.5" result="blur" />
                                    <feMerge>
                                        <feMergeNode in="blur" />
                                        <feMergeNode in="SourceGraphic" />
                                    </feMerge>
                                </filter>
                            </defs>

                            <g stroke="#56E0FF" strokeOpacity="0.55" strokeWidth="2">
                                <path d="M110 330 L230 220 L390 260 L520 160 L700 210 L820 120" />
                                <path d="M110 330 L260 380 L420 360 L560 420 L740 350 L820 120" />
                                <path d="M230 220 L260 380 L390 260 L420 360 L520 160 L560 420" />
                            </g>

                            <g filter="url(#glow)" fill="#9EE7FF">
                                {[
                                    [110, 330],
                                    [230, 220],
                                    [390, 260],
                                    [520, 160],
                                    [700, 210],
                                    [820, 120],
                                    [260, 380],
                                    [420, 360],
                                    [560, 420],
                                ].map(([x, y], i) => (
                                    <circle key={i} cx={x} cy={y} r={10} opacity="0.9" />
                                ))}
                            </g>
                        </svg>
                    </div>

                    {/* Content */}
                    <div className="absolute bottom-10 left-1/2 w-[560px] max-w-[92%] -translate-x-1/2 rounded-2xl border border-white/10 bg-white/[0.04] p-8 backdrop-blur">
                        <h3 className="text-xl font-bold text-white mb-2">Secure Reset</h3>
                        <p className="text-white/70 leading-relaxed text-sm">
                            We take security seriously. All password reset requests are logged and monitored. 
                            If you didn't request this, please contact support immediately.
                        </p>
                    </div>
                </aside>
            </div>
        </main>
    );
}
