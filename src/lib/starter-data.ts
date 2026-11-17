// =========================================================================
// MRHANDS LAB APP STARTER - GENERIC TYPES, MOCK DATA & HELPERS
// =========================================================================

export type UserRole = "admin" | "member";

export interface StarterUser {
  id: string;
  username: string;
  name: string;
  email: string;
  role: UserRole;
  avatar_url?: string;
  department?: string;
  status: "Aktif" | "Nonaktif";
}

export interface StarterItem {
  id: string;
  title: string;
  category: string;
  status: "Aktif" | "Draft" | "Arsip";
  value: number;
  author: string;
  created_at: string;
}

export function formatRupiah(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatCompact(value: number): string {
  if (value >= 1_000_000_000) {
    return `Rp ${(value / 1_000_000_000).toFixed(1)} M`;
  }
  if (value >= 1_000_000) {
    return `Rp ${(value / 1_000_000).toFixed(1)} Jt`;
  }
  if (value >= 1_000) {
    return `Rp ${(value / 1_000).toFixed(0)} Rb`;
  }
  return formatRupiah(value);
}

export function formatDateIndo(dateStr: string): string {
  if (!dateStr) return "-";
  try {
    const d = new Date(dateStr);
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(d);
  } catch {
    return dateStr;
  }
}

export const initialStarterUsers: StarterUser[] = [
  {
    id: "usr-001",
    username: "admin",
    name: "Administrator",
    email: "admin@mrhands.id",
    role: "admin",
    department: "Executive Management",
    status: "Aktif",
  },
  {
    id: "usr-002",
    username: "member",
    name: "Demo Member",
    email: "member@mrhands.id",
    role: "member",
    department: "Operational",
    status: "Aktif",
  },
];

export const initialStarterItems: StarterItem[] = [
  {
    id: "item-001",
    title: "Proyek Inisiasi Starter Kit",
    category: "Development",
    status: "Aktif",
    value: 25000000,
    author: "Administrator",
    created_at: "2026-11-17",
  },
  {
    id: "item-002",
    title: "Riset Arsitektur Dual-Mode",
    category: "Research",
    status: "Aktif",
    value: 15000000,
    author: "Administrator",
    created_at: "2026-11-16",
  },
  {
    id: "item-003",
    title: "Dokumentasi & Standarisasi PRD",
    category: "Product",
    status: "Draft",
    value: 8000000,
    author: "Demo Member",
    created_at: "2026-11-15",
  },
];

export const sampleChartData = [
  { month: "Jun", total: 45, target: 40 },
  { month: "Jul", total: 52, target: 45 },
  { month: "Agt", total: 58, target: 50 },
  { month: "Sep", total: 65, target: 55 },
  { month: "Okt", total: 72, target: 65 },
  { month: "Nov", total: 80, target: 70 },
];

export const sampleCategoryData = [
  { name: "Development", value: 45, fill: "var(--color-primary)" },
  { name: "Research", value: 30, fill: "var(--color-secondary)" },
  { name: "Product", value: 25, fill: "var(--color-chart-3)" },
];
