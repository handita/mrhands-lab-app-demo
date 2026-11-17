# Otomatisasi GitHub Actions (Keep Supabase Alive)

Folder ini berisi skrip otomatisasi GitHub Actions yang berfungsi untuk menjaga database Supabase versi *Free Tier* (gratis) agar tidak dinonaktifkan (di-pause) secara otomatis oleh sistem Supabase karena dianggap tidak aktif.

## Mengapa ini diperlukan?
Supabase memberlakukan kebijakan bahwa proyek gratis yang tidak memiliki aktivitas database selama 1 minggu berturut-turut akan di-pause (suspended).
Script `keep-supabase-alive.yml` yang ada di folder ini mengatasi masalah tersebut dengan melakukan *request ping* otomatis secara terjadwal.

## Cara Kerja
Skrip ini akan berjalan secara otomatis di server GitHub tanpa membebani laptop/server Anda.
Jadwal berjalannya adalah:
- Setiap hari **Senin** pukul 00:00 UTC
- Setiap hari **Kamis** pukul 00:00 UTC

Skrip akan membaca rahasia (secrets) repositori Anda, dan menggunakan kredensial tersebut untuk mengakses data dummy ringan di database (limit 1 baris). Ini sudah cukup untuk me-reset *timer* masa tenggang 7-hari di Supabase.

## Panduan Pemasangan

Agar skrip ini bisa berjalan di repositori GitHub Anda, Anda **Wajib** menambahkan *Secrets* di pengaturan repositori.

1. Buka Repositori Anda di [GitHub](https://github.com).
2. Pergi ke tab **Settings** (Pengaturan).
3. Di menu sebelah kiri, cari bagian **Security** -> **Secrets and variables** -> klik **Actions**.
4. Klik tombol hijau **New repository secret**.
5. Tambahkan dua *Secret* berikut secara bergantian:

   **Secret 1**
   - **Name:** `VITE_SUPABASE_URL`
   - **Secret:** *(Masukkan URL Supabase proyek Anda, formatnya seperti `https://xyz...supabase.co`)*

   **Secret 2**
   - **Name:** `VITE_SUPABASE_ANON_KEY`
   - **Secret:** *(Masukkan anon key Supabase proyek Anda, string panjang yang berawalan `eyJ...`)*

6. Selesai! Setelah ini disimpan, otomatisasi akan langsung aktif.

## Mengetes Skrip Secara Manual
Jika Anda ingin memastikan skrip ini berjalan dengan benar tanpa perlu menunggu hari Senin/Kamis:
1. Buka tab **Actions** di repositori GitHub Anda.
2. Di sidebar kiri, klik **Keep Supabase Alive**.
3. Klik dropdown tombol **Run workflow** di sebelah kanan.
4. Klik tombol **Run workflow** berwarna hijau.
5. GitHub akan menjalankan skrip saat itu juga. Anda dapat mengklik prosesnya untuk melihat log dan memastikan status "Ping berhasil dieksekusi!".
