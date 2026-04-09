"use client";

import React from "react";
import Image from "next/image";
import { 
  Shield, 
  BarChart3, 
  Users, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  Plus, 
  Search,
  Layout,
  FileText,
  Activity,
  Calendar,
  Lock,
  Globe,
  Bell,
  Map,
  Link2
} from "lucide-react";

export default function InsuranceVisualPlatform() {
  return (
    <div className="bg-slate-50 font-sans text-slate-900 selection:bg-blue-500/30">
      
      {/* 1. Hero Section */}
      <section className="relative py-32 overflow-hidden bg-white">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-slate-50 -z-10 rounded-bl-[10rem]" />
        <div className="mx-auto max-w-6xl px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <div className="inline-block px-3 py-1 mb-6 rounded-full bg-blue-50 border border-blue-100 text-[10px] font-bold tracking-widest text-blue-600 uppercase">
              Insurance Product Walk
            </div>
            <h1 className="text-5xl font-black tracking-tight text-slate-900 sm:text-6xl mb-8 leading-[1.1]">
              The Future of <br />
              <span className="text-blue-600">Insurance <br /> Architecture</span>
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed mb-10 max-w-lg font-medium">
              Architect Intel provides a structural foundation for high-performance 
              insurance teams. Guard data with authority and execute with 
              millisecond speed.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <button className="h-14 px-10 rounded-2xl bg-blue-600 text-white font-bold text-base shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all hover:-translate-y-1 flex items-center gap-2">
                Start Exploring
                <ArrowRight className="w-5 h-5" />
              </button>
              <div className="flex -space-x-3 items-center ml-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden relative">
                    <Image src={`/assets/avatar_${i}.png`} alt="User" fill className="object-cover" />
                  </div>
                ))}
                <div className="pl-6 text-sm font-bold text-slate-400 uppercase tracking-widest">+500 Users</div>
              </div>
            </div>
          </div>
          <div className="relative group">
            <div className="absolute inset-0 bg-blue-600/5 blur-3xl rounded-full" />
            <div className="relative rounded-[3rem] overflow-hidden border border-slate-200 shadow-2xl bg-white shadow-blue-900/10">
              <Image 
                src="/assets/insurance_hero_architecture.png" 
                alt="Insurance Architecture" 
                width={800} 
                height={600} 
                className="w-full h-auto object-cover transition-transform duration-1000 group-hover:scale-110" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Command Center Section */}
      <section className="py-32 bg-slate-50 border-y border-slate-200">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-16">
            <h2 className="text-4xl font-black text-slate-900 mb-3 uppercase tracking-tighter">Command Center</h2>
            <p className="text-slate-500 font-medium max-w-2xl uppercase text-[11px] tracking-widest opacity-60">Real-time revenue visibility and pipeline health metrics based on architectural throughput.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <KPICard title="ANNUAL REVENUE MANAGED" value="$42.8M" change="+12.4% vs LY" />
            <KPICard title="NEW POLICIES TODAY" value="184" change="+8% vs avg" />
            <KPICard title="RETENTION RATE" value="98.2%" change="stable" />
            <KPICard title="CLAIMS PROCESSED" value="1.4d" change="-0.3d" isGood={false} />
          </div>

          <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm relative overflow-hidden group">
            <div className="flex justify-between items-center mb-12">
              <h3 className="font-bold text-slate-900 uppercase tracking-tight">Historical vs Projected Growth</h3>
              <div className="flex items-center gap-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-slate-200" /> Historical</span>
                <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-600" /> Projected</span>
              </div>
            </div>
            
            <div className="relative h-64 w-full rounded-2xl overflow-hidden border border-slate-50 transition-transform duration-700 group-hover:scale-[1.02] shadow-inner">
              <Image 
                src="/assets/insurance_growth_chart.png" 
                alt="Growth Chart" 
                fill 
                className="object-cover opacity-90" 
              />
              <div className="absolute inset-0 bg-linear-to-t from-white/20 to-transparent pointer-events-none" />
            </div>
          </div>

        </div>
      </section>

      {/* 3. Leads Intelligence Section */}
      <section className="py-32 bg-white">
        <div className="mx-auto max-w-6xl px-6 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div>
            <div className="inline-block px-3 py-1 mb-6 rounded-full bg-slate-100 border border-slate-200 text-[10px] font-bold tracking-widest text-slate-500 uppercase">
              Module 01
            </div>
            <h2 className="text-4xl font-black text-slate-900 mb-8 leading-tight uppercase tracking-tighter">
              Leads Intelligence
            </h2>
            <p className="text-lg text-slate-500 mb-10 leading-relaxed font-medium">
              Identify and prioritize high-value prospects with our proprietary 
              Lead Scoring engine. We analyze 50+ data points to ensure your 
              brokers focus on the most architecturally sound opportunities.
            </p>
            <div className="space-y-6">
              <FeatureItem text="Real-time Lead Scoring" />
              <FeatureItem text="Automated Enrichment" />
              <FeatureItem text="Dynamic Distribution Engine" />
            </div>
          </div>
          <div className="bg-slate-50 p-10 rounded-[3rem] border border-slate-200 shadow-xl overflow-hidden group bg-linear-to-br from-slate-50 to-white">
            <div className="flex justify-between items-center mb-8">
              <h3 className="font-bold text-slate-900 uppercase text-xs tracking-widest">Top Leads LP-25</h3>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400/20 border border-red-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/20 border border-yellow-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-400/20 border border-green-400" />
              </div>
            </div>
            <div className="space-y-5">
              <LeadRow name="Adrian Griffin" company="United Insurance Hub" score="High" status="Engaged" />
              <LeadRow name="Maria DeLuca" company="Beacon Logistics" score="New" status="Slow" />
              <LeadRow name="Rick Smith" company="Colonial Global Intel" score="Med" status="Dormant" />
            </div>
          </div>
        </div>
      </section>

      {/* 4. Opportunity Pipeline Section */}
      <section className="py-32 bg-slate-50 border-y border-slate-200">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <div className="mb-20">
            <div className="text-[10px] font-bold text-blue-600 uppercase tracking-[0.4em] mb-4 underline decoration-2 underline-offset-8">Module 02</div>
            <h2 className="text-4xl font-black text-slate-900 mb-4 uppercase tracking-tighter">Opportunity Pipeline</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <PipelineColumn title="Underwriting" count={12} items={[
              { name: "Westside Real Estate", value: "$32,500" },
              { name: "Harborside Transition", value: "$12,400" }
            ]} />
            <PipelineColumn title="Proposal Sent" count={8} items={[
              { name: "Plum Creek International", value: "$84,200", isFeatured: true }
            ]} />
            <PipelineColumn title="Binding / Finalized" count={23} items={[
              { name: "Swift Logistics UK-Ltd", value: "$76,900" }
            ]} />
          </div>
        </div>
      </section>

      {/* MISSING: Strategic Account Profiles Section */}
      <section className="py-32 bg-white">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div className="grid grid-cols-2 gap-6 order-2 lg:order-1">
              <div className="space-y-6">
                <div className="relative h-64 rounded-3xl overflow-hidden shadow-2xl group border border-slate-100">
                   <Image src="/assets/strategic_maritime.png" alt="Maritime" fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                   <div className="absolute inset-0 bg-linear-to-t from-slate-900/60 to-transparent flex flex-col justify-end p-6">
                      <div className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1">Key Account</div>
                      <div className="text-xs font-black text-white uppercase tracking-tight">Maritime Shipping</div>
                   </div>
                </div>
                <div className="relative h-48 rounded-3xl overflow-hidden shadow-2xl group border border-slate-100">
                   <Image src="/assets/strategic_manufacturing.png" alt="Manufacturing" fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                   <div className="absolute inset-0 bg-linear-to-t from-slate-900/60 to-transparent flex flex-col justify-end p-6">
                      <div className="text-xs font-black text-white uppercase tracking-tight">Tiled Manufacturing</div>
                   </div>
                </div>
              </div>
              <div className="pt-12">
                <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 h-full flex flex-col justify-center">
                   <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-blue-600 mb-6">
                      <Map className="w-6 h-6" />
                   </div>
                   <h3 className="text-lg font-black text-slate-900 uppercase tracking-tighter mb-4 leading-none">Relationship Mapping</h3>
                   <p className="text-xs text-slate-500 font-medium leading-relaxed tracking-tight">Visualize the internal structure of your largest accounts. Identify champions, decision-makers, and influencers across multi-national negotiations with our structural heat maps.</p>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">Module 03</div>
              <h2 className="text-4xl font-black text-slate-900 mb-8 leading-tight uppercase tracking-tighter">Strategic Account <br /> Profiles</h2>
              <p className="text-lg text-slate-500 font-medium leading-relaxed mb-10 max-w-sm">
                Deliver and analyze vertical details, Architect Intel provides a 360-degree blueprint of your client relationships, policy histories, and white-space opportunities.
              </p>
              <div className="flex items-center gap-4 text-blue-600 font-black text-xs uppercase tracking-widest cursor-pointer group">
                 Launch Blueprint
                 <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Precision Scheduling Section */}
      <section className="py-32 bg-slate-50 border-y border-slate-200 overflow-hidden">
        <div className="mx-auto max-w-6xl px-6 grid grid-cols-1 lg:grid-cols-5 gap-16 items-start">
          <div className="lg:col-span-2">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">Module 04</div>
            <h2 className="text-4xl font-black text-slate-900 mb-8 leading-tight uppercase tracking-tighter">Precision Scheduling</h2>
            <p className="text-xl text-slate-500 leading-relaxed font-medium max-w-md">
              Never miss a renewal or a strategic review meeting with our hyper-focused task management system.
            </p>
          </div>
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-8 h-fit">
            <div className="bg-slate-900 text-white p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-12 bg-blue-600/10 blur-3xl rounded-full group-hover:bg-blue-600/20 transition-colors" />
              <div className="flex items-center gap-3 mb-10 relative">
                <Calendar className="w-5 h-5 text-blue-400" />
                <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Upcomings Next 7</span>
              </div>
              <div className="space-y-4 relative">
                <TaskItem time="12:00" title="Renewal Review: Atlantic Tech" color="border-l-4 border-blue-500" />
                <TaskItem time="14:30" title="Claims Audit - UK Global" color="border-l-4 border-slate-700" />
              </div>
            </div>
            <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm transition-all hover:shadow-xl">
              <h3 className="font-black text-slate-900 text-[10px] uppercase tracking-[0.2em] mb-8 text-center opacity-40">Quarterly Renewal Blueprint</h3>
              <div className="grid grid-cols-5 gap-2.5">
                {Array.from({ length: 15 }).map((_, i) => (
                  <div key={i} className={`h-12 rounded-xl border border-slate-200 flex items-center justify-center text-[10px] font-bold transition-all ${i === 8 ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/20' : 'bg-white text-slate-400 hover:border-blue-200 hover:scale-105'}`}>
                    {i + 10}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Claim Integrity Section */}
      <section className="py-32 bg-white text-slate-900 relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-6 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center relative">
          <div>
            <div className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-8 underline decoration-blue-600 decoration-2 underline-offset-8">Module 05</div>
            <h2 className="text-4xl font-black mb-8 leading-tight tracking-tighter uppercase">Claim Integrity & <br />Case Management</h2>
            <p className="text-lg text-slate-500 mb-12 leading-relaxed font-medium">
              Process claims with the precision of structural engineers. Our Case Management module 
              integrates directly with revenue adjusters and legal teams to ensure transparent and 
              rapid resolution.
            </p>
            <div className="grid grid-cols-2 gap-10">
              <div className="group cursor-default">
                <Globe className="w-10 h-10 text-blue-600 mb-5 group-hover:scale-110 transition-transform" />
                <h4 className="font-bold text-lg mb-2 uppercase tracking-tight">Global Risks</h4>
                <p className="text-xs text-slate-400 font-medium leading-relaxed uppercase tracking-tight">GDP variants impact claims scoring and automated classification.</p>
              </div>
              <div className="group cursor-default">
                <Activity className="w-10 h-10 text-cyan-500 mb-5 group-hover:scale-110 transition-transform" />
                <h4 className="font-bold text-lg mb-2 uppercase tracking-tight">Logic Ledger</h4>
                <p className="text-xs text-slate-400 font-medium leading-relaxed uppercase tracking-tight">Immutable evidence snapshots for complex liquidity benefits.</p>
              </div>
            </div>
          </div>
          <div className="bg-slate-900 p-10 rounded-[3rem] shadow-2xl overflow-hidden relative border border-slate-800">
            <div className="flex justify-between items-center mb-10 border-b border-slate-800 pb-8">
              <div className="flex items-center gap-4 text-white">
                <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-blue-400 text-lg font-black shadow-inner">CT</div>
                <div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">Case #CS-98034</div>
                  <div className="text-sm font-black uppercase tracking-tight">Atlantic Tech Fire Claim</div>
                </div>
              </div>
              <div className="text-blue-400 font-bold text-[10px] uppercase tracking-widest bg-blue-900/40 px-4 py-1.5 rounded-full border border-blue-900 shadow-sm">Primary Level</div>
            </div>
            <div className="space-y-5">
              <div className="flex items-center justify-between p-5 rounded-2xl bg-slate-800 border border-slate-700 shadow-inner group cursor-pointer hover:bg-slate-700 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  </div>
                  <span className="text-sm font-bold text-white uppercase tracking-tight group-hover:translate-x-1 transition-transform">Incident Report Verified</span>
                </div>
                <span className="text-[10px] text-slate-500 font-black uppercase">2h ago</span>
              </div>
              <div className="flex items-center justify-between p-5 rounded-2xl border border-slate-800 animate-pulse bg-slate-800/50">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-blue-500" />
                  </div>
                  <span className="text-sm font-bold text-white uppercase tracking-tight">Adjuster Approval</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] text-slate-500 font-black uppercase">Exp. 4h</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. CTA Section */}
      <section className="py-32 bg-blue-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
        <div className="mx-auto max-w-4xl px-6 text-center relative z-10">
          <h2 className="text-4xl font-black text-white mb-8 leading-tight tracking-tighter uppercase">
            Ready to Build the Future <br /> of Your Enterprise?
          </h2>
          <p className="text-xl text-blue-100 mb-12 font-medium">
            Join the world&apos;s leading insurance firms in creating a more structural, intelligent, and authoritative workspace.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <button className="h-14 px-12 rounded-2xl bg-white text-blue-600 font-black text-lg transition-all hover:scale-105 shadow-2xl hover:shadow-white/20">
              Request a Demo
            </button>
            <button className="h-14 px-12 rounded-2xl bg-blue-700 text-white font-black text-lg border border-blue-400 transition-all hover:bg-blue-800 hover:border-white/20">
              Contact Sales
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}

