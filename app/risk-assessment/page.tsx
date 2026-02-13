"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { WorkspaceLayout } from "@/components/workspace-layout";
import { UploadSection } from "@/components/upload-section";
import { NotificationBanner } from "@/components/notification-banner";
import {
  MapPin,
  DollarSign,
  Loader2,
  AlertTriangle,
  ShieldCheck,
  TrendingUp,
  Zap,
  BookOpen,
  Info,
  Send,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function scoreColor(score: number) {
  if (score <= 30)
    return {
      text: "text-green-600",
      bg: "bg-green-400",
      badge: "bg-green-50 text-green-700 border border-green-100",
    };
  if (score <= 60)
    return {
      text: "text-yellow-600",
      bg: "bg-yellow-400",
      badge: "bg-yellow-50 text-yellow-700 border border-yellow-100",
    };
  return {
    text: "text-red-600",
    bg: "bg-red-400",
    badge: "bg-red-50 text-red-700 border border-red-100",
  };
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function RiskAssessmentPage() {
  const router = useRouter();

  /* ---- existing state (untouched) ---- */
  const [location, setLocation] = useState("");
  const [propertyValue, setPropertyValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  /* ---- new UI ref ---- */
  const resultRef = useRef<HTMLDivElement>(null);

  /* ---- existing effect (untouched) ---- */
  useEffect(() => {
    const token = localStorage.getItem("insurx_token");
    if (!token) {
      router.push("/login?redirect=/risk-assessment");
    }
  }, [router]);

  /* ---- existing handler (untouched) ---- */
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
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          location,
          propertyValue: Number(propertyValue),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Assessment failed");
      }

      setResult(data.assessment);
      setTimeout(
        () => resultRef.current?.scrollIntoView({ behavior: "smooth" }),
        150
      );
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ---- sidebar history ---- */
  const historyItems = [
    { id: "1024", label: "Risk Check #1024", date: "Oct 24, 2026" },
    { id: "1023", label: "Risk Check #1023", date: "Oct 20, 2026" },
  ];

  /* ================================================================ */
  /*  Context Panel                                                    */
  /* ================================================================ */
  const contextPanel = (
    <div className="p-5 space-y-6">
      {/* Guide */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-blue-600" />
          Assessment Guide
        </h3>
        <div className="space-y-2">
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-[12px] font-medium text-gray-700">Location</p>
            <p className="text-[11px] text-gray-500 mt-0.5">
              Enter the full property address including street, area and city for
              accurate analysis.
            </p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-[12px] font-medium text-gray-700">
              Property Value
            </p>
            <p className="text-[11px] text-gray-500 mt-0.5">
              Enter the estimated market value in GHS. This affects exposure and
              financial risk calculations.
            </p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-[12px] font-medium text-gray-700">
              Score Ranges
            </p>
            <div className="mt-2 space-y-1.5">
              <div className="flex items-center gap-2 text-[11px]">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-gray-600">0&ndash;30: Low Risk</span>
              </div>
              <div className="flex items-center gap-2 text-[11px]">
                <div className="w-2 h-2 rounded-full bg-yellow-500" />
                <span className="text-gray-600">31&ndash;60: Moderate Risk</span>
              </div>
              <div className="flex items-center gap-2 text-[11px]">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <span className="text-gray-600">61&ndash;100: High Risk</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bulk Upload */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Info className="w-4 h-4 text-blue-600" />
          Bulk Assessment
        </h3>
        <UploadSection />
      </div>
    </div>
  );

  /* ================================================================ */
  /*  Render                                                           */
  /* ================================================================ */
  return (
    <WorkspaceLayout
      historyItems={historyItems}
      onNewAssessment={() => {
        setResult(null);
        setError(null);
        setLocation("");
        setPropertyValue("");
      }}
      contextPanel={contextPanel}
    >
      {/* ── Top bar ── */}
      <div className="h-14 border-b border-gray-200 bg-white px-6 flex items-center justify-between flex-shrink-0">
        <h1 className="text-[15px] font-semibold text-gray-900">
          Risk Assessment
        </h1>
        <span className="text-[11px] text-gray-400">
          AI-powered property risk analysis
        </span>
      </div>

      {/* ── Scrollable workspace ── */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        <div className="max-w-3xl mx-auto px-6 py-8 space-y-6">
          {/* ── Input form ── */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-50">
              <h2 className="text-[14px] font-semibold text-gray-900">
                New Assessment
              </h2>
              <p className="text-[12px] text-gray-400 mt-0.5">
                Enter property details for AI-driven risk evaluation
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-3">
                {/* Location */}
                <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-1.5 border border-gray-100 focus-within:border-blue-200 focus-within:bg-blue-50/30 transition-colors">
                  <MapPin className="w-4 h-4 text-gray-400 ml-3 flex-shrink-0" />
                  <Label htmlFor="location" className="sr-only">
                    Location
                  </Label>
                  <Input
                    id="location"
                    placeholder="Enter Property Location (e.g. 10, Abafun Crescent, Labone, Accra)"
                    className="border-0 bg-transparent shadow-none text-[14px] h-11 focus-visible:ring-0"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                  />
                </div>

                {/* Value */}
                <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-1.5 border border-gray-100 focus-within:border-blue-200 focus-within:bg-blue-50/30 transition-colors">
                  <DollarSign className="w-4 h-4 text-gray-400 ml-3 flex-shrink-0" />
                  <Label htmlFor="value" className="sr-only">
                    Property Value
                  </Label>
                  <Input
                    id="value"
                    type="number"
                    placeholder="Property Value (GHS)"
                    className="border-0 bg-transparent shadow-none text-[14px] h-11 focus-visible:ring-0"
                    value={propertyValue}
                    onChange={(e) => setPropertyValue(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Error */}
              {error && (
                <NotificationBanner
                  type="error"
                  title="Assessment Failed"
                  message={`${error}. Please check your input and try again.`}
                  action="Dismiss"
                  onAction={() => setError(null)}
                  onDismiss={() => setError(null)}
                />
              )}

              {/* Submit */}
              <Button
                type="submit"
                className="w-full bg-blue-900 hover:bg-blue-800 text-white h-11 rounded-xl text-[14px] font-medium gap-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Analyzing Risks&hellip;
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Run Assessment
                  </>
                )}
              </Button>
            </form>
          </div>

          {/* ── Results ── */}
          {result && (
            <div
              ref={resultRef}
              className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500"
            >
              {/* Success banner */}
              <NotificationBanner
                type="success"
                title="Assessment Complete"
                message="Risk profile generated successfully. Review the scores and AI analysis below."
                autoDismiss={8000}
                onDismiss={() => {}}
              />

              {/* Score cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Risk Score */}
                <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">
                      Risk Score
                    </span>
                    <ShieldCheck
                      className={`w-4 h-4 ${
                        scoreColor(result.riskScore).text
                      }`}
                    />
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span
                      className={`text-3xl font-bold ${
                        scoreColor(result.riskScore).text
                      }`}
                    >
                      {result.riskScore.toFixed(1)}
                    </span>
                    <span className="text-sm text-gray-400">/100</span>
                  </div>
                  <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${
                        scoreColor(result.riskScore).bg
                      }`}
                      style={{
                        width: `${Math.min(result.riskScore, 100)}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Hazard Score */}
                <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">
                      Hazard Score
                    </span>
                    <AlertTriangle
                      className={`w-4 h-4 ${
                        scoreColor(
                          typeof result.hazardScore === "number"
                            ? result.hazardScore
                            : 0
                        ).text
                      }`}
                    />
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span
                      className={`text-3xl font-bold ${
                        scoreColor(
                          typeof result.hazardScore === "number"
                            ? result.hazardScore
                            : 0
                        ).text
                      }`}
                    >
                      {typeof result.hazardScore === "number"
                        ? result.hazardScore.toFixed(1)
                        : result.hazardScore}
                    </span>
                    <span className="text-sm text-gray-400">/100</span>
                  </div>
                  <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${
                        scoreColor(
                          typeof result.hazardScore === "number"
                            ? result.hazardScore
                            : 0
                        ).bg
                      }`}
                      style={{
                        width: `${Math.min(
                          typeof result.hazardScore === "number"
                            ? result.hazardScore
                            : 0,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Exposure Score */}
                {(() => {
                  const exposureVal =
                    (result.riskScore - (result.hazardScore ?? 0) * 0.7) / 0.3;
                  const clamped = Math.max(0, Math.min(100, exposureVal));
                  return (
                    <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">
                          Exposure Score
                        </span>
                        <TrendingUp className="w-4 h-4 text-orange-500" />
                      </div>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-3xl font-bold text-orange-600">
                          {clamped.toFixed(1)}
                        </span>
                        <span className="text-sm text-gray-400">/100</span>
                      </div>
                      <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-orange-400 rounded-full transition-all duration-1000"
                          style={{ width: `${clamped}%` }}
                        />
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* AI Analysis (chat-style) */}
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-5 py-3 border-b border-gray-50 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-blue-600" />
                  <h3 className="text-[13px] font-semibold text-gray-900">
                    AI Analysis
                  </h3>
                </div>
                <div className="p-5">
                  <div className="flex gap-3">
                    <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <Zap className="w-3.5 h-3.5 text-blue-700" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] text-gray-400 mb-1">
                        InsurX AI
                      </p>
                      <div className="bg-blue-50/60 rounded-xl rounded-tl-sm p-4 border border-blue-100/50">
                        <p className="text-[13px] text-gray-700 leading-relaxed whitespace-pre-wrap">
                          {result.aiAnalysis}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </WorkspaceLayout>
  );
}
