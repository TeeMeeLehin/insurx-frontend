"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

function CallbackContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const reference = searchParams.get("reference");
    const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");
    const [countdown, setCountdown] = useState(6);

    useEffect(() => {
        if (!reference) {
            setStatus("error");
            return;
        }

        const verifyPayment = async () => {
            try {
                const token = localStorage.getItem("insurx_token");
                const res = await fetch(`http://localhost:4000/api/payment/verify/${reference}`, {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });

                const data = await res.json();

                if (data.status === 'success') {
                    setStatus("success");
                    // Start countdown
                    const timer = setInterval(() => {
                        setCountdown((prev) => {
                            if (prev <= 1) {
                                clearInterval(timer);
                                router.push("/dashboard");
                                return 0;
                            }
                            return prev - 1;
                        });
                    }, 1000);
                } else {
                    setStatus("error");
                }
            } catch (err) {
                console.error(err);
                setStatus("error");
            }
        };

        verifyPayment();
    }, [reference, router]);

    if (status === "verifying") {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-900 mb-4"></div>
                <h2 className="text-xl font-semibold text-gray-700">Verifying Payment...</h2>
            </div>
        );
    }

    if (status === "success") {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
                <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
                    <p className="text-gray-600 mb-6">
                        Your subscription is now active. You have full access to climate risk assessments.
                    </p>
                    <div className="p-4 bg-blue-50 rounded-xl text-blue-800 text-sm font-medium mb-6">
                        Redirecting to Dashboard in {countdown}s...
                    </div>
                    <Button
                        onClick={() => router.push("/dashboard")}
                        className="w-full bg-blue-900 hover:bg-blue-800 text-white"
                    >
                        Go to Dashboard Now
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
            <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Verification Failed</h1>
                <p className="text-gray-600 mb-6">
                    We couldn't verify your payment. Please contact support if you believe this is an error.
                </p>
                <Button
                    onClick={() => router.push("/payment")}
                    variant="outline"
                    className="w-full"
                >
                    Try Again
                </Button>
            </div>
        </div>
    );
}

export default function PaymentCallbackPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <CallbackContent />
        </Suspense>
    );
}
