import React from 'react';
import styles from './KPICard.module.css';

interface KPICardProps {
    title: string;
    value: string;
    isActive?: boolean;
    valueColor?: string;
}

const KPICard = ({ title, value, isActive = false, valueColor }: KPICardProps) => {
    return (
        <div className={`${styles.kpiCard} ${isActive ? styles.activeCard : ''}`}>
            <h4 className={`${styles.title} ${isActive ? styles.activeTitle : ''}`}>
                {title}
            </h4>
            <div
                className={styles.value}
                style={{ color: valueColor || 'inherit' }}
            >
                {value}
            </div>
        </div>
    );
};

export default KPICard;
