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
  Activity,
  Bell
} from "lucide-react";

export default function InsuranceVisualPlatform() {
  return (
    <div className="bg-slate-50 font-sans text-slate-900 selection:bg-blue-500/30">
      
      {/* 2. Executive Analytics Dashboard Section */}
      <section className="py-32 bg-slate-50 border-y border-slate-200">
        <div className="mx-auto max-w-6xl px-24">
          <div className="mb-20 text-center">
            <div className="inline-block px-3 py-1 mb-6 rounded-full bg-blue-50 border border-blue-100 text-[10px] font-bold tracking-widest text-blue-600">
               LEADNIUS | EXECUTIVE INTELLIGENCE
            </div>
            <h2 className="text-4xl font-bold text-slate-900 mb-8 tracking-tight">
              Executive Analytics Dashboard
            </h2>
            <p className="text-slate-500 font-bold max-w-2xl mx-auto text-xs tracking-widest mb-10 uppercase opacity-70">
              Revenue forecasting and pipeline visibility powered by Leadnius elite commercial intelligence.
            </p>
            <p className="text-xl text-slate-600 font-medium max-w-3xl mx-auto leading-relaxed mb-16">
              Our intelligence architecture synthesizes multi-dimensional risk variables into a single, authoritative source of truth. Engineered for the discerning executive, this dashboard provides precision-calibrated foresight into your global commercial landscape.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-20 text-left">
               <div className="flex gap-4 items-start p-6 bg-white rounded-3xl border border-slate-100 shadow-sm">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex-shrink-0 flex items-center justify-center mt-1">
                     <Activity className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                     <h4 className="font-black text-slate-900 text-[10px] mb-2 uppercase tracking-widest">Velocity Metrics</h4>
                     <p className="text-[11px] text-slate-500 leading-relaxed font-medium">Tracking the biological speed of lead movement from initial contact to policy issuance via multi-node telemetry.</p>
                  </div>
               </div>
               <div className="flex gap-4 items-start p-6 bg-white rounded-3xl border border-slate-100 shadow-sm">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 flex-shrink-0 flex items-center justify-center mt-1">
                     <Shield className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                     <h4 className="font-black text-slate-900 text-[10px] mb-2 uppercase tracking-widest">Risk Stratification</h4>
                     <p className="text-[11px] text-slate-500 leading-relaxed font-medium">Automatic categorization of leads based on historical loss ratios and entity verification status for surgical precision.</p>
                  </div>
               </div>
               <div className="flex gap-4 items-start p-6 bg-white rounded-3xl border border-slate-100 shadow-sm">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 flex-shrink-0 flex items-center justify-center mt-1">
                     <Users className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                     <h4 className="font-black text-slate-900 text-[10px] mb-2 uppercase tracking-widest">Projected Yield</h4>
                     <p className="text-[11px] text-slate-500 leading-relaxed font-medium">AI-driven estimates of GWP based on current pipeline health and high-fidelity historical conversion patterns.</p>
                  </div>
               </div>
            </div>

            <div className="w-16 h-1 bg-blue-600 mx-auto rounded-full mb-6 opacity-20" />
            <p className="text-[11px] font-bold text-slate-400 tracking-wider uppercase">
              Architecture of Authority • Strategic Vision 2024
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <KPICard title="Total Leads" value="1,284" change="+18.2% vs avg" />
            <KPICard title="Open Opportunities" value="442" change="+12.4% vs LY" />
            <KPICard title="Conversion Rate" value="28.5%" change="+2.1% spike" />
            <KPICard title="Revenue Pipeline" value="$4.2M" change="+15% Projected" isGood={true} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Leads by Stage - Horizontal Bar Chart Mock */}
            <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm relative overflow-hidden group transition-all hover:shadow-xl">
              <div className="flex justify-between items-center mb-8">
                <h3 className="font-extrabold text-slate-900 text-xs tracking-widest">Leads by Stage</h3>
                <div className="text-[10px] font-bold text-blue-600">Live distribution</div>
              </div>
              <div className="space-y-4">
                <LeadStageBar label="New" count={442} percentage={100} color="bg-blue-600" />
                <LeadStageBar label="In Process" count={284} percentage={65} color="bg-blue-600" />
                <LeadStageBar label="Assigned" count={156} percentage={35} color="bg-slate-400" />
                <LeadStageBar label="Converted" count={92} percentage={20} color="bg-emerald-500" />
              </div>
            </div>

            {/* Leads by Type - Donut Chart Mock (Simplified Visual) */}
            <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm relative overflow-hidden group transition-all hover:shadow-xl">
              <div className="flex justify-between items-center mb-8">
                <h3 className="font-extrabold text-slate-900 text-xs tracking-widest">Leads by Type</h3>
                <div className="text-[10px] font-bold text-blue-600">Source insights</div>
              </div>
              <div className="flex items-center gap-12 h-48">
                 <div className="relative w-40 h-40">
                    <div className="absolute inset-0 rounded-full border-[16px] border-slate-100" />
                    <div className="absolute inset-0 rounded-full border-[16px] border-blue-600 border-t-transparent border-r-transparent rotate-[30deg]" />
                    <div className="absolute inset-0 rounded-full border-[16px] border-blue-500 border-l-transparent border-b-transparent -rotate-[15deg]" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                       <div className="text-xl font-black text-slate-900">84%</div>
                       <div className="text-[8px] font-bold text-slate-400 tracking-widest leading-none mt-1">Direct</div>
                    </div>
                 </div>
                 <div className="space-y-4">
                    <DonutLegend label="Fresh Leads" color="bg-blue-600" value="45%" />
                    <DonutLegend label="Renewal" color="bg-blue-500" value="32%" />
                    <DonutLegend label="Broker Net" color="bg-slate-300" value="23%" />
                 </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-12 rounded-[3.5rem] border border-slate-200 shadow-2xl shadow-blue-900/5 relative overflow-hidden group/chart bg-linear-to-br from-white to-slate-50/50">
            {/* Background Grid */}
            <div className="absolute inset-x-12 top-40 bottom-24 flex flex-col justify-between pointer-events-none opacity-[0.03]">
               {[...Array(6)].map((_, i) => (
                  <div key={i} className="w-full h-px bg-slate-900" />
               ))}
            </div>

            <div className="flex justify-between items-center mb-16 relative z-10">
              <h3 className="font-bold text-slate-800 text-sm tracking-tight">Lead Creation Trend vs Pipeline Funnel</h3>
              <div className="flex items-center gap-6 text-[11px] font-semibold text-slate-400">
                <span className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-200" /> 
                  Creation Trend
                </span>
                <span className="flex items-center gap-2 text-blue-600">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-600" /> 
                  Opportunity Funnel
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-5 gap-6 h-72 items-end relative z-10 px-4">
               {/* Axis Labels */}
               <div className="absolute -left-8 top-0 bottom-0 flex flex-col justify-between text-[9px] font-semibold text-slate-400 pointer-events-none">
                  <span>100k</span>
                  <span>75k</span>
                  <span>50k</span>
                  <span>25k</span>
                  <span>0k</span>
               </div>

               {[40, 65, 55, 85, 95].map((h, i) => (
                 <div key={i} className="relative group/bar flex flex-col items-center gap-6 h-full justify-end">
                    <div className="w-full bg-slate-50 rounded-t-[1.5rem] transition-all duration-500 overflow-hidden relative shadow-sm" style={{ height: `${h}%` }}>
                       <div className="absolute inset-0 bg-linear-to-t from-blue-600/10 via-blue-600/40 to-blue-600 opacity-60 group-hover/bar:opacity-90 transition-all duration-500" />
                       
                       {/* Glass Tooltip */}
                       <div className="absolute top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover/bar:opacity-100 transition-all duration-500 -translate-y-2 group-hover/bar:translate-y-0 scale-90 group-hover/bar:scale-100 z-50">
                          <div className="bg-slate-900/95 backdrop-blur-md text-white text-[10px] font-black px-4 py-2 rounded-xl shadow-2xl border border-white/10 whitespace-nowrap">
                             ${(h * 42).toFixed(0)}k <span className="text-blue-400 ml-1">USD</span>
                          </div>
                          <div className="w-2 h-2 bg-slate-900 rotate-45 mx-auto -mt-1 border-r border-b border-white/10" />
                       </div>
                    </div>
                    <div className="text-[11px] font-bold text-slate-400 group-hover/bar:text-blue-600 transition-colors">Q{i+1} 24</div>
                 </div>
               ))}
               
               {/* Insight Text */}
               <div className="absolute top-6 right-2 z-20 pointer-events-none">
                  <div className="text-[11px] font-bold text-blue-600 bg-white/40 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-white/60 leading-tight">
                     Conversion Velocity <br />
                     <span className="text-[10px] text-slate-500 font-semibold">Trending at +15.4% YoY</span>
                  </div>
               </div>

               {/* Enhanced Funnel Overlay */}
               <div className="absolute inset-x-0 bottom-[108px] h-[300px] pointer-events-none opacity-[0.04]">
                  <div className="w-full h-full bg-linear-to-t from-blue-600 to-transparent mask-funnel" style={{ clipPath: 'polygon(0 80%, 25% 60%, 50% 70%, 75% 40%, 100% 30%, 100% 100%, 0 100%)' }} />
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Lead Intelligence & Management Section */}
      <section className="py-32 bg-white">
        <div className="mx-auto max-w-6xl px-24 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div>
            <div className="inline-block px-3 py-1 mb-6 rounded-full bg-blue-50 border border-blue-100 text-[10px] font-bold tracking-widest text-blue-600">
              Module 01: CRM Excellence
            </div>
            <h2 className="text-4xl font-extrabold text-slate-900 mb-8 leading-tight tracking-tightest">
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
               <button className="h-12 px-8 rounded-xl bg-blue-600 text-white font-bold text-xs tracking-widest shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Bulk Import
               </button>
               <button className="h-12 px-8 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs tracking-widest hover:bg-slate-50 transition-all">
                  Manage Settings
               </button>
            </div>
          </div>
          <div className="bg-slate-50 p-10 rounded-[3rem] border border-slate-200 shadow-xl overflow-hidden group bg-linear-to-br from-blue-50/30 to-white">
            <div className="flex justify-between items-center mb-8">
              <h3 className="font-extrabold text-slate-900 text-xs tracking-widest">Smart Table: Lead Queue</h3>
              <div className="flex items-center gap-2">
                 <Search className="w-4 h-4 text-slate-400" />
                 <div className="text-[10px] font-bold text-slate-400">Filters active</div>
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
            <h2 className="text-4xl font-extrabold text-slate-900 mb-8 tracking-tightest">
              Visual Opportunity Pipeline
            </h2>
            <p className="text-slate-500 font-bold max-w-2xl mx-auto text-xs tracking-widest mb-10 uppercase opacity-70">
              Move leads from &apos;Initial Review&apos; to &apos;Quote Request&apos; using a visual Kanban architecture.
            </p>
            <p className="text-xl text-slate-600 font-medium max-w-3xl mx-auto leading-relaxed mb-10">
              Navigate the complex path to conversion with surgical precision. Our pipeline architecture provides a high-fidelity overview of your commercial deal flow, enabling dynamic resource allocation and authoritative decision-making at every stage of the insurance lifecycle.
            </p>
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="h-px w-12 bg-slate-200" />
              <span className="text-[9px] font-black text-blue-600 tracking-[0.4em] uppercase">Pipeline Integrity Architecture</span>
              <div className="h-px w-12 bg-slate-200" />
            </div>
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
            <div className="bg-white rounded-[3rem] p-10 border border-slate-200 relative overflow-hidden group shadow-2xl">
              <div className="absolute top-0 right-0 p-12 bg-blue-600/10 blur-[100px] rounded-full" />
              
              <div className="flex justify-between items-start mb-10 relative">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 rounded-2xl bg-slate-900 flex items-center justify-center text-white text-2xl font-black shadow-lg">AT</div>
                  <div>
                    <h3 className="text-2xl font-black tracking-tight text-slate-900">Apollo Tyres Ltd</h3>
                    <div className="text-[10px] font-bold text-blue-600 tracking-widest">Industrial • Fortune 500</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-bold text-slate-400 tracking-widest">Market Cap</div>
                  <div className="text-xl font-black text-emerald-400">$3.84B</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-10 relative">
                <FirmographicItem label="CIN" value="L25111DL1972PLC006049" />
                <FirmographicItem label="GST Number" value="07AAA CA1234 A1Z5" />
                <FirmographicItem label="PAN Number" value="AAA CA1234 A" />
                <FirmographicItem label="Annual Revenue" value="$2.4B (FY23)" />
              </div>

              <div className="border-t border-slate-100 pt-8 relative">
                <div className="text-[10px] font-bold text-slate-400 tracking-widest mb-4">News Alerts</div>
                <div className="space-y-4">
                  <NewsItem text="Apollo Tyres reports 20% growth in EV segment" date="2h ago" />
                  <NewsItem text="Strategic expansion into European markets confirmed" date="Yesterday" />
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-4xl font-extrabold text-slate-900 mb-8 leading-tight tracking-tightest uppercase text-xs opacity-40">Module 03: Entity Intelligence</h2>
              <h2 className="text-4xl font-extrabold text-slate-900 mb-8 leading-tight tracking-tightest">360-Degree <br /> Account Insights</h2>
              <p className="text-lg text-slate-500 font-medium leading-relaxed mb-10 max-w-md">
                Architecting enterprise transparency through deep-node intelligence. From legal CIN/GST verification to real-time financial news telemetry, we provide the definitive commercial identity for every account in your ecosystem.
              </p>
              
              <div className="space-y-6 mb-10">
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
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

              <div className="flex items-center gap-4 text-blue-600 font-black text-xs tracking-widest cursor-pointer group">
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
            <div className="text-[10px] font-bold text-slate-400 tracking-widest mb-6">Module 04</div>
            <h2 className="text-4xl font-extrabold text-slate-900 mb-8 leading-tight tracking-tightest">Precision Scheduling</h2>
            <p className="text-xl text-slate-500 leading-relaxed font-medium max-w-md">
              Never miss a renewal or a strategic review meeting with our hyper-focused task management system.
            </p>
          </div>
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-8 h-fit">
            <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-12 bg-blue-600/5 blur-3xl rounded-full group-hover:bg-blue-600/10 transition-colors" />
              <div className="flex items-center gap-3 mb-10 relative">
                <Calendar className="w-5 h-5 text-blue-600" />
                <span className="text-xs font-bold tracking-widest text-slate-400">Upcomings Next 7 Days</span>
              </div>
              <div className="space-y-4 relative">
                <TaskItem time="12:00" title="Renewal Review: Atlantic Tech" color="border-l-4 border-blue-600" theme="light" />
                <TaskItem time="14:30" title="Claims Audit - UK Global" color="border-l-4 border-slate-900" theme="light" />
              </div>
            </div>
            <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm transition-all hover:shadow-xl">
              <h3 className="font-black text-slate-900 text-[10px] tracking-[0.2em] mb-8 text-center opacity-40">Quarterly Renewal Blueprint</h3>
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
            <div className="text-[10px] font-bold text-blue-600 tracking-widest mb-8 underline decoration-blue-600 decoration-2 underline-offset-8">Module 05: Service Center</div>
            <h2 className="text-4xl font-extrabold mb-8 leading-tight tracking-tightest">Client Support & <br />Case Management</h2>
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
          <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-2xl overflow-hidden relative group/tickets">
            <div className="flex justify-between items-center mb-10 pb-8 border-b border-slate-50">
              <div className="text-xs font-black text-slate-900 tracking-widest">Active Tickets</div>
              <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse transition-all shadow-[0_0_12px_rgba(16,185,129,0.4)]" />
                 <span className="text-[10px] font-bold text-slate-400 tracking-widest">Live sync</span>
              </div>
            </div>
            
            <div className="space-y-4">
               <TicketItem 
                 id="TK-4821" 
                 subject="Policy renewal inquiry" 
                 type="Sales" 
                 priority="High" 
                 status="Processing" 
                 theme="light"
               />
               <TicketItem 
                 id="TK-4822" 
                 subject="Claim status update" 
                 type="Claims" 
                 priority="Medium" 
                 status="In Review" 
                 theme="light"
               />
               <TicketItem 
                 id="TK-4823" 
                 subject="Billing discrepancy" 
                 type="Billing" 
                 priority="Low" 
                 status="Pending" 
                 theme="light"
               />
            </div>
          </div>
        </div>
      </section>

      {/* 7. CTA Section */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-6xl px-24">
          <div className="relative overflow-hidden bg-blue-600 rounded-[4rem] py-20 px-12 text-center group">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            
            <div className="max-w-2xl mx-auto relative z-10">
              <h2 className="text-3xl font-bold text-white mb-6 leading-tight tracking-tightest">
                Ready to Build the Future <br /> of Your Elite Portal?
              </h2>
              <p className="text-base text-blue-100 mb-10 font-medium opacity-90">
                Join the world&apos;s leading insurance firms in creating a more structural, intelligent, and authoritative workspace.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button className="h-12 px-10 rounded-2xl bg-white text-blue-600 font-black text-xs transition-all hover:scale-105 shadow-2xl hover:shadow-white/20 tracking-widest leading-none">
                  Request a Demo
                </button>
                <button className="h-12 px-10 rounded-2xl bg-blue-700 text-white font-black text-xs border border-blue-400/50 transition-all hover:bg-blue-800 hover:border-white/20 tracking-widest leading-none">
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
      <div className="text-[10px] font-bold text-slate-400 tracking-widest mb-6 border-b border-slate-50 pb-2 group-hover:text-blue-600 transition-colors tracking-[0.2em] leading-none">{title}</div>
      <div className="text-4xl font-black text-slate-900 mb-3 tracking-tighter">{value}</div>
      <div className={`text-[10px] font-black tracking-tighter px-3 py-1 rounded-full inline-block ${isGood ? 'bg-blue-50 text-blue-600 shadow-sm' : 'bg-blue-50 text-blue-600 shadow-sm'}`}>{change}</div>
    </div>
  );
}

