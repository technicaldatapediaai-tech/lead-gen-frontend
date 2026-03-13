"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export default function LoginPage() {
    const router = useRouter();
    const { login, isAuthenticated, isLoading: authLoading } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Redirect if already authenticated
    useEffect(() => {
        if (!authLoading && isAuthenticated) {
            router.push("/dashboard");
        }
    }, [isAuthenticated, authLoading, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const result = await login(email, password);

        if (result.success) {
            toast.success("Login successful!");
            router.push("/dashboard");
        } else {
            toast.error(result.error || "Login failed. Please check your credentials.");
        }

        setIsSubmitting(false);
    };

    return (
        <main className="min-h-screen w-full bg-background text-foreground transition-colors duration-300">
            <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[460px_1fr]">
                {/* LEFT */}
                <section className="border-r border-border bg-card px-6 py-10 sm:px-10 transition-colors duration-300">
                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <div className="grid h-9 w-9 place-items-center rounded-xl border border-border bg-secondary/50">
                            <div className="grid h-6 w-6 place-items-center rounded-lg bg-blue-600">
                                <span className="text-xs font-bold text-white">LG</span>
                            </div>
                        </div>
                        <div className="text-sm font-semibold text-foreground">
                            LeadGenius
                        </div>
                    </div>

                    <h1 className="mt-8 text-3xl font-semibold tracking-tight text-foreground">
                        Welcome back
                    </h1>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Log in to access your lead intelligence dashboard.
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
                                Work Email
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

                        <div>
                            <div className="mb-2 flex items-center justify-between">
                                <label className="block text-xs font-medium text-muted-foreground">
                                    Password
                                </label>
                                <button
                                    type="button"
                                    className="text-xs font-semibold text-blue-400 hover:text-blue-300"
                                >
                                    Forgot password?
                                </button>
                            </div>

                            <div className="relative">
                                <input
                                    className="h-11 w-full rounded-xl border border-input bg-background px-4 pr-12 text-sm text-foreground outline-none placeholder:text-muted-foreground/50 focus:border-blue-500/60 focus:ring-4 focus:ring-blue-500/10 transition-colors"
                                    placeholder="••••••••"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
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

                        <label className="flex items-center gap-2 text-xs text-muted-foreground">
                            <input type="checkbox" className="h-4 w-4 accent-blue-600" />
                            Remember me for 30 days
                        </label>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="mt-2 flex h-11 w-full items-center justify-center rounded-xl bg-blue-600 text-sm font-semibold text-white hover:bg-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                <div className="flex items-center gap-2">
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                    Logging in...
                                </div>
                            ) : (
                                "Log In"
                            )}
                        </button>

                        <p className="pt-2 text-center text-xs text-muted-foreground">
                            New here?{" "}
                            <button
                                type="button"
                                onClick={() => router.push("/signup")}
                                className="font-semibold text-blue-400 hover:text-blue-300"
                            >
                                Create an account
                            </button>
                        </p>

                        <p className="pt-3 text-center text-[11px] text-muted-foreground/60">
                            SOC2 Type II Compliant &amp; Encrypted
                        </p>
                    </form>
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

                    {/* Quote */}
                    <div className="absolute bottom-10 left-1/2 w-[560px] max-w-[92%] -translate-x-1/2 rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur">
                        <div className="text-yellow-300">★★★★★</div>
                        <p className="mt-3 text-lg leading-snug text-white/90">
                            "LeadGenius has completely transformed our outbound strategy.
                            We've seen a 3x increase in qualified leads since implementing
                            their scoring models."
                        </p>
                        <div className="mt-4 flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500/40 to-cyan-400/20 ring-1 ring-white/15" />
                            <div>
                                <div className="text-sm font-semibold text-white">Marcus Chen</div>
                                <div className="text-xs text-white/55">
                                    VP of Sales at TechFlow
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </main>
    );
}
