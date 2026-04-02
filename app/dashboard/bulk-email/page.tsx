"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Baseline,
  Strikethrough,
  Highlighter,
  ChevronDown,
  LayoutGrid,
  Link as LinkIcon,
  Pencil
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
  SelectValue,
  SelectSeparator,
  SelectLabel,
  SelectGroup
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  const [subject, setSubject] = React.useState("");
  const [body, setBody] = React.useState("");
  const [leads, setLeads] = React.useState<Lead[]>([]);
  const [manualInput, setManualInput] = React.useState("");
  const [manualLeadsData, setManualLeadsData] = React.useState<any[]>([
    { email: "", name: "", company: "" }
  ]);
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
  const [followUps, setFollowUps] = React.useState<{ message: string, delay_days: number, channel: 'email' | 'linkedin', subject?: string }[]>([
    { message: "", delay_days: 3, channel: 'email', subject: "Following up" }
  ]);

  const [emailAccounts, setEmailAccounts] = React.useState<any[]>([]);
  const [selectedAccountId, setSelectedAccountId] = React.useState<string>("auto");
  const [schedulingStatus, setSchedulingStatus] = React.useState<{ is_active: boolean, message: string, next_available?: string } | null>(null);

  const router = useRouter();
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const editorRef = React.useRef<HTMLDivElement>(null);

  const [templates, setTemplates] = React.useState<any[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = React.useState<string>("");

  // Custom Variables States
  const [userVariables, setUserVariables] = React.useState<any[]>([]);
  const [detectedVariables, setDetectedVariables] = React.useState<string[]>([]);
  const [isVarModalOpen, setIsVarModalOpen] = React.useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const [newVarKey, setNewVarKey] = React.useState("");

  const [columnMappings, setColumnMappings] = React.useState<string[]>(['email', 'name', 'company']);
  const [newVarDefault, setNewVarDefault] = React.useState("");
  const [newTemplateName, setNewTemplateName] = React.useState("");
  const [customInsertText, setCustomInsertText] = React.useState("");
  const [isSavingTemplate, setIsSavingTemplate] = React.useState(false);
  const [isEditMode, setIsEditMode] = React.useState(false);
  const [editingTemplateId, setEditingTemplateId] = React.useState<string | null>(null);
  const [modalSubject, setModalSubject] = React.useState("");
  const [modalBody, setModalBody] = React.useState("");

  const validateEmail = (email: any) => {
    if (!email || typeof email !== 'string') return false;
    const trimmed = email.trim();
    return trimmed.includes('@') && trimmed.includes('.');
  };

  const handleSaveTemplate = async () => {
    if (!newTemplateName) {
      toast.error("Please enter a template name");
      return;
    }
    setIsSavingTemplate(true);
    try {
      if (isEditMode && editingTemplateId) {
        const response = await api.patch<any>(`/api/outreach/templates/${editingTemplateId}`, {
          name: newTemplateName,
          subject: modalSubject,
          content: modalBody
        });
        if (response.error) throw new Error(response.error.detail || "Server error");
        setTemplates(prev => prev.map(t => t.id === editingTemplateId ? response.data : t));
        toast.success(`Template updated successfully!`);
      } else {
        const response = await api.post<any>("/api/outreach/templates/", {
          name: newTemplateName,
          subject: modalSubject,
          content: modalBody,
          channel: 'email'
        });
        if (response.error) throw new Error(response.error.detail || "Server error");
        setTemplates([response.data, ...templates]);
        toast.success(`Template "${newTemplateName}" saved!`);
      }
      setNewTemplateName("");
      setIsEditMode(false);
      setEditingTemplateId(null);
    } catch (err: any) {
      toast.error(`Save failed: ${err.message || "Please check your connection"}`);
    } finally {
      setIsSavingTemplate(false);
    }
  };

  const insertVariable = (key: string) => {
    if (editorRef.current) {
      editorRef.current.focus();
      document.execCommand('insertText', false, `{{${key}}}`);
    } else {
      setBody(prev => prev + ` {{${key}}}`);
    }
  };

  React.useEffect(() => {
    async function fetchTemplates() {
      try {
        const response = await api.get<any>("/api/outreach/templates/?channel=email");
        if (response.data?.items && Array.isArray(response.data.items)) {
          setTemplates(response.data.items);
        } else if (Array.isArray(response.data)) {
          setTemplates(response.data);
        }
      } catch (err) {
        console.error("Failed to fetch templates:", err);
      }
    }

    async function fetchEmailAccounts() {
      try {
        const response = await api.get<any[]>("/api/email/accounts");
        if (response.data) {
          setEmailAccounts(response.data);
          // Auto-select preferred account if exists
          const prefRes = await api.get<any>("/api/email/preference");
          if (prefRes.data?.preferred_account_id) {
            setSelectedAccountId(prefRes.data.preferred_account_id);
          }
        }
      } catch (err) {
        console.error("Failed to fetch email accounts:", err);
      }
    }

    async function fetchUserVariables() {
      try {
        const response = await api.get<any[]>("/api/user-variables/");
        if (response.data) setUserVariables(response.data);
      } catch (err) {
        console.error("Failed to fetch user variables:", err);
      }
    }

    fetchTemplates();
    fetchEmailAccounts();
    fetchUserVariables();
  }, []);

  // Smart Variable Detection
  React.useEffect(() => {
    const combined = subject + body;
    const matches = Array.from(combined.matchAll(/\{\{([a-zA-Z0-9\_]+)\}\}/g));
    const unique = Array.from(new Set(matches.map(m => m[1])));
    setDetectedVariables(unique);
  }, [subject, body]);

  const handleCreateVariable = async () => {
    if (!newVarKey) return;
    try {
      const response = await api.post("/api/user-variables/", {
        variable_key: newVarKey,
        default_value: newVarDefault
      });
      setUserVariables([...userVariables, response.data]);
      setNewVarKey("");
      setNewVarDefault("");
      toast.success(`Created variable {{${newVarKey}}}`);
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Failed to create variable");
    }
  };

  const openEditTemplate = (template: any) => {
    setIsEditMode(true);
    setEditingTemplateId(template.id);
    setNewTemplateName(template.name);
    setModalSubject(template.subject || "");
    setModalBody(template.content || "");
    setIsCreateModalOpen(true);
  };

  const deleteTemplate = async (id: string, name: string) => {
     if (!window.confirm(`Are you sure you want to delete template "${name}"?`)) return;
     try {
       const res = await api.delete(`/api/outreach/templates/${id}`);
       if (res.error) throw new Error(res.error.detail);
       setTemplates(prev => prev.filter(t => t.id !== id));
       if (selectedTemplateId === id) setSelectedTemplateId("");
       toast.success("Template deleted");
     } catch (err: any) {
       toast.error(`Delete failed: ${err.message || "Please try again"}`);
     }
  };

  const deleteVariable = async (id: string, key: string) => {
    try {
      await api.delete(`/api/user-variables/${id}`);
      setUserVariables(userVariables.filter(v => v.id !== id));
      toast.success(`Deleted variable {{${key}}}`);
    } catch (err) {
      toast.error("Failed to delete variable");
    }
  };

  const handleTemplateSelect = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setSelectedTemplateId(templateId);
      if (template.subject) setSubject(template.subject);
      setBody(template.content);
      toast.success(`Loaded template: ${template.name}`);
    }
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

    // Capture all rows, normalize ALL keys to lowercase for foolproof variable replacement
    const finalLeads = rawParsedData.map(row => {
      const normalizedRow: Record<string, any> = {};
      Object.entries(row).forEach(([k, v]) => {
        normalizedRow[k.toLowerCase()] = v;
      });

      return {
        email: String(normalizedRow['email'] || "").trim(),
        first_name: String(normalizedRow['first_name'] || normalizedRow['firstname'] || "").trim(),
        company: String(normalizedRow['company'] || "").trim(),
        ...normalizedRow
      };
    });

    setLeads(finalLeads);
    const validCount = finalLeads.filter(l => validateEmail(l.email)).length;

    if (validCount < finalLeads.length) {
      toast.warning(`${finalLeads.length - validCount} records have invalid emails and will be skipped during sending.`);
    }
    toast.success(`Success! ${finalLeads.length} records imported.`);
  };

  const handleManualImport = () => {
    // Collect non-empty rows from the table
    const validRows = manualLeadsData.filter(l => 
      columnMappings.some(m => l[m] && l[m].trim() !== "")
    );
    
    if (validRows.length === 0) {
      toast.error("Please enter at least one lead.");
      return;
    }

    const processedLeads = validRows.map(row => {
        const lead: any = {};
        columnMappings.forEach(m => {
            // ALWAYS normalize to lowercase keys for infallible template replacement
            lead[m.toLowerCase()] = String(row[m] || "").trim();
        });
        return lead;
    });

    setLeads(processedLeads);
    setPreviewIndex(0);
    const validCount = processedLeads.filter(l => validateEmail(l.email)).length;
    toast.success(`${processedLeads.length} leads added to campaign (${validCount} valid emails).`);
  };

  const addManualRow = () => {
    const newRow: any = {};
    columnMappings.forEach(m => newRow[m] = "");
    setManualLeadsData([...manualLeadsData, newRow]);
  };
  
  const addColumnMapping = (key: string) => {
      if (columnMappings.includes(key)) return;
      setColumnMappings([...columnMappings, key]);
      // Update existing rows too
      const updatedData = manualLeadsData.map(r => ({ ...r, [key]: "" }));
      setManualLeadsData(updatedData);
  };

  const updateManualLead = (index: number, key: string, val: string) => {
    const updated = [...manualLeadsData];
    updated[index] = { ...updated[index], [key]: val };
    setManualLeadsData(updated);
  };

  const removeManualRow = (index: number) => {
    if (manualLeadsData.length <= 1) {
       setManualLeadsData([{ email: "", first_name: "", company: "" }]);
       return;
    }
    setManualLeadsData(manualLeadsData.filter((_, i) => i !== index));
  };

  const handleSendBatch = async () => {
    const validLeads = leads.filter(l => validateEmail(l.email));

    if (validLeads.length === 0) {
      toast.error("No valid leads found to send. Please correct the data.");
      return;
    }

    // Auto-scheduling is handled by the backend now, so we don't block here.
    // Instead, we just let the user proceed to the follow-up modal.

    // Instead of sending immediately, open the follow-up config modal
    setIsFollowUpModalOpen(true);
  };

  const executeBlast = async () => {
    const validLeads = leads.filter(l => validateEmail(l.email));
    setIsFollowUpModalOpen(false);

    // Final check before blast
    // Backend handles auto-scheduling logic

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

        // Case 2: Scheduled for future -> Redirect
        if (response.data.status === "scheduled") {
          setIsSending(false);
          toast.success(response.data.message || "Messages scheduled for later.");
          // Redirect to tracking page
          router.push("/dashboard/scheduled-messages");
          return;
        }

        // Case 1: Sending now -> Show Progress UI
        setIsSending(true);
        setShowProgressUI(true);
        setProgress({ current: 0, total: validLeads.length, success: 0, failed: 0 });

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

  const execCommand = (command: string, value: string = "") => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      setBody(editorRef.current.innerHTML);
    }
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
            {/* Variable Mapping / Overrides */}
            {detectedVariables.filter(v => !['first_name', 'company', 'email'].includes(v)).length > 0 && (
              <div className="space-y-4 pt-4 border-t border-border">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1 flex items-center gap-2">
                  <Hash className="h-3 w-3" /> Variable Overrides (Batch Level)
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted/20 p-6 rounded-2xl border border-border">
                  {detectedVariables.filter(v => !['first_name', 'company', 'email'].includes(v)).map(vkey => (
                    <div key={vkey} className="space-y-2">
                      <Label className="text-[10px] font-bold text-foreground">{"{{"}{vkey}{"}}"}</Label>
                      <Input 
                        placeholder="Fallback value..." 
                        defaultValue={userVariables.find(uv => uv.variable_key === vkey)?.default_value || ""}
                        onBlur={async (e) => {
                           const uv = userVariables.find(u => u.variable_key === vkey);
                           if (uv) {
                              toast.info(`Using "${e.target.value}" for {{${vkey}}}`);
                           }
                        }}
                        className="h-10 rounded-xl bg-white border-none shadow-sm text-xs"
                      />
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
                className="rounded-xl px-8 font-black uppercase tracking-widest bg-blue-600 hover:bg-blue-500 shadow-xl shadow-blue-500/20 disabled:opacity-50"
              >
                {schedulingStatus && !schedulingStatus.is_active ? "Schedule & Blast" : "Launch & Blast"}
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
            {isSending ? `Processing...` : (schedulingStatus && !schedulingStatus.is_active ? `Schedule ${leads.length} Emails` : `Blast ${leads.length} Emails`)}
          </button>
        </div>
      </div>

      {/* Scheduling Info (instead of Warning) */}
      {schedulingStatus && !schedulingStatus.is_active && (
        <div className="mb-6 rounded-2xl border border-blue-500/20 bg-blue-500/5 p-4 flex items-center gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center flex-shrink-0">
            <Calendar className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-bold text-blue-700">Smart Scheduling Active</h4>
            <p className="text-xs text-blue-600/80 font-medium">
              You are currently outside your sending window. {schedulingStatus.message}.
              Your emails will be <strong>automatically queued</strong> to start sending when the window opens.
            </p>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest shadow-sm shadow-blue-500/20 whitespace-nowrap">
            AUTO-QUEUE ENABLED
          </div>
        </div>
      )}

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

      <div className="flex flex-col gap-8">

        {/* Top/Left Column: Import */}
        <div className="w-full space-y-6">
          <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-lg border-opacity-50">
            <div className="border-b border-border bg-muted/30 px-6 py-4 text-foreground">
              <h3 className="flex items-center gap-2 font-bold">
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
                  <div className="flex items-center justify-between px-1">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                      <LayoutGrid className="h-3 w-3" /> Lead Entry Table
                    </label>
                    <div className="flex items-center gap-2">
                      <Button 
                        onClick={() => {
                          handleManualImport();
                          toast.success("Preview updated with current table data!");
                        }}
                        size="sm"
                        className="h-6 rounded-lg bg-blue-600 text-[9px] font-black uppercase tracking-widest text-white shadow-sm hover:bg-blue-700 active:scale-95 px-3"
                      >
                        <RefreshCcw className="h-2.5 w-2.5 mr-1" /> Update Preview
                      </Button>
                      <button 
                        onClick={() => setManualLeadsData([{}])}
                        className="text-[9px] font-bold text-red-500 hover:underline"
                      >
                        Clear All
                      </button>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-border overflow-hidden bg-background shadow-inner">
                    <div className="flex">
                      {/* Fixed Left Column: Field Selection */}
                      <div className="w-52 bg-muted/30 border-r border-border shrink-0">
                        <div className="h-12 border-b border-border flex items-center px-4 font-black text-[10px] uppercase tracking-widest text-muted-foreground/60 bg-muted/50">
                          Field
                        </div>
                        <div className="divide-y divide-border/40">
                          {columnMappings.map((m, colIdx) => (
                            <div key={colIdx} className="h-14 flex items-center px-2 group/field relative">
                               <div className="flex-1 flex items-center gap-1">
                                   <input 
                                     value={m}
                                     onChange={(e) => {
                                        const newKey = e.target.value.replace(/[^a-zA-Z0-9\_]/g, '');
                                        if (newKey === m) return;
                                        // Update columnMappings
                                        const updated = [...columnMappings];
                                        updated[colIdx] = newKey;
                                        setColumnMappings(updated);
                                        // Update leads data
                                        setManualLeadsData(manualLeadsData.map(l => {
                                            const newRow = { ...l, [newKey]: l[m] || "" };
                                            delete newRow[m];
                                            return newRow;
                                        }));
                                     }}
                                     className="flex-1 px-3 py-2 border border-blue-200 bg-white rounded-lg text-[10px] font-black uppercase text-blue-600 tracking-widest outline-none focus:ring-2 focus:ring-blue-500/20 shadow-sm"
                                     placeholder="Field Name"
                                   />
                               </div>

                               <button 
                                 onClick={() => {
                                    const updated = columnMappings.filter((_, i) => i !== colIdx);
                                    setColumnMappings(updated);
                                 }}
                                 className="absolute -right-2 top-1/2 -translate-y-1/2 h-5 w-5 rounded-full bg-red-100 text-red-600 flex items-center justify-center opacity-0 group-hover/field:opacity-100 transition-opacity z-10 hover:bg-red-200"
                               >
                                  <X className="h-2.5 w-2.5" />
                               </button>
                            </div>
                          ))}
                          <div className="h-14 flex items-center justify-center bg-blue-50/50">
                             <button 
                               onClick={() => {
                                  const name = `Var_${columnMappings.length + 1}`;
                                  addColumnMapping(name);
                               }}
                               className="h-10 w-full mx-2 rounded-lg bg-blue-600 text-white flex items-center justify-center gap-2 hover:bg-blue-500 shadow-md transition-all active:scale-95"
                             >
                                <Plus className="h-4 w-4" />
                                <span className="text-[9px] font-black uppercase tracking-widest">New Field</span>
                             </button>
                          </div>
                        </div>
                      </div>

                      {/* Right Section: Lead Columns (Values) */}
                      <div className="flex-1 overflow-x-auto bg-white flex divide-x divide-border/30">
                        {manualLeadsData.map((lead, idx) => (
                          <div key={idx} className="w-56 shrink-0 group hover:bg-slate-50/50">
                            <div className="h-12 border-b border-border bg-muted/10 flex items-center justify-between px-3">
                               <span className="text-[10px] text-muted-foreground font-bold italic">Lead {idx + 1}</span>
                               <button onClick={() => removeManualRow(idx)} className="text-muted-foreground hover:text-red-500 opacity-0 group-hover:opacity-100"><X className="h-3 w-3" /></button>
                            </div>
                            <div className="divide-y divide-border/20">
                               {columnMappings.map((m, colIdx) => (
                                  <div key={colIdx} className="h-14 p-2">
                                     <input 
                                       value={lead[m] || ""}
                                       onChange={(e) => updateManualLead(idx, m, e.target.value)}
                                       className="w-full h-full bg-white border border-border focus:ring-2 focus:ring-blue-500/20 rounded-lg px-3 text-xs font-medium transition-all shadow-sm"
                                     />
                                  </div>
                               ))}
                               <div className="h-14 bg-muted/5" />
                            </div>
                          </div>
                        ))}
                        <div className="w-32 shrink-0 flex items-center justify-center border-l bg-slate-50/20">
                           <button onClick={addManualRow} className="flex flex-col items-center gap-2 text-muted-foreground hover:text-blue-600 transition-colors">
                              <Plus className="h-6 w-6 border-2 border-dashed border-border rounded-lg p-1" />
                              <span className="text-[9px] font-black uppercase">Add row</span>
                           </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={handleManualImport}
                      className="flex-1 rounded-xl bg-blue-600 py-3 text-sm font-black uppercase tracking-widest text-white shadow-lg shadow-blue-500/20"
                    >
                      Load into Campaign
                    </button>
                  </div>
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

        {/* Bottom/Right Column: Template */}
        <div className="w-full space-y-6 text-foreground">
          <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-lg border-opacity-50">
            <div className="border-b border-border bg-slate-100/50 px-5 py-3 flex flex-col gap-0 border-opacity-50">
              <div className="flex items-center justify-between mb-2">
                <h3 className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">
                  <Type className="h-4 w-4 text-purple-600" /> 2. Compose Template
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  <VariableChip label="First Name" onClick={() => insertVariable('first_name')} />
                  <VariableChip label="Company" onClick={() => insertVariable('company')} />
                  {userVariables.slice(0, 3).map(v => (
                    <VariableChip key={v.id} label={v.variable_key} onClick={() => insertVariable(v.variable_key)} />
                  ))}
                  {userVariables.length > 3 && (
                     <Select onValueChange={insertVariable}>
                        <SelectTrigger className="h-6 px-2 rounded-lg bg-white border border-slate-200 text-[10px] font-bold text-slate-500 w-auto min-w-[30px] shadow-sm">
                           <Plus className="h-3 w-3" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-none shadow-2xl">
                           {userVariables.slice(3).map(v => (
                             <SelectItem key={v.id} value={v.variable_key} className="text-[10px] font-bold">{v.variable_key}</SelectItem>
                           ))}
                        </SelectContent>
                     </Select>
                  )}
                </div>
              </div>

              {/* Word-Style Toolbar */}
              <div className="flex flex-wrap items-center bg-white border border-slate-200 rounded-xl p-1 divide-x divide-slate-200 shadow-sm">
                <div className="flex flex-col px-3 py-1 gap-1 min-w-[280px]">
                  <div className="flex items-center gap-1.5 mb-1">
                    <div className="flex h-7 items-center justify-between gap-1 rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-[10px] font-bold text-slate-700 shadow-sm w-[110px]">
                      <span className="truncate">Inter</span>
                      <ChevronDown size={10} className="text-slate-400 shrink-0" />
                    </div>
                    <div className="flex h-7 items-center justify-between gap-1 rounded-lg border border-slate-300 bg-white px-2 py-1 text-[10px] font-bold text-slate-700 shadow-sm w-[45px]">
                      <span>12</span>
                      <ChevronDown size={10} className="text-slate-400 shrink-0" />
                    </div>
                    <div className="flex gap-1 pl-1">
                      <ToolbarButton small icon={<Baseline size={13} />} />
                      <ToolbarButton small icon={<Highlighter size={13} className="text-yellow-600" />} />
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <ToolbarButton icon={<Bold size={14} />} onClick={() => execCommand('bold')} />
                    <ToolbarButton icon={<Italic size={14} />} onClick={() => execCommand('italic')} />
                    <ToolbarButton icon={<Underline size={14} />} onClick={() => execCommand('underline')} />
                    <ToolbarButton icon={<Strikethrough size={14} />} onClick={() => execCommand('strikeThrough')} />
                    <div className="w-px h-4 bg-slate-200 mx-1.5" />
                    <ToolbarButton icon={<LinkIcon size={14} />} onClick={() => {
                      const url = prompt("Enter URL:", "https://");
                      if (url) execCommand('createLink', url);
                    }} />
                  </div>
                  <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1.5 text-center">Font</div>
                </div>

                <div className="flex flex-col px-4 py-1 gap-1 min-w-[200px]">
                  <div className="flex items-center gap-1 mb-1">
                    <ToolbarButton icon={<List size={14} />} onClick={() => execCommand('insertUnorderedList')} />
                    <ToolbarButton icon={<ListOrdered size={14} />} onClick={() => execCommand('insertOrderedList')} />
                    <div className="w-px h-4 bg-slate-200 mx-1.5" />
                    <div className="flex items-center gap-1.5 p-1 bg-slate-50 rounded-xl border border-slate-200 shadow-sm">
                      <Select value={selectedTemplateId} onValueChange={handleTemplateSelect}>
                        <SelectTrigger className="h-8 w-[160px] rounded-lg border-none bg-transparent px-3 py-1 text-[10px] font-black uppercase text-slate-700 outline-none focus:ring-0">
                          <SelectValue placeholder="Chose Template" />
                        </SelectTrigger>
                        <SelectContent className="rounded-[20px] border-none shadow-2xl p-2 z-[9999] bg-white w-[220px]">
                          <div className="p-2 mb-1">
                            <Button 
                              onClick={() => {
                                setIsEditMode(false);
                                setEditingTemplateId(null);
                                setNewTemplateName("");
                                setModalSubject("");
                                setModalBody("");
                                setIsCreateModalOpen(true);
                              }}
                              className="w-full h-8 rounded-lg bg-blue-600 text-white font-black text-[9px] uppercase tracking-widest hover:bg-blue-500 shadow-sm"
                            >
                               + Create New Template
                            </Button>
                          </div>
                          <SelectSeparator />
                          {templates.map(t => (
                            <div key={t.id} className="group relative flex items-center pr-1">
                              <SelectItem value={t.id} className="rounded-lg font-black text-[11px] py-1.5 uppercase flex-1">
                                {t.name}
                              </SelectItem>
                              <Button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteTemplate(t.id, t.name);
                                }}
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity absolute right-1"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </SelectContent>
                      </Select>

                      {selectedTemplateId && (
                        <Button 
                          onClick={() => {
                            const t = templates.find(t => t.id === selectedTemplateId);
                            if (t) openEditTemplate(t);
                          }}
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 rounded-lg text-blue-600 hover:bg-blue-50 bg-white shadow-sm border border-blue-100 transition-all active:scale-90"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
                    <div className="w-px h-4 bg-slate-200 mx-1" />
                    <DropdownMenu>
                      <DropdownMenuTrigger className="flex h-7 items-center gap-1.5 rounded-lg border border-purple-200 bg-purple-50 px-2.5 py-1 text-[10px] font-black text-purple-700 shadow-sm hover:bg-purple-100 transition-all uppercase tracking-tighter outline-none">
                        <Sparkles className="h-3 w-3" /> Insert Variable
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="rounded-xl border-none shadow-2xl p-2 w-[220px] z-[9999] bg-white">
                        <div className="p-2 space-y-2 mb-1">
                           <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Quick Custom Tag</div>
                           <div className="flex gap-1.5">
                              <Input 
                                value={customInsertText}
                                onChange={(e) => setCustomInsertText(e.target.value)}
                                onKeyDown={(e) => {
                                   if (e.key === 'Enter' && customInsertText) {
                                      insertVariable(customInsertText);
                                      setCustomInsertText("");
                                   }
                                }}
                                placeholder="Type tag..."
                                className="h-8 rounded-lg text-xs font-bold bg-slate-100 border-none px-2"
                              />
                              <Button 
                                onClick={() => {
                                   if (customInsertText) {
                                      insertVariable(customInsertText);
                                      setCustomInsertText("");
                                   }
                                }}
                                className="h-8 w-8 rounded-lg bg-blue-600 shadow-sm p-0 flex items-center justify-center"
                              >
                                 <Plus className="h-4 w-4" />
                              </Button>
                           </div>
                        </div>
                        <DropdownMenuSeparator />
                        <DropdownMenuLabel className="text-[9px] uppercase font-black text-slate-400 px-2 py-1 tracking-widest">Select Existing</DropdownMenuLabel>
                        {columnMappings.map(m => (
                          <DropdownMenuItem key={m} onClick={() => insertVariable(m)} className="rounded-lg font-black text-[11px] py-1.5 uppercase">
                             {m.replace('_', ' ')}
                          </DropdownMenuItem>
                        ))}
                        {userVariables.filter(v => v && v.variable_key && !columnMappings.includes(v.variable_key)).length > 0 && <DropdownMenuSeparator />}
                        {userVariables.filter(v => v && v.variable_key && !columnMappings.includes(v.variable_key)).map(v => (
                          <DropdownMenuItem key={v.id} onClick={() => insertVariable(v.variable_key)} className="rounded-lg font-bold text-[11px] py-1.5 text-blue-600 uppercase">
                             {v.variable_key}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <div className="w-px h-4 bg-slate-200 mx-1.5" />
                    <ToolbarButton icon={<RefreshCcw size={12} />} onClick={() => { 
                      setSubject("");
                      setBody("");
                    }} />
                  </div>
                  <div className="flex items-center gap-1">
                    <ToolbarButton icon={<AlignLeft size={14} />} onClick={() => execCommand('justifyLeft')} active />
                    <ToolbarButton icon={<AlignCenter size={14} />} onClick={() => execCommand('justifyCenter')} />
                    <ToolbarButton icon={<AlignRight size={14} />} onClick={() => execCommand('justifyRight')} />
                    <ToolbarButton icon={<AlignJustify size={14} />} onClick={() => execCommand('justifyFull')} />
                  </div>
                  <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1.5 text-center">Paragraph</div>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 bg-slate-100 px-2 py-0.5 rounded-md">Subject</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-bold focus:ring-4 focus:ring-blue-500/10 transition-all shadow-sm outline-none placeholder:text-slate-300"
                  placeholder="Campaign Subject Line"
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 bg-slate-100 px-2 py-0.5 rounded-md">Message Content</label>
                <div
                  ref={editorRef}
                  contentEditable
                  onInput={(e) => setBody(e.currentTarget.innerHTML)}
                  className="w-full rounded-3xl border border-slate-200 bg-white p-6 text-sm leading-relaxed focus:ring-4 focus:ring-blue-500/10 transition-all overflow-y-auto shadow-sm outline-none font-medium placeholder:text-slate-300 min-h-[400px] prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: body }}
                />
              </div>

              <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-4 flex flex-col sm:flex-row items-center gap-3">
                <div className="relative flex-1 w-full">
                  <Input 
                    value={newTemplateName}
                    onChange={(e) => setNewTemplateName(e.target.value)}
                    placeholder="Enter template name to save..."
                    className="h-10 rounded-xl bg-white border-blue-200/50 pr-10 text-xs font-bold"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Hash className="h-3.5 w-3.5 text-blue-300" />
                  </div>
                </div>
                <Button 
                  onClick={() => {
                    setModalSubject(subject);
                    setModalBody(body);
                    setNewTemplateName("");
                    setIsEditMode(false);
                    setIsCreateModalOpen(true);
                  }}
                  disabled={isSavingTemplate}
                  className="w-full sm:w-auto rounded-xl bg-blue-600 px-6 font-black uppercase tracking-widest text-[10px] shadow-lg shadow-blue-500/20 active:scale-95"
                >
                  {isSavingTemplate ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4 mr-2" />}
                   Save Current as Template
                </Button>
              </div>

              {detectedVariables.filter(v => !['first_name', 'company', 'email'].includes(v) && !userVariables.some(uv => uv.variable_key === v)).length > 0 && (
                <div className="rounded-2xl border border-purple-500/20 bg-purple-500/5 p-4 flex items-center justify-between animate-in fade-in slide-in-from-bottom-2">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center">
                      <Sparkles className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-purple-700">New variable detected: <span className="font-mono text-[10px] bg-purple-100 px-1.5 py-0.5 rounded">{"{{"}{detectedVariables.find(v => !['first_name', 'company', 'email'].includes(v) && !userVariables.some(uv => uv.variable_key === v))}{"}}"}</span></p>
                      <p className="text-[10px] text-purple-600/70 font-medium">Would you like to save this to your variable list?</p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 rounded-lg border-purple-500/30 text-purple-600 font-bold text-xs bg-white hover:bg-purple-50"
                    onClick={() => {
                        const key = detectedVariables.find(v => !['first_name', 'company', 'email'].includes(v) && !userVariables.some(uv => uv.variable_key === v));
                        if (key) {
                            setNewVarKey(key);
                            setIsVarModalOpen(true);
                        }
                    }}
                  >
                    Yes, Save Variable
                  </Button>
                </div>
              )}

              <div className="rounded-2xl border border-border bg-blue-500/[0.02] p-6 relative overflow-hidden group shadow-inner">
                <div className="absolute top-0 right-0 p-5 flex items-center gap-2">
                  <button 
                    onClick={() => setIsVarModalOpen(true)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-border text-[10px] font-black uppercase tracking-widest text-blue-600 hover:bg-blue-50 transition-all shadow-sm mr-2"
                  >
                    <Plus className="h-3.5 w-3.5" /> Manage Variables
                  </button>
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
                      {(function renderPreview() {
                        let text = subject || "";
                        const contact = leads[previewIndex] || {};
                        // Match both {{key}} and [key]
                        const varMatches = Array.from(text.matchAll(/\{\{([^{}]+)\}\}|\[([^\[\]]+)\]/g));
                        
                        varMatches.forEach(m => {
                          const rawKey = (m[1] || m[2] || "").trim();
                          const normalizedLookup = rawKey.toLowerCase().replace(/[^a-z0-9]/g, '');
                          
                          // 1. Direct match in contact (normalized)
                          let val = Object.entries(contact).find(([k]) => k.toLowerCase().replace(/[^a-z0-9]/g, '') === normalizedLookup)?.[1];
                          
                          // 2. Fallback to userVariables
                          if (val === undefined) {
                            val = userVariables.find(v => v.variable_key.toLowerCase().replace(/[^a-z0-9]/g, '') === normalizedLookup)?.default_value;
                          }

                          // 3. Special handling for common aliases
                          if (val === undefined) {
                            if (normalizedLookup === 'firstname' || normalizedLookup === 'first') {
                               val = contact['name'] || contact['first_name'];
                            } else if (normalizedLookup === 'name') {
                               val = contact['first_name'] || contact['first_name'];
                            }
                          }

                          if (val !== undefined) {
                             text = text.replace(m[0], String(val));
                          }
                        });
                        return text;
                      })()}
                    </span>
                  </div>
                  <div className="rounded-2xl bg-white p-6 border border-border shadow-sm mt-2 overflow-hidden">
                    <div
                      className="text-sm text-foreground/80 leading-relaxed italic prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{
                        __html: (function renderPreview() {
                          let text = body || "";
                          const contact = leads[previewIndex] || {};
                          // Match both {{key}} and [key]
                          const varMatches = Array.from(text.matchAll(/\{\{([^{}]+)\}\}|\[([^\[\]]+)\]/g));
                          
                          varMatches.forEach(m => {
                            const rawKey = (m[1] || m[2] || "").trim();
                            const normalizedLookup = rawKey.toLowerCase().replace(/[^a-z0-9]/g, '');
                            
                            // 1. Direct match in contact (normalized)
                            let val = Object.entries(contact).find(([k]) => k.toLowerCase().replace(/[^a-z0-9]/g, '') === normalizedLookup)?.[1];
                            
                            // 2. Fallback to userVariables
                            if (val === undefined) {
                              val = userVariables.find(v => v.variable_key.toLowerCase().replace(/[^a-z0-9]/g, '') === normalizedLookup)?.default_value;
                            }

                            // 3. Special handling for common aliases (e.g. {{first_name}} -> name)
                            if (val === undefined) {
                              if (normalizedLookup === 'firstname' || normalizedLookup === 'first' || normalizedLookup === 'first_name') {
                                 val = contact['name'] || contact['first_name'];
                              } else if (normalizedLookup === 'name') {
                                 val = contact['first_name'] || contact['first_name'];
                              }
                            }

                            if (val !== undefined) {
                               text = text.replace(m[0], String(val));
                            }
                          });
                          return text;
                        })()
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Variables Management Modal */}
      <Dialog open={isVarModalOpen} onOpenChange={setIsVarModalOpen}>
        <DialogContent className="max-w-md rounded-3xl p-8 border-none shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-black flex items-center gap-2">
              <Hash className="h-5 w-5 text-blue-600" /> Manage Variables
            </DialogTitle>
            <DialogDescription className="text-xs font-medium">Create custom variables to use in your templates.</DialogDescription>
          </DialogHeader>

          <div className="space-y-6 pt-4">
            <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Add New Variable</Label>
              <div className="flex gap-2">
                <Input 
                  placeholder="variable_name" 
                  value={newVarKey}
                  onChange={(e) => setNewVarKey(e.target.value)}
                  className="rounded-xl bg-muted/30 border-none h-10 font-bold"
                />
                <Input 
                  placeholder="Default Value" 
                  value={newVarDefault}
                  onChange={(e) => setNewVarDefault(e.target.value)}
                  className="rounded-xl bg-muted/30 border-none h-10 font-bold"
                />
                <Button onClick={handleCreateVariable} className="rounded-xl bg-blue-600 shadow-lg shadow-blue-500/20">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Your Variables</Label>
              <div className="max-h-[300px] overflow-y-auto space-y-2 pr-1">
                {userVariables.length === 0 && (
                  <div className="text-center py-8 text-xs font-bold text-muted-foreground bg-muted/20 rounded-2xl border-2 border-dashed border-border">
                    No custom variables yet
                  </div>
                )}
                {userVariables.filter(v => v && v.variable_key).map((v) => (
                  <div key={v.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/30 group">
                    <div>
                      <div className="text-sm font-black tracking-tight text-foreground flex items-center gap-1.5">
                        <span className="text-blue-600">{"{{"}</span>
                        {v.variable_key}
                        <span className="text-blue-600">{"}}"}</span>
                      </div>
                      <div className="text-[10px] font-medium text-muted-foreground">Default: {v.default_value || "—"}</div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => deleteVariable(v.id, v.variable_key)}
                      className="h-8 w-8 text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* NEW Create Template Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-2xl rounded-[32px] p-0 border-none shadow-2xl overflow-hidden bg-slate-50">
          <div className="bg-blue-600 p-8 text-white relative">
             <div className="absolute top-0 right-0 p-8 opacity-10">
                <FileText className="w-24 h-24" />
             </div>
             <DialogHeader>
                <DialogTitle className="text-2xl font-black flex items-center gap-3">
                   {isEditMode ? "Edit Template" : "Create New Template"}
                </DialogTitle>
                <DialogDescription className="text-blue-100 font-medium">{isEditMode ? "Update your template structure and variables." : "Define your message structure and variables."}</DialogDescription>
             </DialogHeader>
          </div>
          
          <div className="p-8 space-y-6">
             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                   <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Template Name</Label>
                   <Input 
                      value={newTemplateName}
                      onChange={(e) => setNewTemplateName(e.target.value)}
                      placeholder="e.g. Cold Outreach #1"
                      className="rounded-2xl border-none bg-white shadow-sm h-12 font-bold px-4 focus:ring-2 focus:ring-blue-500"
                   />
                </div>
                <div className="space-y-2">
                   <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Subject Line</Label>
                   <Input 
                      value={modalSubject}
                      onChange={(e) => setModalSubject(e.target.value)}
                      placeholder="Enter subject line..."
                      className="rounded-2xl border-none bg-white shadow-sm h-12 font-bold px-4 focus:ring-2 focus:ring-blue-500"
                   />
                </div>
             </div>

             <div className="space-y-2">
                <div className="flex items-center justify-between mb-1">
                   <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Message (HTML Content)</Label>
                   <DropdownMenu>
                      <DropdownMenuTrigger className="text-[9px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded hover:bg-blue-100 flex items-center gap-1 uppercase tracking-widest">
                         <Plus className="w-3 h-3" /> Insert Variable
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="rounded-xl border-none shadow-2xl p-2 w-[220px] z-[9999] bg-white">
                        <div className="p-2 space-y-2 mb-1">
                           <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Quick Custom Tag</div>
                           <div className="flex gap-1.5">
                              <Input 
                                value={customInsertText}
                                onChange={(e) => setCustomInsertText(e.target.value)}
                                onKeyDown={(e) => {
                                   if (e.key === 'Enter' && customInsertText) {
                                      setBody(prev => prev + ` {{${customInsertText.toLowerCase()}}}`);
                                      setCustomInsertText("");
                                   }
                                }}
                                placeholder="Type tag..."
                                className="h-8 rounded-lg text-xs font-bold bg-slate-100 border-none px-2"
                              />
                              <Button 
                                onClick={() => {
                                   if (customInsertText) {
                                      setBody(prev => prev + ` {{${customInsertText.toLowerCase()}}}`);
                                      setCustomInsertText("");
                                   }
                                }}
                                className="h-8 w-8 rounded-lg bg-blue-600 shadow-sm p-0 flex items-center justify-center text-white"
                              >
                                 <Plus className="h-4 w-4" />
                              </Button>
                           </div>
                        </div>
                        <DropdownMenuSeparator />
                        <DropdownMenuLabel className="text-[9px] uppercase font-black text-slate-400 px-2 py-1 tracking-widest">Select Existing</DropdownMenuLabel>
                        {columnMappings.map(m => (
                          <DropdownMenuItem key={m} onClick={() => setBody(prev => prev + ` {{${m.toLowerCase()}}}`)} className="rounded-lg font-black text-[11px] py-1.5 uppercase">
                             {m.replace('_', ' ')}
                          </DropdownMenuItem>
                        ))}
                        {userVariables.filter(v => v && v.variable_key && !columnMappings.includes(v.variable_key.toLowerCase())).length > 0 && <DropdownMenuSeparator />}
                        {userVariables.filter(v => v && v.variable_key && !columnMappings.includes(v.variable_key.toLowerCase())).map(v => (
                          <DropdownMenuItem key={v.id} onClick={() => setBody(prev => prev + ` {{${v.variable_key.toLowerCase()}}}`)} className="rounded-lg font-bold text-[11px] py-1.5 text-blue-600 uppercase">
                             {v.variable_key}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                   </DropdownMenu>
                </div>
                <textarea 
                   value={body}
                   onChange={(e) => setBody(e.target.value)}
                   className="w-full h-48 rounded-3xl border-none bg-white shadow-sm p-6 text-sm font-medium focus:ring-2 focus:ring-blue-500 resize-none outline-none"
                   placeholder="Write your email here... use {{first_name}} for personalization."
                />
             </div>

             <div className="flex justify-end pt-4 gap-3">
                <Button 
                   variant="ghost" 
                   onClick={() => setIsCreateModalOpen(false)}
                   className="rounded-2xl font-black text-[10px] uppercase tracking-widest px-6"
                >
                   Cancel
                </Button>
                <Button 
                   onClick={async () => {
                      await handleSaveTemplate();
                      setIsCreateModalOpen(false);
                   }}
                   disabled={!newTemplateName || isSavingTemplate}
                   className="rounded-2xl bg-blue-600 px-8 font-black text-[10px] uppercase tracking-widest shadow-xl shadow-blue-500/20 active:scale-95"
                >
                   {isSavingTemplate ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Template"}
                </Button>
             </div>
          </div>
        </DialogContent>
      </Dialog>
      <style jsx global>{`
        [contenteditable]:empty:before {
          content: attr(placeholder);
          color: #cbd5e1;
          pointer-events: none;
          display: block;
        }
        [contenteditable] {
          outline: none;
        }
        [contenteditable] b, [contenteditable] strong {
          font-weight: 800;
        }
        [contenteditable] i, [contenteditable] em {
          font-style: italic;
        }
        [contenteditable] u {
          text-decoration: underline;
        }
        [contenteditable] ul {
          list-style-type: disc;
          margin-left: 1.5rem;
          margin-top: 0.5rem;
          margin-bottom: 0.5rem;
        }
        [contenteditable] ol {
          list-style-type: decimal;
          margin-left: 1.5rem;
          margin-top: 0.5rem;
          margin-bottom: 0.5rem;
        }
        [contenteditable] a {
          color: #2563eb;
          text-decoration: underline;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
}

function VariableChip({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 rounded-lg bg-white border border-slate-200 px-2.5 py-1 text-[10px] font-bold text-slate-500 hover:text-blue-600 hover:border-blue-500/50 transition-all shadow-sm active:scale-95 whitespace-nowrap"
    >
      <Hash className="h-2.5 w-2.5" /> {label}
    </button>
  );
}

function ToolbarButton({ icon, onClick, active, small }: { icon: React.ReactNode; onClick?: () => void; active?: boolean; small?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center justify-center rounded transition-all hover:bg-white hover:shadow-sm",
        small ? "h-6 w-6" : "h-7 w-8",
        active ? "bg-white shadow-sm ring-1 ring-slate-200" : "text-slate-600"
      )}
    >
      {icon}
    </button>
  );
}
