"use client";

import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check for token on mount
    const token = localStorage.getItem("insurx_token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("insurx_token");
    setIsLoggedIn(false);
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Navigation */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 transition-all duration-300">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center shrink-0 group">
            {/* Logo Component - Matching Privacy Page but slightly larger for Landng */}
            <Logo size="lg" className="h-14 w-auto" />
          </Link>

          <div className="hidden md:flex gap-10 items-center">
            <Link href="#features" className="text-gray-600 hover:text-blue-900 font-medium text-sm transition-colors">
              Features
            </Link>
            <Link href="#pricing" className="text-gray-600 hover:text-blue-900 font-medium text-sm transition-colors">
              Pricing
            </Link>

            {isLoggedIn ? (
              <div className="flex items-center gap-4">
                <Button
                  asChild
                  className="bg-blue-900 text-white hover:bg-blue-800 font-semibold rounded-full px-8 h-12 shadow-lg shadow-blue-900/10 transition-all hover:shadow-blue-900/20"
                >
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
              </div>
            ) : (
              <Button
                asChild
                className="bg-blue-900 text-white hover:bg-blue-800 font-semibold rounded-full px-8 h-12 shadow-lg shadow-blue-900/10 transition-all hover:shadow-blue-900/20"
              >
                <Link href="/signup">Sign Up</Link>
              </Button>
            )}
          </div>

          <button
            type="button"
            className="md:hidden text-gray-600 p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </nav>
        {mobileMenuOpen && (
          <div className="md:hidden border-t bg-white px-6 py-4 space-y-4">
            <Link href="#features" className="block text-gray-600 font-medium" onClick={() => setMobileMenuOpen(false)}>Features</Link>
            <Link href="#pricing" className="block text-gray-600 font-medium" onClick={() => setMobileMenuOpen(false)}>Pricing</Link>
            {isLoggedIn ? (
              <>
                <Link href="/dashboard" className="block text-gray-600 font-medium" onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>
              </>
            ) : (
              <div className="pt-2">
                <Button asChild className="w-full bg-blue-900 text-white hover:bg-blue-800 rounded-full h-12">
                  <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>Sign Up</Link>
                </Button>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Hero Section - Clean & Typographic */}
      <section className="relative pt-20 pb-32 md:pt-32 md:pb-48 overflow-hidden">
        {/* Subtle Gradient Background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl opacity-50 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-100/30 rounded-full blur-[100px]" />
        </div>

        <div className="container mx-auto px-6 relative z-10 text-center">
          {/* Badge Removed per user request */}

          <h1 className="text-6xl md:text-8xl font-bold tracking-tight text-gray-900 mb-8 leading-[1.1] max-w-5xl mx-auto">
            Climate Risk <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-900">Intelligence.</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-500 mb-12 max-w-3xl mx-auto font-light leading-relaxed">
            Empowering insurers with real-time disaster prediction and precision risk modeling to protect portfolios and profitability.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {isLoggedIn ? (
              <Button asChild size="lg" className="h-16 px-10 text-lg bg-blue-900 hover:bg-blue-800 text-white rounded-full shadow-xl shadow-blue-900/20 transition-all hover:scale-105 hover:shadow-blue-900/30">
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
            ) : (
              <Button asChild size="lg" className="h-16 px-10 text-lg bg-blue-900 hover:bg-blue-800 text-white rounded-full shadow-xl shadow-blue-900/20 transition-all hover:scale-105 hover:shadow-blue-900/30">
                <Link href="/signup">Get Started</Link>
              </Button>
            )}
            <Button asChild variant="ghost" size="lg" className="h-16 px-10 text-lg text-gray-600 hover:text-blue-900 hover:bg-blue-50 rounded-full">
              <a href="mailto:anna.ka@meltwater.org">Contact Sales &rarr;</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section - Bento Grid Style */}
      <section id="features" className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="mb-20 max-w-2xl">
            <h2 className="text-4xl font-bold text-gray-900 mb-6 tracking-tight">Core Capabilities</h2>
            <p className="text-xl text-gray-500 leading-relaxed">
              We've built a comprehensive suite of tools designed to give you clarity in an unpredictable world.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
            {/* Large Card 1 */}
            <div className="md:col-span-2 bg-gray-50 rounded-3xl p-10 border border-gray-100 flex flex-col justify-between hover:shadow-lg transition-all duration-500 group">
              <div>
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" /></svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Real-Time Prediction</h3>
                <p className="text-gray-500 text-lg leading-relaxed max-w-md">Our AI models analyze millions of data points every second to forecast weather events with unprecedented accuracy.</p>
              </div>
              {/* Abstract UI element */}
              <div className="mt-6 h-32 w-full bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden relative">
                <div className="absolute top-4 left-4 right-4 h-2 bg-gray-100 rounded-full animate-pulse" />
                <div className="absolute top-10 left-4 w-2/3 h-2 bg-gray-100 rounded-full opacity-60" />
                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-blue-50/50 to-transparent" />
              </div>
            </div>

            {/* Tall Card 2 - Africa Focused */}
            <div className="md:row-span-2 bg-blue-900 rounded-3xl p-10 flex flex-col justify-between text-white hover:shadow-xl transition-all duration-500 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-800/50 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />

              <div className="relative z-10">
                <div className="w-12 h-12 bg-blue-800 text-blue-200 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <h3 className="text-2xl font-bold mb-3">Pan-African Coverage</h3>
                <p className="text-blue-200 text-lg leading-relaxed">
                  Specialized climate data for the African continent, from the Sahel to the Cape, ensuring no local risk goes unnoticed.
                </p>
              </div>

              <div className="relative z-10 mt-8">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-sm font-mono text-blue-300">Monitored Nations</span>
                </div>
                <div className="text-4xl font-mono font-bold tracking-tighter">
                  54 <span className="text-lg font-normal text-blue-400">Countries</span>
                </div>
              </div>
            </div>

            {/* Standard Card 3 */}
            <div className="bg-white rounded-3xl p-10 border border-gray-100 hover:shadow-lg transition-all duration-300 group">
              <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Precision Modeling</h3>
              <p className="text-gray-500 leading-relaxed">Granular risk assessments for accurate pricing.</p>
            </div>

            {/* Standard Card 4 */}
            <div className="bg-white rounded-3xl p-10 border border-gray-100 hover:shadow-lg transition-all duration-300 group">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Secure & Scalable</h3>
              <p className="text-gray-500 leading-relaxed">Enterprise-grade security, SOC2 compliant.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section - Minimalist */}
      <section id="pricing" className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">Simple, Transparent Pricing</h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg">Choose the plan that fits your scale.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {/* Monthly Plan */}
            <div className="bg-white p-10 rounded-3xl border border-gray-200 hover:border-blue-200 transition-colors flex flex-col">
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900">Monthly</h3>
                <p className="text-gray-500 mt-2">Flexible billing for growing teams.</p>
              </div>
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-5xl font-bold text-gray-900">GHS 5000</span>
                <span className="text-xl text-gray-500 font-medium">/month</span>
              </div>
              <div className="flex-1 space-y-4 mb-10">
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs">✓</div>
                  Full Climate Intelligence
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs">✓</div>
                  Up to 10,000 queries/mo
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs">✓</div>
                  Standard Support
                </div>
              </div>
              <Button asChild className="w-full bg-white text-gray-900 border-2 border-gray-200 hover:border-gray-900 hover:bg-gray-50 text-lg h-14 rounded-xl font-bold transition-all">
                <Link href="/signup?plan=monthly">Choose Monthly</Link>
              </Button>
            </div>

            {/* Yearly Plan */}
            <div className="bg-gray-900 p-10 rounded-3xl text-white flex flex-col relative overflow-hidden ring-1 ring-gray-900">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500" />
              <div className="mb-8 relative z-10">
                <h3 className="text-2xl font-bold">Yearly</h3>
                <p className="text-gray-400 mt-2">Maximum value for enterprises.</p>
              </div>
              <div className="flex items-baseline gap-1 mb-2 relative z-10">
                <span className="text-5xl font-bold text-white">GHS 50,000</span>
                <span className="text-xl text-gray-400 font-medium">/year</span>
              </div>
              <p className="text-sm text-green-400 font-medium mb-8 relative z-10">Save GHS 10,000 per year (17% off)</p>

              <div className="flex-1 space-y-4 mb-10 relative z-10">
                <div className="flex items-center gap-3 text-gray-300">
                  <div className="w-5 h-5 rounded-full bg-blue-900/50 flex items-center justify-center text-blue-400 text-xs">✓</div>
                  Full Climate Intelligence
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <div className="w-5 h-5 rounded-full bg-blue-900/50 flex items-center justify-center text-blue-400 text-xs">✓</div>
                  Unlimited queries
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <div className="w-5 h-5 rounded-full bg-blue-900/50 flex items-center justify-center text-blue-400 text-xs">✓</div>
                  Priority 24/7 Support
                </div>
              </div>
              <Button asChild className="w-full bg-white text-gray-900 hover:bg-gray-100 text-lg h-14 rounded-xl font-bold shadow-lg transition-all relative z-10">
                <Link href="/signup?plan=yearly">Choose Yearly</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-white border-t border-gray-100">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="opacity-50 grayscale hover:grayscale-0 transition-all">
            <Logo size="sm" />
          </div>
          <p className="text-gray-500 text-sm">© 2026 InsurX Inc. All rights reserved.</p>
          <div className="flex gap-8">
            <Link href="/privacy" className="text-gray-500 hover:text-gray-900 text-sm transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-gray-500 hover:text-gray-900 text-sm transition-colors">Terms of Service</Link>
            <Link href="/contact" className="text-gray-500 hover:text-gray-900 text-sm transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
