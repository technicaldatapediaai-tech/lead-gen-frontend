import {
  FileText,
  GitFork,
  Layers,
  ShieldCheck,
  Search,
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
        <div className="text-center mb-20">
          <h2 className="text-4xl font-extrabold text-slate-900 sm:text-5xl mb-6 tracking-tightest">
            Enterprise-Grade <br />
            <span className="text-indigo-600">{isInsurance ? "Insurance" : "Logistics"} Tools</span>
          </h2>
          <div className="w-24 h-1.5 bg-indigo-600 mx-auto rounded-full" />
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
    <div className="bg-white border border-slate-100 p-10 rounded-[2.5rem] shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 relative group overflow-hidden">
      <div className="absolute top-0 right-0 p-8 bg-indigo-50/50 blur-3xl rounded-full group-hover:bg-indigo-100 transition-colors" />
      
      <div className="flex justify-between items-start mb-10 relative z-10">
        <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 shadow-sm">
          {icon}
        </div>
        {badge && (
          <span className="bg-indigo-100/50 text-indigo-700 text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-[0.2em] border border-indigo-100/50">
            {badge}
          </span>
        )}
      </div>

      <h3 className="text-lg font-black text-slate-900 mb-4 uppercase tracking-tight relative z-10">{title}</h3>
      <p className="text-sm text-slate-500 leading-relaxed font-medium relative z-10">{desc}</p>
    </div>
  );
}

