export interface Feature {
  tag: string;
  title: string;
  desc: string;
  bullets: string[];
  image: string;
}

export interface Review {
  author: string;
  avatar: string;
  text: string;
}

export interface Tier {
  name: string;
  price: number;
  desc: string;
  features: string[];
  popular?: boolean;
}

export interface Product {
    id: string;
    name: string;
    category: string;
    subtitle: string;
    description: string;
    rating: number;
    reviews: number;
    price: number;
    originalPrice: number;
    image: string;
    icon: string;
    isNew: boolean;
    alternatives: string[];
    integrations: string[];
    bestFor: string[];
    features: Feature[];
    reviews_data?: Review[];
    tiers: Tier[];
}

export const products: Product[] = [
    {
        id: "emailit",
        name: "Emailit",
        category: "Email marketing",
        subtitle: "Send transactional and marketing emails easily with a powerful API and SMTP infrastructure built for speed and reliability.",
        description: "Automate your cold outreach with high-converting sequences and AI personalization. Emailit is designed for immediate productivity. Our simplified setup process gets your first campaign out the door without technical friction.",
        rating: 4.9,
        reviews: 174,
        price: 49,
        originalPrice: 280,
        image: "/community/emailit_hero.png",
        icon: "fas fa-at",
        isNew: true,
        alternatives: ["Mailgun", "SendGrid", "Amazon SES"],
        integrations: ["Zapier", "WordPress", "Shopify", "HubSpot"],
        bestFor: ["SaaS Founders", "Developers", "Marketing Agencies"],
        features: [
            {
                tag: "ONBOARDING",
                title: "Start sending in minutes",
                desc: "Emailit is designed for immediate productivity. Our simplified setup process gets your first campaign out the door without technical friction.",
                bullets: ["One-click SMTP configuration", "Pre-built transactional templates"],
                image: "https://images.unsplash.com/photo-1557200134-90327ee9fafa?auto=format&fit=crop&w=800&q=80",
            },
            {
                tag: "INFRASTRUCTURE",
                title: "Add and verify your domains",
                desc: "Maintain high deliverability by authenticating your own domains. Our system provides automated DNS records for SPF, DKIM, and DMARC.",
                bullets: ["Automatic domain health checks", "Subdomain support for better isolation"],
                image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80"
            },
            {
                tag: "ANALYTICS",
                title: "Track performance & manage bounces",
                desc: "Real-time data visualization helps you understand exactly how your recipients are interacting with your emails.",
                bullets: ["Heatmaps for link click-through tracking", "Automated bounce and spam complaint removal"],
                image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80"
            }
        ],
        reviews_data: [
            { author: "Jason H.", avatar: "https://i.pravatar.cc/40?u=jason", text: "Switched from Mailgun and haven't looked back. The deliverability is stellar and the UI is actually intuitive. Best platform purchase this year!" },
            { author: "Sarah M.", avatar: "https://i.pravatar.cc/40?u=sarah", text: "The API integration was seamless. We had our first transactional batch running in under 20 minutes." }
        ],
        tiers: [
            { name: "License Tier 1", price: 49, desc: "Perfect for startups and side projects.", features: ["1 Domain(s)", "1 Workspace member", "25k Credits per month"] },
            { name: "License Tier 2", price: 99, desc: "The sweet spot for growing companies.", features: ["5 Domain(s)", "5 Workspace members", "100k Credits per month"], popular: true },
            { name: "License Tier 3", price: 199, desc: "High volume for professional agencies.", features: ["15 Domain(s)", "10 Workspace members", "500k Credits per month"] },
            { name: "License Tier 4", price: 399, desc: "Enterprise-grade limits and priority.", features: ["Unlimited Domain(s)", "Unlimited Workspace members", "1M Credits per month"] }
        ]
    },
    {
        id: "robomotion-rpa",
        name: "Robomotion RPA",
        category: "Productivity",
        subtitle: "Cloud-native RPA platform for automating web and desktop tasks with ease.",
        description: "Cloud-native RPA platform for automating complex web and desktop tasks with ease. Build robots without code or dive deep into JavaScript for advanced automation.",
        rating: 4.8,
        reviews: 852,
        price: 119,
        originalPrice: 1980,
        image: "/community/robomotion_hero.png",
        icon: "fas fa-robot",
        isNew: false,
        alternatives: ["UiPath", "Automation Anywhere", "Blue Prism"],
        integrations: ["Slack", "Google Drive", "Trello"],
        bestFor: ["IT Managers", "Data Analysts", "Operations Teams"],
        features: [
            {
                tag: "ONBOARDING",
                title: "Start Automating in Minutes",
                desc: "Robomotion RPA is built for speed. Use our visual designer to map out your first automation flow and deploy it to the cloud instantly.",
                bullets: ["No-code flow builder", "Pre-built automation templates"],
                image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80"
            },
            {
                tag: "INFRASTRUCTURE",
                title: "Secure Robot Infrastructure",
                desc: "Deploy robots anywhere without managing servers. Our cloud orchestrator handles scheduling, monitoring, and scaling with enterprise-grade security.",
                bullets: ["Infinite cloud scale", "Real-time robot monitoring"],
                image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80"
            },
            {
                tag: "ANALYTICS",
                title: "Real-time Execution Analytics",
                desc: "Gain deep insights into your automation efficiency. Track success rates, ROI, and execution logs in a centralized dashboard.",
                bullets: ["Visual success tracking", "Detailed execution logs"],
                image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80"
            }
        ],
        tiers: [
            { name: "License Tier 1", price: 119, desc: "Perfect for startups and side projects.", features: ["1 Robot", "Cloud Orchestrator", "Email Support"] },
            { name: "License Tier 2", price: 299, desc: "The sweet spot for growing companies.", features: ["5 Robots", "Priority Support", "Advanced Analytics"], popular: true },
            { name: "License Tier 3", price: 599, desc: "High volume for professional agencies.", features: ["15 Robots", "Custom Integrations", "Dedicated Account Manager"] },
            { name: "License Tier 4", price: 1299, desc: "Enterprise-grade limits and priority.", features: ["Unlimited Robots", "On-premise deployment", "24/7 Phone Support"] }
        ]
    },
    {
        id: "sendpilot",
        name: "Sendpilot",
        category: "Social Media",
        subtitle: "Create social media posts from your blog posts automatically.",
        description: "Transform your blog posts into high-engagement social media content automatically. Save hours of manual work and increase your reach across all platforms.",
        rating: 4.5,
        reviews: 54,
        price: 59,
        originalPrice: 480,
        image: "/community/sendpilot_hero.png",
        icon: "fas fa-rocket",
        isNew: false,
        alternatives: ["Buffer", "Hootsuite", "Missinglettr"],
        integrations: ["WordPress", "Twitter", "LinkedIn", "Facebook"],
        bestFor: ["Bloggers", "Content Managers", "SMM Agencies"],
        features: [
            {
                tag: "ONBOARDING",
                title: "Automate Posts in Minutes",
                desc: "Transform your blog posts into high-engagement social media content automatically. Save hours of manual work and increase your reach across all platforms.",
                bullets: ["One-click blog importing", "AI-powered post generation"],
                image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=800&q=80"
            },
            {
                tag: "INFRASTRUCTURE",
                title: "Reliable Post Infrastructure",
                desc: "Our robust scheduling engine ensures your content goes live at the perfect time. We handle all platform API complexities for you.",
                bullets: ["Multi-platform scheduling", "Automatic caption optimization"],
                image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80"
            },
            {
                tag: "ANALYTICS",
                title: "Detailed Engagement Analytics",
                desc: "See exactly how your social content is performing. Track clicks, shares, and engagement rates across all your social channels.",
                bullets: ["Cross-platform reporting", "Engagement trend tracking"],
                image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80"
            }
        ],
        tiers: [
            { name: "License Tier 1", price: 59, desc: "Perfect for startups and side projects.", features: ["3 Social accounts", "100 Posts/mo", "AI Generator"] },
            { name: "License Tier 2", price: 149, desc: "The sweet spot for growing companies.", features: ["20 Social accounts", "Unlimited Posts", "Custom branding"], popular: true },
            { name: "License Tier 3", price: 299, desc: "High volume for professional agencies.", features: ["50 Social accounts", "White Labeling", "Priority AI Queue"] },
            { name: "License Tier 4", price: 499, desc: "Enterprise-grade limits and priority.", features: ["Unlimited accounts", "API Access", "Dedicated Success Manager"] }
        ]
    },
    {
        id: "visby",
        name: "Visby",
        category: "Content Creation",
        subtitle: "Hyper-fast video hosting and player with advanced analytics.",
        description: "Hyper-fast video hosting with advanced analytics and interactive player features. Perfect for course creators and marketing teams looking for a professional video experience.",
        rating: 4.7,
        reviews: 312,
        price: 79,
        originalPrice: 990,
        image: "/community/visby_hero.png",
        icon: "fas fa-play",
        isNew: true,
        alternatives: ["Vimeo", "Wistia", "YouTube"],
        integrations: ["LMS", "HubSpot", "Zapier"],
        bestFor: ["Course Creators", "Marketing Teams", "Sales Professional"],
        features: [
            {
                tag: "ONBOARDING",
                title: "Host and Embed in Minutes",
                desc: "Hyper-fast video hosting with advanced analytics and interactive player features. Perfect for course creators and marketing teams.",
                bullets: ["Drag-and-drop uploading", "Instant embed-code generation"],
                image: "/community/visby.png"
            },
            {
                tag: "INFRASTRUCTURE",
                title: "Global Video Infrastructure",
                desc: "Brand your video player with your own colors and logo. Our global CDN ensures buffer-free playback for every viewer, anywhere in the world.",
                bullets: ["Ultra-fast global CDN", "Adaptive bitrate streaming"],
                image: "https://images.unsplash.com/photo-1492724441997-5dc865305da7?auto=format&fit=crop&w=800&q=80"
            },
            {
                tag: "ANALYTICS",
                title: "Advanced Viewer Analytics",
                desc: "Understand your audience like never before. See where they engage, where they drop off, and how they interact with your CTAs.",
                bullets: ["Engagement heatmaps", "Conversion tracking"],
                image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80"
            }
        ],
        tiers: [
            { name: "License Tier 1", price: 79, desc: "Perfect for startups and side projects.", features: ["10 Videos", "Standard Analytics", "Custom Player"] },
            { name: "License Tier 2", price: 249, desc: "The sweet spot for growing companies.", features: ["Unlimited Videos", "Advanced Analytics", "White Labeling"], popular: true },
            { name: "License Tier 3", price: 499, desc: "High volume for professional agencies.", features: ["500GB Storage", "Interactive CTAs", "API Access"] },
            { name: "License Tier 4", price: 899, desc: "Enterprise-grade limits and priority.", features: ["Unlimited Storage", "SSO Authentication", "Dedicated Transcoding Queue"] }
        ]
    }
];
