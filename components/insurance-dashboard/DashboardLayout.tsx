"use client";

import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="h-screen overflow-hidden bg-slate-50 relative text-slate-900 font-sans">
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            <div className="md:ml-72 h-screen flex flex-col min-h-0">
                <Topbar onMenuClick={() => setIsSidebarOpen(true)} />

                <main className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-4 md:p-6 lg:p-8">
                    <div className="max-w-7xl mx-auto w-full">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
