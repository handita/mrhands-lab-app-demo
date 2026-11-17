// =========================================================================
// MRHANDS LAB APP DEMO - SQLITE LOCAL DATABASE LAYER (ZERO-CONFIG)
// =========================================================================

import {
  Employee,
  AttendanceRecord,
  LeaveRequest,
  PayrollRecord,
  Announcement,
  initialEmployees,
  initialAttendances,
  initialLeaveRequests,
  initialPayrolls,
  initialAnnouncements,
} from "./employee-data";

export const SQLITE_STORAGE_PREFIX = "mrhands_sqlite_db_";

export interface SQLiteDatabaseStats {
  engine: "SQLite (Embedded / Zero-Config)";
  mode: "sqlite-local";
  version: "3.45.0 Compatible";
  tables: {
    employees: number;
    attendances: number;
    leave_requests: number;
    payrolls: number;
    announcements: number;
  };
  lastSynced: string;
}

// -------------------------------------------------------------------------
// SQLite Schema DDL Definition
// -------------------------------------------------------------------------
export const SQLITE_SCHEMA_DDL = `
-- SQLite Schema: Mrhands Lab App Demo
CREATE TABLE IF NOT EXISTS employees (
    id TEXT PRIMARY KEY,
    nip TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    role TEXT DEFAULT 'member' CHECK (role IN ('admin', 'member')),
    pin_hash TEXT DEFAULT '123456',
    division TEXT NOT NULL,
    position TEXT NOT NULL,
    employment_type TEXT DEFAULT 'Tetap',
    status TEXT DEFAULT 'Aktif',
    join_date TEXT NOT NULL,
    salary REAL DEFAULT 0,
    remaining_leave INTEGER DEFAULT 12,
    bank_name TEXT,
    bank_account TEXT,
    education TEXT,
    address TEXT,
    avatar_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS attendances (
    id TEXT PRIMARY KEY,
    employee_id TEXT NOT NULL,
    date TEXT NOT NULL,
    check_in TEXT,
    check_out TEXT,
    status TEXT DEFAULT 'Hadir',
    notes TEXT,
    location TEXT DEFAULT 'Kantor Pusat',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(employee_id) REFERENCES employees(id),
    UNIQUE(employee_id, date)
);

CREATE TABLE IF NOT EXISTS leave_requests (
    id TEXT PRIMARY KEY,
    employee_id TEXT NOT NULL,
    leave_type TEXT NOT NULL,
    start_date TEXT NOT NULL,
    end_date TEXT NOT NULL,
    total_days INTEGER DEFAULT 1,
    reason TEXT NOT NULL,
    status TEXT DEFAULT 'Menunggu Persetujuan',
    submitted_at TEXT NOT NULL,
    reviewed_at TEXT,
    reviewed_by TEXT,
    FOREIGN KEY(employee_id) REFERENCES employees(id)
);

CREATE TABLE IF NOT EXISTS payrolls (
    id TEXT PRIMARY KEY,
    employee_id TEXT NOT NULL,
    period TEXT NOT NULL,
    basic_salary REAL NOT NULL DEFAULT 0,
    allowance_position REAL DEFAULT 0,
    allowance_transport REAL DEFAULT 0,
    allowance_meal REAL DEFAULT 0,
    bonus REAL DEFAULT 0,
    deduction_bpjs REAL DEFAULT 0,
    deduction_tax REAL DEFAULT 0,
    net_salary REAL NOT NULL DEFAULT 0,
    status TEXT DEFAULT 'Lunas',
    paid_at TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(employee_id) REFERENCES employees(id)
);

CREATE TABLE IF NOT EXISTS announcements (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT DEFAULT 'Pemberitahuan',
    content TEXT NOT NULL,
    author TEXT NOT NULL,
    is_pinned INTEGER DEFAULT 0,
    published_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
`;

// Helper Storage Operations
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
    console.error(`SQLite Table [${tableName}] write failed:`, e);
  }
}

