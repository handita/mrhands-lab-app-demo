import { getStarterUsers } from "./starter-service";
import { AppSession, clearStoredSession, setStoredSession } from "@/store/session-store";
import { initialStarterUsers } from "@/lib/starter-data";

export async function loginWithUsernamePin(username: string, pin: string): Promise<AppSession> {
  const cleanUsername = username.trim().toLowerCase();
  const users = await getStarterUsers();
  const user = users.find(
    (u) => u.username.toLowerCase() === cleanUsername || u.email.toLowerCase() === cleanUsername
  );

  if (!user) {
    throw new Error("Pengguna tidak ditemukan dalam database.");
  }

  // Simple PIN verification (demo mode)
  const isValid = pin === "123456" || pin === "000000" || pin.length >= 4;
  if (!isValid) {
    throw new Error("PIN atau Password tidak sesuai. (Gunakan default: 123456 atau 000000)");
  }

  const session: AppSession = {
    sessionToken: `token-${user.id}-${Date.now()}`,
    user: {
      id: user.id,
      name: user.name,
      nip: user.username,
      email: user.email,
      role: user.role,
      division: user.department,
    },
  };

  setStoredSession(session);
  return session;
}

export async function loginAsDemo(role: "admin" | "employee"): Promise<AppSession> {
  const users = await getStarterUsers();
  const targetRole = role === "admin" ? "admin" : "member";
  const user = users.find((u) => u.role === targetRole) || initialStarterUsers[0];

  const session: AppSession = {
    sessionToken: `demo-${user.id}`,
    user: {
      id: user.id,
      name: user.name,
      nip: user.username,
      email: user.email,
      role: user.role,
      division: user.department,
    },
  };

  setStoredSession(session);
  return session;
}

export function logout() {
  clearStoredSession();
  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
}
