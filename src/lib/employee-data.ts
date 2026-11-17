// Employee Starter Kit - Types, Mock Data & Helpers for HR Portal

export type EmployeeRole = "admin" | "member";
export type EmploymentStatus = "Tetap" | "Kontrak" | "Probasi" | "Magang";
export type EmployeeState = "Aktif" | "Cuti" | "Nonaktif";
export type LeaveType = "Tahunan" | "Sakit" | "Melahirkan" | "Khusus / Alasan Penting";
export type LeaveStatus = "Menunggu Persetujuan" | "Disetujui" | "Ditolak";
export type AttendanceStatus = "Hadir" | "Terlambat" | "Izin" | "Sakit" | "Cuti" | "Alpa";

export interface Employee {
  id: string;
  nip: string;
  name: string;
  email: string;
  phone: string;
  role: EmployeeRole;
  division: string;
  position: string;
  employment_type: EmploymentStatus;
  status: EmployeeState;
  join_date: string;
  salary: number;
  remaining_leave: number;
  bank_name: string;
  bank_account: string;
  avatar_url?: string;
  education?: string;
  address?: string;
}

export interface AttendanceRecord {
  id: string;
  employee_id: string;
  employee_name: string;
  nip: string;
  division: string;
  date: string;
  check_in: string | null;
  check_out: string | null;
  status: AttendanceStatus;
  notes?: string;
}

export interface LeaveRequest {
  id: string;
  employee_id: string;
  employee_name: string;
  nip: string;
  division: string;
  leave_type: LeaveType;
  start_date: string;
  end_date: string;
  total_days: number;
  reason: string;
  status: LeaveStatus;
  submitted_at: string;
  reviewed_at?: string;
  reviewed_by?: string;
}

export interface PayrollRecord {
  id: string;
  employee_id: string;
  employee_name: string;
  nip: string;
  division: string;
  position: string;
  period: string; // e.g. "Maret 2026"
  basic_salary: number;
  allowance_transport: number;
  allowance_meal: number;
  allowance_position: number;
  bonus: number;
  deduction_bpjs: number;
  deduction_tax: number;
  net_salary: number;
  status: "Lunas" | "Proses";
  paid_at?: string;
}

export interface Announcement {
  id: string;
  title: string;
  category: "Pemberitahuan" | "Kebijakan" | "Acara" | "Penting";
  content: string;
  published_at: string;
  author: string;
  is_pinned?: boolean;
}

// ----------------------------------------------------
// Formatter Helpers
// ----------------------------------------------------

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

export function getStatusBadgeVariant(
  status: EmployeeState | LeaveStatus | AttendanceStatus
): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case "Aktif":
    case "Disetujui":
    case "Hadir":
      return "default";
    case "Cuti":
    case "Menunggu Persetujuan":
    case "Izin":
      return "secondary";
    case "Nonaktif":
    case "Ditolak":
    case "Alpa":
      return "destructive";
    default:
      return "outline";
  }
}

// ----------------------------------------------------
// Mock Demo Dataset (Indonesian Enterprise Standard)
// ----------------------------------------------------

