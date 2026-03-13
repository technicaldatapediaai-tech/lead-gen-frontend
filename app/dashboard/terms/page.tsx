"use client";

import React from "react";

export default function TermsPage() {
    return (
        <div className="flex h-full flex-col p-8 bg-background text-foreground transition-colors overflow-y-auto">
            <div className="max-w-4xl">
                <h1 className="text-3xl font-bold mb-2">Terms and Conditions</h1>
                <p className="text-muted-foreground font-medium mb-10">Effective Date: March 13, 2026</p>

                <div className="space-y-10">
                    <section>
                        <p className="text-lg leading-relaxed text-muted-foreground">
                            Welcome to Lead Genius. By accessing or using our platform, Chrome extension, and related services, you agree to be bound by these Terms and Conditions ("Terms"). If you do not agree to these Terms, please do not use our Service.
                        </p>
                    </section>

                    <hr className="border-border" />

                    <section>
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 text-xs font-bold">01</span>
                            Description of Service
                        </h2>
                        <p className="text-muted-foreground pl-11">
                            Lead Genius provides a SaaS platform for lead enrichment, automated LinkedIn messaging, and email outreach. Our tools are designed to streamline the sales and marketing workflows using AI-driven automation.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400 text-xs font-bold">02</span>
                            Acceptable Use
                        </h2>
                        <ul className="list-disc pl-11 space-y-2 text-muted-foreground">
                            <li>You agree not to use the platform for any illegal activities.</li>
                            <li>You must not violate LinkedIn's or any email provider's terms of service.</li>
                            <li>You are responsible for the data and content you send through the platform.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 text-xs font-bold">03</span>
                            Payments and Refunds
                        </h2>
                        <p className="text-muted-foreground pl-11">
                            Subscriptions are billed according to your chosen plan. All payments are final. Refunds are handled on a case-by-case basis at our sole discretion.
                        </p>
                    </section>

                    <section className="bg-muted p-8 rounded-3xl mt-12">
                        <h2 className="text-lg font-bold mb-2">Questions?</h2>
                        <p className="text-muted-foreground mb-4">If you have any questions regarding these Terms, please contact us at:</p>
                        <p className="font-bold">Email: technicaldatapediaai@gmail.com</p>
                    </section>
                </div>
            </div>
        </div>
    );
}
