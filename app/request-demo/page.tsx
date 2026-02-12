"use client";

import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useState } from "react";

export default function RequestDemoPage() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <nav className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center">
              <Logo size="md" showName={false} />
            </Link>
            <Button
              variant="ghost"
              asChild
              className="text-primary font-medium hover:bg-primary/5"
            >
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
        </nav>
      </header>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-xl">
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Request a Demo
              </h1>
              <p className="text-muted-foreground">
                Fill out the form below and we&apos;ll get in touch with you
                shortly.
              </p>
            </div>
            {submitted ? (
              <div className="text-center py-8">
                <p className="text-lg text-muted-foreground mb-4">
                  Thank you for your request. We&apos;ll be in touch shortly.
                </p>
                <Button asChild>
                  <Link href="/">Back to Home</Link>
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="first_name"
                      className="text-foreground font-medium"
                    >
                      First Name
                    </Label>
                    <Input
                      id="first_name"
                      name="first_name"
                      required
                      className="w-full px-4 py-3 rounded-lg focus-visible:ring-2 focus-visible:ring-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="last_name"
                      className="text-foreground font-medium"
                    >
                      Last Name
                    </Label>
                    <Input
                      id="last_name"
                      name="last_name"
                      required
                      className="w-full px-4 py-3 rounded-lg focus-visible:ring-2 focus-visible:ring-primary"
                    />
                  </div>
                </div>
                <div className="mb-6 space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-foreground font-medium"
                  >
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="w-full px-4 py-3 rounded-lg focus-visible:ring-2 focus-visible:ring-primary"
                  />
                </div>
                <div className="mb-8 space-y-2">
                  <Label
                    htmlFor="company_name"
                    className="text-foreground font-medium"
                  >
                    Company Name
                  </Label>
                  <Input
                    id="company_name"
                    name="company_name"
                    required
                    className="w-full px-4 py-3 rounded-lg focus-visible:ring-2 focus-visible:ring-primary"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full px-8 py-4 text-lg font-bold rounded-lg"
                >
                  Submit Request
                </Button>
              </form>
            )}
          </div>
        </div>
      </section>

      <footer className="bg-white border-t border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-muted-foreground text-sm">
              &copy; 2026 InsurX Dev Team. All rights reserved.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="text-muted-foreground hover:text-primary text-sm"
              >
                Twitter
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-primary text-sm"
              >
                LinkedIn
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-primary text-sm"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
