"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import {
  Rocket,
  MessageSquare,
  AlertCircle,
  Search,
  Calendar,
  CloudLightning,
  CheckCircle2,
  Mail,
  MoreVertical,
  Loader2,
  ChevronRight,
  Plus,
  Database,
  FileCheck,
  Bot
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { ProfileCompletionModal } from "@/components/dashboard/ProfileCompletionModal";
import { useDashboardStats, useDashboardActivity, useDashboardChart } from "@/lib/hooks";
import { useAuth } from "@/contexts/AuthContext";

export default function DashboardPage() {
  const { user } = useAuth();
  const { stats, isLoading: statsLoading, error: statsError } = useDashboardStats();
  const { activities, isLoading: activityLoading } = useDashboardActivity(10);
  const { chartData, isLoading: chartLoading } = useDashboardChart(7);

  // Transform stats for display

  // Transform stats for display
  const displayStats = stats ? [
    {
      title: "Lead Pipeline",
      value: stats.total_leads?.toLocaleString() || "0",
      change: `${stats.qualified_leads || 0} Qualified Leads`,
      trend: "up",
      icon: Database,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      changeColor: "text-emerald-500"
    },
    {
      title: "Engagement",
      value: stats.response_rate || "0%",
      change: `${stats.active_campaigns || 0} Active Campaigns`,
      trend: "up",
      icon: MessageSquare,
      color: "text-indigo-500",
      bgColor: "bg-indigo-500/10",
      changeColor: "text-emerald-500"
    },
    {
      title: "Pending Actions",
      value: stats.pending_tasks?.toString() || "0",
      change: "Items requiring review",
      trend: "down",
      icon: AlertCircle,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
      changeColor: "text-amber-500"
    },
  ] : [];

  // Lead quality pie chart data
  const leadQualityData = stats?.lead_stats ? [
    { name: 'Cold', value: Math.round((stats.lead_stats.by_status?.cold || 0) / (stats.total_leads || 1) * 100), color: '#0ea5e9' },
    { name: 'Warm', value: Math.round((stats.lead_stats.by_status?.warm || 0) / (stats.total_leads || 1) * 100), color: '#3b82f6' },
    { name: 'Hot', value: Math.round((stats.lead_stats.by_status?.hot || 0) / (stats.total_leads || 1) * 100), color: '#10b981' },
  ] : [
    { name: 'Cold', value: 30, color: '#0ea5e9' },
    { name: 'Warm', value: 45, color: '#3b82f6' },
    { name: 'Hot', value: 25, color: '#10b981' },
  ];

  // Outreach chart data
  const outreachData = chartData ? chartData.labels.map((label, i) => ({
    day: label,
    value: chartData.data[i] || 0
  })) : [];

  // Transform activity for display
  const recentActivity = activities.map((act, i) => ({
    id: act.id || i,
    name: act.entity_type || "Activity",
    sub: act.action || "",
    initials: act.entity_type?.substring(0, 2).toUpperCase() || "AC",
    type: "app" as const,
    appColor: "bg-blue-600",
    action: act.action || "Action performed",
    status: "Completed",
    statusColor: "blue" as const,
    date: new Date(act.created_at).toLocaleDateString()
  }));

  // Loading state
  if (statsLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-sm text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (statsError) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4 text-center">
          <AlertCircle className="h-8 w-8 text-red-500" />
          <p className="text-sm text-muted-foreground">Failed to load dashboard data.</p>
          <p className="text-xs text-muted-foreground/60">{statsError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full overflow-y-auto bg-background p-6 text-foreground font-sans transition-colors duration-300">
      <ProfileCompletionModal />
      {/* --- Header --- */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Welcome back{user?.full_name ? `, ${user.full_name.split(' ')[0]}` : ''}
          </h1>
          <p className="text-sm text-muted-foreground">Here is your pipeline health check for the last 7 days.</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              id="dashboard-search"
              name="dashboard-search"
              aria-label="Search leads"
              placeholder="Search leads..."
              className="h-10 rounded-lg border border-input bg-card/50 pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-blue-500 focus:outline-none transition-colors"
            />
          </div>
          <button className="flex items-center gap-2 rounded-lg border border-input bg-card/50 px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
            <Calendar className="h-4 w-4" />
            Last 7 Days
          </button>
        </div>
      </div>

      {/* --- Executive Stats Row (3 Boxes) --- */}
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        {displayStats.map((stat, i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-5 shadow-sm transition hover:border-blue-500/50">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{stat.title}</span>
              <div className={`rounded-full p-2 ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </div>
            <div className="mb-1 text-2xl font-bold text-card-foreground">{stat.value}</div>
            <div className={`text-xs font-medium ${stat.changeColor} flex items-center gap-1`}>
              {stat.trend === 'up' && <span className="inline-block -rotate-45">➜</span>}
              {stat.change}
            </div>
          </div>
        ))}
      </div>

      {/* --- Quick Actions Row (3 Boxes) --- */}
      <div className="mb-8">
        <h3 className="text-sm font-bold text-foreground mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
          <Link href="/dashboard/extraction" className="h-full">
            <ActionCard
              icon={<CloudLightning className="h-5 w-5 text-white" />}
              iconBg="bg-blue-600"
              title="Extraction"
              desc="Prospecting Tool"
              action="›"
              active
            />
          </Link>

          <Link href="/dashboard/scoring" className="h-full">
            <ActionCard
              icon={<CheckCircle2 className="h-5 w-5 text-emerald-500" />}
              iconBg="bg-emerald-500/10"
              title="Scoring"
              desc="Quality Audit"
              action="›"
            />
          </Link>

          <Link href="/dashboard/bulk-email" className="h-full">
            <ActionCard
              icon={<Mail className="h-5 w-5 text-blue-500" />}
              iconBg="bg-blue-500/10"
              title="Bulk Mail"
              desc="Manual/CSV Blast"
              action="›"
            />
          </Link>

          <Link href="/dashboard/campaigns/create?template=invitation" className="h-full">
            <ActionCard
              icon={<Rocket className="h-5 w-5 text-purple-500" />}
              iconBg="bg-purple-500/10"
              title="Campaign"
              desc="Outreach Setup"
              action="›"
            />
          </Link>
        </div>
      </div>

      {/* --- Main Analytics Row (3 Boxes) --- */}
      <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-12">

        {/* Row 2: Analytics, Performance, Recent Activity (3 Boxes) */}
        <div className="rounded-xl border border-border bg-card p-6 lg:col-span-4">
          <div className="mb-6 flex items-start justify-between">
            <div>
              <h3 className="text-sm font-bold text-card-foreground">Performance</h3>
              <p className="mt-1 text-xs text-muted-foreground">Lead Quality</p>
            </div>
          </div>

          <div className="flex flex-col items-center gap-4">
            <div className="relative h-32 w-32 flex-shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={leadQualityData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={55}
                    paddingAngle={0}
                    dataKey="value"
                    stroke="none"
                  >
                    {leadQualityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-lg font-bold text-card-foreground">
                  {stats?.total_leads ? (stats.total_leads >= 1000 ? `${(stats.total_leads / 1000).toFixed(1)}k` : stats.total_leads) : '0'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 w-full mt-2">
              <div className="text-center">
                <div className="h-1 w-full bg-emerald-500 rounded-full mb-1" />
                <div className="text-[10px] font-bold text-foreground">{leadQualityData[2]?.value || 0}%</div>
                <div className="text-[8px] text-muted-foreground uppercase">Hot</div>
              </div>
              <div className="text-center">
                <div className="h-1 w-full bg-blue-500 rounded-full mb-1" />
                <div className="text-[10px] font-bold text-foreground">{leadQualityData[1]?.value || 0}%</div>
                <div className="text-[8px] text-muted-foreground uppercase">Warm</div>
              </div>
              <div className="text-center">
                <div className="h-1 w-full bg-sky-500 rounded-full mb-1" />
                <div className="text-[10px] font-bold text-foreground">{leadQualityData[0]?.value || 0}%</div>
                <div className="text-[8px] text-muted-foreground uppercase">Cold</div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 lg:col-span-5">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-sm font-bold text-card-foreground">Outreach History</h3>
            <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">7D</span>
          </div>

          <div className="h-44 w-full">
            {chartLoading ? (
              <div className="h-full flex items-center justify-center">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            ) : outreachData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={outreachData} barSize={24}>
                  <XAxis
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748b', fontSize: 10 }}
                    dy={5}
                  />
                  <Tooltip
                    cursor={{ fill: 'rgba(150,150,150,0.05)' }}
                    contentStyle={{ backgroundColor: 'var(--popover)', borderColor: 'var(--border)', fontSize: '10px' }}
                  />
                  <Bar dataKey="value" fill="#3b82f6" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground text-[10px]">No Data</div>
            )}
          </div>
        </div>

        {/* Lead Activity (3rd Box in Grid) */}
        <div className="rounded-xl border border-border bg-card p-6 lg:col-span-3">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-sm font-bold text-card-foreground">Recent Activity</h3>
            <Link href="/dashboard/activity" className="text-[10px] font-bold text-blue-500 uppercase tracking-widest hover:text-blue-400">View All</Link>
          </div>
          
          <div className="flex flex-col gap-4">
            {activityLoading ? (
              <div className="py-4 flex items-center justify-center">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            ) : recentActivity.length > 0 ? (
              recentActivity.slice(0, 5).map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[10px] font-bold text-white ${item.appColor}`}>
                    {item.initials}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-card-foreground truncate">{item.name}</div>
                    <div className="text-[10px] text-muted-foreground truncate">{item.action}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-xs text-muted-foreground">No recent activity</div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}

// --- Components ---

function ActionCard({ icon, iconBg, title, desc, action, active, badge }: any) {
  return (
    <div className={`group cursor-pointer rounded-xl border p-4 transition-all ${active
      ? 'border-blue-600 bg-blue-600 border-none'
      : 'border-border bg-card hover:border-blue-500/30 hover:bg-accent'
      }`}>
      <div className="flex items-start gap-4">
        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${active ? 'bg-white/20' : iconBg}`}>
          {icon}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className={`text-sm font-bold ${active ? 'text-white' : 'text-card-foreground'}`}>{title}</h4>
            {badge && (
              <span className="rounded-full bg-blue-500 px-1.5 py-0.5 text-[8px] font-bold text-white uppercase tracking-tighter">
                {badge}
              </span>
            )}
          </div>
          <p className={`mt-1 text-xs ${active ? 'text-blue-100' : 'text-muted-foreground'}`}>{desc}</p>
        </div>
        <div className={`flex h-6 w-6 items-center justify-center rounded-full ${active ? 'bg-white/20 text-white' : 'text-muted-foreground/50'}`}>
          <span className="text-xs">›</span>
        </div>
      </div>
    </div>
  )
}

function LegendItem({ label, sub, color }: any) {
  return (
    <div className="flex items-start gap-2">
      <div className={`mt-1.5 h-2 w-2 rounded-full ${color}`} />
      <div>
        <div className="text-xs font-bold text-card-foreground">{label}</div>
        <div className="text-[10px] text-muted-foreground">{sub}</div>
      </div>
    </div>
  )
}

function StatusBadge({ status, color }: any) {
  let styles = "bg-slate-500/10 text-slate-500";
  if (color === 'emerald') styles = "bg-emerald-500/10 text-emerald-600";
  if (color === 'blue') styles = "bg-blue-500/10 text-blue-600";
  if (color === 'amber') styles = "bg-amber-500/10 text-amber-600";

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${styles}`}>
      <span className={`h-1.5 w-1.5 rounded-full bg-current`}></span>
      {status}
    </span>
  )
}
