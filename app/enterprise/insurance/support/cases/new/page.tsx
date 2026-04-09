"use client";

import React from "react";
import styles from "./page.module.css";
import { ChevronRight, UploadCloud, Info, Send } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CreateCasePage() {
    const router = useRouter();

    const handleCancel = () => {
        router.push("/support");
    };

    return (
        <div className={styles.pageContainer}>
            {/* Breadcrumb */}
            <div className={styles.breadcrumb}>
                <Link href="/enterprise/insurance/support" style={{ textDecoration: 'none', color: 'inherit' }}>Support</Link>
                <ChevronRight size={14} />
                <span>Cases</span>
                <ChevronRight size={14} />
                <span className={styles.breadcrumbCurrent}>Create New Case</span>
            </div>

            {/* Header */}
            <div className={styles.headerArea}>
                <h1 className={styles.pageTitle}>Create New Case</h1>
                <p className={styles.pageSubtitle}>
                    Please fill out the details below to open a new support request. Our team typically responds within 4 business hours.
                </p>
            </div>

            {/* Form Card */}
            <div className={styles.formCard}>
                <div className={styles.formGrid}>
                    {/* Subject */}
                    <div className={`${styles.formGroup} ${styles.colSpan2}`}>
                        <label className={styles.label}>Subject</label>
                        <input
                            type="text"
                            className={styles.input}
                            placeholder="Briefly describe your issue (e.g., Unable to process policy renewal)"
                        />
                    </div>

                    {/* Priority & Request Type */}
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Priority</label>
                        <select className={`${styles.input} ${styles.select}`} defaultValue="">
                            <option value="" disabled>Select priority level</option>
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                            <option value="Critical">Critical</option>
                        </select>
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Request Type</label>
                        <select className={`${styles.input} ${styles.select}`} defaultValue="">
                            <option value="" disabled>Select request type</option>
                            <option value="Billing">Billing</option>
                            <option value="Access">Access</option>
                            <option value="Claims">Claims</option>
                            <option value="Technical">Technical</option>
                            <option value="Sales">Sales</option>
                        </select>
                    </div>

                    {/* Case Reason */}
                    <div className={`${styles.formGroup} ${styles.colSpan2}`}>
                        <label className={styles.label}>Case Reason</label>
                        <select className={`${styles.input} ${styles.select}`} defaultValue="">
                            <option value="" disabled>Select the specific reason</option>
                            <option value="bug">I am experiencing a bug</option>
                            <option value="question">I have a question</option>
                            <option value="feature">I want to request a feature</option>
                        </select>
                    </div>

                    {/* Description */}
                    <div className={`${styles.formGroup} ${styles.colSpan2}`}>
                        <label className={styles.label}>Description</label>
                        <textarea
                            className={`${styles.input} ${styles.textarea}`}
                            placeholder="Provide detailed information about the case. Include steps to reproduce if applicable."
                        ></textarea>
                    </div>

                    {/* Attachments */}
                    <div className={`${styles.formGroup} ${styles.colSpan2}`}>
                        <label className={styles.label}>Attachments</label>
                        <div className={styles.dropzone}>
                            <UploadCloud size={32} className={styles.uploadIcon} />
                            <div className={styles.uploadText}>
                                Drag and drop files here or <span className={styles.browseLink}>browse</span>
                            </div>
                            <div className={styles.uploadSubtext}>
                                Maximum file size: 25MB. Supported formats: JPG, PNG, PDF, CSV, XLSX.
                            </div>
                        </div>
                    </div>
                </div>

                {/* Troubleshooting Tip */}
                <div className={styles.tipBox}>
                    <div className={styles.tipIcon}>
                        <Info size={20} fill="#0052ff" stroke="white" />
                    </div>
                    <div className={styles.tipContent}>
                        <span className={styles.tipTitle}>Troubleshooting Tip</span>
                        <span className={styles.tipText}>
                            If upload fails, clear browser cache. Try incognito mode if issue persists.
                        </span>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className={styles.footerActions}>
                    <button onClick={handleCancel} className={styles.cancelBtn}>Cancel</button>
                    <button className={styles.submitBtn}>
                        Submit Case
                        <Send size={16} fill="white" />
                    </button>
                </div>
            </div>

            {/* Contact Support */}
            <div className={styles.contactSupport}>
                Need immediate assistance? <Link href="#" className={styles.contactLink}>Contact Phone Support</Link>
            </div>
        </div>
    );
}
