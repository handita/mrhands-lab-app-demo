-- =========================================================================
-- MRHANDS LAB APP DEMO - SEED DATA (SUPABASE POSTGRESQL)
-- Data Contoh Realistis Standar Indonesia: 10 Karyawan, Presensi & Cuti
-- =========================================================================

-- 1. Insert Employees
INSERT INTO public.employees (id, nip, name, email, phone, role, pin_hash, division, position, employment_type, status, join_date, salary, remaining_leave, bank_name, bank_account, education, address)
VALUES
('00000000-0000-0000-0000-000000000001', '198801012010121001', 'Dr. Hendra Gunawan, S.Kom., M.M.', 'hendra.gunawan@mrhands.id', '081234567890', 'admin', '000000', 'Sumber Daya Manusia (SDM)', 'Kepala Divisi SDM & Operasional', 'Tetap', 'Aktif', '2015-03-01', 28500000, 10, 'Bank Mandiri', '1230009876543', 'S3 Manajemen SDM - UI', 'Jl. Veteran No. 45, Jakarta Pusat'),
('00000000-0000-0000-0000-000000000002', '199003152015021002', 'Budi Santoso, S.Kom.', 'budi.santoso@mrhands.id', '081398765432', 'member', '123456', 'Teknologi Informasi', 'Lead Frontend Engineer', 'Tetap', 'Aktif', '2018-06-15', 19500000, 9, 'BCA', '5430098765', 'S1 Teknik Informatika - ITB', 'Taman Sentosa Blok B3 No. 12, Bekasi'),
('00000000-0000-0000-0000-000000000003', '199208202017012003', 'Siti Rahmawati, S.E.', 'siti.rahmawati@mrhands.id', '081578912345', 'member', '123456', 'Keuangan & Akuntansi', 'Senior Financial Analyst', 'Tetap', 'Aktif', '2019-01-10', 16500000, 11, 'Bank BNI', '0987123456', 'S1 Akuntansi - UNAIR', 'Jl. Margonda Raya No. 88, Depok'),
('00000000-0000-0000-0000-000000000004', '199405102018031004', 'Ahmad Fauzi, S.T.', 'ahmad.fauzi@mrhands.id', '082165439876', 'member', '123456', 'Teknologi Informasi', 'DevOps & Cloud Specialist', 'Tetap', 'Aktif', '2020-04-01', 17500000, 7, 'BCA', '7890123456', 'S1 Teknik Komputer - ITS', 'Cluster Harmoni No. 19, Tangerang Selatan'),
('00000000-0000-0000-0000-000000000005', '199511122019042005', 'Dewi Lestari, S.I.Kom.', 'dewi.lestari@mrhands.id', '081823456781', 'member', '123456', 'Pemasaran & Komunikasi', 'Corporate Communication Specialist', 'Tetap', 'Aktif', '2021-02-15', 14000000, 12, 'Bank BRI', '012301098765432', 'S1 Ilmu Komunikasi - UNPAD', 'Jl. Tebet Barat Raya No. 15, Jakarta Selatan'),
('00000000-0000-0000-0000-000000000006', '199602282020051006', 'Rian Hidayat, S.Ds.', 'rian.hidayat@mrhands.id', '081912345678', 'member', '123456', 'Teknologi Informasi', 'UI/UX Product Designer', 'Kontrak', 'Aktif', '2022-08-01', 13500000, 8, 'Bank Mandiri', '1560007894561', 'S1 DKV - ISI Yogyakarta', 'Jl. Anggrek Cendrawasih No. 2, Jakarta'),
('00000000-0000-0000-0000-000000000007', '199307142017082007', 'Nurul Aini, S.Psi.', 'nurul.aini@mrhands.id', '081298761234', 'admin', '000000', 'Sumber Daya Manusia (SDM)', 'Talent Acquisition & People Development', 'Tetap', 'Aktif', '2019-09-01', 16000000, 6, 'BCA', '8899112233', 'S1 Psikologi - UGM', 'Jl. Radio Dalam No. 10B, Jakarta Selatan'),
('00000000-0000-0000-0000-000000000008', '199709052021061008', 'Eko Prasetyo, S.Tr.Kom.', 'eko.prasetyo@mrhands.id', '085612347890', 'member', '123456', 'Operasional', 'Database & IT Support Engineer', 'Kontrak', 'Aktif', '2023-01-15', 11500000, 12, 'Bank BNI', '0456123789', 'D4 Teknik Telekomunikasi - PENS', 'Perumahan Griya Asri Blok D5, Depok'),
('00000000-0000-0000-0000-000000000009', '199812222022072009', 'Putri Anggraini, S.M.', 'putri.anggraini@mrhands.id', '087712398456', 'member', '123456', 'Layanan Pelanggan', 'Customer Experience Team Lead', 'Tetap', 'Cuti', '2022-03-01', 12500000, 3, 'Bank Mandiri', '1250098712345', 'S1 Manajemen - Telkom Univ', 'Komplek Duren Sawit Indah Blok F1, Jakarta'),
('00000000-0000-0000-0000-000000000010', '200004182023081010', 'Dimas Arya Pratama', 'dimas.arya@mrhands.id', '089612345678', 'member', '123456', 'Teknologi Informasi', 'Junior Backend Developer', 'Probasi', 'Aktif', '2026-01-05', 8500000, 12, 'BCA', '6040123987', 'S1 Sistem Informasi - UI', 'Kukusan Raya No. 40, Beji, Depok')
ON CONFLICT (nip) DO NOTHING;

