"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import styles from './Header.module.css';
import { Search, Bell, Settings, MessageSquare } from 'lucide-react';

const Header = () => {
    const pathname = usePathname();

    // Determine title based on current path
    let headerTitle = "";
    if (pathname === '/enterprise/insurance/leads') {
        headerTitle = "Lead Intelligence";
    } else if (pathname === '/enterprise/insurance/leads/new') {
        headerTitle = "New Lead";
    }

    return (
        <header className={styles.header}>
            <div className={styles.leftSection}>
                {headerTitle && <h2 className={styles.headerTitle}>{headerTitle}</h2>}
                <div className={styles.searchContainer}>
                    <Search size={18} className={styles.searchIcon} />
                    <input
                        type="text"
                        placeholder="Search leads, companies..."
                        className={styles.searchInput}
                    />
                </div>
            </div>

            <div className={styles.actionsContainer}>
                <button className={styles.iconButton}>
                    <Bell size={20} />
                    <span className={styles.notificationDot}></span>
                </button>
                <button className={styles.iconButton}>
                    <Settings size={20} />
                </button>
                <button className={styles.iconButton}>
                    <MessageSquare size={20} />
                </button>

                <div className={styles.divider}></div>

                <div className={styles.userProfile}>
                    <div className={styles.userAvatar}>
                        <div className={styles.avatarFallback}>AS</div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
