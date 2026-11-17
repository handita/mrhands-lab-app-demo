// =========================================================================
// MRHANDS LAB APP STARTER - GENERIC SQLITE ENGINE (ZERO-CONFIG)
// =========================================================================

import {
  StarterUser,
  StarterItem,
  initialStarterUsers,
  initialStarterItems,
} from "./starter-data";

export const SQLITE_STORAGE_PREFIX = "mrhands_starter_sqlite_";

export interface SQLiteDatabaseStats {
  engine: "SQLite (Embedded / Zero-Config)";
  mode: "sqlite-local";
  version: "3.45.0 Compatible";
  tables: {
    users: number;
    items: number;
  };
  lastSynced: string;
}

export const SQLITE_SCHEMA_DDL = `
-- SQLite Generic Schema: Mrhands Lab App Starter
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT DEFAULT 'member' CHECK (role IN ('admin', 'member')),
    department TEXT,
    status TEXT DEFAULT 'Aktif',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS items (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    status TEXT DEFAULT 'Aktif',
    value REAL DEFAULT 0,
    author TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
`;

function readTable<T>(tableName: string, defaultData: T[]): T[] {
  if (typeof window === "undefined") return defaultData;
  try {
    const raw = localStorage.getItem(`${SQLITE_STORAGE_PREFIX}${tableName}`);
    if (!raw) {
      localStorage.setItem(`${SQLITE_STORAGE_PREFIX}${tableName}`, JSON.stringify(defaultData));
      return defaultData;
    }
    return JSON.parse(raw) as T[];
  } catch {
    return defaultData;
  }
}

function writeTable<T>(tableName: string, data: T[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(`${SQLITE_STORAGE_PREFIX}${tableName}`, JSON.stringify(data));
  } catch (e) {
    console.error(`SQLite Table [${tableName}] write error:`, e);
  }
}

export const sqliteDB = {
  getStats(): SQLiteDatabaseStats {
    const users = readTable<StarterUser>("users", initialStarterUsers);
    const items = readTable<StarterItem>("items", initialStarterItems);

    return {
      engine: "SQLite (Embedded / Zero-Config)",
      mode: "sqlite-local",
      version: "3.45.0 Compatible",
      tables: {
        users: users.length,
        items: items.length,
      },
      lastSynced: new Date().toISOString(),
    };
  },

  resetDatabase(): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(`${SQLITE_STORAGE_PREFIX}users`, JSON.stringify(initialStarterUsers));
    localStorage.setItem(`${SQLITE_STORAGE_PREFIX}items`, JSON.stringify(initialStarterItems));
  },

  users: {
    select(): StarterUser[] {
      return readTable<StarterUser>("users", initialStarterUsers);
    },
    findById(id: string): StarterUser | null {
      const list = this.select();
      return list.find((u) => u.id === id || u.username === id) || null;
    },
  },

  items: {
    select(): StarterItem[] {
      return readTable<StarterItem>("items", initialStarterItems);
    },
    insert(item: Omit<StarterItem, "id" | "created_at">): StarterItem {
      const list = this.select();
      const created: StarterItem = {
        ...item,
        id: `item-${Date.now()}`,
        created_at: new Date().toISOString().split("T")[0],
      };
      writeTable("items", [created, ...list]);
      return created;
    },
    delete(id: string): void {
      const list = this.select().filter((i) => i.id !== id);
      writeTable("items", list);
    },
  },
};
