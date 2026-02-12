/**
 * Creates a Stripe Checkout session. Uses STRIPE_SECRET_KEY from env only.
 */
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const PLAN_AMOUNTS = {
  monthly: 50000, // $500 in cents
  annual: 500000, // $5,000 in cents
  "per-use": 25000, // $250 in cents
} as const;

export async function POST(request: NextRequest) {
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret || !secret.startsWith("sk_")) {
    return NextResponse.json(
      { error: "Payment is not configured. Please set STRIPE_SECRET_KEY." },
      { status: 500 },
    );
  }
  const stripe = new Stripe(secret);

  let body: { email?: string; fullName?: string; plan?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 },
    );
  }

  const { email, fullName, plan } = body;
  if (!email || typeof email !== "string") {
    return NextResponse.json({ error: "Email is required." }, { status: 400 });
  }
  const planKey =
    plan === "annual" ? "annual" : plan === "per-use" ? "per-use" : "monthly";
  const amount = PLAN_AMOUNTS[planKey];

  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ??
    (request.nextUrl.origin || "http://localhost:3000");

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: email,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: amount,
            product_data: {
              name:
                planKey === "annual"
                  ? "Insurx Annual Plan"
                  : planKey === "per-use"
                    ? "Insurx Per Use"
                    : "Insurx Monthly Plan",
              description:
                planKey === "annual"
                  ? "$5,000 / year"
                  : planKey === "per-use"
                    ? "$250 / use"
                    : "$500 / month",
            },
          },
        },
      ],
      success_url: `${baseUrl}/signup/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/signup?canceled=1`,
      metadata: {
        fullName: fullName ?? "",
        plan: planKey,
      },
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "Failed to create checkout session." },
        { status: 500 },
      );
    }

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout error:", err);
    return NextResponse.json(
      { error: "Payment could not be started. Please try again." },
      { status: 500 },
    );
  }
}
