-- =========================================================================
-- MRHANDS LAB APP STARTER - SQLITE 3 DATABASE SCHEMA & SEED
-- Mode 1: SQLite Zero-Config Local Database
-- =========================================================================

-- 1. Users Table
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

-- 2. Items Table
CREATE TABLE IF NOT EXISTS items (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    status TEXT DEFAULT 'Aktif',
    value REAL DEFAULT 0,
    author TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- -------------------------------------------------------------------------
-- SEED DATA
-- -------------------------------------------------------------------------

INSERT OR IGNORE INTO users (id, username, name, email, role, department, status) VALUES
('usr-001', 'admin', 'Administrator', 'admin@mrhands.id', 'admin', 'Executive Management', 'Aktif'),
('usr-002', 'member', 'Demo Member', 'member@mrhands.id', 'member', 'Operational', 'Aktif');

INSERT OR IGNORE INTO items (id, title, category, status, value, author, created_at) VALUES
('item-001', 'Proyek Inisiasi Starter Kit', 'Development', 'Aktif', 25000000, 'Administrator', '2026-11-17'),
('item-002', 'Riset Arsitektur Dual-Mode', 'Research', 'Aktif', 15000000, 'Demo Member', '2026-11-17'),
('item-003', 'Integrasi TanStack Router & Start', 'Development', 'Aktif', 18500000, 'Administrator', '2026-11-17');
