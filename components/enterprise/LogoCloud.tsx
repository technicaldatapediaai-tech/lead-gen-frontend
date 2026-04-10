"use client";

import { useTheme } from "next-themes";
import Marquee from "./Marquee";
import { useEffect, useState } from "react";
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
      className={`py-24 transition-colors duration-300 ${isDark ? "bg-slate-950" : "bg-slate-50 border-y border-slate-200"}`}
    >
      <div className="mx-auto max-w-7xl px-24">
        <h2
          className={`text-center text-[10px] font-black uppercase tracking-[0.4em] mb-16 transition-colors ${isDark ? "text-slate-500" : "text-slate-400"}`}
        >
          Architecting for the World&apos;s Leading Teams
        </h2>
        <div
          className={`relative flex h-full w-full flex-col items-center justify-center overflow-hidden py-4`}
        >
          <Marquee pauseOnHover className="[--duration:30s]">
            <LogoItem icon={<Cpu className="w-5 h-5" />} name="NVIDIA" isDark={isDark} />
            <LogoItem icon={<Zap className="w-5 h-5" />} name="OPENAI" isDark={isDark} />
            <LogoItem icon={<Triangle className="w-5 h-5 pt-1" />} name="VERCEL" isDark={isDark} />
            <LogoItem icon={<Github className="w-5 h-5" />} name="GITHUB" isDark={isDark} />
            <LogoItem icon={<Activity className="w-5 h-5" />} name="STRIPE" isDark={isDark} />
            <LogoItem icon={<Lock className="w-5 h-5" />} name="AUTH0" isDark={isDark} />
            <LogoItem icon={<Globe className="w-5 h-5" />} name="CLOUDFLARE" isDark={isDark} />
            <LogoItem icon={<ShieldCheck className="w-5 h-5" />} name="PALANTIR" isDark={isDark} />
            <LogoItem icon={<ZapIcon className="w-5 h-5" />} name="ZAPIER" isDark={isDark} />
          </Marquee>
          
          <div
            className={`pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-linear-to-r ${isDark ? "from-slate-950" : "from-slate-50"}`}
          ></div>
          <div
            className={`pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-linear-to-l ${isDark ? "from-slate-950" : "from-slate-50"}`}
          ></div>
        </div>
      </div>
    </section>
  );
}

function LogoItem({ icon, name, isDark }: { icon: React.ReactNode, name: string, isDark: boolean }) {
  return (
    <div className={`flex items-center gap-3 px-10 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-500 cursor-default group`}>
      <div className={`${isDark ? 'group-hover:text-blue-400' : 'group-hover:text-blue-600'} transition-colors`}>
        {icon}
      </div>
      <span className={`text-xl font-black tracking-tighter ${isDark ? 'text-white' : 'text-slate-900'} font-sans`}>
        {name}
      </span>
    </div>
  );
}