-- 2. Insert Attendances (Presensi Hari Ini)
INSERT INTO public.attendances (employee_id, date, check_in, check_out, status, notes, location)
VALUES
('00000000-0000-0000-0000-000000000001', CURRENT_DATE, '07:45', NULL, 'Hadir', 'Tepat Waktu (WFO Kantor Pusat)', 'Kantor Pusat Lantai 5'),
('00000000-0000-0000-0000-000000000002', CURRENT_DATE, '07:58', NULL, 'Hadir', 'Tepat Waktu (Hybrid WFO)', 'Engineering Lab Lt. 3'),
('00000000-0000-0000-0000-000000000003', CURRENT_DATE, '08:14', NULL, 'Terlambat', 'Terlambat 14 Menit (Kemacetan Tol Cibubur)', 'Kantor Pusat Lantai 2'),
('00000000-0000-0000-0000-000000000004', CURRENT_DATE, '07:50', NULL, 'Hadir', 'Tepat Waktu', 'Engineering Lab Lt. 3'),
('00000000-0000-0000-0000-000000000005', CURRENT_DATE, '07:55', NULL, 'Hadir', 'Tepat Waktu', 'Creative Space Lt. 2'),
('00000000-0000-0000-0000-000000000006', CURRENT_DATE, '08:05', NULL, 'Terlambat', 'Terlambat 5 Menit', 'Creative Space Lt. 2'),
('00000000-0000-0000-0000-000000000007', CURRENT_DATE, '07:40', NULL, 'Hadir', 'Tepat Waktu', 'HR Executive Room Lt. 5'),
('00000000-0000-0000-0000-000000000008', CURRENT_DATE, NULL, NULL, 'Izin', 'Izin Dinas Luar (Maintenance Server Data Center)', 'Data Center Cyber'),
('00000000-0000-0000-0000-000000000009', CURRENT_DATE, NULL, NULL, 'Cuti', 'Cuti Tahunan (Disetujui HR)', '-'),
('00000000-0000-0000-0000-000000000010', CURRENT_DATE, '07:52', NULL, 'Hadir', 'Tepat Waktu', 'Engineering Lab Lt. 3')
ON CONFLICT (employee_id, date) DO NOTHING;

-- 3. Insert Leave Requests (Pengajuan Cuti)
INSERT INTO public.leave_requests (employee_id, leave_type, start_date, end_date, total_days, reason, status, submitted_at, reviewed_at, reviewed_by)
VALUES
('00000000-0000-0000-0000-000000000009', 'Tahunan', CURRENT_DATE, CURRENT_DATE + INTERVAL '2 day', 3, 'Acara keluarga dan mudik tahunan', 'Disetujui', CURRENT_DATE - INTERVAL '3 day', CURRENT_DATE - INTERVAL '1 day', 'Dr. Hendra Gunawan, S.Kom., M.M.'),
('00000000-0000-0000-0000-000000000004', 'Tahunan', CURRENT_DATE + INTERVAL '7 day', CURRENT_DATE + INTERVAL '8 day', 2, 'Pernikahan adik kandung di Klaten', 'Menunggu Persetujuan', CURRENT_DATE - INTERVAL '1 day', NULL, NULL),
('00000000-0000-0000-0000-000000000002', 'Sakit', CURRENT_DATE - INTERVAL '14 day', CURRENT_DATE - INTERVAL '13 day', 2, 'Istirahat dokter karena demam dan flu (Surat Dokter terlampir)', 'Disetujui', CURRENT_DATE - INTERVAL '14 day', CURRENT_DATE - INTERVAL '13 day', 'Dr. Hendra Gunawan, S.Kom., M.M.');

-- 4. Insert Announcements (Pengumuman Resmi)
INSERT INTO public.announcements (title, category, content, author, is_pinned, published_at)
VALUES
('Jadwal Presensi Kerja & Kebijakan Jam Kerja Fleksibel 2026', 'Kebijakan', 'Mengingatkan seluruh rekan kerja bahwa jam kerja kantor dimulai pukul 08:00 WIB dengan toleransi presensi hingga 08:15 WIB. Mohon melakukan Check-in melalui portal aplikasi setiap hari.', 'Divisi SDM & Operasional', TRUE, NOW()),
('Undangan Townhall Meeting & Evaluasi Kinerja Kuartal I', 'Acara', 'Seluruh karyawan diharapkan hadir dalam Townhall Meeting daring/luring yang diselenggarakan Jumat pekan ini pukul 14:00 WIB di Auditorium Utama dan live streaming.', 'Direksi Mrhands Lab', FALSE, NOW() - INTERVAL '2 day'),
('Program Peningkatan Kapabilitas Cloud Computing & AI Engineer', 'Pemberitahuan', 'Pendaftaran program sertifikasi AWS/GCP dan Workshop AI Coding bagi divisi Teknologi telah dibuka. Kuota terbatas 15 peserta.', 'Divisi SDM & Operasional', FALSE, NOW() - INTERVAL '5 day');
