"use client";

import { useState, useEffect } from "react";
import { Mail, Loader2, X, Send, BookTemplate, Info, Sparkles } from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface Template {
    id: string;
    name: string;
    content: string;
}

interface EmailMessagingProps {
    leadId: string;
    leadName: string;
    leadEmail: string;
    onMessageSent?: () => void;
    onClose: () => void;
}

export default function EmailMessaging({
    leadId,
    leadName,
    leadEmail,
    onMessageSent,
    onClose
}: EmailMessagingProps) {
    const [message, setMessage] = useState("");
    const [templates, setTemplates] = useState<Template[]>([]);
    const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [isPersonalizing, setIsPersonalizing] = useState(false);

    useEffect(() => {
        const fetchTemplates = async () => {
            setIsLoading(true);
            try {
                const res = await api.get<{ items: Template[] }>("/api/outreach/templates/?channel=email");
                if (res.data?.items) {
                    setTemplates(res.data.items);
                }
            } catch (error) {
                console.error("Failed to fetch templates", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchTemplates();
    }, []);

    const handleTemplateSelect = async (templateId: string) => {
        setSelectedTemplateId(templateId);
        try {
            const res = await api.post<{ content: string }>(`/api/outreach/templates/${templateId}/render`, {
                lead_id: leadId
            });
            if (res.data?.content) {
                setMessage(res.data.content);
            }
        } catch (error) {
            toast.error("Failed to render template");
        }
    };

    const handleAiPersonalize = async () => {
        if (!selectedTemplateId) {
            toast.error("Please select a template first");
            return;
        }

        setIsPersonalizing(true);
        try {
            const res = await api.post<{ content: string }>(`/api/outreach/templates/${selectedTemplateId}/render`, {
                lead_id: leadId,
                personalize: true
            });
            if (res.data?.content) {
                setMessage(res.data.content);
                toast.success("AI personalization applied!");
            }
        } catch (error) {
            toast.error("Failed to personalize with AI");
        } finally {
            setIsPersonalizing(false);
        }
    };

    const handleSend = async () => {
        if (!message.trim()) {
            toast.error("Please enter a message");
            return;
        }

        setIsSending(true);
        try {
            // 1. Create the message
            const res = await api.post<any>("/api/outreach/", {
                lead_id: leadId,
                channel: "email",
                message: message,
                status: "pending"
            });

            if (res.error) {
                toast.error(res.error.detail || "Failed to queue email");
                return;
            }

            const messageId = res.data.id;

            // 2. Trigger the send
            const sendRes = await api.post<any>(`/api/outreach/${messageId}/send`);

            if (sendRes.error) {
                toast.error(sendRes.error.detail || "Failed to send email");
            } else {
                toast.success(`Email sent to ${leadEmail}!`);
                onMessageSent?.();
                onClose();
            }
        } catch (error) {
            toast.error("An unexpected error occurred");
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="flex flex-col bg-card overflow-hidden rounded-xl border border-border">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border bg-muted/50 px-6 py-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                        <Mail size={20} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-foreground">Email Outreach</h3>
                        <p className="text-xs text-muted-foreground">To: {leadName} ({leadEmail})</p>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-all"
                >
                    <X size={20} />
                </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6">
                {/* Template Selection */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-bold text-foreground flex items-center gap-2">
                            <BookTemplate size={16} className="text-blue-500" />
                            Email Template
                        </label>
                        <span className="text-[10px] font-bold text-muted-foreground uppercase bg-muted px-2 py-0.5 rounded">
                            {templates.length} Available
                        </span>
                    </div>
                    <div className="flex gap-2">
                        <Select onValueChange={handleTemplateSelect}>
                            <SelectTrigger className="flex-1 bg-muted/30 border-border h-11">
                                <SelectValue placeholder={isLoading ? "Loading templates..." : "Select a template"} />
                            </SelectTrigger>
                            <SelectContent>
                                {templates.map((template) => (
                                    <SelectItem key={template.id} value={template.id}>
                                        {template.name}
                                    </SelectItem>
                                ))}
                                {templates.length === 0 && !isLoading && (
                                    <SelectItem value="none" disabled>No email templates found</SelectItem>
                                )}
                            </SelectContent>
                        </Select>

                        <Button
                            variant="outline"
                            onClick={handleAiPersonalize}
                            disabled={!selectedTemplateId || isPersonalizing}
                            className="h-11 border-purple-500/30 text-purple-600 hover:bg-purple-500/5 hover:text-purple-700 font-bold"
                        >
                            {isPersonalizing ? (
                                <Loader2 size={16} className="animate-spin" />
                            ) : (
                                <Sparkles size={16} className="mr-2" />
                            )}
                            AI Personalize
                        </Button>
                    </div>
                </div>

                {/* Message Editor */}
                <div className="space-y-2">
                    <label className="text-sm font-bold text-foreground">Your Message</label>
                    <div className="relative group">
                        <Textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Type your message here... Hint: Start with 'Subject: Your Subject Line' to customize the subject."
                            className="min-h-[250px] bg-muted/10 border-border focus:border-blue-500/30 transition-all resize-none p-4 text-sm scrollbar-thin"
                        />
                        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-[10px] text-muted-foreground bg-card/80 backdrop-blur px-2 py-1 rounded border border-border">
                                {message.length} characters
                            </span>
                        </div>
                    </div>
                </div>

                {/* Alert/Tip */}
                <div className="flex items-start gap-3 rounded-xl border border-blue-500/10 bg-blue-500/5 p-4 text-blue-600 dark:text-blue-400">
                    <Info className="mt-0.5 shrink-0" size={16} />
                    <p className="text-xs leading-relaxed">
                        <strong>SMTP Active:</strong> Emails are sent directly from your connected email account to ensure high deliverability and land in the primary inbox.
                    </p>
                </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 border-t border-border bg-muted/30 px-6 py-4">
                <Button
                    variant="ghost"
                    onClick={onClose}
                    className="text-sm font-bold text-muted-foreground"
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleSend}
                    disabled={isSending || !message.trim()}
                    className="gap-2 bg-blue-600 hover:bg-blue-500 text-white min-w-[140px] shadow-lg shadow-blue-500/20"
                >
                    {isSending ? (
                        <>
                            <Loader2 size={18} className="animate-spin" />
                            Sending...
                        </>
                    ) : (
                        <>
                            <Send size={18} />
                            Send Outreach
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
}
