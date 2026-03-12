"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";

// Types matching backend responses

interface DashboardStats {
    total_leads: number;
    qualified_leads: number;
    active_campaigns: number;
    response_rate: string;
    pending_tasks: number;
    lead_stats: {
        total: number;
        qualified: number;
        by_status: Record<string, number>;
        by_source: Record<string, number>;
    };
    message_stats: Record<string, number>;
    email_productivity: {
        total_sent: number;
        total_limit: number;
        accounts_active: number;
    };
}

interface ActivityItem {
    id: string;
    action: string;
    entity_type: string;
    entity_id: string;
    details: Record<string, unknown>;
    created_at: string;
    user_id: string;
}

interface ChartData {
    labels: string[];
    data: number[];
    total: number;
}

// Hook for dashboard statistics
export function useDashboardStats() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchStats() {
            setIsLoading(true);
            const { data, error: apiError } = await api.get<DashboardStats>("/api/dashboard/stats");

            if (apiError) {
                setError(apiError.detail);
                setStats(null);
            } else {
                setStats(data || null);
                setError(null);
            }
            setIsLoading(false);
        }

        fetchStats();
    }, []);

    return { stats, isLoading, error };
}

// Hook for recent activity
export function useDashboardActivity(limit: number = 10) {
    const [activities, setActivities] = useState<ActivityItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchActivity() {
            setIsLoading(true);
            const { data, error: apiError } = await api.get<{ items: ActivityItem[]; total: number }>(
                `/api/dashboard/activity?limit=${limit}`
            );

            if (apiError) {
                setError(apiError.detail);
                setActivities([]);
            } else {
                setActivities(data?.items || []);
                setError(null);
            }
            setIsLoading(false);
        }

        fetchActivity();
    }, [limit]);

    return { activities, isLoading, error };
}

// Hook for chart data
export function useDashboardChart(days: number = 7) {
    const [chartData, setChartData] = useState<ChartData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchChartData() {
            setIsLoading(true);
            const { data, error: apiError } = await api.get<ChartData>(
                `/api/dashboard/chart?days=${days}`
            );

            if (apiError) {
                setError(apiError.detail);
                setChartData(null);
            } else {
                setChartData(data || null);
                setError(null);
            }
            setIsLoading(false);
        }

        fetchChartData();
    }, [days]);

    return { chartData, isLoading, error };
}

// Hook for campaigns list
interface Campaign {
    id: string;
    name: string;
    status: string;
    channel: string;
    created_at: string;
    leads_count: number;
    sent_count: number;
    reply_rate: number;
}

export function useCampaigns(status?: string) {
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchCampaigns() {
            setIsLoading(true);
            const endpoint = status
                ? `/api/campaigns?status=${status}`
                : "/api/campaigns";
            const { data, error: apiError } = await api.get<{ items: Campaign[]; total: number }>(endpoint);

            if (apiError) {
                setError(apiError.detail);
                setCampaigns([]);
            } else {
                setCampaigns(data?.items || []);
                setError(null);
            }
            setIsLoading(false);
        }

        fetchCampaigns();
    }, [status]);

    return { campaigns, isLoading, error };
}

// Hook for leads
interface Lead {
    id: string;
    email: string;
    first_name?: string;
    last_name?: string;
    company?: string;
    title?: string;
    score: number;
    status: string;
    source: string;
    created_at: string;
}

export function useLeads(filters?: { status?: string; source?: string; campaign_id?: string }) {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [total, setTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchLeads() {
            setIsLoading(true);
            const params = new URLSearchParams();
            if (filters?.status) params.append("status", filters.status);
            if (filters?.source) params.append("source", filters.source);
            if (filters?.campaign_id) params.append("campaign_id", filters.campaign_id);

            const endpoint = `/api/leads${params.toString() ? `?${params}` : ""}`;
            const { data, error: apiError } = await api.get<{ items: Lead[]; total: number }>(endpoint);

            if (apiError) {
                setError(apiError.detail);
                setLeads([]);
                setTotal(0);
            } else {
                setLeads(data?.items || []);
                setTotal(data?.total || 0);
                setError(null);
            }
            setIsLoading(false);
        }

        fetchLeads();
    }, [filters?.status, filters?.source, filters?.campaign_id]);

    return { leads, total, isLoading, error };
}

// Hook for user's organizations
interface Organization {
    id: string;
    name: string;
    domain?: string;
    industry?: string;
    role: string;
    is_active: boolean;
}

export function useOrganizations() {
    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [currentOrgId, setCurrentOrgId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchOrganizations() {
            setIsLoading(true);
            const { data, error: apiError } = await api.get<{
                organizations: Organization[];
                current_org_id: string | null;
            }>("/api/organizations");

            if (apiError) {
                setError(apiError.detail);
                setOrganizations([]);
            } else {
                setOrganizations(data?.organizations || []);
                setCurrentOrgId(data?.current_org_id || null);
                setError(null);
            }
            setIsLoading(false);
        }

        fetchOrganizations();
    }, []);

    return { organizations, currentOrgId, isLoading, error };
}
