"use client";

import React from "react";
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
  Columns,
  Sparkles as SparklesIcon,
  Plus,
  Trash2,
  Calendar,
  Layers,
} from "lucide-react";
import Papa from "papaparse";
import { api } from "@/lib/api";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface Lead {
  email: string;
  first_name?: string;
  company?: string;
  linkedin_url?: string;
  [key: string]: any;
}

export default function BulkEmailPage() {
  const [subject, setSubject] = React.useState("Quick update regarding {{company}}");
  const [body, setBody] = React.useState("Hi {{first_name}},\n\nI noticed what you're doing at {{company}} and wanted to reach out...\n\nBest regards,\nLeadGenius Team");
  const [leads, setLeads] = React.useState<Lead[]>([]);
  const [manualInput, setManualInput] = React.useState("");
  const [importMode, setImportMode] = React.useState<'csv' | 'manual'>('manual');
  const [isSending, setIsSending] = React.useState(false);
  const [progress, setProgress] = React.useState({ current: 0, total: 0, success: 0, failed: 0 });
  const [previewIndex, setPreviewIndex] = React.useState(0);
  const [showProgressUI, setShowProgressUI] = React.useState(false);
  
  // New Preview States
  const [csvFile, setCsvFile] = React.useState<File | null>(null);
  const [rawParsedData, setRawParsedData] = React.useState<any[]>([]);
  const [mappedHeaders, setMappedHeaders] = React.useState<Record<string, string>>({});
  const [availableHeaders, setAvailableHeaders] = React.useState<string[]>([]);
  const [invalidRows, setInvalidRows] = React.useState<Set<number>>(new Set());
  const [failedLeads, setFailedLeads] = React.useState<any[]>([]);
  
  // Follow-up States
  const [isFollowUpModalOpen, setIsFollowUpModalOpen] = React.useState(false);
  const [campaignName, setCampaignName] = React.useState(`Bulk Blast - ${new Date().toLocaleDateString()}`);
  const [enableFollowUps, setEnableFollowUps] = React.useState(false);
  const [followUps, setFollowUps] = React.useState<{message: string, delay_days: number, channel: 'email' | 'linkedin', subject?: string}[]>([
    { message: "", delay_days: 3, channel: 'email', subject: "Following up" }
  ]);
  
  const [emailAccounts, setEmailAccounts] = React.useState<any[]>([]);
  const [selectedAccountId, setSelectedAccountId] = React.useState<string>("auto");

  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  React.useEffect(() => {
    async function fetchAccounts() {
      try {
        const { data } = await api.get<any[]>("/api/email/accounts");
        if (data) setEmailAccounts(data);
      } catch (err) {
        console.error("Failed to fetch accounts:", err);
      }
    }
    fetchAccounts();
  }, []);

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
      toast.error("No valid leads found to send. Please correct the data.");
      return;
    }

    // Instead of sending immediately, open the follow-up config modal
    setIsFollowUpModalOpen(true);
  };

  const executeBlast = async () => {
    const validLeads = leads.filter(l => validateEmail(l.email));
    setIsFollowUpModalOpen(false);
    setIsSending(true);
    setShowProgressUI(true);
    setProgress({ current: 0, total: validLeads.length, success: 0, failed: 0 });
    setFailedLeads([]);

    try {
      const response = await api.post<any>("/api/email/batch-send", {
        template: { subject, body },
        leads: validLeads,
        campaign_name: campaignName,
        account_id: selectedAccountId === 'auto' ? null : selectedAccountId,
        follow_ups: enableFollowUps ? followUps : []
      });

      console.log("Batch start response:", response);

      if (response.data?.batch_id) {
        const batchId = response.data.batch_id;
        const actualQueued = response.data.queued || 0;
        
        // Update total to what was actually accepted by the backend
        setProgress(p => ({ ...p, total: actualQueued }));
        
        toast.success(`Broadcasting initiated for "${campaignName}"`);
        if (response.data.failed_initial > 0) {
          toast.warning(`${response.data.failed_initial} leads could not be queued. Check console for details.`);
          console.warn("Initial queueing errors:", response.data.errors);
        }
        
        // Start polling
        let pollingInterval = setInterval(async () => {
          try {
            const statusRes = await api.get<any>(`/api/email/batch-status/${batchId}`);
            console.log("Poll status:", statusRes);

            if (statusRes.data) {
              const { stats, is_completed, errors } = statusRes.data;
              
              const currentTotal = stats.total || actualQueued;
              setProgress({
                total: currentTotal,
                current: stats.sent + stats.failed + stats.queued + stats.sending, // All that are not pending
                success: stats.sent,
                failed: stats.failed
              });
              
              if (errors && errors.length > 0) {
                setFailedLeads(errors);
              }

              if (is_completed) {
                clearInterval(pollingInterval);
                setIsSending(false);
                if (stats.failed > 0) {
                   toast.warning(`${stats.failed} emails failed to deliver.`);
                } else {
                   toast.success("Batch successfully delivered!");
                }
              }
            } else if (statusRes.error) {
              console.error("Polling API error:", statusRes.error);
              // Don't clear interval on transient errors, but log them
            }
          } catch (pollingError) {
            console.error("Polling exception:", pollingError);
          }
        }, 3000); 

      } else {
        setIsSending(false);
        setShowProgressUI(false); // Hide the UI if we couldn't even start
        toast.error(response.error?.detail || "Initial queueing failed. No emails were sent.");
      }
    } catch (error) {
      setIsSending(false);
      setShowProgressUI(false);
      console.error("Execute Blast Error:", error);
      toast.error("An unexpected error occurred while starting the batch.");
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

  const addFollowUp = () => {
    setFollowUps([...followUps, { 
      message: "", 
      delay_days: 3, 
      channel: 'email',
      subject: "Following up"
    }]);
  };

  const removeFollowUp = (index: number) => {
    setFollowUps(followUps.filter((_, i) => i !== index));
  };

  const updateFollowUp = (index: number, field: string, value: any) => {
    const newFollowUps = [...followUps];
    (newFollowUps[index] as any)[field] = value;
    setFollowUps(newFollowUps);
  };

  return (
    <div className="flex h-full w-full flex-col overflow-y-auto bg-background p-8">
      {/* Follow-up Config Modal */}
      <Dialog open={isFollowUpModalOpen} onOpenChange={setIsFollowUpModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl p-0 gap-0 border-none shadow-2xl">
          <div className="sticky top-0 z-10 bg-card p-6 border-b border-border flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl font-black text-foreground">Finalize Campaign</DialogTitle>
              <DialogDescription className="text-sm font-medium mt-1">Configure follow-ups and review settings before blasting.</DialogDescription>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-blue-600/10 text-blue-600 flex items-center justify-center">
              <SparklesIcon className="h-6 w-6" />
            </div>
          </div>

          <div className="p-8 space-y-8">
            {/* Campaign Name */}
            <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Campaign Name</Label>
              <Input 
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
                placeholder="Name your blast (e.g., Q1 Tech Outreach)"
                className="h-12 rounded-2xl bg-muted/30 border-none px-5 text-lg font-bold placeholder:text-muted-foreground/40"
              />
            </div>

            {/* Sender Account Selection */}
            <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1 flex items-center gap-2">
                <Mail className="h-3 w-3" /> Sending Profile
              </Label>
              <Select value={selectedAccountId} onValueChange={setSelectedAccountId}>
                <SelectTrigger className="h-12 rounded-2xl bg-muted/30 border-none px-5 font-bold">
                  <SelectValue placeholder="Select email account" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-none shadow-2xl p-2">
                  <SelectItem value="auto" className="rounded-xl font-bold py-3">
                    <div className="flex flex-col">
                      <span>Auto-Rotate between accounts</span>
                      <span className="text-[10px] font-medium text-muted-foreground">Best for deliverability</span>
                    </div>
                  </SelectItem>
                  {emailAccounts.map(acc => (
                    <SelectItem key={acc.id} value={acc.id} className="rounded-xl font-bold py-3">
                      <div className="flex flex-col">
                        <span>{acc.sender_name || acc.email}</span>
                        <span className="text-[10px] font-medium text-muted-foreground">{acc.email}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Toggle Follow-ups */}
            <div className="flex items-center justify-between rounded-2xl border border-border bg-blue-500/5 p-6 border-blue-500/20 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-blue-500 text-white flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <RefreshCcw className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-foreground">Enable Automated Follow-ups</h4>
                  <p className="text-[10px] text-muted-foreground font-medium">Auto-send messages if they don't reply within X days.</p>
                </div>
              </div>
              <Switch checked={enableFollowUps} onCheckedChange={setEnableFollowUps} />
            </div>

            {/* Follow-up Builder */}
            {enableFollowUps && (
              <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-300">
                <div className="flex items-center justify-between px-1">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Follow-up Sequence</h4>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={addFollowUp}
                    className="h-8 rounded-lg gap-1 font-bold text-xs"
                  >
                    <Plus className="h-3 w-3" /> Add Step
                  </Button>
                </div>

                <div className="space-y-4">
                  {followUps.map((step, idx) => (
                    <div key={idx} className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-4 relative group">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-6 w-6 rounded-lg bg-blue-600 text-white text-[10px] font-black flex items-center justify-center">
                            {idx + 1}
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-widest text-foreground">Step {idx + 1}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-muted-foreground">Wait</span>
                            <Input 
                              type="number"
                              value={step.delay_days || ""}
                              onChange={(e) => {
                                const val = parseInt(e.target.value);
                                updateFollowUp(idx, 'delay_days', isNaN(val) ? 0 : val);
                              }}
                              className="w-14 h-8 rounded-lg text-center font-bold p-0"
                            />
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Days</span>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => removeFollowUp(idx)}
                            className="h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                           <Label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Channel</Label>
                           <Select 
                             value={step.channel} 
                             onValueChange={(val: any) => updateFollowUp(idx, 'channel', val)}
                           >
                              <SelectTrigger className="h-10 rounded-xl bg-muted/30">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="email">Email</SelectItem>
                                <SelectItem value="linkedin">LinkedIn</SelectItem>
                              </SelectContent>
                           </Select>
                        </div>
                        {step.channel === 'email' && (
                          <div className="space-y-2">
                            <Label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Subject</Label>
                            <Input 
                              value={step.subject}
                              onChange={(e) => updateFollowUp(idx, 'subject', e.target.value)}
                              placeholder="Follow up subject"
                              className="h-10 rounded-xl bg-muted/30"
                            />
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Message Content</Label>
                        <Textarea 
                          value={step.message}
                          onChange={(e) => updateFollowUp(idx, 'message', e.target.value)}
                          placeholder="Hey {{first_name}}, following up on my previous message..."
                          rows={3}
                          className="rounded-xl bg-muted/30 border-none resize-none text-sm leading-relaxed"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="sticky bottom-0 bg-card p-6 border-t border-border mt-auto sm:justify-between items-center gap-4">
            <div className="text-xs text-muted-foreground flex items-center gap-2">
              <Layers className="h-4 w-4" />
              <span>Blasting to <strong className="text-foreground">{leads.length} leads</strong> with <strong className="text-foreground">{enableFollowUps ? followUps.length : 0} follow-ups</strong>.</span>
            </div>
            <div className="flex gap-3">
              <Button variant="ghost" className="rounded-xl font-bold" onClick={() => setIsFollowUpModalOpen(false)}>Back to Compose</Button>
              <Button 
                onClick={executeBlast}
                className="rounded-xl px-8 font-black uppercase tracking-widest bg-blue-600 hover:bg-blue-500 shadow-xl shadow-blue-500/20"
              >
                Launch & Blast
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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
              {isSending ? (
                  progress.current < progress.total ? "Status: Sending emails..." : "Status: Verifying delivery..."
              ) : "Status: Completed 🎉"}
            </h3>
            <span className="text-xs font-mono font-bold text-blue-500">
              {progress.current} / {progress.total} Delivered
            </span>
          </div>
          
          <div className="h-2 w-full rounded-full bg-blue-200/30 overflow-hidden shadow-inner">
            <div 
              className="h-full bg-blue-600 transition-all duration-300 ease-out"
              style={{ width: `${progress.total > 0 ? Math.min(100, (progress.current / progress.total) * 100) : 0}%` }}
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