export const initialEmployees: Employee[] = [
  {
    id: "emp-001",
    nip: "198801012010121001",
    name: "Dr. Hendra Gunawan, S.Kom., M.M.",
    email: "hendra.gunawan@perusahaan.co.id",
    phone: "081234567890",
    role: "admin",
    division: "Sumber Daya Manusia (SDM)",
    position: "Kepala Divisi SDM & Operasional",
    employment_type: "Tetap",
    status: "Aktif",
    join_date: "2015-03-01",
    salary: 28500000,
    remaining_leave: 10,
    bank_name: "Bank Mandiri",
    bank_account: "1230009876543",
    education: "S3 Manajemen Sumber Daya Manusia - UI",
    address: "Jl. Veteran No. 45, Jakarta Pusat",
  },
  {
    id: "emp-002",
    nip: "199003152015021002",
    name: "Budi Santoso, S.Kom.",
    email: "budi.santoso@perusahaan.co.id",
    phone: "081398765432",
    role: "member",
    division: "Teknologi Informasi",
    position: "Lead Frontend Engineer",
    employment_type: "Tetap",
    status: "Aktif",
    join_date: "2018-06-15",
    salary: 19500000,
    remaining_leave: 9,
    bank_name: "BCA",
    bank_account: "5430098765",
    education: "S1 Teknik Informatika - ITB",
    address: "Taman Sentosa Blok B3 No. 12, Bekasi",
  },
  {
    id: "emp-003",
    nip: "199208202017012003",
    name: "Siti Rahmawati, S.E.",
    email: "siti.rahmawati@perusahaan.co.id",
    phone: "081578912345",
    role: "member",
    division: "Keuangan & Akuntansi",
    position: "Senior Financial Analyst",
    employment_type: "Tetap",
    status: "Aktif",
    join_date: "2019-01-10",
    salary: 16500000,
    remaining_leave: 11,
    bank_name: "Bank BNI",
    bank_account: "0987123456",
    education: "S1 Akuntansi - Universitas Airlangga",
    address: "Jl. Margonda Raya No. 88, Depok",
  },
  {
    id: "emp-004",
    nip: "199405102018031004",
    name: "Ahmad Fauzi, S.T.",
    email: "ahmad.fauzi@perusahaan.co.id",
    phone: "082165439876",
    role: "member",
    division: "Teknologi Informasi",
    position: "DevOps & Cloud Specialist",
    employment_type: "Tetap",
    status: "Aktif",
    join_date: "2020-04-01",
    salary: 17500000,
    remaining_leave: 7,
    bank_name: "BCA",
    bank_account: "7890123456",
    education: "S1 Teknik Komputer - ITS Surabaya",
    address: "Cluster Harmoni No. 19, Tangerang Selatan",
  },
  {
    id: "emp-005",
    nip: "199511122019042005",
    name: "Dewi Lestari, S.I.Kom.",
    email: "dewi.lestari@perusahaan.co.id",
    phone: "081823456781",
    role: "member",
    division: "Pemasaran & Komunikasi",
    position: "Corporate Communication Specialist",
    employment_type: "Tetap",
    status: "Aktif",
    join_date: "2021-02-15",
    salary: 14000000,
    remaining_leave: 12,
    bank_name: "Bank BRI",
    bank_account: "012301098765432",
    education: "S1 Ilmu Komunikasi - Universitas Padjadjaran",
    address: "Jl. Tebet Barat Raya No. 15, Jakarta Selatan",
  },
  {
    id: "emp-006",
    nip: "199602282020051006",
    name: "Rian Hidayat, S.Ds.",
    email: "rian.hidayat@perusahaan.co.id",
    phone: "081912345678",
    role: "member",
    division: "Teknologi Informasi",
    position: "UI/UX Product Designer",
    employment_type: "Kontrak",
    status: "Aktif",
    join_date: "2022-08-01",
    salary: 13500000,
    remaining_leave: 8,
    bank_name: "Bank Mandiri",
    bank_account: "1560007894561",
    education: "S1 Desain Komunikasi Visual - ISI Yogyakarta",
    address: "Jl. Anggrek Cendrawasih No. 2, Palmerah, Jakarta",
  },
  {
    id: "emp-007",
    nip: "199307142017082007",
    name: "Nurul Aini, S.Psi.",
    email: "nurul.aini@perusahaan.co.id",
    phone: "081298761234",
    role: "admin",
    division: "Sumber Daya Manusia (SDM)",
    position: "Talent Acquisition & People Development Lead",
    employment_type: "Tetap",
    status: "Aktif",
    join_date: "2019-09-01",
    salary: 16000000,
    remaining_leave: 6,
    bank_name: "BCA",
    bank_account: "8899112233",
    education: "S1 Psikologi - Universitas Gadjah Mada",
    address: "Jl. Radio Dalam No. 10B, Jakarta Selatan",
  },
  {
    id: "emp-008",
    nip: "199709052021061008",
    name: "Eko Prasetyo, S.Tr.Kom.",
    email: "eko.prasetyo@perusahaan.co.id",
    phone: "085612347890",
    role: "member",
    division: "Operasional",
    position: "Database & IT Support Engineer",
    employment_type: "Kontrak",
    status: "Aktif",
    join_date: "2023-01-15",
    salary: 11500000,
    remaining_leave: 12,
    bank_name: "Bank BNI",
    bank_account: "0456123789",
    education: "D4 Teknik Elektronika Telekomunikasi - PENS",
    address: "Perumahan Griya Asri Blok D5, Depok",
  },
  {
    id: "emp-009",
    nip: "199812222022072009",
    name: "Putri Anggraini, S.M.",
    email: "putri.anggraini@perusahaan.co.id",
    phone: "087712398456",
    role: "member",
    division: "Layanan Pelanggan",
    position: "Customer Experience Team Lead",
    employment_type: "Tetap",
    status: "Cuti",
    join_date: "2022-03-01",
    salary: 12500000,
    remaining_leave: 3,
    bank_name: "Bank Mandiri",
    bank_account: "1250098712345",
    education: "S1 Manajemen Bisnis - Telkom University",
    address: "Komplek Duren Sawit Indah Blok F1, Jakarta Timur",
  },
  {
    id: "emp-010",
    nip: "200004182023081010",
    name: "Dimas Arya Pratama",
    email: "dimas.arya@perusahaan.co.id",
    phone: "089612345678",
    role: "member",
    division: "Teknologi Informasi",
    position: "Junior Backend Developer",
    employment_type: "Probasi",
    status: "Aktif",
    join_date: "2026-01-05",
    salary: 8500000,
    remaining_leave: 12,
    bank_name: "BCA",
    bank_account: "6040123987",
    education: "S1 Sistem Informasi - Universitas Indonesia",
    address: "Kukusan Raya No. 40, Beji, Depok",
  },
];

