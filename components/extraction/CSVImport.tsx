"use client";

import React, { useState, useRef } from "react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Loader2, Upload, FileType, CheckCircle2, AlertCircle, X } from "lucide-react";

export default function CSVImport({ onSuccess }: { onSuccess?: () => void }) {
    const [isLoading, setIsLoading] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [dragActive, setDragActive] = useState(false);
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
    };

    const handleUpload = async () => {
        if (!file) return;

        setIsLoading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const { data, error } = await api.postMultipart<any>("/api/leads/import/", formData);
            
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
                    <div className="flex items-center justify-between">
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

                    <div className="mt-8 flex gap-3">
                        <Button 
                            onClick={handleUpload}
                            disabled={isLoading}
                            className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-6"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Importing...
                                </>
                            ) : (
                                "Start Import"
                            )}
                        </Button>
                        <Button 
                            variant="outline" 
                            onClick={removeFile}
                            disabled={isLoading}
                            className="py-6"
                        >
                            Cancel
                        </Button>
                    </div>

                    <div className="mt-4 flex items-center gap-2 text-[11px] text-muted-foreground justify-center">
                        <AlertCircle className="h-3 w-3" />
                        We will automatically match columns like Name, LinkedIn, and Email.
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
