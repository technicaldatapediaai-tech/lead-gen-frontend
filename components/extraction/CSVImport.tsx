"use client";

import React, { useState, useRef } from "react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { 
    Loader2, Upload, FileType, CheckCircle2, 
    AlertCircle, X, Columns, Table as TableIcon 
} from "lucide-react";
import Papa from "papaparse";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { motion, AnimatePresence } from "framer-motion";

export default function CSVImport({ onSuccess, campaignName, campaignId }: { onSuccess?: () => void, campaignName?: string, campaignId?: string }) {
    const [isLoading, setIsLoading] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [dragActive, setDragActive] = useState(false);
    const [previewData, setPreviewData] = useState<any[]>([]);
    const [headers, setHeaders] = useState<string[]>([]);
    const [columnMappings, setColumnMappings] = useState<Record<string, string>>({});
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            validateAndSetFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            validateAndSetFile(e.target.files[0]);
        }
    };

    const validateAndSetFile = (file: File) => {
        const extension = file.name.split('.').pop()?.toLowerCase();
        if (extension !== 'csv') {
            toast.error("Please upload a CSV file");
            return;
        }
        setFile(file);
        parseCSV(file);
    };

    const parseCSV = (file: File) => {
        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            preview: 5,
            complete: (results) => {
                if (results.data && results.data.length > 0) {
                    const foundHeaders = Object.keys(results.data[0] as object);
                    setHeaders(foundHeaders);
                    setPreviewData(results.data);
                    
                    // Auto-map columns
                    const mapping: Record<string, string> = {};
                    foundHeaders.forEach(header => {
                        const h = header.toLowerCase();
                        if (h.includes('name') || h.includes('full name')) mapping['Name'] = header;
                        if (h.includes('linkedin') || h.includes('url') || h.includes('profile')) mapping['LinkedIn'] = header;
                        if (h.includes('email') || h.includes('mail')) mapping['Email'] = header;
                    });
                    setColumnMappings(mapping);
                }
            },
            error: (error) => {
                toast.error("Error parsing CSV: " + error.message);
            }
        });
    };

    const handleUpload = async () => {
        if (!file) return;

        setIsLoading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            let url = "/api/leads/import/";
            const params = new URLSearchParams();
            if (campaignId) params.append('campaign_id', campaignId);
            if (campaignName) params.append('campaign_name', campaignName);
            
            if (params.toString()) {
                url += `?${params.toString()}`;
            }

            const { data, error } = await api.postMultipart<any>(url, formData);

            
            if (data) {
                toast.success(`Successfully imported ${data.imported || 0} leads!`);
                setFile(null);
                if (onSuccess) onSuccess();
            } else {
                toast.error(error?.detail || "Failed to import leads");
            }
        } catch (error) {
            console.error("Import error:", error);
            toast.error("Error importing leads. Please check your connection.");
        } finally {
            setIsLoading(false);
        }
    };

    const removeFile = () => {
        setFile(null);
        setPreviewData([]);
        setHeaders([]);
        setColumnMappings({});
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-emerald-600/10 text-emerald-500">
                    <Upload className="h-5 w-5" />
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-foreground">CSV Lead Import</h2>
                    <p className="text-sm text-muted-foreground">Upload a spreadsheet of prospects to bulk-add them.</p>
                </div>
            </div>

            {!file ? (
                <div 
                    onDragEnter={handleDrag} 
                    onDragLeave={handleDrag} 
                    onDragOver={handleDrag} 
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`relative border-2 border-dashed rounded-3xl p-12 text-center transition-all cursor-pointer bg-muted/20
                        ${dragActive ? 'border-blue-500 bg-blue-500/5' : 'border-border hover:border-blue-500/30'}
                    `}
                >
                    <input 
                        ref={fileInputRef}
                        type="file" 
                        accept=".csv" 
                        onChange={handleChange} 
                        className="hidden" 
                    />
                    
                    <div className="mx-auto w-16 h-16 rounded-full bg-blue-600/10 text-blue-500 flex items-center justify-center mb-4">
                        <Upload className="h-8 w-8" />
                    </div>
                    
                    <h3 className="text-base font-semibold text-foreground mb-1">
                        Click to upload or drag and drop
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        CSV files only. Max size: 5MB.
                    </p>
                    
                    <div className="mt-8 grid grid-cols-2 gap-4 max-w-sm mx-auto">
                        <div className="text-xs text-muted-foreground bg-muted/40 p-2 rounded-lg border border-border">
                            <FileType className="h-4 w-4 mx-auto mb-1 opacity-50" />
                            Proper Header Mapping
                        </div>
                        <div className="text-xs text-muted-foreground bg-muted/40 p-2 rounded-lg border border-border">
                            <div className="h-4 w-4 mx-auto mb-1 rounded-full border border-dashed border-muted-foreground/50" />
                            Auto-Scoring Applied
                        </div>
                    </div>
                </div>
            ) : (
                <div className="rounded-3xl border border-blue-500/30 bg-blue-500/5 p-8">
                    {/* File Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-2xl bg-blue-600 text-white">
                                <FileType className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="text-base font-semibold text-foreground truncate max-w-[200px]">{file.name}</h3>
                                <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB • Ready to upload</p>
                            </div>
                        </div>
                        <button 
                            onClick={removeFile}
                            className="p-2 rounded-full hover:bg-muted text-muted-foreground transition"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Column Mapping Feedback */}
                    <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-3">
                        {['Name', 'LinkedIn', 'Email'].map((field) => (
                            <div key={field} className="flex items-center gap-2 p-3 rounded-xl bg-card border border-border/50 text-[11px]">
                                <div className={`p-1.5 rounded-lg ${columnMappings[field] ? 'bg-emerald-600/10 text-emerald-500' : 'bg-amber-600/10 text-amber-500'}`}>
                                    {columnMappings[field] ? <CheckCircle2 className="h-3.5 w-3.5" /> : <AlertCircle className="h-3.5 w-3.5" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-muted-foreground font-medium">{field}</p>
                                    <p className="font-semibold truncate">{columnMappings[field] || 'Not found'}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Preview Table */}
                    <AnimatePresence>
                        {previewData.length > 0 && (
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-8 overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
                            >
                                <div className="px-4 py-2.5 bg-muted/30 border-b border-border flex items-center justify-between">
                                    <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                        <TableIcon className="h-3.5 w-3.5" />
                                        Data Preview (Top {previewData.length} rows)
                                    </span>
                                </div>
                                <div className="overflow-x-auto max-h-[300px]">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="bg-muted/20 hover:bg-muted/20">
                                                {headers.map((header) => (
                                                    <TableHead key={header} className="text-[10px] font-bold uppercase tracking-wider py-3 first:pl-4 last:pr-4">
                                                        {header}
                                                    </TableHead>
                                                ))}
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {previewData.map((row, i) => (
                                                <TableRow key={i} className="hover:bg-muted/5 transition-colors">
                                                    {headers.map((header) => (
                                                        <TableCell key={header} className="text-[11px] py-2.5 first:pl-4 last:pr-4 truncate max-w-[200px]">
                                                            {row[header] || <span className="text-muted-foreground/30">—</span>}
                                                        </TableCell>
                                                    ))}
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="flex gap-3">
                        <Button 
                            onClick={handleUpload}
                            disabled={isLoading || previewData.length === 0}
                            className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-7 rounded-2xl font-semibold shadow-lg shadow-blue-600/20"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Processing leads...
                                </>
                            ) : (
                                <>
                                    <CheckCircle2 className="mr-2 h-5 w-5" />
                                    Start Import
                                </>
                            )}
                        </Button>
                        <Button 
                            variant="outline" 
                            onClick={removeFile}
                            disabled={isLoading}
                            className="py-7 px-8 rounded-2xl"
                        >
                            Cancel
                        </Button>
                    </div>

                    <div className="mt-5 flex items-center gap-2 text-[11px] text-muted-foreground justify-center">
                        <Columns className="h-3.5 w-3.5" />
                        Columns are mapped automatically. Ensure headers match common names.
                    </div>
                </div>
            )}

            <div className="mt-8 bg-secondary/30 rounded-2xl p-4 border border-border">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                    <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                    CSV Best Practices
                </h4>
                <ul className="text-xs text-muted-foreground space-y-2 list-disc pl-4">
                    <li>Include headers: <code className="bg-muted px-1 rounded">name</code>, <code className="bg-muted px-1 rounded">linkedin_url</code>, <code className="bg-muted px-1 rounded">email</code></li>
                    <li>Avoid special characters in names</li>
                    <li>Ensure LinkedIn URLs are full links (https://...)</li>
                </ul>
            </div>
        </div>
    );
}
