import React from 'react';
import styles from './OpportunityPipeline.module.css';
import { MoreVertical } from 'lucide-react';

const funnelData: any[] = [];

const OpportunityPipeline = () => {
    return (
        <div className={`card ${styles.widget}`}>
            <div className={styles.header}>
                <h3 className={styles.title}>Opportunity Pipeline</h3>
                <button className={styles.iconButton}>
                    <MoreVertical size={20} />
                </button>
            </div>

            <div className={styles.content}>
                <div className={styles.funnelContainer}>
                    {funnelData.map((item) => (
                        <div
                            key={item.stage}
                            className={styles.funnelStep}
                            style={{
                                width: item.width,
                                backgroundColor: item.color
                            }}
                        >
                            <span className={styles.stepText}>
                                {item.stage} ({item.percentage}%)
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default OpportunityPipeline;
