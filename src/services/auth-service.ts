import { toast } from "sonner";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import { Employee, initialEmployees } from "@/lib/employee-data";
import { AppSession, clearStoredSession, setStoredSession } from "@/store/session-store";
import { getEmployees } from "./employee-service";

export type UserAuthStatus = {
  exists: boolean;
  nip?: string;
  name?: string;
  role?: "admin" | "member";
  division?: string;
  position?: string;
  is_pin_set?: boolean;
  message?: string;
};

export async function loginWithNipPin(nip: string, pin: string): Promise<AppSession> {
  const cleanNip = nip.trim();
  const employees = await getEmployees();
  const emp = employees.find((item) => item.nip === cleanNip || item.email === cleanNip);

  if (!emp) {
    throw new Error("NIP atau Email tidak terdaftar dalam database karyawan.");
  }

  // Simple PIN verification (in demo: admin is 000000 or 123456, employee is 123456)
  const isPinValid = pin === "123456" || pin === "000000" || pin.length >= 4;

  if (!isPinValid) {
    throw new Error("PIN atau Password salah. (Gunakan default: 123456 atau 000000 untuk Admin)");
  }

  const sessionUser = {
    id: emp.id,
    name: emp.name,
    nip: emp.nip,
    email: emp.email,
    role: emp.role,
    is_anonymous: false,
    division: emp.division,
    position: emp.position,
  };

  const session: AppSession = {
    sessionToken: `token-${emp.id}-${Date.now()}`,
    user: sessionUser as any,
  };

  setStoredSession(session);
  return session;
}

/**
 * 1-Click Quick Demo Login Helper
 */
export async function loginAsDemo(role: "admin" | "employee", specificNip?: string): Promise<AppSession> {
  const employees = await getEmployees();
  let emp: Employee | undefined;

  if (specificNip) {
    emp = employees.find((e) => e.nip === specificNip);
  } else if (role === "admin") {
    emp = employees.find((e) => e.role === "admin") || initialEmployees[0];
  } else {
    emp = employees.find((e) => e.role === "member") || initialEmployees[1];
  }

  if (!emp) {
    emp = initialEmployees[0];
  }

  const sessionUser = {
    id: emp.id,
    name: emp.name,
    nip: emp.nip,
    email: emp.email,
    role: emp.role,
    is_anonymous: false,
    division: emp.division,
    position: emp.position,
  };

  const session: AppSession = {
    sessionToken: `demo-session-${emp.id}`,
    user: sessionUser as any,
  };

  setStoredSession(session);
  return session;
}

export async function checkUserAuthStatus(nip: string): Promise<UserAuthStatus> {
  const cleanNip = nip.trim();
  const employees = await getEmployees();
  const emp = employees.find((item) => item.nip === cleanNip || item.email === cleanNip);

  if (!emp) {
    return {
      exists: false,
      message: "NIP atau Email tidak ditemukan.",
    };
  }

  return {
    exists: true,
    nip: emp.nip,
    name: emp.name,
    role: emp.role,
    division: emp.division,
    position: emp.position,
    is_pin_set: true,
  };
}

export function logout() {
  clearStoredSession();
  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
}
