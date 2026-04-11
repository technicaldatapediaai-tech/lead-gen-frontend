import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ShieldCheck, UserCheck } from "lucide-react";

export default function InsuranceHero() {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden bg-background">
      <div className="mx-auto max-w-7xl px-32">
        <div className="flex flex-col items-center text-center">
          {/* Text Content */}
          <div className="max-w-4xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 mb-8 rounded-full bg-blue-50 border border-blue-100 dark:bg-blue-900/20 dark:border-blue-800">
              <span className="text-[11px] font-bold tracking-widest text-blue-600 uppercase dark:text-blue-400">
                Elite Insurance Portal
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-[5rem] sm:text-6xl lg:text-7xl font-black leading-[1.1] mb-8 uppercase tracking-tightest">
              <span className="text-slate-900">Elite Insurance</span> <br />
              <span className="text-blue-600">Intelligence Platform</span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl text-muted-foreground leading-relaxed mb-10 font-medium max-w-2xl mx-auto">
              Track your $4.2M pipeline with precision. Get CIN, GST, and financial news alerts for every account using our Elite CRM architecture.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
              <Link
                href="/demo"
                className="h-14 px-10 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-xl shadow-blue-500/20 hover:-translate-y-1"
              >
                Request a Demo
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="#features"
                className="h-14 px-10 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center hover:-translate-y-1"
              >
                View Features
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
