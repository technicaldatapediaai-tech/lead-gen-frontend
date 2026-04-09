"use client";

import React from "react";
import styles from "./page.module.css";
import {
    Plus,
    Filter,
    Download,
    MoreVertical,
    ChevronLeft,
    ChevronRight
} from "lucide-react";
import Link from "next/link";

export default function SupportPage() {
    const cases = [
        {
            id: "CAS-1029",
            subjectTitle: "Policy renewal inquiry",
            subjectDetail: "Acme Corp Global Account",
            priority: "High",
            type: "Billing",
            status: "Open",
            created: "Oct 24, 2023",
            updated: "2 hours ago"
        },
        {
            id: "CAS-1028",
            subjectTitle: "Login credentials reset",
            subjectDetail: "Johnathan Smith",
            priority: "Medium",
            type: "Access",
            status: "Resolved",
            created: "Oct 23, 2023",
            updated: "1 day ago"
        },
        {
            id: "CAS-1027",
            subjectTitle: "Claim status update",
            subjectDetail: "Pacific Logistics Ltd.",
            priority: "High",
            type: "Claims",
            status: "In Progress",
            created: "Oct 23, 2023",
            updated: "3 hours ago"
        },
        {
            id: "CAS-1026",
            subjectTitle: "Document upload error",
            subjectDetail: "Direct Client",
            priority: "Low",
            type: "Technical",
            status: "Open",
            created: "Oct 22, 2023",
            updated: "2 days ago"
        },
        {
            id: "CAS-1025",
            subjectTitle: "New coverage quote",
            subjectDetail: "Standard Manufacturing",
            priority: "Medium",
            type: "Sales",
            status: "Closed",
            created: "Oct 21, 2023",
            updated: "4 days ago"
        }
    ];

    return (
        <div className={styles.pageContainer}>
            {/* Header */}
            <div className={styles.headerArea}>
                <div className={styles.headerLeft}>
                    <h1 className={styles.pageTitle}>Support Cases</h1>
                    <p className={styles.pageSubtitle}>Manage and track customer support inquiries and technical issues.</p>
                </div>
                <div className={styles.headerActions}>
                    <Link href="/enterprise/insurance/support/cases/CAS-1024" className={styles.detailsButton}>
                        Case Details
                    </Link>
                    <Link href="/enterprise/insurance/support/cases/new" className={styles.btnPrimary}>
                        <Plus size={16} />
                        Create Case
                    </Link>
                </div>
            </div>

            {/* Controls */}
            <div className={styles.controlsRow}>
                <div className={styles.tabsMenu}>
                    <button className={`${styles.tabBtn} ${styles.activeTab}`}>All Cases</button>
                    <button className={styles.tabBtn}>Open Cases</button>
                    <button className={styles.tabBtn}>Closed Cases</button>
                </div>

                <div className={styles.actionButtons}>
                    <button className={styles.btnOutline}>
                        <Filter size={16} />
                        Filter
                    </button>
                    <button className={styles.btnOutline}>
                        <Download size={16} />
                        Export
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className={styles.tableCard}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>CASE NUMBER</th>
                            <th>SUBJECT</th>
                            <th>PRIORITY</th>
                            <th>REQUEST TYPE</th>
                            <th>STATUS</th>
                            <th>CREATED DATE</th>
                            <th>LAST UPDATED</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {cases.map((c, i) => (
                            <tr key={i}>
                                <td className={styles.tdId}>{c.id}</td>
                                <td>
                                    <div className={styles.subjectBlock}>
                                        <p className={styles.subjectTitle}>{c.subjectTitle}</p>
                                        <p className={styles.subjectDetail}>{c.subjectDetail}</p>
                                    </div>
                                </td>
                                <td>
                                    <span className={`${styles.badgePriority} ${styles[`priority${c.priority}`]}`}>
                                        {c.priority}
                                    </span>
                                </td>
                                <td className={styles.tdLight}>{c.type}</td>
                                <td>
                                    <div className={`${styles.statusPill} ${styles[`status${c.status.replace(/\s+/g, '')}`]}`}>
                                        <span className={styles.statusDot}></span>
                                        {c.status}
                                    </div>
                                </td>
                                <td className={styles.tdLight}>{c.created}</td>
                                <td className={styles.tdLight}>{c.updated}</td>
                                <td>
                                    <button className={styles.btnIconCell}>
                                        <MoreVertical size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Pagination Details below table */}
                <div className={styles.paginationArea}>
                    <span className={styles.showingText}>Showing 1 to 5 of 42 results</span>
                    <div className={styles.pageControls}>
                        <button className={styles.pageBtnNav}><ChevronLeft size={16} /></button>
                        <button className={`${styles.pageBtn} ${styles.activePageBtn}`}>1</button>
                        <button className={styles.pageBtn}>2</button>
                        <button className={styles.pageBtn}>3</button>
                        <span className={styles.pageDots}>...</span>
                        <button className={styles.pageBtn}>9</button>
                        <button className={styles.pageBtnNav}><ChevronRight size={16} /></button>
                    </div>
                </div>
            </div>
        </div>
    );
}
