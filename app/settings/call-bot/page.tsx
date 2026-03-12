"use client";

import { Bot, Sparkles } from "lucide-react";

export default function AICallBotPage() {
    return (
        <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-background transition-colors duration-300">
            <div className="relative mb-8">
                <div className="absolute -inset-4 rounded-full bg-blue-500/10 blur-xl animate-pulse"></div>
                <div className="relative h-24 w-24 rounded-3xl bg-card border border-border flex items-center justify-center shadow-xl">
                    <Bot size={48} className="text-blue-500" />
                </div>
                <div className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-background border border-border flex items-center justify-center shadow-lg">
                    <Sparkles size={16} className="text-blue-500" />
                </div>
            </div>
            
            <h1 className="text-4xl font-bold tracking-tight text-foreground mb-4">
                AI Call Bot
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-md mb-12">
                Our revolutionary AI-powered voice agent is currently in development. Reach out to leads via phone with human-like conversation.
            </p>
            
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-500 font-semibold mb-8">
                <div className="h-2 w-2 rounded-full bg-blue-500 animate-ping"></div>
                Coming Soon
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl mt-8">
                <FeatureCard 
                    title="Human-like Voice" 
                    description="Advanced neural text-to-speech for natural interactions." 
                />
                <FeatureCard 
                    title="Smart CRM Integration" 
                    description="Automatically log call notes and outcomes to your leads." 
                />
                <FeatureCard 
                    title="High Deliverability" 
                    description="Verified caller IDs to ensure your calls get answered." 
                />
            </div>
        </div>
    );
}

function FeatureCard({ title, description }: { title: string; description: string }) {
    return (
        <div className="p-6 rounded-2xl bg-card border border-border hover:border-blue-500/30 transition-all text-left">
            <h3 className="font-bold text-foreground mb-2">{title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
        </div>
    );
}
