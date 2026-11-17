-- =========================================================================
-- MRHANDS LAB APP STARTER - DATABASE SCHEMA (SUPABASE POSTGRESQL)
-- Mode 2: Supabase Cloud PostgreSQL
-- =========================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

DROP TABLE IF EXISTS public.items CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- 1. Users Table
CREATE TABLE public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(20) DEFAULT 'member' CHECK (role IN ('admin', 'member')),
    department VARCHAR(100),
    status VARCHAR(50) DEFAULT 'Aktif' CHECK (status IN ('Aktif', 'Nonaktif')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Items Table
CREATE TABLE public.items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'Aktif' CHECK (status IN ('Aktif', 'Draft', 'Arsip')),
    value NUMERIC(15, 2) DEFAULT 0,
    author VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read users" ON public.users FOR SELECT USING (true);
CREATE POLICY "Allow public insert users" ON public.users FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update users" ON public.users FOR UPDATE USING (true);

CREATE POLICY "Allow public read items" ON public.items FOR SELECT USING (true);
CREATE POLICY "Allow public insert items" ON public.items FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update items" ON public.items FOR UPDATE USING (true);
