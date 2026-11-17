import { useSyncExternalStore } from "react";

export type Role = "admin" | "member";

export interface User {
  id: string;
  name: string;
  nip: string;
  email: string;
  role: Role;
  division?: string;
  position?: string;
  avatar_url?: string;
  is_anonymous?: boolean;
}

export type AppSession = {
  sessionToken: string;
  user: User;
};

const STORAGE_KEY = "hr-starter-session";
const listeners = new Set<() => void>();
let cachedRaw: string | null | undefined;
let cachedSession: AppSession | null = null;

function emit() {
  listeners.forEach((listener) => listener());
}

function readSession(): AppSession | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (raw === cachedRaw) return cachedSession;
  cachedRaw = raw;
  if (!raw) {
    cachedSession = null;
    return cachedSession;
  }
  try {
    cachedSession = JSON.parse(raw) as AppSession;
    return cachedSession;
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
    cachedRaw = null;
    cachedSession = null;
    return cachedSession;
  }
}

export function getStoredSession() {
  return readSession();
}

export function setStoredSession(session: AppSession) {
  const raw = JSON.stringify(session);
  window.localStorage.setItem(STORAGE_KEY, raw);
  cachedRaw = raw;
  cachedSession = session;
  emit();
}

export function clearStoredSession() {
  window.localStorage.removeItem(STORAGE_KEY);
  cachedRaw = null;
  cachedSession = null;
  emit();
}

export function useSession() {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    readSession,
    () => null,
  );
}

export const isAdminSession = (session: AppSession | null) => session?.user.role === "admin";
export const isMemberSession = (session: AppSession | null) =>
  session?.user.role === "member" || session?.user.role === "admin";
