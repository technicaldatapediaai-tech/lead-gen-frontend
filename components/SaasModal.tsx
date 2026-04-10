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

  const handleJoinNow = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Save to waitlist database
    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        console.error('Failed to save to waitlist');
      }
    } catch (error) {
      console.error('Error joining waitlist:', error);
    }

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
      <DialogContent 
        className="sm:max-w-[380px] p-0 overflow-hidden border-none rounded-[20px] sm:rounded-[24px] bg-white shadow-2xl dark:bg-slate-950"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <div className="relative pt-8 pb-3 px-8 flex flex-col items-start w-full text-left">
          {/* Brand Accent */}
          <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-blue-600 to-indigo-600" />
          
          {/* Logo Icon - Minimal */}
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mb-6 self-center">
            <Zap className="h-6 w-6 text-blue-600" fill="currentColor" />
          </div>

          <DialogHeader className="text-left w-full space-y-3">
            <DialogTitle className="text-[28px] sm:text-[32px] font-[900] tracking-tight leading-[1.1] text-slate-900 dark:text-white italic">
              Your SaaS Journey <br /> Starts Here
            </DialogTitle>
            <DialogDescription className="text-[15px] leading-relaxed text-slate-500 dark:text-slate-400 max-w-[300px]">
              Get early software access and join 2,000+ high-growth founders.
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Form Area */}
        <form onSubmit={handleJoinNow} className="px-6 pb-6 space-y-4">
          <div className="space-y-2.5">
            <div className="relative">
               <Input
                 type="email"
                 placeholder="founder@company.com"
                 value={email}
                 onChange={(e) => setEmail(e.target.value)}
                 className="h-11 rounded-lg bg-slate-50 dark:bg-white/5 border-slate-100 dark:border-white/10 px-4 text-slate-900 dark:text-white placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-blue-500 transition-all text-sm"
                 required
               />
            </div>
            
            <Button 
              type="submit"
              className="w-full h-11 rounded-lg bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm shadow-md transition-all border-none flex items-center justify-center gap-2 group"
            >
              Join Now
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
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