export const initialAttendances: AttendanceRecord[] = [
  {
    id: "att-001",
    employee_id: "emp-001",
    employee_name: "Dr. Hendra Gunawan, S.Kom., M.M.",
    nip: "198801012010121001",
    division: "Sumber Daya Manusia (SDM)",
    date: "2026-11-17",
    check_in: "07:45",
    check_out: null,
    status: "Hadir",
    notes: "Tepat Waktu (WFO Pusat)",
  },
  {
    id: "att-002",
    employee_id: "emp-002",
    employee_name: "Budi Santoso, S.Kom.",
    nip: "199003152015021002",
    division: "Teknologi Informasi",
    date: "2026-11-17",
    check_in: "07:58",
    check_out: null,
    status: "Hadir",
    notes: "Tepat Waktu (Hybrid WFO)",
  },
  {
    id: "att-003",
    employee_id: "emp-003",
    employee_name: "Siti Rahmawati, S.E.",
    nip: "199208202017012003",
    division: "Keuangan & Akuntansi",
    date: "2026-11-17",
    check_in: "08:14",
    check_out: null,
    status: "Terlambat",
    notes: "Terlambat 14 Menit (Kemacetan Tol)",
  },
  {
    id: "att-004",
    employee_id: "emp-004",
    employee_name: "Ahmad Fauzi, S.T.",
    nip: "199405102018031004",
    division: "Teknologi Informasi",
    date: "2026-11-17",
    check_in: "07:50",
    check_out: null,
    status: "Hadir",
    notes: "Tepat Waktu",
  },
  {
    id: "att-005",
    employee_id: "emp-005",
    employee_name: "Dewi Lestari, S.I.Kom.",
    nip: "199511122019042005",
    division: "Pemasaran & Komunikasi",
    date: "2026-11-17",
    check_in: "07:55",
    check_out: null,
    status: "Hadir",
    notes: "Tepat Waktu",
  },
  {
    id: "att-006",
    employee_id: "emp-006",
    employee_name: "Rian Hidayat, S.Ds.",
    nip: "199602282020051006",
    division: "Teknologi Informasi",
    date: "2026-11-17",
    check_in: "08:05",
    check_out: null,
    status: "Terlambat",
    notes: "Terlambat 5 Menit",
  },
  {
    id: "att-007",
    employee_id: "emp-007",
    employee_name: "Nurul Aini, S.Psi.",
    nip: "199307142017082007",
    division: "Sumber Daya Manusia (SDM)",
    date: "2026-11-17",
    check_in: "07:40",
    check_out: null,
    status: "Hadir",
    notes: "Tepat Waktu",
  },
  {
    id: "att-008",
    employee_id: "emp-008",
    employee_name: "Eko Prasetyo, S.Tr.Kom.",
    nip: "199709052021061008",
    division: "Operasional",
    date: "2026-11-17",
    check_in: null,
    check_out: null,
    status: "Izin",
    notes: "Izin Dinas Luar (Maintenance Data Center)",
  },
  {
    id: "att-009",
    employee_id: "emp-009",
    employee_name: "Putri Anggraini, S.M.",
    nip: "199812222022072009",
    division: "Layanan Pelanggan",
    date: "2026-11-17",
    check_in: null,
    check_out: null,
    status: "Cuti",
    notes: "Cuti Tahunan (Disetujui)",
  },
  {
    id: "att-010",
    employee_id: "emp-010",
    employee_name: "Dimas Arya Pratama",
    nip: "200004182023081010",
    division: "Teknologi Informasi",
    date: "2026-11-17",
    check_in: "07:49",
    check_out: null,
    status: "Hadir",
    notes: "Tepat Waktu",
  },
];

