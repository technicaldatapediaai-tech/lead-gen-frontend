import Link from "next/link";
import LandingNavbar from "@/components/LandingNavbar";
import Footer from "@/components/Footer";

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-background text-foreground font-sans selection:bg-blue-500/30">
            <LandingNavbar />

            {/* --- Hero / Header Section --- */}
            <section className="relative pt-32 pb-16 overflow-hidden">
                <div className="absolute top-0 left-0 w-[40%] h-[40%] bg-gradient-to-br from-indigo-100/50 to-transparent -z-10 rounded-br-[100px]" />
                <div className="absolute bottom-0 right-0 w-[30%] h-[30%] bg-gradient-to-tl from-pink-100/30 to-transparent -z-10 rounded-tl-[100px]" />
                
                <div className="mx-auto max-w-4xl px-6">
                    <div className="text-center">
                        <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 mb-6 font-display">
                            Terms of <span className="text-indigo-600">Service</span>
                        </h1>
                        <p className="text-lg text-slate-500 font-medium max-w-2xl mx-auto">
                            Last Updated: March 13, 2026 • Your agreement for using Lead Genius.
                        </p>
                    </div>
                </div>
            </section>

            {/* --- Main Content Section --- */}
            <section className="pb-24">
                <div className="mx-auto max-w-4xl px-6">
                    <div className="bg-white rounded-[3rem] border border-slate-100 p-10 md:p-16 shadow-2xl shadow-indigo-900/5 relative overflow-hidden">
                        {/* Subtle background glow */}
                        <div className="absolute -top-24 -left-24 w-48 h-48 bg-indigo-50 rounded-full blur-3xl opacity-60" />
                        
                        <div className="prose prose-slate max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-p:text-slate-600 prose-p:leading-relaxed prose-li:text-slate-600">
                            <div className="space-y-12">
                                <section>
                                    <p className="text-xl text-slate-600 leading-relaxed font-medium">
                                        By accessing or using the Lead Genius platform and Chrome extension ("Service"), you agree to be bound by these Terms. Please read them carefully.
                                    </p>
                                </section>

                                <hr className="border-slate-100" />

                                <section>
                                    <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 text-sm">01</span>
                                        Description of Service
                                    </h2>
                                    <p className="text-slate-600 pl-4 border-l-2 border-slate-50 ml-5 font-medium leading-relaxed">
                                        Lead Genius provides AI-powered lead generation, intelligence, and automated outreach tools (LinkedIn and Email). The Service includes the web dashboard, backend API, and browser extension.
                                    </p>
                                </section>

                                <section>
                                    <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100 text-rose-600 text-sm">02</span>
                                        Acceptable Use & Restrictions
                                    </h2>
                                    <ul className="space-y-6 pl-4 border-l-2 border-slate-50 ml-5">
                                        <li className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                                            <h3 className="font-bold text-slate-900 mb-1">No SPAM or Illegal Acts</h3>
                                            <p className="text-slate-600 text-sm">You agree not to use the Service for any illegal activities or to send unsolicited communications.</p>
                                        </li>
                                        <li className="p-6 bg-rose-50 rounded-2xl border border-rose-100">
                                            <h3 className="font-bold text-rose-900 mb-1">LinkedIn Automation Disclosure</h3>
                                            <p className="text-rose-700 text-sm">You acknowledge that automation carries inherent risks on third-party platforms. Lead Genius is not responsible for any account restrictions or bans imposed by LinkedIn.</p>
                                        </li>
                                        <li className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                                            <h3 className="font-bold text-slate-900 mb-1">Source Code Protection</h3>
                                            <p className="text-slate-600 text-sm">You may not reverse engineer or attempt to steal the source code of Lead Genius.</p>
                                        </li>
                                    </ul>
                                </section>

                                <section>
                                    <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600 text-sm">03</span>
                                        Payments and Subscriptions
                                    </h2>
                                    <p className="text-slate-600 pl-4 border-l-2 border-slate-50 ml-5 leading-relaxed font-medium">
                                        Fees are billed in advance based on your chosen plan. Refunds are processed at our sole discretion unless otherwise required by law. We reserve the right to modify pricing with prior notice.
                                    </p>
                                </section>

                                <section>
                                    <div className="bg-slate-900 rounded-[2.5rem] p-10 relative overflow-hidden">
                                        <div className="absolute bottom-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl" />
                                        <h2 className="text-2xl font-bold text-white mb-4">Questions about our terms?</h2>
                                        <p className="text-slate-400 mb-8 max-w-lg font-medium">
                                            We're here to help clarify any aspect of our service agreement. Reach out to our technical team anytime.
                                        </p>
                                        <div className="flex flex-col sm:flex-row gap-4">
                                            <a href="mailto:technicaldatapediaai@gmail.com" className="bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-indigo-500 transition-all text-center">
                                                Email Support
                                            </a>
                                            <Link href="/" className="bg-white/5 border border-white/10 text-white px-8 py-4 rounded-xl font-bold hover:bg-white/10 transition-all text-center">
                                                Back to Home
                                            </Link>
                                        </div>
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
