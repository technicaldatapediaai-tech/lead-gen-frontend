"use client";

import React, { useState, useEffect } from 'react';
import styles from './LeadTrend.module.css';
import { MoreVertical } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

const data = [
    { name: 'Jan', leads: 40 },
    { name: 'Feb', leads: 30 },
    { name: 'Mar', leads: 20 },
    { name: 'Apr', leads: 27 },
    { name: 'May', leads: 18 },
    { name: 'Jun', leads: 23 },
    { name: 'Jul', leads: 34 },
    { name: 'Aug', leads: 44 },
    { name: 'Sep', leads: 35 },
    { name: 'Oct', leads: 20 },
    { name: 'Nov', leads: -10 }, // creates the dip shown
    { name: 'Dec', leads: 48 },
];

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
