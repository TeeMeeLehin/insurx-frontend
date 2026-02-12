"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function RiskAssessmentPage() {
    const router = useRouter();
    const [location, setLocation] = useState("");
    const [propertyValue, setPropertyValue] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const token = localStorage.getItem("insurx_token");
        if (!token) {
            router.push("/login?redirect=/risk-assessment");
        }
    }, [router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setResult(null);

        const token = localStorage.getItem("insurx_token");

        try {
            const res = await fetch("http://localhost:4000/api/risk-assessment", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    location,
                    propertyValue: Number(propertyValue)
                })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Assessment failed");
            }

            setResult(data.assessment);

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans py-12 px-6">
            <div className="max-w-2xl mx-auto">
                <div className="mb-6">
                    <Link href="/dashboard">
                        <Button variant="ghost" className="pl-0 hover:bg-transparent hover:text-blue-900 text-gray-500">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Dashboard
                        </Button>
                    </Link>
                </div>
                <div className="bg-white rounded-3xl p-10 shadow-sm border border-gray-100">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">New Risk Assessment</h1>
                    <p className="text-gray-500 mb-8">Evaluate property risk with AI-driven precision.</p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <div className="bg-gray-50 p-1 rounded-xl border border-gray-100">
                                <Label htmlFor="location" className="sr-only">Location</Label>
                                <Input
                                    id="location"
                                    placeholder="Enter Property Location (e.g. 10, Abafun Crescent, Labone, Accra)"
                                    className="border-0 bg-transparent shadow-none text-lg h-12"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="bg-gray-50 p-1 rounded-xl border border-gray-100">
                                <Label htmlFor="value" className="sr-only">Property Value</Label>
                                <Input
                                    id="value"
                                    type="number"
                                    placeholder="Property Value (GHS)"
                                    className="border-0 bg-transparent shadow-none text-lg h-12"
                                    value={propertyValue}
                                    onChange={(e) => setPropertyValue(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">
                                {error}
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full bg-blue-900 hover:bg-blue-800 text-white text-lg h-14 rounded-xl"
                            disabled={loading}
                        >
                            {loading ? "Analyzing Risks..." : "Run Assessment"}
                        </Button>
                    </form>

                    {result && (
                        <div className="mt-10 pt-10 border-t border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-xl font-bold text-gray-900">Assessment Results</h2>
                                <div className="text-right">
                                    <span className="block text-sm text-gray-500">Risk Score</span>
                                    <span className={`text-3xl font-bold ${result.riskScore > 50 ? 'text-red-600' : result.riskScore > 20 ? 'text-yellow-600' : 'text-green-600'}`}>
                                        {result.riskScore.toFixed(1)}/100
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <div className="p-4 bg-gray-50 rounded-xl">
                                    <span className="text-sm text-gray-500 block">Hazard Score</span>
                                    <span className="text-xl font-bold text-gray-900">{result.hazardScore}</span>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-xl">
                                    <span className="text-sm text-gray-500 block">Exposure Score</span>
                                    <span className="text-xl font-bold text-gray-900">{(result.riskScore - (result.hazardScore * 0.7)) / 0.3} (Est)</span>
                                    {/* Reverse engineeered for display or just show raw data if available */}
                                </div>
                            </div>

                            <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                                <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                    AI Analysis
                                </h3>
                                <p className="text-blue-800 leading-relaxed text-sm">
                                    {result.aiAnalysis}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
