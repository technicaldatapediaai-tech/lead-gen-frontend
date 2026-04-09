import { Rocket, Sparkles, Bell } from "lucide-react";

export default function InsuranceComingSoon() {
  return (
    <section className="py-32 bg-background overflow-hidden">
      <div className="mx-auto max-w-6xl px-6">
        <div className="relative group p-12 lg:p-24 rounded-[3rem] bg-linear-to-br from-slate-50 to-cyan-50 dark:from-slate-900/50 dark:to-cyan-900/10 border border-border/60 overflow-hidden">
          {/* Background Gradients */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-200/20 blur-3xl -z-10 rounded-full translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-200/20 blur-3xl -z-10 rounded-full -translate-x-1/2 translate-y-1/2" />

          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-2xl bg-white dark:bg-slate-950 shadow-sm border border-border/40">
              <Sparkles className="w-4 h-4 text-cyan-500" />
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                In Development
              </span>
            </div>

            <h2 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl mb-8 leading-tight">
              Insurance Intelligence <br /> 
              <span className="text-cyan-600">Coming Soon</span>
            </h2>

            <p className="text-lg text-muted-foreground leading-relaxed mb-12">
              We are currently refining our datasets and automation models specifically for the enterprise insurance sector. Our goal is to provide brokers and carriers with unparalleled risk intelligence and lead enrichment.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button className="h-14 px-10 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-base shadow-xl transition-all hover:-translate-y-1 flex items-center gap-2">
                Join Waitlist
                <Bell className="w-5 h-5" />
              </button>
              <button className="h-14 px-10 rounded-2xl bg-white dark:bg-slate-900 border border-border text-foreground font-bold text-base transition-all hover:bg-muted/50">
                Contact Sales
              </button>
            </div>
            
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 pt-16 border-t border-border/40">
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground mb-1">Q2 2024</div>
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Expected Release</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground mb-1">50k+</div>
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Policy Data Points</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground mb-1">AI-Powered</div>
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Risk Scoring</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
