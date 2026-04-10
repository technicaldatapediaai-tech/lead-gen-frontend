"use client";

import React from "react";
import { 
  Zap, 
  BarChart3, 
  Globe, 
  ZapIcon as Rate, 
  Database, 
  ChevronRight, 
  TrendingUp, 
  Users,
  Box,
  Layout,
  Search,
  MapPin,
  Clock,
  ArrowRight,
  ShieldCheck,
  FileText,
  Activity
} from "lucide-react";

export default function LogisticsVisualPlatform() {
  return (
    <div className="bg-slate-50 dark:bg-slate-950">
      
      {/* 1. Feature Highlights: One-Click Addresses & Shipment Creation */}
      <section className="py-24 border-b border-border bg-white dark:bg-slate-900/40">
        <div className="mx-auto max-w-7xl px-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-900/30 rounded-full border border-blue-100 dark:border-blue-800 text-[10px] font-black uppercase tracking-widest text-blue-600 mb-6">
                 Logistics Efficiency
              </div>
              <h2 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white mb-6">One-Click Addresses</h2>
              <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed mb-8">
                 Reduce manual entry errors and speed up your logistics workflow by saving unlimited pickup and destination locations. Reach checkout faster with saved preferences.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center shadow-sm">
                       <MapPin className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                       <div className="text-sm font-bold">Smart Validation</div>
                       <div className="text-[10px] text-slate-500 uppercase">Auto-Correction</div>
                    </div>
                 </div>
                 <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center shadow-sm">
                       <ShieldCheck className="w-5 h-5 text-emerald-500" />
                    </div>
                    <div>
                       <div className="text-sm font-bold">Secure Vault</div>
                       <div className="text-[10px] text-slate-500 uppercase">Encrypted Data</div>
                    </div>
                 </div>
              </div>
            </div>
            
            <div className="relative">
               <div className="bg-slate-50 dark:bg-slate-800/50 p-8 rounded-[40px] border border-slate-200 dark:border-slate-700 relative overflow-hidden">
                  <div className="space-y-4">
                     {[
                       { name: "Shanghai Warehouse", type: "Main Hub", active: true },
                       { name: "New York Port", type: "Delivery Point", active: false },
                       { name: "Berlin Distribution", type: "Regional", active: false }
                     ].map((addr, i) => (
                       <div key={i} className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 flex justify-between items-center shadow-sm">
                          <div className="flex items-center gap-4">
                             <div className={`w-2 h-2 rounded-full ${addr.active ? 'bg-blue-600' : 'bg-slate-300'}`} />
                             <div>
                                <div className="text-sm font-bold underline decoration-blue-500/30">{addr.name}</div>
                                <div className="text-[10px] text-slate-400 font-black tracking-widest">{addr.type}</div>
                             </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-300" />
                       </div>
                     ))}
                  </div>
                  {/* Decorative */}
                  <div className="absolute top-0 right-0 p-8 opacity-5">
                     <Users className="w-32 h-32 text-blue-600" />
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Real-Time Tracking Section */}
      <section className="py-24 bg-slate-50 dark:bg-slate-950 border-b border-border">
        <div className="mx-auto max-w-7xl px-24">
          <div className="text-center mb-16">
             <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-4">Real-Time Shipment Tracking</h2>
             <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto italic">
                Advanced multi-node visibility into every asset across your global network.
             </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
            <div className="lg:col-span-2">
               {/* High-Fidelity Tracking Bar (MOVED FROM HERO) */}
               <div className="bg-white dark:bg-slate-900 p-2 rounded-[24px] border border-border shadow-2xl shadow-blue-500/5 mb-10 transition-all focus-within:border-blue-500/40">
                  <div className="flex flex-col sm:flex-row gap-3">
                     <div className="flex-1 flex items-center gap-3 px-5 py-4">
                        <Search className="w-6 h-6 text-blue-500" />
                        <input 
                           type="text" 
                           placeholder="Enter AWB or Tracking ID (e.g., LX-7821-PW4)" 
                           className="bg-transparent border-none outline-none text-slate-900 dark:text-white w-full text-base font-bold placeholder:text-slate-500"
                        />
                     </div>
                     <button className="bg-blue-600 text-white px-10 py-4 rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 active:scale-95">
                        Initialize Tracking
                     </button>
                  </div>
               </div>

               <div className="flex flex-wrap gap-8 px-4 mb-10">
                  {[
                    { label: "Live Shipment Timelines", color: "bg-emerald-500" },
                    { label: "Milestone Updates", color: "bg-blue-500" },
                    { label: "Real-Time GPS Sync", color: "bg-amber-500" }
                  ].map((p, i) => (
                    <div key={i} className="flex items-center gap-2 group cursor-default">
                       <div className={`w-1.5 h-1.5 rounded-full ${p.color} animate-pulse`} />
                       <span className="text-[10px] uppercase font-black tracking-widest text-slate-500 group-hover:text-blue-600 transition-colors">{p.label}</span>
                    </div>
                  ))}
               </div>

               <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-border shadow-sm italic text-slate-500 text-sm border-l-4 border-l-blue-600">
                  &ldquo;Convert inbound shipping inquiries into milestone-driven success with automated visibility.&rdquo;
               </div>
            </div>

            <div className="lg:col-span-1">
               <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4">
                     <div className="bg-blue-600 text-[10px] font-black text-white px-3 py-1 rounded-full uppercase tracking-widest shadow-lg shadow-blue-500/20">Active</div>
                  </div>
                  <div className="flex items-center gap-4 mb-8">
                     <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center">
                        <Box className="w-6 h-6 text-blue-600" />
                     </div>
                     <div>
                        <div className="text-slate-900 font-bold">LX-7821-PW4</div>
                        <div className="text-[10px] text-slate-500">Current Node: Chicago IL</div>
                     </div>
                  </div>
                  <div className="space-y-6">
                     <div className="flex gap-4">
                        <div className="flex flex-col items-center gap-1">
                           <div className="w-2 h-2 rounded-full bg-blue-600" />
                           <div className="w-px h-8 bg-slate-200" />
                        </div>
                        <div>
                           <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Station: IL-CHID3D4-2983</div>
                           <div className="text-slate-900 text-sm font-bold">Inbound: 12:45PM - SEP 24</div>
                        </div>
                     </div>
                     <div className="flex gap-4">
                        <div className="w-2 h-2 rounded-full bg-slate-200 mt-1" />
                        <div>
                           <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Next Destination</div>
                           <div className="text-slate-500 text-sm">O&apos;Hare Terminal 5</div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Shipment Architect Section */}
      <section className="py-32 bg-white dark:bg-slate-900/20 border-y border-border">
        <div className="mx-auto max-w-6xl px-24">
          <div className="mb-16">
            <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-2">Shipment Architect</h2>
            <p className="text-slate-500 dark:text-slate-400">Orchestrate complex logistics routes with precision.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 bg-slate-50 dark:bg-slate-900 p-10 rounded-[32px] border border-border">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                  <div className="space-y-4">
                     <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                        <MapPin className="w-3 h-3" /> Route Origin Details
                     </label>
                     <div className="bg-white dark:bg-slate-950 border border-border p-4 rounded-xl flex items-center justify-between">
                        <span className="text-sm font-bold text-slate-900 dark:text-white italic">Port of Shanghai, CN</span>
                        <ChevronRight className="w-4 h-4 text-slate-300" />
                     </div>
                  </div>
                  <div className="space-y-4">
                     <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                        <MapPin className="w-3 h-3 text-blue-500" /> Delivery Target
                     </label>
                     <div className="bg-white dark:bg-slate-950 border border-border p-4 rounded-xl flex items-center justify-between">
                        <span className="text-sm font-bold text-slate-400">Galia/Central/San</span>
                     </div>
                  </div>
               </div>
               <div className="flex items-center gap-4 pt-10 border-t border-slate-200 dark:border-slate-800 text-slate-400">
                  <div className="w-5 h-5 rounded border border-slate-300 flex items-center justify-center cursor-pointer">
                     <div className="w-3 h-3 bg-blue-600 rounded-sm" />
                  </div>
                  <span className="text-sm font-bold">Package ID: Commercial S</span>
               </div>
            </div>

            <div className="lg:col-span-4 bg-white border border-slate-200 shadow-xl rounded-[32px] p-10 text-slate-900 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-6 opacity-10">
                  <Box className="w-24 h-24 text-blue-600" />
               </div>
               <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-8">Shipment LX-M29-PW</div>
               <div className="mb-10">
                  <div className="text-sm text-slate-500 mb-1 font-bold">Estimated Transit Time</div>
                  <div className="text-4xl font-extrabold text-blue-600">14 Days</div>
               </div>
               <div className="space-y-4 mb-10">
                  <div className="flex justify-between items-end border-b border-slate-100 pb-2">
                     <span className="text-xs text-slate-400">Next Departure</span>
                     <span className="text-xs font-bold text-slate-900">Tomorrow</span>
                  </div>
                  <div className="flex justify-between items-end border-b border-slate-100 pb-2">
                     <span className="text-xs text-slate-400">Available Space</span>
                     <span className="text-xs font-bold text-orange-500">62.8%</span>
                  </div>
               </div>
               <button className="w-full h-14 bg-blue-600 rounded-2xl flex items-center justify-center gap-2 text-sm font-bold text-white hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20">
                  Initial Route Design <ArrowRight className="w-4 h-4" />
               </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Rate Engine Section */}
      <section className="py-24 bg-slate-50 dark:bg-slate-950">
        <div className="mx-auto max-w-7xl px-24">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
             <div>
               <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-4 italic">Estimate Your Shipping Cost</h2>
               <p className="text-slate-500 dark:text-slate-400 max-w-xl underline decoration-blue-500/20">
                  Access Live Admin-Managed Rate Cards for the most accurate, up-to-date pricing across global lanes.
               </p>
             </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1 bg-white dark:bg-slate-900 p-8 rounded-[32px] border border-border shadow-xl">
               <div className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-8 underline">Real-Time Quotation</div>
               <div className="space-y-6">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Origin Country</label>
                     <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
                        <div className="text-xs font-bold text-slate-900 dark:text-white">CNSHA (Shanghai, China)</div>
                     </div>
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Destination Country</label>
                     <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
                        <div className="text-xs font-bold text-slate-400">Select Destination...</div>
                     </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Weight (kg)</label>
                        <input type="number" placeholder="0.00" className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 text-xs font-bold focus:outline-none focus:border-blue-500 transition-colors" />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Pieces</label>
                        <input type="number" placeholder="1" className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 text-xs font-bold focus:outline-none focus:border-blue-500 transition-colors" />
                     </div>
                  </div>
                  <button className="w-full bg-blue-600 text-white h-14 rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all active:scale-95">Get Live Rates</button>
               </div>
            </div>

            <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
               <QuoteItem type="STANDARD" carrier="Oceanic Lines" price="$1,248" time="24 Days" />
               <QuoteItem type="PREMIUM" carrier="AirBridge XL" price="$4,832" time="3 Days" color="orange" />
               <QuoteItem type="ECONOMY" carrier="Global Hub" price="$928" time="18 Days" />
               <QuoteItem type="PRIORITY" carrier="Express Network" price="$1,110" time="27 Days" />
            </div>
          </div>
        </div>
      </section>

      {/* 5. Simplified Booking Workflow */}
      <section className="py-24 bg-white dark:bg-slate-900/60 border-y border-border">
        <div className="mx-auto max-w-7xl px-24 text-center">
           <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-4 uppercase tracking-tighter">Book a Shipment in 3 Easy Steps</h2>
           <p className="text-slate-500 dark:text-slate-400 mb-16 max-w-2xl mx-auto italic font-medium">
              Enterprise-Grade Intelligence for booking international deliveries with zero friction.
           </p>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
              {/* Connector lines */}
              <div className="hidden md:block absolute top-[60px] left-[25%] right-[25%] h-px bg-slate-100 dark:bg-slate-800 -z-10" />
              
              <div className="flex flex-col items-center">
                 <div className="w-24 h-24 rounded-[32px] bg-blue-50 dark:bg-blue-900/20 border-2 border-white dark:border-slate-800 shadow-xl flex items-center justify-center mb-6 transform hover:rotate-6 transition-transform">
                    <MapPin className="w-10 h-10 text-blue-600" />
                 </div>
                 <h3 className="text-xl font-black mb-2 text-slate-900 dark:text-white">1. Select Route</h3>
                 <p className="text-sm text-slate-500 dark:text-slate-400 max-w-[200px]">Choose between Pickup or Warehouse Drop locations.</p>
              </div>

              <div className="flex flex-col items-center">
                 <div className="w-24 h-24 rounded-[32px] bg-indigo-50 dark:bg-indigo-900/20 border-2 border-white dark:border-slate-800 shadow-xl flex items-center justify-center mb-6 transform hover:-rotate-6 transition-transform">
                    <Box className="w-10 h-10 text-indigo-600" />
                 </div>
                 <h3 className="text-xl font-black mb-2 text-slate-900 dark:text-white">2. Package Info</h3>
                 <p className="text-sm text-slate-500 dark:text-slate-400 max-w-[200px]">Enter weight and contents (e.g., Electronics, Garments).</p>
              </div>

              <div className="flex flex-col items-center">
                 <div className="w-24 h-24 rounded-[32px] bg-emerald-50 dark:bg-emerald-900/20 border-2 border-white dark:border-slate-800 shadow-xl flex items-center justify-center mb-6 transform hover:rotate-3 transition-transform">
                    <Users className="w-10 h-10 text-emerald-600" />
                 </div>
                 <h3 className="text-xl font-black mb-2 text-slate-900 dark:text-white">3. Receiver Info</h3>
                 <p className="text-sm text-slate-500 dark:text-slate-400 max-w-[200px]">Add the destination contact with verified address sync.</p>
              </div>
           </div>
        </div>
      </section>

      {/* 6. Smart Compliance & Documentation Section */}
      <section className="py-24 bg-white text-slate-900 overflow-hidden relative border-t border-border">
        <div className="absolute top-0 right-0 p-32 bg-blue-500/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-0 p-32 bg-indigo-500/5 blur-[120px] rounded-full" />
        
        <div className="mx-auto max-w-7xl px-24 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-full border border-blue-100 text-[10px] font-black uppercase tracking-widest text-blue-600 mb-8 italic">Automated Compliance</div>
              <h2 className="text-5xl font-black leading-[1.1] mb-8 text-slate-900">
                Smart Compliance & <br />
                <span className="text-blue-600 italic uppercase">Documentation</span>
              </h2>
              <p className="text-slate-500 text-lg mb-12 max-w-lg leading-relaxed italic">
                 Safe, approved, and compliant international shipping. Our system handles AWB generation, tax declarations, and admin approvals automatically.
              </p>
              
              <div className="space-y-6">
                 <div className="flex items-center gap-5 group cursor-pointer translate-x-0 hover:translate-x-2 transition-transform">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center">
                       <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                       <div className="font-bold text-slate-900">Auto-AWB Generation</div>
                       <div className="text-xs text-slate-500">Instant Air Waybill creation synchronized with carrier nodes.</div>
                    </div>
                 </div>
                 <div className="flex items-center gap-5 group cursor-pointer translate-x-0 hover:translate-x-2 transition-transform">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                       <ShieldCheck className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                       <div className="font-bold text-slate-900">Tax & Value Declarations</div>
                       <div className="text-xs text-slate-500">Automated compliance with international tax and customs laws.</div>
                    </div>
                 </div>
              </div>
            </div>

            <div className="relative">
               <div className="bg-slate-50 p-10 rounded-[40px] border border-slate-200 backdrop-blur-sm relative z-10 shadow-xl">
                  <div className="flex flex-col items-center gap-10">
                    <div className="p-6 bg-white rounded-2xl border border-slate-100 w-full text-center shadow-sm">
                       <span className="text-[10px] font-black uppercase text-blue-600 tracking-widest block mb-4">Doc Engine: AWB Initialized</span>
                       <div className="flex justify-center gap-4">
                          <FileText className="w-8 h-8 text-slate-300" />
                          <ArrowRight className="w-8 h-8 text-blue-500 animate-pulse" />
                          <div className="relative">
                             <FileText className="w-8 h-8 text-slate-900" />
                             <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />
                          </div>
                       </div>
                    </div>

                    <div className="w-px h-10 bg-gradient-to-b from-blue-500 to-transparent" />

                    <div className="grid grid-cols-2 gap-6 w-full">
                       <div className="p-4 bg-white rounded-xl border border-slate-100 text-center shadow-sm">
                          <div className="text-[9px] font-bold text-slate-400 mb-2">Admin Approval</div>
                          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                             <div className="h-full bg-emerald-500" style={{ width: '100%' }} />
                          </div>
                       </div>
                       <div className="p-4 bg-white rounded-xl border border-slate-100 text-center shadow-sm">
                          <div className="text-[9px] font-bold text-slate-400 mb-2">Customs Match</div>
                          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                             <div className="h-full bg-blue-500" style={{ width: '92%' }} />
                          </div>
                       </div>
                    </div>

                    <div className="w-px h-10 bg-gradient-to-t from-blue-500 to-transparent" />

                    <div className="w-full bg-slate-900 p-4 rounded-xl text-center text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-blue-500/20">
                       Compliant & Verified
                    </div>
                  </div>
               </div>
               
               {/* Background Decorative Blur */}
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-500/10 blur-[100px] -z-10" />
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

