"use client";

import React from "react";
import styles from "./page.module.css";
import { ChevronRight, Info, Shield, BarChart2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NewLeadPage() {
    const router = useRouter();

    return (
        <div className={styles.pageContainer}>
            <div className={styles.pageHeader}>
                <div className={styles.breadcrumb}>
                    <Link href="/enterprise/insurance/leads" className={styles.breadcrumbLink}>Leads</Link>
                    <ChevronRight size={16} className={styles.breadcrumbSeparator} />
                    <span className={styles.breadcrumbCurrent}>New Lead</span>
                </div>

                <div className={styles.titleRow}>
                    <h1 className={styles.pageTitle}>New Lead</h1>
                    <div className={styles.actionButtons}>
                        <button className={styles.cancelButton} onClick={() => router.push('/leads')}>Cancel</button>
                        <button className={styles.saveButton}>Save Lead</button>
                    </div>
                </div>
            </div>

            <div className={styles.formContainer}>
                {/* Section 1: Lead Information */}
                <section className={styles.formSection}>
                    <div className={styles.sectionHeader}>
                        <div className={styles.sectionIconWrapper} style={{ backgroundColor: "#eff6ff", color: "#2563eb" }}>
                            <Info size={18} />
                        </div>
                        <h2 className={styles.sectionTitle}>Lead Information</h2>
                    </div>

                    <div className={styles.sectionBody}>
                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>
                                    LEAD SOURCE <span className={styles.required}>*</span>
                                </label>
                                <select className={styles.formSelect} defaultValue="Select Source">
                                    <option disabled>Select Source</option>
                                    <option>Website</option>
                                    <option>Referral</option>
                                    <option>Cold Call</option>
                                </select>
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>
                                    BROKER BUSINESS LOCATION <span className={styles.required}>*</span>
                                </label>
                                <select className={styles.formSelect} defaultValue="Select Location">
                                    <option disabled>Select Location</option>
                                    <option>London</option>
                                    <option>New York</option>
                                    <option>Singapore</option>
                                </select>
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>
                                    LEAD TYPE <span className={styles.required}>*</span>
                                </label>
                                <select className={styles.formSelect} defaultValue="Select Type">
                                    <option disabled>Select Type</option>
                                    <option>Corporate</option>
                                    <option>Individual</option>
                                    <option>SME</option>
                                </select>
                            </div>
                        </div>

                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>
                                    CLIENT NAME <span className={styles.required}>*</span>
                                </label>
                                <input type="text" className={styles.formInput} placeholder="Legal entity name" />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>
                                    CONTACT NAME <span className={styles.required}>*</span>
                                </label>
                                <input type="text" className={styles.formInput} placeholder="Primary contact person" />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>DESIGNATION</label>
                                <input type="text" className={styles.formInput} placeholder="e.g. Managing Director" />
                            </div>
                        </div>

                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>EMAIL</label>
                                <input type="email" className={styles.formInput} placeholder="email@example.com" />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>PHONE</label>
                                <input type="tel" className={styles.formInput} placeholder="+44 20 XXXX XXXX" />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>CITY</label>
                                <input type="text" className={styles.formInput} placeholder="City" />
                            </div>
                        </div>

                        <div className={styles.formRow3}>
                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>STREET ADDRESS</label>
                                <input type="text" className={styles.formInput} placeholder="Street" />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>POSTAL CODE</label>
                                <input type="text" className={styles.formInput} placeholder="Postcode" />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>COUNTRY</label>
                                <input type="text" className={styles.formInput} placeholder="Country" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Section 2: Insurance Details */}
                <section className={styles.formSection}>
                    <div className={`${styles.sectionHeader} ${styles.sectionHeaderWithBadge}`}>
                        <div className={styles.sectionHeaderLeft}>
                            <div className={styles.sectionIconWrapper} style={{ backgroundColor: "#eff6ff", color: "#2563eb" }}>
                                <Shield size={18} />
                            </div>
                            <h2 className={styles.sectionTitle}>Insurance Details</h2>
                        </div>
                        <span className={styles.optionalBadge}>OPTIONAL</span>
                    </div>

                    <div className={styles.sectionBody}>
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>PRODUCT INTEREST</label>
                            <div className={styles.searchWrapper}>
                                <input
                                    type="text"
                                    className={`${styles.formInput} ${styles.inputWithIcon}`}
                                    placeholder="Search insurance products (e.g. Professional Indemnity)..."
                                />
                                <svg className={styles.inputSearchIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>NOTES / DESCRIPTION</label>
                            <textarea
                                className={styles.formTextarea}
                                placeholder="Enter any specific requirements or lead background..."
                            ></textarea>
                        </div>
                    </div>
                </section>

                {/* Section 3: Lead Source Tracking */}
                <section className={styles.formSection}>
                    <div className={styles.sectionHeader}>
                        <div className={styles.sectionIconWrapper} style={{ backgroundColor: "#eff6ff", color: "#2563eb" }}>
                            <BarChart2 size={18} />
                        </div>
                        <h2 className={styles.sectionTitle}>Lead Source Tracking</h2>
                    </div>

                    <div className={styles.sectionBody}>
                        <div className={styles.formRow2}>
                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>LEAD SOURCE DETAIL</label>
                                <input type="text" className={styles.formInput} placeholder="Specific campaign name or event" />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>REFERRED BY</label>
                                <div className={styles.searchWrapper}>
                                    <input
                                        type="text"
                                        className={`${styles.formInput} ${styles.inputWithIconRight}`}
                                        placeholder="Search internal contact..."
                                    />
                                    <svg className={styles.inputSearchIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M20 21V19C20 17.8954 19.1046 17 18 17H6C4.89543 17 4 17.8954 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

            </div>
        </div>
    );
}
