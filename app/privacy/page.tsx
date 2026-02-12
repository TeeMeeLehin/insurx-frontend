"use client";

import { Logo } from "@/components/logo";
import Link from "next/link";

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-white">
            <header className="border-b border-gray-100 px-6 py-4">
                <Link href="/">
                    <Logo size="md" />
                </Link>
            </header>
            <main className="mx-auto max-w-3xl px-6 py-12">
                <h1 className="mb-8 text-3xl font-bold text-gray-900">Privacy Policy</h1>

                <div className="space-y-6 text-gray-600">
                    <p>Last updated: {new Date().toLocaleDateString()}</p>

                    <section>
                        <h2 className="mb-4 text-xl font-semibold text-gray-800">1. Information Collection</h2>
                        <p>
                            We collect information you provide directly to us, such as when you create an account, subscribe to our newsletter, or contact us.
                        </p>
                    </section>

                    <section>
                        <h2 className="mb-4 text-xl font-semibold text-gray-800">2. Use of Information</h2>
                        <p>
                            We use the information we collect to provide, maintain, and improve our services, and to communicate with you.
                        </p>
                    </section>

                    <section>
                        <h2 className="mb-4 text-xl font-semibold text-gray-800">3. Information Sharing</h2>
                        <p>
                            We do not share your personal information with third parties except as described in this policy or with your consent.
                        </p>
                    </section>

                    <section>
                        <h2 className="mb-4 text-xl font-semibold text-gray-800">4. Data Security</h2>
                        <p>
                            We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access.
                        </p>
                    </section>

                    <div className="pt-8">
                        <Link href="/" className="text-blue-600 hover:underline">
                            &larr; Back to Home
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
