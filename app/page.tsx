"use client";

import Link from "next/link";
import {
    ArrowRight,
    CheckCircle2,
    Zap,
    Database,
    Send,
    BarChart3,
    Star
} from "lucide-react";
import LandingNavbar from "@/components/LandingNavbar";
import Footer from "@/components/Footer";

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-background text-foreground font-sans selection:bg-blue-500/30 transition-colors duration-300">

            {/* --- Navbar --- */}
            <LandingNavbar />

            {/* --- Hero Section --- */}
            <section className="relative pt-24 pb-16 overflow-hidden">
                {/* Background Gradients */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-600/5 rounded-full -z-10 dark:bg-blue-600/10" />
                <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-purple-600/5 rounded-full -z-10" />

                <div className="mx-auto max-w-6xl px-6 text-center">

                    <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-2.5 py-1 mb-6">
                        <div className="flex gap-0.5">
                            {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-2.5 h-2.5 text-amber-500 fill-amber-500" />)}
                        </div>
                        <span className="text-[10px] font-medium tracking-wide uppercase text-muted-foreground">4.9/5 on G2 & Capterra</span>
                    </div>

                    <h1 className="mx-auto max-w-3xl text-4xl font-extrabold tracking-tight leading-tight sm:text-5xl md:text-6xl mb-5">
                        The Only Tool You Need to <br className="hidden md:block" />
                        <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400">Automate B2B Sales</span>
                    </h1>

                    <p className="mx-auto max-w-xl text-base text-muted-foreground mb-8 leading-relaxed">
                        Identify high-intent prospects, enrich their profiles, and launch multi-channel outreach campaigns on complete autopilot.
                    </p>

                    <div className="mx-auto flex max-w-sm flex-col gap-2 sm:flex-row sm:items-center bg-card p-1.5 rounded-full border border-border shadow-lg">
                        <input
                            type="email"
                            placeholder="Enter your work email"
                            className="flex-1 bg-transparent px-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground outline-none"
                        />
                        <Link
                            href="/login"
                            className="group flex items-center justify-center gap-2 rounded-full bg-blue-600 px-5 py-2 text-sm font-bold text-white transition-all hover:bg-blue-500"
                        >
                            Get started free
                        </Link>
                    </div>
                    <p className="mt-3 text-[10px] text-muted-foreground">No credit card required. Cancel anytime.</p>
                </div>
            </section>

            {/* --- Features Grid --- */}
            <section className="py-16 bg-muted/30">
                <div className="mx-auto max-w-6xl px-6">
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                        <FeatureCard
                            icon={<BarChart3 className="w-5 h-5 text-blue-500" />}
                            title="Intent Scoring"
                            desc="Identify prospects visiting your site and score them based on high-intent actions."
                        />
                        <FeatureCard
                            icon={<Database className="w-5 h-5 text-purple-500" />}
                            title="Auto-Enrichment"
                            desc="Automatically find verified emails and LinkedIn profiles for every anonymous visitor."
                        />
                        <FeatureCard
                            icon={<Send className="w-5 h-5 text-pink-500" />}
                            title="Smart Sequences"
                            desc="Trigger multi-step sequences across email and LinkedIn based on real-time behavior."
                        />
                    </div>
                </div>
            </section>

            {/* --- How It Works --- */}
            <section className="py-20 relative overflow-hidden">
                <div className="mx-auto max-w-6xl px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl mb-3">How LeadGenius Works</h2>
                        <p className="text-sm text-muted-foreground">Turn cold traffic into warm conversations in four automated steps</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <StepCard number="01" title="Extract" desc="Install our pixel to identify the companies and people browsing your website in real-time." />
                        <StepCard number="02" title="Score" desc="AI-driven scoring prioritizes leads based on page views, dwell time, and firmographic fit." />
                        <StepCard number="03" title="Enrich" desc="Match data points including direct dials and LinkedIn URLs for key decision makers." />
                        <StepCard number="04" title="Outreach" desc="Sync qualified leads to your CRM or launch multi-channel automated campaigns immediately." isActive />
                    </div>
                </div>
            </section>

            {/* --- Testimonial --- */}
            <section className="py-20 bg-card border-y border-border">
                <div className="mx-auto max-w-3xl px-6 text-center">
                    <div className="flex justify-center mb-5 gap-1">
                        {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-4 h-4 text-amber-500 fill-amber-500" />)}
                    </div>
                    <blockquote className="text-xl font-medium leading-relaxed text-foreground mb-6">
                        "LeadGenius has completely transformed how our SDR team operates. We went from manual prospecting to booking <span className="text-blue-500 font-bold">3x more meetings</span> in just our first month."
                    </blockquote>
                    <div className="flex items-center justify-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500" />
                        <div className="text-left">
                            <div className="text-sm font-bold text-foreground">Sarah Jenkins</div>
                            <div className="text-xs text-muted-foreground">Head of Sales at TechStream</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- CTA Section --- */}
            <section className="py-16 px-6">
                <div className="mx-auto max-w-4xl rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-12 text-center shadow-xl shadow-blue-500/20">
                    <h2 className="text-2xl font-bold text-white sm:text-3xl mb-3">Ready to double your pipeline?</h2>
                    <p className="mx-auto max-w-lg text-blue-100 mb-8 text-sm">
                        Join 2,000+ high-growth companies using LeadGenius to automate their B2B sales development.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                        <Link
                            href="/login"
                            className="rounded-full bg-white px-6 py-2.5 text-sm font-bold text-blue-600 hover:bg-blue-50 transition-colors"
                        >
                            Get Started Free
                        </Link>
                        <Link
                            href="#"
                            className="rounded-full border border-white/30 bg-white/10 px-6 py-2.5 text-sm font-bold text-white hover:bg-white/20 transition-colors"
                        >
                            Book a Demo
                        </Link>
                    </div>
                    <div className="mt-6 flex items-center justify-center gap-5 text-[10px] text-blue-200">
                        <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3" /> 14-day free trial</span>
                        <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3" /> Unlimited seats</span>
                    </div>
                </div>
            </section>

            {/* --- Footer --- */}
            <Footer />

        </div>
    );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
    return (
        <div className="rounded-2xl border border-border bg-card p-6 transition-colors hover:border-blue-500/30 hover:shadow-lg">
            <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10">
                {icon}
            </div>
            <h3 className="mb-2 text-lg font-bold text-foreground">{title}</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">{desc}</p>
        </div>
    )
}

function StepCard({ number, title, desc, isActive }: { number: string, title: string, desc: string, isActive?: boolean }) {
    return (
        <div className={`rounded-2xl border p-5 transition-all ${isActive ? 'bg-blue-600 border-blue-600 shadow-lg shadow-blue-500/20 transform scale-[1.02]' : 'bg-card border-border hover:border-border/80'}`}>
            <div className={`text-3xl font-bold mb-3 ${isActive ? 'text-white/30' : 'text-muted-foreground/30'}`}>{number}</div>
            <h3 className={`mb-2 text-base font-bold ${isActive ? 'text-white' : 'text-foreground'}`}>{title}</h3>
            <p className={`text-sm leading-relaxed ${isActive ? 'text-blue-100' : 'text-muted-foreground'}`}>{desc}</p>
        </div>
    )
}
