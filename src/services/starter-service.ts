import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import { sqliteDB } from "@/lib/sqlite";
import { StarterUser, StarterItem } from "@/lib/starter-data";

export async function getStarterUsers(): Promise<StarterUser[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from("users").select("*");
      if (!error && data && data.length > 0) return data as StarterUser[];
    } catch (e) {
      console.warn("Supabase fetch failed, fallback to SQLite", e);
    }
  }
  return sqliteDB.users.select();
}

export async function getStarterItems(): Promise<StarterItem[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from("items").select("*");
      if (!error && data && data.length > 0) return data as StarterItem[];
    } catch (e) {
      console.warn("Supabase items fetch failed, fallback to SQLite", e);
    }
  }
  return sqliteDB.items.select();
}

export async function addStarterItem(item: Omit<StarterItem, "id" | "created_at">): Promise<StarterItem> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from("items").insert([item]).select().single();
      if (!error && data) return data as StarterItem;
    } catch (e) {
      console.warn("Supabase insert failed, fallback to SQLite", e);
    }
  }
  return sqliteDB.items.insert(item);
}

export async function getStarterDashboardMetrics() {
  const [users, items] = await Promise.all([getStarterUsers(), getStarterItems()]);
  const totalValue = items.reduce((acc, curr) => acc + (curr.value || 0), 0);

  return {
    totalUsers: users.length,
    activeUsers: users.filter((u) => u.status === "Aktif").length,
    totalItems: items.length,
    totalValue,
  };
}
