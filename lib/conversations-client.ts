/**
 * Conversations stored in localStorage per user (no database).
 * For demo/testing only.
 */

import { getSession } from "@/lib/auth-client";

const CONVERSATIONS_PREFIX = "insurx_conversations_";

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  /** Optional metadata: source of the message (e.g. risk analysis), user feedback */
  meta?: {
    source?: "analyze-risk";
    feedback?: "helpful" | "not-helpful";
  };
};

export type Conversation = {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: number;
};

function storageKey(): string | null {
  if (typeof window === "undefined") return null;
  const session = getSession();
  return session ? `${CONVERSATIONS_PREFIX}${session.email}` : null;
}

function loadConversations(): Conversation[] {
  const key = storageKey();
  if (!key) return [];
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as Conversation[]) : [];
  } catch {
    return [];
  }
}

function saveConversations(conversations: Conversation[]): void {
  const key = storageKey();
  if (!key) return;
  window.localStorage.setItem(key, JSON.stringify(conversations));
}

export function getConversations(): Conversation[] {
  return loadConversations();
}

export function getConversation(id: string): Conversation | undefined {
  return loadConversations().find((c) => c.id === id);
}

export function addConversation(conversation: Conversation): void {
  const list = loadConversations();
  list.unshift(conversation);
  saveConversations(list);
}

export function updateConversation(
  id: string,
  updates: Partial<Pick<Conversation, "title" | "messages">>,
): void {
  const list = loadConversations();
  const index = list.findIndex((c) => c.id === id);
  if (index === -1) return;
  list[index] = { ...list[index], ...updates };
  saveConversations(list);
}

export function generateConversationId(): string {
  return `conv_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}
