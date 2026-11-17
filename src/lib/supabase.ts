import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Safely retrieve an environment variable from either import.meta.env (client/Vite)
 * or process.env (Node/SSR/Nitro).
 */
function getEnv(key: string): string | undefined {
  if (typeof import.meta !== "undefined" && import.meta.env && import.meta.env[key]) {
    return (import.meta.env[key] as string).trim();
  }
  if (typeof process !== "undefined" && process.env && process.env[key]) {
    return process.env[key]?.trim();
  }
  return undefined;
}

// 1. Deteksi Lingkungan Deployment (Vercel / Production vs Local Dev)
export const isVercel = Boolean(
  (typeof process !== "undefined" && process.env && (process.env.VERCEL === "1" || Boolean(process.env.VERCEL_ENV)))
);

export const isProduction = Boolean(
  (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.PROD) ||
  (typeof process !== "undefined" && process.env && (process.env.NODE_ENV === "production" || isVercel))
);

// 2. Deteksi Mode Target (local vs cloud)
const rawMode = (
  getEnv("NEXT_PUBLIC_SUPABASE_MODE") ||
  getEnv("VITE_SUPABASE_MODE") ||
  (isVercel ? "cloud" : "local")
).toLowerCase();

// Pengaman: Di Vercel selalu cloud, di lokal gunakan rawMode
export const supabaseMode: "local" | "cloud" =
  isVercel ? "cloud" : rawMode === "local" ? "local" : "cloud";

// 3. Kredensial default untuk Supabase Local (Docker)
const DEFAULT_LOCAL_URL = "http://127.0.0.1:54321";
const DEFAULT_LOCAL_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0";

// 4. Resolusi Endpoint & Anon Key sesuai target mode aktif
let resolvedUrl: string | undefined;
let resolvedAnonKey: string | undefined;

if (supabaseMode === "local") {
  resolvedUrl =
    getEnv("LOCAL_URL") ||
    getEnv("NEXT_PUBLIC_LOCAL_URL") ||
    getEnv("VITE_SUPABASE_LOCAL_URL") ||
    getEnv("NEXT_PUBLIC_SUPABASE_LOCAL_URL") ||
    DEFAULT_LOCAL_URL;

  resolvedAnonKey =
    getEnv("LOCAL_ANON_KEY") ||
    getEnv("NEXT_PUBLIC_LOCAL_ANON_KEY") ||
    getEnv("VITE_SUPABASE_LOCAL_ANON_KEY") ||
    getEnv("NEXT_PUBLIC_SUPABASE_LOCAL_ANON_KEY") ||
    DEFAULT_LOCAL_ANON_KEY;
} else {
  // Mode CLOUD
  resolvedUrl =
    getEnv("CLOUD_URL") ||
    getEnv("NEXT_PUBLIC_CLOUD_URL") ||
    getEnv("VITE_SUPABASE_CLOUD_URL") ||
    getEnv("NEXT_PUBLIC_SUPABASE_CLOUD_URL") ||
    getEnv("VITE_SUPABASE_URL") ||
    getEnv("NEXT_PUBLIC_SUPABASE_URL");

  resolvedAnonKey =
    getEnv("CLOUD_ANON_KEY") ||
    getEnv("NEXT_PUBLIC_CLOUD_ANON_KEY") ||
    getEnv("VITE_SUPABASE_CLOUD_ANON_KEY") ||
    getEnv("NEXT_PUBLIC_SUPABASE_CLOUD_ANON_KEY") ||
    getEnv("VITE_SUPABASE_ANON_KEY") ||
    getEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");
}

// 5. Pengaman mutlak: Jika berjalan di Vercel, jangan pernah izinkan URL lokal (127.0.0.1)
if (isVercel && resolvedUrl && (resolvedUrl.includes("127.0.0.1") || resolvedUrl.includes("localhost"))) {
  resolvedUrl =
    getEnv("CLOUD_URL") ||
    getEnv("NEXT_PUBLIC_CLOUD_URL") ||
    getEnv("VITE_SUPABASE_CLOUD_URL") ||
    getEnv("NEXT_PUBLIC_SUPABASE_CLOUD_URL") ||
    getEnv("VITE_SUPABASE_URL") ||
    getEnv("NEXT_PUBLIC_SUPABASE_URL");

  resolvedAnonKey =
    getEnv("CLOUD_ANON_KEY") ||
    getEnv("NEXT_PUBLIC_CLOUD_ANON_KEY") ||
    getEnv("VITE_SUPABASE_CLOUD_ANON_KEY") ||
    getEnv("NEXT_PUBLIC_SUPABASE_CLOUD_ANON_KEY") ||
    getEnv("VITE_SUPABASE_ANON_KEY") ||
    getEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");
}

export const supabaseUrl = resolvedUrl;
export const supabaseAnonKey = resolvedAnonKey;
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

// 6. Log Konsol saat development (Browser & Server/SSR)
const isDev = Boolean(
  (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.DEV) ||
  (typeof process !== "undefined" && process.env && process.env.NODE_ENV !== "production")
);

if (isDev) {
  if (supabaseMode === "local") {
    const host = supabaseUrl?.replace(/^https?:\/\//, "") || "127.0.0.1:54321";
    console.info(`[Supabase] Active target: LOCAL (${host})`);
  } else {
    let cloudInfo = "";
    try {
      if (supabaseUrl) {
        cloudInfo = ` (${new URL(supabaseUrl).hostname})`;
      }
    } catch {
      // ignore url parse
    }
    console.info(`[Supabase] Active target: CLOUD${cloudInfo}`);
  }
}

// 7. Inisialisasi Supabase Client
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!, {
      auth: { persistSession: false },
    })
  : null;

export function requireSupabase(): SupabaseClient {
  if (!supabase) {
    throw new Error(
      `Supabase belum dikonfigurasi untuk mode "${supabaseMode}". Pastikan URL dan Anon Key sudah terisi di environment.`
    );
  }
  return supabase;
}

/**
 * Helper informasi konfigurasi aktif untuk UI status / debug bar
 */
export function getActiveSupabaseConfig() {
  return {
    mode: supabaseMode,
    url: supabaseUrl,
    isConfigured: isSupabaseConfigured,
    isVercel,
    isProduction,
  };
}
