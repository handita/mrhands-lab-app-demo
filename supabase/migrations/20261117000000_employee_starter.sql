-- =========================================================================
-- MRHANDS LAB APP DEMO - INITIAL MIGRATION
-- Presensi, Monitoring & Manajemen Karyawan
-- =========================================================================

-- 1. Enable Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Employees Table
CREATE TABLE IF NOT EXISTS public.employees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nip VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    role VARCHAR(20) DEFAULT 'member' CHECK (role IN ('admin', 'member')),
    pin_hash VARCHAR(255) DEFAULT '123456',
    division VARCHAR(100) NOT NULL,
    position VARCHAR(100) NOT NULL,
    employment_type VARCHAR(50) DEFAULT 'Tetap' CHECK (employment_type IN ('Tetap', 'Kontrak', 'Probasi', 'Magang')),
    status VARCHAR(50) DEFAULT 'Aktif' CHECK (status IN ('Aktif', 'Cuti', 'Nonaktif')),
    join_date DATE NOT NULL DEFAULT CURRENT_DATE,
    salary NUMERIC(15, 2) DEFAULT 0,
    remaining_leave INT DEFAULT 12,
    bank_name VARCHAR(100),
    bank_account VARCHAR(100),
    education VARCHAR(255),
    address TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Attendance Table
CREATE TABLE IF NOT EXISTS public.attendances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    check_in TIME,
    check_out TIME,
    status VARCHAR(50) DEFAULT 'Hadir' CHECK (status IN ('Hadir', 'Terlambat', 'Izin', 'Sakit', 'Cuti', 'Alpa')),
    notes TEXT,
    location TEXT DEFAULT 'Kantor Pusat',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(employee_id, date)
);

-- 4. Leave Requests Table
CREATE TABLE IF NOT EXISTS public.leave_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
    leave_type VARCHAR(50) NOT NULL CHECK (leave_type IN ('Tahunan', 'Sakit', 'Melahirkan', 'Khusus / Alasan Penting')),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_days INT NOT NULL DEFAULT 1,
    reason TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'Menunggu Persetujuan' CHECK (status IN ('Menunggu Persetujuan', 'Disetujui', 'Ditolak')),
    submitted_at TIMESTAMPTZ DEFAULT NOW(),
    reviewed_at TIMESTAMPTZ,
    reviewed_by VARCHAR(255)
);

-- 5. Payroll Table
CREATE TABLE IF NOT EXISTS public.payrolls (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
    period VARCHAR(50) NOT NULL,
    basic_salary NUMERIC(15, 2) NOT NULL DEFAULT 0,
    allowance_position NUMERIC(15, 2) DEFAULT 0,
    allowance_transport NUMERIC(15, 2) DEFAULT 0,
    allowance_meal NUMERIC(15, 2) DEFAULT 0,
    bonus NUMERIC(15, 2) DEFAULT 0,
    deduction_bpjs NUMERIC(15, 2) DEFAULT 0,
    deduction_tax NUMERIC(15, 2) DEFAULT 0,
    net_salary NUMERIC(15, 2) NOT NULL DEFAULT 0,
    status VARCHAR(50) DEFAULT 'Lunas' CHECK (status IN ('Lunas', 'Proses')),
    paid_at DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Announcements Table
CREATE TABLE IF NOT EXISTS public.announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    category VARCHAR(50) DEFAULT 'Pemberitahuan' CHECK (category IN ('Pemberitahuan', 'Kebijakan', 'Acara', 'Penting')),
    content TEXT NOT NULL,
    author VARCHAR(255) NOT NULL,
    is_pinned BOOLEAN DEFAULT FALSE,
    published_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Indexes
CREATE INDEX IF NOT EXISTS idx_employees_nip ON public.employees(nip);
CREATE INDEX IF NOT EXISTS idx_employees_division ON public.employees(division);
CREATE INDEX IF NOT EXISTS idx_employees_status ON public.employees(status);
CREATE INDEX IF NOT EXISTS idx_attendances_date ON public.attendances(date);
CREATE INDEX IF NOT EXISTS idx_attendances_employee ON public.attendances(employee_id);
CREATE INDEX IF NOT EXISTS idx_leaves_status ON public.leave_requests(status);
CREATE INDEX IF NOT EXISTS idx_leaves_employee ON public.leave_requests(employee_id);
CREATE INDEX IF NOT EXISTS idx_payrolls_period ON public.payrolls(period);
CREATE INDEX IF NOT EXISTS idx_payrolls_employee ON public.payrolls(employee_id);

-- 8. RLS
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leave_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payrolls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read employees" ON public.employees FOR SELECT USING (true);
CREATE POLICY "Allow read attendances" ON public.attendances FOR SELECT USING (true);
CREATE POLICY "Allow read leaves" ON public.leave_requests FOR SELECT USING (true);
CREATE POLICY "Allow read payrolls" ON public.payrolls FOR SELECT USING (true);
CREATE POLICY "Allow read announcements" ON public.announcements FOR SELECT USING (true);

CREATE POLICY "Allow write employees" ON public.employees FOR ALL USING (true);
CREATE POLICY "Allow write attendances" ON public.attendances FOR ALL USING (true);
CREATE POLICY "Allow write leaves" ON public.leave_requests FOR ALL USING (true);
CREATE POLICY "Allow write payrolls" ON public.payrolls FOR ALL USING (true);
CREATE POLICY "Allow write announcements" ON public.announcements FOR ALL USING (true);
