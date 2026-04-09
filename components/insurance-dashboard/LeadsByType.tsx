"use client";

import React, { useState, useEffect } from 'react';
import styles from './LeadsByType.module.css';
import { MoreVertical } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const data = [
    { name: 'Fresh Lead', value: 40, color: '#2563eb' },
    { name: 'Own Renewal', value: 25, color: '#10b981' },
    { name: 'Lost Renewal', value: 20, color: '#f59e0b' },
    { name: 'Broker Network', value: 15, color: '#94a3b8' },
];

const LeadsByType = () => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <div className={`card ${styles.widget}`}>
            <div className={styles.header}>
                <h3 className={styles.title}>Leads by Type</h3>
                <button className={styles.iconButton}>
                    <MoreVertical size={20} />
                </button>
            </div>

            <div className={styles.content}>
                <div className={styles.chartContainer}>
                    {mounted && (
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius="75%"
                                    outerRadius="100%"
                                    stroke="none"
                                    paddingAngle={2}
                                    dataKey="value"
                                    startAngle={90}
                                    endAngle={-270}
                                >
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                    )}
                    <div className={styles.centerText}>
                        <div className={styles.totalValue}>328</div>
                        <div className={styles.totalLabel}>TOTAL</div>
                    </div>
                </div>

                <div className={styles.legend}>
                    {data.map((item) => (
                        <div key={item.name} className={styles.legendItem}>
                            <div
                                className={styles.legendColor}
                                style={{ backgroundColor: item.color }}
                            ></div>
                            <span className={styles.legendText}>
                                {item.name} ({item.value}%)
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LeadsByType;
