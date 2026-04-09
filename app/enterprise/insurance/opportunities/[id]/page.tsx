"use client";

import React from "react";
import styles from "./page.module.css";
import {
    ChevronRight,
    ChevronDown,
    Plus,
    History,
    MessageSquare,
    Phone,
    FileText,
    Calendar,
    Users,
    Paperclip,
    Info,
    Shield
} from "lucide-react";
import Link from "next/link";

export default function OpportunityDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const unwrappedParams = React.use(params);
    const oppId = unwrappedParams.id || "OPP-Apollo-Tyres-General-Liability-1024";

    return (
        <div className={styles.pageWrapper}>
            {/* Breadcrumbs */}
            <nav className={styles.breadcrumb}>
                <Link href="/enterprise/insurance/opportunities">Opportunities</Link>
                <ChevronRight size={14} />
                <span>{oppId}</span>
            </nav>

            {/* Header section */}
            <header className={styles.header}>
                <div className={styles.headerTitleArea}>
                    <h1 className={styles.oppTitle}>{oppId}</h1>
                    <p className={styles.oppMeta}>
                        Apollo Tyres • General Liability • Renewals 2024
                    </p>
                </div>
                <div className={styles.headerActions}>
                    <button className={styles.gatherBtn}>
                        <FileText size={16} />
                        Gather Information
                    </button>
                    <button className={styles.dropBtn}>Drop</button>
                </div>
            </header>

            {/* Progress Tracker */}
            <div className={styles.progressContainer}>
                <div className={styles.progressLine}>
                    <div className={styles.progressActive} style={{ width: '33%' }}></div>
                </div>
                <div className={styles.progressSteps}>
                    <div className={`${styles.step} ${styles.completed}`}>
                        <div className={styles.stepCircle}><div className={styles.checkIcon}></div></div>
                        <span className={styles.stepLabel}>Initial Review</span>
                    </div>
                    <div className={`${styles.step} ${styles.active}`}>
                        <div className={styles.stepCircle}></div>
                        <span className={styles.stepLabel}>Information Gathering</span>
                    </div>
                    <div className={styles.step}>
                        <div className={styles.stepCircle}></div>
                        <span className={styles.stepLabel}>Quote Request</span>
                    </div>
                    <div className={styles.step}>
                        <div className={styles.stepCircle}></div>
                        <span className={styles.stepLabel}>Concluded</span>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className={styles.tabsSection}>
                <button className={`${styles.tab} ${styles.activeTab}`}>Details</button>
                <button className={styles.tab}>Opportunity Contacts</button>
                <button className={styles.tab}>Internal Contacts</button>
                <button className={styles.tab}>Loss History</button>
                <button className={styles.tab}>Activity</button>
                <button className={styles.tab}>Attachments <span className={styles.count}>12</span></button>
                <button className={styles.tab}>Chatter</button>
            </div>

            <div className={styles.mainGrid}>
                {/* Left Column */}
                <div className={styles.contentColumn}>
                    {/* Opportunity Information */}
                    <section className={styles.card}>
                        <div className={styles.cardHeader}>
                            <div className={styles.headerTitle}>
                                <Info size={18} className={styles.iconBlue} />
                                <h2>Opportunity Information</h2>
                            </div>
                            <ChevronDown size={18} color="#94a3b8" />
                        </div>
                        <div className={styles.cardBody}>
                            <div className={styles.infoGrid}>
                                <div className={styles.infoField}>
                                    <label>OPPORTUNITY OWNER</label>
                                    <p>Alex Johnson</p>
                                </div>
                                <div className={styles.infoField}>
                                    <label>CLOSE DATE</label>
                                    <p>October 24, 2024</p>
                                </div>
                                <div className={styles.infoField}>
                                    <label>ESTIMATED REVENUE</label>
                                    <p>$45,000.00</p>
                                </div>
                                <div className={styles.infoField}>
                                    <label>PROBABILITY</label>
                                    <div className={styles.probabilityWrapper}>
                                        <p>75%</p>
                                        <div className={styles.probTrack}>
                                            <div className={styles.probFill} style={{ width: '75%' }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Existing Insurance Details */}
                    <section className={styles.card}>
                        <div className={styles.cardHeader}>
                            <div className={styles.headerTitle}>
                                <Shield size={18} className={styles.iconBlue} />
                                <h2>Existing Insurance Details</h2>
                            </div>
                            <ChevronDown size={18} color="#94a3b8" />
                        </div>
                        <div className={styles.cardBody}>
                            <div className={styles.infoGrid}>
                                <div className={styles.infoField}>
                                    <label>CURRENT CARRIER</label>
                                    <p>MetLife Global Risk</p>
                                </div>
                                <div className={styles.infoField}>
                                    <label>POLICY EXPIRY</label>
                                    <p>December 31, 2024</p>
                                </div>
                                <div className={styles.infoField}>
                                    <label>CURRENT PREMIUM</label>
                                    <p>$38,200.00</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Loss History */}
                    <section className={styles.card}>
                        <div className={styles.cardHeader}>
                            <div className={styles.headerTitle}>
                                <History size={18} className={styles.iconBlue} />
                                <h2>Loss History</h2>
                            </div>
                            <button className={styles.newRecordBtn}>
                                <Plus size={14} /> New Record
                            </button>
                        </div>
                        <div className={styles.tableWrapper}>
                            <table className={styles.lossTable}>
                                <thead>
                                    <tr>
                                        <th>POLICY SEQ</th>
                                        <th>POLICY YEAR</th>
                                        <th>OUTSTANDING</th>
                                        <th>TOTAL PAID</th>
                                        <th>INCURRED</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>001</td>
                                        <td>2023-2024</td>
                                        <td>$5,400.00</td>
                                        <td>$12,000.00</td>
                                        <td className={styles.boldCell}>$17,400.00</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </section>
                </div>

                {/* Right Column: Sidebar */}
                <aside className={styles.sidebarColumn}>
                    {/* Recent Activity */}
                    <section className={styles.sidebarCard}>
                        <div className={styles.sidebarHeader}>
                            <h2>Recent Activity</h2>
                            <History size={16} color="#94a3b8" />
                        </div>
                        <div className={styles.activityTimeline}>
                            <div className={styles.timelineItem}>
                                <div className={styles.timelineIcon} style={{ backgroundColor: '#eff6ff' }}>
                                    <Phone size={14} color="#3b82f6" />
                                </div>
                                <div className={styles.timelineContent}>
                                    <h3>Initial Discovery Call</h3>
                                    <p>Contacted Ravi Shakar regarding policy needs.</p>
                                    <span>2 HOURS AGO</span>
                                </div>
                            </div>
                            <div className={styles.timelineItem}>
                                <div className={styles.timelineIcon} style={{ backgroundColor: '#f0fdf4' }}>
                                    <FileText size={14} color="#22c55e" />
                                </div>
                                <div className={styles.timelineContent}>
                                    <h3>Document Uploaded</h3>
                                    <p>2023 Loss Runs.pdf has been added to files.</p>
                                    <span>YESTERDAY</span>
                                </div>
                            </div>
                            <div className={styles.timelineItem}>
                                <div className={styles.timelineIcon} style={{ backgroundColor: '#fffbeb' }}>
                                    <Calendar size={14} color="#f59e0b" />
                                </div>
                                <div className={styles.timelineContent}>
                                    <h3>Meeting Scheduled</h3>
                                    <p>Risk assessment walkthrough for site B.</p>
                                    <span>3 DAYS AGO</span>
                                </div>
                            </div>
                        </div>
                        <button className={styles.viewHistoryBtn}>View All History</button>
                    </section>

                    {/* Chatter */}
                    <section className={styles.sidebarCard}>
                        <div className={styles.sidebarHeader}>
                            <h2>Chatter</h2>
                            <MessageSquare size={16} color="#94a3b8" />
                        </div>
                        <div className={styles.chatterList}>
                            <div className={styles.chatterItem}>
                                <div className={styles.chatterAvatar}></div>
                                <div className={styles.chatterContent}>
                                    <div className={styles.chatterUser}>
                                        <strong>Marcus Thorne</strong>
                                    </div>
                                    <p>Hey <span className={styles.mention}>@Alex Johnson</span>, have you received the updated liability limits from the client?</p>
                                </div>
                            </div>
                        </div>
                    </section>
                </aside>
            </div>
        </div>
    );
}
