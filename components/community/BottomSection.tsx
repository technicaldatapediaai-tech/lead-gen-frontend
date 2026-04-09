"use client";

import React from 'react';

interface BottomSectionProps {
    onRegisterClick: () => void;
}

const BottomSection: React.FC<BottomSectionProps> = ({ onRegisterClick }) => {
    return (
        <section className="bottom-section">
            <div className="card-collaborate">
                <span className="badge-alpha">COMMUNITY ALPHA</span>
                <h3>Collaborate with the Community</h3>
                <p>
                    Share insights, request reviews, and find strategic partners for your next big software deployment.
                </p>
                <button className="btn-white" onClick={onRegisterClick}>Join Leadnius Community</button>
            </div>
            <div className="card-ai-matching">
                <div className="sparkle-icon"><i className="fas fa-sparkles"></i></div>
                <h3>AI Matching</h3>
                <p>
                    Let our proprietary algorithm find the exact alternative to your expensive subscription stack.
                </p>
                <div className="matching-status">
                    <div className="user-avatars">
                        <img src="https://i.pravatar.cc/32?u=1" alt="User" />
                        <img src="https://i.pravatar.cc/32?u=2" alt="User" />
                        <span className="avatar-more">+2k</span>
                    </div>
                    <span>Matching now</span>
                </div>
            </div>
        </section>
    );
};

export default BottomSection;
