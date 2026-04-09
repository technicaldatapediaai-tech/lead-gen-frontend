import React from 'react';
import styles from './LeadsByStage.module.css';
import { MoreVertical } from 'lucide-react';

const data: any[] = [];

const LeadsByStage = () => {
    return (
        <div className={`card ${styles.widget}`}>
            <div className={styles.header}>
                <h3 className={styles.title}>Leads by Stage</h3>
                <button className={styles.iconButton}>
                    <MoreVertical size={20} />
                </button>
            </div>

            <div className={styles.content}>
                {data.map((item) => (
                    <div key={item.stage} className={styles.barContainer}>
                        <div className={styles.barLabelGroup}>
                            <span className={styles.barLabel}>{item.stage}</span>
                            <span className={styles.barValue}>{item.percentage}%</span>
                        </div>
                        <div className={styles.barTrack}>
                            <div
                                className={styles.barFill}
                                style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
                            ></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LeadsByStage;
