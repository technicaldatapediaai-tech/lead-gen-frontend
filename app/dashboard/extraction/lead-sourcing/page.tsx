"use client";

import React, { useState } from "react";
import { 
    Search, 
    Bell, 
    CircleHelp, 
    Plus, 
    Compass, 
    FileText, 
    UserPlus, 
    Upload, 
    Bookmark, 
    History,
    ChevronRight
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import CSVImport from "@/components/extraction/CSVImport";
import ManualLeadEntry from "@/components/extraction/ManualLeadEntry";

export default function LeadSourcingPage() {
  const [activeTab, setActiveTab] = useState("csv");

  return (
    <div className="h-full w-full overflow-y-auto bg-background text-foreground px-6 py-6 transition-colors duration-300">
      {/* Top bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-3 rounded-xl border border-input bg-card/50 px-4 py-3 shadow-sm transition-colors">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/70"
            placeholder="Search leads, lists, or campaigns..."
          />
          <span className="text-muted-foreground text-xs font-mono">⌘K</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            className="grid h-10 w-10 place-items-center rounded-xl border border-border bg-card text-muted-foreground hover:bg-accent hover:text-accent-foreground transition"
            aria-label="Notifications"
            title="Notifications"
          >
            <Bell className="h-4 w-4" />
          </button>
          <button
            className="grid h-10 w-10 place-items-center rounded-xl border border-border bg-card text-muted-foreground hover:bg-accent hover:text-accent-foreground transition"
            aria-label="Help"
            title="Help"
          >
            <CircleHelp className="h-4 w-4" />
          </button>

          <Button className="bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/10">
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Button>

          <div className="grid h-10 w-10 place-items-center rounded-full bg-blue-600/10 text-sm font-semibold text-blue-600 border border-blue-200 dark:border-blue-500/30">
            JD
          </div>
        </div>
      </div>

      <div className="py-4">
        {/* Breadcrumb */}
        <div className="text-xs text-muted-foreground/70 flex items-center gap-2">
          <Link href="/dashboard" className="hover:text-foreground">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/dashboard/extraction" className="hover:text-foreground">Lead Extraction</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-medium">Lead Sourcing</span>
        </div>
      </div>

      {/* Header */}
      <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between border-b border-border pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Lead Sourcing
          </h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-2xl">
            Find, enrich, and score high-intent leads using multi-channel intelligence. Switch between methods below to populate your pipeline.
          </p>
        </div>

        <div className="flex items-center gap-8 bg-card/50 p-4 rounded-2xl border border-border">
          <Metric label="CREDITS LEFT" value="2,450" />
          <div className="w-px h-10 bg-border" />
          <Metric
            label="LEADS FOUND"
            value="14.2k"
            valueClass="text-blue-500"
          />
        </div>
      </div>

      {/* Main Tabs System */}
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        {/* LEFT: Tab Content */}
        <div className="space-y-6">
          <Tabs defaultValue="csv" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="bg-muted/50 p-1 rounded-xl h-auto flex-wrap justify-start gap-1">
              <TabsTrigger 
                value="csv" 
                className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm py-2 px-4 gap-2"
              >
                <Upload className="h-4 w-4" />
                CSV Import
              </TabsTrigger>
              <TabsTrigger 
                value="manual" 
                className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm py-2 px-4 gap-2"
              >
                <UserPlus className="h-4 w-4" />
                Manual Entry
              </TabsTrigger>
            </TabsList>

            <div className="mt-6">
              <TabsContent value="csv">
                <CSVImport />
              </TabsContent>
              <TabsContent value="manual">
                <ManualLeadEntry />
              </TabsContent>
            </div>
          </Tabs>
        </div>

        {/* RIGHT column: Support Panels */}
        <div className="space-y-6">
          {/* Recent Lists */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold tracking-wider text-muted-foreground uppercase flex items-center gap-2">
                <Bookmark className="h-3 w-3" />
                SAVED SEARCHES
              </h3>
              <button className="text-xs font-semibold text-blue-500 hover:text-blue-400 transition">
                View All
              </button>
            </div>

            <div className="space-y-3">
              <SavedCard
                title="Q3 SaaS Founders"
                meta="2 days ago • 145 leads"
                tag="New"
              />
              <SavedCard
                title="NYC Marketing VP"
                meta="4 hours ago • 52 leads"
              />
            </div>
          </div>

          {/* Activity Feed */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold tracking-wider text-muted-foreground uppercase flex items-center gap-2">
                <History className="h-3 w-3" />
                RECENT ACTIVITY
              </h3>
            </div>

            <div className="space-y-4">
              <ActivityItem
                title={`Search: "Head of Sales"`}
                meta="2 mins ago • 340 results"
                icon={<Search className="h-3 w-4" />}
                color="text-blue-500"
              />
              <ActivityItem
                title="Import: leads_v2.csv"
                meta="1 hour ago • 1,200 rows"
                icon={<FileText className="h-3 w-4" />}
                color="text-emerald-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- UI Components ---------- */

function Metric({ label, value, valueClass = "text-foreground" }: { label: string; value: string; valueClass?: string }) {
  return (
    <div className="text-center md:text-left px-2">
      <div className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase mb-1">
        {label}
      </div>
      <div className={`text-xl font-bold ${valueClass}`}>
        {value}
      </div>
    </div>
  );
}

function SavedCard({ title, meta, tag }: { title: string; meta: string; tag?: string }) {
  return (
    <div className="rounded-xl border border-border bg-muted/20 p-3 hover:bg-muted/40 transition-colors cursor-pointer group">
      <div className="flex items-center justify-between mb-1">
        <h4 className="text-sm font-semibold text-foreground truncate group-hover:text-blue-500 transition-colors">{title}</h4>
        {tag && (
          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-blue-500 text-white">
            {tag}
          </span>
        )}
      </div>
      <p className="text-[11px] text-muted-foreground">{meta}</p>
    </div>
  );
}

function ActivityItem({ title, meta, icon, color }: { title: string; meta: string; icon: React.ReactNode; color: string }) {
  return (
    <div className="flex gap-3">
      <div className={`mt-1 h-8 w-8 rounded-lg bg-muted flex items-center justify-center shrink-0 ${color}`}>
        {icon}
      </div>
      <div className="min-w-0">
        <h4 className="text-sm font-medium text-foreground truncate">{title}</h4>
        <p className="text-[11px] text-muted-foreground">{meta}</p>
      </div>
    </div>
  );
}
