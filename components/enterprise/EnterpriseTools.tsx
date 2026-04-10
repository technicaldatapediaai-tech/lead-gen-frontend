import {
  FileText,
  GitFork,
  Globe,
  Layers,
  Gauge,
  ShieldCheck,
  Search,
  Lock,
  Activity,
  MapPin
} from "lucide-react";

interface EnterpriseToolsProps {
  mode?: "logistics" | "insurance";
}

export default function EnterpriseTools({ mode = "logistics" }: EnterpriseToolsProps) {
  const isInsurance = mode === "insurance";

  const tools = isInsurance ? [
    {
      icon: <Search className="w-6 h-6" />,
      title: "Risk Analysis Engine",
      desc: "Instant risk assessment and profile generation using multi-source architectural data."
    },
    {
      icon: <GitFork className="w-6 h-6" />,
      title: "Underwriting Workflows",
      desc: "Automated underwriting logic that routes complex policies to senior adjusters based on case load.",
      badge: "AI POWERED"
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Global Compliance Hub",
      desc: "Real-time tracking of international insurance regulations and multi-region tax requirements."
    },
    {
      icon: <Lock className="w-6 h-6" />,
      title: "Secure Policy Vault",
      desc: "Military-grade encryption for all policy documents and legal evidence snapshots."
    },
    {
      icon: <Activity className="w-6 h-6" />,
      title: "Real-time Monitoring",
      desc: "Live visibility into claims processing health and broker performance metrics."
    },
    {
      icon: <ShieldCheck className="w-6 h-6" />,
      title: "Fraud Detection Suite",
      desc: "Behavioral analysis and pattern recognition to identify suspicious claim activities instantly."
    }
  ] : [
    {
      icon: <Search className="w-6 h-6" />,
      title: "Real-Time Tracking",
      desc: "Instant visibility into shipment journeys with live timeline updates and milestone tracking."
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Instant Quotations",
      desc: "Live admin-managed rate cards that calculate costs instantly based on route, weight, and volume.",
      badge: "LIVE RATES"
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "One-Click Addresses",
      desc: "Save unlimited pickup and delivery points to reduce entry errors and speed up bookings."
    },
    {
      icon: <ShieldCheck className="w-6 h-6" />,
      title: "Smart Compliance",
      desc: "Automated handling of tax/value declarations and regional international shipping compliance."
    },
    {
      icon: <Layers className="w-6 h-6" />,
      title: "Simplified Workflows",
      desc: "3-step shipment creation process designed for maximum speed and enterprise-grade intelligence.",
      badge: "NEW"
    },
    {
      icon: <Activity className="w-6 h-6" />,
      title: "Automated Documentation",
      desc: "System handles AWB generation and admin approvals automatically for every shipment."
    }
  ];

  return (
    <section className="py-24 bg-muted/30">
      <div className="mx-auto max-w-7xl px-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-foreground sm:text-4xl mb-4 tracking-tighter uppercase">
            Enterprise-Grade {isInsurance ? "Insurance" : "Logistics"} Tools
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tools.map((tool, i) => (
            <ToolCard
              key={i}
              icon={tool.icon}
              title={tool.title}
              desc={tool.desc}
              badge={tool.badge}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function ToolCard({
  icon,
  title,
  desc,
  badge,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  badge?: string;
}) {
  return (
    <div className="bg-card border border-border p-8 rounded-3xl hover:shadow-2xl transition-all duration-300 relative group bg-white dark:bg-slate-900">
      <div className="flex justify-between items-start mb-6">
        <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300 shadow-sm">
          {icon}
        </div>
        {badge && (
          <span className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
            {badge}
          </span>
        )}
      </div>

      <h3 className="text-xl font-bold text-foreground mb-3 uppercase tracking-tight">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed font-medium">{desc}</p>
    </div>
  );
}

