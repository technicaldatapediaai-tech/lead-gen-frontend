import Image from "next/image";

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
    <section className="py-24 bg-background">
      <div className="mx-auto max-w-6xl px-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          
          {/* Left Column (Sticky) */}
          <div className="lg:col-span-1 lg:sticky lg:top-32 h-fit">
            <h2 className="text-4xl font-extrabold text-foreground sm:text-5xl mb-6 leading-tight">
              Tailored for Every <br />
              <span className="text-blue-600">{content.title}</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-10 leading-relaxed font-medium">
              {content.desc}
            </p>

            <div className="flex items-center gap-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 px-6 py-4 rounded-2xl border border-blue-100 dark:border-blue-800 text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                  {content.val1}
                </div>
                <div className="text-[10px] font-bold text-muted-foreground tracking-widest">
                  {content.stat1}
                </div>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 px-6 py-4 rounded-2xl border border-purple-100 dark:border-purple-800 text-center">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">
                  {content.val2}
                </div>
                <div className="text-[10px] font-bold text-muted-foreground tracking-widest">
                  {content.stat2}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (Scrollable Cards) */}
          <div className="lg:col-span-2 pl-4 md:pl-20 flex flex-col items-start space-y-24">
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
    <div className="group w-full max-w-[480px] rounded-[2rem] overflow-hidden border border-slate-200 bg-white shadow-sm hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 hover:-translate-y-1">
      <div className="h-64 relative overflow-hidden bg-slate-100">
        <Image
          src={imageSrc}
          alt={title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Branding Mask & Enterprise Badge */}
        <div className="absolute top-4 left-4 z-20">
          <div className="bg-slate-900/90 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 shadow-2xl flex items-center gap-2 scale-90 origin-top-left group-hover:scale-100 transition-transform duration-500">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-[10px] font-black text-white tracking-[0.2em]">Leadnius</span>
          </div>
        </div>

        {/* Subtle Gradient Overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
      <div className="p-10">
        <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">{title}</h3>
        <p className="text-base text-slate-500 leading-relaxed font-medium">
          {desc}
        </p>
      </div>
    </div>
  );
}


