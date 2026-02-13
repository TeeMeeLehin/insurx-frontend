"use client";

import {
  CloudRain,
  Sun,
  Cloud,
  Wind,
  Droplets,
  Thermometer,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface SeasonalClimatePanelProps {
  /** Location label for display (e.g. "Accra — Kumasi" or single location) */
  locationLabel?: string;
  /** Optional: when set, simulates for that location; otherwise uses monitoring area */
}

interface SeasonData {
  id: string;
  label: string;
  description: string;
  icon: typeof CloudRain;
  floodRisk: "High" | "Medium" | "Low";
  droughtRisk: "High" | "Medium" | "Low";
  trend: "Increasing" | "Stable" | "Decreasing";
  months: string;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function getCurrentSeason(): SeasonData["id"] {
  const month = new Date().getMonth();
  if (month >= 0 && month <= 1) return "harmattan";
  if (month >= 2 && month <= 4) return "dry";
  if (month >= 5 && month <= 7) return "rainy";
  if (month >= 8 && month <= 9) return "cloudy";
  return "rainy"; // Oct–Nov
}

function riskColor(risk: string) {
  switch (risk) {
    case "High":
      return "text-red-600 bg-red-50 border-red-100";
    case "Medium":
      return "text-yellow-700 bg-yellow-50 border-yellow-100";
    default:
      return "text-green-700 bg-green-50 border-green-100";
  }
}

function TrendIcon({ trend }: { trend: string }) {
  if (trend === "Increasing")
    return <TrendingUp className="w-3.5 h-3.5 text-orange-500" />;
  if (trend === "Decreasing")
    return <TrendingDown className="w-3.5 h-3.5 text-blue-500" />;
  return <Minus className="w-3.5 h-3.5 text-gray-500" />;
}

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const SEASONS: SeasonData[] = [
  {
    id: "harmattan",
    label: "Harmattan",
    description: "Dry, dusty NE winds. Low humidity, cooler nights.",
    icon: Wind,
    floodRisk: "Low",
    droughtRisk: "High",
    trend: "Stable",
    months: "Nov – Feb",
  },
  {
    id: "rainy",
    label: "Rainy Season",
    description: "Heavy rainfall, high humidity. Peak flood vulnerability.",
    icon: CloudRain,
    floodRisk: "High",
    droughtRisk: "Low",
    trend: "Increasing",
    months: "Apr – Jul, Sep – Nov",
  },
  {
    id: "cloudy",
    label: "Cloudy Period",
    description: "Transitional. Intermittent showers, moderate humidity.",
    icon: Cloud,
    floodRisk: "Medium",
    droughtRisk: "Low",
    trend: "Stable",
    months: "Aug, transitional",
  },
  {
    id: "dry",
    label: "Dry Season",
    description: "Hot, low precipitation. Higher drought stress.",
    icon: Sun,
    floodRisk: "Low",
    droughtRisk: "Medium",
    trend: "Decreasing",
    months: "Mar – Apr",
  },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function SeasonalClimatePanel({
  locationLabel,
}: SeasonalClimatePanelProps) {
  const currentSeasonId = getCurrentSeason();
  const currentSeason = SEASONS.find((s) => s.id === currentSeasonId) ?? SEASONS[0];
  const displayLocation = locationLabel || "Selected location";

  return (
    <div className="p-5 space-y-5">
      {/* Header */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-1 flex items-center gap-2">
          <Thermometer className="w-4 h-4 text-blue-600" />
          Seasonal Climate Simulation
        </h3>
        <p className="text-[11px] text-gray-500">
          Dynamic seasonal context for {displayLocation}
        </p>
      </div>

      {/* Current season highlight */}
      <div className="p-4 rounded-xl border border-blue-100 bg-blue-50/50 space-y-3">
        <div className="flex items-center gap-2">
          <currentSeason.icon className="w-5 h-5 text-blue-700" />
          <span className="text-[13px] font-semibold text-gray-900">
            Current: {currentSeason.label}
          </span>
        </div>
        <p className="text-[12px] text-gray-600">{currentSeason.description}</p>
        <div className="grid grid-cols-2 gap-2 text-[11px]">
          <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-white/80 border border-blue-100">
            <span className="text-gray-500">Flood Risk</span>
            <span
              className={`font-medium px-1.5 py-0.5 rounded border ${riskColor(
                currentSeason.floodRisk
              )}`}
            >
              {currentSeason.floodRisk}
            </span>
          </div>
          <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-white/80 border border-blue-100">
            <span className="text-gray-500">Drought Risk</span>
            <span
              className={`font-medium px-1.5 py-0.5 rounded border ${riskColor(
                currentSeason.droughtRisk
              )}`}
            >
              {currentSeason.droughtRisk}
            </span>
          </div>
          <div className="col-span-2 flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-white/80 border border-blue-100">
            <span className="text-gray-500">Trend</span>
            <span className="flex items-center gap-1 font-medium text-gray-700">
              <TrendIcon trend={currentSeason.trend} />
              {currentSeason.trend}
            </span>
          </div>
        </div>
      </div>

      {/* All seasons overview */}
      <div>
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2">
          Seasonal Variations
        </p>
        <div className="space-y-2">
          {SEASONS.map((season) => {
            const Icon = season.icon;
            const isActive = season.id === currentSeasonId;
            return (
              <div
                key={season.id}
                className={`p-3 rounded-lg border transition-colors ${
                  isActive
                    ? "border-blue-200 bg-blue-50/30"
                    : "border-gray-100 bg-gray-50/50"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? "text-blue-600" : "text-gray-500"
                    }`}
                  />
                  <span
                    className={`text-[12px] font-medium ${
                      isActive ? "text-gray-900" : "text-gray-700"
                    }`}
                  >
                    {season.label}
                  </span>
                  {isActive && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 font-medium">
                      Now
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-gray-500 mb-2">{season.description}</p>
                <div className="flex flex-wrap gap-1.5 text-[10px]">
                  <span
                    className={`px-1.5 py-0.5 rounded border ${riskColor(
                      season.floodRisk
                    )}`}
                  >
                    Flood: {season.floodRisk}
                  </span>
                  <span
                    className={`px-1.5 py-0.5 rounded border ${riskColor(
                      season.droughtRisk
                    )}`}
                  >
                    Drought: {season.droughtRisk}
                  </span>
                  <span className="flex items-center gap-0.5 text-gray-500">
                    <TrendIcon trend={season.trend} /> {season.trend}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
