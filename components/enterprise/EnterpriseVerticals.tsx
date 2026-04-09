import Image from "next/image";
import { TrendingUp, Users } from "lucide-react";

export default function EnterpriseVerticals() {
  return (
    <section className="py-32 bg-background border-t border-border">
      <div className="mx-auto max-w-6xl px-6 font-sans">
        
        {/* Centered Header Section */}
        <div className="max-w-4xl mx-auto text-center mb-24">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full bg-blue-50 border border-blue-100 dark:bg-blue-900/20 dark:border-blue-800">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
            <span className="text-[10px] font-bold tracking-widest text-blue-600 uppercase dark:text-blue-400">
              Industry Verticals
            </span>
          </div>
          
          <h2 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl mb-8">
            Tailored for Every <br />
            <span className="text-blue-600">Logistics Vertical</span>
          </h2>
          
          <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto italic">
            Our intelligence layer adapts to the specific needs of each sector, 
            ensuring the most relevant data is captured for every shipment type.
          </p>

          <div className="flex items-center justify-center gap-8 mt-12">
            <div className="bg-slate-50 dark:bg-slate-900/50 px-8 py-6 rounded-3xl border border-border text-center shadow-sm">
              <div className="text-3xl font-black text-blue-600 dark:text-blue-400 mb-1">
                +60%
              </div>
              <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                Booking Speed
              </div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/50 px-8 py-6 rounded-3xl border border-border text-center shadow-sm">
              <div className="text-3xl font-black text-purple-600 dark:text-purple-400 mb-1">
                2x
              </div>
              <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                Qualified Leads
              </div>
            </div>
          </div>
        </div>

        {/* Reorganized Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <VerticalCard
            imageSrc="/assets/vertical_freight.png"
            title="Freight Forwarders"
            desc="Scale ocean and air freight bookings with automated RFQ follow-ups that never sleep."
          />
          <VerticalCard
            imageSrc="/assets/vertical_3pl.png"
            title="3PL Providers"
            desc="Bridge the gap between warehousing and distribution sales teams with unified data."
          />
          <VerticalCard
            imageSrc="/assets/vertical_courier.png"
            title="Courier last-mile"
            desc="Capture and convert hyper-local delivery inquiries instantly for peak season scaling."
          />
          <VerticalCard
            imageSrc="/assets/vertical_warehouse.png"
            title="Warehousing"
            desc="Maximize storage utilization by identifying shippers in need of space before they look elsewhere."
          />
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
    <div className="group w-full rounded-3xl overflow-hidden border border-border bg-card shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
      <div className="h-48 relative overflow-hidden bg-muted/20">
        <Image
          src={imageSrc}
          alt={title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      <div className="p-8">
        <h3 className="text-lg font-black text-foreground mb-3 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed italic">
          {desc}
        </p>
      </div>
    </div>
  );
}
