/**
 * API Client for Lead Genius Backend
 * Handles all HTTP requests with authentication
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
// Removed remote production fallback for safety in local dev

interface ApiError {
    detail: string;
    status: number;
}

interface FastApiValidationError {
    loc: (string | number)[];
    msg: string;
    type: string;
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
    const excludedEndpoints = [
        '/api/auth/login', 
        '/api/auth/register', 
        '/api/auth/token', 
        '/api/auth/forgot-password', 
        '/api/auth/reset-password',
        '/api/auth/logout',
        '/api/auth/logout-all',
        '/api/auth/refresh'
    ];
    
    const [path, query] = endpoint.split('?');
    
    // Do not add trailing slashes to these exact excluded routes or any specific api prefixes
    if (
        excludedEndpoints.some(ex => path === ex) || 
        path.startsWith('/api/linkedin') || 
        path.startsWith('/api/integrations') ||
        path.startsWith('/api/campaigns') ||
        path.startsWith('/api/organizations') ||
        path.startsWith('/api/outreach') ||
        path.startsWith('/api/leads')
    ) {
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
    
    // We explicitly avoid nesting this in an inline function 
    // to prevent SWC/Turbopack minifier bugs with await fetch()
    const requestHeaders = new Headers(options.headers || {});
    if (!requestHeaders.has('Content-Type') && !(options.body instanceof FormData)) {
        requestHeaders.set('Content-Type', 'application/json');
    }
    
    const token = getAccessToken();
    if (token) {
        requestHeaders.set('Authorization', `Bearer ${token}`);
    }

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

        const response = await fetch(`${API_BASE_URL}${normalizedEndpoint}`, {
            ...options,
            headers: requestHeaders,
            signal: controller.signal
        });
        clearTimeout(timeoutId);

        // 401 Unauthorized - Attempt token refresh
        if (response.status === 401 && !endpoint.includes('/auth/refresh') && !endpoint.includes('/auth/login')) {
            console.log(`[API] 401 on ${endpoint}, attempting token refresh...`);
            const refreshToken = localStorage.getItem('refresh_token');

            if (!refreshToken) {
                console.warn("[API] No refresh token found, clearing session.");
                if (typeof window !== 'undefined') {
                    localStorage.clear();
                    window.location.href = '/login';
                }
                return { error: { detail: 'Session expired', status: 401 } };
            }

            if (!isRefreshing) {
                isRefreshing = true;
                console.log("[API] Starting refresh process...");
                try {
                    const refreshRes = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ refresh_token: refreshToken }),
                    });

                    if (refreshRes.ok) {
                        const data = await refreshRes.json();
                        console.log("[API] Token refreshed успешно.");
                        localStorage.setItem('access_token', data.access_token);
                        if (data.expires_in) {
                            localStorage.setItem('token_expires_at', String(Date.now() + data.expires_in * 1000));
                        }
                        
                        isRefreshing = false;
                        onTokenRefreshed(data.access_token);
                    } else {
                        console.error("[API] Refresh failed status:", refreshRes.status);
                        isRefreshing = false;
                        // Important: Resolve all waiting subscribers with null to let them fail gracefully
                        onTokenRefreshed(""); 
                        
                        if (typeof window !== 'undefined') {
                            localStorage.clear();
                            window.location.href = '/login';
                        }
                        return { error: { detail: 'Authentication failed. Please log in again.', status: 401 } };
                    }
                } catch (e) {
                    console.error("[API] Network error during refresh:", e);
                    isRefreshing = false;
                    onTokenRefreshed("");
                    return { error: { detail: 'Network error. Please try again.', status: 0 } };
                }
            }

            // Queue up the retry
            console.log(`[API] Queuing retry for ${endpoint}...`);
            return new Promise((resolve) => {
                addRefreshSubscriber((newToken) => {
                    if (!newToken) {
                        resolve({ error: { detail: 'Session expired', status: 401 } });
                        return;
                    }
                    console.log(`[API] Retrying ${endpoint} with new token.`);
                    resolve(apiRequest<T>(endpoint, options));
                });
            });
        }

        // Generic error handling
        if (!response.ok) {
            let errorDetail = `HTTP Error ${response.status}`;
            try {
                const errorData = await response.json();
                const detail = errorData.detail || errorDetail;
                if (Array.isArray(detail)) {
                    errorDetail = (detail as FastApiValidationError[]).map((err) => `${err.loc.join('.')}: ${err.msg}`).join(', ');
                } else {
                    errorDetail = detail;
                }
            } catch (jsonError) {
                // Not JSON
            }
            
            return { error: { detail: errorDetail, status: response.status } };
        }

        if (response.status === 204) {
            return { data: undefined as T };
        }

        const data = await response.json();
        return { data };
    } catch (error) {
        console.error(`[API] Request Error on ${endpoint}:`, error);
        return {
            error: {
                detail: error instanceof Error ? error.message : 'Network failure',
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
            body: body instanceof FormData ? body : (body ? JSON.stringify(body) : undefined),
        }),

    postMultipart: <T>(endpoint: string, formData: FormData) =>
        apiRequest<T>(endpoint, {
            method: 'POST',
            body: formData,
        }),

    patch: <T>(endpoint: string, body?: unknown) =>
        apiRequest<T>(endpoint, {
            method: 'PATCH',
            body: body instanceof FormData ? body : (body ? JSON.stringify(body) : undefined),
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
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams(formData),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ detail: 'Login failed' }));
                return { error: { detail: errorData.detail || `HTTP Error ${response.status}`, status: response.status } };
            }

            const data = await response.json();
            return { data };
        } catch (error) {
            return { error: { detail: error instanceof Error ? error.message : 'Network error', status: 0 } };
        }
    },
};

export { API_BASE_URL };
