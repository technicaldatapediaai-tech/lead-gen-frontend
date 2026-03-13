"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import { toast } from "sonner";
import {
    Building2,
    Globe,
    Briefcase,
    Users,
    Plus,
    Check,
    Loader2,
    Edit,
    Mail,
    Shield,
    Crown,
    User,
    Eye,
    X,
    Send,
    ChevronDown,
    ChevronUp,
    MoreVertical,
    Trash2,
    UserPlus
} from "lucide-react";

interface Organization {
    id: string;
    name: string;
    domain?: string;
    industry?: string;
    business_model?: string;
    stage?: string;
    role: string;
    joined_at: string;
    is_active: boolean;
}

interface OrganizationsResponse {
    organizations: Organization[];
    count: number;
}

interface Member {
    id: string;
    user_id: string;
    email: string;
    full_name?: string;
    role: string;
    joined_at: string;
    is_active: boolean;
}

interface MembersResponse {
    members: Member[];
    count: number;
}

const ROLE_ICONS: Record<string, React.ReactNode> = {
    owner: <Crown className="h-3 w-3" />,
    admin: <Shield className="h-3 w-3" />,
    member: <User className="h-3 w-3" />,
    viewer: <Eye className="h-3 w-3" />,
};

const ROLE_COLORS: Record<string, string> = {
    owner: "bg-amber-500/10 text-amber-500 border-amber-500/30",
    admin: "bg-purple-500/10 text-purple-500 border-purple-500/30",
    member: "bg-blue-500/10 text-blue-500 border-blue-500/30",
    viewer: "bg-gray-500/10 text-gray-400 border-gray-500/30",
};

