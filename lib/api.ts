/**
 * API Client for Lead Genius Backend
 * Handles all HTTP requests with authentication
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface ApiError {
    detail: string;
    status: number;
}

interface ApiResponse<T> {
    data?: T;
    error?: ApiError;
}

/**
 * Get the access token from localStorage
 */
function getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('access_token');
}

/**
 * Variable to prevent multiple simultaneous refresh calls
 */
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

function onTokenRefreshed(token: string) {
    refreshSubscribers.map((cb) => cb(token));
    refreshSubscribers = [];
}

function addRefreshSubscriber(cb: (token: string) => void) {
    refreshSubscribers.push(cb);
}

/**
 * Ensures an endpoint has a trailing slash before query parameters
 */
function normalizeEndpoint(endpoint: string): string {
    // These endpoints should NOT have a trailing slash as they cause 404s on the backend
    const excludedEndpoints = ['/api/auth/login', '/api/auth/register', '/api/auth/token'];
    
    const [path, query] = endpoint.split('?');
    
    // Do not add trailing slashes to these exact excluded routes or any linkedin routes
    if (excludedEndpoints.some(ex => path === ex) || path.startsWith('/api/linkedin')) {
        return endpoint;
    }
    
    const pathWithSlash = path.endsWith('/') ? path : `${path}/`;
    return query ? `${pathWithSlash}?${query}` : pathWithSlash;
}

/**
 * Make an authenticated API request
 */
export async function apiRequest<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<ApiResponse<T>> {
    const normalizedEndpoint = normalizeEndpoint(endpoint);
    const token = getAccessToken();

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(`${API_BASE_URL}${normalizedEndpoint}`, {
            ...options,
            headers,
        });

        // If unauthorized, try to refresh token
        if (response.status === 401 && !endpoint.includes('/auth/refresh') && !endpoint.includes('/auth/login')) {
            const refreshToken = localStorage.getItem('refresh_token');

            if (!refreshToken) {
                // No refresh token, redirect to login
                if (typeof window !== 'undefined') {
                    localStorage.clear();
                    window.location.href = '/login';
                }
                return { error: { detail: 'Session expired', status: 401 } };
            }

            if (!isRefreshing) {
                isRefreshing = true;

                try {
                    const refreshRes = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ refresh_token: refreshToken }),
                    });

                    if (refreshRes.ok) {
                        const data = await refreshRes.json();
                        // Import setTokens or use it directly
                        localStorage.setItem('access_token', data.access_token);
                        localStorage.setItem('token_expires_at', String(Date.now() + data.expires_in * 1000));

                        isRefreshing = false;
                        onTokenRefreshed(data.access_token);
                    } else {
                        // Refresh failed
                        isRefreshing = false;
                        if (typeof window !== 'undefined') {
                            localStorage.clear();
                            window.location.href = '/login';
                        }
                        return { error: { detail: 'Session expired', status: 401 } };
                    }
                } catch (e) {
                    isRefreshing = false;
                    return { error: { detail: 'Network error during refresh', status: 0 } };
                }
            }

            // Wait for refresh to complete and retry
            return new Promise((resolve) => {
                addRefreshSubscriber((newToken) => {
                    const retryHeaders = { ...headers, 'Authorization': `Bearer ${newToken}` };
                    resolve(apiRequest<T>(endpoint, { ...options, headers: retryHeaders }));
                });
            });
        }

        if (!response.ok) {
            let errorDetail = `HTTP Error ${response.status}`;
            try {
                const errorData = await response.json();
                if (errorData.detail) {
                    if (Array.isArray(errorData.detail)) {
                        errorDetail = errorData.detail.map((err: any) => `${err.loc.join('.')}: ${err.msg}`).join(', ');
                    } else {
                        errorDetail = errorData.detail;
                    }
                }
            } catch (jsonError) {
                // Not JSON
            }
            
            return {
                error: {
                    detail: errorDetail,
                    status: response.status,
                },
            };
        }

        // Handle 204 No Content
        if (response.status === 204) {
            return { data: undefined as T };
        }

        const data = await response.json();
        return { data };
    } catch (error) {
        console.error("API Request Error:", error);
        return {
            error: {
                detail: error instanceof Error ? error.message : 'Network error',
                status: 0,
            },
        };
    }
}

/**
 * API methods for common HTTP verbs
 */
export const api = {
    get: <T>(endpoint: string) => apiRequest<T>(endpoint, { method: 'GET' }),

    post: <T>(endpoint: string, body?: unknown) =>
        apiRequest<T>(endpoint, {
            method: 'POST',
            body: body ? JSON.stringify(body) : undefined,
        }),

    patch: <T>(endpoint: string, body?: unknown) =>
        apiRequest<T>(endpoint, {
            method: 'PATCH',
            body: body ? JSON.stringify(body) : undefined,
        }),

    delete: <T>(endpoint: string) => apiRequest<T>(endpoint, { method: 'DELETE' }),

    /**
     * Special method for OAuth2 form data (login endpoint)
     */
    postForm: async <T>(endpoint: string, formData: Record<string, string>): Promise<ApiResponse<T>> => {
        const normalizedEndpoint = normalizeEndpoint(endpoint);
        try {
            const response = await fetch(`${API_BASE_URL}${normalizedEndpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams(formData),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ detail: 'Request failed' }));
                return {
                    error: {
                        detail: errorData.detail || `HTTP Error ${response.status}`,
                        status: response.status,
                    },
                };
            }

            const data = await response.json();
            return { data };
        } catch (error) {
            return {
                error: {
                    detail: error instanceof Error ? error.message : 'Network error',
                    status: 0,
                },
            };
        }
    },
};

export { API_BASE_URL };
