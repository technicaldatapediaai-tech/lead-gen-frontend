"use client";

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/context/community/CartContext';
import './Navbar.css';

interface NavbarProps {
    onSearch: (query: string) => void;
    onRegisterClick?: () => void;
    onSoftwareClick?: () => void;
    isDetailView?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ onSearch, onRegisterClick, onSoftwareClick, isDetailView }) => {
    const { cartCount, setIsCartOpen } = useCart();

    return (
        <header className="community-navbar">
            <div className="navbar-container">
                <div className="navbar-left">
                    <Link href="/" className="logo-wrap" style={{ textDecoration: 'none' }}>
                        <span className="logo-text-primary">Leadnius</span>
                        <span className="logo-text-secondary">Community</span>
                    </Link>
                    
                    <div className="search-bar">
                        <i className="fas fa-search"></i>
                        <input
                            type="text"
                            placeholder="Search products (⌘+k)"
                            onChange={(e) => onSearch(e.target.value)}
                        />
                    </div>
                </div>

                <nav className="navbar-center">
                    <Link href="/" className="nav-link">Home</Link>
                    <button
                        className="nav-link"
                        onClick={() => onSoftwareClick?.()}
                    >
                        Software
                    </button>
                    <span className="nav-link">New Arrival</span>
                    <span className="nav-link">Collaborate</span>
                </nav>

                <div className="navbar-right">
                    <div className="cart-icon-wrap" onClick={() => setIsCartOpen(true)}>
                        <div className="cart-icon-inner">
                            <i className="fas fa-shopping-cart"></i>
                            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                        </div>
                        <span className="cart-text">CART</span>
                    </div>
                    <button className="btn-register" onClick={onRegisterClick}>Register Now</button>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
