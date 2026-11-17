-- =========================================================================
-- MRHANDS LAB APP DEMO - SQLITE 3 DATABASE SCHEMA & SEED
-- Mode 1: SQLite Zero-Config Local Database
-- =========================================================================

-- 1. Employees Table
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

-- 2. Attendances Table
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

-- 3. Leave Requests Table
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

-- 4. Payrolls Table
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

-- 5. Announcements Table
CREATE TABLE IF NOT EXISTS announcements (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT DEFAULT 'Pemberitahuan',
    content TEXT NOT NULL,
    author TEXT NOT NULL,
    is_pinned INTEGER DEFAULT 0,
    published_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- -------------------------------------------------------------------------
-- SEED DATA (10 Karyawan Realistis Standar Indonesia)
-- -------------------------------------------------------------------------

INSERT OR IGNORE INTO employees VALUES
('emp-001', '198801012010121001', 'Dr. Hendra Gunawan, S.Kom., M.M.', 'hendra.gunawan@mrhands.id', '081234567890', 'admin', '000000', 'Sumber Daya Manusia (SDM)', 'Kepala Divisi SDM & Operasional', 'Tetap', 'Aktif', '2015-03-01', 28500000, 10, 'Bank Mandiri', '1230009876543', 'S3 Manajemen SDM - UI', 'Jl. Veteran No. 45, Jakarta Pusat', NULL, CURRENT_TIMESTAMP),
('emp-002', '199003152015021002', 'Budi Santoso, S.Kom.', 'budi.santoso@mrhands.id', '081398765432', 'member', '123456', 'Teknologi Informasi', 'Lead Frontend Engineer', 'Tetap', 'Aktif', '2018-06-15', 19500000, 9, 'BCA', '5430098765', 'S1 Teknik Informatika - ITB', 'Taman Sentosa Blok B3 No. 12, Bekasi', NULL, CURRENT_TIMESTAMP),
('emp-003', '199208202017012003', 'Siti Rahmawati, S.E.', 'siti.rahmawati@mrhands.id', '081578912345', 'member', '123456', 'Keuangan & Akuntansi', 'Senior Financial Analyst', 'Tetap', 'Aktif', '2019-01-10', 16500000, 11, 'Bank BNI', '0987123456', 'S1 Akuntansi - UNAIR', 'Jl. Margonda Raya No. 88, Depok', NULL, CURRENT_TIMESTAMP),
('emp-004', '199405102018031004', 'Ahmad Fauzi, S.T.', 'ahmad.fauzi@mrhands.id', '082165439876', 'member', '123456', 'Teknologi Informasi', 'DevOps & Cloud Specialist', 'Tetap', 'Aktif', '2020-04-01', 17500000, 7, 'BCA', '7890123456', 'S1 Teknik Komputer - ITS', 'Cluster Harmoni No. 19, Tangerang Selatan', NULL, CURRENT_TIMESTAMP),
('emp-005', '199511122019042005', 'Dewi Lestari, S.I.Kom.', 'dewi.lestari@mrhands.id', '081823456781', 'member', '123456', 'Pemasaran & Komunikasi', 'Corporate Communication Specialist', 'Tetap', 'Aktif', '2021-02-15', 14000000, 12, 'Bank BRI', '012301098765432', 'S1 Ilmu Komunikasi - UNPAD', 'Jl. Tebet Barat Raya No. 15, Jakarta Selatan', NULL, CURRENT_TIMESTAMP),
('emp-006', '199602282020051006', 'Rian Hidayat, S.Ds.', 'rian.hidayat@mrhands.id', '081912345678', 'member', '123456', 'Teknologi Informasi', 'UI/UX Product Designer', 'Kontrak', 'Aktif', '2022-08-01', 13500000, 8, 'Bank Mandiri', '1560007894561', 'S1 DKV - ISI Yogyakarta', 'Jl. Anggrek Cendrawasih No. 2, Jakarta', NULL, CURRENT_TIMESTAMP),
('emp-007', '199307142017082007', 'Nurul Aini, S.Psi.', 'nurul.aini@mrhands.id', '081298761234', 'admin', '000000', 'Sumber Daya Manusia (SDM)', 'Talent Acquisition Lead', 'Tetap', 'Aktif', '2019-09-01', 16000000, 6, 'BCA', '8899112233', 'S1 Psikologi - UGM', 'Jl. Radio Dalam No. 10B, Jakarta Selatan', NULL, CURRENT_TIMESTAMP),
('emp-008', '199709052021061008', 'Eko Prasetyo, S.Tr.Kom.', 'eko.prasetyo@mrhands.id', '085612347890', 'member', '123456', 'Operasional', 'Database & Support Engineer', 'Kontrak', 'Aktif', '2023-01-15', 11500000, 12, 'Bank BNI', '0456123789', 'D4 Teknik Telekomunikasi - PENS', 'Perumahan Griya Asri Blok D5, Depok', NULL, CURRENT_TIMESTAMP),
('emp-009', '199812222022072009', 'Putri Anggraini, S.M.', 'putri.anggraini@mrhands.id', '087712398456', 'member', '123456', 'Layanan Pelanggan', 'Customer Experience Team Lead', 'Tetap', 'Cuti', '2022-03-01', 12500000, 3, 'Bank Mandiri', '1250098712345', 'S1 Manajemen - Telkom Univ', 'Komplek Duren Sawit Indah Blok F1, Jakarta', NULL, CURRENT_TIMESTAMP),
('emp-010', '200004182023081010', 'Dimas Arya Pratama', 'dimas.arya@mrhands.id', '089612345678', 'member', '123456', 'Teknologi Informasi', 'Junior Backend Developer', 'Probasi', 'Aktif', '2026-01-05', 8500000, 12, 'BCA', '6040123987', 'S1 Sistem Informasi - UI', 'Kukusan Raya No. 40, Beji, Depok', NULL, CURRENT_TIMESTAMP);

INSERT OR IGNORE INTO attendances VALUES
('att-001', 'emp-001', CURRENT_DATE, '07:45', NULL, 'Hadir', 'Tepat Waktu (WFO Kantor Pusat)', 'Kantor Pusat Lantai 5', CURRENT_TIMESTAMP),
('att-002', 'emp-002', CURRENT_DATE, '07:58', NULL, 'Hadir', 'Tepat Waktu (Hybrid WFO)', 'Engineering Lab Lt. 3', CURRENT_TIMESTAMP),
('att-003', 'emp-003', CURRENT_DATE, '08:14', NULL, 'Terlambat', 'Terlambat 14 Menit (Kemacetan Tol)', 'Kantor Pusat Lantai 2', CURRENT_TIMESTAMP),
('att-004', 'emp-004', CURRENT_DATE, '07:50', NULL, 'Hadir', 'Tepat Waktu', 'Engineering Lab Lt. 3', CURRENT_TIMESTAMP),
('att-005', 'emp-005', CURRENT_DATE, '07:55', NULL, 'Hadir', 'Tepat Waktu', 'Creative Space Lt. 2', CURRENT_TIMESTAMP),
('att-006', 'emp-006', CURRENT_DATE, '08:05', NULL, 'Terlambat', 'Terlambat 5 Menit', 'Creative Space Lt. 2', CURRENT_TIMESTAMP),
('att-007', 'emp-007', CURRENT_DATE, '07:40', NULL, 'Hadir', 'Tepat Waktu', 'HR Executive Room Lt. 5', CURRENT_TIMESTAMP),
('att-008', 'emp-008', CURRENT_DATE, NULL, NULL, 'Izin', 'Izin Dinas Luar (Maintenance Server)', 'Data Center Cyber', CURRENT_TIMESTAMP),
('att-009', 'emp-009', CURRENT_DATE, NULL, NULL, 'Cuti', 'Cuti Tahunan (Disetujui HR)', '-', CURRENT_TIMESTAMP),
('att-010', 'emp-010', CURRENT_DATE, '07:52', NULL, 'Hadir', 'Tepat Waktu', 'Engineering Lab Lt. 3', CURRENT_TIMESTAMP);
