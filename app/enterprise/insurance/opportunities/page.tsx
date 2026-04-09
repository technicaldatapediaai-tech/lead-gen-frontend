"use client";

import React from "react";
import styles from "./page.module.css";
import {
    Menu,
    LayoutList,
    ListFilter,
    Columns3,
    List,
    LayoutDashboard,
    Plus
} from "lucide-react";
import Link from "next/link";

export default function OpportunitiesPage() {
    return (
        <div className={styles.pageContainer}>
            {/* Title & Subtitle */}
            <div className={styles.headerArea}>
                <div className={styles.headerContent}>
                    <h1 className={styles.pageTitle}>Opportunities</h1>
                    <p className={styles.pageSubtitle}>Manage and track your commercial insurance pipeline.</p>
                </div>
                <div className={styles.headerActions}>
                    <Link href="/enterprise/insurance/opportunities/OPP-Apollo-Tyres-General-Liability-1024" className={styles.detailsButton}>
                        Opportunity Details
                    </Link>
                    <Link href="/enterprise/insurance/opportunities/new" className={styles.newButton}>
                        <div className={styles.newButtonIcon}>
                            <Plus size={14} strokeWidth={3} />
                        </div>
                        New
                    </Link>
                </div>
            </div>

            {/* View Toggle */}
            <div className={styles.viewToggleGroup}>
                <button className={styles.toggleBtn}>
                    <List size={16} />
                    Table
                </button>
                <button className={`${styles.toggleBtn} ${styles.activeToggle}`}>
                    <LayoutDashboard size={16} className={styles.rotate90} />
                    Kanban
                </button>
                <button className={styles.toggleBtn}>
                    <Columns3 size={16} />
                    Split
                </button>
            </div>

            {/* KPI Row */}
            <div className={styles.kpiRow}>
                <div className={styles.kpiCard}>
                    <div className={styles.kpiHeader}>TOTAL OPPORTUNITIES</div>
                    <div className={styles.kpiBody}>
                        <span className={styles.kpiValue}>1,284</span>
                        <span className={styles.kpiBadgeGreen}>+12%</span>
                    </div>
                </div>
                <div className={styles.kpiCard}>
                    <div className={styles.kpiHeader}>WON</div>
                    <div className={styles.kpiBody}>
                        <span className={styles.kpiValue}>432</span>
                        <span className={styles.kpiBadgeGreenLight}>84%</span>
                    </div>
                </div>
                <div className={styles.kpiCard}>
                    <div className={styles.kpiHeader}>LOST</div>
                    <div className={styles.kpiBody}>
                        <span className={styles.kpiValue}>128</span>
                        <span className={styles.kpiBadgeRed}>-5%</span>
                    </div>
                </div>
            </div>

            {/* Kanban Board */}
            <div className={styles.kanbanBoard}>
                {/* Column 1 */}
                <div className={styles.kanbanColumn}>
                    <div className={styles.kanbanHeader}>
                        <div className={styles.kanbanHeaderLeft}>
                            <span className={styles.columnTitle}>INITIAL REVIEW</span>
                            <span className={styles.columnCount}>4</span>
                        </div>
                        <div className={styles.dotsIcon}>•••</div>
                    </div>

                    <div className={styles.kanbanCard}>
                        <div className={styles.cardTopRow}>
                            <span className={styles.tagBlue}>COMMERCIAL PROPERTY</span>
                            <span className={styles.amountText}>$120k</span>
                        </div>
                        <h4 className={styles.cardTitle}>Tech Park Expansion</h4>
                        <p className={styles.cardCompany}>Vanguard Developments</p>
                        <div className={styles.cardFooter}>
                            <div className={styles.avatarGrey}></div>
                            <span className={styles.dateMuted}>Closing Oct 12</span>
                        </div>
                    </div>
                </div>

                {/* Column 2 */}
                <div className={styles.kanbanColumn}>
                    <div className={styles.kanbanHeader}>
                        <div className={styles.kanbanHeaderLeft}>
                            <span className={styles.columnTitle}>INFORMATION GATHERING</span>
                            <span className={styles.columnCount}>3</span>
                        </div>
                        <div className={styles.dotsIcon}>•••</div>
                    </div>

                    <div className={`${styles.kanbanCard} ${styles.kanbanCardActive}`}>
                        <div className={styles.cardTopRow}>
                            <span className={styles.tagYellow}>GENERAL LIABILITY</span>
                            <span className={styles.amountText}>$45k</span>
                        </div>
                        <h4 className={styles.cardTitle}>Global Logistics Q4</h4>
                        <p className={styles.cardCompany}>Swift Ship Inc.</p>
                        <div className={styles.cardFooter}>
                            <div className={styles.priorityHigh}>! HIGH PRIORITY</div>
                            <span className={styles.dateMuted}>Closing Sep 30</span>
                        </div>
                    </div>
                </div>

                {/* Column 3 */}
                <div className={styles.kanbanColumn}>
                    <div className={styles.kanbanHeader}>
                        <div className={styles.kanbanHeaderLeft}>
                            <span className={styles.columnTitle}>QUOTE REQUEST IN PROCESS</span>
                            <span className={styles.columnCount}>7</span>
                        </div>
                        <div className={styles.dotsIcon}>•••</div>
                    </div>

                    <div className={styles.kanbanCard}>
                        <div className={styles.cardTopRow}>
                            <span className={styles.tagPurple}>CYBER LIABILITY</span>
                            <span className={styles.amountText}>$85k</span>
                        </div>
                        <h4 className={styles.cardTitle}>Data Shield Policy</h4>
                        <p className={styles.cardCompany}>Nova Systems</p>
                        {/* empty space in footer matching image */}
                        <div className={styles.cardFooter} style={{ marginTop: '2rem' }}></div>
                    </div>
                </div>
            </div>

            {/* Recent Opportunity Data Section */}
            <div className={styles.tableSection}>
                <div className={styles.tableHeader}>
                    <h3>Recent Opportunity Data</h3>
                </div>
                <table className={styles.oppsTable}>
                    <thead>
                        <tr>
                            <th>OPPORTUNITY NAME</th>
                            <th>ACCOUNT</th>
                            <th>PRODUCT</th>
                            <th>ESTIMATED PREMIUM</th>
                            <th>CLOSING</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className={styles.tdBold}>Tech Park Expansion</td>
                            <td>Vanguard Developments</td>
                            <td>Property</td>
                            <td className={styles.tdBold}>$120,000</td>
                            <td>Oct 12, 2025</td>
                        </tr>
                        <tr>
                            <td className={styles.tdBold}>Global Logistics Q4</td>
                            <td>Swift Ship Inc.</td>
                            <td>Liability</td>
                            <td className={styles.tdBold}>$45,000</td>
                            <td>Sep 30, 2025</td>
                        </tr>
                    </tbody>
                </table>
            </div>

        </div>
    );
}
