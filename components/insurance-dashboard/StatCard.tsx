import React from 'react';
import styles from './StatCard.module.css';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
    title: string;
    value: string;
    trend?: string;
    trendType?: 'up' | 'down';
    icon: React.ReactNode;
    iconBgColor: string;
}

const StatCard = ({ title, value, trend, trendType, icon, iconBgColor }: StatCardProps) => {
    return (
        <div className={`card ${styles.statCard}`}>
            <div className={styles.header}>
                <div
                    className={styles.iconWrapper}
                    style={{ backgroundColor: iconBgColor }}
                >
                    {icon}
                </div>
                {trend && (
                    <div className={`${styles.badge} ${trendType === 'up' ? styles.badgeSuccess : styles.badgeDanger}`}>
                        {trend}
                        {trendType === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                    </div>
                )}
            </div>

            <div className={styles.content}>
                <p className={styles.title}>{title}</p>
                <h3 className={styles.value}>{value}</h3>
            </div>
        </div>
    );
};

export default StatCard;
