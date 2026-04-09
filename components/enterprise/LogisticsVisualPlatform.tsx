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
      
      {/* 1. Command Center Section */}
      <section className="py-24 border-b border-border bg-white dark:bg-slate-900/40">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
            <div>
              <h2 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white mb-2">Command Center</h2>
              <p className="text-slate-500 dark:text-slate-400 max-w-lg">
                Aggregate real-time global operations into a single high-fidelity perspective.
              </p>
            </div>
            <div className="flex items-center gap-3 bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-xl border border-blue-100 dark:border-blue-800">
               <Activity className="w-5 h-5 text-blue-600" />
               <span className="text-sm font-bold text-blue-600">Live Infrastructure Status: Optimal</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <StatCard label="Units Installed" value="2,842" delta="+4.2%" />
            <StatCard label="Shipping Business" value="14,321" delta="-1.5%" color="orange" />
            <StatCard label="Established Ports" value="832" delta="+12" />
            <StatCard label="Outstanding Bills" value="$4.2M" delta="Critical" color="red" />
          </div>

          <div className="relative rounded-[32px] overflow-hidden border border-border shadow-2xl h-[500px] bg-slate-900 group">
             {/* Map Placeholder Context */}
             <div className="absolute inset-0 opacity-40 mix-blend-overlay">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_#0f172a_70%)]" />
                {/* Simulated Grid/Map */}
                <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center" />
             </div>
             
             {/* Map UI Overlays */}
             <div className="absolute top-8 left-8 p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                <div className="text-[10px] font-black uppercase tracking-widest text-blue-400 mb-2">Active Network</div>
                <div className="text-2xl font-bold text-white">Global Nodes Monitoring</div>
                <div className="mt-4 flex gap-2">
                   <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                   <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse delay-75" />
                   <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse delay-150" />
                </div>
             </div>

             <div className="absolute bottom-8 right-8 flex gap-3">
                <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white cursor-pointer hover:bg-white/20 transition-all">
                   <Search className="w-5 h-5" />
                </div>
                <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white cursor-pointer hover:bg-white/20 transition-all">
                   <Globe className="w-5 h-5" />
                </div>
                <div className="w-12 h-12 rounded-xl bg-blue-600 border border-blue-500 flex items-center justify-center text-white cursor-pointer hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/30">
                   <Layout className="w-5 h-5" />
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* 2. Live Tracking Section */}
      <section className="py-24 bg-slate-50 dark:bg-slate-950">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
            <div className="lg:col-span-2">
              <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-4">Live Tracking</h2>
              <p className="text-slate-500 dark:text-slate-400 mb-10 max-w-xl">
                 Real-time visibility into every asset across your network. Intelligent routing and instant status updates.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 max-w-2xl bg-white dark:bg-slate-900 p-3 rounded-2xl border border-border shadow-lg">
                <div className="flex-1 flex items-center gap-3 px-4 py-2">
                  <Search className="w-5 h-5 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Enter AWB, Container, Bill Reference Number" 
                    className="bg-transparent border-none outline-none text-slate-900 dark:text-white w-full text-sm font-medium"
                  />
                </div>
                <button className="bg-slate-900 dark:bg-blue-600 text-white px-8 py-3 rounded-xl text-sm font-bold hover:opacity-90 transition-all">
                  Initialize
                </button>
              </div>
              <div className="mt-4 flex gap-6 px-4">
                 <span className="text-[10px] uppercase font-bold text-slate-400 hover:text-blue-500 cursor-pointer">Live AWB: 2831-JK</span>
                 <span className="text-[10px] uppercase font-bold text-slate-400 hover:text-blue-500 cursor-pointer">Live AWB: 9282-PW</span>
              </div>
            </div>

            <div className="lg:col-span-1">
               <div className="bg-slate-900 rounded-3xl p-8 border border-white/5 shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4">
                     <div className="bg-blue-600 text-[10px] font-black text-white px-3 py-1 rounded-full uppercase tracking-widest shadow-lg shadow-blue-500/20">Active</div>
                  </div>
                  <div className="flex items-center gap-4 mb-8">
                     <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center">
                        <Box className="w-6 h-6 text-blue-400" />
                     </div>
                     <div>
                        <div className="text-white font-bold">LX-7821-PW4</div>
                        <div className="text-[10px] text-slate-400">Current Node: Chicago IL</div>
                     </div>
                  </div>
                  <div className="space-y-6">
                     <div className="flex gap-4">
                        <div className="flex flex-col items-center gap-1">
                           <div className="w-2 h-2 rounded-full bg-blue-600" />
                           <div className="w-px h-8 bg-slate-800" />
                        </div>
                        <div>
                           <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Station: IL-CHID3D4-2983</div>
                           <div className="text-white text-sm font-bold">Inbound: 12:45PM - SEP 24</div>
                        </div>
                     </div>
                     <div className="flex gap-4">
                        <div className="w-2 h-2 rounded-full bg-slate-800 mt-1" />
                        <div>
                           <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Next Destination</div>
                           <div className="text-slate-400 text-sm">O&apos;Hare Terminal 5</div>
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
        <div className="mx-auto max-w-6xl px-6">
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

            <div className="lg:col-span-4 bg-slate-900 rounded-[32px] p-10 text-white relative overflow-hidden">
               <div className="absolute top-0 right-0 p-6 opacity-20">
                  <Box className="w-24 h-24" />
               </div>
               <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-8">Shipment LX-M29-PW</div>
               <div className="mb-10">
                  <div className="text-sm text-slate-400 mb-1 font-bold">Estimated Transit Time</div>
                  <div className="text-4xl font-extrabold text-blue-400">14 Days</div>
               </div>
               <div className="space-y-4 mb-10">
                  <div className="flex justify-between items-end border-b border-white/10 pb-2">
                     <span className="text-xs text-slate-400">Next Departure</span>
                     <span className="text-xs font-bold">Tomorrow</span>
                  </div>
                  <div className="flex justify-between items-end border-b border-white/10 pb-2">
                     <span className="text-xs text-slate-400">Available Space</span>
                     <span className="text-xs font-bold text-orange-400">62.8%</span>
                  </div>
               </div>
               <button className="w-full h-14 bg-blue-600 rounded-2xl flex items-center justify-center gap-2 text-sm font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20">
                  Initial Route Design <ArrowRight className="w-4 h-4" />
               </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Rate Engine Section */}
      <section className="py-24 bg-slate-50 dark:bg-slate-950">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
             <div>
               <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-2">Rate Engine</h2>
               <p className="text-slate-500 dark:text-slate-400">Multi-modal market intelligence for real-time freight pricing.</p>
             </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1 bg-white dark:bg-slate-900 p-8 rounded-3xl border border-border shadow-sm">
               <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">Request Custom Quote</div>
               <div className="space-y-4">
                  <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                     <div className="text-[9px] font-black uppercase text-slate-400 mb-1">Origin</div>
                     <div className="text-xs font-bold text-slate-900 dark:text-white">CNSHA (Shanghai)</div>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                     <div className="text-[9px] font-black uppercase text-slate-400 mb-1">Destination</div>
                     <div className="text-xs font-bold text-slate-400">USNYC (New York)</div>
                  </div>
                  <div className="flex gap-2">
                     <div className="flex-1 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-[10px] font-bold text-center">40HC Container</div>
                     <div className="flex-1 p-3 bg-blue-600 rounded-xl text-[10px] font-bold text-white text-center">Sea Freight</div>
                  </div>
                  <button className="w-full bg-slate-900 dark:bg-blue-600 text-white h-12 rounded-xl text-[10px] font-black italic tracking-widest uppercase mt-4">Generate Intel</button>
               </div>
            </div>

            <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
               <QuoteItem type="STANDARD" carrier="Oceanic Lines" price="$1,248" time="24 Days" />
               <QuoteItem type="PREMIUM" carrier="AirBridge XL" price="$4,832" time="3 Days" color="orange" />
               <QuoteItem type="HUB" carrier="Inter-Rail" price="$928" time="18 Days" />
               <QuoteItem type="CONSOLIDATED" carrier="Partner Network" price="$1,110" time="27 Days" />
            </div>
          </div>
        </div>
      </section>

      {/* 5. Global Ledger Section */}
      <section className="py-24 bg-white dark:bg-slate-900/20 border-t border-border">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex justify-between items-center mb-12">
             <h2 className="text-4xl font-black text-slate-900 dark:text-white">Global Ledger</h2>
             <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                <div className="px-4 py-1.5 rounded-lg text-xs font-bold text-slate-500 cursor-pointer">All Shipments</div>
                <div className="px-4 py-1.5 rounded-lg text-xs font-bold bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm cursor-pointer">Active Assets</div>
             </div>
          </div>

          <div className="overflow-x-auto rounded-[32px] border border-border shadow-2xl">
            <table className="w-full text-left bg-white dark:bg-slate-900 border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-border">
                  <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">Asset Identifier</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">Dynamic Route</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">VIP Deliver</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">Current Status</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                <TableRow id="LX-02-BKK" origin="Bangkok Cloud" dest="Chicago Hub" status="In Transit" />
                <TableRow id="LX-91-LHR" origin="Logistics Core" dest="Global Port" status="Pending" color="orange" />
                <TableRow id="LX-45-SFO" origin="West Coast" dest="SFO International" status="Delivered" color="emerald" />
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 6. Predictive Workflows Section */}
      <section className="py-24 bg-slate-900 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 p-32 bg-blue-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-0 p-32 bg-indigo-600/10 blur-[120px] rounded-full" />
        
        <div className="mx-auto max-w-7xl px-6 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/20 rounded-full border border-blue-500/30 text-[10px] font-black uppercase tracking-widest text-blue-400 mb-8 italic">Autonomous Intelligence</div>
              <h2 className="text-5xl font-black leading-[1.1] mb-8">
                Predictive Logistics <br />
                <span className="text-blue-500 italic uppercase">Agentic Workflows</span>
              </h2>
              <p className="text-slate-400 text-lg mb-12 max-w-lg leading-relaxed italic">
                 Harness the power of agentic AI to predict delays, automate bookings, and optimize lane utilization before friction occurs.
              </p>
              
              <div className="space-y-6">
                 <div className="flex items-center gap-5 group cursor-pointer translate-x-0 hover:translate-x-2 transition-transform">
                    <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
                       <ShieldCheck className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                       <div className="font-bold text-white">Auto-Booking Agent</div>
                       <div className="text-xs text-slate-500">Autonomous RFP to booking generation based on live capacity.</div>
                    </div>
                 </div>
                 <div className="flex items-center gap-5 group cursor-pointer translate-x-0 hover:translate-x-2 transition-transform">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
                       <Clock className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div>
                       <div className="font-bold text-white">Predictive Delay Forecasting</div>
                       <div className="text-xs text-slate-500">Identifies potential port congestion 48 hours in advance.</div>
                    </div>
                 </div>
              </div>
            </div>

            <div className="relative">
               <div className="bg-slate-800/40 p-10 rounded-[40px] border border-white/5 backdrop-blur-sm relative z-10">
                  <div className="flex flex-col items-center gap-10">
                    <div className="p-6 bg-slate-700/50 rounded-2xl border border-white/10 w-full text-center">
                       <span className="text-[10px] font-black uppercase text-blue-400 tracking-widest block mb-4">Feed: Raw File Uploaded</span>
                       <div className="flex justify-center gap-4">
                          <FileText className="w-8 h-8 opacity-20" />
                          <ArrowRight className="w-8 h-8 text-blue-500 animate-pulse" />
                          <FileText className="w-8 h-8" />
                       </div>
                    </div>

                    <div className="w-px h-10 bg-gradient-to-b from-blue-500 to-transparent" />

                    <div className="grid grid-cols-2 gap-6 w-full">
                       <div className="p-4 bg-slate-900 rounded-xl border border-white/5 text-center">
                          <div className="text-[9px] font-bold text-slate-500 mb-2">AI Extraction</div>
                          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                             <div className="h-full bg-blue-500" style={{ width: '85%' }} />
                          </div>
                       </div>
                       <div className="p-4 bg-slate-900 rounded-xl border border-white/5 text-center opacity-50">
                          <div className="text-[9px] font-bold text-slate-500 mb-2">Error Masking</div>
                          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                             <div className="h-full bg-indigo-500" style={{ width: '20%' }} />
                          </div>
                       </div>
                    </div>

                    <div className="w-px h-10 bg-gradient-to-t from-blue-500 to-transparent" />

                    <div className="w-full bg-blue-600 p-4 rounded-xl text-center text-[10px] font-black uppercase tracking-widest">
                       Generation System Operational
                    </div>
                  </div>
               </div>
               
               {/* Background Decorative Blur */}
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-500/5 blur-[100px] -z-10" />
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
