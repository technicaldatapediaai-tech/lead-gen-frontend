"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { api } from "@/lib/api";

export default function VerifyEmailPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [email, setEmail] = useState(searchParams.get("email") || "");
    const [otp, setOtp] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [countdown, setCountdown] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const handleVerifySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!otp || otp.length < 6) {
            toast.error("Please enter a valid 6-digit code");
            return;
        }
        setIsSubmitting(true);

        try {
            const { error } = await api.post("/api/auth/verify-email", { token: otp });
            if (error) throw error;
            
            toast.success("Email verified successfully! You can now log in.");
            router.push("/login");
        } catch (error: any) {
            toast.error(error?.detail || "Verification failed. Please check your code.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleResendCode = async () => {
        if (!email) {
            toast.error("Please provide your email address first");
            return;
        }
        if (countdown > 0 || isResending) return;
        
        setIsResending(true);
        try {
            const { data, error } = await api.post<any>("/api/auth/resend-verification", { email });
            if (error) throw error;
            
            if (data?._dev_verification_token) {
                console.log("OTP Backup Information (Verification):", data._dev_verification_token);
                toast.success("A new verification code has been generated. Check the console or your email.");
            } else {
                toast.success("A new verification code has been sent!");
            }
            setCountdown(30);
        } catch (error: any) {
            toast.error(error?.detail || "Failed to resend code.");
        } finally {
            setIsResending(false);
        }
    };

    return (
        <main className="min-h-screen w-full bg-background text-foreground transition-colors duration-300">
            <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[460px_1fr]">
                {/* LEFT */}
                <section className="border-r border-border bg-card px-6 py-10 sm:px-10 flex flex-col justify-center transition-colors duration-300">
                    <div className="absolute top-10 left-6 sm:left-10 flex items-center gap-3">
                        <div className="grid h-9 w-9 place-items-center rounded-xl border border-border bg-secondary/50">
                            <div className="grid h-6 w-6 place-items-center rounded-lg bg-blue-600">
                                <span className="text-xs font-bold text-white">LG</span>
                            </div>
                        </div>
                        <div className="text-sm font-semibold text-foreground">LeadGenius</div>
                    </div>

                    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                        <h1 className="text-3xl font-semibold tracking-tight text-foreground">Verify your email</h1>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Enter the 6-digit code sent to your email to activate your account.
                        </p>

                        <form onSubmit={handleVerifySubmit} className="mt-8 space-y-4">
                            {!email && (
                                <div>
                                    <label htmlFor="email" className="mb-2 block text-xs font-medium text-muted-foreground">Email Address</label>
                                    <input
                                        id="email"
                                        className="h-11 w-full rounded-xl border border-input bg-background px-4 text-sm text-foreground outline-none"
                                        placeholder="name@company.com"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            )}

                            <div>
                                <label htmlFor="otp" className="mb-2 block text-xs font-medium text-muted-foreground">6-Digit Code</label>
                                <input
                                    id="otp"
                                    className="h-11 w-full rounded-xl border border-input bg-background px-4 text-center tracking-widest text-lg font-mono text-foreground outline-none focus:border-blue-500/60 transition-colors"
                                    placeholder="000000"
                                    maxLength={6}
                                    required
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    disabled={isSubmitting}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting || !otp}
                                className="mt-4 flex h-11 w-full items-center justify-center rounded-xl bg-blue-600 text-sm font-semibold text-white hover:bg-blue-500 transition-colors disabled:opacity-50"
                            >
                                {isSubmitting ? "Verifying..." : "Verify Email"}
                            </button>

                            <div className="text-center pt-4">
                                <p className="text-xs text-muted-foreground">
                                    Didn't receive the code?{" "}
                                    {countdown > 0 ? (
                                        <span className="font-semibold text-blue-400">Resend in {countdown}s</span>
                                    ) : (
                                        <button 
                                            type="button"
                                            onClick={handleResendCode}
                                            disabled={isResending}
                                            className="font-semibold text-blue-400 hover:text-blue-300 hover:underline"
                                        >
                                            {isResending ? "Sending..." : "Resend Code"}
                                        </button>
                                    )}
                                </p>
                                <button
                                    type="button"
                                    onClick={() => router.push("/login")}
                                    className="mt-6 text-xs text-muted-foreground hover:text-foreground hover:underline"
                                >
                                    Back to login
                                </button>
                            </div>
                        </form>
                    </div>
                </section>

                {/* RIGHT */}
                <aside className="relative hidden lg:block bg-[#050814]">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(37,99,255,0.16),transparent_55%),linear-gradient(180deg,#050814,#070B13)]" />
                    <div className="absolute bottom-10 left-1/2 w-[460px] -translate-x-1/2 rounded-2xl border border-white/10 bg-white/[0.04] p-8 backdrop-blur">
                        <h3 className="text-xl font-bold text-white mb-2">Account Verification</h3>
                        <p className="text-white/70 leading-relaxed text-sm">
                            We use double-blind verification to protect your account. Please enter the code sent to your email to verify your identity.
                        </p>
                    </div>
                </aside>
            </div>
        </main>
    );
}
