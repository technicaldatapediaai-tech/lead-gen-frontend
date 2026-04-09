export interface Lead {
    id: string;
    leadName: string;
    company: string;
    industry: string;
    location: string;
    revenue: string;
    employees: string;
    source: string;
    type: string;
    assignedTo: { name: string; initials: string; color: string };
    status: string;
    dueDate: string;
    priority: string;
    contacts: { name: string; role: string; initials: string; colorTheme: string }[];
}

export const mockLeads: Lead[] = [];

export const getLeadById = (id: string) => {
    return (mockLeads as Lead[]).find(lead => lead.id === id);
};
