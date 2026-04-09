"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Sidebar.module.css';
import {
    LayoutDashboard,
    Users,
    BriefcaseBusiness,
    Building2,
    CalendarDays,
    HelpCircle,
    Shield,
    Settings
} from 'lucide-react';

const Sidebar = () => {
    const pathname = usePathname();

    const menuItems = [
        { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/enterprise/insurance' },
        { name: 'Leads', icon: <Users size={20} />, path: '/enterprise/insurance/leads' },
        { name: 'Opportunities', icon: <BriefcaseBusiness size={20} />, path: '/enterprise/insurance/opportunities' },
        { name: 'Accounts', icon: <Building2 size={20} />, path: '/enterprise/insurance/accounts' },
        { name: 'Activities', icon: <CalendarDays size={20} />, path: '/enterprise/insurance/activities' },
        { name: 'Support', icon: <HelpCircle size={20} />, path: '/enterprise/insurance/support' },
    ];

    const bottomItems: { name: string; icon: React.ReactNode; path: string }[] = [];

    return (
        <aside className={styles.sidebar}>
            <div className={styles.logoContainer}>
                <div className={styles.logoIcon}>
                    <Shield size={24} />
                </div>
                <div className={styles.logoTextDiv}>
                    <span className={styles.logoText}>INSURANCE TECH</span>
                    <span className={styles.logoSubText}>ELITE PORTAL</span>
                </div>
            </div>

            <nav className={styles.menu}>
                <div className={styles.menuHeader}>MENU</div>
                <ul className={styles.menuList}>
                    {menuItems.map((item) => {
                        const isActive = pathname === item.path || (item.path !== '/' && pathname.startsWith(item.path));
                        return (
                            <li key={item.name}>
                                <Link
                                    href={item.path}
                                    className={`${styles.menuItem} ${isActive ? styles.active : ''}`}
                                >
                                    <span className={styles.icon}>{item.icon}</span>
                                    <span className={styles.text}>{item.name}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            <div className={styles.bottomSection}>
                <div className={styles.userProfile}>
                    <div className={styles.userAvatar}>
                        D
                    </div>
                    <div className={styles.userInfo}>
                        <p className={styles.userName}>Dheeraj Sorout</p>
                        <Link href="/profile" className={styles.viewProfile}>View Profile</Link>
                    </div>
                    <button className={styles.settingsBtn}>
                        <Settings size={18} />
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