function KPICard({ title, value, change, isGood = true }: { title: string, value: string, change: string, isGood?: boolean }) {
  return (
    <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm transition-all hover:-translate-y-2 hover:shadow-xl group">
      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6 border-b border-slate-50 pb-2 group-hover:text-blue-600 transition-colors tracking-widest leading-none">{title}</div>
      <div className="text-4xl font-black text-slate-900 mb-3 tracking-tighter">{value}</div>
      <div className={`text-[10px] font-black uppercase tracking-tighter px-3 py-1 rounded-full inline-block ${isGood ? 'bg-green-100 text-green-600 shadow-sm rotate-2' : 'bg-blue-100 text-blue-600 shadow-sm -rotate-2'}`}>{change}</div>
    </div>
  );
}

function FeatureItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-4 group">
      <div className="w-7 h-7 rounded-sm bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
        <CheckCircle2 className="w-4 h-4" />
      </div>
      <span className="text-slate-700 font-black uppercase text-[10px] tracking-widest group-hover:translate-x-1 transition-transform">{text}</span>
    </div>
  );
}

function LeadRow({ name, company, score, status }: { name: string, company: string, score: string, status: string }) {
  return (
    <div className="flex items-center justify-between p-5 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-xl transition-all hover:-translate-x-1 cursor-pointer">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden transition-transform hover:rotate-6">
          <Users className="w-6 h-6 text-slate-300" />
        </div>
        <div>
          <div className="text-sm font-black text-slate-900 leading-none mb-1.5 uppercase tracking-tight">{name}</div>
          <div className="text-[9px] text-slate-400 font-bold uppercase tracking-widest leading-none">{company}</div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <span className={`text-[9px] items-center px-4 font-black uppercase py-1 border rounded-full ${score === 'High' ? 'bg-green-50 border-green-100 text-green-600' : score === 'New' ? 'bg-blue-50 border-blue-100 text-blue-600' : 'bg-slate-50 border-slate-100 text-slate-600'}`}>
          {score}
        </span>
        <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">{status}</span>
      </div>
    </div>
  );
}