export const initialLeaveRequests: LeaveRequest[] = [
  {
    id: "leave-101",
    employee_id: "emp-009",
    employee_name: "Putri Anggraini, S.M.",
    nip: "199812222022072009",
    division: "Layanan Pelanggan",
    leave_type: "Tahunan",
    start_date: "2026-11-16",
    end_date: "2026-11-18",
    total_days: 3,
    reason: "Keperluan keluarga di luar kota",
    status: "Disetujui",
    submitted_at: "2026-11-10",
    reviewed_at: "2026-11-11",
    reviewed_by: "Dr. Hendra Gunawan, S.Kom., M.M.",
  },
  {
    id: "leave-102",
    employee_id: "emp-002",
    employee_name: "Budi Santoso, S.Kom.",
    nip: "199003152015021002",
    division: "Teknologi Informasi",
    leave_type: "Tahunan",
    start_date: "2026-11-24",
    end_date: "2026-11-25",
    total_days: 2,
    reason: "Menghadiri wisuda adik kandung",
    status: "Menunggu Persetujuan",
    submitted_at: "2026-11-15",
  },
  {
    id: "leave-103",
    employee_id: "emp-006",
    employee_name: "Rian Hidayat, S.Ds.",
    nip: "199602282020051006",
    division: "Teknologi Informasi",
    leave_type: "Khusus / Alasan Penting",
    start_date: "2026-12-01",
    end_date: "2026-12-03",
    total_days: 3,
    reason: "Pernikahan saudara kandung",
    status: "Menunggu Persetujuan",
    submitted_at: "2026-11-16",
  },
  {
    id: "leave-104",
    employee_id: "emp-003",
    employee_name: "Siti Rahmawati, S.E.",
    nip: "199208202017012003",
    division: "Keuangan & Akuntansi",
    leave_type: "Sakit",
    start_date: "2026-10-20",
    end_date: "2026-10-21",
    total_days: 2,
    reason: "Rawat jalan typhus disertai surat dokter RS Hermina",
    status: "Disetujui",
    submitted_at: "2026-10-20",
    reviewed_at: "2026-10-20",
    reviewed_by: "Nurul Aini, S.Psi.",
  },
  {
    id: "leave-105",
    employee_id: "emp-004",
    employee_name: "Ahmad Fauzi, S.T.",
    nip: "199405102018031004",
    division: "Teknologi Informasi",
    leave_type: "Tahunan",
    start_date: "2026-09-10",
    end_date: "2026-09-12",
    total_days: 3,
    reason: "Liburan tahunan keluarga",
    status: "Disetujui",
    submitted_at: "2026-09-01",
    reviewed_at: "2026-09-02",
    reviewed_by: "Dr. Hendra Gunawan, S.Kom., M.M.",
  },
];

export const initialPayrolls: PayrollRecord[] = [
  {
    id: "pay-2026-10-001",
    employee_id: "emp-001",
    employee_name: "Dr. Hendra Gunawan, S.Kom., M.M.",
    nip: "198801012010121001",
    division: "Sumber Daya Manusia (SDM)",
    position: "Kepala Divisi SDM & Operasional",
    period: "Oktober 2026",
    basic_salary: 22000000,
    allowance_position: 4500000,
    allowance_transport: 1200000,
    allowance_meal: 800000,
    bonus: 2000000,
    deduction_bpjs: 850000,
    deduction_tax: 1150000,
    net_salary: 28500000,
    status: "Lunas",
    paid_at: "2026-10-25",
  },
  {
    id: "pay-2026-10-002",
    employee_id: "emp-002",
    employee_name: "Budi Santoso, S.Kom.",
    nip: "199003152015021002",
    division: "Teknologi Informasi",
    position: "Lead Frontend Engineer",
    period: "Oktober 2026",
    basic_salary: 15000000,
    allowance_position: 2500000,
    allowance_transport: 1200000,
    allowance_meal: 800000,
    bonus: 1000000,
    deduction_bpjs: 450000,
    deduction_tax: 550000,
    net_salary: 19500000,
    status: "Lunas",
    paid_at: "2026-10-25",
  },
  {
    id: "pay-2026-10-003",
    employee_id: "emp-003",
    employee_name: "Siti Rahmawati, S.E.",
    nip: "199208202017012003",
    division: "Keuangan & Akuntansi",
    position: "Senior Financial Analyst",
    period: "Oktober 2026",
    basic_salary: 13000000,
    allowance_position: 1800000,
    allowance_transport: 1100000,
    allowance_meal: 750000,
    bonus: 500000,
    deduction_bpjs: 350000,
    deduction_tax: 300000,
    net_salary: 16500000,
    status: "Lunas",
    paid_at: "2026-10-25",
  },
  {
    id: "pay-2026-10-004",
    employee_id: "emp-004",
    employee_name: "Ahmad Fauzi, S.T.",
    nip: "199405102018031004",
    division: "Teknologi Informasi",
    position: "DevOps & Cloud Specialist",
    period: "Oktober 2026",
    basic_salary: 14000000,
    allowance_position: 1800000,
    allowance_transport: 1100000,
    allowance_meal: 750000,
    bonus: 500000,
    deduction_bpjs: 350000,
    deduction_tax: 300000,
    net_salary: 17500000,
    status: "Lunas",
    paid_at: "2026-10-25",
  },
];

