"use client";

import { Logo } from "@/components/logo";
import Link from "next/link";

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-white">
            <header className="border-b border-gray-100 px-6 py-4">
                <Link href="/">
                    <Logo size="md" />
                </Link>
            </header>
            <main className="mx-auto max-w-3xl px-6 py-12">
                <h1 className="mb-8 text-3xl font-bold text-gray-900">Terms and Conditions</h1>

                <div className="space-y-6 text-gray-600">
                    <p>Last updated: {new Date().toLocaleDateString()}</p>

                    <section>
                        <h2 className="mb-4 text-xl font-semibold text-gray-800">1. Introduction</h2>
                        <p>
                            Welcome to InsurX. By accessing our website and using our services, you agree to be bound by these Terms and Conditions.
                        </p>
                    </section>

                    <section>
                        <h2 className="mb-4 text-xl font-semibold text-gray-800">2. Use of Service</h2>
                        <p>
                            InsurX provides climate prediction and risk assessment tools. You agree to use these services only for lawful purposes and in accordance with these Terms.
                        </p>
                    </section>

                    <section>
                        <h2 className="mb-4 text-xl font-semibold text-gray-800">3. User Accounts</h2>
                        <p>
                            To access certain features, you must register for an account. You are responsible for maintaining the confidentiality of your account credentials.
                        </p>
                    </section>

                    <section>
                        <h2 className="mb-4 text-xl font-semibold text-gray-800">4. Subscription and Payments</h2>
                        <p>
                            Services are billed on a subscription or per-use basis. You agree to provide accurate billing information and authorize us to charge your payment method.
                        </p>
                    </section>

                    <section>
                        <h2 className="mb-4 text-xl font-semibold text-gray-800">5. Limitation of Liability</h2>
                        <p>
                            InsurX shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the service.
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