function StatCard({ label, value, delta, color = "blue" }: { label: string; value: string; delta: string; color?: string }) {
  const colorMap: any = {
    blue: "text-blue-600 bg-blue-50 dark:bg-blue-900/20",
    orange: "text-orange-600 bg-orange-50 dark:bg-orange-950/20",
    red: "text-red-500 bg-red-50 dark:bg-red-950/20",
    emerald: "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20"
  };
  
  return (
    <div className="p-8 bg-white dark:bg-slate-900 rounded-3xl border border-border shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">{label}</span>
      <div className="flex items-baseline gap-3">
        <span className="text-3xl font-black text-slate-900 dark:text-white">{value}</span>
        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${colorMap[color] || colorMap.blue}`}>
          {delta}
        </span>
      </div>
    </div>
  );
}

function QuoteItem({ type, carrier, price, time, color = "blue" }: { type: string; carrier: string; price: string; time: string; color?: string }) {
  const isPrimary = color === "orange";
  
  return (
    <div className={`p-8 rounded-[24px] border ${isPrimary ? 'bg-slate-900 border-white/5 text-white' : 'bg-white dark:bg-slate-900 border-border'} flex flex-col justify-between shadow-sm`}>
       <div className="flex justify-between items-start mb-6">
          <div className="space-y-1">
             <div className={`text-[9px] font-black tracking-widest uppercase ${isPrimary ? 'text-orange-400' : 'text-blue-600 font-black italic underline'}`}>{type}</div>
             <div className="font-bold text-base">{carrier}</div>
          </div>
          {isPrimary && <Zap className="w-5 h-5 text-orange-400" fill="currentColor" />}
       </div>
       <div className="flex justify-between items-end">
          <div className="text-3xl font-black">{price}</div>
          <div className="text-[10px] font-bold text-slate-400 mb-1">{time} Transit</div>
       </div>
    </div>
  );
}

function TableRow({ id, origin, dest, status, color = "blue" }: { id: string; origin: string; dest: string; status: string; color?: string }) {
  const colorClass: any = {
     blue: "text-blue-600 bg-blue-50 dark:bg-blue-900/40",
     orange: "text-orange-600 bg-orange-50 dark:bg-orange-900/40",
     emerald: "text-emerald-500 bg-emerald-50 dark:bg-emerald-900/40"
  };

  return (
    <tr className="group hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
      <td className="px-8 py-6">
         <div className="text-sm font-bold text-slate-900 dark:text-white">{id}</div>
         <div className="text-[10px] text-slate-400 font-mono">0.2s ago</div>
      </td>
      <td className="px-8 py-6">
         <div className="text-sm font-medium text-slate-600 dark:text-slate-300">{origin}</div>
         <div className="text-[10px] text-slate-400 uppercase tracking-widest">{dest}</div>
      </td>
      <td className="px-8 py-6">
         <div className="text-sm font-black italic text-slate-400">04 DEC 2026</div>
      </td>
      <td className="px-8 py-6">
         <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${colorClass[color]}`}>
            {status}
         </span>
      </td>
      <td className="px-8 py-6">
         <button className="text-[10px] font-black uppercase text-blue-600 hover:underline">Manage</button>
      </td>
    </tr>
  );
}
