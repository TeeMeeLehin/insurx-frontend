"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  MapPin,
  ArrowRight,
  Loader2,
  ShieldCheck,
  Zap,
  CloudRain,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function SetupPage() {
  const router = useRouter();

  /* ---- existing state (untouched) ---- */
  const [startArea, setStartArea] = useState("");
  const [endArea, setEndArea] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  /* ---- existing effect (untouched) ---- */
  useEffect(() => {
    const timer = setTimeout(() => {
      setMapLoaded(true);
    }, 8000);
    return () => clearTimeout(timer);
  }, []);

  /* ---- existing handler (untouched) ---- */
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
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ startArea, endArea }),
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

  /* ================================================================ */
  /*  Feature bullets                                                  */
  /* ================================================================ */
  const features = [
    {
      icon: CloudRain,
      label: "Real-time Climate Data",
      desc: "Live weather monitoring for your coverage area",
    },
    {
      icon: Zap,
      label: "AI Risk Analysis",
      desc: "Gemini-powered hazard and exposure scoring",
    },
    {
      icon: ShieldCheck,
      label: "Smart Underwriting",
      desc: "Data-driven decisions for property risk",
    },
    {
      icon: Clock,
      label: "Historical Trends",
      desc: "5-day climate history and risk timeline",
    },
  ];

  /* ================================================================ */
  /*  Render                                                           */
  /* ================================================================ */
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* ── Header ── */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="text-lg font-bold text-blue-900 tracking-tight">
            InsurX
          </span>
          <Link href="/payment">
            <Button className="bg-blue-900 text-white hover:bg-blue-800 h-9 px-5 text-[13px] hidden sm:flex gap-2">
              View Plans
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>
      </header>

      {/* ── Hero strip ── */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white">
        <div className="max-w-6xl mx-auto px-6 py-8 md:py-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[12px] font-medium mb-3">
                <Clock className="w-3 h-3" />
                3-Day Free Trial
              </div>
              <h1 className="text-2xl md:text-3xl font-bold leading-tight">
                Start Monitoring Climate Risks
              </h1>
              <p className="text-blue-200 mt-2 text-[14px] max-w-lg">
                Set your coverage area to receive real-time weather data, AI
                risk analysis, and smart underwriting insights.
              </p>
            </div>
            <div className="text-right hidden md:block">
              <p className="text-blue-300 text-[12px]">Starting from</p>
              <p className="text-2xl font-bold">$300<span className="text-[14px] font-normal text-blue-300">/month</span></p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main content ── */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-8 md:py-12">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left: Map */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col min-h-[420px]">
            {!mapLoaded ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-4 bg-blue-50/30">
                <div className="relative">
                  <div className="w-14 h-14 rounded-full border-2 border-blue-200 border-t-blue-600 animate-spin" />
                </div>
                <div className="text-center">
                  <p className="text-[14px] font-medium text-gray-900">
                    Loading Weather Map
                  </p>
                  <p className="text-[12px] text-gray-400 mt-1">
                    Fetching satellite imagery&hellip;
                  </p>
                </div>
              </div>
            ) : (
              <img
                src="/ghana-weather-map.png"
                alt="Ghana Weather Map"
                className="w-full h-full object-cover animate-in fade-in duration-700"
              />
            )}
          </div>

          {/* Right: Form + features */}
          <div className="space-y-6">
            {/* Form card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-7">
              <h2 className="text-[16px] font-bold text-gray-900 mb-1">
                Configure Your Monitoring Area
              </h2>
              <p className="text-[13px] text-gray-500 mb-6 leading-relaxed">
                Set the start and end locations for climate monitoring. You can
                update these later from your dashboard.
              </p>

              {error && (
                <div className="mb-5 flex items-start gap-2.5 p-3 rounded-xl bg-red-50 border border-red-100">
                  <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[13px] text-red-700 font-medium">
                      Setup failed
                    </p>
                    <p className="text-[12px] text-red-500 mt-0.5">{error}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Start Area */}
                <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-1.5 border border-gray-100 focus-within:border-blue-200 focus-within:bg-blue-50/30 transition-colors">
                  <MapPin className="w-4 h-4 text-gray-400 ml-3 flex-shrink-0" />
                  <Label htmlFor="startArea" className="sr-only">
                    Start Area
                  </Label>
                  <Input
                    id="startArea"
                    placeholder="Start Area (e.g. Accra)"
                    className="border-0 bg-transparent shadow-none text-[14px] h-11 focus-visible:ring-0"
                    value={startArea}
                    onChange={(e) => setStartArea(e.target.value)}
                    required
                  />
                </div>

                {/* End Area */}
                <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-1.5 border border-gray-100 focus-within:border-blue-200 focus-within:bg-blue-50/30 transition-colors">
                  <MapPin className="w-4 h-4 text-gray-400 ml-3 flex-shrink-0" />
                  <Label htmlFor="endArea" className="sr-only">
                    End Area
                  </Label>
                  <Input
                    id="endArea"
                    placeholder="End Area (e.g. Kumasi)"
                    className="border-0 bg-transparent shadow-none text-[14px] h-11 focus-visible:ring-0"
                    value={endArea}
                    onChange={(e) => setEndArea(e.target.value)}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-blue-900 hover:bg-blue-800 text-white text-[14px] font-medium h-12 rounded-xl gap-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Setting up&hellip;
                    </>
                  ) : (
                    <>
                      Start Analysis
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </form>
            </div>

            {/* Feature highlights */}
            <div className="grid grid-cols-2 gap-3">
              {features.map((f) => (
                <div
                  key={f.label}
                  className="bg-white rounded-xl border border-gray-100 p-4 flex items-start gap-3"
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <f.icon className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-[12px] font-semibold text-gray-900">
                      {f.label}
                    </p>
                    <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">
                      {f.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Trial note */}
            <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl border border-blue-100">
              <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-[12px] font-medium text-blue-900">
                  Free for 3 days
                </p>
                <p className="text-[11px] text-blue-700 mt-0.5 leading-relaxed">
                  Your trial includes full access to climate monitoring, AI risk
                  analysis, and property assessments for locations in Ghana.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
