"use client";

import React, { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Zap, X, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

interface SaasModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SaasModal({ isOpen, onClose }: SaasModalProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const { isAuthenticated } = useAuth();

  const handleJoinNow = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isAuthenticated) {
      router.push("/community");
      onClose();
      return;
    }

    // Redirect to the community page
    const params = new URLSearchParams();
    if (email) params.set("email", email);
    
    router.push(`/community?${params.toString()}`);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[440px] p-0 overflow-hidden border-none rounded-[32px] bg-white shadow-2xl dark:bg-slate-950">
        <div className="relative pt-12 pb-8 px-6 flex flex-col items-center">
          {/* Brand Accent */}
          <div className="absolute top-0 left-0 w-full h-1.5 bg-linear-to-r from-blue-600 to-indigo-600" />
          
          {/* Logo Icon */}
          <div className="w-20 h-20 rounded-3xl bg-linear-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 flex items-center justify-center mb-10 shadow-inner">
            <Zap className="h-10 w-10 text-blue-600 dark:text-blue-400" fill="currentColor" />
          </div>

          <DialogHeader className="text-center w-full">
            <DialogTitle className="text-[34px] font-[900] tracking-tight leading-[1.05] text-slate-900 dark:text-white mb-4">
              Your SaaS Journey <br /> Starts Here
            </DialogTitle>
            <DialogDescription className="text-[15px] leading-relaxed text-slate-500 dark:text-slate-400 max-w-[280px] mx-auto">
              Get early software access and join 2,000+ high-growth founders.
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Form Area */}
        <form onSubmit={handleJoinNow} className="px-10 pb-12 space-y-6">
          <div className="space-y-4">
            <div className="relative">
               <Input
                 type="email"
                 placeholder="founder@company.com"
                 value={email}
                 onChange={(e) => setEmail(e.target.value)}
                 className="h-14 rounded-2xl bg-slate-50 dark:bg-white/5 border-slate-100 dark:border-white/10 px-6 text-slate-900 dark:text-white placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-blue-500 transition-all text-base"
                 required
               />
            </div>
            
            <Button 
              type="submit"
              className="w-full h-14 rounded-2xl bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-lg shadow-xl shadow-blue-500/20 transition-all border-none flex items-center justify-center gap-2 group"
            >
              Join Now
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>

          <div className="text-center pt-2">
            <p className="text-[13px] text-slate-400 dark:text-slate-500 font-medium">
              Already a member?{" "}
              <button 
                type="button"
                onClick={() => router.push("/login")}
                className="text-blue-600 dark:text-blue-400 font-bold hover:underline"
              >
                Sign In
              </button>
            </p>
          </div>
        </form>
      </DialogContent>
    </Dialog>

  );
}
