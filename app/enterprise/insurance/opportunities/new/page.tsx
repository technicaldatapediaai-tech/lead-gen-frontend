"use client";

import React, { useState } from "react";
import styles from "./page.module.css";
import { ArrowLeft, Search, Calendar, Building2, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CreateOpportunityPage() {
    const router = useRouter();
    const [priority, setPriority] = useState("Medium");

    const handleBack = () => {
        router.push("/opportunities");
    };

    return (
        <div className={styles.pageContainer}>
            {/* Header */}
            <header className={styles.header}>
                <div className={styles.headerLeft}>
                    <button onClick={handleBack} className={styles.backButton}>
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className={styles.pageTitle}>Create New Opportunity</h1>
                </div>
                <div className={styles.headerActions}>
                    <button onClick={handleBack} className={styles.cancelBtn}>Cancel</button>
                    <button className={styles.saveBtn}>Save Opportunity</button>
                </div>
            </header>

            {/* Section 1: Opportunity Information */}
            <section className={styles.section}>
                <div className={styles.sectionTitle}>Section 1: Opportunity Information</div>
                <div className={styles.sectionContent}>
                    <div className={styles.formGrid}>
                        {/* Row 1 */}
                        <div className={`${styles.formGroup} ${styles.colSpan2}`}>
                            <label className={styles.label}>Opportunity Name*</label>
                            <div className={styles.inputWrapper}>
                                <input type="text" className={styles.input} placeholder="e.g. Q4 Corporate Fleet Ex" />
                            </div>
                        </div>
                        <div className={`${styles.formGroup} ${styles.colSpan1}`}></div> {/* empty div for spacing or layout depending on image */}
                        <div className={`${styles.formGroup} ${styles.colSpan1}`}>
                            <label className={styles.label}>Opportunity Source*</label>
                            <div className={styles.inputWrapper}>
                                <input type="text" className={styles.input} defaultValue="Broker Network" />
                            </div>
                        </div>

                        {/* Row 2 */}
                        <div className={`${styles.formGroup} ${styles.colSpan2}`}>
                            <label className={styles.label}>Product* (Master)</label>
                            <div className={styles.inputWrapper}>
                                <input type="text" className={`${styles.input} ${styles.inputWithIconRight}`} placeholder="Search product..." />
                                <div className={styles.iconRight}>
                                    <Search size={16} />
                                </div>
                            </div>
                        </div>
                        <div className={`${styles.formGroup} ${styles.colSpan1}`}>
                            <label className={styles.label}>Probability of Closing</label>
                            <div className={styles.inputWrapper}>
                                <select className={`${styles.input} ${styles.select}`} defaultValue="High">
                                    <option value="High">High</option>
                                    <option value="Medium">Medium</option>
                                    <option value="Low">Low</option>
                                </select>
                            </div>
                        </div>
                        <div className={`${styles.formGroup} ${styles.colSpan1}`}>
                            <label className={styles.label}>Opportunity Type*</label>
                            <div className={styles.inputWrapper}>
                                <select className={`${styles.input} ${styles.select}`} defaultValue="Fresh Lead">
                                    <option value="Fresh Lead">Fresh Lead</option>
                                    <option value="Renewal">Renewal</option>
                                    <option value="Upsell">Upsell</option>
                                </select>
                            </div>
                        </div>

                        {/* Row 3 */}
                        <div className={`${styles.formGroup} ${styles.colSpan1}`}>
                            <label className={styles.label}>Provisional Sum Insured</label>
                            <div className={styles.inputWrapper}>
                                <span className={styles.prefix}>$</span>
                                <input type="text" className={`${styles.input} ${styles.inputWithPrefix}`} placeholder="0.00" />
                            </div>
                        </div>
                        <div className={`${styles.formGroup} ${styles.colSpan1}`}>
                            <label className={styles.label}>Estimated Premium Value</label>
                            <div className={styles.inputWrapper}>
                                <span className={styles.prefix}>$</span>
                                <input type="text" className={`${styles.input} ${styles.inputWithPrefix}`} placeholder="0.00" />
                            </div>
                        </div>
                        <div className={`${styles.formGroup} ${styles.colSpan1}`}></div>
                        <div className={`${styles.formGroup} ${styles.colSpan1}`}>
                            <label className={styles.label}>Expected Closing Date*</label>
                            <div className={styles.inputWrapper}>
                                <input type="text" className={`${styles.input} ${styles.inputWithIconRight}`} placeholder="mm/dd/yyyy" />
                                <div className={styles.iconRight}>
                                    <Calendar size={16} />
                                </div>
                            </div>
                        </div>

                        {/* Row 4 */}
                        <div className={`${styles.formGroup} ${styles.colSpan1}`}>
                            <label className={styles.label}>Broker Business Location*</label>
                            <div className={styles.inputWrapper}>
                                <select className={`${styles.input} ${styles.select}`}>
                                    <option value="">Select location</option>
                                </select>
                            </div>
                        </div>
                        <div className={`${styles.formGroup} ${styles.colSpan1}`}>
                            <label className={styles.label}>Broker Service Location</label>
                            <div className={styles.inputWrapper}>
                                <input type="text" className={styles.input} placeholder="Regional office details" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section 2: Existing Insurance Details */}
            <section className={styles.section}>
                <div className={styles.sectionTitle}>Section 2: Existing Insurance Details</div>
                <div className={styles.sectionContent}>
                    <div className={styles.formGrid}>
                        {/* Row 1 */}
                        <div className={`${styles.formGroup} ${styles.colSpan1}`} style={{ gridColumn: 'span 1' }}>
                            <label className={styles.label}>Product (Master)</label>
                            <div className={styles.inputWrapper}>
                                <input type="text" className={`${styles.input} ${styles.inputWithIconRight}`} placeholder="Search product..." />
                                <div className={styles.iconRight}>
                                    <Search size={16} />
                                </div>
                            </div>
                        </div>
                        <div className={`${styles.formGroup} ${styles.colSpan1}`}>
                            <label className={styles.label}>Insurer (Master)</label>
                            <div className={styles.inputWrapper}>
                                <input type="text" className={`${styles.input} ${styles.inputWithIconRight}`} placeholder="Search insurer..." />
                                <div className={styles.iconRight}>
                                    <Building2 size={16} />
                                </div>
                            </div>
                        </div>
                        <div className={`${styles.formGroup} ${styles.colSpan1}`} style={{ gridColumn: 'span 2' }}>
                            <label className={styles.label}>Broker (Master)</label>
                            <div className={styles.inputWrapper} style={{ maxWidth: '280px' }}>
                                <input type="text" className={`${styles.input} ${styles.inputWithIconRight}`} placeholder="Search broker..." />
                                <div className={styles.iconRight}>
                                    <User size={16} />
                                </div>
                            </div>
                        </div>

                        {/* Row 2 */}
                        <div className={`${styles.formGroup} ${styles.colSpan1}`}>
                            <label className={styles.label}>Current Policy Type</label>
                            <div className={styles.inputWrapper}>
                                <select className={`${styles.input} ${styles.select}`} defaultValue="Comprehensive">
                                    <option value="Comprehensive">Comprehensive</option>
                                    <option value="Third Party">Third Party</option>
                                </select>
                            </div>
                        </div>
                        <div className={`${styles.formGroup} ${styles.colSpan1}`}>
                            <label className={styles.label}>Policy Number</label>
                            <div className={styles.inputWrapper}>
                                <input type="text" className={styles.input} placeholder="e.g. POL-882910" />
                            </div>
                        </div>
                        <div className={`${styles.formGroup} ${styles.colSpan2}`}>
                            <label className={styles.label}>Priority</label>
                            <div className={styles.priorityGroup} style={{ maxWidth: '300px' }}>
                                {["Low", "Medium", "High"].map(level => (
                                    <button
                                        key={level}
                                        className={styles.priorityBtn}
                                        data-active={priority === level}
                                        data-value={level}
                                        onClick={() => setPriority(level)}
                                    >
                                        {level}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Row 3 */}
                        <div className={`${styles.formGroup} ${styles.colSpan1}`}>
                            <label className={styles.label}>Policy Start Date</label>
                            <div className={styles.inputWrapper}>
                                <input type="text" className={`${styles.input} ${styles.inputWithIconRight}`} placeholder="mm/dd/yyyy" />
                                <div className={styles.iconRight}>
                                    <Calendar size={16} />
                                </div>
                            </div>
                        </div>
                        <div className={`${styles.formGroup} ${styles.colSpan1}`}>
                            <label className={styles.label}>Policy End Date</label>
                            <div className={styles.inputWrapper}>
                                <input type="text" className={`${styles.input} ${styles.inputWithIconRight}`} placeholder="mm/dd/yyyy" />
                                <div className={styles.iconRight}>
                                    <Calendar size={16} />
                                </div>
                            </div>
                        </div>
                        <div className={`${styles.formGroup} ${styles.colSpan1}`}>
                            <label className={styles.label}>Premium Size</label>
                            <div className={styles.inputWrapper}>
                                <span className={styles.prefix}>$</span>
                                <input type="text" className={`${styles.input} ${styles.inputWithPrefix}`} placeholder="0.00" />
                            </div>
                        </div>
                        <div className={`${styles.formGroup} ${styles.colSpan1}`}></div>

                        {/* Row 4 */}
                        <div className={`${styles.formGroup} ${styles.colSpan1}`}>
                            <label className={styles.label}>Overall Sum Insured</label>
                            <div className={styles.inputWrapper}>
                                <span className={styles.prefix}>$</span>
                                <input type="text" className={`${styles.input} ${styles.inputWithPrefix}`} placeholder="0.00" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
