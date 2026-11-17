# Panduan Setup Database Supabase — Mrhands Lab App Demo

Repositori ini mendukung **Dual-Mode Data Architecture**:
1. **Mode Demo Lokal (Offline)**: Otomatis aktif tanpa setup apapun (menggunakan in-memory dan `localStorage`). Cocok untuk preview cepat atau evaluasi template.
2. **Mode Supabase (Online PostgreSQL)**: Untuk database sesungguhnya, baik menggunakan Supabase Cloud maupun Supabase CLI (Docker lokal).

---

## 🚀 Setup Cepat: Supabase Cloud (Rekomendasi)

1. Buat proyek baru di [Supabase Dashboard](https://supabase.com).
2. Buka menu **SQL Editor** pada proyek Anda.
3. Buka file `supabase/schema.sql` di proyek ini, copy seluruh kodenya, lalu paste dan klik **Run**.
4. Buka file `supabase/seed.sql`, copy kodenya, paste dan klik **Run** untuk memasukkan data demo realistis.
5. Ambil kredensial di menu **Project Settings -> API**:
   - `Project URL`
   - `anon / public key`
6. Masukkan ke file `.env.local` atau environment variable platform hosting Anda (Vercel/Netlify):
   ```env
   VITE_SUPABASE_MODE=cloud
   NEXT_PUBLIC_SUPABASE_MODE=cloud
   
   VITE_SUPABASE_URL=https://[YOUR_PROJECT_ID].supabase.co
   VITE_SUPABASE_ANON_KEY=[YOUR_ANON_KEY]
   ```

---

## 🐳 Setup Lokal: Supabase CLI (Docker)

Jika Anda ingin menjalankan database di komputer lokal:

```bash
# 1. Jalankan Supabase lokal
npx supabase start

# 2. Reset dan migrasi otomatis dengan seed
npx supabase db reset

# 3. Status port & URL lokal
npx supabase status
```

Kredensial lokal otomatis tersedia di:
- API URL: `http://127.0.0.1:54321`
- Studio Web: `http://127.0.0.1:54323`

---

## 📋 Tabel Utama yang Dibuat

1. **`employees`**: Data induk pegawai (NIP, Nama, Divisi, Jabatan, Gaji, Rekening, Sisa Cuti).
2. **`attendances`**: Catatan presensi harian (Tanggal, Jam Masuk, Jam Pulang, Status, Catatan, Lokasi).
3. **`leave_requests`**: Pengajuan dan persetujuan izin/cuti karyawan.
4. **`payrolls`**: Riwayat penggajian dan rincian slip gaji bulanan.
5. **`announcements`**: Broadcast pengumuman dan kebijakan internal kantor.