export default function OrganisationPage() {
    const router = useRouter();
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
    const [members, setMembers] = useState<Member[]>([]);
    const [isLoadingMembers, setIsLoadingMembers] = useState(false);
    const [expandedOrgs, setExpandedOrgs] = useState<Set<string>>(new Set());

    // Invite modal state
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [inviteEmail, setInviteEmail] = useState("");
    const [inviteRole, setInviteRole] = useState("member");
    const [isSendingInvite, setIsSendingInvite] = useState(false);

    // Edit modal state
    const [showEditModal, setShowEditModal] = useState(false);
    const [editName, setEditName] = useState("");
    const [editDomain, setEditDomain] = useState("");
    const [editIndustry, setEditIndustry] = useState("");
    const [editBusinessModel, setEditBusinessModel] = useState("");

    // Role change state
    const [changingRole, setChangingRole] = useState<string | null>(null);

    // Fetch organizations
    useEffect(() => {
        async function fetchOrganizations() {
            setIsLoading(true);
            const { data, error } = await api.get<OrganizationsResponse>("/api/organizations");

            if (error) {
                toast.error("Failed to load organizations");
                setIsLoading(false);
                return;
            }

            if (data) {
                setOrganizations(data.organizations || []);
                if (data.organizations?.length > 0) {
                    setSelectedOrg(data.organizations[0]);
                    setExpandedOrgs(new Set([data.organizations[0].id]));
                }
            }
            setIsLoading(false);
        }

        fetchOrganizations();
    }, []);

    // Fetch members when selected org changes
    useEffect(() => {
        async function fetchMembers() {
            if (!selectedOrg) return;

            setIsLoadingMembers(true);
            const { data, error } = await api.get<MembersResponse>(`/api/organizations/${selectedOrg.id}/members`);

            if (!error && data) {
                setMembers(data.members || []);
            }
            setIsLoadingMembers(false);
        }

        fetchMembers();
    }, [selectedOrg]);

    const toggleOrgExpand = (orgId: string) => {
        const newExpanded = new Set(expandedOrgs);
        if (newExpanded.has(orgId)) {
            newExpanded.delete(orgId);
        } else {
            newExpanded.add(orgId);
        }
        setExpandedOrgs(newExpanded);
    };

    const handleSwitchOrg = async (org: Organization) => {
        const { data, error } = await api.post<{ access_token: string }>(
            `/api/organizations/switch/${org.id}`
        );

        if (data) {
            localStorage.setItem("access_token", data.access_token);
            setSelectedOrg(org);
            toast.success(`Switched to ${org.name}`);
            window.location.reload();
        }
    };

    const openEditModal = (org: Organization) => {
        setEditName(org.name);
        setEditDomain(org.domain || "");
        setEditIndustry(org.industry || "");
        setEditBusinessModel(org.business_model || "");
        setShowEditModal(true);
    };

    const handleSaveEdit = async () => {
        if (!selectedOrg) return;

        setIsSaving(true);
        const { data, error } = await api.patch(`/api/organizations/${selectedOrg.id}`, {
            name: editName,
            domain: editDomain || undefined,
            industry: editIndustry || undefined,
            business_model: editBusinessModel || undefined,
        });

        if (error) {
            toast.error(error.detail || "Failed to update organization");
        } else {
            toast.success("Organization updated successfully!");
            // Update local state
            setOrganizations(orgs => orgs.map(o =>
                o.id === selectedOrg.id
                    ? { ...o, name: editName, domain: editDomain, industry: editIndustry, business_model: editBusinessModel }
                    : o
            ));
            setSelectedOrg({
                ...selectedOrg,
                name: editName,
                domain: editDomain,
                industry: editIndustry,
                business_model: editBusinessModel,
            });
            setShowEditModal(false);
        }
        setIsSaving(false);
    };

    const handleInviteMember = async () => {
        if (!inviteEmail.trim()) {
            toast.error("Please enter an email address");
            return;
        }

        setIsSendingInvite(true);
        const { data, error } = await api.post(`/api/organizations/${selectedOrg!.id}/invite`, {
            email: inviteEmail.trim(),
            role: inviteRole,
        });

        if (error) {
            toast.error(error.detail || "Failed to send invitation");
        } else {
            toast.success(`Invitation sent to ${inviteEmail}!`);
            setShowInviteModal(false);
            setInviteEmail("");
            setInviteRole("member");
        }
        setIsSendingInvite(false);
    };

    const handleChangeRole = async (memberId: string, newRole: string) => {
        setChangingRole(memberId);
        const { error } = await api.patch(`/api/organizations/${selectedOrg!.id}/members/${memberId}`, {
            role: newRole,
        });

        if (error) {
            toast.error(error.detail || "Failed to update role");
        } else {
            toast.success("Role updated successfully!");
            setMembers(members.map(m =>
                m.id === memberId ? { ...m, role: newRole } : m
            ));
        }
        setChangingRole(null);
    };

    const handleRemoveMember = async (memberId: string, memberEmail: string) => {
        if (!confirm(`Are you sure you want to remove ${memberEmail} from this organization?`)) {
            return;
        }

        const { error } = await api.delete(`/api/organizations/${selectedOrg!.id}/members/${memberId}`);

        if (error) {
            toast.error(error.detail || "Failed to remove member");
        } else {
            toast.success("Member removed successfully!");
            setMembers(members.filter(m => m.id !== memberId));
        }
    };

    const isOwnerOrAdmin = (org: Organization) => {
        return org.role === "owner" || org.role === "admin";
    };

    if (isLoading) {
        return (
            <div className="flex h-full w-full items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                    <p className="text-sm text-muted-foreground">Loading organizations...</p>
                </div>
            </div>
        );
    }

    if (organizations.length === 0) {
        return (
            <div className="flex h-full flex-col items-center justify-center p-8 bg-background text-foreground">
                <Building2 className="h-16 w-16 text-muted-foreground mb-4" />
                <h1 className="text-2xl font-bold mb-2">No Organizations Found</h1>
                <p className="text-muted-foreground mb-6">Create your first organization to get started.</p>
                <button
                    onClick={() => router.push("/setup")}
                    className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-500 transition-colors"
                >
                    <Plus className="h-4 w-4" />
                    Create Organization
                </button>
            </div>
        );
    }

    return (
        <div className="h-full w-full overflow-y-auto bg-background p-6 text-foreground">
            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">My Organizations</h1>
                    <p className="text-sm text-muted-foreground">
                        You are a member of {organizations.length} organization{organizations.length !== 1 ? "s" : ""}.
                    </p>
                </div>
                <button
                    onClick={() => router.push("/onboarding/create-org")}
                    className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 transition-colors"
                >
                    <Plus className="h-4 w-4" />
                    New Organization
                </button>
            </div>

            {/* Organizations List */}
            <div className="space-y-4">
                {organizations.map((org) => (
                    <div key={org.id} className="rounded-2xl border border-border bg-card overflow-hidden">
                        {/* Organization Header */}
                        <div
                            className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/30 transition-colors"
                            onClick={() => toggleOrgExpand(org.id)}
                        >
                            <div className="flex items-center gap-4">
                                <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-400/10 text-xl font-bold text-blue-500">
                                    {org.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-lg font-semibold">{org.name}</h3>
                                        {selectedOrg?.id === org.id && (
                                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/10 text-green-500 border border-green-500/30">
                                                Active
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                        {org.domain && <span>{org.domain}</span>}
                                        {org.industry && <span>• {org.industry}</span>}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                {/* Role Badge */}
                                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border capitalize ${ROLE_COLORS[org.role] || ROLE_COLORS.member}`}>
                                    {ROLE_ICONS[org.role]}
                                    {org.role}
                                </span>

                                {/* Expand Icon */}
                                {expandedOrgs.has(org.id) ? (
                                    <ChevronUp className="h-5 w-5 text-muted-foreground" />
                                ) : (
                                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                                )}
                            </div>
                        </div>

                        {/* Expanded Content */}
                        {expandedOrgs.has(org.id) && (
                            <div className="border-t border-border p-4 bg-muted/10">
                                {/* Organization Details */}
                                <div className="grid gap-4 md:grid-cols-4 mb-6">
                                    <div>
                                        <label className="text-xs font-medium text-muted-foreground">Website</label>
                                        <p className="text-sm">{org.domain || "Not set"}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-muted-foreground">Industry</label>
                                        <p className="text-sm">{org.industry || "Not set"}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-muted-foreground">Business Model</label>
                                        <p className="text-sm">{org.business_model || "Not set"}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-muted-foreground">Joined</label>
                                        <p className="text-sm">{new Date(org.joined_at).toLocaleDateString()}</p>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-wrap gap-2 mb-6">
                                    {selectedOrg?.id !== org.id && (
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleSwitchOrg(org); }}
                                            className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-500 transition-colors"
                                        >
                                            <Check className="h-3 w-3" />
                                            Switch to this
                                        </button>
                                    )}

                                    {isOwnerOrAdmin(org) && (
                                        <>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); setSelectedOrg(org); openEditModal(org); }}
                                                className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-accent transition-colors"
                                            >
                                                <Edit className="h-3 w-3" />
                                                Edit Details
                                            </button>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); setSelectedOrg(org); setShowInviteModal(true); }}
                                                className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-accent transition-colors"
                                            >
                                                <UserPlus className="h-3 w-3" />
                                                Invite Member
                                            </button>
                                        </>
                                    )}
                                </div>

                                {/* Team Members Section */}
                                {selectedOrg?.id === org.id && (
                                    <div>
                                        <div className="flex items-center justify-between mb-3">
                                            <h4 className="text-sm font-semibold flex items-center gap-2">
                                                <Users className="h-4 w-4" />
                                                Team Members ({members.length})
                                            </h4>
                                        </div>

                                        {isLoadingMembers ? (
                                            <div className="flex items-center justify-center py-6">
                                                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                                            </div>
                                        ) : members.length > 0 ? (
                                            <div className="bg-card rounded-xl border border-border overflow-hidden">
                                                <table className="w-full">
                                                    <thead className="bg-muted/30">
                                                        <tr className="text-xs text-muted-foreground">
                                                            <th className="text-left px-4 py-2 font-medium">Member</th>
                                                            <th className="text-left px-4 py-2 font-medium">Email</th>
                                                            <th className="text-left px-4 py-2 font-medium">Role</th>
                                                            <th className="text-left px-4 py-2 font-medium">Joined</th>
                                                            {isOwnerOrAdmin(org) && (
                                                                <th className="text-right px-4 py-2 font-medium">Actions</th>
                                                            )}
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {members.map((member) => (
                                                            <tr key={member.id} className="border-t border-border">
                                                                <td className="px-4 py-3">
                                                                    <div className="flex items-center gap-2">
                                                                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500/30 to-cyan-400/20 grid place-items-center text-xs font-bold">
                                                                            {member.full_name?.charAt(0) || member.email.charAt(0).toUpperCase()}
                                                                        </div>
                                                                        <span className="text-sm font-medium">
                                                                            {member.full_name || member.email.split("@")[0]}
                                                                        </span>
                                                                    </div>
                                                                </td>
                                                                <td className="px-4 py-3 text-sm text-muted-foreground">
                                                                    {member.email}
                                                                </td>
                                                                <td className="px-4 py-3">
                                                                    {isOwnerOrAdmin(org) && member.role !== "owner" ? (
                                                                        <select
                                                                            value={member.role}
                                                                            onChange={(e) => handleChangeRole(member.id, e.target.value)}
                                                                            disabled={changingRole === member.id}
                                                                            className={`text-xs px-2 py-1 rounded border capitalize ${ROLE_COLORS[member.role] || ""} bg-transparent cursor-pointer`}
                                                                        >
                                                                            <option value="admin">Admin</option>
                                                                            <option value="member">Member</option>
                                                                            <option value="viewer">Viewer</option>
                                                                        </select>
                                                                    ) : (
                                                                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium border capitalize ${ROLE_COLORS[member.role] || ROLE_COLORS.member}`}>
                                                                            {ROLE_ICONS[member.role]}
                                                                            {member.role}
                                                                        </span>
                                                                    )}
                                                                </td>
                                                                <td className="px-4 py-3 text-sm text-muted-foreground">
                                                                    {new Date(member.joined_at).toLocaleDateString()}
                                                                </td>
                                                                {isOwnerOrAdmin(org) && (
                                                                    <td className="px-4 py-3 text-right">
                                                                        {member.role !== "owner" && (
                                                                            <button
                                                                                onClick={() => handleRemoveMember(member.id, member.email)}
                                                                                className="text-red-500 hover:text-red-400 p-1"
                                                                                title="Remove member"
                                                                            >
                                                                                <Trash2 className="h-4 w-4" />
                                                                            </button>
                                                                        )}
                                                                    </td>
                                                                )}
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        ) : (
                                            <p className="text-sm text-muted-foreground text-center py-6 bg-card rounded-xl border border-border">
                                                No team members yet.
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Invite Member Modal */}
            {showInviteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold">Invite Team Member</h3>
                            <button onClick={() => setShowInviteModal(false)} className="text-muted-foreground hover:text-foreground">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <p className="text-sm text-muted-foreground mb-6">
                            Send an email invitation to join <strong>{selectedOrg?.name}</strong>.
                        </p>

                        <div className="space-y-4">
                            <div>
                                <label htmlFor="invite-email" className="block text-xs font-medium text-muted-foreground mb-2">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    id="invite-email"
                                    name="invite-email"
                                    value={inviteEmail}
                                    onChange={(e) => setInviteEmail(e.target.value)}
                                    placeholder="colleague@company.com"
                                    className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm outline-none focus:border-blue-500 transition-colors"
                                />
                            </div>

                            <div>
                                <label htmlFor="invite-role" className="block text-xs font-medium text-muted-foreground mb-2">
                                    Role
                                </label>
                                <select
                                    id="invite-role"
                                    name="invite-role"
                                    value={inviteRole}
                                    onChange={(e) => setInviteRole(e.target.value)}
                                    className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm outline-none focus:border-blue-500 transition-colors"
                                >
                                    <option value="admin">Admin - Can manage team & settings</option>
                                    <option value="member">Member - Full access to leads & campaigns</option>
                                    <option value="viewer">Viewer - Read-only access</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setShowInviteModal(false)}
                                className="flex-1 rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-accent transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleInviteMember}
                                disabled={isSendingInvite}
                                className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 transition-colors disabled:opacity-50"
                            >
                                {isSendingInvite ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Send className="h-4 w-4" />
                                )}
                                Send Invitation
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Organization Modal */}
            {showEditModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold">Edit Organization</h3>
                            <button onClick={() => setShowEditModal(false)} className="text-muted-foreground hover:text-foreground">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label htmlFor="edit-name" className="block text-xs font-medium text-muted-foreground mb-2">
                                    Organization Name
                                </label>
                                <input
                                    type="text"
                                    id="edit-name"
                                    name="edit-name"
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm outline-none focus:border-blue-500 transition-colors"
                                />
                            </div>

                            <div>
                                <label htmlFor="edit-domain" className="block text-xs font-medium text-muted-foreground mb-2">
                                    Website Domain
                                </label>
                                <input
                                    type="text"
                                    id="edit-domain"
                                    name="edit-domain"
                                    value={editDomain}
                                    onChange={(e) => setEditDomain(e.target.value)}
                                    placeholder="example.com"
                                    className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm outline-none focus:border-blue-500 transition-colors"
                                />
                            </div>

                            <div>
                                <label htmlFor="edit-industry" className="block text-xs font-medium text-muted-foreground mb-2">
                                    Industry
                                </label>
                                <select
                                    id="edit-industry"
                                    name="edit-industry"
                                    value={editIndustry}
                                    onChange={(e) => setEditIndustry(e.target.value)}
                                    className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm outline-none focus:border-blue-500 transition-colors"
                                >
                                    <option value="">Select industry...</option>
                                    <option value="SaaS">SaaS</option>
                                    <option value="Agency">Agency</option>
                                    <option value="E-commerce">E-commerce</option>
                                    <option value="Services">Services</option>
                                    <option value="Technology">Technology</option>
                                    <option value="Finance">Finance</option>
                                    <option value="Healthcare">Healthcare</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="edit-business-model" className="block text-xs font-medium text-muted-foreground mb-2">
                                    Business Model
                                </label>
                                <select
                                    id="edit-business-model"
                                    name="edit-business-model"
                                    value={editBusinessModel}
                                    onChange={(e) => setEditBusinessModel(e.target.value)}
                                    className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm outline-none focus:border-blue-500 transition-colors"
                                >
                                    <option value="">Select type...</option>
                                    <option value="B2B">B2B</option>
                                    <option value="B2C">B2C</option>
                                    <option value="B2B2C">B2B2C</option>
                                    <option value="Marketplace">Marketplace</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setShowEditModal(false)}
                                className="flex-1 rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-accent transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveEdit}
                                disabled={isSaving}
                                className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 transition-colors disabled:opacity-50"
                            >
                                {isSaving ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Check className="h-4 w-4" />
                                )}
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
