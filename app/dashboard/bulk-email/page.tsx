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
  ChevronLeft,
  Sparkles,
  Info,
  RefreshCcw,
  Download,
  Columns
} from "lucide-react";
import Papa from "papaparse";
import { api } from "@/lib/api";
import { toast } from "sonner";

interface Lead {
  email: string;
  first_name?: string;
  company?: string;
  linkedin_url?: string;
  [key: string]: any;
}

export default function BulkEmailPage() {
  const [subject, setSubject] = useState("Quick update regarding {{company}}");
  const [body, setBody] = useState("Hi {{first_name}},\n\nI noticed what you're doing at {{company}} and wanted to reach out...\n\nBest regards,\nLeadGenius Team");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [manualInput, setManualInput] = useState("");
  const [importMode, setImportMode] = useState<'csv' | 'manual'>('manual');
  const [isSending, setIsSending] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0, success: 0, failed: 0 });
  const [previewIndex, setPreviewIndex] = useState(0);
  const [showProgressUI, setShowProgressUI] = useState(false);
  
  // New Preview States
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [rawParsedData, setRawParsedData] = useState<any[]>([]);
  const [mappedHeaders, setMappedHeaders] = useState<Record<string, string>>({});
  const [availableHeaders, setAvailableHeaders] = useState<string[]>([]);
  const [invalidRows, setInvalidRows] = useState<Set<number>>(new Set());
  const [failedLeads, setFailedLeads] = useState<any[]>([]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateEmail = (email: any) => {
    if (!email || typeof email !== 'string') return false;
    const trimmed = email.trim();
    return trimmed.includes('@') && trimmed.includes('.');
  };

  const downloadFailureReport = () => {
    if (failedLeads.length === 0) return;
    const csv = Papa.unparse(failedLeads);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `failure_report_${new Date().getTime()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const retryFailed = () => {
    const retryable = failedLeads.map(f => ({
        ...f,
        email: f.email === "N/A" ? "" : f.email
    }));
    setRawParsedData(retryable);
    setCsvFile(new File([], "retried_leads.csv"));
    setLeads([]);
    setFailedLeads([]);
    setShowProgressUI(false);
    toast.info("Failed leads re-loaded for correction.");
  };

  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCsvFile(file);

    Papa.parse(file, {
      header: false, // Parse all rows as data first to detect headers manually
      skipEmptyLines: "greedy",
      dynamicTyping: true,
      complete: (results) => {
        const data = (results.data || []) as any[][];
        if (data.length === 0) {
          toast.error("CSV file is empty");
          return;
        }

        let startIdx = 0;
        let headers: string[] = [];

        // Improved Header Detection
        // If the first row looks like it contains an email, it's likely data, not a header row.
        const firstRow = data[0] || [];
        const hasEmailInFirstRow = firstRow.some(cell => validateEmail(String(cell || "")));
        
        // Check for common header terms
        const headerKeywords = ['email', 'mail', 'name', 'first', 'last', 'company', 'org', 'linkedin', 'url'];
        const hasKeywordsInFirstRow = firstRow.some(cell => 
            typeof cell === 'string' && headerKeywords.some(k => cell.toLowerCase().includes(k))
        );

        if (hasKeywordsInFirstRow && !hasEmailInFirstRow) {
          // It's a header row
          headers = firstRow.map(h => String(h || "").trim());
          startIdx = 1;
        } else {
          // No header row, or first row is already data
          headers = firstRow.map((_, i) => `Column ${i + 1}`);
          startIdx = 0;
        }

        const rowsToProcess = data.slice(startIdx);
        // Map to objects using headers as keys
        const normalizedData = rowsToProcess.map(row => {
            const obj: any = {};
            headers.forEach((h, i) => {
                obj[h] = row[i];
            });
            return obj;
        });

        setAvailableHeaders(headers);
        setRawParsedData(normalizedData);

        // Auto-mapping logic
        const mappings: Record<string, string> = {};
        headers.forEach((h, i) => {
          const lower = h.toLowerCase();
          if (lower.includes('email') || lower.includes('mail')) mappings['email'] = h;
          if (lower.includes('first') || lower.includes('name')) mappings['first_name'] = h;
          if (lower.includes('comp') || lower.includes('org')) mappings['company'] = h;
          if (lower.includes('link') || lower.includes('url')) mappings['linkedin_url'] = h;
          
          // Fallback check: if column looks like email but header is generic
          if (!mappings['email'] && firstRow[i] && validateEmail(String(firstRow[i]))) {
              mappings['email'] = h;
          }
        });

        const invalid = new Set<number>();
        normalizedData.forEach((row, idx) => {
          const emailKey = mappings['email'];
          if (!emailKey || !validateEmail(String(row[emailKey] || ""))) {
            invalid.add(idx);
          }
        });

        setMappedHeaders(mappings);
        setInvalidRows(invalid);
        toast.info(`Successfully loaded ${normalizedData.length} records. Please verify mappings.`);
      },
      error: (error) => {
        toast.error("Failed to parse CSV file: " + error);
      }
    });
  };

  const applyImport = () => {
    if (rawParsedData.length === 0) return;
    
    const emailKey = mappedHeaders['email'];
    if (!emailKey) {
      toast.error("Please map the 'Email' column before starting import");
      return;
    }

    // Capture all rows, even those with invalid emails (flag them)
    const finalLeads = rawParsedData.map(row => ({
      email: String(row[mappedHeaders['email']] || "").trim(),
      first_name: String(row[mappedHeaders['first_name']] || "").trim(),
      company: String(row[mappedHeaders['company']] || "").trim(),
      linkedin_url: String(row[mappedHeaders['linkedin_url']] || "").trim(),
      ...row 
    }));

    setLeads(finalLeads);
    const validCount = finalLeads.filter(l => validateEmail(l.email)).length;
    
    if (validCount < finalLeads.length) {
        toast.warning(`${finalLeads.length - validCount} records have invalid emails and will be skipped during sending.`);
    }
    toast.success(`Success! ${finalLeads.length} records imported.`);
  };

  const handleManualImport = () => {
    const lines = manualInput.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    const newLeads: Lead[] = lines.map(line => {
      const parts = line.split(',').map(p => p.trim());
      return {
        email: parts[0],
        first_name: parts[1] || "",
        company: parts[2] || ""
      };
    });

    if (newLeads.length === 0) {
        toast.error("No data found in your manual entry.");
        return;
    }

    setLeads(newLeads);
    setPreviewIndex(0);
    const validCount = newLeads.filter(l => validateEmail(l.email)).length;
    toast.success(`${newLeads.length} records added (${validCount} valid).`);
  };

  const handleSendBatch = async () => {
    const validLeads = leads.filter(l => validateEmail(l.email));
    
    if (validLeads.length === 0) {
      toast.error("No valid leads email found to send. Please correct the data.");
      return;
    }

    setIsSending(true);
    setShowProgressUI(true);
    setProgress({ current: 0, total: validLeads.length, success: 0, failed: 0 });
    setFailedLeads([]);

    try {
      const response = await api.post<any>("/api/email/batch-send", {
        template: { subject, body },
        leads: validLeads
      });

      if (response.data) {
        for (let i = 0; i <= 100; i += 5) {
            setProgress(prev => ({ ...prev, current: Math.floor((i / 100) * validLeads.length) }));
            await new Promise(r => setTimeout(r, 40));
        }
        
        setProgress(prev => ({ 
            ...prev, 
            current: validLeads.length, 
            success: response.data.success || 0,
            failed: response.data.failed || 0
        }));
        
        if (response.data.errors && response.data.errors.length > 0) {
            setFailedLeads(response.data.errors);
            toast.warning(`${response.data.errors.length} leads failed to queue. Check the report.`);
        } else {
            toast.success("All emails are successfully queued for sending!");
        }
      } else {
        toast.error(response.error?.detail || "Failed to initiate bulk send");
      }
    } catch (error) {
      toast.error("An unexpected server error occurred");
    } finally {
      setIsSending(false);
    }
  };

  const insertVariable = (variable: string) => {
    setBody(prev => prev + ` {{${variable}}}`);
  };

  const resetImport = () => {
    setCsvFile(null);
    setRawParsedData([]);
    setLeads([]);
    setInvalidRows(new Set());
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="flex h-full w-full flex-col overflow-y-auto bg-background p-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600/10 text-blue-600 shadow-inner">
            <Mail className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Bulk Mailer</h1>
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-purple-500" />
              Automated outreach for high-volume campaigns.
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="rounded-xl border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-muted transition-all">
            Cancel
          </Link>
          <button
            onClick={handleSendBatch}
            disabled={isSending || leads.length === 0}
            className="group relative flex items-center gap-2 overflow-hidden rounded-xl bg-blue-600 px-8 py-3 text-sm font-bold text-white shadow-xl shadow-blue-500/30 transition-all hover:bg-blue-500 hover:shadow-blue-500/40 disabled:opacity-50 active:scale-95"
          >
            {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
            {isSending ? `Processing...` : `Blast ${leads.length} Emails`}
          </button>
        </div>
      </div>

      {/* Progress Monitor */}
      {showProgressUI && (
        <div className="mb-8 rounded-2xl border border-blue-500/20 bg-blue-500/5 p-6 animate-in fade-in duration-500">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-bold text-blue-600 flex items-center gap-2">
              {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
              {isSending ? "Status: Queuing emails..." : "Status: Completed 🎉"}
            </h3>
            <span className="text-xs font-mono font-bold text-blue-500">
              {progress.current} / {progress.total}
            </span>
          </div>
          
          <div className="h-2 w-full rounded-full bg-blue-200/30 overflow-hidden shadow-inner">
            <div 
              className="h-full bg-blue-600 transition-all duration-300 ease-out"
              style={{ width: `${(progress.current / progress.total) * 100}%` }}
            />
          </div>

          {!isSending && (
            <div className="mt-4 flex flex-wrap items-center gap-4">
              <div className="rounded-lg bg-emerald-500/10 px-3 py-1.5 border border-emerald-500/20 text-xs font-bold text-emerald-600">
                ✅ SUCCESS: {progress.success}
              </div>
              {progress.failed > 0 && (
                <div className="rounded-lg bg-red-500/10 px-3 py-1.5 border border-red-500/20 text-xs font-bold text-red-600">
                  ❌ FAILED: {progress.failed}
                </div>
              )}

              {failedLeads.length > 0 && (
                <div className="flex gap-2">
                  <button 
                    onClick={downloadFailureReport}
                    className="flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-bold text-white shadow-lg shadow-red-500/20 hover:bg-red-500 transition-all"
                  >
                    <Download className="h-3 w-3" /> Get Report
                  </button>
                  <button 
                    onClick={retryFailed}
                    className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-bold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-500 transition-all"
                  >
                    <RefreshCcw className="h-3 w-3" /> Retry Failed
                  </button>
                </div>
              )}

              <button 
                onClick={() => {
                    setShowProgressUI(false);
                    if (progress.failed === 0) setLeads([]);
                }}
                className="ml-auto text-xs font-bold text-muted-foreground hover:text-foreground"
              >
                Dismiss
              </button>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        
        {/* Left Column: Import (5 cols) */}
        <div className="lg:col-span-12 xl:col-span-5 space-y-6">
          <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-lg border-opacity-50">
            <div className="border-b border-border bg-muted/30 px-6 py-4">
              <h3 className="flex items-center gap-2 font-bold text-foreground">
                <Upload className="h-4 w-4 text-blue-500" /> 1. Acquire Leads
              </h3>
            </div>
            
            <div className="p-6">
              <div className="mb-6 flex gap-2 rounded-xl bg-muted/50 p-1">
                <button
                  onClick={() => setImportMode('manual')}
                  className={`flex-1 rounded-lg py-2 text-xs font-bold transition-all ${importMode === 'manual' ? "bg-white text-blue-600 shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                >
                  Manual Entry
                </button>
                <button
                  onClick={() => setImportMode('csv')}
                  className={`flex-1 rounded-lg py-2 text-xs font-bold transition-all ${importMode === 'csv' ? "bg-white text-blue-600 shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                >
                  CSV Upload
                </button>
              </div>

              {importMode === 'manual' ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label htmlFor="manual-leads" className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider font-mono">
                      Format: email, name, company
                    </label>
                  </div>
                  <textarea
                    id="manual-leads"
                    value={manualInput}
                    onChange={(e) => setManualInput(e.target.value)}
                    placeholder="john@example.com, John, Google&#10;jane@company.com, Jane, Apple"
                    rows={8}
                    className="w-full rounded-xl border border-input bg-background p-4 text-xs font-mono text-foreground focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:opacity-50"
                  />
                  <button
                    onClick={handleManualImport}
                    className="w-full rounded-xl bg-blue-600 py-3 text-sm font-bold text-white hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20"
                  >
                    Import manual list
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {!csvFile ? (
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border py-14 transition-all hover:border-blue-500/50 hover:bg-blue-50/5 group"
                    >
                      <input type="file" ref={fileInputRef} onChange={handleCsvUpload} accept=".csv" className="hidden" />
                      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-500 group-hover:scale-110 transition-transform">
                        <Upload className="h-8 w-8" />
                      </div>
                      <span className="text-sm font-bold text-foreground">Click to select CSV file</span>
                      <span className="mt-1 text-xs text-muted-foreground">Headers: email, first_name, company</span>
                    </div>
                  ) : (
                    <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                      {/* Row Count Summary */}
                      <div className="flex items-center justify-between px-1">
                          <span className="text-[10px] font-black uppercase tracking-widest text-foreground bg-blue-500/10 px-2 py-1 rounded-md">
                            {rawParsedData.length} Records Loaded
                          </span>
                          {invalidRows.size > 0 && (
                            <span className="text-[10px] font-black uppercase tracking-widest text-red-500 bg-red-500/10 px-2 py-1 rounded-md flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" /> {invalidRows.size} Needs Correction
                            </span>
                          )}
                      </div>

                      {/* Mapping UI */}
                      <div className="bg-muted/30 p-4 rounded-xl space-y-3">
                        <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground mb-2">Column Mapping</h4>
                        <div className="grid grid-cols-1 gap-2">
                          {['email', 'first_name', 'company', 'linkedin_url'].map(field => (
                            <div key={field} className="flex items-center gap-3">
                              <span className="w-24 text-[10px] font-bold text-muted-foreground uppercase">{field.replace(/_/g, ' ')}</span>
                              <select 
                                value={mappedHeaders[field] || ""}
                                onChange={(e) => {
                                    const newHeaders = { ...mappedHeaders, [field]: e.target.value };
                                    setMappedHeaders(newHeaders);
                                    // Update invalid rows immediately on mapping change
                                    const invalid = new Set<number>();
                                    rawParsedData.forEach((row, idx) => {
                                        if (!validateEmail(String(row[newHeaders['email']] || ""))) invalid.add(idx);
                                    });
                                    setInvalidRows(invalid);
                                }}
                                className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-xs font-semibold outline-none focus:ring-2 focus:ring-blue-500/20"
                              >
                                <option value="">(Ignore)</option>
                                {availableHeaders.map(h => (
                                  <option key={h} value={h}>{h}</option>
                                ))}
                              </select>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Preview Table */}
                      <div className="max-h-[300px] overflow-auto rounded-xl border border-border bg-background shadow-inner">
                        <table className="w-full text-left text-[11px] border-collapse">
                          <thead className="sticky top-0 bg-muted z-10 border-b border-border">
                            <tr>
                              <th className="p-2 font-bold uppercase text-muted-foreground">#</th>
                              <th className="p-2 font-bold uppercase text-muted-foreground">Status</th>
                              {Object.values(mappedHeaders).filter(h => !!h).map(h => (
                                <th key={h} className="p-2 font-bold uppercase text-muted-foreground">{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {rawParsedData.map((row, idx) => (
                              <tr key={idx} className={`border-b border-border/30 hover:bg-muted/20 transition-colors ${invalidRows.has(idx) ? "bg-red-500/5" : ""}`}>
                                <td className="p-2 text-muted-foreground font-mono">{idx + 1}</td>
                                <td className="p-2">
                                  {invalidRows.has(idx) ? 
                                    <div className="flex items-center gap-1 text-red-500" title="Invalid or missing email">
                                      <AlertCircle className="h-3 w-3" />
                                      <span className="text-[10px] font-black uppercase tracking-tight">Error</span>
                                    </div> : 
                                    <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                                  }
                                </td>
                                {Object.values(mappedHeaders).filter(h => !!h).map(h => (
                                  <td key={h} className={`p-2 truncate max-w-[120px] ${h === mappedHeaders['email'] && !validateEmail(row[h]) ? "text-red-500 font-bold" : ""}`}>
                                    {row[h] || "—"}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <button 
                          onClick={applyImport}
                          className="flex-1 rounded-xl bg-blue-600 py-4 text-sm font-black uppercase tracking-widest text-white hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20 active:scale-95"
                        >
                          Start Import ({rawParsedData.length} Records)
                        </button>
                        <button 
                          onClick={resetImport}
                          className="rounded-xl border border-border bg-card px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 transition-all"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {leads.length > 0 && !csvFile && (
                <div className="mt-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5 flex items-center justify-between shadow-inner">
                  <div className="flex items-center gap-3 text-sm font-bold text-emerald-600">
                    <CheckCircle2 className="h-5 w-5" /> {leads.length} leads loaded successfully
                  </div>
                  <button onClick={() => setLeads([])} className="text-[10px] font-bold text-muted-foreground hover:text-red-500 underline uppercase tracking-widest">Clear Data</button>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm border-opacity-50">
            <h4 className="mb-4 flex items-center gap-2 text-xs font-bold text-foreground">
              <Info className="h-4 w-4 text-blue-500" /> Campaign Strategy
            </h4>
            <div className="space-y-4">
               <div className="flex gap-4">
                  <div className="mt-1 h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                    <span className="text-[10px] font-bold text-blue-600">1</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">Ensure your subject lines are under 40 characters for best mobile visibility.</p>
               </div>
               <div className="flex gap-4">
                  <div className="mt-1 h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                    <span className="text-[10px] font-bold text-blue-600">2</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">Always test your template with a few manual leads before starting a full blast.</p>
               </div>
            </div>
          </div>
        </div>

        {/* Right Column: Template (7 cols) */}
        <div className="lg:col-span-12 xl:col-span-7 space-y-6 text-foreground">
          <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-lg border-opacity-50">
            <div className="border-b border-border bg-muted/30 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h3 className="flex items-center gap-2 font-bold">
                <Type className="h-4 w-4 text-purple-500" /> 2. Compose Template
              </h3>
              <div className="flex flex-wrap gap-2">
                <VariableChip label="First Name" onClick={() => insertVariable('first_name')} />
                <VariableChip label="Company" onClick={() => insertVariable('company')} />
                <VariableChip label="Email" onClick={() => insertVariable('email')} />
                <VariableChip label="LinkedIn" onClick={() => insertVariable('linkedin_url')} />
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Subject</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm font-semibold focus:ring-2 focus:ring-blue-500/20 transition-all shadow-sm"
                  placeholder="Campaign Subject Line"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Message Content</label>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  rows={10}
                  className="w-full rounded-xl border border-input bg-background p-4 text-sm leading-relaxed focus:ring-2 focus:ring-blue-500/20 transition-all resize-none font-medium shadow-sm"
                  placeholder="Hey {{first_name}}, just saw your work at {{company}}..."
                />
              </div>

              {/* Preview Card */}
              <div className="rounded-2xl border border-border bg-blue-500/[0.02] p-6 relative overflow-hidden group shadow-inner">
                <div className="absolute top-0 right-0 p-5 flex items-center gap-2">
                  {leads.length > 1 && (
                    <div className="flex items-center gap-1 mr-4 bg-background px-2.5 py-1.5 rounded-xl border border-border shadow-sm">
                      <button 
                        onClick={() => setPreviewIndex(prev => Math.max(0, prev - 1))}
                        disabled={previewIndex === 0}
                        className="p-1 rounded-lg hover:bg-muted disabled:opacity-30 transition-colors"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      <span className="text-[10px] font-mono font-bold px-3 text-foreground">
                        {previewIndex + 1} / {leads.length}
                      </span>
                      <button 
                        onClick={() => setPreviewIndex(prev => Math.min(leads.length - 1, prev + 1))}
                        disabled={previewIndex === leads.length - 1}
                        className="p-1 rounded-lg hover:bg-muted disabled:opacity-30 transition-colors"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                  <Sparkles className="h-4 w-4 text-blue-500 opacity-20 group-hover:opacity-100 transition-opacity" />
                </div>
                
                <h4 className="mb-5 text-[10px] font-extrabold text-blue-600 uppercase tracking-[0.2em] flex items-center gap-2">
                  <div className="h-1 w-8 bg-blue-600 rounded-full" /> Personalization Preview
                </h4>
                
                <div className="space-y-5">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase w-12 text-right">To:</span>
                    <span className="text-xs font-mono font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">{leads[previewIndex]?.email || "prospect@email.com"}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase w-12 text-right">Sub:</span>
                    <span className="text-sm font-bold">
                      {subject
                        .replace(/\{\{company\}\}/g, leads[previewIndex]?.company || 'Your Company')
                        .replace(/\{\{first_name\}\}/g, leads[previewIndex]?.first_name || 'there')}
                    </span>
                  </div>
                  <div className="rounded-2xl bg-white p-6 border border-border shadow-sm mt-2">
                    <p className="whitespace-pre-wrap text-sm text-foreground/80 leading-relaxed italic">
                      {body
                        .replace(/\{\{company\}\}/g, leads[previewIndex]?.company || 'your company')
                        .replace(/\{\{first_name\}\}/g, leads[previewIndex]?.first_name || 'there')
                        .replace(/\{\{email\}\}/g, leads[previewIndex]?.email || "prospect@email.com")}
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
      className="flex items-center gap-1.5 rounded-lg bg-blue-600/10 px-3 py-1.5 text-[10px] font-bold text-blue-600 hover:bg-blue-600 hover:text-white transition-all transform active:scale-95 border border-blue-600/20"
    >
      <Hash className="h-3 w-3" /> {label}
    </button>
  );
}
