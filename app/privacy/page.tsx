import Link from "next/link";
import LandingNavbar from "@/components/LandingNavbar";
import Footer from "@/components/Footer";

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-background text-foreground font-sans selection:bg-blue-500/30">
            <LandingNavbar />

            {/* --- Hero / Header Section --- */}
            <section className="relative pt-32 pb-16 overflow-hidden">
                <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-gradient-to-bl from-blue-100/50 to-transparent -z-10 rounded-bl-[100px]" />
                <div className="absolute bottom-0 left-0 w-[30%] h-[30%] bg-gradient-to-tr from-purple-100/30 to-transparent -z-10 rounded-tr-[100px]" />
                
                <div className="mx-auto max-w-4xl px-6">
                    <div className="text-center">
                        <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 mb-6 font-display">
                            Privacy <span className="text-blue-600">Policy</span>
                        </h1>
                        <p className="text-lg text-slate-500 font-medium max-w-2xl mx-auto">
                            Last Updated: March 13, 2026 • We value your trust and are committed to protecting your personal information.
                        </p>
                    </div>
                </div>
            </section>

            {/* --- Main Content Section --- */}
            <section className="pb-24">
                <div className="mx-auto max-w-4xl px-6">
                    <div className="bg-white rounded-[3rem] border border-slate-100 p-10 md:p-16 shadow-2xl shadow-blue-900/5 relative overflow-hidden">
                        {/* Subtle background glow */}
                        <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-50 rounded-full blur-3xl opacity-60" />
                        
                        <div className="prose prose-slate max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-p:text-slate-600 prose-p:leading-relaxed prose-li:text-slate-600">
                            <div className="space-y-12">
                                <section>
                                    <p className="text-xl text-slate-600 leading-relaxed font-medium">
                                        At Lead Genius ("we," "our," or "us"), we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our platform, Chrome extension, and related services (collectively, the "Service").
                                    </p>
                                </section>

                                <hr className="border-slate-100" />

                                <section>
                                    <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600 text-sm">01</span>
                                        Information We Collect
                                    </h2>
                                    <div className="space-y-8 pl-4 border-l-2 border-slate-50 ml-5">
                                        <div>
                                            <h3 className="text-xl font-bold text-slate-800 mb-3">A. Personally Identifiable Information (PII)</h3>
                                            <ul className="space-y-3">
                                                <li className="flex gap-3">
                                                    <span className="text-blue-500 font-bold">•</span>
                                                    <span><strong>Account Information:</strong> When you register, we collect your name, email address, password, and organization details.</span>
                                                </li>
                                                <li className="flex gap-3">
                                                    <span className="text-blue-500 font-bold">•</span>
                                                    <span><strong>Contact Information:</strong> We may collect billing information and communication preferences.</span>
                                                </li>
                                            </ul>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-slate-800 mb-3">B. Lead and Business Data</h3>
                                            <ul className="space-y-3">
                                                <li className="flex gap-3">
                                                    <span className="text-blue-500 font-bold">•</span>
                                                    <span><strong>Lead Information:</strong> Data you import (via CSV or manual entry) or enrich through our platform.</span>
                                                </li>
                                                <li className="flex gap-3">
                                                    <span className="text-blue-500 font-bold">•</span>
                                                    <span><strong>Outreach Content:</strong> The content of messages and emails sent through the platform.</span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </section>

                                <section>
                                    <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-600 text-sm">02</span>
                                        How We Use Your Information
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-4">
                                        {[
                                            "Provide and maintain the Lead Genius platform",
                                            "Facilitate automated LinkedIn and email outreach",
                                            "Perform AI-driven lead scoring and intelligence",
                                            "Process payments and provide customer support"
                                        ].map((item, i) => (
                                            <div key={i} className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 text-slate-700 font-medium">
                                                <div className="h-2 w-2 rounded-full bg-purple-500" />
                                                {item}
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                <section>
                                    <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 text-green-600 text-sm">03</span>
                                        Data Sharing and Disclosure
                                    </h2>
                                    <div className="bg-blue-600/5 border-2 border-blue-600/10 p-8 rounded-[2rem] relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full -mr-16 -mt-16" />
                                        <p className="text-xl font-bold text-blue-900 relative z-10">
                                            Currently, we do not share any data with third-party services.
                                        </p>
                                        <p className="text-slate-600 mt-2 relative z-10 font-medium">
                                            We prioritize your data sovereignty above all else. We do not sell, rent, or trade your personal information.
                                        </p>
                                    </div>
                                </section>

                                <section>
                                    <div className="flex flex-col md:flex-row items-center justify-between gap-8 p-10 bg-slate-900 rounded-[2.5rem] shadow-xl">
                                        <div className="text-center md:text-left">
                                            <h2 className="text-2xl font-bold text-white mb-2">Have questions?</h2>
                                            <p className="text-slate-400 font-medium">Our technical team is ready to assist you.</p>
                                        </div>
                                        <a href="mailto:technicaldatapediaai@gmail.com" className="bg-white text-slate-900 px-8 py-4 rounded-2xl font-bold hover:bg-white/90 transition-all hover:scale-105 active:scale-95 text-lg">
                                            Contact Support
                                        </a>
                                    </div>
                                </section>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
