"use client";

import { AuthLayout } from "@/components/auth-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!email.trim()) {
      setError("Email is required.");
      return;
    }
    if (!password) {
      setError("Password is required.");
      return;
    }
    setIsSubmitting(true);

    try {
      const { login } = await import("@/lib/auth-client");
      const result = await login(email.trim(), password);

      if (result.ok) {
        router.replace("/dashboard");
      } else {
        setError(result.error || "Login failed");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    }
    setIsSubmitting(false);
  }

  return (
    <AuthLayout>
      <div className="mx-auto w-full max-w-sm">
        {/* Tabs */}
        <div className="flex w-full mb-8 border-b border-gray-200">
          <div className="flex-1 pb-4 text-center font-bold text-lg text-blue-900 border-b-2 border-blue-900 cursor-default">
            Sign In
          </div>
          <Link
            href="/signup"
            className="flex-1 pb-4 text-center font-semibold text-lg text-gray-400 hover:text-gray-600 border-b-2 border-transparent hover:border-gray-200"
          >
            Sign Up
          </Link>
        </div>

        {error && (
          <div className="mb-6 rounded-md bg-red-50 p-3 text-sm text-red-500 border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="sr-only">Email Address</Label>
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
              </span>
              <Input
                id="email"
                type="email"
                placeholder="yourname@companyname.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError(null);
                }}
                className="bg-gray-50 border-gray-100 pl-10 py-6 text-base rounded-md focus:ring-blue-500 focus:border-blue-500"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="sr-only">Password</Label>
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
              </span>
              <Input
                id="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError(null);
                }}
                className="bg-gray-50 border-gray-100 pl-10 py-6 text-base rounded-md focus:ring-blue-500 focus:border-blue-500"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              className="w-full bg-blue-800 hover:bg-blue-900 text-white py-6 text-lg font-semibold rounded-md shadow-lg shadow-blue-900/20"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Signing in..." : "Sign in"}
            </Button>
          </div>
        </form>
        <p className="mt-8 text-center text-xs text-gray-400">
          By registering you with our{" "}
          <Link href="/terms" className="text-blue-600 font-medium">
            Terms and Conditions
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
