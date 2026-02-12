"use client";

const API_URL = "http://localhost:4000/api/auth";
const SESSION_KEY = "insurx_session";
const TOKEN_KEY = "insurx_token";

export type SessionUser = {
  id: string;
  email: string;
  fullName: string;
  plan?: string;
  subscriptionStatus?: string;
};

export type AuthResponse = {
  ok: boolean;
  user?: SessionUser;
  error?: string;
  token?: string;
};

// --- Session Management ---

export function setSession(user: SessionUser, token?: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  if (token) {
    window.localStorage.setItem(TOKEN_KEY, token);
  }
}

export function getSession(): SessionUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as SessionUser) : null;
  } catch {
    return null;
  }
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function clearSession(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(SESSION_KEY);
  window.localStorage.removeItem(TOKEN_KEY);
}

// --- API Calls ---

export async function login(email: string, password: string): Promise<AuthResponse> {
  try {
    const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      return { ok: false, error: data.error || "Login failed" };
    }

    // Map backend response to SessionUser
    // Backend returns: _id, fullName, email, token
    const user: SessionUser = {
      id: data._id,
      email: data.email,
      fullName: data.fullName,
      // Defaulting these for now as backend doesn't return them yet
      plan: "monthly",
      subscriptionStatus: "active",
    };

    setSession(user, data.token);
    return { ok: true, user, token: data.token };
  } catch (err) {
    return { ok: false, error: "Network error. Please ensure backend is running." };
  }
}

export async function signup(
  fullName: string,
  email: string,
  password: string,
  plan: string // We accept plan here to potentially pass it if backend supported it, or just for UI flow
): Promise<AuthResponse> {
  try {
    const res = await fetch(`${API_URL}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName, email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      return { ok: false, error: data.error || "Signup failed" };
    }

    const user: SessionUser = {
      id: data._id,
      email: data.email,
      fullName: data.fullName,
      plan: plan, // Use the selected plan from frontend
      subscriptionStatus: "active",
    };

    setSession(user, data.token);
    return { ok: true, user, token: data.token };
  } catch (err) {
    return { ok: false, error: "Network error. Please ensure backend is running." };
  }
}

/**
 * @deprecated Use login() instead
 */
export function validateLogin(email: string, password: string): any {
  console.warn("validateLogin is deprecated. Use login() async function.");
  return { ok: false, error: "Deprecated. Please refresh." };
}
