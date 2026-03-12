"use client";

import { Bot, Phone, Shield, Zap, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function DashboardCallBotPage() {
  return (
    <div className="h-full w-full overflow-y-auto bg-background text-foreground transition-colors duration-300">
      <div className="mx-auto max-w-5xl p-6 lg:p-10">
        {/* Breadcrumb */}
        <div className="text-xs text-muted-foreground flex items-center gap-1">
          <Link href="/dashboard" className="hover:text-foreground transition-colors">Home</Link>
          <span>/</span>
          <span className="text-blue-500 font-medium">AI Call Bot</span>
        </div>

        {/* Hero Section */}
        <div className="mt-8 flex flex-col items-center text-center">
          <div className="relative mb-6">
            <div className="absolute -inset-4 rounded-3xl bg-blue-600/10 blur-2xl animate-pulse"></div>
            <div className="relative grid h-24 w-24 place-items-center rounded-3xl bg-blue-600 text-white shadow-2xl shadow-blue-600/20 ring-1 ring-blue-500/20">
              <Bot size={48} />
            </div>
          </div>
          
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            AI Call Bot
          </h1>
          <p className="mt-4 text-xl text-muted-foreground max-w-2xl leading-relaxed">
            The next generation of lead generation is coming. 
            Automate your cold calls with human-like AI agents that close deals while you sleep.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-1.5 text-sm font-semibold text-blue-500">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500"></span>
              </span>
              In Development
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1.5 text-sm font-semibold text-emerald-500">
              Beta Access Coming Soon
            </div>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="mt-20 grid gap-8 sm:grid-cols-2 lg:grid-cols-2">
          <FeatureCard 
            icon={<Phone className="h-6 w-6" />}
            title="Natural Voice Tech"
            description="Ultra-realistic AI voices that handle objections, answer questions, and build rapport just like a top-performing SDR."
          />
          <FeatureCard 
            icon={<Zap className="h-6 w-6" />}
            title="Instant CRM Sync"
            description="Every call is transcribed, summarized, and synced to your CRM automatically with sentiment analysis and follow-up tasks."
          />
          <FeatureCard 
            icon={<Shield className="h-6 w-6" />}
            title="Compliance Built-in"
            description="Automatic handling of 'Do Not Call' lists and TCPA compliance to keep your business safe while scaling outreach."
          />
          <FeatureCard 
            icon={<Sparkles className="h-6 w-6" />}
            title="Smart Lead Routing"
            description="Prequalify leads on the call and instantly transfer high-intent prospects to your live sales team."
          />
        </div>

        {/* CTA Section */}
        <div className="mt-20 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 p-8 text-center text-white shadow-2xl shadow-blue-900/20 sm:p-12 lg:flex lg:items-center lg:justify-between lg:text-left">
          <div className="max-w-xl">
            <h2 className="text-3xl font-bold tracking-tight">Be the first to know</h2>
            <p className="mt-4 text-lg text-blue-100/90 leading-relaxed">
              We're currently rolling out early access to selected partners. 
              Join the waitlist to transform your sales process with AI.
            </p>
          </div>
          <div className="mt-8 shrink-0 lg:mt-0">
            <Link 
              href="/settings/call-bot"
              className="inline-flex h-14 items-center gap-3 rounded-2xl bg-white px-8 text-lg font-bold text-blue-600 shadow-xl hover:bg-blue-50 transition-all hover:scale-105 active:scale-95"
            >
              Join the Waitlist
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-20 pb-10 text-center text-sm text-muted-foreground">
          &copy; 2026 LeadGenius AI. Dynamic Outreach Redefined.
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string, description: string }) {
  return (
    <div className="group relative rounded-3xl border border-border bg-card p-8 transition-all hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/5">
      <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-500 ring-1 ring-blue-500/20 transition-transform group-hover:scale-110">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-foreground mb-3">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}