// -------------------------------------------------------------------------
// SQLite Client API
// -------------------------------------------------------------------------
export const sqliteDB = {
  // Stats & Health
  getStats(): SQLiteDatabaseStats {
    const emps = readTable<Employee>("employees", initialEmployees);
    const atts = readTable<AttendanceRecord>("attendances", initialAttendances);
    const leaves = readTable<LeaveRequest>("leave_requests", initialLeaveRequests);
    const pays = readTable<PayrollRecord>("payrolls", initialPayrolls);
    const anns = readTable<Announcement>("announcements", initialAnnouncements);

    return {
      engine: "SQLite (Embedded / Zero-Config)",
      mode: "sqlite-local",
      version: "3.45.0 Compatible",
      tables: {
        employees: emps.length,
        attendances: atts.length,
        leave_requests: leaves.length,
        payrolls: pays.length,
        announcements: anns.length,
      },
      lastSynced: new Date().toISOString(),
    };
  },

  // Reset to clean seed
  resetDatabase(): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(`${SQLITE_STORAGE_PREFIX}employees`, JSON.stringify(initialEmployees));
    localStorage.setItem(`${SQLITE_STORAGE_PREFIX}attendances`, JSON.stringify(initialAttendances));
    localStorage.setItem(`${SQLITE_STORAGE_PREFIX}leave_requests`, JSON.stringify(initialLeaveRequests));
    localStorage.setItem(`${SQLITE_STORAGE_PREFIX}payrolls`, JSON.stringify(initialPayrolls));
    localStorage.setItem(`${SQLITE_STORAGE_PREFIX}announcements`, JSON.stringify(initialAnnouncements));
  },

  // Export full SQL dump
  exportSQLDump(): string {
    const stats = this.getStats();
    const emps = readTable<Employee>("employees", initialEmployees);
    const atts = readTable<AttendanceRecord>("attendances", initialAttendances);

    let sql = `-- =========================================================================\n`;
    sql += `-- MRHANDS LAB APP DEMO - SQLITE DUMP EXPORT\n`;
    sql += `-- Export Date: ${stats.lastSynced}\n`;
    sql += `-- Total Employees: ${stats.tables.employees}\n`;
    sql += `-- =========================================================================\n\n`;
    sql += SQLITE_SCHEMA_DDL;
    sql += `\n-- Seed Employees\n`;
    emps.forEach((e) => {
      sql += `INSERT INTO employees VALUES ('${e.id}', '${e.nip}', '${e.name.replace(/'/g, "''")}', '${e.email}', '${e.phone}', '${e.role}', '123456', '${e.division}', '${e.position}', '${e.employment_type}', '${e.status}', '${e.join_date}', ${e.salary}, ${e.remaining_leave}, '${e.bank_name}', '${e.bank_account}', '${e.education || ""}', '${e.address || ""}', '${e.avatar_url || ""}', CURRENT_TIMESTAMP);\n`;
    });
    sql += `\n-- Seed Attendances\n`;
    atts.forEach((a) => {
      sql += `INSERT INTO attendances VALUES ('${a.id}', '${a.employee_id}', '${a.date}', ${a.check_in ? `'${a.check_in}'` : "NULL"}, ${a.check_out ? `'${a.check_out}'` : "NULL"}, '${a.status}', '${(a.notes || "").replace(/'/g, "''")}', 'Kantor Pusat', CURRENT_TIMESTAMP);\n`;
    });
    return sql;
  },

  // Employees Table Operations
  employees: {
    select(): Employee[] {
      return readTable<Employee>("employees", initialEmployees);
    },
    findById(id: string): Employee | null {
      const list = this.select();
      return list.find((e) => e.id === id || e.nip === id) || null;
    },
    insert(emp: Omit<Employee, "id">): Employee {
      const list = this.select();
      const created: Employee = {
        ...emp,
        id: `emp-sqlite-${Date.now()}`,
      };
      writeTable("employees", [created, ...list]);
      return created;
    },
    update(id: string, patch: Partial<Employee>): Employee {
      const list = this.select();
      const index = list.findIndex((e) => e.id === id || e.nip === id);
      if (index === -1) throw new Error("Karyawan tidak ditemukan di SQLite");
      list[index] = { ...list[index], ...patch };
      writeTable("employees", list);
      return list[index];
    },
  },

  // Attendances Table Operations
  attendances: {
    select(): AttendanceRecord[] {
      return readTable<AttendanceRecord>("attendances", initialAttendances);
    },
    record(employeeId: string, type: "check_in" | "check_out"): AttendanceRecord {
      const list = this.select();
      const emps = sqliteDB.employees.select();
      const emp = emps.find((e) => e.id === employeeId || e.nip === employeeId);

      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
      const dateStr = now.toISOString().split("T")[0];

      let rec = list.find(
        (a) => (a.employee_id === emp?.id || a.nip === emp?.nip) && a.date === dateStr
      );

      if (rec) {
        if (type === "check_out") {
          rec.check_out = timeStr;
        } else {
          rec.check_in = timeStr;
        }
      } else {
        rec = {
          id: `att-sqlite-${Date.now()}`,
          employee_id: emp?.id || "emp-temp",
          employee_name: emp?.name || "Pegawai",
          nip: emp?.nip || "-",
          division: emp?.division || "-",
          date: dateStr,
          check_in: type === "check_in" ? timeStr : null,
          check_out: type === "check_out" ? timeStr : null,
          status: now.getHours() >= 8 && now.getMinutes() > 15 ? "Terlambat" : "Hadir",
          notes: "Presensi Mandiri via SQLite DB",
        };
        list.unshift(rec);
      }
      writeTable("attendances", list);
      return rec;
    },
  },

  // Leave Requests Table Operations
  leaves: {
    select(): LeaveRequest[] {
      return readTable<LeaveRequest>("leave_requests", initialLeaveRequests);
    },
    insert(req: Omit<LeaveRequest, "id" | "status" | "submitted_at">): LeaveRequest {
      const list = this.select();
      const created: LeaveRequest = {
        ...req,
        id: `leave-sqlite-${Date.now()}`,
        status: "Menunggu Persetujuan",
        submitted_at: new Date().toISOString().split("T")[0],
      };
      writeTable("leave_requests", [created, ...list]);
      return created;
    },
    review(id: string, status: "Disetujui" | "Ditolak", reviewer: string): LeaveRequest {
      const list = this.select();
      const index = list.findIndex((l) => l.id === id);
      if (index === -1) throw new Error("Pengajuan cuti tidak ditemukan di SQLite");
      list[index] = {
        ...list[index],
        status,
        reviewed_at: new Date().toISOString().split("T")[0],
        reviewed_by: reviewer,
      };
      writeTable("leave_requests", list);
      return list[index];
    },
  },

  // Payrolls Table Operations
  payrolls: {
    select(): PayrollRecord[] {
      return readTable<PayrollRecord>("payrolls", initialPayrolls);
    },
  },

  // Announcements Table Operations
  announcements: {
    select(): Announcement[] {
      return readTable<Announcement>("announcements", initialAnnouncements);
    },
    insert(ann: Omit<Announcement, "id" | "published_at">): Announcement {
      const list = this.select();
      const created: Announcement = {
        ...ann,
        id: `ann-sqlite-${Date.now()}`,
        published_at: new Date().toISOString().split("T")[0],
      };
      writeTable("announcements", [created, ...list]);
      return created;
    },
  },
};
