export const mockLeads = [
    {
        id: "1",
        leadName: 'Anirudh Goel',
        company: 'Apollo Tyres Ltd',
        industry: 'Industrial & Automotive',
        location: 'Gurgaon, India',
        revenue: '$2.3B',
        employees: '18,000+',
        source: 'Broker Network',
        type: 'FRESH',
        assignedTo: { name: 'Amit Pasrija', initials: 'AP', color: '#60a5fa' },
        status: 'New',
        dueDate: '25 Sep 2025',
        priority: 'High',
        contacts: [
            { name: 'Anirudh Goel', role: 'Procurement Director', initials: 'AG', colorTheme: 'red' },
            { name: 'Sanjay Kapoor', role: 'HR Head', initials: 'SK', colorTheme: 'green' }
        ]
    },
    {
        id: "2",
        leadName: 'Sarah Khan',
        company: 'Ceat Limited',
        industry: 'Manufacturing',
        location: 'Mumbai, India',
        revenue: '$1.1B',
        employees: '8,000+',
        source: 'Referral',
        type: 'RENEWAL',
        assignedTo: { name: 'Shreya Mehta', initials: 'SM', color: '#c084fc' },
        status: 'In Process',
        dueDate: '26 Sep 2025',
        priority: 'Medium',
        contacts: [
            { name: 'Sarah Khan', role: 'VP Operations', initials: 'SK', colorTheme: 'blue' }
        ]
    }
];

export const getLeadById = (id: string) => {
    return mockLeads.find(lead => lead.id === id);
};
