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
  MapPin,
  BarChart3,
  Layout,
  Users
} from "lucide-react";

interface EnterpriseToolsProps {
  mode?: "logistics" | "insurance";
}

export default function EnterpriseTools({ mode = "logistics" }: EnterpriseToolsProps) {
  const isInsurance = mode === "insurance";

  const tools = isInsurance ? [
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Executive Reporting",
      desc: "One-click access to conversion rates, lead trends, and real-time revenue visuals."
    },
    {
      icon: <Search className="w-6 h-6" />,
      title: "Lead Intelligence",
      desc: "Identify and prioritize high-value prospects with our proprietary Lead Scoring engine."
    },
    {
      icon: <Layout className="w-6 h-6" />,
      title: "Visual Kanban Pipeline",
      desc: "Move leads from 'New' to 'Converted' using a visual, drag-and-drop Kanban interface.",
      badge: "ELITE"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "360° Account Insights",
      desc: "Get CIN, GST, and financial news alerts for every account in your commercial portfolio."
    },
    {
      icon: <GitFork className="w-6 h-6" />,
      title: "Automated Workflows",
      desc: "Automated document generation and intelligent routing to reduce manual overhead.",
      badge: "AI POWERED"
    },
    {
      icon: <Layers className="w-6 h-6" />,
      title: "Omni-Channel Support",
      desc: "Manage claims, billing, and technical issues in one central, high-fidelity hub."
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

