"use client";

import React from "react";
import styles from "./page.module.css";
import {
    ChevronRight,
    Edit2,
    CheckCircle,
    Download,
    FileText,
    Image as ImageIcon,
    User,
    Clock,
    Send,
    Smile,
    Paperclip,
    AtSign,
    MoreVertical,
    Check
} from "lucide-react";
import Link from "next/link";

export default function CaseDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const unwrappedParams = React.use(params);
    const caseId = unwrappedParams.id || "CAS-1024";

    return (
        <div className={styles.pageWrapper}>
            {/* Breadcrumbs */}
            <nav className={styles.breadcrumb}>
                <Link href="/">Dashboard</Link>
                <ChevronRight size={14} />
                <Link href="/enterprise/insurance/support">Cases</Link>
                <ChevronRight size={14} />
                <span>{caseId}</span>
            </nav>

            {/* Header section */}
            <header className={styles.header}>
                <div className={styles.headerTitleArea}>
                    <div className={styles.titleLine}>
                        <h1 className={styles.caseTitle}>{caseId}: Claim Documentation Missing</h1>
                        <span className={styles.priorityBadge}>HIGH PRIORITY</span>
                    </div>
                    <p className={styles.caseMeta}>
                        Submitted by <strong>John Doe</strong> on Oct 24, 2023 • Auto Policy #AP-9982
                    </p>
                </div>
                <div className={styles.headerActions}>
                    <button className={styles.editBtn}>
                        <Edit2 size={16} />
                        Edit Case
                    </button>
                    <button className={styles.resolveBtn}>
                        <CheckCircle size={16} />
                        Resolve Case
                    </button>
                </div>
            </header>

            {/* Progress Tracker */}
            <div className={styles.progressContainer}>
                <div className={styles.progressLine}>
                    <div className={styles.progressActive} style={{ width: '66%' }}></div>
                </div>
                <div className={styles.progressSteps}>
                    <div className={`${styles.step} ${styles.completed}`}>
                        <div className={styles.stepCircle}><Check size={14} /></div>
                        <span className={styles.stepLabel}>NEW</span>
                    </div>
                    <div className={`${styles.step} ${styles.completed}`}>
                        <div className={styles.stepCircle}><Check size={14} /></div>
                        <span className={styles.stepLabel}>ASSIGNED</span>
                    </div>
                    <div className={`${styles.step} ${styles.active}`}>
                        <div className={styles.stepCircle}>
                            <div className={styles.spinIcon}>
                                <Clock size={14} color="white" />
                            </div>
                        </div>
                        <span className={styles.stepLabel}>IN PROGRESS</span>
                    </div>
                    <div className={`${styles.step}`}>
                        <div className={styles.stepCircle}><Check size={14} /></div>
                        <span className={styles.stepLabel}>CLOSED</span>
                    </div>
                </div>
            </div>

            <div className={styles.mainContent}>
                {/* Left Column: Details and Attachments */}
                <div className={styles.detailsColumn}>
                    <section className={styles.infoCard}>
                        <div className={styles.cardHeader}>
                            <h2>Detailed Information</h2>
                            <span className={styles.idNumber}>ID: #00938482</span>
                        </div>
                        <div className={styles.infoGrid}>
                            <div className={styles.infoItem}>
                                <label>PRIORITY</label>
                                <div className={styles.statusValue}>
                                    <span className={styles.priorityDot}></span>
                                    High
                                </div>
                            </div>
                            <div className={styles.infoItem}>
                                <label>REQUEST TYPE</label>
                                <div>Documentation Verification</div>
                            </div>
                            <div className={styles.infoItem}>
                                <label>REASON</label>
                                <div>Incomplete Claim File</div>
                            </div>
                            <div className={styles.infoItem}>
                                <label>STATUS</label>
                                <div className={styles.statusBadge}>Awaiting Analyst Review</div>
                            </div>
                        </div>
                        <div className={styles.descriptionSection}>
                            <label>DESCRIPTION</label>
                            <p className={styles.descriptionBox}>
                                The claim submitted on October 22nd for policy AP-9982 requires additional supporting documentation.
                                Specifically, the police report and photos from the incident scene are missing from the uploaded zip file.
                                The claimant has been notified but we need to track this case until the files are verified by the processing team.
                            </p>
                        </div>
                    </section>

                    <section className={styles.attachmentsCard}>
                        <div className={styles.cardHeader}>
                            <div className={styles.headerLeft}>
                                <Paperclip size={18} className={styles.clipIcon} />
                                <h2>Attachments</h2>
                            </div>
                            <button className={styles.uploadBtn}>Upload New</button>
                        </div>
                        <div className={styles.attachmentGrid}>
                            <div className={styles.fileBox}>
                                <div className={styles.fileIconArea} style={{ backgroundColor: '#fff1f1' }}>
                                    <FileText size={20} color="#ff4d4f" />
                                </div>
                                <div className={styles.fileInfo}>
                                    <span className={styles.fileName}>Claim_Form_Final...</span>
                                    <span className={styles.fileSize}>2.4 MB • Oct 22</span>
                                </div>
                                <Download size={18} className={styles.downloadIcon} />
                            </div>
                            <div className={styles.fileBox}>
                                <div className={styles.fileIconArea} style={{ backgroundColor: '#e6f7ff' }}>
                                    <ImageIcon size={20} color="#1890ff" />
                                </div>
                                <div className={styles.fileInfo}>
                                    <span className={styles.fileName}>Damaged_Bumper...</span>
                                    <span className={styles.fileSize}>1.1 MB • Oct 22</span>
                                </div>
                                <Download size={18} className={styles.downloadIcon} />
                            </div>
                        </div>
                    </section>
                </div>

                {/* Right Column: Activity & Comments */}
                <aside className={styles.activityColumn}>
                    <div className={styles.activityCard}>
                        <h2>Activity & Comments</h2>

                        <div className={styles.activityList}>
                            <div className={styles.activityItem}>
                                <div className={styles.activityIcon}>
                                    <div className={styles.iconCircle}><User size={14} /></div>
                                </div>
                                <div className={styles.activityContent}>
                                    <p><strong>System</strong> moved this case to <span className={styles.textBlue}>In Progress</span>.</p>
                                    <span className={styles.activityTime}>Today, 9:24 AM</span>
                                </div>
                            </div>

                            <div className={styles.commentItem}>
                                <div className={styles.avatar}>SA</div>
                                <div className={styles.commentContent}>
                                    <div className={styles.commentHeader}>
                                        <strong>Sarah Adams</strong> <span className={styles.userTag}>Support Team</span>
                                    </div>
                                    <p>I&apos;ve contacted the claimant regarding the missing photos. They promised to upload them by EOD.</p>
                                    <span className={styles.activityTime}>Today, 10:45 AM</span>
                                </div>
                            </div>

                            <div className={styles.activityItem}>
                                <div className={styles.activityIcon}>
                                    <div className={styles.iconCircle}><FileText size={14} /></div>
                                </div>
                                <div className={styles.activityContent}>
                                    <p>Automated email sent to <strong>john.doe@email.com</strong>.</p>
                                    <span className={styles.activityTime}>Today, 10:46 AM</span>
                                </div>
                            </div>

                            <div className={styles.noteItem}>
                                <div className={styles.avatarBlack}>MK</div>
                                <div className={styles.noteContent}>
                                    <div className={styles.noteHeader}>
                                        <FileText size={12} />
                                        INTERNAL NOTE
                                    </div>
                                    <p>Risk department needs to double-check the previous claim history for this policy before approval.</p>
                                    <span className={styles.activityTime}>2 hours ago</span>
                                </div>
                            </div>
                        </div>

                        <div className={styles.commentInputArea}>
                            <div className={styles.inputBox}>
                                <textarea placeholder="Write a comment..."></textarea>
                                <div className={styles.inputToolbar}>
                                    <div className={styles.toolbarLeft}>
                                        <Smile size={18} />
                                        <Paperclip size={18} />
                                        <AtSign size={18} />
                                    </div>
                                    <div className={styles.toolbarRight}>
                                        <div className={styles.internalToggle}>
                                            <input type="checkbox" id="internal" />
                                            <label htmlFor="internal">INTERNAL NOTE</label>
                                        </div>
                                        <button className={styles.sendBtn}>
                                            <Send size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>

            <footer className={styles.footer}>
                © 2023 InsureBridge Ascend Portal. All documentation is encrypted and secure.
            </footer>
        </div>
    );
}
