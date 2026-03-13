"use client";

import React from "react";

export default function PricingPage() {
    return (
        <div className="flex h-full flex-col overflow-y-auto p-8 bg-background text-foreground transition-colors">
            <h1 className="text-2xl font-bold mb-4">Pricing</h1>
            <p className="text-muted-foreground">Manage your subscription and billing.</p>
        </div>
    );
}
