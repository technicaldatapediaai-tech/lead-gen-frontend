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
        

        <LogisticsVisualPlatform />
        
        <EnterpriseVerticals mode="logistics" />
        <EnterpriseTools mode="logistics" />
        <LogoCloud />
        <EnterpriseCTA />
      </main>


      <Footer />
    </div>
  );
}
