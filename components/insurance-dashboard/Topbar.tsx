"use client";

import React, { useState } from "react";
import {
    Search,
    Bell,
    CalendarDays,
    Menu,
    ChevronDown,
} from "lucide-react";

interface TopbarProps {
    onMenuClick: () => void;
}

export default function Topbar({ onMenuClick }: TopbarProps) {
    const [isDateMenuOpen, setIsDateMenuOpen] = useState(false);
    const [selectedDateFilter, setSelectedDateFilter] = useState("Last 30 Days");

    const dateFilters = ["Today", "Last 7 Days", "Last 30 Days", "This Quarter", "This Year"];

    return (
        <header className="shrink-0 sticky top-0 z-30 flex items-center justify-between h-16 px-4 py-2 bg-white/80 backdrop-blur border-b border-slate-200 shadow-sm md:px-6">
            {/* Left side: Hamburger (mobile only) + Search */}
            <div className="flex items-center gap-4 flex-1">
                <button
                    onClick={onMenuClick}
                    className="p-2 -ml-2 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100 md:hidden focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    <Menu className="w-5 h-5" />
                </button>

                <div className="relative max-w-md w-full hidden sm:block">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Search className="w-4 h-4 text-slate-400" />
                    </div>
                    <input
                        type="text"
                        className="block w-full py-2 pl-10 pr-3 text-sm text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow"
                        placeholder="Search leads, accounts, opportunities..."
                    />
                </div>
            </div>

            {/* Right side: Date Filter + Icons */}
            <div className="flex items-center gap-2 md:gap-4 ml-auto">
                {/* Date Filter Dropdown */}
                <div className="relative">
                    <button
                        onClick={() => setIsDateMenuOpen(!isDateMenuOpen)}
                        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors shadow-sm"
                    >
                        <CalendarDays className="w-4 h-4 text-slate-500" />
                        <span className="hidden sm:inline-block">{selectedDateFilter}</span>
                        <ChevronDown className="w-4 h-4 text-slate-500" />
                    </button>

                    {isDateMenuOpen && (
                        <div className="absolute right-0 z-50 w-48 mt-2 origin-top-right bg-white border border-slate-200 rounded-xl shadow-lg ring-1 ring-black/5 focus:outline-none">
                            <div className="p-1">
                                {dateFilters.map((filter) => (
                                    <button
                                        key={filter}
                                        onClick={() => {
                                            setSelectedDateFilter(filter);
                                            setIsDateMenuOpen(false);
                                        }}
                                        className={`block w-full px-4 py-2 text-sm text-left rounded-lg transition-colors ${selectedDateFilter === filter
                                            ? "bg-indigo-50 text-indigo-700 font-medium"
                                            : "text-slate-700 hover:bg-slate-100"
                                            }`}
                                    >
                                        {filter}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Notifications */}
                <button className="relative p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    <span className="absolute top-1.5 right-1.5 block w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
                    <Bell className="w-5 h-5" />
                </button>
            </div>
        </header>
    );
}
