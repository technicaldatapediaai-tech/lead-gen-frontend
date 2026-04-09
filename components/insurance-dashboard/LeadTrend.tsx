"use client";

import React, { useState, useEffect } from 'react';
import styles from './LeadTrend.module.css';
import { MoreVertical } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

const data: any[] = [];

const LeadTrend = () => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <div className={`card ${styles.widget}`}>
            <div className={styles.header}>
                <h3 className={styles.title}>Lead Creation Trend</h3>
                <div className={styles.headerRight}>
                    <div className={styles.legend}>
                        <span className={styles.legendDot}></span>
                        <span className={styles.legendText}>CURRENT YEAR</span>
                    </div>
                    <button className={styles.iconButton}>
                        <MoreVertical size={20} />
                    </button>
                </div>
            </div>

            <div className={styles.content}>
                {mounted && (
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                            <Line
                                type="monotone"
                                dataKey="leads"
                                stroke="#2563eb"
                                strokeWidth={4}
                                dot={false}
                                activeDot={{ r: 6, fill: '#2563eb', stroke: '#fff', strokeWidth: 2 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
};

export default LeadTrend;
