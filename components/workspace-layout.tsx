"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  FileSearch,
  ChevronLeft,
  ChevronRight,
  PanelRightClose,
  PanelRightOpen,
  LogOut,
  Plus,
  Clock,
  Menu,
  X,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface HistoryItem {
  id: string;
  label: string;
  date: string;
  active?: boolean;
  onClick?: () => void;
}

export interface WorkspaceLayoutProps {
  children: React.ReactNode;
  /** Content shown in the right-hand context / instructions panel */
  contextPanel?: React.ReactNode;
  /** Assessment-history entries shown in the sidebar */
  historyItems?: HistoryItem[];
  /** Fired when the user clicks "New Assessment" in the sidebar */
  onNewAssessment?: () => void;
}

/* ------------------------------------------------------------------ */
/*  Navigation items (shared between desktop & mobile)                 */
/* ------------------------------------------------------------------ */

const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Risk Assessment", href: "/risk-assessment", icon: FileSearch },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function WorkspaceLayout({
  children,
  contextPanel,
  historyItems = [],
  onNewAssessment,
}: WorkspaceLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [contextOpen, setContextOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("insurx_token");
    localStorage.removeItem("insurx_session");
    router.push("/");
  };

  /* ----- helpers for sidebar nav ----- */
  const isActive = (href: string) =>
    pathname === href || (pathname?.startsWith(href + "/") ?? false);

  /* ---------------------------------------------------------------- */
  /*  Sidebar content (shared between desktop & mobile drawer)         */
  /* ---------------------------------------------------------------- */
  const sidebarContent = (collapsed: boolean, onNavigate?: () => void) => (
    <>
      {/* New Assessment */}
      <div className={`pt-4 ${collapsed ? "px-2" : "px-3"}`}>
        <Button
          className={`${
            collapsed ? "w-full px-0 justify-center" : "w-full"
          } bg-blue-900 hover:bg-blue-800 text-white gap-2 h-9 text-[13px]`}
          onClick={() => {
            onNewAssessment?.();
            onNavigate?.();
          }}
        >
          <Plus className="w-4 h-4 flex-shrink-0" />
          {!collapsed && "New Assessment"}
        </Button>
      </div>

      {/* Navigation */}
      <nav className={`pt-5 ${collapsed ? "px-2" : "px-3"}`}>
        {!collapsed && (
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2 px-2">
            Navigation
          </p>
        )}
        <div className="space-y-0.5">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.href}
              onClick={() => {
                router.push(item.href);
                onNavigate?.();
              }}
              className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] transition-colors ${
                isActive(item.href)
                  ? "bg-blue-50 text-blue-900 font-medium"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              } ${collapsed ? "justify-center" : ""}`}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              {!collapsed && item.label}
            </button>
          ))}
        </div>
      </nav>

      {/* History */}
      {!collapsed && (
        <div className="pt-5 px-3 flex-1 overflow-y-auto scrollbar-thin min-h-0">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2 px-2 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            History
          </p>
          <div className="space-y-0.5">
            {historyItems.length > 0 ? (
              historyItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    item.onClick?.();
                    onNavigate?.();
                  }}
                  className={`w-full text-left px-2.5 py-2 rounded-lg text-[13px] transition-colors ${
                    item.active
                      ? "bg-blue-50 text-blue-900"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <span className="block font-medium truncate">
                    {item.label}
                  </span>
                  <span className="text-[11px] text-gray-400">{item.date}</span>
                </button>
              ))
            ) : (
              <p className="text-[12px] text-gray-400 px-2.5 py-2">
                No assessments yet
              </p>
            )}
          </div>
        </div>
      )}

      {/* Logout */}
      <div
        className={`border-t border-gray-100 mt-auto ${
          collapsed ? "p-2" : "p-3"
        }`}
      >
        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <LogOut className="w-4 h-4" />
          {!collapsed && "Log Out"}
        </button>
      </div>
    </>
  );

  /* ---------------------------------------------------------------- */
  /*  Render                                                           */
  /* ---------------------------------------------------------------- */
  return (
    <div className="h-screen flex bg-gray-50 font-sans overflow-hidden">
      {/* ── Desktop Sidebar ── */}
      <aside
        className={`${
          sidebarCollapsed ? "w-16" : "w-72"
        } bg-white border-r border-gray-200 hidden md:flex flex-col transition-all duration-200 flex-shrink-0`}
      >
        {/* Header / collapse toggle */}
        <div
          className={`h-14 border-b border-gray-100 flex items-center flex-shrink-0 ${
            sidebarCollapsed
              ? "justify-center px-2"
              : "justify-between px-5"
          }`}
        >
          {!sidebarCollapsed && (
            <span className="text-lg font-bold text-blue-900 tracking-tight">
              InsurX
            </span>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-1.5 rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          >
            {sidebarCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>

        {sidebarContent(sidebarCollapsed)}
      </aside>

      {/* ── Mobile Header ── */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50 px-4 h-14 flex items-center justify-between">
        <span className="text-lg font-bold text-blue-900">InsurX</span>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-md hover:bg-gray-100"
        >
          {mobileMenuOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* ── Mobile Drawer ── */}
      {mobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/20"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="absolute top-14 left-0 w-72 bg-white border-r border-gray-200 h-[calc(100vh-3.5rem)] flex flex-col animate-in slide-in-from-left duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {sidebarContent(false, () => setMobileMenuOpen(false))}
          </div>
        </div>
      )}

      {/* ── Main Content ── */}
      <main className="flex-1 flex flex-col overflow-hidden pt-14 md:pt-0">
        {children}
      </main>

      {/* ── Right Context Panel (desktop only) ── */}
      {contextPanel && (
        <>
          <button
            onClick={() => setContextOpen(!contextOpen)}
            className="hidden lg:flex items-center justify-center w-6 border-l border-gray-200 bg-white hover:bg-gray-50 text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
            title={contextOpen ? "Hide panel" : "Show panel"}
          >
            {contextOpen ? (
              <PanelRightClose className="w-3.5 h-3.5" />
            ) : (
              <PanelRightOpen className="w-3.5 h-3.5" />
            )}
          </button>
          {contextOpen && (
            <aside className="w-80 bg-white border-l border-gray-200 hidden lg:flex flex-col overflow-y-auto scrollbar-thin flex-shrink-0">
              {contextPanel}
            </aside>
          )}
        </>
      )}
    </div>
  );
}
