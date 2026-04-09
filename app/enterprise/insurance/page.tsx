import React from "react";
import LandingNavbar from "@/components/LandingNavbar";
import Footer from "@/components/Footer";
import InsuranceVisualPlatform from "@/components/enterprise/InsuranceVisualPlatform";

export default function InsuranceEnterprisePage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-500/30">
      <LandingNavbar />

      <main>
        <InsuranceVisualPlatform />
      </main>

      <Footer />
    </div>
  );
}
