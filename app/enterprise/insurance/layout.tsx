"use client";

import React from "react";
import Sidebar from "@/components/insurance-dashboard/Sidebar";
import Header from "@/components/insurance-dashboard/Header";
import "./dashboard.css";

export default function InsuranceDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="insurance-dashboard-theme">
      <div className="layout-container" style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
        <Sidebar />
        <div className="main-content" style={{ flex: 1, display: "flex", flexDirection: "column", overflowY: "auto", overflowX: "hidden" }}>
          <Header />
          <main>
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
