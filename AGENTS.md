# 🤖 AGENTS.md — AI Coding Rules & Architectural Guidelines

> Panduan standar dan aturan wajib bagi AI Agent (Antigravity, Cursor, Claude Code, Lovable, Windsurf, Copilot) saat memodifikasi, menambah fitur, atau membuat proyek turunan dari starter template ini.

---

## 1. MENTAL MODEL & FILOSOFI PROYEK

1. **Dual-Mode Data Architecture (No-Break Deployment)**:
   - Setiap fitur data **harus** memiliki fallback lokal (in-memory / `localStorage`).
   - Jangan pernah membuat halaman crash ketika kredensial Supabase kosong (`isSupabaseConfigured === false`).
   - Kode harus tetap dapat di-*preview* dan diuji secara interaktif 100% tanpa setup backend terlebih dahulu.

2. **Clean Indonesian Enterprise UX**:
   - Seluruh label UI, status, dan pesan error menggunakan Bahasa Indonesia baku yang profesional.
   - Format angka mata uang wajib menggunakan helper `formatRupiah()` atau `formatCompact()`.
   - Format tanggal menggunakan `formatDateIndo()`.

3. **Anti-Slop Code Hygiene**:
   - Dilarang menulis komentar AI generik seperti `// This component renders the button`.
   - Hanya beri komentar ringkas pada logika bisnis non-trivial.
   - Tidak boleh meninggalkan `TODO`, `FIXME`, atau mock placeholder yang tidak berfungsi.

---

## 2. ATURAN ROUTING (TanStack Router)

Aplikasi ini menggunakan **TanStack Router File-Based Routing**:
- File di bawah `src/routes/` otomatis di-compile menjadi `src/routeTree.gen.ts` oleh Vite plugin saat build atau dev.
- **Root Layout**: `src/routes/__root.tsx`.
- **Public Routes**:
  - `src/routes/index.tsx` -> `/`
  - `src/routes/login.tsx` -> `/login`
  - `src/routes/transparency.tsx` -> `/transparency`
- **Layout Terproteksi**:
  - Admin (HR): `src/routes/admin.tsx` membungkus seluruh `admin.*.tsx`
  - Karyawan (Member): `src/routes/dashboard.tsx` membungkus seluruh `dashboard.*.tsx`
- **Cara Membuat Route Baru**:
  ```tsx
  import { createFileRoute } from "@tanstack/react-router";

  export const Route = createFileRoute("/admin/nama-fitur")({
    head: () => ({ meta: [{ title: "Judul Halaman · Mrhands Lab App Demo" }] }),
    component: NamaFiturPage,
  });

  function NamaFiturPage() {
    return <div>...</div>;
  }
  ```

---

## 3. ATURAN DESAIN & STYLING (Tailwind CSS v4 OKLCH)

Tema didefinisikan di `src/styles.css` menggunakan format OKLCH modern:
- `--primary`: Warna Navy/Biru utama untuk aksi primer, sidebar aktif, dan highlight brand.
- `--secondary`: Warna Hijau untuk status sukses, persetujuan, dan pertumbuhan positif.
- `--accent`: Warna Aksen Emas/Warm untuk elemen penarik perhatian.
- `--destructive`: Warna Merah untuk pembatalan, penolakan, dan hapus data.
- `--muted` / `--muted-foreground`: Warna abu-abu netral untuk latar dan teks sekunder.

**Aturan Penulisan Kelas**:
- Gunakan rounded konsisten: `rounded-lg` (8px) untuk tombol & input, `rounded-xl` (12px) untuk kartu, `rounded-2xl` untuk banner hero.
- Gunakan border halus: `border-border/80` atau `border-border/60`.
- Teks label form: `text-xs font-medium text-foreground`.
- Teks bantuan/keterangan: `text-[11px] text-muted-foreground`.
- Selalu gunakan `cn()` dari `@/lib/utils` untuk conditional styling.

---

## 4. ATURAN VISUALISASI GRAFIK (Recharts)

Setiap grafik analitik Recharts harus memenuhi standar berikut:
1. **Responsive**: Selalu dibungkus dalam `<ResponsiveContainer width="100%" height={...}>`.
2. **Warna Tersinkronisasi**: Gunakan warna dari variabel CSS tema:
   - Primary: `var(--color-primary)`
   - Secondary: `var(--color-secondary)`
   - Chart-3: `var(--color-chart-3)`
3. **Custom Tooltip Styling**:
   ```tsx
   <Tooltip
     contentStyle={{
       backgroundColor: "var(--color-card)",
       borderColor: "var(--color-border)",
       borderRadius: "8px",
       fontSize: "12px",
     }}
   />
   ```
4. **Grid & Axis**:
   - Selalu atur `strokeDasharray="3 3"` dan `opacity={0.25}` pada `<CartesianGrid>`.
   - Ukuran font sumbu: `tick={{ fontSize: 11 }}`.

---

## 5. SERVICE LAYER & DATA MUTATION

Ketika menambahkan fitur CRUD baru:
1. Buat tipe data TypeScript di `src/lib/employee-data.ts`.
2. Tambahkan fungsi async di `src/services/employee-service.ts`:
   ```typescript
   export async function getNamaEntitas(): Promise<Entitas[]> {
     if (isSupabaseConfigured && supabase) {
       try {
         const { data, error } = await supabase.from("tabel").select("*");
         if (!error && data) return data as Entitas[];
       } catch (e) {
         console.warn("Supabase query error, fallback to local", e);
       }
     }
     return loadFromStorage("key_storage", initialData);
   }
   ```
3. Di komponen React, gunakan `@tanstack/react-query`:
   - Gunakan `useQuery` untuk fetching dengan `queryKey`.
   - Gunakan `useMutation` untuk Create/Update/Delete dan panggil `queryClient.invalidateQueries(...)` pada callback `onSuccess`.
   - Berikan notifikasi interaktif via `toast.success()` atau `toast.error()` dari `sonner`.

---

## 6. PROMPT RECIPES UNTUK AI AGENT

### Resep 1: "Tambah Halaman Baru di Admin"
```markdown
Tolong buatkan halaman baru di route `/admin/pelatihan` untuk manajemen program pelatihan karyawan.
Syarat:
1. Tampilkan tabel daftar pelatihan (Nama Program, Divisi Target, Tanggal, Kuota Peserta, Status).
2. Tambahkan modal pop-up "Tambah Pelatihan Baru".
3. Tambahkan grafik Recharts persentase keikutsertaan pelatihan per departemen.
4. Gunakan TanStack Query dan simpan fallback datanya di employee-service.
```

### Resep 2: "Ganti Tema Warna Aplikasi"
```markdown
Tolong ubah tema warna di `src/styles.css` agar bernuansa Modern Emerald Green (Teal/Emerald primary) dengan aksen Slate. Pastikan kontras teks tetap terbaca jelas di background putih.
```

### Resep 3: "Tambah Tabel Supabase Baru"
```markdown
Tolong buatkan file migration SQL baru di `supabase/migrations/` untuk tabel `training_programs` beserta foreign key ke `employees(id)`, index query, RLS policies, dan data seed dummy-nya.
```
