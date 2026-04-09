import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ShieldCheck, UserCheck } from "lucide-react";

export default function InsuranceHero() {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden bg-background">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Column: Text Content */}
          <div className="max-w-2xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 mb-8 rounded-full bg-cyan-50 border border-cyan-100 dark:bg-cyan-900/20 dark:border-cyan-800">
              <span className="text-[11px] font-bold tracking-widest text-cyan-600 uppercase dark:text-cyan-400">
                Enterprise Insurance Edition
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl mb-6 leading-tight">
              Enterprise <br /> Insurance <br />
              <span className="text-cyan-600">Growth & Retention</span> <br />
              Platform
            </h1>

            {/* Subtitle */}
            <p className="text-base text-muted-foreground leading-relaxed mb-10">
              Automate policy renewals, enrich risk profiles, and generate high-intent leads for brokers and agencies using AI-powered intelligence.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link
                href="/demo"
                className="h-12 px-8 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-semibold transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:-translate-y-0.5"
              >
                Request a Demo
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="#features"
                className="h-12 px-8 rounded-lg border border-border bg-card hover:bg-muted/50 text-foreground text-sm font-semibold transition-all flex items-center justify-center hover:border-cyan-200 dark:hover:border-cyan-800"
              >
                View Features
              </Link>
            </div>
          </div>

          {/* Right Column: Dashboard Visual */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-linear-to-r from-cyan-600 to-blue-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />

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
            <div className="absolute -top-6 -right-6 z-20 hidden md:flex items-center gap-3 bg-white dark:bg-slate-900 shadow-xl border border-border px-4 py-2 rounded-xl animate-bounce-slow">
              <div className="p-2 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg">
                <ShieldCheck className="w-5 h-5 text-cyan-600" />
              </div>
              <div>
                <div className="text-[10px] text-muted-foreground font-semibold">
                  Risk Assessment
                </div>
                <div className="text-lg font-bold text-foreground">A+ Rated</div>
              </div>
            </div>

            <div className="absolute -bottom-6 -left-6 z-20 hidden md:flex items-center gap-3 bg-white dark:bg-slate-900 shadow-xl border border-border px-4 py-3 rounded-xl">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <UserCheck className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="text-sm font-bold text-foreground">
                  Renewal Alert
                </div>
                <div className="text-[10px] text-muted-foreground">
                  Commercial Liability Policy • 15 Days Left
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
