-- =========================================================================
-- MRHANDS LAB APP STARTER - SEED DATA (SUPABASE POSTGRESQL)
-- =========================================================================

INSERT INTO public.users (username, name, email, role, department, status) VALUES
('admin', 'Administrator', 'admin@mrhands.id', 'admin', 'Executive Management', 'Aktif'),
('member', 'Demo Member', 'member@mrhands.id', 'member', 'Operational', 'Aktif')
ON CONFLICT (username) DO NOTHING;

INSERT INTO public.items (title, category, status, value, author) VALUES
('Proyek Inisiasi Starter Kit', 'Development', 'Aktif', 25000000, 'Administrator'),
('Riset Arsitektur Dual-Mode', 'Research', 'Aktif', 15000000, 'Demo Member'),
('Integrasi TanStack Router & Start', 'Development', 'Aktif', 18500000, 'Administrator');