function PipelineColumn({ title, count, items }: { title: string, count: number, items: any[] }) {
  return (
    <div className="flex-1">
      <div className="flex justify-between items-center mb-8 pb-4 border-b-2 border-slate-200">
        <h3 className="font-black text-slate-900 uppercase text-[11px] tracking-[0.3em]">{title}</h3>
        <span className="text-[10px] font-black w-7 h-7 flex items-center justify-center bg-slate-900 text-white rounded-lg shadow-lg rotate-12">{count}</span>
      </div>
      <div className="space-y-4">
        {items.map((item, i) => (
          <div key={i} className={`p-6 rounded-[2rem] bg-white border border-slate-200 shadow-sm text-left hover:shadow-2xl transition-all hover:scale-102 cursor-pointer ${item.isFeatured ? 'ring-4 ring-blue-500/10 border-blue-500/30' : ''}`}>
            <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              Architecture File
            </div>
            <div className="text-sm font-black text-slate-900 mb-6 uppercase tracking-tight leading-tight">{item.name}</div>
            <div className="flex justify-between items-center pt-4 border-t border-slate-50">
              <span className="text-blue-600 font-black text-xs tracking-widest">{item.value}</span>
              <ArrowRight className="w-4 h-4 text-slate-200" />
            </div>
          </div>
        ))}
        <button className="w-full h-14 rounded-[2rem] border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-300 hover:border-blue-300 hover:text-blue-300 transition-all hover:bg-white active:scale-95">
          <Plus className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}

function TaskItem({ time, title, color }: { time: string, title: string, color: string }) {
  return (
    <div className={`p-5 rounded-2xl bg-white/5 border-l-4 border-slate-800 ${color} transition-all hover:bg-white/10 cursor-pointer group`}>
      <div className="text-[10px] font-black text-blue-400 mb-1.5 uppercase tracking-widest group-hover:translate-x-1 transition-transform">{time}</div>
      <div className="text-sm font-black text-slate-200 uppercase tracking-tight leading-tight">{title}</div>
    </div>
  );
}
