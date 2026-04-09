import LandingNavbar from "@/components/LandingNavbar";
import Footer from "@/components/Footer";
import EnterpriseHero from "@/components/enterprise/EnterpriseHero";
import LogisticsVisualPlatform from "@/components/enterprise/LogisticsVisualPlatform";
import EnterpriseVerticals from "@/components/enterprise/EnterpriseVerticals";
import EnterpriseTools from "@/components/enterprise/EnterpriseTools";
import LogoCloud from "@/components/enterprise/LogoCloud";
import EnterpriseCTA from "@/components/enterprise/EnterpriseCTA";


export default function EnterpriseLogisticsPage() {
  return (
    <div className="min-h-screen bg-background font-sans selection:bg-blue-500/30">
      <LandingNavbar />

      <main>
        <EnterpriseHero />
        
        {/* Visual Platform Transition */}
        <section className="py-20 bg-white dark:bg-slate-950 border-t border-border">
          <div className="mx-auto max-w-4xl text-center px-6">
            <h2 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl mb-6">
              Enterprise Logistics <span className="text-blue-600 italic">Growth Platform</span>
            </h2>
            <div className="inline-block px-4 py-1.5 bg-blue-600 text-white text-[10px] font-black uppercase tracking-[0.3em] rounded mb-8 shadow-lg shadow-blue-500/20">
              Visual Platform
            </div>
            <p className="text-xl text-muted-foreground font-medium leading-relaxed max-w-2xl mx-auto italic">
              A comprehensive orchestration layer designed for the world&apos;s most complex supply chains.
            </p>
          </div>
        </section>

        <LogisticsVisualPlatform />
        
        <EnterpriseVerticals />
        <EnterpriseTools />
        <LogoCloud />
        <EnterpriseCTA />
      </main>


      <Footer />
    </div>
  );
}
