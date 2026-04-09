"use client";

import React from "react";
import styles from "./page.module.css";
import {
    ChevronDown,
    Menu,
    LayoutList,
    ListFilter,
    BarChart2,
    Plus,
    User
} from "lucide-react";
import Link from "next/link";

import KPICard from "@/components/insurance-dashboard/KPICard";
import LeadsTable from "@/components/insurance-dashboard/LeadsTable";

export default function LeadsPage() {
    return (
        <div className={styles.pageContainer}>
            <div className={styles.topActionsRow}>
                <div className={styles.breadcrumb}>
                    <span className={styles.breadcrumbMuted}>Pages</span>
                    <span className={styles.breadcrumbSeparator}>/</span>
                    <span className={styles.breadcrumbCurrent}>Leads</span>
                </div>

                <div className={styles.actionButtons}>
                    <div className={styles.viewToggleGroup}>
                        <button className={`${styles.iconButton} ${styles.activeView}`}>
                            <Menu size={18} />
                        </button>
                        <button className={styles.iconButton}>
                            <BarChart2 size={18} className={styles.rotate90} />
                        </button>
                        <button className={styles.iconButton}>
                            <LayoutList size={18} />
                        </button>
                    </div>

                    <button className={styles.filterButton}>
                        <BarChart2 size={16} className={styles.rotate90} />
                        Charts
                    </button>

                    <button className={styles.filterButton}>
                        <ListFilter size={16} />
                        Filter
                    </button>

                    <Link href="/enterprise/insurance/leads/bulk-import" className={styles.bulkImportButton}>
                        Bulk Import
                    </Link>

                    <Link href="/enterprise/insurance/leads/new" className={styles.newButton}>
                        <Plus size={18} />
                        New
                    </Link>
                </div>
            </div>

            <div className={styles.controlsRow}>
                <button className={styles.dropdownBtn}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    Last Month
                    <ChevronDown size={16} />
                </button>

                <button className={styles.dropdownBtn}>
                    <User size={16} style={{ color: "var(--text-secondary)" }} />
                    <span className={styles.dropdownLabel}>Owner:</span>
                    <span className={styles.dropdownValue}>Amit Pasrija</span>
                    <ChevronDown size={16} />
                </button>
            </div>

            <div className={styles.kpiRow}>
                <KPICard
                    title="TOTAL LEADS"
                    value="328"
                    isActive={true}
                />
                <KPICard
                    title="NO ACTIVITIES"
                    value="42"
                />
                <KPICard
                    title="IDLE"
                    value="15"
                />
                <KPICard
                    title="NO UPCOMINGS"
                    value="28"
                />
                <KPICard
                    title="OVERDUE"
                    value="12"
                    valueColor="var(--danger)"
                />
                <KPICard
                    title="DUE TODAY"
                    value="5"
                    valueColor="var(--warning)"
                />
                <KPICard
                    title="UPCOMING"
                    value="126"
                />
            </div>

            <div className={styles.tableSection}>
                <LeadsTable />
            </div>
        </div>
    );
}