function LeadStageBar({ label, count, percentage, color }: { label: string, count: number, percentage: number, color: string }) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-[10px] font-bold text-slate-400 tracking-widest">
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
        <span className="text-[10px] font-bold text-slate-400 tracking-widest group-hover:text-slate-900 transition-colors">{label}</span>
      </div>
      <span className="text-xs font-black text-slate-900">{value}</span>
    </div>
  );
}

function ActivityFilter({ label, count, active, color }: { label: string, count: number, active: boolean, color: string }) {
  return (
    <button className={`flex items-center gap-3 px-5 py-2.5 rounded-full border transition-all ${active ? 'bg-blue-50 border-blue-200 shadow-sm' : 'bg-white border-slate-100 hover:border-slate-300'}`}>
      <div className={`w-1.5 h-1.5 rounded-full ${color} ${active ? 'animate-pulse' : ''}`} />
      <span className={`text-[10px] font-bold tracking-widest ${active ? 'text-blue-600' : 'text-slate-400'}`}>{label}</span>
      <span className={`text-[10px] font-black ${active ? 'text-blue-600' : 'text-slate-900'}`}>{count}</span>
    </button>
  );
}

function FirmographicItem({ label, value, theme = 'dark' }: { label: string, value: string, theme?: 'light' | 'dark' }) {
  return (
    <div>
       <div className="text-[9px] font-bold text-slate-500 tracking-[0.2em] mb-1.5">{label}</div>
       <div className={`text-xs font-black ${theme === 'light' ? 'text-slate-900' : 'text-white'} hover:text-blue-400 transition-colors cursor-default`}>{value}</div>
    </div>
  );
}