export const initialAnnouncements: Announcement[] = [
  {
    id: "ann-01",
    title: "Kebijakan Kerja Hybrid & Penyesuaian Jam Presensi Q4 2026",
    category: "Kebijakan",
    content:
      "Mulai 1 November 2026, seluruh divisi menerapkan fleksibilitas kerja 3 hari WFO dan 2 hari WFH dengan persetujuan kepala unit masing-masing. Presensi wajib dilakukan maksimal pukul 08.00 WIB.",
    published_at: "2026-11-01",
    author: "Divisi SDM & Operasional",
    is_pinned: true,
  },
  {
    id: "ann-02",
    title: "Sosialisasi Evaluasi Kinerja Semester II dan Pengajuan Bonus Tahunan",
    category: "Penting",
    content:
      "Diberitahukan kepada seluruh pegawai bahwa periode self-assessment KPI Semester II dibuka sampai dengan tanggal 30 November 2026. Mohon melengkapi sasaran kerja sebelum tenggat waktu.",
    published_at: "2026-11-10",
    author: "Talent Management Office",
    is_pinned: true,
  },
  {
    id: "ann-03",
    title: "Program Medical Check-Up (MCU) Tahunan Pegawai",
    category: "Acara",
    content:
      "Pemeriksaan kesehatan berkala gratis bagi seluruh pegawai tetap dan kontrak akan dilaksanakan tanggal 25-27 November 2026 di Klinik Sejahtera Pratama. Pendaftaran dibuka melalui portal SDM.",
    published_at: "2026-11-12",
    author: "Komite K3 & Kesejahteraan Pegawai",
    is_pinned: false,
  },
];

// ----------------------------------------------------
// Chart Analytics Mock Data (Ready for Recharts)
// ----------------------------------------------------

export const divisionChartData = [
  { division: "Teknologi Info", total: 4, fulltime: 3, contract: 1 },
  { division: "SDM & Umum", total: 2, fulltime: 2, contract: 0 },
  { division: "Keuangan", total: 1, fulltime: 1, contract: 0 },
  { division: "Pemasaran", total: 1, fulltime: 1, contract: 0 },
  { division: "Operasional", total: 1, fulltime: 0, contract: 1 },
  { division: "Layanan CS", total: 1, fulltime: 1, contract: 0 },
];

export const attendanceTrendData = [
  { month: "Jun", kehadiran: 96, terlambat: 3, cuti: 1 },
  { month: "Jul", kehadiran: 97, terlambat: 2, cuti: 1 },
  { month: "Agt", kehadiran: 94, terlambat: 4, cuti: 2 },
  { month: "Sep", kehadiran: 98, terlambat: 1, cuti: 1 },
  { month: "Okt", kehadiran: 95, terlambat: 3, cuti: 2 },
  { month: "Nov", kehadiran: 96, terlambat: 2, cuti: 2 },
];

export const employmentTypeData = [
  { name: "Tetap (PKWTT)", value: 7, fill: "var(--color-chart-1)" },
  { name: "Kontrak (PKWT)", value: 2, fill: "var(--color-chart-2)" },
  { name: "Probasi / Magang", value: 1, fill: "var(--color-chart-3)" },
];

export const performanceRatingData = [
  { rating: "Sangat Baik (A)", count: 4 },
  { rating: "Baik (B+)", count: 4 },
  { rating: "Cukup (B)", count: 2 },
  { rating: "Perlu Evaluasi", count: 0 },
];

export const payrollExpenseData = [
  { division: "Teknologi Informasi", totalGaji: 59000000 },
  { division: "SDM & Operasional", totalGaji: 44500000 },
  { division: "Keuangan & Akuntansi", totalGaji: 16500000 },
  { division: "Pemasaran", totalGaji: 14000000 },
  { division: "Layanan Pelanggan", totalGaji: 12500000 },
];
