"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
    Zap,
    CheckCircle2,
    Calendar,
    Crown,
    Calculator,
    FileText,
    Send,
    LayoutDashboard,
    Megaphone,
    Wallet,
    PieChart,
    Headphones,
    BookOpen,
    ShieldCheck,
    Palette,
    Plus,
    Minus,
    ChevronDown,
    ArrowRight,
    User,
    Mail,
    Lock,
    Globe,
    Check
} from "lucide-react";
import LandingNavbar from "@/components/LandingNavbar";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Switch } from "@/components/ui/switch";

export default function AffiliateProgramPage() {
    const [referrals, setReferrals] = useState([10]);
    const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

    const calculateEarnings = (refCount: number, planPrice: number, commissionRate: number) => {
        return Math.round(refCount * planPrice * commissionRate);
    };

    // Assumptions for calculator
    const monthlyPrices = { basic: 49, pro: 99, advanced: 199 };
    const yearlyPrices = { basic: 490, pro: 990, advanced: 1990 }; // 10x monthly

    const prices = billingCycle === "monthly" ? monthlyPrices : yearlyPrices;
    const commission = 0.30;

    const basicEarnings = calculateEarnings(referrals[0], prices.basic, commission);
    const proEarnings = calculateEarnings(referrals[0], prices.pro, commission);
    const advancedEarnings = calculateEarnings(referrals[0], prices.advanced, commission);

    return (
        <div className="min-h-screen bg-background text-foreground font-sans selection:bg-blue-500/30">
            <LandingNavbar />

            {/* --- Hero Section --- */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-gradient-to-bl from-purple-100/50 to-transparent -z-10 rounded-bl-[100px]" />

                <div className="mx-auto max-w-6xl px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    {/* Hero Illustration (Left) */}
                    <div className="lg:col-span-6 relative flex justify-center lg:justify-start">
                        {/* Placeholder for Illustration */}
                        <div className="relative w-full max-w-lg aspect-[4/3]">
                            <div className="absolute inset-0 bg-blue-100 dark:bg-blue-900/30 rounded-[3rem] transform -rotate-3 opacity-50" />
                            <div className="absolute inset-0 bg-card dark:bg-slate-900 rounded-[3rem] shadow-2xl border border-border overflow-hidden flex items-center justify-center p-8">
                                <div className="space-y-6 w-full max-w-xs text-center opacity-80">
                                    <div className="mx-auto w-32 h-32 bg-purple-100 rounded-full flex items-center justify-center mb-6 relative">
                                        <div className="absolute inset-0 bg-purple-200 rounded-full animate-ping opacity-20" />
                                        <User className="h-16 w-16 text-purple-600" />
                                        {/* Flying elements */}
                                        <div className="absolute -top-4 -right-4 bg-card p-2 rounded-xl shadow-lg border border-border">
                                            <Wallet className="h-6 w-6 text-green-500" />
                                        </div>
                                        <div className="absolute -bottom-2 -left-4 bg-card p-2 rounded-xl shadow-lg border border-border">
                                            <PieChart className="h-6 w-6 text-blue-500" />
                                        </div>
                                    </div>
                                    <h3 className="text-2xl font-bold text-foreground">Affiliate Partner</h3>
                                    <p className="text-muted-foreground">Join our program and start earning passive income today.</p>
                                    <div className="flex justify-center gap-2">
                                        <div className="h-2 w-8 bg-purple-200 rounded-full" />
                                        <div className="h-2 w-2 bg-purple-300 rounded-full" />
                                        <div className="h-2 w-2 bg-purple-300 rounded-full" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Hero Form (Right) */}
                    <div className="lg:col-span-6">
                        <div className="mb-8 pl-4">
                            <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-4 text-foreground">
                                Join the LeadGenius <br />
                                <span className="text-blue-600">Affiliate Program</span>
                            </h1>
                            <p className="text-lg text-muted-foreground">
                                Earn recurring commissions by recommending the best B2B lead generation tool.
                            </p>
                        </div>

                        <div className="bg-card p-8 rounded-3xl shadow-xl shadow-blue-900/5 border border-border">
                            <form className="space-y-5">
                                <div className="grid grid-cols-2 gap-5">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">First name</label>
                                        <input type="text" className="w-full px-4 py-3 rounded-xl border border-border bg-muted/50 focus:bg-background focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium" placeholder="John" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Last name</label>
                                        <input type="text" className="w-full px-4 py-3 rounded-xl border border-border bg-muted/50 focus:bg-background focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium" placeholder="Doe" />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Email address</label>
                                    <input type="email" className="w-full px-4 py-3 rounded-xl border border-border bg-muted/50 focus:bg-background focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium" placeholder="john@company.com" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Password</label>
                                    <input type="password" className="w-full px-4 py-3 rounded-xl border border-border bg-muted/50 focus:bg-background focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium" placeholder="••••••••" />
                                </div>

                                <div className="pt-2">
                                    <label className="flex items-start gap-3 text-sm text-muted-foreground mb-6 cursor-pointer group">
                                        <div className="relative flex items-center">
                                            <input type="checkbox" className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-border shadow-sm checked:border-blue-600 checked:bg-blue-600 transition-all" />
                                            <Check className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                                        </div>
                                        <span className="group-hover:text-foreground transition-colors">I agree to the <span className="text-blue-600 font-medium underline decoration-blue-200 underline-offset-4">Affiliate Program Terms</span>.</span>
                                    </label>
                                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all hover:scale-[1.01] active:scale-[0.99] shadow-xl shadow-blue-500/20 text-lg">
                                        Become an Affiliate
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- Commission Structure --- */}
            <section className="py-24">
                <div className="mx-auto max-w-6xl px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl lg:text-4xl font-extrabold text-foreground mb-4">Commission Structure</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                            Build a sustainable income stream with our generous recurring commissions.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        {/* Monthly Card */}
                        <div className="bg-card border border-border rounded-[2.5rem] p-10 relative overflow-hidden flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
                            <div>
                                <div className="flex items-center gap-2 mb-6 text-foreground">
                                    <div className="p-2 bg-blue-100 rounded-lg dark:bg-blue-900/40">
                                        <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <h3 className="text-xl font-bold">Monthly Subscription</h3>
                                </div>
                                <div className="space-y-6">
                                    <div>
                                        <div className="text-5xl font-extrabold text-blue-600 mb-1">35%</div>
                                        <div className="text-sm font-medium text-slate-400">First Month</div>
                                    </div>
                                    <div>
                                        <div className="text-5xl font-extrabold text-blue-600 dark:text-blue-500 mb-1">20%</div>
                                        <div className="text-sm font-medium text-muted-foreground">Recurring</div>
                                    </div>
                                </div>
                            </div>
                            <div className="hidden sm:block">
                                <Calendar className="w-40 h-40 text-foreground/20 stroke-[1.5]" />
                            </div>
                        </div>

                        {/* Annual Card */}
                        <div className="bg-card border border-border rounded-[2.5rem] p-10 relative overflow-hidden flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
                            <div>
                                <div className="flex items-center gap-2 mb-6 text-foreground">
                                    <div className="p-2 bg-amber-100 rounded-lg dark:bg-amber-900/40">
                                        <Crown className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                                    </div>
                                    <h3 className="text-xl font-bold">Annual Subscription</h3>
                                </div>
                                <div className="space-y-6">
                                    <div>
                                        <div className="text-5xl font-extrabold text-amber-500 mb-1">30%</div>
                                        <div className="text-sm font-medium text-slate-400">First Year</div>
                                    </div>
                                    <div>
                                        <div className="text-5xl font-extrabold text-amber-500 mb-1">30%</div>
                                        <div className="text-sm font-medium text-muted-foreground">Renewals</div>
                                    </div>
                                </div>
                            </div>
                            <div className="hidden sm:block">
                                <Crown className="w-40 h-40 text-foreground/20 stroke-[1.5]" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- Earnings Calculator --- */}
            <section className="py-24 bg-card border-y border-border relative">
                <div className="mx-auto max-w-6xl px-6 text-center">
                    <h2 className="text-3xl lg:text-4xl font-extrabold text-foreground mb-4">How much can you earn?</h2>
                    <p className="text-muted-foreground mb-10 max-w-lg mx-auto">Adjust the slider to see your potential earnings based on the plan type.</p>

                    <div className="max-w-xl mx-auto mb-16 px-8 space-y-8">
                        <div className="flex items-center justify-center gap-3">
                            <span className={`text-sm font-bold ${billingCycle === 'monthly' ? 'text-blue-600' : 'text-muted-foreground'}`}>Monthly</span>
                            <Switch checked={billingCycle === 'yearly'} onCheckedChange={(c) => setBillingCycle(c ? 'yearly' : 'monthly')} />
                            <span className={`text-sm font-bold ${billingCycle === 'yearly' ? 'text-blue-600' : 'text-muted-foreground'}`}>Yearly</span>
                        </div>

                        <div>
                            <Slider
                                defaultValue={[10]}
                                max={50}
                                step={1}
                                onValueChange={setReferrals}
                                className="w-full py-4"
                            />
                            <div className="mt-4 font-bold text-lg text-blue-600">
                                {referrals} Referrals / {billingCycle === 'monthly' ? 'mo' : 'yr'}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                        {/* Basic Plan */}
                        <div className="bg-card rounded-3xl p-8 border border-border shadow-xl shadow-slate-200/50 dark:shadow-none flex flex-col items-center">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="h-2 w-2 rounded-full bg-slate-300 dark:bg-slate-600" />
                                <span className="font-bold text-foreground">Basic Plan</span>
                            </div>
                            <div className="text-4xl font-black text-foreground mb-2">${basicEarnings}</div>
                            <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{billingCycle === 'monthly' ? 'per month' : 'per year'}</div>
                        </div>

                        {/* Pro Plan */}
                        <div className="bg-card rounded-3xl p-10 border-2 border-primary shadow-2xl shadow-blue-500/10 flex flex-col items-center transform scale-110 z-10 relative">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-900 text-white dark:bg-primary dark:text-primary-foreground text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                Most Popular
                            </div>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="h-2 w-2 rounded-full bg-blue-500" />
                                <span className="font-bold text-blue-600 dark:text-blue-400">Pro Plan</span>
                            </div>
                            <div className="text-5xl font-black text-foreground mb-2">${proEarnings}</div>
                            <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{billingCycle === 'monthly' ? 'per month' : 'per year'}</div>
                        </div>

                        {/* Advanced Plan */}
                        <div className="bg-card rounded-3xl p-8 border border-border shadow-xl shadow-slate-200/50 dark:shadow-none flex flex-col items-center">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="h-2 w-2 rounded-full bg-purple-500" />
                                <span className="font-bold text-foreground">Advanced Plan</span>
                            </div>
                            <div className="text-4xl font-black text-foreground mb-2">${advancedEarnings}</div>
                            <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{billingCycle === 'monthly' ? 'per month' : 'per year'}</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- Getting Started --- */}
            <section className="py-24 bg-muted/30">
                <div className="mx-auto max-w-6xl px-6">
                    <div className="text-center mb-20">
                        <h2 className="text-3xl lg:text-4xl font-extrabold text-foreground mb-4">Getting Started is So Easy</h2>
                        <p className="text-muted-foreground">Follow these simple steps to become a partner.</p>
                    </div>

                    <div className="max-w-3xl mx-auto space-y-12 relative">
                        {/* Connecting Line */}
                        <div className="absolute left-[2.25rem] top-8 bottom-8 w-[2px] bg-border -z-10" />

                        {/* Steps */}
                        {[
                            { title: "Fill out a quick form", desc: "Apply to the program by filling out simple details about yourself.", icon: FileText, color: "text-blue-500", bg: "bg-blue-50" },
                            { title: "Get tracking details", desc: "Once approved, receive your unique affiliate link.", icon: Send, color: "text-purple-500", bg: "bg-purple-50" },
                            { title: "Login to your dashboard", desc: "Access the partner portal to track your success.", icon: LayoutDashboard, color: "text-indigo-500", bg: "bg-indigo-50" },
                            { title: "Start promoting", desc: "Share your link on social media, blogs, or emails.", icon: Megaphone, color: "text-pink-500", bg: "bg-pink-50" },
                            { title: "Get commission from each sale", desc: "Receive monthly payouts directly to your account.", icon: Wallet, color: "text-green-500", bg: "bg-green-50" }
                        ].map((step, i) => (
                            <div key={i} className="flex items-start gap-8 group">
                                <div className={`h-20 w-20 shrink-0 rounded-2xl ${step.bg} border-4 border-white shadow-lg flex items-center justify-center relative z-10 transition-transform group-hover:scale-110`}>
                                    <step.icon className={`h-8 w-8 ${step.color}`} />
                                </div>
                                <div className="pt-3">
                                    <h3 className="text-xl font-bold text-foreground mb-1">{step.title}</h3>
                                    <p className="text-muted-foreground leading-relaxed">{step.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- Benefits Grid --- */}
            <section className="py-24 bg-background">
                <div className="mx-auto max-w-6xl px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl lg:text-4xl font-extrabold text-foreground mb-4">Reasons to Become a LeadGenius Affiliate</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            { icon: LayoutDashboard, color: "text-blue-500", bg: "bg-blue-50", title: "Free Access to Affiliate Platform", desc: "Track earnings, view reports, and get real-time insights locally." },
                            { icon: PieChart, color: "text-purple-500", bg: "bg-purple-50", title: "Attractive Commission Structure", desc: "Earn industry-leading commissions with both recurring and one-time options." },
                            { icon: Crown, color: "text-amber-500", bg: "bg-amber-50", title: "Top Rated Software", desc: "Promote a product that users love, with 4.9/5 stars rating." },
                            { icon: BookOpen, color: "text-pink-500", bg: "bg-pink-50", title: "Free Training", desc: "Access our partner academy to learn strategies for promoting SaaS." },
                            { icon: ShieldCheck, color: "text-green-500", bg: "bg-green-50", title: "Secure & On-Time Payments", desc: "We pay out like clockwork every month via PayPal or Transfer." },
                            { icon: Palette, color: "text-indigo-500", bg: "bg-indigo-50", title: "Pre-Designed Promo Materials", desc: "Get access to a library of high-converting banners and swamps." },
                        ].map((item, i) => (
                            <div key={i} className="bg-card p-8 rounded-3xl border border-border hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-none transition-all cursor-default group">
                                <div className={`w-14 h-14 rounded-2xl ${item.bg} dark:bg-muted ${item.color} flex items-center justify-center mb-6 transition-transform group-hover:scale-110`}>
                                    <item.icon className="h-7 w-7" />
                                </div>
                                <h3 className="font-bold text-lg text-foreground mb-3">{item.title}</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- FAQ Section --- */}
            <section className="py-24 bg-muted/30">
                <div className="mx-auto max-w-4xl px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl lg:text-4xl font-extrabold text-foreground mb-4">Frequently Asked Questions</h2>
                    </div>

                    <Accordion type="single" collapsible className="w-full space-y-4">
                        {[
                            { q: "How does the affiliate program work?", a: "Once you sign up, you'll get a unique referral link. Share this link with your audience. When someone clicks your link and purchases a subscription, you earn a commission." },
                            { q: "How much can I earn?", a: "There is no limit! You earn 30% recurring commission on every monthly subscription you refer. The more active customers you refer, the more you earn." },
                            { q: "When do I get paid?", a: "Payouts are processed monthly. Commissions are paid out 30 days after the referred customer's payment is successfully processed." },
                            { q: "What marketing materials do you provide?", a: "We provide a comprehensive partner kit including banners, logos, email templates, and social media assets." },
                            { q: "Is there a minimum payout threshold?", a: "Yes, the minimum payout threshold is $50. Once your approved commissions reach this amount, you will be paid in the next payout cycle." }
                        ].map((item, i) => (
                            <AccordionItem key={i} value={`item-${i}`} className="bg-card border text-sm border-border rounded-2xl px-6 shadow-sm data-[state=open]:shadow-md transition-all">
                                <AccordionTrigger className="hover:no-underline font-bold text-foreground py-6">{item.q}</AccordionTrigger>
                                <AccordionContent className="text-muted-foreground pb-6 leading-relaxed">
                                    {item.a}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </section>

            {/* --- CTA Section --- */}
            <section className="py-24 px-6 bg-background">
                <div className="mx-auto max-w-6xl rounded-[3rem] bg-gradient-to-br from-blue-600 to-indigo-700 px-6 py-20 text-center shadow-2xl shadow-blue-500/30 relative overflow-hidden flex flex-col items-center justify-center">
                    {/* Decorative Background Elements */}
                    <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
                        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-white rounded-full blur-[120px]" />
                        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-400 rounded-full blur-[120px]" />
                    </div>

                    <div className="relative z-10 max-w-2xl">
                        <h2 className="text-4xl lg:text-5xl font-extrabold text-white mb-8 leading-tight">Become our brand <br /> ambassador and start earning today</h2>
                        <div className="flex justify-center">
                            <button className="bg-white text-blue-600 px-10 py-4 rounded-2xl font-bold shadow-xl hover:bg-blue-50 transition-all hover:scale-105 active:scale-95 flex items-center gap-3 text-lg">
                                Become an Affiliate <ArrowRight className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- Footer --- */}
            <footer className="border-t border-border bg-muted/30 py-12">
                <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-8 px-6 md:flex-row">
                    <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
                            <Zap className="h-5 w-5 text-white" fill="currentColor" />
                        </div>
                        <span className="text-lg font-bold tracking-tight text-foreground">LeadGenius</span>
                    </div>

                    <div className="flex gap-8 text-sm font-medium text-muted-foreground">
                        <Link href="/privacy" className="hover:text-blue-600 transition-colors">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-blue-600 transition-colors">Terms of Service</Link>
                        <Link href="#" className="hover:text-blue-600 transition-colors">Contact</Link>
                    </div>

                    <div className="text-sm text-muted-foreground">
                        © 2026 LeadGenius Inc. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
}
