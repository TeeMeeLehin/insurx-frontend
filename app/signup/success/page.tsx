"use client";

import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { setSession } from "@/lib/auth-client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function SignupSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [countdown, setCountdown] = useState(3);
  const [confirmed, setConfirmed] = useState<boolean | null>(null);
  const [confirmError, setConfirmError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setConfirmed(false);
      return;
    }
    let cancelled = false;
    fetch("/api/auth/confirm-payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id: sessionId }),
    })
      .then(async (res) => {
        if (cancelled) return;
        const data = await res.json().catch(() => ({}));
        if (res.ok && data.user) {
          // Legacy mock logic removed
          setSession(data.user);
          setConfirmed(true);
          return;
        }
        setConfirmError(data.error ?? "Could not confirm payment.");
        setConfirmed(false);
      })
      .catch(() => {
        if (!cancelled) {
          setConfirmError("Network error. Please try again.");
          setConfirmed(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  useEffect(() => {
    if (confirmed !== true) return;
    const t = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(t);
          window.location.href = "/dashboard";
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [confirmed]);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border px-6 py-4">
        <Link href="/">
          <Logo size="md" />
        </Link>
      </header>
      <main className="mx-auto max-w-md px-6 py-16 text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Payment successful
        </h1>
        {confirmError ? (
          <p role="alert" className="mt-2 text-sm text-destructive">
            {confirmError}
          </p>
        ) : (
          <p className="mt-2 text-sm text-muted-foreground">
            Your subscription is active. Redirecting to the dashboard
            {confirmed && countdown > 0 && ` in ${countdown}...`}
          </p>
        )}
        <Button asChild className="mt-8">
          <Link href="/dashboard">Go to dashboard</Link>
        </Button>
      </main>
    </div>
  );
}

export default function SignupSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background">
          <header className="border-b border-border px-6 py-4">
            <Link href="/">
              <Logo size="md" />
            </Link>
          </header>
          <main className="mx-auto max-w-md px-6 py-16 text-center">
            <div className="h-6 w-40 animate-pulse rounded bg-muted mx-auto" />
          </main>
        </div>
      }
    >
      <SignupSuccessContent />
    </Suspense>
  );
}
