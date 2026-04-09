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
    X,
    Settings
} from 'lucide-react';

interface SidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
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
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-slate-900/50 z-40 md:hidden backdrop-blur-sm transition-opacity duration-300"
                    onClick={onClose}
                />
            )}

            <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
                <div className={styles.logoContainer}>
                    <div className="flex items-center gap-3 flex-1">
                        <div className={styles.logoIcon}>
                            <Shield size={24} />
                        </div>
                        <div className={styles.logoTextDiv}>
                            <span className={styles.logoText}>INSURANCE TECH</span>
                            <span className={styles.logoSubText}>ELITE PORTAL</span>
                        </div>
                    </div>
                    
                    {/* Close button for mobile */}
                    <button 
                        onClick={onClose}
                        className="p-2 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100 md:hidden"
                    >
                        <X size={20} />
                    </button>
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
                                    onClick={() => {
                                        if (window.innerWidth < 768 && onClose) {
                                            onClose();
                                        }
                                    }}
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
        </>
    );
};

export default Sidebar;
