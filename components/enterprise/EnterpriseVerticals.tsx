import Image from "next/image";
import { TrendingUp, Users, Shield, Zap, Activity } from "lucide-react";

interface EnterpriseVerticalsProps {
  mode?: "logistics" | "insurance";
}

export default function EnterpriseVerticals({ mode = "logistics" }: EnterpriseVerticalsProps) {
  const isInsurance = mode === "insurance";

  const content = {
    title: isInsurance ? "Insurance Architecture" : "Logistics Vertical",
    subtitle: isInsurance ? "Specialized Coverage" : "Industry Verticals",
    desc: isInsurance 
      ? "Our intelligence layer adapts to the unique risk profiles of each sector, ensuring precise coverage and underwriting."
      : "Our intelligence layer adapts to the specific needs of each sector, ensuring the most relevant data is captured.",
    stat1: isInsurance ? "Claims Speed" : "Booking Speed",
    stat2: isInsurance ? "Retention" : "Qualified Leads",
    val1: isInsurance ? "+45%" : "+60%",
    val2: isInsurance ? "98%" : "2x",
  };

  const verticals = isInsurance ? [
    {
      image: "/assets/vertical_health.png",
      title: "Health & Life",
      desc: "Architect workflows for complex life policies and health claims with automated verification."
    },
    {
      image: "/assets/vertical_property.png",
      title: "Property & Casualty",
      desc: "Manage catastrophic risks and property assessments with real-time geospatial intelligence."
    },
    {
      image: "/assets/vertical_marine.png",
      title: "Marine & Cargo",
      desc: "The gold standard for maritime insurance, tracking assets across every global node."
    },
    {
      image: "/assets/vertical_cyber.png",
      title: "Cyber Security",
      desc: "Dynamic risk scoring for the digital-first enterprise, identifying threats before they materialize."
    }
  ] : [
    {
      image: "/assets/vertical_freight.png",
      title: "Freight Forwarders",
      desc: "Scale ocean and air freight bookings with automated RFQ follow-ups that never sleep."
    },
    {
      image: "/assets/vertical_3pl.png",
      title: "3PL Providers",
      desc: "Bridge the gap between warehousing and distribution sales teams with unified data."
    },
    {
      image: "/assets/vertical_courier.png",
      title: "Courier last-mile",
      desc: "Capture and convert hyper-local delivery inquiries instantly for peak season scaling."
    },
    {
      image: "/assets/vertical_warehouse.png",
      title: "Warehousing",
      desc: "Maximize storage utilization by identifying shippers in need of space before they look elsewhere."
    }
  ];

  return (
    <section className="py-32 bg-background border-t border-border">
      <div className="mx-auto max-w-6xl px-24 font-sans">
        
        {/* Centered Header Section */}
        <div className="max-w-4xl mx-auto text-center mb-24">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full bg-blue-50 border border-blue-100 dark:bg-blue-900/20 dark:border-blue-800">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
            <span className="text-[10px] font-bold tracking-widest text-blue-600 uppercase dark:text-blue-400">
              {content.subtitle}
            </span>
          </div>
          
          <h2 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl mb-8">
            Tailored for Every <br />
            <span className="text-blue-600">{content.title}</span>
          </h2>
          
          <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto italic font-medium">
            {content.desc}
          </p>

          <div className="flex items-center justify-center gap-8 mt-12">
            <div className="bg-slate-50 dark:bg-slate-900/50 px-8 py-6 rounded-3xl border border-border text-center shadow-sm">
              <div className="text-3xl font-black text-blue-600 dark:text-blue-400 mb-1">
                {content.val1}
              </div>
              <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                {content.stat1}
              </div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/50 px-8 py-6 rounded-3xl border border-border text-center shadow-sm">
              <div className="text-3xl font-black text-indigo-600 dark:text-indigo-400 mb-1">
                {content.val2}
              </div>
              <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                {content.stat2}
              </div>
            </div>
          </div>
        </div>

        {/* Reorganized Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {verticals.map((v, i) => (
            <VerticalCard
              key={i}
              imageSrc={v.image}
              title={v.title}
              desc={v.desc}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function VerticalCard({
  imageSrc,
  title,
  desc,
}: {
  imageSrc: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="group w-full rounded-3xl overflow-hidden border border-border bg-card shadow-sm hover:shadow-xl transition-all duration-300">
      <div className="h-48 relative overflow-hidden bg-muted/20">
        <Image
          src={imageSrc}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      <div className="p-8">
        <h3 className="text-xl font-bold text-foreground mb-3">{title}</h3>
        <p className="text-base text-muted-foreground leading-relaxed">
          {desc}
        </p>
      </div>
    </div>
  );
}

