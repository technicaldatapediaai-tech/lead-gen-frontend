import React from "react";
import {
  Users,
  ClipboardCheck,
  ArrowLeftRight,
  DollarSign,
  Calendar,
  ChevronDown
} from "lucide-react";

import StatCard from "@/components/insurance-dashboard/StatCard";
import LeadsByStage from "@/components/insurance-dashboard/LeadsByStage";
import LeadsByType from "@/components/insurance-dashboard/LeadsByType";
import OpportunityPipeline from "@/components/insurance-dashboard/OpportunityPipeline";
import LeadTrend from "@/components/insurance-dashboard/LeadTrend";

export default function DashboardPage() {
  return (
    <div className="dashboard-grid">
      <div className="widget-full-half" style={{ marginBottom: "1rem" }}>
        <h1 style={{ fontSize: "1.75rem", marginBottom: "0.25rem", color: "var(--text-primary)" }}>
          Executive Dashboard
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
          Welcome back, Alex. Here's what changed since yesterday.
        </p>
      </div>

      <div style={{ gridColumn: "span 6", display: "flex", justifyContent: "flex-end", alignItems: "flex-start", marginBottom: "1rem" }}>
        <button
          className="card"
          style={{ padding: "0.6rem 1.25rem", display: "flex", alignItems: "center", gap: "0.5rem", borderRadius: "100px", border: "1px solid var(--border-color)", cursor: "pointer", fontWeight: "600", color: "var(--text-primary)" }}
        >
          <Calendar size={18} />
          Last Month
          <ChevronDown size={18} />
        </button>
      </div>

      <div className="widget-stats">
        <StatCard
          title="Total Leads"
          value="328"
          trend="+12%"
          trendType="up"
          icon={<Users size={24} />}
          iconBgColor="#eff6ff"
        />
      </div>

      <div className="widget-stats">
        <StatCard
          title="Open Leads"
          value="94"
          icon={<ClipboardCheck size={24} />}
          iconBgColor="#eff6ff"
        />
      </div>

      <div className="widget-stats">
        <StatCard
          title="Conversion Rate"
          value="28%"
          trend="-2%"
          trendType="down"
          icon={<ArrowLeftRight size={24} style={{ color: "#f59e0b" }} />}
          iconBgColor="#fffbeb"
        />
      </div>

      <div className="widget-stats">
        <StatCard
          title="Revenue Pipeline"
          value="$4.2M"
          icon={<DollarSign size={24} style={{ color: "#10b981" }} />}
          iconBgColor="#ecfdf5"
        />
      </div>

      <div className="widget-full-half">
        <LeadsByStage />
      </div>
      <div className="widget-full-half">
        <LeadsByType />
      </div>

      <div className="widget-full-half">
        <OpportunityPipeline />
      </div>
      <div className="widget-full-half" style={{ height: "400px" }}>
        <LeadTrend />
      </div>
    </div>
  );
}
