"use client";

import React from "react";
import styles from "./page.module.css";
import Link from "next/link";
import {
    Building2,
    CheckCircle2,
    User,
    ChevronRight,
    Mail,
    Phone,
    MoreVertical,
    ExternalLink,
    Info
} from "lucide-react";
import { getLeadById } from "@/data/insurance/leads";
import { notFound } from "next/navigation";

export default function LeadDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = React.use(params);
    const lead = getLeadById(resolvedParams.id);

    if (!lead) {
        return notFound();
    }

    return (
        <div className={styles.pageContainer}>
            {/* Breadcrumb Context */}
            <div className={styles.breadcrumbContext}>
                <Link href="/enterprise/insurance/leads" className={styles.breadcrumbLink}>LEADS</Link>
                <ChevronRight size={14} className={styles.breadcrumbSeparator} />
                <span className={styles.breadcrumbCurrent}>{lead.leadName.toUpperCase()}</span>
            </div>

            {/* Header Profile Section */}
            <header className={styles.profileHeader}>
                <div className={styles.profileInfo}>
                    <div className={styles.avatarLarge}>
                        <User size={32} color="white" />
                    </div>
                    <div className={styles.profileDetails}>
                        <h1 className={styles.profileName}>{lead.leadName}</h1>
                        <div className={styles.companyContext}>
                            <Building2 size={16} className={styles.companyIcon} />
                            <span>{lead.company}</span>
                        </div>
                    </div>
                </div>

                <div className={styles.profileActions}>
                    <button className={styles.btnSecondary}>Drop</button>
                    <button className={styles.btnSecondary}>Assign</button>
                    <button className={styles.btnSecondary}>Submit</button>
                    <button className={styles.btnPrimarySuccess}>
                        <CheckCircle2 size={16} />
                        Convert
                    </button>
                </div>
            </header>

            {/* Pipeline Visualizer */}
            <div className={styles.pipelineTracker}>
                <div className={`${styles.pipelineStage} ${styles.stageCompleted}`}>
                    <span className={styles.stageText}>DRAFT</span>
                    <div className={styles.arrowTail} />
                </div>
                <div className={`${styles.pipelineStage} ${styles.stageCompleted}`}>
                    <div className={styles.arrowHead} />
                    <span className={styles.stageText}>NEW</span>
                    <div className={styles.arrowTail} />
                </div>
                <div className={`${styles.pipelineStage} ${styles.stageActive}`}>
                    <div className={styles.arrowHead} />
                    <span className={styles.stageText}>ASSIGNED</span>
                    <div className={styles.arrowTail} />
                </div>
                <div className={`${styles.pipelineStage} ${styles.stagePending}`}>
                    <div className={styles.arrowHead} />
                    <span className={styles.stageText}>LEAD IN PROCESS</span>
                    <div className={styles.arrowTail} />
                </div>
                <div className={`${styles.pipelineStage} ${styles.stagePending} ${styles.stageLast}`}>
                    <div className={styles.arrowHead} />
                    <span className={styles.stageText}>CONVERTED / DROPPED</span>
                </div>
            </div>

            {/* Main Tabs */}
            <div className={styles.tabsContainer}>
                <button className={`${styles.tabBtn} ${styles.activeTab}`}>Details</button>
                <button className={styles.tabBtn}>Initial Needs Assessment (INA)</button>
                <button className={styles.tabBtn}>Activity</button>
                <button className={styles.tabBtn}>Attachments</button>
                <button className={styles.tabBtn}>Chatter</button>
            </div>

            {/* Content Grid */}
            <div className={styles.contentGrid}>
                {/* Left Column */}
                <div className={styles.mainColumn}>

                    {/* Card: Lead Information */}
                    <div className={styles.dataCard}>
                        <div className={styles.cardHeader}>
                            <div className={styles.cardHeaderLeft}>
                                <div className={styles.iconCircleBlue}><Info size={16} /></div>
                                <h3 className={styles.cardTitle}>Lead Information</h3>
                            </div>
                            <ChevronRight size={18} className={styles.collapseIcon} />
                        </div>

                        <div className={styles.cardBody}>
                            <div className={styles.dataRow2}>
                                <div className={styles.dataBlock}>
                                    <label>LEAD OWNER</label>
                                    <p>Alex Thompson <span className={styles.editIcon}>✏️</span></p>
                                </div>
                                <div className={styles.dataBlock}>
                                    <label>LEAD SOURCE</label>
                                    <p>{lead.source} <span className={styles.editIcon}>✏️</span></p>
                                </div>
                            </div>
                            <div className={styles.dataRow2}>
                                <div className={styles.dataBlock}>
                                    <label>STATUS</label>
                                    <p><span className={styles.statusBadgeAssigned}>{lead.status.toUpperCase()}</span> <span className={styles.editIcon}>✏️</span></p>
                                </div>
                                <div className={styles.dataBlock}>
                                    <label>PRIORITY</label>
                                    <p>{lead.priority} <span className={styles.editIcon}>✏️</span></p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Card: Client Details */}
                    <div className={styles.dataCard}>
                        <div className={styles.cardHeader}>
                            <div className={styles.cardHeaderLeft}>
                                <div className={styles.iconCircleBlue}><Building2 size={16} /></div>
                                <h3 className={styles.cardTitle}>Client Details</h3>
                            </div>
                            <ChevronRight size={18} className={styles.collapseIcon} />
                        </div>

                        <div className={styles.cardBody}>
                            <div className={styles.clientBox}>
                                <div className={styles.clientBoxLeft}>
                                    <div className={styles.companyLogoSquare}>
                                        <Building2 size={24} color="#94a3b8" />
                                    </div>
                                    <div className={styles.clientBoxInfo}>
                                        <h4>{lead.company}</h4>
                                        <p>{lead.industry} | {lead.location}</p>

                                        <div className={styles.clientMetrics}>
                                            <div>
                                                <label>ANNUAL REVENUE</label>
                                                <span>{lead.revenue}</span>
                                            </div>
                                            <div>
                                                <label>EMPLOYEES</label>
                                                <span>{lead.employees}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.clientBoxRight}>
                                    <button className={styles.linkButton}>VIEW ACCOUNT <ExternalLink size={14} /></button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Card: Initial Needs Assessment */}
                    <div className={styles.dataCard}>
                        <div className={styles.cardHeaderWithButton}>
                            <div className={styles.cardHeaderLeft}>
                                <div className={styles.iconCircleGreen}><Building2 size={16} /></div>
                                <h3 className={styles.cardTitle}>Initial Needs Assessment</h3>
                            </div>
                            <button className={styles.btnNewIna}>+ NEW INA</button>
                        </div>
                        <table className={styles.inaTable}>
                            <thead>
                                <tr>
                                    <th>PRODUCT</th>
                                    <th>INSURER</th>
                                    <th>BROKER</th>
                                    <th>EST. PREMIUM</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className={styles.tdBold}>General Liability</td>
                                    <td>AXA Insurance</td>
                                    <td>Marsh India</td>
                                    <td className={styles.tdBlue}>$12,400</td>
                                    <td><MoreVertical size={16} color="#94a3b8" /></td>
                                </tr>
                                <tr>
                                    <td className={styles.tdBold}>Group Health</td>
                                    <td>Allianz</td>
                                    <td>Aon Global</td>
                                    <td className={styles.tdBlue}>$85,000</td>
                                    <td><MoreVertical size={16} color="#94a3b8" /></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                </div>

                {/* Right Column */}
                <div className={styles.sideColumn}>

                    {/* Card: Lead Contacts */}
                    <div className={styles.dataCard}>
                        <div className={styles.cardHeaderWithButton}>
                            <div className={styles.cardHeaderLeft}>
                                <div className={styles.iconCircleBlue}><User size={16} /></div>
                                <h3 className={styles.cardTitle}>Lead Contacts</h3>
                            </div>
                            <button className={styles.linkButtonBlue}>ADD</button>
                        </div>
                        <div className={styles.cardBodyCompact}>
                            {lead.contacts && lead.contacts.map((contact, idx) => (
                                <div key={idx} className={styles.contactItem}>
                                    <div className={styles.avatarSmall} style={{ backgroundColor: contact.colorTheme === 'red' ? '#fee2e2' : contact.colorTheme === 'green' ? '#d1fae5' : '#dbeafe', color: contact.colorTheme === 'red' ? '#dc2626' : contact.colorTheme === 'green' ? '#059669' : '#2563eb' }}>{contact.initials}</div>
                                    <div className={styles.contactInfo}>
                                        <h4>{contact.name}</h4>
                                        <p>{contact.role}</p>
                                    </div>
                                    {idx === 0 ? <Mail size={16} color="#cbd5e1" /> : <Phone size={16} color="#cbd5e1" />}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Card: Next Steps */}
                    <div className={styles.dataCard}>
                        <div className={styles.cardHeaderStandard}>
                            <h3 className={styles.cardTitleAlt}>NEXT STEPS</h3>
                        </div>
                        <div className={styles.cardBodyCompact}>
                            <div className={styles.timelineItem}>
                                <div className={styles.timelineDotOrange}></div>
                                <div className={styles.timelineContent}>
                                    <h4>Introductory Meeting</h4>
                                    <p>Tomorrow at 10:00 AM</p>
                                </div>
                            </div>
                            <div className={styles.timelineItem}>
                                <div className={styles.timelineDotGrey}></div>
                                <div className={styles.timelineContent}>
                                    <h4>Document Review</h4>
                                    <p>Oct 24, 2023</p>
                                </div>
                            </div>

                            <button className={styles.btnFullWidth}>VIEW ACTIVITY FEED</button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
