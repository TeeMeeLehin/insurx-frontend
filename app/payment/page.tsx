"use client";

import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function PaymentPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const preselectedPlan = searchParams.get("plan");

    const [loading, setLoading] = useState(false);
    const [userEmail, setUserEmail] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("insurx_token");
        if (!token) {
            router.push("/login?redirect=/payment");
            return;
        }
        // In a real app we'd decode token or fetch user profile to get email
        // For now, we'll ask or assume one for testing if not stored.
        // Let's use a placeholder or prompt if needed.
        // Better: Decode token if we had jwt-decode, but let's just use a default test email if we can't get it, 
        // OR fetch user profile. Since we didn't implement /me endpoint, let's fetch /api/auth/me if it existed.
        // Fallback: Just prompt user or use hardcoded for demo.
        setUserEmail("user@example.com"); // Placeholder
    }, [router]);

    const handleSubscribe = async (plan: 'monthly' | 'yearly', amount: number) => {
        setLoading(true);
        const token = localStorage.getItem("insurx_token");

        try {
            const res = await fetch("http://localhost:4000/api/payment/initiate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    amount, // Amount in currency (Backend multiplies by 100 for kobo)
                    email: userEmail || "customer@insurx.com", // Backend needs email for Paystack
                    currency: "NGN"
                })
            });

            const data = await res.json();

            if (res.ok && data.authorization_url) {
                window.location.href = data.authorization_url;
            } else {
                alert("Payment initiation failed: " + (data.error || "Unknown error"));
            }

        } catch (error) {
            console.error("Payment Error:", error);
            alert("Failed to connect to payment server");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans py-24">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">Select Your Plan</h1>
                    <p className="text-gray-500 max-w-2xl mx-auto text-lg">Unlock full climate intelligence today.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                    {/* Monthly Plan */}
                    <div className="bg-white p-10 rounded-3xl border border-gray-200 hover:border-blue-200 transition-colors flex flex-col shadow-sm">
                        <div className="mb-8">
                            <h3 className="text-2xl font-bold text-gray-900">Monthly</h3>
                            <p className="text-gray-500 mt-2">Flexible billing for growing teams.</p>
                        </div>
                        <div className="flex items-baseline gap-1 mb-8">
                            <span className="text-5xl font-bold text-gray-900">GHS 5000</span>
                            <span className="text-xl text-gray-500 font-medium">/month</span>
                        </div>
                        <div className="flex-1 space-y-4 mb-10">
                            {[
                                "Full Climate Intelligence",
                                "Up to 10,000 queries/mo",
                                "Standard Support"
                            ].map((feature, i) => (
                                <div key={i} className="flex items-center gap-3 text-gray-700">
                                    <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs">✓</div>
                                    {feature}
                                </div>
                            ))}
                        </div>
                        <Button
                            onClick={() => handleSubscribe('monthly', 5000)}
                            disabled={loading}
                            className="w-full bg-white text-gray-900 border-2 border-gray-200 hover:border-gray-900 hover:bg-gray-50 text-lg h-14 rounded-xl font-bold transition-all"
                        >
                            {loading ? "Processing..." : "Choose Monthly"}
                        </Button>
                    </div>

                    {/* Yearly Plan */}
                    <div className="bg-gray-900 p-10 rounded-3xl text-white flex flex-col relative overflow-hidden ring-1 ring-gray-900 shadow-xl">
                        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500" />
                        <div className="mb-8 relative z-10">
                            <h3 className="text-2xl font-bold">Yearly</h3>
                            <p className="text-gray-400 mt-2">Maximum value for enterprises.</p>
                        </div>
                        <div className="flex items-baseline gap-1 mb-2 relative z-10">
                            <span className="text-5xl font-bold text-white">GHS 50,000</span>
                            <span className="text-xl text-gray-400 font-medium">/year</span>
                        </div>
                        <p className="text-sm text-green-400 font-medium mb-8 relative z-10">Save GHS 10,000 per year (17% off)</p>

                        <div className="flex-1 space-y-4 mb-10 relative z-10">
                            {[
                                "Full Climate Intelligence",
                                "Unlimited queries",
                                "Priority 24/7 Support"
                            ].map((feature, i) => (
                                <div key={i} className="flex items-center gap-3 text-gray-300">
                                    <div className="w-5 h-5 rounded-full bg-blue-900/50 flex items-center justify-center text-blue-400 text-xs">✓</div>
                                    {feature}
                                </div>
                            ))}
                        </div>
                        <Button
                            onClick={() => handleSubscribe('yearly', 50000)}
                            disabled={loading}
                            className="w-full bg-white text-gray-900 hover:bg-gray-100 text-lg h-14 rounded-xl font-bold shadow-lg transition-all relative z-10"
                        >
                            {loading ? "Processing..." : "Choose Yearly"}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
