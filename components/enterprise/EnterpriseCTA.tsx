import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface EnterpriseCTAProps {
  mode?: "logistics" | "insurance";
}

export default function EnterpriseCTA({ mode = "logistics" }: EnterpriseCTAProps) {
  const isInsurance = mode === "insurance";

  return (
    <section className="py-24 bg-background">
      <div className="mx-auto max-w-6xl px-24">
        <div className="relative overflow-hidden rounded-[3rem] bg-linear-to-br from-blue-600 to-purple-600 px-24 py-24 text-center shadow-2xl sm:px-24 lg:px-24">
          {/* Background decoration */}
          <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

          <h2 className="relative mx-auto max-w-3xl text-4xl font-extrabold tracking-tight text-white sm:text-5xl mb-6">
            Ready to scale <br />
            {isInsurance ? "insurance revenue?" : "logistics sales?"}
          </h2>

          <p className="relative mx-auto max-w-2xl text-lg text-blue-100 mb-10">
            Join 500+ global {isInsurance ? "insurance firms" : "logistics enterprises"} using LeadGenius to dominate
            their {isInsurance ? "risk markets." : "market lanes."}
          </p>

          <div className="relative flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/signup"
              className="w-full sm:w-auto px-8 py-4 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-colors duration-200 shadow-lg text-lg"
            >
              Get Started Free
            </Link>
            <Link
              href="/demo"
              className="w-full sm:w-auto px-8 py-4 bg-transparent border-2 border-white/30 text-white font-bold rounded-xl hover:bg-white/10 transition-colors duration-200 text-lg backdrop-blur-sm"
            >
              Schedule a Demo
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

