import { Link, createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Database,
  Layers,
  Cpu,
  Code2,
  CheckCircle2,
  Laptop,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrandMark } from "@/components/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Mrhands Lab App Starter — Blank Starter Template" },
      {
        name: "description",
        content:
          "Starter template bersih dan modular berbasis TanStack Start, Tailwind CSS v4, SQLite Zero-Config, dan Supabase Dual-Mode Architecture.",
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
          <Link to="/login" className="hover:text-foreground transition-colors">
            Panduan Demo
          </Link>
          <a
            href="https://github.com/handita/mrhands-lab-app-demo"
            target="_blank"
            rel="noreferrer"
            className="hover:text-foreground transition-colors"
          >
            GitHub Repository
          </a>
        </nav>
        <div className="flex items-center gap-2">
          <Link to="/login">
            <Button variant="ghost" size="sm" className="text-xs">
              Masuk
            </Button>
          </Link>
          <Link to="/dashboard">
            <Button size="sm" className="gap-1.5 text-xs rounded-full">
              Portal Member <ArrowRight className="size-3.5" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-4 lg:px-10 pt-14 lg:pt-20 pb-16 max-w-5xl mx-auto text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
          <Sparkles className="size-3.5" />
          <span>Clean Slate Starter Template · Siap Bangun dari Nol</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.15]">
          Starter Template Modern untuk <br className="hidden sm:block" />
          <span className="text-primary">Aplikasi Web Full-Stack Enterprise</span>
        </h1>

        <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Fondasi starter bersih tanpa dependensi sisa, dilengkapi dual-mode database (SQLite lokal instan + Supabase cloud PostgreSQL), TanStack Start File-based Routing, dan desain Tailwind v4 OKLCH.
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
              <ShieldCheck className="size-4 text-primary" /> Buka Admin Dashboard
            </Button>
          </Link>
        </div>

        {/* 1-Click Role Direct Shortcuts */}
        <div className="pt-8 max-w-2xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
          <Link
            to="/admin"
            className="p-4 rounded-xl border border-primary/20 bg-primary/5 hover:border-primary/40 transition-all flex items-center justify-between group"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-[10px]">
                  Role Admin
                </Badge>
                <span className="font-semibold text-sm text-foreground">Dashboard Administrator</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Akses panel admin, statistik metrik, dan manajemen data.
              </p>
            </div>
            <ArrowRight className="size-4 text-primary group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            to="/dashboard"
            className="p-4 rounded-xl border border-secondary/20 bg-secondary/5 hover:border-secondary/40 transition-all flex items-center justify-between group"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-secondary/10 text-secondary border-secondary/20 text-[10px]">
                  Role Member
                </Badge>
                <span className="font-semibold text-sm text-foreground">Portal Pengguna</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Akses personal pengguna, daftar item, dan profil sesi.
              </p>
            </div>
            <ArrowRight className="size-4 text-secondary group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="px-4 lg:px-10 py-16 bg-muted/30 border-t border-border/60">
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Fitur Inti Starter Kit
            </h2>
            <p className="text-sm text-muted-foreground">
              Dirancang untuk percepatan pembuatan aplikasi AI Agent atau pengembang software dari nol.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-border/80">
              <CardContent className="pt-6 space-y-3">
                <div className="size-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <Database className="size-5" />
                </div>
                <h3 className="font-semibold text-base text-foreground">Dual-Mode Data Architecture</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Bekerja offline atau zero-config menggunakan SQLite in-memory / localStorage, dan beralih otomatis ke Supabase Cloud PostgreSQL ketika kredensial `.env` diisi.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/80">
              <CardContent className="pt-6 space-y-3">
                <div className="size-10 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center">
                  <Layers className="size-5" />
                </div>
                <h3 className="font-semibold text-base text-foreground">TanStack Start & Router</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  File-based routing yang type-safe, SSR support, layouts proteksi peran (Admin & Member), serta integrasi TanStack Query v5 bawaan.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/80">
              <CardContent className="pt-6 space-y-3">
                <div className="size-10 rounded-lg bg-accent/20 text-foreground flex items-center justify-center">
                  <Code2 className="size-5" />
                </div>
                <h3 className="font-semibold text-base text-foreground">Tailwind CSS v4 & Recharts</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Desain tema OKLCH modern, palet warna elegan, komponen UI Radix yang aksesibel, serta visualisasi grafik interaktif Recharts.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 lg:px-10 py-8 border-t border-border/60 text-center text-xs text-muted-foreground">
        <p>© 2026 Mrhands Lab. Open Starter Template untuk Antigravity & AI Coding Agents.</p>
      </footer>
    </div>
  );
}
