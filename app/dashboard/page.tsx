"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { WorkspaceLayout } from "@/components/workspace-layout";
import { UploadSection } from "@/components/upload-section";
import { NotificationBanner } from "@/components/notification-banner";
import {
  Thermometer,
  Droplets,
  CloudRain,
  Wind,
  Zap,
  Send,
  Loader2,
  MapPin,
  ShieldCheck,
  AlertTriangle,
  TrendingUp,
  BookOpen,
  FileSpreadsheet,
  Info,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types  (unchanged from original)                                   */
/* ------------------------------------------------------------------ */

interface MonitoringData {
  monitoringArea: {
    startArea: string;
    endArea: string;
    user: {
      subscriptionStatus: string;
    };
  };
  climateData: {
    temperature: string;
    humidity: string;
    precipitation: string;
    windSpeed: string;
    status: string;
    aiAnalysis: string;
  };
  historicalData?: {
    date: string;
    temp: number;
    risk: string;
  }[];
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function DashboardPage() {
  const router = useRouter();

  /* ---- existing state (untouched) ---- */
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<MonitoringData | null>(null);

  /* ---- new UI-only state ---- */
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<
    { role: "user" | "assistant"; content: string }[]
  >([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error" | "info" | "warning";
    title: string;
    message: string;
  } | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  /* ---- existing effect (untouched) ---- */
  useEffect(() => {
    const token = localStorage.getItem("insurx_token");
    if (!token) {
      router.push("/login");
      return;
    }

    fetch("http://localhost:4000/api/monitoring/dashboard", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (res.status === 404) {
          router.push("/dashboard/setup");
          return null;
        }
        if (!res.ok) throw new Error("Failed to fetch dashboard data");
        return res.json();
      })
      .then((data) => {
        if (data) {
          setData(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [router]);

  /* auto-scroll chat */
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  /* ---- existing loading / null guard (untouched) ---- */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-blue-900 border-t-transparent" />
          <p className="text-sm text-gray-500">Loading workspace&hellip;</p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  /* ---- existing handler (untouched) ---- */
  const handleStartAssessment = () => {
    // @ts-ignore
    const status = data.monitoringArea?.user?.subscriptionStatus;
    if (status !== "active") {
      router.push("/payment");
    } else {
      router.push("/risk-assessment");
    }
  };

  /* ---- chat handler (new UI, uses existing /api/chat route) ---- */
  const handleChatSubmit = async () => {
    if (!chatInput.trim() || chatLoading) return;
    const userMsg = chatInput.trim();
    setChatInput("");
    setChatMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setChatLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMsg,
          history: chatMessages.slice(-10),
        }),
      });
      const json = await res.json();
      if (json.text) {
        setChatMessages((prev) => [
          ...prev,
          { role: "assistant", content: json.text },
        ]);
      } else {
        throw new Error("empty");
      }
    } catch {
      setChatMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Sorry, I couldn\u2019t process your request right now. Please try again.",
        },
      ]);
      setNotification({
        type: "error",
        title: "Chat Error",
        message:
          "Failed to get a response. Check your connection and try again.",
      });
    } finally {
      setChatLoading(false);
    }
  };

  /* ---- existing constant (untouched) ---- */
  const MOCK_AI_ANALYSIS =
    "AI Analysis (Demo Mode): The region shows a moderate stability index with a 15% increase in precipitation likelihood over the next quarter. While immediate flood risks remain low, the soil saturation levels suggest caution for agricultural investments. Structure damage probability is negligible under current wind patterns.";

  /* ---- sidebar history items ---- */
  const historyItems = [
    { id: "1024", label: "Risk Check #1024", date: "Oct 24, 2026", active: true },
    { id: "1023", label: "Risk Check #1023", date: "Oct 20, 2026" },
    { id: "1022", label: "Risk Check #1022", date: "Oct 15, 2026" },
    { id: "1021", label: "Risk Check #1021", date: "Oct 10, 2026" },
  ];

  /* ================================================================ */
  /*  Context Panel (right side)                                       */
  /* ================================================================ */
  const contextPanel = (
    <div className="p-5 space-y-6">
      {/* Quick Guide */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-blue-600" />
          Quick Guide
        </h3>
        <div className="space-y-2">
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-[12px] font-medium text-gray-700">
              Getting Started
            </p>
            <p className="text-[11px] text-gray-500 mt-0.5">
              Click &ldquo;New Assessment&rdquo; to analyse risk for a specific
              property location.
            </p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-[12px] font-medium text-gray-700">
              Understanding Scores
            </p>
            <p className="text-[11px] text-gray-500 mt-0.5">
              Risk scores range 0&ndash;100. Green (0-30) low, Yellow (31-60)
              moderate, Red (61-100) high.
            </p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-[12px] font-medium text-gray-700">
              AI Assistant
            </p>
            <p className="text-[11px] text-gray-500 mt-0.5">
              Use the chat below the analysis to ask about climate risk,
              underwriting, or assessment results.
            </p>
          </div>
        </div>
      </div>

      {/* Upload */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <FileSpreadsheet className="w-4 h-4 text-blue-600" />
          Bulk Upload
        </h3>
        <UploadSection compact />
        <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
          <p className="text-[11px] text-blue-700 flex items-start gap-1.5 leading-relaxed">
            <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
            Upload an Excel file with columns: Location, Property&nbsp;Value.
            Each row generates a separate risk assessment.
          </p>
        </div>
      </div>

      {/* Monitoring Info */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-blue-600" />
          Monitoring Area
        </h3>
        <div className="p-3 bg-gray-50 rounded-lg space-y-2">
          <div className="flex items-center justify-between text-[12px]">
            <span className="text-gray-500">From</span>
            <span className="font-medium text-gray-900">
              {data.monitoringArea.startArea}
            </span>
          </div>
          <div className="flex items-center justify-between text-[12px]">
            <span className="text-gray-500">To</span>
            <span className="font-medium text-gray-900">
              {data.monitoringArea.endArea}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  /* ================================================================ */
  /*  Render                                                           */
  /* ================================================================ */
  return (
    <WorkspaceLayout
      historyItems={historyItems}
      onNewAssessment={handleStartAssessment}
      contextPanel={contextPanel}
    >
      {/* ── Top bar ── */}
      <div className="h-14 border-b border-gray-200 bg-white px-6 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <h1 className="text-[15px] font-semibold text-gray-900">Dashboard</h1>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-green-50 text-green-700 font-medium border border-green-100">
            {data.climateData.status}
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-[12px] text-gray-500">
          <MapPin className="w-3.5 h-3.5" />
          {data.monitoringArea.startArea} &mdash; {data.monitoringArea.endArea}
        </div>
      </div>

      {/* ── Scrollable workspace ── */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        <div className="max-w-4xl mx-auto px-6 py-6 space-y-5">
          {/* Notification */}
          {notification && (
            <NotificationBanner
              type={notification.type}
              title={notification.title}
              message={notification.message}
              onDismiss={() => setNotification(null)}
              autoDismiss={5000}
            />
          )}

          {/* ── Score Cards ── */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Hazard */}
            <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">
                  Hazard Score
                </span>
                <AlertTriangle className="w-4 h-4 text-yellow-500" />
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-bold text-gray-900">42</span>
                <span className="text-sm text-gray-400">/100</span>
              </div>
              <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-400 rounded-full"
                  style={{ width: "42%" }}
                />
              </div>
            </div>

            {/* Risk */}
            <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">
                  Risk Score
                </span>
                <ShieldCheck className="w-4 h-4 text-green-500" />
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-bold text-gray-900">28</span>
                <span className="text-sm text-gray-400">/100</span>
              </div>
              <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-400 rounded-full"
                  style={{ width: "28%" }}
                />
              </div>
            </div>

            {/* Exposure */}
            <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">
                  Exposure Score
                </span>
                <TrendingUp className="w-4 h-4 text-orange-500" />
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-bold text-gray-900">35</span>
                <span className="text-sm text-gray-400">/100</span>
              </div>
              <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-orange-400 rounded-full"
                  style={{ width: "35%" }}
                />
              </div>
            </div>
          </div>

          {/* ── Climate Status ── */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
            <div className="px-5 py-3 border-b border-gray-50 flex items-center justify-between">
              <h2 className="text-[13px] font-semibold text-gray-900">
                Live Climate Status
              </h2>
              <span className="text-[11px] text-gray-400">
                Real-time &middot; OpenWeatherMap
              </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-50">
              <div className="px-5 py-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">
                  <Thermometer className="w-4 h-4 text-red-500" />
                </div>
                <div>
                  <p className="text-[11px] text-gray-400">Temperature</p>
                  <p className="text-lg font-bold text-gray-900">
                    {data.climateData.temperature}
                  </p>
                </div>
              </div>
              <div className="px-5 py-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <Droplets className="w-4 h-4 text-blue-500" />
                </div>
                <div>
                  <p className="text-[11px] text-gray-400">Humidity</p>
                  <p className="text-lg font-bold text-gray-900">
                    {data.climateData.humidity}
                  </p>
                </div>
              </div>
              <div className="px-5 py-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-cyan-50 flex items-center justify-center flex-shrink-0">
                  <CloudRain className="w-4 h-4 text-cyan-500" />
                </div>
                <div>
                  <p className="text-[11px] text-gray-400">Precipitation</p>
                  <p className="text-lg font-bold text-gray-900">
                    {data.climateData.precipitation || "0mm"}
                  </p>
                </div>
              </div>
              <div className="px-5 py-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <Wind className="w-4 h-4 text-gray-500" />
                </div>
                <div>
                  <p className="text-[11px] text-gray-400">Wind Speed</p>
                  <p className="text-lg font-bold text-gray-900">
                    {data.climateData.windSpeed || "0 km/h"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ── AI Analysis (chat-style) ── */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-50 flex items-center gap-2">
              <Zap className="w-4 h-4 text-blue-600" />
              <h2 className="text-[13px] font-semibold text-gray-900">
                AI Risk Analysis
              </h2>
            </div>

            <div className="p-5 space-y-4">
              {/* Initial analysis message */}
              <div className="flex gap-3">
                <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Zap className="w-3.5 h-3.5 text-blue-700" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] text-gray-400 mb-1">InsurX AI</p>
                  <div className="bg-blue-50/60 rounded-xl rounded-tl-sm p-4 border border-blue-100/50">
                    <p className="text-[13px] text-gray-700 leading-relaxed">
                      {data.climateData.aiAnalysis &&
                      !data.climateData.aiAnalysis.includes("Pending")
                        ? data.climateData.aiAnalysis
                        : MOCK_AI_ANALYSIS}
                    </p>
                  </div>
                </div>
              </div>

              {/* Chat messages */}
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex gap-3 ${
                    msg.role === "user" ? "flex-row-reverse" : ""
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                      msg.role === "user" ? "bg-gray-200" : "bg-blue-100"
                    }`}
                  >
                    {msg.role === "user" ? (
                      <span className="text-[11px] font-bold text-gray-600">
                        U
                      </span>
                    ) : (
                      <Zap className="w-3.5 h-3.5 text-blue-700" />
                    )}
                  </div>
                  <div
                    className={`flex-1 min-w-0 ${
                      msg.role === "user" ? "flex flex-col items-end" : ""
                    }`}
                  >
                    <p className="text-[11px] text-gray-400 mb-1">
                      {msg.role === "user" ? "You" : "InsurX AI"}
                    </p>
                    <div
                      className={`inline-block rounded-xl p-3.5 max-w-[85%] ${
                        msg.role === "user"
                          ? "bg-blue-900 text-white rounded-tr-sm"
                          : "bg-gray-50 text-gray-700 rounded-tl-sm border border-gray-100"
                      }`}
                    >
                      <p className="text-[13px] leading-relaxed whitespace-pre-wrap">
                        {msg.content}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {/* Loading indicator */}
              {chatLoading && (
                <div className="flex gap-3">
                  <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <Zap className="w-3.5 h-3.5 text-blue-700" />
                  </div>
                  <div>
                    <p className="text-[11px] text-gray-400 mb-1">InsurX AI</p>
                    <div className="inline-block bg-gray-50 rounded-xl rounded-tl-sm p-3.5 border border-gray-100">
                      <div className="flex gap-1.5">
                        <div
                          className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"
                          style={{ animationDelay: "0ms" }}
                        />
                        <div
                          className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"
                          style={{ animationDelay: "150ms" }}
                        />
                        <div
                          className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"
                          style={{ animationDelay: "300ms" }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Chat input */}
            <div className="px-5 py-3 border-t border-gray-100 bg-gray-50/50">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleChatSubmit();
                }}
                className="flex gap-2"
              >
                <Input
                  placeholder="Ask about climate risk, underwriting, or this analysis..."
                  className="flex-1 bg-white border-gray-200 text-[13px] h-10 focus-visible:ring-blue-200"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  disabled={chatLoading}
                />
                <Button
                  type="submit"
                  size="sm"
                  className="bg-blue-900 hover:bg-blue-800 text-white h-10 px-4"
                  disabled={chatLoading || !chatInput.trim()}
                >
                  {chatLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </form>
            </div>
          </div>

          {/* ── Historical Timeline ── */}
          {data.historicalData && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-5 py-3 border-b border-gray-50">
                <h2 className="text-[13px] font-semibold text-gray-900">
                  Historical Context
                </h2>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  Past 5 days climate trend for{" "}
                  {data.monitoringArea.startArea}
                </p>
              </div>
              <div className="divide-y divide-gray-50">
                {data.historicalData.map((day, idx) => (
                  <div
                    key={idx}
                    className="px-5 py-3 flex items-center justify-between hover:bg-gray-50/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
                        <span className="text-[11px] font-bold text-gray-500">
                          {String(idx + 1).padStart(2, "0")}
                        </span>
                      </div>
                      <div>
                        <p className="text-[13px] font-medium text-gray-900">
                          {day.date}
                        </p>
                        <p className="text-[11px] text-gray-400">
                          {day.temp}&deg;C average
                        </p>
                      </div>
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                        day.risk === "Low"
                          ? "bg-green-50 text-green-700 border border-green-100"
                          : day.risk === "Moderate"
                          ? "bg-yellow-50 text-yellow-700 border border-yellow-100"
                          : "bg-red-50 text-red-700 border border-red-100"
                      }`}
                    >
                      {day.risk}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bottom spacer */}
          <div className="h-2" />
        </div>
      </div>
    </WorkspaceLayout>
  );
}
