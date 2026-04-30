"use client";

import React, { useState, useRef } from "react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { 
    Loader2, Upload, FileType, CheckCircle2, 
    AlertCircle, X, Columns, Table as TableIcon, Download
} from "lucide-react";
import { parseCsvFile } from "@/lib/csv";
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

    const parseCSV = async (file: File) => {
        try {
            const results = await parseCsvFile<string[]>(file, {
                header: false,
                skipEmptyLines: true,
                preview: 10
            });

            if (!results.data || results.data.length === 0) {
                toast.error("The CSV file is empty.");
                return;
            }

            const firstRow = results.data[0] as string[];
            const socialDomains = ["linkedin.com", "instagram.com", "twitter.com", "facebook.com", "x.com"];
            
            const headerKeywords = ['name', 'url', 'link', 'email', 'profile', 'company', 'title'];
            const firstRowIsHeaders = !firstRow.some(cell => 
                socialDomains.some(d => cell?.toLowerCase().includes(d)) || 
                cell?.includes('@') || 
                cell?.startsWith('http')
            ) && firstRow.some(cell => 
                headerKeywords.some(k => cell?.toLowerCase().includes(k))
            );

            let finalHeaders: string[] = [];
            let finalData: any[] = [];
            const mapping: Record<string, string> = {};

            if (firstRowIsHeaders) {
                finalHeaders = firstRow;
                results.data.slice(1).forEach(row => {
                    const obj: any = {};
                    finalHeaders.forEach((h, i) => obj[h] = (row as any)[i]);
                    finalData.push(obj);
                });
            } else {
                finalHeaders = firstRow.map((_, i) => `Column ${i + 1}`);
                results.data.forEach(row => {
                    const obj: any = {};
                    finalHeaders.forEach((h, i) => obj[h] = (row as any)[i]);
                    finalData.push(obj);
                });
            }

            setHeaders(finalHeaders);
            setPreviewData(finalData);

            finalHeaders.forEach(header => {
                const h = header.toLowerCase();
                const firstVal = (finalData[0] && finalData[0][header])?.toLowerCase() || "";
                
                if (h.includes('name') || h.includes('full name') || (h.includes('column') && firstVal.length > 3 && !firstVal.includes('.') && firstVal.split(' ').length > 1)) {
                    if (!mapping['Name']) mapping['Name'] = header;
                }
                if (h.includes('linkedin') || h.includes('url') || h.includes('profile') || firstVal.includes('linkedin.com') || firstVal.startsWith('http')) {
                    if (!mapping['LinkedIn']) mapping['LinkedIn'] = header;
                }
                if (h.includes('email') || h.includes('mail') || firstVal.includes('@')) {
                    if (!mapping['Email']) mapping['Email'] = header;
                }
            });
            
            setColumnMappings(mapping);
        } catch (error: any) {
            toast.error("Error parsing CSV: " + (error?.message || "Unknown error"));
        }
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

    const downloadSampleCSV = () => {
        const headers = ["name", "linkedin_url", "email", "company"];
        const sampleData = [
            ["John Doe", "https://linkedin.com/in/johndoe", "john@example.com", "Acme Corp"],
            ["Jane Smith", "https://linkedin.com/in/janesmith", "jane@example.com", "TechFlow"]
        ];
        
        const csvContent = [
            headers.join(","),
            ...sampleData.map(row => row.join(","))
        ].join("\n");
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "leadgenius_sample.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="w-full flex flex-col space-y-4 text-left">
            {!file ? (
                <div 
                    onDragEnter={handleDrag} 
                    onDragLeave={handleDrag} 
                    onDragOver={handleDrag} 
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`relative w-full rounded-md p-8 text-center transition-colors cursor-pointer
                        ${dragActive ? 'bg-primary/5 text-primary' : 'hover:bg-muted/50 text-muted-foreground'}
                    `}
                >
                    <input 
                        ref={fileInputRef}
                        type="file" 
                        accept=".csv" 
                        onChange={handleChange} 
                        className="hidden" 
                    />
                    
                    <div className="mx-auto w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-3">
                        <Upload className="h-5 w-5 text-foreground" />
                    </div>
                    
                    <h3 className="text-sm font-semibold text-foreground mb-1">
                        Click to upload or drag and drop
                    </h3>
                    <p className="text-xs">
                        CSV files only. Max size: 5MB.
                    </p>
                </div>
            ) : (
                <div className="rounded-md border bg-card p-6">
                    {/* File Header */}
                    <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-md border bg-muted">
                                <FileType className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-foreground truncate max-w-[200px]">{file.name}</h3>
                                <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB • Ready to upload</p>
                            </div>
                        </div>
                        <button 
                            onClick={removeFile}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-muted text-muted-foreground transition-colors"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>

                    {/* Column Mapping Feedback */}
                    <div className="mb-6 grid grid-cols-1 gap-2">
                        {['Name', 'LinkedIn', 'Email'].map((field) => (
                            <div key={field} className="flex items-center justify-between p-2 rounded-md border bg-background text-xs">
                                <div className="flex items-center gap-2">
                                    {columnMappings[field] ? <CheckCircle2 className="h-4 w-4 text-primary" /> : <AlertCircle className="h-4 w-4 text-destructive" />}
                                    <span className="font-medium">{field}</span>
                                </div>
                                <span className="text-muted-foreground truncate max-w-[150px]">
                                    {columnMappings[field] ? columnMappings[field] : 'Not mapped'}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Preview Table */}
                    <AnimatePresence>
                        {previewData.length > 0 && (
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-6 overflow-hidden rounded-md border text-sm shadow-sm"
                            >
                                <div className="bg-muted px-3 py-2 border-b flex items-center justify-between">
                                    <span className="text-xs font-semibold text-muted-foreground flex items-center gap-2">
                                        <TableIcon className="h-4 w-4" />
                                        Data Preview (Top {previewData.length})
                                    </span>
                                </div>
                                <div className="overflow-x-auto max-h-[250px]">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="bg-muted/50">
                                                {headers.map((header) => (
                                                    <TableHead key={header} className="text-xs font-semibold py-2 h-auto first:pl-4 last:pr-4">
                                                        {header}
                                                    </TableHead>
                                                ))}
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {previewData.map((row, i) => (
                                                <TableRow key={i}>
                                                    {headers.map((header) => (
                                                        <TableCell key={header} className="text-xs py-2 first:pl-4 last:pr-4 truncate max-w-[150px]">
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

                    <div className="flex gap-2">
                        <Button 
                            onClick={handleUpload}
                            disabled={isLoading || previewData.length === 0}
                            className="flex-1"
                            size="sm"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                "Start Import"
                            )}
                        </Button>
                        <Button 
                            variant="outline" 
                            onClick={removeFile}
                            disabled={isLoading}
                            size="sm"
                        >
                            Cancel
                        </Button>
                    </div>

                    <p className="mt-4 text-xs text-center text-muted-foreground">
                        Columns mapped automatically. Ensure headers match common names.
                    </p>
                </div>
            )}

            {!file && (
                <div className="rounded-md border p-4 bg-muted/20">
                    <h4 className="text-xs font-semibold text-foreground mb-2 flex items-center gap-2">
                        <CheckCircle2 className="h-3 w-3 text-primary" />
                        CSV Best Practices
                    </h4>
                    <ul className="text-xs text-muted-foreground space-y-1.5 list-disc pl-4 mb-4">
                        <li>Include headers: <code className="bg-muted px-1 py-0.5 rounded text-[10px]">name</code>, <code className="bg-muted px-1 py-0.5 rounded text-[10px]">linkedin_url</code>, <code className="bg-muted px-1 py-0.5 rounded text-[10px]">email</code></li>
                        <li>Avoid special characters in names</li>
                        <li>Ensure LinkedIn URLs are full links (https://...)</li>
                    </ul>
                    <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={(e) => { e.stopPropagation(); downloadSampleCSV(); }} 
                        className="w-full text-xs"
                    >
                        <Download className="mr-2 h-3.5 w-3.5" />
                        Download Sample Template
                    </Button>
                </div>
            )}
        </div>
    );
}
