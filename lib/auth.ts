/**
 * Authentication utilities for token management
 */

export interface TokenResponse {
    access_token: string;
    refresh_token: string;
    token_type: string;
    expires_in: number;
}

export interface User {
    id: string;
    email: string;
    full_name?: string;
    avatar_url?: string;
    credits?: number;
    is_active: boolean;
    is_verified: boolean;
    current_org_id?: string;
}

/**
 * Store tokens in localStorage
 */
export function setTokens(tokens: TokenResponse): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('access_token', tokens.access_token);
    localStorage.setItem('refresh_token', tokens.refresh_token);
    localStorage.setItem('token_expires_at', String(Date.now() + tokens.expires_in * 1000));
}

/**
 * Get access token from localStorage
 */
export function getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('access_token');
}

/**
 * Get refresh token from localStorage
 */
export function getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('refresh_token');
}

/**
 * Clear all tokens from localStorage
 */
export function clearTokens(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('token_expires_at');
}

/**
 * Check if user is authenticated (has valid access token)
 */
export function isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;

    const token = getAccessToken();
    if (!token) return false;

    const expiresAt = localStorage.getItem('token_expires_at');
    if (expiresAt && Date.now() > parseInt(expiresAt)) {
        // Token expired
        return false;
    }

    return true;
}

/**
 * Check if token is about to expire (within 5 minutes)
 */
export function isTokenExpiringSoon(): boolean {
    if (typeof window === 'undefined') return false;

    const expiresAt = localStorage.getItem('token_expires_at');
    if (!expiresAt) return true;

    const fiveMinutes = 5 * 60 * 1000;
    return Date.now() > parseInt(expiresAt) - fiveMinutes;
}
