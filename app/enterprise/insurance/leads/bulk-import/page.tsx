"use client";

import React, { useState } from "react";
import styles from "./page.module.css";
import { Check, AlertTriangle, ArrowLeft, ArrowRight, Lightbulb, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function BulkImportPage() {
    const router = useRouter();

    const handleBack = () => {
        router.back();
    };

    return (
        <div className={styles.pageContainer}>
            {/* Breadcrumb */}
            <div className={styles.breadcrumb}>
                <span className={styles.breadcrumbMuted}>CRM</span>
                <ChevronRight size={14} className={styles.breadcrumbMuted} />
                <span className={styles.breadcrumbMuted}>Leads</span>
                <ChevronRight size={14} className={styles.breadcrumbMuted} />
                <span className={styles.breadcrumbCurrent}>Bulk Import</span>
            </div>

            {/* Stepper */}
            <div className={styles.stepperContainer}>
                <div className={styles.stepperLine}></div>

                <div className={styles.stepItem}>
                    <div className={`${styles.stepCircle} ${styles.stepCompleted}`}>
                        <Check size={16} strokeWidth={3} />
                    </div>
                    <span className={styles.stepLabel}>Choose Source</span>
                </div>

                <div className={styles.stepItem}>
                    <div className={`${styles.stepCircle} ${styles.stepCompleted}`}>
                        <Check size={16} strokeWidth={3} />
                    </div>
                    <span className={styles.stepLabel}>Upload File</span>
                </div>

                <div className={styles.stepItem}>
                    <div className={`${styles.stepCircle} ${styles.stepActive}`}>3</div>
                    <span className={`${styles.stepLabel} ${styles.stepLabelActive}`}>Field Mapping</span>
                </div>

                <div className={styles.stepItem}>
                    <div className={`${styles.stepCircle} ${styles.stepInactive}`}>4</div>
                    <span className={`${styles.stepLabel} ${styles.stepLabelInactive}`}>Validation</span>
                </div>

                <div className={styles.stepItem}>
                    <div className={`${styles.stepCircle} ${styles.stepInactive}`}>5</div>
                    <span className={`${styles.stepLabel} ${styles.stepLabelInactive}`}>Done</span>
                </div>
            </div>

            {/* Main Card */}
            <div className={styles.card}>
                <div className={styles.cardHeader}>
                    <div>
                        <h1 className={styles.cardTitle}>Bulk Import Leads</h1>
                        <p className={styles.cardSubtitle}>Map your CSV columns to the appropriate fields in the InsureBridge lead database.</p>
                    </div>
                    <div className={styles.progressSection}>
                        <span className={styles.progressLabel}>STEP 3 OF 5</span>
                        <div className={styles.progressBar}>
                            <div className={styles.progressFill}></div>
                        </div>
                    </div>
                </div>

                <table className={styles.mappingTable}>
                    <thead>
                        <tr>
                            <th>YOUR CSV COLUMN</th>
                            <th>PREVIEW DATA</th>
                            <th>ASCEND FIELD</th>
                            <th className={styles.statusCell}>STATUS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Row 1 */}
                        <tr>
                            <td className={styles.csvColumn}>first_name</td>
                            <td className={styles.previewData}>John, Sarah, Michael...</td>
                            <td>
                                <select className={styles.fieldSelect} defaultValue="First Name">
                                    <option value="First Name">First Name</option>
                                    <option value="Last Name">Last Name</option>
                                    <option value="Organization">Organization</option>
                                </select>
                            </td>
                            <td className={styles.statusCell}>
                                <div className={`${styles.statusIcon} ${styles.statusSuccess}`}>
                                    <div style={{ backgroundColor: '#22c55e', borderRadius: '50%', padding: '2px', display: 'flex' }}>
                                        <Check size={14} color="white" strokeWidth={3} />
                                    </div>
                                </div>
                            </td>
                        </tr>

                        {/* Row 2 */}
                        <tr>
                            <td className={styles.csvColumn}>last_name</td>
                            <td className={styles.previewData}>Doe, Smith, Jackson...</td>
                            <td>
                                <select className={styles.fieldSelect} defaultValue="Last Name">
                                    <option value="First Name">First Name</option>
                                    <option value="Last Name">Last Name</option>
                                    <option value="Organization">Organization</option>
                                </select>
                            </td>
                            <td className={styles.statusCell}>
                                <div className={`${styles.statusIcon} ${styles.statusSuccess}`}>
                                    <div style={{ backgroundColor: '#22c55e', borderRadius: '50%', padding: '2px', display: 'flex' }}>
                                        <Check size={14} color="white" strokeWidth={3} />
                                    </div>
                                </div>
                            </td>
                        </tr>

                        {/* Row 3 */}
                        <tr>
                            <td className={styles.csvColumn}>cust_mail_addr</td>
                            <td className={styles.previewData}>j.doe@company.com...</td>
                            <td>
                                <select className={`${styles.fieldSelect} ${styles.fieldSelectError}`} defaultValue="">
                                    <option value="" disabled>-- Select a Field --</option>
                                    <option value="Email">Email</option>
                                    <option value="Secondary Email">Secondary Email</option>
                                </select>
                            </td>
                            <td className={styles.statusCell}>
                                <div className={styles.statusRequired}>
                                    <AlertTriangle size={16} fill="#fef3c7" stroke="#d97706" />
                                    REQUIRED
                                </div>
                            </td>
                        </tr>

                        {/* Row 4 */}
                        <tr>
                            <td className={styles.csvColumn}>phone_num</td>
                            <td className={styles.previewData}>+1 (555) 012-3456...</td>
                            <td>
                                <select className={styles.fieldSelect} defaultValue="Work Phone">
                                    <option value="Work Phone">Work Phone</option>
                                    <option value="Mobile Phone">Mobile Phone</option>
                                </select>
                            </td>
                            <td className={styles.statusCell}>
                                <div className={`${styles.statusIcon} ${styles.statusSuccess}`}>
                                    <div style={{ backgroundColor: '#22c55e', borderRadius: '50%', padding: '2px', display: 'flex' }}>
                                        <Check size={14} color="white" strokeWidth={3} />
                                    </div>
                                </div>
                            </td>
                        </tr>

                        {/* Row 5 */}
                        <tr>
                            <td className={styles.csvColumn}>company_name</td>
                            <td className={styles.previewData}>Acme Corp, Globex...</td>
                            <td>
                                <select className={styles.fieldSelect} defaultValue="Organization">
                                    <option value="Organization">Organization</option>
                                    <option value="Company Name">Company Name</option>
                                </select>
                            </td>
                            <td className={styles.statusCell}>
                                <div className={`${styles.statusIcon} ${styles.statusSuccess}`}>
                                    <div style={{ backgroundColor: '#22c55e', borderRadius: '50%', padding: '2px', display: 'flex' }}>
                                        <Check size={14} color="white" strokeWidth={3} />
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>

                {/* Footer Actions */}
                <div className={styles.cardFooter}>
                    <div className={styles.footerLeft}>
                        <button onClick={handleBack} className={styles.backBtn}>
                            <ArrowLeft size={16} />
                            Back
                        </button>
                        <button onClick={handleBack} className={styles.cancelBtn}>
                            Cancel
                        </button>
                    </div>
                    <div className={styles.footerRight}>
                        <div className={styles.statsText}>
                            <div className={styles.statsLabel}>MAPPING STATS</div>
                            <div className={styles.statsValue}>4 of 5 Fields Mapped</div>
                        </div>
                        <button className={styles.continueBtn}>
                            Continue to Validation
                            <ArrowRight size={18} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Pro Tip Box */}
            <div className={styles.proTipBox}>
                <div className={styles.proTipIcon}>
                    <Lightbulb size={24} fill="#eff6ff" strokeWidth={2} />
                </div>
                <div className={styles.proTipText}>
                    <span className={styles.proTipLabel}>Pro Tip:</span> Our auto-mapper uses fuzzy logic to identify column headers. You can save this mapping configuration as a template for future imports from the same source.
                </div>
            </div>
        </div>
    );
}
