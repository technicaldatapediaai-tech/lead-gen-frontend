import React from "react";
import LandingNavbar from "@/components/LandingNavbar";
import Footer from "@/components/Footer";
import InsuranceHero from "@/components/enterprise/InsuranceHero";
import InsuranceVisualPlatform from "@/components/enterprise/InsuranceVisualPlatform";
import EnterpriseVerticals from "@/components/enterprise/EnterpriseVerticals";
import EnterpriseTools from "@/components/enterprise/EnterpriseTools";
import LogoCloud from "@/components/enterprise/LogoCloud";
import EnterpriseCTA from "@/components/enterprise/EnterpriseCTA";

export default function InsuranceEnterprisePage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-500/30">
      <LandingNavbar />

      <main>
        <InsuranceVisualPlatform />
        <EnterpriseVerticals mode="insurance" />
        <EnterpriseTools mode="insurance" />
        <LogoCloud />
        <EnterpriseCTA mode="insurance" />
      </main>

      <Footer />
    </div>
  );
}
