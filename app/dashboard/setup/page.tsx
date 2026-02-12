"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function SetupPage() {
    const router = useRouter();
    const [startArea, setStartArea] = useState("");
    const [endArea, setEndArea] = useState("");

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [mapLoaded, setMapLoaded] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setMapLoaded(true);
        }, 8000); // 3 seconds delay
        return () => clearTimeout(timer);
    }, []);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        const token = localStorage.getItem("insurx_token");
        if (!token) {
            router.push("/login");
            return;
        }

        try {
            const res = await fetch("http://localhost:4000/api/monitoring/config", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    startArea,
                    endArea
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to save settings");
            }

            router.push("/dashboard");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            {/* Header */}
            <header className="bg-white py-6 shadow-sm z-10">
                <div className="container mx-auto px-6 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-blue-900 leading-tight">
                            START A FREE 3 DAY TRIAL TO STAY <br />
                            UPDATED ON ALL CLIMATE CHANGES
                        </h1>
                        <p className="text-blue-900/70 mt-2 text-lg">Starting From $300/Month</p>
                    </div>
                    <Link href="/payment">
                        <Button className="bg-blue-900 text-white hover:bg-blue-800 px-8 py-6 text-lg rounded-md hidden md:flex">
                            Subscribe Now
                        </Button>
                    </Link>
                </div>
            </header>

            <main className="flex-1 container mx-auto px-6 py-12">
                <div className="grid md:grid-cols-2 gap-8 h-full max-w-6xl mx-auto">
                    {/* Left Panel - Loading State / Map Placeholder */}
                    {/* Left Panel - Loading State / Map Placeholder */}
                    <div className="bg-blue-100/50 rounded-3xl flex flex-col items-center justify-center min-h-[500px] border border-blue-200/50 overflow-hidden relative">
                        {!mapLoaded ? (
                            <div className="flex flex-col items-center">
                                <div className="animate-spin mb-6">
                                    <svg className="w-16 h-16 text-blue-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                </div>
                                <p className="text-xl font-medium text-gray-900">Loading Weather Map</p>
                            </div>
                        ) : (
                            <img
                                src="/ghana-weather-map.png"
                                alt="Ghana Weather Map"
                                className="w-full h-full object-cover animate-in fade-in duration-1000"
                            />
                        )}
                    </div>

                    {/* Right Panel - Form */}
                    <div className="bg-blue-100/50 rounded-3xl p-10 border border-blue-200/50 flex flex-col justify-center">
                        <div className="max-w-md mx-auto w-full">
                            <h2 className="text-lg font-bold text-gray-900 mb-1">Start Trial :</h2>
                            <p className="text-gray-600 mb-8 text-sm leading-relaxed">
                                Only free for 3 days, you can set locations and check predictions for different areas in Accra Ghana
                            </p>

                            {error && (
                                <div className="mb-4 p-3 bg-red-100/50 text-red-600 text-sm rounded-lg border border-red-200">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-4">
                                    <div className="bg-white p-1 rounded-xl shadow-sm border border-gray-100">
                                        <Label htmlFor="startArea" className="sr-only">Start Area</Label>
                                        <div className="flex items-center px-4">
                                            <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                            <Input
                                                id="startArea"
                                                placeholder="Start Area (e.g. Accra)"
                                                className="border-0 shadow-none focus-visible:ring-0 text-base py-6 bg-transparent"
                                                value={startArea}
                                                onChange={(e) => setStartArea(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="bg-white p-1 rounded-xl shadow-sm border border-gray-100">
                                        <Label htmlFor="endArea" className="sr-only">End Area</Label>
                                        <div className="flex items-center px-4">
                                            <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                            <Input
                                                id="endArea"
                                                placeholder="End Area (e.g. Kumasi)"
                                                className="border-0 shadow-none focus-visible:ring-0 text-base py-6 bg-transparent"
                                                value={endArea}
                                                onChange={(e) => setEndArea(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full bg-blue-700 hover:bg-blue-800 text-white text-lg font-semibold py-7 rounded-lg shadow-lg"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? "Analyzing..." : "Start Analysis"}
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
