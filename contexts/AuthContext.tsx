"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { api } from "@/lib/api";
import {
    TokenResponse,
    User,
    setTokens,
    clearTokens,
    getAccessToken,
    getRefreshToken,
    isAuthenticated as checkAuth,
} from "@/lib/auth";

interface RegisterData {
    email: string;
    password: string;
    org_name: string;
    full_name?: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    register: (data: RegisterData) => Promise<{ success: boolean; error?: string; message?: string }>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchUser = useCallback(async () => {
        if (!checkAuth()) {
            setUser(null);
            setIsLoading(false);
            return;
        }

        const { data, error } = await api.get<User>("/api/users/me");
        if (data) {
            setUser(data);
        } else {
            // Token might be invalid, clear it
            if (error?.status === 401) {
                clearTokens();
            }
            setUser(null);
        }
        setIsLoading(false);
    }, []);

    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        fetchUser();
    }, [fetchUser]);

    const login = async (email: string, password: string) => {
        const { data, error } = await api.postForm<TokenResponse>("/api/auth/login", {
            username: email, // OAuth2 uses 'username' field
            password: password,
        });

        if (error) {
            return { success: false, error: error.detail };
        }

        if (data) {
            setTokens(data);
            await fetchUser();
            return { success: true };
        }

        return { success: false, error: "Unknown error occurred" };
    };

    const register = async (data: RegisterData) => {
        interface RegisterResponse {
            message: string;
            user_id?: string;
            org_id?: string;
        }

        const { data: response, error } = await api.post<RegisterResponse>("/api/auth/register", data);

        if (error) {
            return { success: false, error: error.detail };
        }

        if (response) {
            return { success: true, message: response.message };
        }

        return { success: false, error: "Unknown error occurred" };
    };

    const logout = async () => {
        const refreshToken = getRefreshToken();
        if (refreshToken) {
            // Try to invalidate the refresh token on the server
            await api.post("/api/auth/logout", { refresh_token: refreshToken });
        }
        clearTokens();
        setUser(null);
    };

    const refreshUser = async () => {
        await fetchUser();
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                isLoading,
                login,
                register,
                logout,
                refreshUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
