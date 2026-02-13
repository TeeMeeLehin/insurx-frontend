"use client";

import { useEffect, useState } from "react";
import { CheckCircle, AlertCircle, Info, X, ArrowRight } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type NotificationType = "success" | "error" | "info" | "warning";

interface NotificationBannerProps {
  type: NotificationType;
  /** Bold headline, e.g. "Assessment Complete" */
  title: string;
  /** Supportive text explaining what happened and what to do next */
  message: string;
  /** Optional action-link label */
  action?: string;
  onAction?: () => void;
  onDismiss?: () => void;
  /** Auto-dismiss after N milliseconds */
  autoDismiss?: number;
}

/* ------------------------------------------------------------------ */
/*  Style map                                                          */
/* ------------------------------------------------------------------ */

const STYLE: Record<
  NotificationType,
  {
    icon: typeof CheckCircle;
    bg: string;
    border: string;
    iconColor: string;
    titleColor: string;
    textColor: string;
    actionColor: string;
  }
> = {
  success: {
    icon: CheckCircle,
    bg: "bg-green-50",
    border: "border-green-100",
    iconColor: "text-green-500",
    titleColor: "text-green-800",
    textColor: "text-green-600",
    actionColor: "text-green-700 hover:text-green-800",
  },
  error: {
    icon: AlertCircle,
    bg: "bg-red-50",
    border: "border-red-100",
    iconColor: "text-red-500",
    titleColor: "text-red-800",
    textColor: "text-red-600",
    actionColor: "text-red-700 hover:text-red-800",
  },
  warning: {
    icon: AlertCircle,
    bg: "bg-yellow-50",
    border: "border-yellow-100",
    iconColor: "text-yellow-500",
    titleColor: "text-yellow-800",
    textColor: "text-yellow-600",
    actionColor: "text-yellow-700 hover:text-yellow-800",
  },
  info: {
    icon: Info,
    bg: "bg-blue-50",
    border: "border-blue-100",
    iconColor: "text-blue-500",
    titleColor: "text-blue-800",
    textColor: "text-blue-600",
    actionColor: "text-blue-700 hover:text-blue-800",
  },
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function NotificationBanner({
  type,
  title,
  message,
  action,
  onAction,
  onDismiss,
  autoDismiss,
}: NotificationBannerProps) {
  const [visible, setVisible] = useState(true);
  const config = STYLE[type];
  const Icon = config.icon;

  useEffect(() => {
    if (!autoDismiss) return;
    const timer = setTimeout(() => {
      setVisible(false);
      onDismiss?.();
    }, autoDismiss);
    return () => clearTimeout(timer);
  }, [autoDismiss, onDismiss]);

  if (!visible) return null;

  return (
    <div
      className={`flex items-start gap-3 p-3.5 rounded-xl border ${config.bg} ${config.border} animate-in fade-in slide-in-from-top-2 duration-300`}
    >
      <Icon className={`w-[18px] h-[18px] mt-0.5 flex-shrink-0 ${config.iconColor}`} />

      <div className="flex-1 min-w-0">
        <p className={`text-[13px] font-medium ${config.titleColor}`}>{title}</p>
        <p className={`text-[12px] mt-0.5 leading-relaxed ${config.textColor}`}>
          {message}
        </p>
        {action && onAction && (
          <button
            onClick={onAction}
            className={`text-[12px] font-medium mt-1.5 inline-flex items-center gap-1 transition-colors ${config.actionColor}`}
          >
            {action} <ArrowRight className="w-3 h-3" />
          </button>
        )}
      </div>

      {onDismiss && (
        <button
          onClick={() => {
            setVisible(false);
            onDismiss();
          }}
          className="p-0.5 rounded hover:bg-black/5 transition-colors flex-shrink-0"
        >
          <X className="w-3.5 h-3.5 text-gray-400" />
        </button>
      )}
    </div>
  );
}
