"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function GoogleCallbackPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const accessToken = searchParams.get("access_token");
        const refreshToken = searchParams.get("refresh_token");

        if (accessToken && refreshToken) {
            // Store tokens in localStorage
            localStorage.setItem("access_token", accessToken);
            localStorage.setItem("refresh_token", refreshToken);
            
            toast.success("Login successful!");
            
            // Redirect to dashboard
            router.push("/dashboard");
        } else {
            const error = searchParams.get("error");
            toast.error(error || "Login failed. Please try again.");
            router.push("/login");
        }
    }, [router, searchParams]);

    return (
        <div className="flex min-h-screen items-center justify-center bg-background">
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
                <h1 className="text-xl font-semibold">Completing login...</h1>
                <p className="text-muted-foreground">You will be redirected shortly.</p>
            </div>
        </div>
    );
}
