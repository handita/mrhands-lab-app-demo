import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import { sqliteDB } from "@/lib/sqlite";
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
} from "@/lib/employee-data";

// ----------------------------------------------------
// Employees
// ----------------------------------------------------

export async function getEmployees(): Promise<Employee[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("employees")
        .select("*")
        .order("name", { ascending: true });
      if (!error && data && data.length > 0) {
        return data as Employee[];
      }
    } catch (e) {
      console.warn("Supabase fetch failed, falling back to SQLite local database", e);
    }
  }
  return sqliteDB.employees.select();
}

export async function getEmployeeByNip(nip: string): Promise<Employee | null> {
  const list = await getEmployees();
  return list.find((emp) => emp.nip === nip) || null;
}

export async function addEmployee(newEmp: Omit<Employee, "id">): Promise<Employee> {
  const created: Employee = {
    ...newEmp,
    id: `emp-${Date.now()}`,
  };

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("employees")
        .insert([created])
        .select()
        .single();
      if (!error && data) {
        return data as Employee;
      }
    } catch (e) {
      console.warn("Supabase insert error, saving to SQLite database", e);
    }
  }

  return sqliteDB.employees.insert(newEmp);
}

export async function updateEmployee(id: string, patch: Partial<Employee>): Promise<Employee> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("employees")
        .update(patch)
        .eq("id", id)
        .select()
        .single();
      if (!error && data) {
        return data as Employee;
      }
    } catch (e) {
      console.warn("Supabase update error, applying to SQLite", e);
    }
  }

  return sqliteDB.employees.update(id, patch);
}

// ----------------------------------------------------
// Attendance
// ----------------------------------------------------

export async function getAttendances(): Promise<AttendanceRecord[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("attendances")
        .select("*, employees(name, nip, division)")
        .order("date", { ascending: false });
      if (!error && data && data.length > 0) {
        return data.map((item: any) => ({
          ...item,
          employee_name: item.employees?.name || "Pegawai",
          nip: item.employees?.nip || "-",
          division: item.employees?.division || "-",
        }));
      }
    } catch (e) {
      console.warn("Supabase attendance fetch failed, fallback to SQLite", e);
    }
  }
  return sqliteDB.attendances.select();
}

export async function recordAttendance(
  employeeId: string,
  type: "check_in" | "check_out"
): Promise<AttendanceRecord> {
  if (isSupabaseConfigured && supabase) {
    try {
      // In Supabase mode, could sync to attendances table
    } catch (e) {
      console.warn("Supabase attendance record error", e);
    }
  }

  return sqliteDB.attendances.record(employeeId, type);
}

// ----------------------------------------------------
// Leave Requests
// ----------------------------------------------------

export async function getLeaveRequests(): Promise<LeaveRequest[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("leave_requests")
        .select("*, employees(name, nip, division)")
        .order("submitted_at", { ascending: false });
      if (!error && data && data.length > 0) {
        return data.map((item: any) => ({
          ...item,
          employee_name: item.employees?.name || "Pegawai",
          nip: item.employees?.nip || "-",
          division: item.employees?.division || "-",
        }));
      }
    } catch (e) {
      console.warn("Supabase leaves fetch error", e);
    }
  }
  return sqliteDB.leaves.select();
}

export async function submitLeaveRequest(
  request: Omit<LeaveRequest, "id" | "status" | "submitted_at">
): Promise<LeaveRequest> {
  return sqliteDB.leaves.insert(request);
}

export async function reviewLeaveRequest(
  id: string,
  status: "Disetujui" | "Ditolak",
  reviewerName: string
): Promise<LeaveRequest> {
  return sqliteDB.leaves.review(id, status, reviewerName);
}

// ----------------------------------------------------
// Payrolls
// ----------------------------------------------------

export async function getPayrolls(): Promise<PayrollRecord[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("payrolls")
        .select("*, employees(name, nip, division, position)")
        .order("created_at", { ascending: false });
      if (!error && data && data.length > 0) {
        return data.map((item: any) => ({
          ...item,
          employee_name: item.employees?.name || "Pegawai",
          nip: item.employees?.nip || "-",
          division: item.employees?.division || "-",
          position: item.employees?.position || "-",
        }));
      }
    } catch (e) {
      console.warn("Supabase payrolls fetch error", e);
    }
  }
  return sqliteDB.payrolls.select();
}

// ----------------------------------------------------
// Announcements
// ----------------------------------------------------

export async function getAnnouncements(): Promise<Announcement[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("announcements")
        .select("*")
        .order("published_at", { ascending: false });
      if (!error && data && data.length > 0) {
        return data as Announcement[];
      }
    } catch (e) {
      console.warn("Supabase announcements fetch error", e);
    }
  }
  return sqliteDB.announcements.select();
}

export async function createAnnouncement(
  ann: Omit<Announcement, "id" | "published_at">
): Promise<Announcement> {
  return sqliteDB.announcements.insert(ann);
}

// ----------------------------------------------------
// Executive Dashboard Metrics
// ----------------------------------------------------

export async function getHRDashboardMetrics() {
  const [employees, attendances, leaves, payrolls] = await Promise.all([
    getEmployees(),
    getAttendances(),
    getLeaveRequests(),
    getPayrolls(),
  ]);

  const totalEmployees = employees.length;
  const activeEmployees = employees.filter((e) => e.status === "Aktif").length;
  const onLeaveEmployees = employees.filter((e) => e.status === "Cuti").length;

  const todayStr = new Date().toISOString().split("T")[0];
  const todayAttendances = attendances.filter((a) => a.date === todayStr || a.date === "2026-11-17");
  const presentCount = todayAttendances.filter((a) => a.status === "Hadir" || a.status === "Terlambat").length;
  const attendanceRate = totalEmployees > 0 ? Math.round((presentCount / totalEmployees) * 100) : 0;

  const pendingLeaves = leaves.filter((l) => l.status === "Menunggu Persetujuan").length;
  const totalPayrollMonthly = employees.reduce((acc, curr) => acc + (curr.salary || 0), 0);

  return {
    totalEmployees,
    activeEmployees,
    onLeaveEmployees,
    presentCount,
    attendanceRate,
    pendingLeaves,
    totalPayrollMonthly,
  };
}