function NewsItem({ text, date, theme = 'dark' }: { text: string, date: string, theme?: 'light' | 'dark' }) {
  return (
    <div className="flex items-start gap-3 group cursor-pointer transition-all hover:translate-x-1">
       <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 group-hover:scale-125 transition-transform" />
       <div>
          <div className={`text-[11px] font-bold ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'} leading-tight mb-1 ${theme === 'light' ? 'group-hover:text-blue-600' : 'group-hover:text-white'}`}>{text}</div>
          <div className="text-[9px] font-bold text-slate-400 tracking-widest">{date}</div>
       </div>
    </div>
  );
}

function SupportTag({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 group transition-all hover:bg-white hover:shadow-xl hover:-translate-y-1">
       <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
          <FileText className="w-4 h-4" />
       </div>
       <span className="text-xs font-black text-slate-900 tracking-tight">{label}</span>
    </div>
  );
}

function TicketItem({ id, subject, type, priority, status, theme = 'dark' }: { id: string, subject: string, type: string, priority: string, status: string, theme?: 'light' | 'dark' }) {
  const priorityColor = priority === 'High' ? 'text-red-500 bg-red-50 border-red-200' : priority === 'Medium' ? 'text-amber-600 bg-amber-50 border-amber-200' : 'text-blue-600 bg-blue-50 border-blue-200';
  
  return (
    <div className={`p-5 rounded-2xl ${theme === 'light' ? 'bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-xl' : 'bg-white/5 border border-slate-100/10 hover:bg-white/10'} flex items-center justify-between group cursor-pointer transition-all`}>
       <div className="flex items-center gap-5">
          <div className="text-[10px] font-black text-slate-400 mono">{id}</div>
          <div>
             <div className={`text-sm font-black ${theme === 'light' ? 'text-slate-900' : 'text-white'} leading-none mb-1.5`}>{subject}</div>
             <div className="flex items-center gap-3">
                <span className="text-[9px] font-bold text-slate-400 tracking-widest">{type}</span>
                <span className={`text-[8px] px-2 py-0.5 rounded-full border font-black tracking-widest ${theme === 'light' ? priorityColor : priorityColor.replace(/bg-\w+-50/, 'bg-white/5').replace(/border-\w+-200/, 'border-white/10')}`}>{priority}</span>
             </div>
          </div>
       </div>
       <div className="text-[9px] font-black text-blue-600 tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">{status}</div>
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
          <div className="text-sm font-bold text-slate-900 leading-none mb-1 tracking-tight">{name}</div>
          <div className="text-[10px] text-slate-500 font-medium tracking-normal leading-none">{company}</div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <span className={`text-[10px] items-center px-3 font-bold py-1 border rounded-full ${score === 'High' ? 'bg-blue-50 border-blue-100 text-blue-600' : score === 'New' ? 'bg-blue-50 border-blue-100 text-blue-600' : 'bg-slate-50 border-slate-100 text-slate-600'}`}>
          {score}
        </span>
        <span className={`text-[10px] font-medium tracking-normal ${status === 'Overdue' ? 'text-red-500' : 'text-slate-400'}`}>{status}</span>
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
      <div className="flex justify-between items-center mb-8 pb-4 border-b border-slate-100">
        <h3 className="font-bold text-slate-800 text-xs tracking-wider uppercase">{title}</h3>
        <span className="text-[10px] font-bold px-2 py-1 flex items-center justify-center bg-blue-600 text-white rounded-md shadow-sm">{count}</span>
      </div>
      <div className="space-y-4">
        {items.map((item, i) => (
          <div key={i} className={`p-6 rounded-[2rem] bg-white border border-slate-200 shadow-sm text-left hover:shadow-2xl transition-all hover:scale-102 cursor-pointer ${item.isFeatured ? 'ring-4 ring-blue-500/10 border-blue-500/30' : ''}`}>
            <div className="flex justify-between items-start mb-3">
               <div className="text-[9px] font-bold text-slate-400 tracking-widest flex items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                 {item.priority || 'Standard'} Priority
               </div>
               <span className="text-[8px] font-black text-blue-600 tracking-widest border border-blue-100 px-2 py-0.5 rounded-full">New deal</span>
            </div>
            <div className="text-sm font-black text-slate-900 mb-6 tracking-tight leading-tight">{item.name}</div>
            <div className="text-[10px] text-slate-400 mb-4 font-bold tracking-widest">{item.date}</div>
            <div className="flex justify-between items-center pt-4 border-t border-slate-50">
              <span className="text-blue-600 font-black text-xs tracking-widest">Est. Premium: {item.value}</span>
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

function TaskItem({ time, title, color, theme = 'dark' }: { time: string, title: string, color: string, theme?: 'light' | 'dark' }) {
  return (
    <div className={`p-5 rounded-2xl ${theme === 'light' ? 'bg-slate-50 border border-slate-100' : 'bg-white/5 border-l-4 border-slate-800'} ${color} transition-all hover:bg-white hover:shadow-xl cursor-pointer group`}>
      <div className="text-[10px] font-black text-blue-600 mb-1.5 tracking-widest group-hover:translate-x-1 transition-transform">{time}</div>
      <div className={`text-sm font-black ${theme === 'light' ? 'text-slate-900' : 'text-slate-200'} tracking-tight leading-tight`}>{title}</div>
    </div>
  );
}
