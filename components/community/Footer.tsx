"use client";

import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="community-footer">
            <div className="footer-content">
                <div className="footer-brand">
                    <span className="logo-text-primary">Leadnius</span>
                    <span className="logo-text-secondary">Community</span>
                </div>
                <div className="footer-links">
                    <span className="footer-link">Terms</span>
                    <span className="footer-link">Privacy</span>
                    <span className="footer-link">Contact</span>
                </div>
                <div className="footer-copyright">
                    © 2026 Leadnius Inc. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
