"use client";

import React from "react";

export default function PrivacyPage() {
    return (
        <div className="flex h-full flex-col p-8 bg-background text-foreground transition-colors overflow-y-auto">
            <div className="max-w-4xl">
                <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
                <p className="text-muted-foreground font-medium mb-10">Last Updated: March 13, 2026</p>

                <div className="space-y-10">
                    <section>
                        <p className="text-lg leading-relaxed text-muted-foreground">
                            At Lead Genius ("we," "our," or "us"), we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our platform, Chrome extension, and related services (collectively, the "Service").
                        </p>
                    </section>

                    <hr className="border-border" />

                    <section>
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 text-xs font-bold">01</span>
                            Information We Collect
                        </h2>
                        <div className="space-y-6 pl-11">
                            <div>
                                <h3 className="font-bold mb-2">A. Personally Identifiable Information (PII)</h3>
                                <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                                    <li><strong>Account Information:</strong> Name, email address, password, and organization details.</li>
                                    <li><strong>Contact Information:</strong> Billing information and communication preferences.</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-bold mb-2">B. Lead and Business Data</h3>
                                <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                                    <li><strong>Lead Information:</strong> Data you import or enrich through our platform.</li>
                                    <li><strong>Outreach Content:</strong> The content of messages and emails sent through the platform.</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400 text-xs font-bold">02</span>
                            How We Use Your Information
                        </h2>
                        <ul className="list-disc pl-11 space-y-2 text-muted-foreground">
                            <li>Provide and maintain the Lead Genius platform.</li>
                            <li>Facilitate automated LinkedIn and email outreach.</li>
                            <li>Perform AI-driven lead scoring and intelligence analysis.</li>
                            <li>Process payments and provide customer support.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 text-xs font-bold">03</span>
                            Data Sharing and Disclosure
                        </h2>
                        <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800 p-6 rounded-2xl ml-11">
                            <p className="font-bold text-blue-900 dark:text-blue-400">
                                Currently, we do not share any data with third-party services.
                            </p>
                        </div>
                    </section>

                    <section className="bg-muted p-8 rounded-3xl mt-12">
                        <h2 className="text-lg font-bold mb-2">Need help?</h2>
                        <p className="text-muted-foreground mb-4">If you have any questions about this Privacy Policy, please contact us at:</p>
                        <p className="font-bold">Email: technicaldatapediaai@gmail.com</p>
                    </section>
                </div>
            </div>
        </div>
    );
}
