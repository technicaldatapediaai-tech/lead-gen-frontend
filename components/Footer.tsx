import Link from "next/link";
import { Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Footer({ variant = "default" }: { variant?: "default" | "dark" }) {
    const isDark = variant === "dark";

    return (
        <footer className={cn("border-t py-10 transition-colors",
            isDark ? "bg-[#111827] border-[#1f2937] text-white" : "bg-muted/20 border-border"
        )}>
            <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-6 md:flex-row">
                <div className="flex items-center gap-2">
                    <div className="flex h-5 w-5 items-center justify-center rounded bg-blue-600">
                        <Zap className="h-3 w-3 text-white" fill="currentColor" />
                    </div>
                    <span className={cn("text-sm font-bold tracking-tight", isDark ? "text-white" : "text-foreground")}>LeadGenius</span>
                </div>

                <div className={cn("flex gap-6 text-xs", isDark ? "text-gray-400" : "text-muted-foreground")}>
                    <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
                    <Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
                    <Link href="#" className="hover:text-foreground transition-colors">Contact</Link>
                </div>

                <div className={cn("text-[10px]", isDark ? "text-gray-500" : "text-muted-foreground")}>
                    © 2026 LeadGenius Inc. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
