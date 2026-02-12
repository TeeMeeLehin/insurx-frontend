/**
 * Verifies Stripe payment and returns user data for client-side session. Uses STRIPE_SECRET_KEY from env only.
 */
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(request: NextRequest) {
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret || !secret.startsWith("sk_")) {
    return NextResponse.json(
      { error: "Payment is not configured." },
      { status: 500 },
    );
  }

  let body: { session_id?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 },
    );
  }

  const sessionId = body.session_id;
  if (!sessionId || typeof sessionId !== "string") {
    return NextResponse.json(
      { error: "Session ID is required." },
      { status: 400 },
    );
  }

  const stripe = new Stripe(secret);

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["payment_intent"],
    });

    if (session.payment_status !== "paid") {
      return NextResponse.json(
        { error: "Payment was not completed." },
        { status: 400 },
      );
    }

    const email = session.customer_email ?? session.customer_details?.email;
    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Could not determine customer email." },
        { status: 400 },
      );
    }

    const fullName = (session.metadata?.fullName as string) ?? "Customer";
    const plan = (session.metadata?.plan as string) ?? "monthly";
    const planValue =
      plan === "annual" ? "annual" : plan === "per-use" ? "per-use" : "monthly";

    return NextResponse.json({
      ok: true,
      user: {
        email,
        fullName,
        plan: planValue,
        subscriptionStatus: "active" as const,
      },
    });
  } catch (err) {
    console.error("Confirm payment error:", err);
    return NextResponse.json(
      { error: "Could not confirm payment. Please try again." },
      { status: 500 },
    );
  }
}
