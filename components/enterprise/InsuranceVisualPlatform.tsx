"use client";

import React from "react";
import Image from "next/image";
import { 
  Shield, 
  Users, 
  ArrowRight, 
  Plus, 
  Search,
  FileText,
  Calendar,
  Bell
} from "lucide-react";

export default function InsuranceVisualPlatform() {
  return (
    <div className="bg-slate-50 font-sans text-slate-900 selection:bg-blue-500/30">
      
      {/* 1. Hero Section */}
      <section className="relative py-32 overflow-hidden bg-white">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-slate-50 -z-10 rounded-bl-[10rem]" />
        <div className="mx-auto max-w-6xl px-24 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <div className="inline-block px-3 py-1 mb-6 rounded-full bg-indigo-50 border border-indigo-100 text-[10px] font-bold tracking-widest text-indigo-600 uppercase">
              Insurance Product Walk
            </div>
            <h1 className="text-5xl font-extrabold tracking-tightest text-slate-900 sm:text-7xl mb-8 leading-[1.05] uppercase">
              The Future of <br />
              <span className="text-indigo-600">Insurance <br /> Intelligence</span>
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed mb-10 max-w-lg font-medium">
              Elite CRM and Architecture for high-performance 
              insurance teams. Track pipelines, manage accounts, and 
              verify entities with authority.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <button className="h-14 px-10 rounded-2xl bg-indigo-600 text-white font-bold text-base shadow-xl shadow-indigo-500/20 hover:bg-indigo-700 transition-all hover:-translate-y-1 flex items-center gap-2 uppercase tracking-widest">
                Explore Elite Portal
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="relative group">
            <div className="absolute inset-0 bg-indigo-600/5 blur-3xl rounded-full" />
            <div className="relative rounded-[3rem] overflow-hidden border border-slate-200 shadow-2xl bg-white shadow-indigo-900/10">
              <Image 
                src="/assets/insurance_hero_architecture.png" 
                alt="Insurance Intelligence" 
                width={800} 
                height={600} 
                className="w-full h-auto object-cover transition-transform duration-1000 group-hover:scale-110" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Executive Analytics Dashboard Section */}
      <section className="py-32 bg-slate-50 border-y border-slate-200">
        <div className="mx-auto max-w-6xl px-24">
          <div className="mb-16">
            <h2 className="text-4xl font-extrabold text-slate-900 mb-3 uppercase tracking-tightest">Executive Analytics Dashboard</h2>
            <p className="text-slate-400 font-bold max-w-2xl uppercase text-[10px] tracking-[0.25em] opacity-80">Revenue forecasting and pipeline visibility powered by elite commercial intelligence.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <KPICard title="TOTAL LEADS" value="1,284" change="+18.2% vs avg" />
            <KPICard title="OPEN OPPORTUNITIES" value="442" change="+12.4% vs LY" />
            <KPICard title="CONVERSION RATE" value="28.5%" change="+2.1% spike" />
            <KPICard title="REVENUE PIPELINE" value="$4.2M" change="+15% Projected" isGood={true} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Leads by Stage - Horizontal Bar Chart Mock */}
            <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm relative overflow-hidden group transition-all hover:shadow-xl">
              <div className="flex justify-between items-center mb-8">
                <h3 className="font-extrabold text-slate-900 uppercase text-xs tracking-widest">Leads by Stage</h3>
                <div className="text-[10px] font-bold text-indigo-600 uppercase">Live Distribution</div>
              </div>
              <div className="space-y-4">
                <LeadStageBar label="New" count={442} percentage={100} color="bg-indigo-600" />
                <LeadStageBar label="In Process" count={284} percentage={65} color="bg-blue-600" />
                <LeadStageBar label="Assigned" count={156} percentage={35} color="bg-slate-400" />
                <LeadStageBar label="Converted" count={92} percentage={20} color="bg-emerald-500" />
              </div>
            </div>

            {/* Leads by Type - Donut Chart Mock (Simplified Visual) */}
            <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm relative overflow-hidden group transition-all hover:shadow-xl">
              <div className="flex justify-between items-center mb-8">
                <h3 className="font-extrabold text-slate-900 uppercase text-xs tracking-widest">Leads by Type</h3>
                <div className="text-[10px] font-bold text-blue-600 uppercase">Source Insights</div>
              </div>
              <div className="flex items-center gap-12 h-48">
                 <div className="relative w-40 h-40">
                    <div className="absolute inset-0 rounded-full border-[16px] border-slate-100" />
                    <div className="absolute inset-0 rounded-full border-[16px] border-indigo-600 border-t-transparent border-r-transparent rotate-[30deg]" />
                    <div className="absolute inset-0 rounded-full border-[16px] border-blue-500 border-l-transparent border-b-transparent -rotate-[15deg]" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                       <div className="text-xl font-black text-slate-900">84%</div>
                       <div className="text-[8px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-1">Direct</div>
                    </div>
                 </div>
                 <div className="space-y-4">
                    <DonutLegend label="Fresh Leads" color="bg-indigo-600" value="45%" />
                    <DonutLegend label="Renewal" color="bg-blue-500" value="32%" />
                    <DonutLegend label="Broker Net" color="bg-slate-300" value="23%" />
                 </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm relative overflow-hidden group">
            <div className="flex justify-between items-center mb-12">
              <h3 className="font-extrabold text-slate-900 uppercase text-xs tracking-widest">Lead Creation Trend vs Pipeline Funnel</h3>
              <div className="flex items-center gap-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-slate-200" /> Creation Trend</span>
                <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-indigo-600" /> Opportunity Funnel</span>
              </div>
            </div>
            
            <div className="grid grid-cols-5 gap-4 h-64 items-end">
               {[40, 65, 55, 85, 95].map((h, i) => (
                 <div key={i} className="relative group/bar flex flex-col items-center gap-4 h-full justify-end">
                    <div className="w-full bg-indigo-50 dark:bg-indigo-900/50 rounded-t-2xl transition-all group-hover/bar:bg-indigo-100" style={{ height: `${h}%` }}>
                       <div className="absolute top-4 left-1/2 -translate-x-1/2 opacity-0 group-hover/bar:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] px-2 py-1 rounded-lg">
                          ${(h * 42).toFixed(0)}k
                       </div>
                    </div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Q{i+1} 24</div>
                 </div>
               ))}
               <div className="absolute inset-x-10 bottom-[108px] h-[300px] pointer-events-none opacity-10">
                  <div className="w-full h-full border-b-[80px] border-l-[300px] border-r-[300px] border-b-indigo-700/20 border-l-transparent border-r-transparent" />
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Lead Intelligence & Management Section */}
      <section className="py-32 bg-white">
        <div className="mx-auto max-w-6xl px-24 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div>
            <div className="inline-block px-3 py-1 mb-6 rounded-full bg-indigo-50 border border-indigo-100 text-[10px] font-bold tracking-widest text-indigo-600 uppercase">
              Module 01: CRM Excellence
            </div>
            <h2 className="text-4xl font-extrabold text-slate-900 mb-8 leading-tight uppercase tracking-tightest">
              Lead Intelligence <br />& Management
            </h2>
            <p className="text-lg text-slate-500 mb-10 leading-relaxed font-medium">
              Transform raw data into revenue. Track overdue tasks, manage today&apos;s priorities, and automate lead distribution with precision filters and bulk import capabilities.
            </p>
            
            <div className="flex flex-wrap gap-4 mb-10">
               <ActivityFilter label="Overdue" count={12} active={true} color="bg-red-500" />
               <ActivityFilter label="Due Today" count={8} active={false} color="bg-amber-500" />
               <ActivityFilter label="Upcoming" count={24} active={false} color="bg-blue-500" />
            </div>

            <div className="flex items-center gap-6">
               <button className="h-12 px-8 rounded-xl bg-indigo-600 text-white font-bold text-xs uppercase tracking-widest shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 transition-all flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Bulk Import
               </button>
               <button className="h-12 px-8 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs uppercase tracking-widest hover:bg-slate-50 transition-all">
                  Manage Settings
               </button>
            </div>
          </div>
          <div className="bg-slate-50 p-10 rounded-[3rem] border border-slate-200 shadow-xl overflow-hidden group bg-linear-to-br from-indigo-50/30 to-white">
            <div className="flex justify-between items-center mb-8">
              <h3 className="font-extrabold text-slate-900 uppercase text-xs tracking-widest">Smart Table: Lead Queue</h3>
              <div className="flex items-center gap-2">
                 <Search className="w-4 h-4 text-slate-400" />
                 <div className="text-[10px] font-bold text-slate-400 uppercase">Filters Active</div>
              </div>
            </div>
            <div className="space-y-5">
              <LeadRow name="Apollo Tyres Ltd" company="Industrial Manufacturing" score="High" status="Overdue" />
              <LeadRow name="Reliance Retail" company="Enterprise Sales" score="New" status="Follow-up" />
              <LeadRow name="Tata Motors" company="Global Logistics" score="Med" status="Review" />
            </div>
          </div>
        </div>
      </section>

      {/* 4. Visual Opportunity Pipeline (Kanban) Section */}
      <section className="py-32 bg-slate-50 border-y border-slate-200">
        <div className="mx-auto max-w-6xl px-24 text-center">
          <div className="mb-20">
            <h2 className="text-4xl font-extrabold text-slate-900 mb-4 uppercase tracking-tightest">Visual Opportunity Pipeline</h2>
            <p className="text-slate-400 font-bold max-w-2xl mx-auto uppercase text-[10px] tracking-[0.25em] opacity-80">Move leads from &apos;Initial Review&apos; to &apos;Quote Request&apos; using a visual Kanban architecture.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <PipelineColumn title="Initial Review" count={5} items={[
              { name: "Global Logistics HUB", value: "$120,000", priority: "High", date: "Closing: Oct 24" },
              { name: "Redwood Property", value: "$45,000", priority: "Med", date: "Closing: Nov 12" }
            ]} />
            <PipelineColumn title="Info Gathering" count={3} items={[
              { name: "BlueChip Tech Corp", value: "$85,000", priority: "High", isFeatured: true, date: "Closing: Oct 30" }
            ]} />
            <PipelineColumn title="Quote Request" count={12} items={[
              { name: "Evergreen Maritime", value: "$210,000", priority: "Low", date: "Closing: Dec 05" }
            ]} />
          </div>
        </div>
      </section>

      {/* 5. 360-Degree Account Insights Section */}
      <section className="py-32 bg-white">
        <div className="mx-auto max-w-6xl px-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div className="bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden group shadow-2xl">
              <div className="absolute top-0 right-0 p-12 bg-indigo-600/10 blur-[100px] rounded-full" />
              
              <div className="flex justify-between items-start mb-10 relative">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center text-slate-900 text-2xl font-black">AT</div>
                  <div>
                    <h3 className="text-2xl font-black tracking-tight uppercase">Apollo Tyres Ltd</h3>
                    <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Industrial • Fortune 500</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Market Cap</div>
                  <div className="text-xl font-black text-emerald-400">$3.84B</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-10 relative">
                <FirmographicItem label="CIN" value="L25111DL1972PLC006049" />
                <FirmographicItem label="GST Number" value="07AAA CA1234 A1Z5" />
                <FirmographicItem label="PAN Number" value="AAA CA1234 A" />
                <FirmographicItem label="Annual Revenue" value="$2.4B (FY23)" />
              </div>

              <div className="border-t border-slate-800 pt-8 relative">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">News Alerts</div>
                <div className="space-y-4">
                  <NewsItem text="Apollo Tyres reports 20% growth in EV segment" date="2h ago" />
                  <NewsItem text="Strategic expansion into European markets confirmed" date="Yesterday" />
                </div>
              </div>
            </div>

            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">Module 03: Entity Intelligence</div>
              <h2 className="text-4xl font-extrabold text-slate-900 mb-8 leading-tight uppercase tracking-tightest">360-Degree <br /> Account Insights</h2>
              <p className="text-lg text-slate-500 font-medium leading-relaxed mb-10 max-w-sm">
                Get commercial intelligence at your fingertips. From CIN and GST verification to real-time financial news alerts for every enterprise account.
              </p>
              
              <div className="space-y-6 mb-10">
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                       <Shield className="w-5 h-5" />
                    </div>
                    <div>
                       <div className="font-bold text-slate-900">Firmographic Verification</div>
                       <div className="text-xs text-slate-500">Instant validation of legal and financial identifiers.</div>
                    </div>
                 </div>
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                       <Bell className="w-5 h-5" />
                    </div>
                    <div>
                       <div className="font-bold text-slate-900">Real-Time News Feed</div>
                       <div className="text-xs text-slate-500">Automated tracking of client-related financial events.</div>
                    </div>
                 </div>
              </div>

              <div className="flex items-center gap-4 text-indigo-600 font-black text-xs uppercase tracking-widest cursor-pointer group">
                 Open Account View
                 <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Precision Scheduling Section */}
      <section className="py-32 bg-slate-50 border-y border-slate-200 overflow-hidden">
        <div className="mx-auto max-w-6xl px-24 grid grid-cols-1 lg:grid-cols-5 gap-16 items-start">
          <div className="lg:col-span-2">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">Module 04</div>
            <h2 className="text-4xl font-extrabold text-slate-900 mb-8 leading-tight uppercase tracking-tightest">Precision Scheduling</h2>
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

      {/* 6. Client Support & Case Management Section */}
      <section className="py-32 bg-white text-slate-900 relative overflow-hidden border-t border-slate-100">
        <div className="mx-auto max-w-6xl px-24 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center relative">
          <div>
            <div className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mb-8 underline decoration-indigo-600 decoration-2 underline-offset-8">Module 05: Service Center</div>
            <h2 className="text-4xl font-extrabold mb-8 leading-tight tracking-tightest uppercase">Client Support & <br />Case Management</h2>
            <p className="text-lg text-slate-500 mb-12 leading-relaxed font-medium">
              Ensure long-term satisfaction with our integrated ticketing system. Manage policy renewals, claim updates, and technical inquiries in one central hub.
            </p>
            <div className="grid grid-cols-2 gap-6">
               <SupportTag label="Billing" />
               <SupportTag label="Claims" />
               <SupportTag label="Technical" />
               <SupportTag label="Renewal" />
            </div>
          </div>
          <div className="bg-slate-900 p-10 rounded-[3rem] shadow-2xl overflow-hidden relative border border-slate-800">
            <div className="flex justify-between items-center mb-10 pb-8 border-b border-slate-800">
              <div className="text-xs font-black text-white uppercase tracking-widest">Active Tickets</div>
              <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Live Sync</span>
              </div>
            </div>
            
            <div className="space-y-4">
               <TicketItem 
                 id="TK-4821" 
                 subject="Policy renewal inquiry" 
                 type="Sales" 
                 priority="High" 
                 status="Processing" 
               />
               <TicketItem 
                 id="TK-4822" 
                 subject="Claim status update" 
                 type="Claims" 
                 priority="Medium" 
                 status="In Review" 
               />
               <TicketItem 
                 id="TK-4823" 
                 subject="Billing discrepancy" 
                 type="Billing" 
                 priority="Low" 
                 status="Pending" 
               />
            </div>
          </div>
        </div>
      </section>

      {/* 7. CTA Section */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-6xl px-24">
          <div className="relative overflow-hidden bg-indigo-600 rounded-[4rem] py-20 px-12 text-center group">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            
            <div className="max-w-2xl mx-auto relative z-10">
              <h2 className="text-3xl font-extrabold text-white mb-6 leading-tight tracking-tightest uppercase">
                Ready to Build the Future <br /> of Your Elite Portal?
              </h2>
              <p className="text-base text-indigo-100 mb-10 font-medium opacity-90">
                Join the world&apos;s leading insurance firms in creating a more structural, intelligent, and authoritative workspace.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button className="h-12 px-10 rounded-2xl bg-white text-indigo-600 font-black text-xs transition-all hover:scale-105 shadow-2xl hover:shadow-white/20 uppercase tracking-widest leading-none">
                  Request a Demo
                </button>
                <button className="h-12 px-10 rounded-2xl bg-indigo-700 text-white font-black text-xs border border-indigo-400/50 transition-all hover:bg-indigo-800 hover:border-white/20 uppercase tracking-widest leading-none">
                  Contact Sales
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

function KPICard({ title, value, change, isGood = true }: { title: string, value: string, change: string, isGood?: boolean }) {
  return (
    <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40 transition-all hover:-translate-y-2 hover:shadow-2xl group">
      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6 border-b border-slate-50 pb-2 group-hover:text-indigo-600 transition-colors tracking-[0.2em] leading-none">{title}</div>
      <div className="text-4xl font-black text-slate-900 mb-3 tracking-tighter">{value}</div>
      <div className={`text-[10px] font-black uppercase tracking-tighter px-3 py-1 rounded-full inline-block ${isGood ? 'bg-indigo-50 text-indigo-600 shadow-sm' : 'bg-blue-50 text-blue-600 shadow-sm'}`}>{change}</div>
    </div>
  );
}

function LeadStageBar({ label, count, percentage, color }: { label: string, count: number, percentage: number, color: string }) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
        <span>{label}</span>
        <span>{count}</span>
      </div>
      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
        <div 
          className={`h-full ${color} rounded-full transition-all duration-1000`} 
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function DonutLegend({ label, color, value }: { label: string, color: string, value: string }) {
  return (
    <div className="flex items-center justify-between gap-8 group">
      <div className="flex items-center gap-3">
        <div className={`w-2 h-2 rounded-full ${color}`} />
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest group-hover:text-slate-900 transition-colors">{label}</span>
      </div>
      <span className="text-xs font-black text-slate-900">{value}</span>
    </div>
  );
}

function ActivityFilter({ label, count, active, color }: { label: string, count: number, active: boolean, color: string }) {
  return (
    <button className={`flex items-center gap-3 px-5 py-2.5 rounded-full border transition-all ${active ? 'bg-indigo-50 border-indigo-200 shadow-sm' : 'bg-white border-slate-100 hover:border-slate-300'}`}>
      <div className={`w-1.5 h-1.5 rounded-full ${color} ${active ? 'animate-pulse' : ''}`} />
      <span className={`text-[10px] font-bold uppercase tracking-widest ${active ? 'text-indigo-600' : 'text-slate-400'}`}>{label}</span>
      <span className={`text-[10px] font-black ${active ? 'text-indigo-600' : 'text-slate-900'}`}>{count}</span>
    </button>
  );
}

function FirmographicItem({ label, value }: { label: string, value: string }) {
  return (
    <div>
       <div className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-1.5">{label}</div>
       <div className="text-xs font-black text-white hover:text-indigo-400 transition-colors cursor-default">{value}</div>
    </div>
  );
}

function NewsItem({ text, date }: { text: string, date: string }) {
  return (
    <div className="flex items-start gap-3 group cursor-pointer transition-all hover:translate-x-1">
       <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 group-hover:scale-125 transition-transform" />
       <div>
          <div className="text-[11px] font-bold text-slate-300 leading-tight mb-1 group-hover:text-white">{text}</div>
          <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{date}</div>
       </div>
    </div>
  );
}

function SupportTag({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 group transition-all hover:bg-white hover:shadow-xl hover:-translate-y-1">
       <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600">
          <FileText className="w-4 h-4" />
       </div>
       <span className="text-xs font-black text-slate-900 uppercase tracking-tight">{label}</span>
    </div>
  );
}

function TicketItem({ id, subject, type, priority, status }: { id: string, subject: string, type: string, priority: string, status: string }) {
  const priorityColor = priority === 'High' ? 'text-red-400 bg-red-400/10 border-red-400/20' : priority === 'Medium' ? 'text-amber-400 bg-amber-400/10 border-amber-400/20' : 'text-blue-400 bg-blue-400/10 border-blue-400/20';
  
  return (
    <div className="p-5 rounded-2xl bg-white/5 border border-slate-800 flex items-center justify-between group cursor-pointer hover:bg-white/10 transition-all">
       <div className="flex items-center gap-5">
          <div className="text-[10px] font-black text-slate-500 mono">{id}</div>
          <div>
             <div className="text-sm font-black text-white leading-none mb-1.5">{subject}</div>
             <div className="flex items-center gap-3">
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{type}</span>
                <span className={`text-[8px] px-2 py-0.5 rounded-full border font-black uppercase tracking-widest ${priorityColor}`}>{priority}</span>
             </div>
          </div>
       </div>
       <div className="text-[9px] font-black text-indigo-400 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">{status}</div>
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
        <span className={`text-[9px] items-center px-4 font-black uppercase py-1 border rounded-full ${score === 'High' ? 'bg-indigo-50 border-indigo-100 text-indigo-600' : score === 'New' ? 'bg-blue-50 border-blue-100 text-blue-600' : 'bg-slate-50 border-slate-100 text-slate-600'}`}>
          {score}
        </span>
        <span className={`text-[9px] font-bold uppercase tracking-widest ${status === 'Overdue' ? 'text-red-500' : 'text-slate-300'}`}>{status}</span>
      </div>
    </div>
  );
}

interface PipelineItem {
  name: string;
  value: string;
  priority?: string;
  date?: string;
  isFeatured?: boolean;
}

function PipelineColumn({ title, count, items }: { title: string, count: number, items: PipelineItem[] }) {
  return (
    <div className="flex-1">
      <div className="flex justify-between items-center mb-8 pb-4 border-b-2 border-slate-200">
        <h3 className="font-black text-slate-900 uppercase text-[11px] tracking-[0.3em]">{title}</h3>
        <span className="text-[10px] font-black w-7 h-7 flex items-center justify-center bg-indigo-600 text-white rounded-lg shadow-lg rotate-12">{count}</span>
      </div>
      <div className="space-y-4">
        {items.map((item, i) => (
          <div key={i} className={`p-6 rounded-[2rem] bg-white border border-slate-200 shadow-sm text-left hover:shadow-2xl transition-all hover:scale-102 cursor-pointer ${item.isFeatured ? 'ring-4 ring-indigo-500/10 border-indigo-500/30' : ''}`}>
            <div className="flex justify-between items-start mb-3">
               <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                 {item.priority || 'Standard'} Priority
               </div>
               <span className="text-[8px] font-black text-indigo-600 uppercase tracking-widest border border-indigo-100 px-2 py-0.5 rounded-full">New Deal</span>
            </div>
            <div className="text-sm font-black text-slate-900 mb-6 uppercase tracking-tight leading-tight">{item.name}</div>
            <div className="text-[10px] text-slate-400 mb-4 font-bold uppercase tracking-widest">{item.date}</div>
            <div className="flex justify-between items-center pt-4 border-t border-slate-50">
              <span className="text-indigo-600 font-black text-xs tracking-widest">EST. PREMIUM: {item.value}</span>
              <ArrowRight className="w-4 h-4 text-slate-200" />
            </div>
          </div>
        ))}
        <button className="w-full h-14 rounded-[2rem] border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-300 hover:border-indigo-300 hover:text-indigo-300 transition-all hover:bg-white active:scale-95">
          <Plus className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}

function TaskItem({ time, title, color }: { time: string, title: string, color: string }) {
  return (
    <div className={`p-5 rounded-2xl bg-white/5 border-l-4 border-slate-800 ${color} transition-all hover:bg-white/10 cursor-pointer group`}>
      <div className="text-[10px] font-black text-indigo-400 mb-1.5 uppercase tracking-widest group-hover:translate-x-1 transition-transform">{time}</div>
      <div className="text-sm font-black text-slate-200 uppercase tracking-tight leading-tight">{title}</div>
    </div>
  );
}


