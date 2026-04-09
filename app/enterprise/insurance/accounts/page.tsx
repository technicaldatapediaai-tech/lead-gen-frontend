"use client";

import React from "react";
import styles from "./page.module.css";
import {
    Building2,
    MapPin,
    Link as LinkIcon,
    Sparkles,
    MoreVertical,
    Settings,
    Edit2,
    UserPlus
} from "lucide-react";

export default function AccountsPage() {
    return (
        <div className={styles.pageContainer}>
            {/* Account Profile Header */}
            <div className={styles.profileHeader}>
                <div className={styles.profileLeft}>
                    <div className={styles.companyLogo}>
                        <div className={styles.logoInner}>
                            <div className={styles.tireIcon}></div>
                        </div>
                    </div>
                    <div className={styles.companyInfo}>
                        <div className={styles.companyTitleRow}>
                            <h1 className={styles.companyName}>Apollo Tyres Ltd</h1>
                            <span className={styles.hotRating}>HOT RATING</span>
                        </div>
                        <div className={styles.companyMetaRow}>
                            <div className={styles.metaItem}>
                                <Building2 size={14} className={styles.metaIcon} />
                                <span>Manufacturing</span>
                            </div>
                            <div className={styles.metaItem}>
                                <MapPin size={14} className={styles.metaIcon} />
                                <span>Gurugram, India</span>
                            </div>
                            <div className={styles.metaItemLink}>
                                <LinkIcon size={14} className={styles.metaIconLink} />
                                <a href="#" className={styles.companyLink}>apollotyres.com</a>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.profileActions}>
                    <button className={styles.btnEnhance}>
                        <Sparkles size={16} />
                        Enhance Profile
                    </button>
                    <button className={styles.btnIconOutline}>
                        <MoreVertical size={16} />
                    </button>
                </div>
            </div>

            {/* KPI Cards Row */}
            <div className={styles.kpiRow}>
                <div className={styles.kpiCard}>
                    <h3 className={styles.kpiTitle}>CONTACTS</h3>
                    <div className={styles.kpiBody}>
                        <span className={styles.kpiValue}>12</span>
                        <span className={styles.kpiTrendUp}>↑ 2</span>
                    </div>
                </div>
                <div className={styles.kpiCard}>
                    <h3 className={styles.kpiTitle}>ACTIVE LEADS</h3>
                    <div className={styles.kpiBody}>
                        <span className={styles.kpiValue}>5</span>
                        <span className={styles.kpiTrendNeutral}>No change</span>
                    </div>
                </div>
                <div className={styles.kpiCard}>
                    <h3 className={styles.kpiTitle}>OPPORTUNITIES</h3>
                    <div className={styles.kpiBody}>
                        <span className={styles.kpiValue}>3</span>
                        <span className={styles.kpiTrendBlue}>$4.2M Value</span>
                    </div>
                </div>
                <div className={styles.kpiCard}>
                    <h3 className={styles.kpiTitle}>MARKET CAP</h3>
                    <div className={styles.kpiBody}>
                        <span className={styles.kpiValue}>$2.3B</span>
                    </div>
                </div>
            </div>

            <div className={styles.splitLayout}>
                {/* Left Column (Quick Info, News) */}
                <div className={styles.leftColumn}>
                    <div className={styles.sectionCard}>
                        <h3 className={styles.sectionHeader}>Quick Information</h3>
                        <div className={styles.cardBody}>
                            <div className={styles.infoGroup}>
                                <label>Website</label>
                                <p>www.apollotyres.com</p>
                            </div>
                            <div className={styles.infoGroup}>
                                <label>Main Phone</label>
                                <p>+91-124-2383002</p>
                            </div>
                            <div className={styles.infoGroup}>
                                <label>Industry</label>
                                <p>Auto Components & Tyres</p>
                            </div>
                            <div className={styles.infoGroup}>
                                <label>Account Owner</label>
                                <div className={styles.ownerBlock}>
                                    <div className={styles.avatarSmallBlue}>JD</div>
                                    <span>Jane Doe</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={styles.sectionCard}>
                        <div className={styles.sectionHeaderWithIcon}>
                            <h3>News Alerts</h3>
                            <Settings size={16} className={styles.iconMuted} />
                        </div>
                        <div className={styles.newsSourceRow}>
                            <div className={styles.googleIcon}>G</div>
                            <a href="#" className={styles.newsLink}>https://google.com/alerts/apollo-tyres</a>
                        </div>

                        <div className={styles.newsList}>
                            <div className={styles.newsItem}>
                                <span className={styles.newsTagBlue}>FINANCIAL NEWS</span>
                                <h4 className={styles.newsTitle}>Apollo Tyres reports 20% growth in Q3 profits</h4>
                                <p className={styles.newsExcerpt}>The company attributed the growth to strong demand in the replacement market and expandi...</p>
                            </div>
                            <div className={styles.newsItem}>
                                <span className={styles.newsTagBlue}>EXPANSION</span>
                                <h4 className={styles.newsTitle}>New R&D center announced in Germany</h4>
                                <p className={styles.newsExcerpt}>Focusing on EV-specific tyre technology, the new facility will house 200 engineers...</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className={styles.rightColumn}>
                    {/* Tabs */}
                    <div className={styles.tabsMenu}>
                        <button className={`${styles.tabBtn} ${styles.activeTab}`}>Account Details</button>
                        <button className={styles.tabBtn}>Account Team</button>
                        <button className={styles.tabBtn}>Related Objects</button>
                        <button className={styles.tabBtn}>Engagement Map</button>
                    </div>

                    {/* Entity Information Card */}
                    <div className={styles.sectionCardLarge}>
                        <div className={styles.collapseHeader}>
                            <div className={styles.collapseLeft}>
                                <span className={styles.chevronIcon}>v</span>
                                <h3>Entity Information</h3>
                            </div>
                            <button className={styles.btnEditText}>
                                <Edit2 size={12} />
                                Edit All
                            </button>
                        </div>

                        <div className={styles.grid2Col}>
                            <div className={styles.infoGroup}>
                                <label>Company Identification Number (CIN)</label>
                                <p className={styles.textDark}>L25111DL1972PLC006049</p>
                            </div>
                            <div className={styles.infoGroup}>
                                <label>GST Identification Number</label>
                                <p className={styles.textDark}>06AABCA0554G1Z1</p>
                            </div>
                            <div className={styles.infoGroup}>
                                <label>PAN Number</label>
                                <p className={styles.textDark}>AABCA0554G</p>
                            </div>
                            <div className={styles.infoGroup}>
                                <label>Annual Revenue</label>
                                <p className={styles.textLink}>$2,300,000,000</p>
                            </div>
                            <div className={styles.infoGroup}>
                                <label>Employee Count</label>
                                <p className={styles.textDark}>18,500+</p>
                            </div>
                            <div className={styles.infoGroup}>
                                <label>Registered Address</label>
                                <p className={styles.textDark}>7, Institutional Area, Sector 32,<br />Gurugram, Haryana</p>
                            </div>
                        </div>
                    </div>

                    {/* Account Team Card */}
                    <div className={styles.sectionHeaderRow}>
                        <div className={styles.titleWithCount}>
                            <h2>Account Team</h2>
                            <span className={styles.badgeCount}>4 MEMBERS</span>
                        </div>
                        <button className={styles.btnOutline}>
                            <UserPlus size={16} />
                            Add Team Members
                        </button>
                    </div>

                    <div className={styles.tableCard}>
                        <table className={styles.teamTable}>
                            <thead>
                                <tr>
                                    <th>MEMBER NAME</th>
                                    <th>ROLE</th>
                                    <th>ACCOUNT ACCESS</th>
                                    <th>CONTACT ACCESS</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <div className={styles.memberCell}>
                                            <div className={styles.avatarSmallBlue}>JD</div>
                                            <div className={styles.memberNameBox}>
                                                <span className={styles.memberName}>Jane Doe</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td>Sales Owner 1</td>
                                    <td><span className={styles.accessBadgeGreen}>READ/WRITE</span></td>
                                    <td>Read Only</td>
                                    <td><ChevronRight size={16} className={styles.iconMuted} /></td>
                                </tr>
                                <tr>
                                    <td>
                                        <div className={styles.memberCell}>
                                            <div className={styles.avatarSmallPurple}>MS</div>
                                            <div className={styles.memberNameBox}>
                                                <span className={styles.memberName}>Mark Stevens</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td>Solution Architect</td>
                                    <td><span className={styles.accessBadgeGrey}>READ ONLY</span></td>
                                    <td>Private</td>
                                    <td><ChevronRight size={16} className={styles.iconMuted} /></td>
                                </tr>
                                <tr>
                                    <td>
                                        <div className={styles.memberCell}>
                                            <div className={styles.avatarSmallOrange}>KL</div>
                                            <div className={styles.memberNameBox}>
                                                <span className={styles.memberName}>Kate Lin</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td>Customer Success</td>
                                    <td><span className={styles.accessBadgeGreen}>READ/WRITE</span></td>
                                    <td>Read Only</td>
                                    <td><ChevronRight size={16} className={styles.iconMuted} /></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Sub Tabs */}
                    <div className={styles.subTabsContainer}>
                        <button className={`${styles.subTabBtn} ${styles.activeSubTab}`}>Contacts (12)</button>
                        <button className={styles.subTabBtn}>Opportunities (3)</button>
                        <button className={styles.subTabBtn}>Leads (5)</button>
                    </div>

                    {/* Contacts Section */}
                    <div className={styles.contactsSection}>
                        <div className={styles.contactsHeader}>
                            <h3>Primary Contacts</h3>
                            <button className={styles.linkTextButton}>View All Contacts</button>
                        </div>

                        <div className={styles.contactsGrid}>
                            <div className={styles.contactCard}>
                                <div className={styles.avatarMediumGrey}>
                                    <User size={16} />
                                </div>
                                <div className={styles.contactCardInfo}>
                                    <h4>Satish Sharma</h4>
                                    <p>Whole Time Director</p>
                                </div>
                            </div>
                            <div className={styles.contactCard}>
                                <div className={styles.avatarMediumGrey}>
                                    <User size={16} />
                                </div>
                                <div className={styles.contactCardInfo}>
                                    <h4>Gaurav Kumar</h4>
                                    <p>Head of Procurement</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

// Simple internal icon component since lucide icon "ChevronRight" was missing from import list playfully
const ChevronRight = ({ size, className }: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m9 18 6-6-6-6" /></svg>
);
const User = ({ size, className }: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
);
