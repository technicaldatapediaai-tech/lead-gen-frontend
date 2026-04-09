"use client";

import React from 'react';

const Social: React.FC = () => {
    return (
        <div className="community-social">
            <h3>Join the Conversation</h3>
            <div className="social-links">
                <div className="social-link">
                    <i className="fab fa-twitter"></i>
                    <span>Twitter</span>
                </div>
                <div className="social-link">
                    <i className="fab fa-discord"></i>
                    <span>Discord</span>
                </div>
                <div className="social-link">
                    <i className="fab fa-linkedin"></i>
                    <span>LinkedIn</span>
                </div>
            </div>
        </div>
    );
};

export default Social;
