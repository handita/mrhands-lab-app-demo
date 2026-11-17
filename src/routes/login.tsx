import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BrandMark } from "@/components/app-shell";
import {
  ShieldCheck,
  ArrowRight,
  KeyRound,
  UserCheck,
  Building2,
  Sparkles,
  Briefcase,
  User,
} from "lucide-react";
import { loginWithNipPin, loginAsDemo } from "@/services/auth-service";
import { toast } from "sonner";
import { isSupabaseConfigured } from "@/lib/supabase";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Masuk · Mrhands Lab App Demo" }] }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [nip, setNip] = useState("");
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);

  const handleManualLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nip.trim()) {
      toast.error("Silakan masukkan NIP atau Email");
      return;
    }
    if (!pin.trim()) {
      toast.error("Silakan masukkan PIN atau Password");
      return;
    }

    setLoading(true);
    try {
      const session = await loginWithNipPin(nip.trim(), pin.trim());
      toast.success(`Selamat datang kembali, ${session.user.name}!`);
      if (session.user.role === "admin") {
        await navigate({ to: "/admin" });
      } else {
        await navigate({ to: "/dashboard" });
      }
    } catch (err: any) {
      toast.error(err?.message || "Gagal masuk. Periksa kembali NIP dan PIN Anda.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (role: "admin" | "employee", specificNip?: string) => {
    setLoading(true);
    try {
      const session = await loginAsDemo(role, specificNip);
      toast.success(
        `Masuk sebagai demo ${role === "admin" ? "HR Admin" : "Karyawan"}: ${session.user.name}`
      );
      if (session.user.role === "admin") {
        await navigate({ to: "/admin" });
      } else {
        await navigate({ to: "/dashboard" });
      }
    } catch (err: any) {
      toast.error("Gagal melakukan demo login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-6">
        <div className="flex justify-center mb-4">
          <BrandMark />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          Mrhands Lab App Demo
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Sistem Presensi Mandiri, Monitoring Tim Real-time & Manajemen Karyawan.
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-xl px-4">
        {/* 1-Click Quick Demo Login Box */}
        <Card className="border-primary/20 bg-primary/5 mb-6 shadow-sm">
          <CardHeader className="pb-3 pt-5 px-5">
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-primary" />
              <CardTitle className="text-sm font-semibold text-primary">
                Akses Demo 1-Klik (Siap Pakai & Deploy)
              </CardTitle>
            </div>
            <CardDescription className="text-xs">
              Pilih peran di bawah ini untuk langsung menjelajahi seluruh fitur tanpa perlu mengisi form:
            </CardDescription>
          </CardHeader>
          <CardContent className="px-5 pb-5 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <Button
              type="button"
              variant="default"
              size="sm"
              disabled={loading}
              onClick={() => handleQuickDemo("admin")}
              className="gap-2 justify-start h-auto py-2.5 px-3 text-left"
            >
              <div className="size-7 rounded-md bg-white/20 flex items-center justify-center shrink-0">
                <ShieldCheck className="size-4" />
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-xs leading-none">Login HR Admin</span>
                <span className="text-[10px] text-primary-foreground/80 mt-1">
                  Dr. Hendra Gunawan (Manajemen)
                </span>
              </div>
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={loading}
              onClick={() => handleQuickDemo("employee", "199003152015021002")}
              className="gap-2 justify-start h-auto py-2.5 px-3 text-left border-border bg-card hover:bg-accent"
            >
              <div className="size-7 rounded-md bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
                <User className="size-4" />
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-xs leading-none">Login Karyawan</span>
                <span className="text-[10px] text-muted-foreground mt-1">
                  Budi Santoso (Lead Engineer)
                </span>
              </div>
            </Button>
          </CardContent>
        </Card>

        {/* Regular Login Card */}
        <Card className="shadow-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-lg">Masuk dengan Akun</CardTitle>
            <CardDescription className="text-xs">
              Gunakan NIP pegawai atau alamat email perusahaan Anda
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleManualLogin} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="nip" className="text-xs">
                  NIP Pegawai / Email
                </Label>
                <Input
                  id="nip"
                  placeholder="Contoh: 199003152015021002"
                  value={nip}
                  onChange={(e) => setNip(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="pin" className="text-xs">
                    PIN / Password
                  </Label>
                  <span className="text-[11px] text-muted-foreground">Default: 123456 / 000000</span>
                </div>
                <Input
                  id="pin"
                  type="password"
                  placeholder="Masukkan 6 digit PIN Anda"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>

              <Button type="submit" className="w-full gap-2 mt-2" disabled={loading}>
                {loading ? "Memproses..." : "Masuk ke Sistem"}
                <ArrowRight className="size-4" />
              </Button>
            </form>

            <div className="mt-6 pt-4 border-t text-center text-xs text-muted-foreground flex items-center justify-between">
              <Link to="/transparency" className="hover:text-foreground underline">
                Lihat Direktori Karyawan
              </Link>
              <Link to="/" className="hover:text-foreground">
                Kembali ke Beranda
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
