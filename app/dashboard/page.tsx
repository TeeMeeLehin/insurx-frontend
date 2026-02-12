"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

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

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<MonitoringData | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("insurx_token");
    if (!token) {
      router.push("/login");
      return;
    }

    // Fetch Status from new endpoint
    fetch("http://localhost:4000/api/monitoring/dashboard", {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
      .then(async (res) => {
        if (res.status === 404) {
          // Not configured yet -> Redirect to setup
          router.push("/dashboard/setup");
          return null;
        }
        if (!res.ok) throw new Error("Failed to fetch dashboard data");
        return res.json();
      })
      .then((data) => {
        if (data) {
          setData(data); // Matches new structure
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error(err);
        // If error, maybe stay here or show error? 
        // For now, let's assume if it fails auth, we redirect to login
        // but we handled that with res.ok logic potentially
        setLoading(false);
      });
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
      </div>
    );
  }

  if (!data) return null; // Should have redirected

  const handleStartAssessment = () => {
    // Check subscription status from the fetched data
    // @ts-ignore - The backend now includes user.subscriptionStatus via the include relation
    const status = data.monitoringArea?.user?.subscriptionStatus;

    // Default is 'inactive' for new users. 
    if (status !== 'active') {
      router.push("/payment");
    } else {
      router.push("/risk-assessment");
    }
  };

  const MOCK_AI_ANALYSIS = "AI Analysis (Demo Mode): The region shows a moderate stability index with a 15% increase in precipitation likelihood over the next quarter. While immediate flood risks remain low, the soil saturation levels suggest caution for agricultural investments. Structure damage probability is negligible under current wind patterns.";

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">
      {/* Simple Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-blue-900">InsurX</h2>
        </div>
        <div className="p-4 flex-1 overflow-y-auto">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Assessment History</h3>
          <div className="space-y-2">
            {/* Mock History Items */}
            <div className="p-3 bg-gray-50 rounded-md text-sm text-gray-700 hover:bg-blue-50 cursor-pointer">
              <span className="block font-medium">Risk Check #1024</span>
              <span className="text-xs text-gray-500">Oct 24, 2026</span>
            </div>
            <div className="p-3 bg-white border border-gray-100 rounded-md text-sm text-gray-700 hover:bg-blue-50 cursor-pointer">
              <span className="block font-medium">Risk Check #1023</span>
              <span className="text-xs text-gray-500">Oct 20, 2026</span>
            </div>
          </div>
        </div>
        <div className="p-4 border-t border-gray-100">
          <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => {
            localStorage.removeItem("insurx_token");
            router.push("/");
          }}>
            Log Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        <header className="bg-white border-b border-gray-100 px-8 py-4 flex justify-between items-center sticky top-0 z-10">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Monitoring: <span className="font-semibold text-blue-900">{data.monitoringArea.startArea} - {data.monitoringArea.endArea}</span></span>
          </div>
        </header>

        <div className="p-8 space-y-8">
          {/* Climate Status Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Live Climate Status</h2>
                <p className="text-gray-500 text-sm">Real-time data from OpenWeatherMap.</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold uppercase tracking-wide">
                {data.climateData.status}
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="p-4 bg-gray-50 rounded-xl">
                <span className="block text-sm text-gray-500 mb-1">Temperature</span>
                <span className="text-3xl font-bold text-gray-900">{data.climateData.temperature}</span>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <span className="block text-sm text-gray-500 mb-1">Humidity</span>
                <span className="text-3xl font-bold text-gray-900">{data.climateData.humidity}</span>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <span className="block text-sm text-gray-500 mb-1">Precipitation</span>
                <span className="text-3xl font-bold text-gray-900">{data.climateData.precipitation || '0mm'}</span>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <span className="block text-sm text-gray-500 mb-1">Wind Speed</span>
                <span className="text-3xl font-bold text-gray-900">{data.climateData.windSpeed || '0 km/h'}</span>
              </div>
            </div>

            <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-100">
              <h3 className="text-blue-900 font-bold mb-2 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                AI Risk Analysis
              </h3>
              <p className="text-blue-800 leading-relaxed">
                {(data.climateData.aiAnalysis && !data.climateData.aiAnalysis.includes("Pending"))
                  ? data.climateData.aiAnalysis
                  : MOCK_AI_ANALYSIS}
              </p>
            </div>
          </div>

          {/* Historical Context Section */}
          {data.historicalData && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <div className="mb-6">
                <h2 className="text-lg font-bold text-gray-900">Historical Context</h2>
                <p className="text-gray-500 text-sm">Past 5 days climate trend for {data.monitoringArea.startArea}.</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-gray-500 uppercase bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 rounded-l-lg">Date</th>
                      <th className="px-6 py-3">Avg Temp</th>
                      <th className="px-6 py-3 rounded-r-lg">Risk Level</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.historicalData.map((day, idx) => (
                      <tr key={idx} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-medium text-gray-900">{day.date}</td>
                        <td className="px-6 py-4 text-gray-600">{day.temp}°C</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${day.risk === 'Low' ? 'bg-green-100 text-green-700' : day.risk === 'Moderate' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                            {day.risk}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <Button
              size="lg"
              className="bg-blue-900 text-white hover:bg-blue-800 shadow-lg shadow-blue-900/10"
              onClick={handleStartAssessment}
            >
              Start New Assessment
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
