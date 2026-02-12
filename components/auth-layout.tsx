"use client";

import Image from "next/image";
import { ReactNode } from "react";

interface AuthLayoutProps {
    children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
    return (
        <div className="flex min-h-screen w-full">
            {/* Left Side - Image & Overlay */}
            <div className="relative hidden w-1/2 flex-col justify-end p-10 text-white lg:flex">
                {/* Back to Home Button */}
                <a href="/" className="absolute top-8 left-8 z-30 flex items-center gap-2 text-white/80 hover:text-white transition-colors bg-black/20 hover:bg-black/30 px-4 py-2 rounded-full backdrop-blur-sm text-sm font-medium">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                    Back to Home
                </a>
                <div className="absolute inset-0 bg-zinc-900" />
                <Image
                    src="/auth-bg.jpg"
                    alt="Map Background"
                    fill
                    className="object-cover opacity-60"
                    priority
                />
                <div className="relative z-20 mt-auto">
                    <h1 className="text-4xl font-bold leading-tight tracking-tight">
                        PREDICT CLIMATE CHANGES
                        <br /><br />
                        STAY AHEAD OF DISASTERS<br />
                    </h1>
                    <p className="mt-4 text-lg font-medium text-zinc-200">
                        Starting From $300/Month
                    </p>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex w-full flex-col justify-center bg-white px-8 py-10 lg:w-1/2 lg:px-16 xl:px-24">
                {children}
            </div>
        </div>
    );
}
