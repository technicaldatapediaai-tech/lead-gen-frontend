"use client";

import { useTheme } from "next-themes";
import Marquee from "./Marquee";
import React, { useEffect, useState } from "react";
import { 
  Zap, 
  Cpu, 
  Triangle, 
  Github, 
  Activity, 
  Lock, 
  Globe, 
  ShieldCheck,
  ZapIcon
} from "lucide-react";

export default function LogoCloud() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <section className="py-24 bg-background">
        <div className="mx-auto max-w-7xl px-20 h-[100px]" />
      </section>
    );
  }

  const isDark = theme === "dark";

  return (
    <section
      className={`py-32 transition-colors duration-700 relative overflow-hidden ${
        isDark 
          ? "bg-slate-950" 
          : "bg-white border-y border-slate-50"
      }`}
    >
      {/* Dynamic Background Glow */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] blur-[120px] rounded-full transition-colors duration-700 pointer-events-none ${
        isDark ? 'bg-blue-900/10' : 'bg-blue-50'
      }`} />
      <div className="mx-auto max-w-7xl px-24">
        <h2
          className={`relative z-10 text-center text-xs font-bold uppercase tracking-widest mb-16 transition-colors ${
            isDark ? "text-slate-500" : "text-slate-500"
          }`}
        >
          Architecting for the World&apos;s Leading Teams
        </h2>
        <div
          className={`relative flex h-full w-full flex-col items-center justify-center overflow-hidden py-4`}
        >
          <Marquee pauseOnHover className="[--duration:30s]">
            <LogoItem icon={<Cpu className="w-5 h-5" />} name="NVIDIA" isDark={isDark} brandColor="#76B900" />
            <LogoItem icon={<Zap className="w-5 h-5" />} name="OPENAI" isDark={isDark} brandColor="#00A67E" />
            <LogoItem icon={<Triangle className="w-5 h-5 pt-1" />} name="VERCEL" isDark={isDark} brandColor="#000000" />
            <LogoItem icon={<Github className="w-5 h-5" />} name="GITHUB" isDark={isDark} brandColor="#181717" />
            <LogoItem icon={<Activity className="w-5 h-5" />} name="STRIPE" isDark={isDark} brandColor="#635BFF" />
            <LogoItem icon={<Lock className="w-5 h-5" />} name="AUTH0" isDark={isDark} brandColor="#EB5424" />
            <LogoItem icon={<Globe className="w-5 h-5" />} name="CLOUDFLARE" isDark={isDark} brandColor="#F38020" />
            <LogoItem icon={<ShieldCheck className="w-5 h-5" />} name="PALANTIR" isDark={isDark} brandColor="#191919" />
            <LogoItem icon={<ZapIcon className="w-5 h-5" />} name="ZAPIER" isDark={isDark} brandColor="#FF4A00" />
          </Marquee>
          
        </div>
      </div>
    </section>
  );
}

function LogoItem({ icon, name, isDark, brandColor }: { icon: React.ReactNode, name: string, isDark: boolean, brandColor: string }) {
  return (
    <div className={`flex items-center gap-5 px-10 py-4 transition-all duration-500 cursor-pointer group relative rounded-2xl ${
      isDark ? 'hover:bg-slate-900/50' : 'hover:bg-white hover:shadow-2xl hover:shadow-slate-200/50'
    }`}>
      <div className={`transition-all duration-500 group-hover:scale-110`} style={{ color: brandColor }}>
        <div className={`transition-all duration-500`}>
          {React.cloneElement(icon as React.ReactElement, { strokeWidth: 3, size: 24 })}
        </div>
      </div>
      
      <span className={`text-lg font-black tracking-tighter transition-all duration-500`} style={{ color: brandColor }}>
        {name}
      </span>
    </div>
  );
}

