"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { 
  Mail, 
  Upload, 
  Type, 
  Hash, 
  Send, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  X, 
  ChevronRight,
  Sparkles,
  Info
} from "lucide-react";
import Papa from "papaparse";
import { api } from "@/lib/api";
import { toast } from "sonner";

interface Lead {
  email: string;
  first_name?: string;
  company?: string;
  [key: string]: any;
}

export default function BulkEmailPage() {
  const [subject, setSubject] = useState("Quick update regarding {{company}}");
  const [body, setBody] = useState("Hi {{first_name}},\n\nI noticed what you're doing at {{company}} and wanted to reach out...\n\nBest regards,\nLeadGenius Team");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [manualInput, setManualInput] = useState("");
  const [importMode, setImportMode] = useState<'csv' | 'manual'>('manual');
  const [isSending, setIsSending] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const parsedLeads = results.data as Lead[];
        const validLeads = parsedLeads.filter(l => l.email && l.email.includes('@'));
        setLeads(validLeads);
        toast.success(`Imported ${validLeads.length} leads from CSV`);
      },
      error: (error) => {
        toast.error("Failed to parse CSV file");
        console.error(error);
      }
    });
  };

  const handleManualImport = () => {
    const lines = manualInput.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    const newLeads: Lead[] = lines.map(line => {
      // Basic comma or space separated parsing: email, name, company
      const parts = line.split(/[,\s]+/).map(p => p.trim());
      return {
        email: parts[0],
        first_name: parts[1] || "",
        company: parts[2] || ""
      };
    }).filter(l => l.email.includes('@'));

    setLeads(newLeads);
    toast.success(`Imported ${newLeads.length} leads manually`);
  };

  const handleSendBatch = async () => {
    if (leads.length === 0) {
      toast.error("Please add at least one lead email");
      return;
    }

    setIsSending(true);
    setProgress({ current: 0, total: leads.length });

    try {
      const response = await api.post<any>("/api/email/batch-send", {
        template: { subject, body },
        leads: leads
      });

      if (response.data) {
        toast.success(response.data.message || "Bulk send completed successfully!");
        setLeads([]);
        setManualInput("");
      } else if (response.error) {
        toast.error(response.error.detail || "Failed to initiate bulk send");
      }
    } catch (error) {
      console.error("Bulk send error:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsSending(false);
    }
  };

  const insertVariable = (variable: string) => {
    setBody(prev => prev + ` {{${variable}}}`);
  };

  return (
    <div className="flex h-full w-full flex-col bg-background p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600/10 text-blue-600">
            <Mail className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Bulk Mailer</h1>
            <p className="text-sm text-muted-foreground">Send personalized outreach via CSV or manual list.</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="rounded-xl border border-border bg-card px-4 py-2 text-sm font-medium hover:bg-muted transition-colors">
            Cancel
          </Link>
          <button
            onClick={handleSendBatch}
            disabled={isSending || leads.length === 0}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-500 disabled:opacity-50"
          >
            {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            {isSending ? `Sending...` : `Blast ${leads.length} Emails`}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        
        {/* Left Column: Import (4 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-2xl border border-border bg-card overflow-hidden">
            <div className="border-b border-border bg-muted/30 px-6 py-4">
              <h3 className="flex items-center gap-2 font-bold text-foreground">
                <Upload className="h-4 w-4 text-emerald-500" /> Lead Import
              </h3>
            </div>
            
            <div className="p-6">
              <div className="mb-6 flex gap-2 rounded-xl bg-muted/50 p-1">
                <button
                  onClick={() => setImportMode('manual')}
                  className={`flex-1 rounded-lg py-1.5 text-xs font-bold transition-all ${importMode === 'manual' ? "bg-white text-blue-600 shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                >
                  Manual Entry
                </button>
                <button
                  onClick={() => setImportMode('csv')}
                  className={`flex-1 rounded-lg py-1.5 text-xs font-bold transition-all ${importMode === 'csv' ? "bg-white text-emerald-600 shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                >
                  CSV Upload
                </button>
              </div>

              {importMode === 'manual' ? (
                <div className="space-y-4">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider font-mono">
                    Format: email, first_name, company
                  </p>
                  <textarea
                    value={manualInput}
                    onChange={(e) => setManualInput(e.target.value)}
                    placeholder="john@example.com, John, Google&#10;jane@company.com, Jane, Apple"
                    rows={10}
                    className="w-full rounded-xl border border-input bg-background p-4 text-xs font-mono text-foreground focus:ring-1 focus:ring-blue-500 placeholder:opacity-50"
                  />
                  <button
                    onClick={handleManualImport}
                    className="w-full rounded-xl border border-blue-500/30 bg-blue-500/10 py-3 text-xs font-bold text-blue-600 hover:bg-blue-500 hover:text-white transition-all"
                  >
                    Load List
                  </button>
                </div>
              ) : (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border py-12 transition hover:border-emerald-500/50 hover:bg-emerald-50/10"
                >
                  <input type="file" ref={fileInputRef} onChange={handleCsvUpload} accept=".csv" className="hidden" />
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
                    <FileText className="h-8 w-8" />
                  </div>
                  <span className="text-sm font-bold text-foreground">Click to upload CSV</span>
                  <span className="mt-1 text-xs text-muted-foreground">Headers: email, first_name, company</span>
                </div>
              )}

              {leads.length > 0 && (
                <div className="mt-6 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-600">
                      <CheckCircle2 className="h-4 w-4" /> {leads.length} leads ready
                    </div>
                    <button onClick={() => setLeads([])} className="text-[10px] font-bold text-muted-foreground hover:text-red-500 uppercase">Clear</button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6">
            <h4 className="mb-3 flex items-center gap-2 text-xs font-bold text-foreground">
              <Info className="h-3.5 w-3.5 text-blue-500" /> Tips for High Deliverability
            </h4>
            <ul className="space-y-3">
              <li className="flex gap-3 text-xs text-muted-foreground">
                <div className="mt-1 h-1 w-1 shrink-0 rounded-full bg-blue-500" />
                Keep your subject lines short and relevant to {{company}}.
              </li>
              <li className="flex gap-3 text-xs text-muted-foreground">
                <div className="mt-1 h-1 w-1 shrink-0 rounded-full bg-blue-500" />
                Avoid using too many links or "spammy" keywords.
              </li>
              <li className="flex gap-3 text-xs text-muted-foreground">
                <div className="mt-1 h-1 w-1 shrink-0 rounded-full bg-blue-500" />
                Always use a personalized greeting like Hi {{first_name}}.
              </li>
            </ul>
          </div>
        </div>

        {/* Right Column: Template (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-2xl border border-border bg-card overflow-hidden">
            <div className="border-b border-border bg-muted/30 px-6 py-4 flex items-center justify-between">
              <h3 className="flex items-center gap-2 font-bold text-foreground">
                <Type className="h-4 w-4 text-purple-500" /> Email Template
              </h3>
              <div className="flex gap-2">
                <VariableChip label="First Name" onClick={() => insertVariable('first_name')} />
                <VariableChip label="Company" onClick={() => insertVariable('company')} />
                <VariableChip label="Email" onClick={() => insertVariable('email')} />
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <label className="mb-2 block text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Subject Line</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm font-semibold text-foreground focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Email Body</label>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  rows={12}
                  className="w-full rounded-xl border border-input bg-background p-4 text-sm leading-relaxed text-foreground focus:ring-1 focus:ring-blue-500 resize-none font-medium"
                />
              </div>

              {/* Preview Card */}
              <div className="rounded-2xl border border-border bg-muted/5 p-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-3">
                  <Sparkles className="h-4 w-4 text-blue-500 opacity-20 group-hover:opacity-100 transition-opacity" />
                </div>
                
                <h4 className="mb-4 text-[10px] font-bold text-blue-500 uppercase tracking-widest">Live Preview</h4>
                <div className="space-y-4">
                  <div>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">To:</span>
                    <span className="ml-2 text-xs font-mono text-foreground">{leads[0]?.email || "prospect@example.com"}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">Subject:</span>
                    <span className="ml-2 text-sm font-bold text-foreground">
                      {subject.replace('{{company}}', 'Google').replace('{{first_name}}', 'Jordan')}
                    </span>
                  </div>
                  <div className="rounded-xl bg-background p-4 border border-border/50">
                    <p className="whitespace-pre-wrap text-sm italic text-foreground/80">
                      {body.replace('{{company}}', 'Google').replace('{{first_name}}', 'Jordan').replace('{{email}}', leads[0]?.email || "prospect@example.com")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

function VariableChip({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1 rounded-lg bg-blue-500/10 px-2 py-1 text-[10px] font-bold text-blue-600 hover:bg-blue-500 hover:text-white transition-all transform active:scale-95"
    >
      <Hash className="h-2.5 w-2.5" /> {label}
    </button>
  );
}
