import React from 'react';
import Link from 'next/link';
import styles from './LeadsTable.module.css';
import { Eye } from 'lucide-react';

import { mockLeads } from '@/data/insurance/leads';
const LeadsTable = () => {
    return (
        <div className={styles.tableContainer}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>LEAD NAME</th>
                        <th>COMPANY</th>
                        <th>LEAD SOURCE</th>
                        <th>LEAD TYPE</th>
                        <th>ASSIGNED TO</th>
                        <th>STATUS</th>
                        <th>DUE DATE</th>
                        <th>ACTIONS</th>
                    </tr>
                </thead>
                <tbody>
                    {mockLeads.map((lead) => (
                        <tr key={lead.id}>
                            <td className={styles.leadNameCell}>
                                <span className={styles.leadName}>{lead.leadName}</span>
                            </td>
                            <td>
                                <span className={styles.companyText}>{lead.company}</span>
                            </td>
                            <td className={styles.lightText}>{lead.source}</td>
                            <td>
                                <span className={styles.typeTag}>{lead.type}</span>
                            </td>
                            <td>
                                <div className={styles.assigneeContainer}>
                                    <div
                                        className={styles.avatar}
                                        style={{ backgroundColor: lead.assignedTo.color + '33', color: lead.assignedTo.color }}
                                    >
                                        {lead.assignedTo.initials}
                                    </div>
                                    <span className={styles.assigneeName}>{lead.assignedTo.name}</span>
                                </div>
                            </td>
                            <td>
                                <span className={`${styles.statusBadge} ${styles[lead.status.replace(/\s+/g, '')]}`}>
                                    {lead.status}
                                </span>
                            </td>
                            <td>
                                <div className={styles.dateBlock}>
                                    <span>{lead.dueDate.split(' ')[0]} {lead.dueDate.split(' ')[1]}</span>
                                    <span className={styles.yearText}>{lead.dueDate.split(' ')[2]}</span>
                                </div>
                            </td>
                            <td>
                                <div className={styles.actions}>
                                    <Link href={`/leads/${lead.id}`} className={styles.actionBtn}>
                                        <Eye size={16} />
                                        <span>View</span>
                                    </Link>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className={styles.pagination}>
                <span className={styles.showingText}>Showing 2 of 328 leads</span>
                <div className={styles.pageControls}>
                    <button className={styles.pageBtn}>&lt;</button>
                    <button className={`${styles.pageBtn} ${styles.activePage}`}>1</button>
                    <button className={styles.pageBtn}>2</button>
                    <button className={styles.pageBtn}>3</button>
                    <button className={styles.pageBtn}>&gt;</button>
                </div>
            </div>
        </div>
    );
};

export default LeadsTable;
