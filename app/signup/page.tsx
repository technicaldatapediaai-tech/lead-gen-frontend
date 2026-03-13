"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import { toast } from "sonner";

interface RegisterResponse {
    message: string;
    user_id?: string;
    org_id?: string;
}

export default function SignupPage() {
    const router = useRouter();
    const { isAuthenticated, isLoading: authLoading } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form fields
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    
    // OTP fields
    const [isVerifying, setIsVerifying] = useState(false);
    const [otp, setOtp] = useState("");

    // Redirect if already authenticated
    useEffect(() => {
        if (!authLoading && isAuthenticated) {
            router.push("/dashboard");
        }
    }, [isAuthenticated, authLoading, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        if (password.length < 8) {
            toast.error("Password must be at least 8 characters");
            return;
        }

        if (!agreedToTerms) {
            toast.error("Please agree to the terms and conditions");
            return;
        }

        setIsSubmitting(true);

        // Register without org - org will be created in setup
        const { data, error } = await api.post<RegisterResponse>("/api/auth/register", {
            email,
            password,
            full_name: fullName || undefined,
        });

        if (error) {
            toast.error(error.detail || "Registration failed. Please try again.");
            setIsSubmitting(false);
            return;
        }

        if (data) {
            toast.success("Registration successful! Please check your email for the OTP.");
            setIsVerifying(true);
        }

        setIsSubmitting(false);
    };

    const handleVerifyOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        if (otp.length < 6) {
            toast.error("Please enter a valid 6-digit code");
            return;
        }

        setIsSubmitting(true);

        const { error } = await api.post("/api/auth/verify-email", {
            token: otp,
        });

        if (error) {
            toast.error(error.detail || "Verification failed. Please check the code.");
            setIsSubmitting(false);
            return;
        }

        toast.success("Email verified successfully! You can now log in.");
        router.push("/login");
        setIsSubmitting(false);
    };

    return (
        <main className="min-h-screen w-full bg-background text-foreground transition-colors duration-300">
            <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[1fr_460px]">
                {/* LEFT - Hero */}
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

                    {/* Features */}
                    <div className="absolute top-1/2 left-1/2 w-[500px] max-w-[90%] -translate-x-1/2 -translate-y-1/2">
                        <h2 className="text-3xl font-bold text-white mb-8">
                            Start generating leads in minutes
                        </h2>
                        <div className="space-y-4">
                            <Feature icon="🎯" text="Extract leads from LinkedIn profiles, groups & posts" />
                            <Feature icon="✉️" text="Enrich with verified emails and phone numbers" />
                            <Feature icon="🧠" text="AI-powered lead scoring and persona matching" />
                            <Feature icon="🚀" text="Multi-channel outreach campaigns" />
                        </div>
                    </div>
                </aside>

                {/* RIGHT - Form */}
                <section className="border-l border-border bg-card px-6 py-10 sm:px-10 flex flex-col justify-center transition-colors duration-300">
                    {/* Logo */}
                    <div className="flex items-center gap-3 mb-8">
                        <div className="grid h-9 w-9 place-items-center rounded-xl border border-border bg-secondary/50">
                            <div className="grid h-6 w-6 place-items-center rounded-lg bg-blue-600">
                                <span className="text-xs font-bold text-white">LG</span>
                            </div>
                        </div>
                        <div className="text-sm font-semibold text-foreground">
                            LeadGenius
                        </div>
                    </div>

                    {isVerifying ? (
                        <form onSubmit={handleVerifyOTP} className="mt-8 space-y-6">
                            <div className="text-center">
                                <p className="text-sm text-muted-foreground mb-6">
                                    We've sent a 6-digit verification code to <span className="font-semibold text-foreground">{email}</span>. 
                                    Please enter it below to confirm your account.
                                </p>
                                
                                <div className="flex justify-center">
                                    <input
                                        className="h-16 w-full max-w-[280px] rounded-2xl border-2 border-input bg-background px-4 text-center text-3xl font-bold tracking-[8px] text-foreground outline-none focus:border-blue-500 transition-all placeholder:text-muted-foreground/30"
                                        placeholder="000000"
                                        type="text"
                                        maxLength={6}
                                        required
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ""))}
                                        disabled={isSubmitting}
                                        autoFocus
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex h-12 w-full items-center justify-center rounded-xl bg-blue-600 text-sm font-semibold text-white hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20 active:scale-95 disabled:opacity-50"
                            >
                                {isSubmitting ? (
                                    <div className="flex items-center gap-2">
                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                        Verifying...
                                    </div>
                                ) : (
                                    "Verify Account"
                                )}
                            </button>

                            <div className="text-center space-y-4">
                                <p className="text-xs text-muted-foreground">
                                    Didn't receive the code?{" "}
                                    <button 
                                        type="button"
                                        onClick={async () => {
                                            const { error } = await api.post("/api/auth/resend-verification", { email });
                                            if (error) toast.error("Failed to resend code");
                                            else toast.success("New code sent to your email!");
                                        }}
                                        className="font-semibold text-blue-400 hover:text-blue-300"
                                    >
                                        Resend Code
                                    </button>
                                </p>
                                <button
                                    type="button"
                                    onClick={() => setIsVerifying(false)}
                                    className="text-xs text-muted-foreground hover:text-foreground"
                                >
                                    ← Back to signup
                                </button>
                            </div>
                        </form>
                    ) : (
                        <>
                            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
                                Create your account
                            </h1>
                            <p className="mt-2 text-sm text-muted-foreground">
                                Start your 14-day free trial. No credit card required.
                            </p>

                            {/* Social buttons */}
                            <div className="mt-6 grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
                                        window.location.href = `${API_URL}/api/auth/google/login`;
                                    }}
                                    className="flex h-11 items-center justify-center gap-2 rounded-xl border border-input bg-background text-sm font-semibold text-foreground hover:bg-accent transition-colors"
                                >
                                    Google
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
                                        window.location.href = `${API_URL}/api/auth/linkedin/login`;
                                    }}
                                    className="flex h-11 items-center justify-center gap-2 rounded-xl border border-input bg-background text-sm font-semibold text-foreground hover:bg-accent transition-colors"
                                >
                                    LinkedIn
                                </button>
                            </div>

                            {/* Divider */}
                            <div className="my-6 flex items-center gap-4 text-xs text-muted-foreground">
                                <div className="h-px flex-1 bg-border" />
                                <span>Or continue with email</span>
                                <div className="h-px flex-1 bg-border" />
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="mb-2 block text-xs font-medium text-muted-foreground">
                                        Full Name
                                    </label>
                                    <input
                                        className="h-11 w-full rounded-xl border border-input bg-background px-4 text-sm text-foreground outline-none placeholder:text-muted-foreground/50 focus:border-blue-500/60 focus:ring-4 focus:ring-blue-500/10 transition-colors"
                                        placeholder="John Doe"
                                        type="text"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        disabled={isSubmitting}
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-xs font-medium text-muted-foreground">
                                        Work Email *
                                    </label>
                                    <input
                                        className="h-11 w-full rounded-xl border border-input bg-background px-4 text-sm text-foreground outline-none placeholder:text-muted-foreground/50 focus:border-blue-500/60 focus:ring-4 focus:ring-blue-500/10 transition-colors"
                                        placeholder="name@company.com"
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        disabled={isSubmitting}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="mb-2 block text-xs font-medium text-muted-foreground">
                                            Password *
                                        </label>
                                        <div className="relative">
                                            <input
                                                className="h-11 w-full rounded-xl border border-input bg-background px-4 pr-16 text-sm text-foreground outline-none placeholder:text-muted-foreground/50 focus:border-blue-500/60 focus:ring-4 focus:ring-blue-500/10 transition-colors"
                                                placeholder="••••••••"
                                                type={showPassword ? "text" : "password"}
                                                required
                                                minLength={8}
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                disabled={isSubmitting}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword((v) => !v)}
                                                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg border border-input bg-secondary/50 px-2 py-1 text-xs text-muted-foreground hover:bg-secondary transition-colors"
                                            >
                                                {showPassword ? "Hide" : "Show"}
                                            </button>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="mb-2 block text-xs font-medium text-muted-foreground">
                                            Confirm Password *
                                        </label>
                                        <input
                                            className="h-11 w-full rounded-xl border border-input bg-background px-4 text-sm text-foreground outline-none placeholder:text-muted-foreground/50 focus:border-blue-500/60 focus:ring-4 focus:ring-blue-500/10 transition-colors"
                                            placeholder="••••••••"
                                            type={showPassword ? "text" : "password"}
                                            required
                                            minLength={8}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                </div>

                                <label className="flex items-start gap-2 text-xs text-muted-foreground">
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4 mt-0.5 accent-blue-600"
                                        checked={agreedToTerms}
                                        onChange={(e) => setAgreedToTerms(e.target.checked)}
                                    />
                                    <span>
                                        I agree to the{" "}
                                        <a href="/terms" className="text-blue-400 hover:text-blue-300">Terms of Service</a>
                                        {" "}and{" "}
                                        <a href="/privacy" className="text-blue-400 hover:text-blue-300">Privacy Policy</a>
                                    </span>
                                </label>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="mt-2 flex h-11 w-full items-center justify-center rounded-xl bg-blue-600 text-sm font-semibold text-white hover:bg-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? (
                                        <div className="flex items-center gap-2">
                                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                            Creating account...
                                        </div>
                                    ) : (
                                        "Create Account"
                                    )}
                                </button>

                                <p className="pt-2 text-center text-xs text-muted-foreground">
                                    Already have an account?{" "}
                                    <button
                                        type="button"
                                        onClick={() => router.push("/login")}
                                        className="font-semibold text-blue-400 hover:text-blue-300"
                                    >
                                        Log in
                                    </button>
                                </p>

                                <p className="pt-3 text-center text-[11px] text-muted-foreground/60">
                                    SOC2 Type II Compliant &amp; Encrypted
                                </p>
                            </form>
                        </>
                    )}
                </section>
            </div>
        </main>
    );
}

function Feature({ icon, text }: { icon: string; text: string }) {
    return (
        <div className="flex items-center gap-3 text-white/80">
            <span className="text-xl">{icon}</span>
            <span className="text-sm">{text}</span>
        </div>
    );
}
