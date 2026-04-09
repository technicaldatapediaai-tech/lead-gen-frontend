"use client";

import React from 'react';

const Docs: React.FC = () => {
    return (
        <div className="docs-page">
            <h1 className="docs-title">Leadnius Documentation</h1>
            <p className="docs-text">Learn how to extract, enrich, and engage leads using our community-curated software stack.</p>
            <div className="docs-sections">
                <div className="docs-card">
                    <h3>Getting Started</h3>
                    <p>Quick start guide for new community members.</p>
                </div>
                <div className="docs-card">
                    <h3>API Reference</h3>
                    <p>Integrate our lead generation tools into your workflow.</p>
                </div>
            </div>
        </div>
    );
};

export default Docs;
