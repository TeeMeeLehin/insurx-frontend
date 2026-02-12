"use client";

import type { SessionUser } from "@/lib/auth-client";
import { getSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export type RequireAuthResult = {
  session: SessionUser | null;
  loading: boolean;
};

/**
 * Protects a route: redirects to /login if not authenticated,
 * to /signup?reason=inactive if authenticated but subscription is inactive.
 * Only returns session when authenticated and subscription is active.
 */
export function useRequireAuth(): RequireAuthResult {
  const router = useRouter();
  const [session, setSession] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const current = getSession();
    setSession(current);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (loading) return;
    const current = getSession();
    if (!current) {
      router.replace("/login");
      return;
    }
    if (current.subscriptionStatus !== "active") {
      router.replace("/signup?reason=inactive");
      return;
    }
    setSession(current);
  }, [loading, router]);

  const validSession =
    session && session.subscriptionStatus === "active" ? session : null;
  return { session: validSession, loading };
}
