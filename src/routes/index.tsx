import { Link, createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  Users,
  ShieldCheck,
  Sparkles,
  CalendarCheck,
  CalendarDays,
  Building2,
  LineChart,
  CheckCircle2,
  Clock,
  Laptop,
  Check,
  Activity,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrandMark } from "@/components/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Mrhands Lab App Demo — Presensi & Monitoring Karyawan" },
      {
        name: "description",
        content:
          "Starter template siap pakai dari nol untuk aplikasi presensi karyawan, monitoring kehadiran tim, dan dashboard analitik terpadu.",
      },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header Navigation */}
      <header className="px-4 lg:px-10 py-4 flex items-center justify-between border-b border-border/60 bg-background/80 backdrop-blur sticky top-0 z-30">
        <BrandMark />
        <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-muted-foreground">
          <Link to="/transparency" className="hover:text-foreground transition-colors">
            Direktori Tim
          </Link>
          <Link to="/login" className="hover:text-foreground transition-colors">
            Panduan Akses Demo
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <Link to="/login">
            <Button variant="ghost" size="sm" className="text-xs">
              Masuk
            </Button>
          </Link>
          <Link to="/dashboard">
            <Button size="sm" className="gap-1.5 text-xs rounded-full">
              Buka Presensi <ArrowRight className="size-3.5" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-4 lg:px-10 pt-14 lg:pt-20 pb-16 max-w-5xl mx-auto text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
          <Sparkles className="size-3.5" />
          <span>Starter Template Bersih: Mrhands Lab App Demo</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.15]">
          Aplikasi Karyawan untuk <br className="hidden sm:block" />
          <span className="text-primary">Presensi & Monitoring Tim Terpadu</span>
        </h1>

        <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Fondasi starter siap pakai dari kosongan untuk membangun aplikasi presensi mandiri, monitoring kehadiran staf real-time, pengajuan cuti, dan dashboard analitik eksekutif tanpa sisa dependensi yang tidak perlu.
        </p>

        {/* Quick Demo CTA */}
        <div className="pt-4 flex flex-wrap justify-center gap-3">
          <Link to="/login">
            <Button size="lg" className="gap-2 rounded-full px-8 text-sm shadow-md">
              Coba Demo 1-Klik <ArrowRight className="size-4" />
            </Button>
          </Link>
          <Link to="/admin">
            <Button size="lg" variant="outline" className="gap-2 rounded-full px-8 text-sm">
              <Activity className="size-4 text-primary" /> Live Monitoring Board
            </Button>
          </Link>
        </div>

        {/* 1-Click Role Direct Shortcuts */}
        <div className="pt-8 max-w-2xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
          <Link
            to="/admin"
            className="p-4 rounded-xl border border-primary/20 bg-primary/5 hover:border-primary/40 transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold text-xs">
                HR
              </div>
              <div>
                <p className="text-xs font-semibold text-foreground">Portal Admin & Monitoring</p>
                <p className="text-[11px] text-muted-foreground">Pantau kehadiran harian & KPI tim</p>
              </div>
            </div>
            <ArrowRight className="size-4 text-primary group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            to="/dashboard"
            className="p-4 rounded-xl border border-border/80 bg-card hover:border-primary/30 transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold text-xs">
                ESS
              </div>
              <div>
                <p className="text-xs font-semibold text-foreground">Portal Mandiri Karyawan</p>
                <p className="text-[11px] text-muted-foreground">Check-in jam kerja & log riwayat</p>
              </div>
            </div>
            <ArrowRight className="size-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Feature Highlights Grid */}
        <div className="pt-14 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <Card className="border-border/70 shadow-sm bg-card hover:border-primary/40 transition-colors">
            <CardContent className="p-6 space-y-3">
              <div className="p-2.5 bg-emerald-500/10 rounded-xl text-emerald-600 w-fit">
                <CalendarCheck className="size-6" />
              </div>
              <h3 className="font-semibold text-base text-foreground">Presensi Mandiri & Live Clock</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Pencatatan jam kedatangan (Check-in) dan kepulangan (Check-out) dengan deteksi toleransi keterlambatan otomatis dan jam digital WIB real-time.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/70 shadow-sm bg-card hover:border-primary/40 transition-colors">
            <CardContent className="p-6 space-y-3">
              <div className="p-2.5 bg-primary/10 rounded-xl text-primary w-fit">
                <Activity className="size-6" />
              </div>
              <h3 className="font-semibold text-base text-foreground">Live Monitoring Kehadiran Tim</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Tabel monitoring dinamis untuk HR dan Manager memantau status hadir, terlambat, izin dinas, sakit, cuti, atau alpa dengan filter divisi dan tanggal.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/70 shadow-sm bg-card hover:border-primary/40 transition-colors">
            <CardContent className="p-6 space-y-3">
              <div className="p-2.5 bg-blue-500/10 rounded-xl text-blue-600 w-fit">
                <LineChart className="size-6" />
              </div>
              <h3 className="font-semibold text-base text-foreground">Dashboard Eksekutif & Recharts</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Visualisasi analitik rasio kehadiran hari ini, tren 6 bulan ke belakang, distribusi pegawai antar divisi, dan persetujuan cuti karyawan.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Developer Architecture Specs */}
        <div className="mt-14 p-6 rounded-2xl bg-muted/40 border text-left space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Spesifikasi Arsitektur Starter Template
            </h4>
            <Badge variant="outline" className="text-[10px] bg-background">
              Kosong & Bersih dari Sisa Legacy
            </Badge>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <p className="text-muted-foreground">Framework</p>
              <p className="font-semibold text-foreground">TanStack Start & Router</p>
            </div>
            <div>
              <p className="text-muted-foreground">Database & Dual-Mode</p>
              <p className="font-semibold text-foreground">Supabase + LocalStorage Fallback</p>
            </div>
            <div>
              <p className="text-muted-foreground">Styling System</p>
              <p className="font-semibold text-foreground">Tailwind CSS v4 (OKLCH)</p>
            </div>
            <div>
              <p className="text-muted-foreground">Visualisasi Grafik</p>
              <p className="font-semibold text-foreground">Recharts Responsive Charts</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 px-4 text-center text-xs text-muted-foreground">
        <p>Mrhands Lab App Demo — Starter Kit Aplikasi Karyawan untuk Presensi & Monitoring.</p>
      </footer>
    </div>
  );
}
