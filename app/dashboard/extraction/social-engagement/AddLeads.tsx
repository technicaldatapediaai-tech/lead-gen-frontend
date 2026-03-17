"use client";

import { useState, useEffect } from "react";
import {
    UploadCloud,
    UserPlus,
    X,
    Info,
    Check,
    Loader2,
    Building2,
    ChevronDown,
    Search,
    Compass,
    Users,
    ThumbsUp,
    Twitter,
    Instagram,
    Facebook
} from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { setTokens } from "@/lib/auth";
import CSVImport from "@/components/extraction/CSVImport";
import ManualLeadEntry from "@/components/extraction/ManualLeadEntry";
import StandardSearch from "@/components/extraction/StandardSearch";
import SalesNavigator from "@/components/extraction/SalesNavigator";
import LinkedInGroups from "@/components/extraction/LinkedInGroups";
import PostEngagement from "@/components/extraction/PostEngagement";
import TwitterSearch from "@/components/extraction/TwitterSearch";
import InstagramSearch from "@/components/extraction/InstagramSearch";
import FacebookSearch from "@/components/extraction/FacebookSearch";

interface OrgItem {
    id: string;
    name: string;
    domain?: string;
    industry?: string;
    role: string;
    is_active: boolean;
}

export default function AddLeads({ onClose, onSuccess }: { onClose: () => void; onSuccess?: () => void }) {
    const [step, setStep] = useState(1);
    const [selected, setSelected] = useState<"csv-import" | "manual-entry" | "standard-search" | "sales-navigator" | "linkedin-groups" | "post-engagement" | "twitter-search" | "instagram-search" | "facebook-search">("standard-search");
    // Step 2 - REQUIRE USER INPUT
    const [listName, setListName] = useState("");

    // Organization State
    const [organizations, setOrganizations] = useState<OrgItem[]>([]);
    const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null);
    const [orgsLoading, setOrgsLoading] = useState(true);
    const [orgDropdownOpen, setOrgDropdownOpen] = useState(false);

    // Fetch organizations on mount and auto-select
    useEffect(() => {
        async function fetchOrgs() {
            setOrgsLoading(true);
            const { data, error } = await api.get<{
                organizations: OrgItem[];
                current_org_id: string | null;
            }>("/api/organizations/");

            if (!error && data) {
                const activeOrgs = (data.organizations || []).filter(o => o.is_active);
                setOrganizations(activeOrgs);

                // Priority: localStorage saved org > current_org_id from backend > first org
                const savedOrgId = localStorage.getItem("leadgenius_selected_org_id");
                const validSavedOrg = savedOrgId && activeOrgs.some(o => o.id === savedOrgId);

                if (validSavedOrg) {
                    setSelectedOrgId(savedOrgId);
                } else if (data.current_org_id && activeOrgs.some(o => o.id === data.current_org_id)) {
                    setSelectedOrgId(data.current_org_id);
                    localStorage.setItem("leadgenius_selected_org_id", data.current_org_id);
                } else if (activeOrgs.length > 0) {
                    setSelectedOrgId(activeOrgs[0].id);
                    localStorage.setItem("leadgenius_selected_org_id", activeOrgs[0].id);
                }
            }
            setOrgsLoading(false);
        }
        fetchOrgs();
    }, []);

    const handleNext = async () => {
        if (step === 1) {
            if (!listName.trim() || !selectedOrgId) {
                toast.error("Please provide a name and select an organization.");
                return;
            }
            setStep(2);
        }
    };

    const handleBack = () => {
        if (step > 1) { // Removed !isPolling condition as isPolling state is removed
            setStep(step - 1);
        }
    };

    const getTitle = () => {
        switch (selected) {
            case "csv-import": return "CSV Import";
            case "manual-entry": return "Manual Entry";
            case "standard-search": return "Standard Search";
            case "sales-navigator": return "Sales Navigator";
            case "linkedin-groups": return "LinkedIn Groups Scraper";
            case "post-engagement": return "Post Engagement Scraper";
            case "twitter-search": return "Twitter Scraper";
            case "instagram-search": return "Instagram Scraper";
            case "facebook-search": return "Facebook Scraper";
            default: return "Lead Addition";
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl border border-border bg-card shadow-2xl transition-colors duration-300">
                {/* Close Button */}
                <div className="p-6 lg:p-8">

                    <div className="mb-2 flex items-center gap-3 text-[11px] font-bold tracking-widest text-muted-foreground uppercase">
                        <span>Lead Acquisition Hub</span>
                        <span className="h-1 w-1 rounded-full bg-muted-foreground/40" />
                        <span>Step {step} / 2</span>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-6 flex gap-2">
                        <div className={`h-1 w-16 rounded-full ${step >= 1 ? "bg-blue-600" : "bg-muted"}`} />
                        <div className={`h-1 w-16 rounded-full ${step >= 2 ? "bg-blue-600" : "bg-muted"}`} />
                    </div>

                    {step === 1 && (
                        <>
                            <h2 className="mb-2 text-2xl font-semibold text-foreground">
                                Name your campaign
                            </h2>
                            <p className="mb-6 text-sm text-muted-foreground">
                                Give your campaign a memorable name to track it later.
                            </p>

                            <input
                                type="text"
                                value={listName}
                                onChange={(e) => setListName(e.target.value)}
                                className="mb-6 h-12 w-full rounded-xl border border-input bg-background/50 px-4 text-sm text-foreground focus:border-blue-500 focus:outline-none transition-colors"
                                placeholder="e.g. Q1 Marketing Outreach"
                                autoFocus
                            />

                            {/* Organization Selector */}
                            <div className="mb-8">
                                <div className="mb-2 flex items-center gap-2">
                                    <Building2 size={14} className="text-blue-500" />
                                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Organization</span>
                                    {selectedOrgId && (
                                        <span className="ml-auto flex items-center gap-1 text-[10px] text-emerald-500 font-medium">
                                            <Check size={10} /> Auto-selected
                                        </span>
                                    )}
                                </div>

                                {orgsLoading ? (
                                    <div className="flex items-center gap-2 h-12 px-4 rounded-xl border border-input bg-background/50">
                                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                                        <span className="text-sm text-muted-foreground">Loading organizations...</span>
                                    </div>
                                ) : organizations.length === 0 ? (
                                    <div className="flex items-center gap-2 h-12 px-4 rounded-xl border border-amber-500/30 bg-amber-500/5">
                                        <Info size={14} className="text-amber-500" />
                                        <span className="text-sm text-amber-500">No organizations found. Please create one first.</span>
                                    </div>
                                ) : organizations.length === 1 ? (
                                    // Single org - show as locked/auto-selected
                                    <div className="flex items-center gap-3 h-12 px-4 rounded-xl border border-blue-500/30 bg-blue-500/5">
                                        <div className="grid h-8 w-8 place-items-center rounded-lg bg-blue-600/15 text-blue-500">
                                            <Building2 size={16} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-sm font-semibold text-foreground truncate">{organizations[0].name}</div>
                                            {organizations[0].industry && (
                                                <div className="text-[10px] text-muted-foreground truncate">{organizations[0].industry}</div>
                                            )}
                                        </div>
                                        <Check size={16} className="text-blue-500" />
                                    </div>
                                ) : (
                                    // Multiple orgs - show dropdown
                                    <div className="relative">
                                        <button
                                            type="button"
                                            onClick={() => setOrgDropdownOpen(!orgDropdownOpen)}
                                            className="flex items-center gap-3 h-12 w-full px-4 rounded-xl border border-input bg-background/50 hover:border-blue-500/50 transition-colors text-left"
                                        >
                                            <div className="grid h-8 w-8 place-items-center rounded-lg bg-blue-600/15 text-blue-500 shrink-0">
                                                <Building2 size={16} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="text-sm font-semibold text-foreground truncate">
                                                    {organizations.find(o => o.id === selectedOrgId)?.name || "Select organization"}
                                                </div>
                                            </div>
                                            <ChevronDown size={16} className={`text-muted-foreground transition-transform ${orgDropdownOpen ? "rotate-180" : ""}`} />
                                        </button>

                                        {orgDropdownOpen && (
                                            <div className="absolute z-30 mt-1 w-full rounded-xl border border-border bg-card shadow-xl overflow-hidden">
                                                {organizations.map((org) => (
                                                    <button
                                                        key={org.id}
                                                        type="button"
                                                        onClick={() => {
                                                            setSelectedOrgId(org.id);
                                                            localStorage.setItem("leadgenius_selected_org_id", org.id);
                                                            setOrgDropdownOpen(false);
                                                        }}
                                                        className={`flex items-center gap-3 w-full px-4 py-3 text-left transition-colors hover:bg-accent ${selectedOrgId === org.id ? "bg-blue-500/5" : ""
                                                            }`}
                                                    >
                                                        <div className={`grid h-8 w-8 place-items-center rounded-lg shrink-0 ${selectedOrgId === org.id ? "bg-blue-600/15 text-blue-500" : "bg-secondary text-muted-foreground"
                                                            }`}>
                                                            <Building2 size={16} />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="text-sm font-semibold text-foreground truncate">{org.name}</div>
                                                            <div className="text-[10px] text-muted-foreground truncate">
                                                                {org.role} {org.industry ? `• ${org.industry}` : ""}
                                                            </div>
                                                        </div>
                                                        {selectedOrgId === org.id && (
                                                            <Check size={16} className="text-blue-500 shrink-0" />
                                                        )}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            <h2 className="mb-6 text-2xl font-semibold text-foreground">
                                How would you like to add leads?
                            </h2>

                            {/* Grid */}
                            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                                <OptionCard
                                    icon={<Search size={28} />}
                                    title="LinkedIn Scraper"
                                    description="Extract leads from LinkedIn search results or specific URLs"
                                    active={selected === "standard-search"}
                                    onClick={() => setSelected("standard-search")}
                                />
                                <OptionCard
                                    icon={<Compass size={28} />}
                                    title="Sales Navigator"
                                    description="Extract leads from Sales Navigator lists and searches"
                                    active={selected === "sales-navigator"}
                                    onClick={() => setSelected("sales-navigator")}
                                />
                                <OptionCard
                                    icon={<Users size={28} />}
                                    title="LinkedIn Groups"
                                    description="Scrape members from specific industry group links"
                                    active={selected === "linkedin-groups"}
                                    onClick={() => setSelected("linkedin-groups")}
                                />
                                <OptionCard
                                    icon={<ThumbsUp size={28} />}
                                    title="Engagement Scraper"
                                    description="Extract leads who engaged with specific post links"
                                    active={selected === "post-engagement"}
                                    onClick={() => setSelected("post-engagement")}
                                />
                                <OptionCard
                                    icon={<Twitter size={28} />}
                                    title="Twitter Scraper"
                                    description="Source leads from Twitter profile, post, or search links"
                                    active={selected === "twitter-search"}
                                    onClick={() => setSelected("twitter-search")}
                                />
                                <OptionCard
                                    icon={<Instagram size={28} />}
                                    title="Instagram Scraper"
                                    description="Source leads from Instagram profile or post links"
                                    active={selected === "instagram-search"}
                                    onClick={() => setSelected("instagram-search")}
                                />
                                <OptionCard
                                    icon={<Facebook size={28} />}
                                    title="Facebook Scraper"
                                    description="Discover leads from Facebook group or page links"
                                    active={selected === "facebook-search"}
                                    onClick={() => setSelected("facebook-search")}
                                />
                                <OptionCard
                                    icon={<UploadCloud size={28} />}
                                    title="CSV Import"
                                    description="Bulk upload leads from a spreadsheet file"
                                    active={selected === "csv-import"}
                                    onClick={() => setSelected("csv-import")}
                                />
                                <OptionCard
                                    icon={<UserPlus size={28} />}
                                    title="Manual Entry"
                                    description="Add prospects one by one manually"
                                    active={selected === "manual-entry"}
                                    onClick={() => setSelected("manual-entry")}
                                />
                            </div>
                        </>
                    )}

                    {step === 2 && (
                        <div className="space-y-6">
                            {selected === "csv-import" ? (
                                <CSVImport onSuccess={() => {
                                    if (onSuccess) onSuccess();
                                    onClose();
                                }} />
                            ) : selected === "manual-entry" ? (
                                <ManualLeadEntry onSuccess={() => {
                                    if (onSuccess) onSuccess();
                                    onClose();
                                }} />
                            ) : selected === "standard-search" ? (
                                <StandardSearch />
                            ) : selected === "sales-navigator" ? (
                                <SalesNavigator />
                            ) : selected === "linkedin-groups" ? (
                                <LinkedInGroups />
                            ) : selected === "post-engagement" ? (
                                <PostEngagement />
                            ) : selected === "twitter-search" ? (
                                <TwitterSearch />
                            ) : selected === "instagram-search" ? (
                                <InstagramSearch />
                            ) : (
                                <FacebookSearch />
                            )}
                        </div>
                    )}

                    {/* Footer Actions */}
                    <div className="mt-8 flex justify-end gap-3">
                        {step > 1 && (
                            <button
                                onClick={handleBack}
                                className="rounded-xl border border-input bg-background px-6 py-3 text-sm font-semibold text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                            >
                                Back
                            </button>
                        )}
                        {step === 1 && (
                            <button
                                onClick={handleNext}
                                disabled={!listName.trim() || !selectedOrgId}
                                className={`rounded-xl px-8 py-3 text-sm font-semibold text-white shadow-lg transition flex items-center gap-2 bg-blue-600 shadow-blue-500/25 hover:bg-blue-500
                                    ${(!listName.trim() || !selectedOrgId) ? "opacity-70 cursor-not-allowed" : ""}
                                `}
                            >
                                Next
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function OptionCard({
    icon,
    title,
    description,
    active,
    onClick,
    comingSoon,
    disabled
}: {
    icon: React.ReactNode;
    title: string;
    description: string;
    active?: boolean;
    onClick?: () => void;
    comingSoon?: boolean;
    disabled?: boolean;
}) {
    return (
        <button
            onClick={onClick}
            disabled={disabled || comingSoon}
            className={`
                group relative flex h-full flex-col items-start rounded-2xl border p-6 text-left transition-all duration-200
                ${active
                    ? "border-blue-500 bg-blue-500/5 ring-1 ring-blue-500"
                    : "border-border bg-card/50 hover:border-blue-500/30 hover:bg-accent"
                }
                ${(disabled || comingSoon) ? "cursor-not-allowed opacity-60" : "cursor-pointer"}
            `}
        >
            {comingSoon && (
                <span className="absolute right-4 top-4 rounded-full bg-secondary px-2 py-0.5 text-[10px] font-bold tracking-wide text-muted-foreground">
                    COMING SOON
                </span>
            )}

            <div className={`mb-4 ${active ? "text-blue-500" : "text-muted-foreground group-hover:text-foreground"}`}>
                {icon}
            </div>

            <h3 className={`mb-2 text-sm font-semibold ${active ? "text-blue-500" : "text-foreground"}`}>
                {title}
            </h3>

            <p className="text-xs leading-relaxed text-muted-foreground">
                {description}
            </p>
        </button>
    )
}

