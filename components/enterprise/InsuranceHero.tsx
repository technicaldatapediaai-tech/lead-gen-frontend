import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ShieldCheck, UserCheck } from "lucide-react";

export default function InsuranceHero() {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden bg-background">
      <div className="mx-auto max-w-7xl px-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Column: Text Content */}
          <div className="max-w-2xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 mb-8 rounded-full bg-indigo-50 border border-indigo-100 dark:bg-indigo-900/20 dark:border-indigo-800">
              <span className="text-[11px] font-bold tracking-widest text-indigo-600 uppercase dark:text-indigo-400">
                Elite Insurance Portal
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl font-extrabold tracking-tighter text-slate-900 sm:text-5xl lg:text-7xl mb-8 leading-[1.05] uppercase max-w-3xl">
              Revenue <span className="text-indigo-600">Forecasting</span> & <br />
              Commercial Intelligence <br />
              <span className="text-slate-400">Automated Workflow</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base text-muted-foreground leading-relaxed mb-10 font-medium">
              Track your $4.2M pipeline with precision. Get CIN, GST, and financial news alerts for every account using our Elite CRM architecture.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center gap-5">
              <Link
                href="/demo"
                className="h-14 px-10 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-xl shadow-indigo-500/20 hover:-translate-y-1"
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

          {/* Right Column: Dashboard Visual */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-linear-to-r from-indigo-600 to-blue-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />

            <div className="relative rounded-xl overflow-hidden border border-border shadow-2xl bg-card">
              <Image
                src="/assets/enterprise_dashboard.png"
                alt="Insurance Intelligence Dashboard"
                width={800}
                height={600}
                className="w-full h-auto object-cover"
                priority
              />
            </div>

            {/* Floating Elements mimicking the design */}
            <div className="absolute -top-6 -right-6 z-20 hidden md:flex items-center gap-4 bg-white/90 backdrop-blur-md shadow-2xl border border-white/20 p-5 rounded-[2rem] animate-bounce-slow">
              <div className="p-3 bg-indigo-50 rounded-2xl">
                <ShieldCheck className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mb-1.5">
                  Risk Assessment
                </div>
                <div className="text-xl font-black text-slate-900 leading-none">A+ Rated</div>
              </div>
            </div>

            <div className="absolute -bottom-8 -left-8 z-20 hidden md:flex items-center gap-4 bg-white/90 backdrop-blur-md shadow-2xl border border-white/20 p-5 rounded-[2rem]">
              <div className="p-3 bg-blue-50 rounded-2xl">
                <UserCheck className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-base font-black text-slate-900 leading-none mb-1.5">
                  Renewal Alert
                </div>
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">
                  Commercial Liability • 15 Days Left
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
