
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface AssessmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function AssessmentModal({ isOpen, onClose, onSuccess }: AssessmentModalProps) {
    const [location, setLocation] = useState("");
    const [propertyValue, setPropertyValue] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setResult(null);

        try {
            const token = localStorage.getItem("insurx_token");
            const res = await fetch("http://localhost:4000/api/assessments", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    location,
                    propertyValue: parseFloat(propertyValue)
                })
            });

            if (!res.ok) throw new Error("Failed to create assessment");

            const data = await res.json();
            setResult(data);
            // Don't close immediately, show result first
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setResult(null);
        setLocation("");
        setPropertyValue("");
        onSuccess(); // Refresh dashboard list
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
            <DialogContent className="sm:max-w-[500px]">
                {!result ? (
                    <form onSubmit={handleSubmit}>
                        <DialogHeader>
                            <DialogTitle>New Client Assessment</DialogTitle>
                            <DialogDescription>
                                Enter the client's location and property value to generate an AI-powered risk profile.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Location / Address</label>
                                <Input
                                    placeholder="e.g. 12 Independence Avenue, Accra"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Property Value ($)</label>
                                <Input
                                    type="number"
                                    placeholder="e.g. 500000"
                                    value={propertyValue}
                                    onChange={(e) => setPropertyValue(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={loading} className="bg-blue-900 text-white">
                                {loading ? "Analyzing..." : "Generate Risk Score"}
                            </Button>
                        </DialogFooter>
                    </form>
                ) : (
                    <div className="space-y-6">
                        <DialogHeader>
                            <DialogTitle className="text-xl text-green-700">Assessment Complete</DialogTitle>
                            <DialogDescription>
                                Risk profile generated for <strong>{result.assessment.location}</strong>.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-gray-50 rounded-lg text-center">
                                <span className="block text-sm text-gray-500">INSURX Risk Score</span>
                                <span className={`block text-3xl font-bold ${result.assessment.riskScore > 0.7 ? 'text-red-600' : result.assessment.riskScore > 0.4 ? 'text-yellow-600' : 'text-green-600'}`}>
                                    {(result.assessment.riskScore * 100).toFixed(0)}/100
                                </span>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-lg text-center">
                                <span className="block text-sm text-gray-500">Hazard Score</span>
                                <span className="block text-xl font-bold text-blue-900">
                                    {(result.assessment.hazardScore * 100).toFixed(0)}/100
                                </span>
                            </div>
                        </div>

                        <div className="p-4 border border-blue-100 bg-blue-50 rounded-lg text-sm text-blue-800">
                            <strong>AI Analysis:</strong><br />
                            {result.assessment.aiAnalysis}
                        </div>

                        <DialogFooter>
                            <Button onClick={handleClose} className="w-full bg-blue-900">
                                Done
                            </Button>
                        </DialogFooter>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
