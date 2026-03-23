"use client";

import React from "react";
import { 
  History, 
  Search, 
  Filter, 
  ArrowUpDown, 
  ChevronLeft, 
  ChevronRight,
  Loader2,
  Clock,
  User as UserIcon,
  Shield,
  Activity,
  Zap,
  Mail,
  Linkedin,
  Database
} from "lucide-react";
import { useDashboardActivity } from "@/lib/hooks";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

export default function ActivityPage() {
  const { user } = useAuth();
  const { activities, isLoading, error } = useDashboardActivity(50);

  const getActionIcon = (action: string) => {
    const a = action.toLowerCase();
    if (a.includes('login') || a.includes('auth')) return <Shield className="h-4 w-4 text-emerald-500" />;
    if (a.includes('campaign')) return <Zap className="h-4 w-4 text-purple-500" />;
    if (a.includes('lead') || a.includes('extract')) return <Database className="h-4 w-4 text-blue-500" />;
    if (a.includes('email')) return <Mail className="h-4 w-4 text-indigo-500" />;
    if (a.includes('linkedin')) return <Linkedin className="h-4 w-4 text-blue-600" />;
    return <Activity className="h-4 w-4 text-slate-400" />;
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(d);
  };

  return (
    <div className="h-full w-full bg-background p-6 font-sans">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1 text-muted-foreground">
            <Link href="/dashboard" className="hover:text-foreground flex items-center gap-1 transition-colors">
              <ChevronLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>
          </div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <History className="h-6 w-6 text-blue-500" />
            Audit Logs & Activity
          </h1>
          <p className="text-sm text-muted-foreground">Monitor system events and user actions across your organization.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Stats Summary Area could go here */}

        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
          <div className="border-b border-border bg-card/50 p-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-foreground">Activity History</span>
              <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] font-bold text-blue-600 uppercase">
                Real-time
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search actions..."
                  className="h-9 w-48 lg:w-64 rounded-lg border border-input bg-background/50 pl-9 pr-4 text-xs text-foreground outline-none focus:border-blue-500 transition-colors"
                />
              </div>
              <button className="flex items-center gap-2 rounded-lg border border-input bg-background/50 px-3 py-2 text-xs font-medium text-foreground hover:bg-accent transition-colors">
                <Filter className="h-3.5 w-3.5" />
                Filter
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/20 text-[10px] uppercase font-bold text-muted-foreground">
                  <th className="px-6 py-4">Action</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Entity</th>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      Time <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="py-12">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                        <span className="text-xs text-muted-foreground">Fetching activity logs...</span>
                      </div>
                    </td>
                  </tr>
                ) : activities.length > 0 ? (
                  activities.map((act) => (
                    <tr key={act.id} className="group hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-background border border-border group-hover:bg-white/5 transition-colors">
                            {getActionIcon(act.action)}
                          </div>
                          <div>
                            <div className="font-semibold text-foreground text-xs">{act.action}</div>
                            <div className="text-[10px] text-muted-foreground">{act.description || "System log entry"}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 uppercase">
                          <div className="h-1 w-1 rounded-full bg-emerald-500" />
                          Success
                        </span>
                      </td>
                      <td className="px-6 py-4 capitalize text-xs font-medium text-muted-foreground">
                        {act.entity_type}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                           <div className="h-6 w-6 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
                              <UserIcon className="h-3 w-3 text-blue-500" />
                           </div>
                           <span className="text-xs text-foreground font-medium">
                              {act.actor_id === user?.id ? "Me" : "System Admin"}
                           </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs text-muted-foreground font-mono">
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-3 w-3" />
                          {formatDate(act.created_at)}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-xs text-muted-foreground">
                      No activity logs found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="border-t border-border p-4 bg-card/30 flex items-center justify-between">
            <span className="text-[10px] font-semibold text-muted-foreground">Showing {activities.length} recent events</span>
            <div className="flex gap-2">
              <button className="h-8 w-8 rounded border border-border flex items-center justify-center disabled:opacity-30 hover:bg-accent transition-colors" disabled>
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button className="h-8 w-8 rounded border border-border flex items-center justify-center disabled:opacity-30 hover:bg-accent transition-colors" disabled>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
