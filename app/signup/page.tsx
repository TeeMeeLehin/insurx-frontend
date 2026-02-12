"use client";

import { AuthLayout } from "@/components/auth-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Determine plan from URL, default to monthly if not present
  const planParam = searchParams.get("plan") || "monthly";

  const [errors, setErrors] = useState<{
    fullName?: string;
    email?: string;
    password?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  function validate(): boolean {
    const next: typeof errors = {};
    if (!fullName.trim()) {
      next.fullName = "Company name is required.";
    }
    if (!email.trim()) {
      next.email = "Email address is required.";
    } else if (!EMAIL_REGEX.test(email)) {
      next.email = "Please enter a valid email address.";
    }
    if (!password) {
      next.password = "Password is required.";
    } else if (password.length < 6) {
      next.password = "Password must be at least 6 characters.";
    }
    if (password !== confirmPassword) {
      next.password = "Passwords do not match.";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPaymentError(null);
    if (!validate()) return;
    setIsSubmitting(true);

    try {
      const { signup } = await import("@/lib/auth-client");
      const result = await signup(fullName, email, password, planParam);

      if (result.ok) {
        router.replace("/dashboard");
      } else {
        setPaymentError(result.error || "Signup failed");
      }
    } catch (err) {
      setPaymentError("An error occurred during signup.");
    }
    setIsSubmitting(false);
  }

  return (
    <AuthLayout>
      <div className="mx-auto w-full max-w-sm">
        {/* Tabs */}
        <div className="flex w-full mb-8 border-b border-gray-200">
          <Link
            href="/login"
            className="flex-1 pb-4 text-center font-semibold text-lg text-gray-400 hover:text-gray-600 border-b-2 border-transparent hover:border-gray-200"
          >
            Sign In
          </Link>
          <div className="flex-1 pb-4 text-center font-bold text-lg text-blue-900 border-b-2 border-blue-900 cursor-default">
            Sign Up
          </div>
        </div>

        {paymentError && (
          <div className="mb-6 rounded-md bg-red-50 p-3 text-sm text-red-500 border border-red-200">
            {paymentError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="fullName" className="sr-only">Company Name</Label>
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="7" r="4" /><path d="M12 14c-5 0-9 2-9 6h18c0-4-4-6-9-6Z" /></svg>
              </span>
              <Input
                id="fullName"
                type="text"
                placeholder="Company Name"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  if (errors.fullName)
                    setErrors((p) => ({ ...p, fullName: undefined }));
                }}
                className={`bg-gray-50 border-gray-100 pl-10 py-5 text-base rounded-md focus:ring-blue-500 focus:border-blue-500 ${errors.fullName ? 'border-red-300 focus:ring-red-200' : ''}`}
                disabled={isSubmitting}
              />
            </div>
            {errors.fullName && (
              <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>
            )}
          </div>

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
                  if (errors.email)
                    setErrors((p) => ({ ...p, email: undefined }));
                }}
                className={`bg-gray-50 border-gray-100 pl-10 py-5 text-base rounded-md focus:ring-blue-500 focus:border-blue-500 ${errors.email ? 'border-red-300 focus:ring-red-200' : ''}`}
                disabled={isSubmitting}
              />
            </div>
            {errors.email && (
              <p className="text-xs text-red-500 mt-1">{errors.email}</p>
            )}
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
                  if (errors.password)
                    setErrors((p) => ({ ...p, password: undefined }));
                }}
                className={`bg-gray-50 border-gray-100 pl-10 py-5 text-base rounded-md focus:ring-blue-500 focus:border-blue-500 ${errors.password ? 'border-red-300 focus:ring-red-200' : ''}`}
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="sr-only">Confirm Password</Label>
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
              </span>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (errors.password)
                    setErrors((p) => ({ ...p, password: undefined }));
                }}
                className={`bg-gray-50 border-gray-100 pl-10 py-5 text-base rounded-md focus:ring-blue-500 focus:border-blue-500 ${errors.password ? 'border-red-300 focus:ring-red-200' : ''}`}
                disabled={isSubmitting}
              />
            </div>
            {errors.password && (
              <p className="text-xs text-red-500 mt-1">{errors.password}</p>
            )}
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              className="w-full bg-blue-800 hover:bg-blue-900 text-white py-6 text-lg font-semibold rounded-md shadow-lg shadow-blue-900/20"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sign up" : "Sign up"}
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

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white"></div>}>
      <SignupForm />
    </Suspense>
  );
}
