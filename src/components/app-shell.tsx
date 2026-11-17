import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { ReactNode, useState } from "react";
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  CalendarDays,
  Banknote,
  Megaphone,
  UserCheck,
  LogOut,
  Menu,
  ShieldCheck,
  FileSpreadsheet,
  Building2,
  RefreshCw,
  BadgeCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { logout, loginAsDemo } from "@/services/auth-service";
import { isSupabaseConfigured, supabaseMode } from "@/lib/supabase";
import { toast } from "sonner";

type NavItem = {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
};

const memberNav: NavItem[] = [
  { to: "/dashboard", label: "Beranda & Presensi", icon: LayoutDashboard, exact: true },
  { to: "/dashboard/attendance", label: "Riwayat Presensi", icon: CalendarCheck },
  { to: "/dashboard/leaves", label: "Pengajuan Cuti", icon: CalendarDays },
  { to: "/dashboard/payroll", label: "Slip Gaji Saya", icon: Banknote },
  { to: "/dashboard/profile", label: "Profil Saya", icon: UserCheck },
  { to: "/transparency", label: "Direktori Tim", icon: Building2 },
];

const adminNav: NavItem[] = [
  { to: "/admin", label: "Dashboard Monitoring", icon: LayoutDashboard, exact: true },
  { to: "/admin/attendance", label: "Monitoring Presensi", icon: CalendarCheck },
  { to: "/admin/employees", label: "Data Karyawan", icon: Users },
  { to: "/admin/leaves", label: "Persetujuan Cuti", icon: CalendarDays },
  { to: "/admin/payroll", label: "Penggajian & Slip", icon: Banknote },
  { to: "/admin/announcements", label: "Pengumuman", icon: Megaphone },
  { to: "/transparency", label: "Statistik Tim", icon: Building2 },
];

export function AppShell({
  children,
  variant,
  userName,
  userEmail,
}: {
  children: ReactNode;
  variant: "member" | "admin";
  userName: string;
  userEmail: string;
}) {
  const nav = variant === "admin" ? adminNav : memberNav;
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleQuickSwitchRole = async () => {
    const targetRole = variant === "admin" ? "employee" : "admin";
    try {
      await loginAsDemo(targetRole);
      toast.success(
        `Beralih mode ke: ${targetRole === "admin" ? "HR Admin (Manajemen)" : "Karyawan (ESS)"}`
      );
      if (targetRole === "admin") {
        await navigate({ to: "/admin" });
      } else {
        await navigate({ to: "/dashboard" });
      }
    } catch {
      toast.error("Gagal mengganti role");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div>
        <aside className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:w-[260px] border-r bg-sidebar">
          <SidebarContent nav={nav} variant={variant} userName={userName} userEmail={userEmail} />
        </aside>

        <div className="lg:pl-[260px] flex flex-col min-h-screen">
          <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b bg-background/80 backdrop-blur px-4 py-3 lg:px-8">
            <div className="flex items-center gap-3 lg:hidden">
              <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                  <Button size="icon" variant="ghost">
                    <Menu className="size-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-[280px]">
                  <SidebarContent
                    nav={nav}
                    variant={variant}
                    userName={userName}
                    userEmail={userEmail}
                    onNavigate={() => setOpen(false)}
                  />
                </SheetContent>
              </Sheet>
              <BrandMark />
            </div>

            <div className="flex-1" />

            <div className="flex items-center gap-3">
              {/* Status Database: SQLite vs Supabase */}
              <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/60 px-2.5 py-1 rounded-full border border-border/50">
                <span
                  className={cn(
                    "inline-block size-2 rounded-full",
                    isSupabaseConfigured ? "bg-blue-500 animate-pulse" : "bg-emerald-500"
                  )}
                />
                <span className="font-medium">
                  {isSupabaseConfigured
                    ? `Mode: Supabase (${supabaseMode})`
                    : "Mode: SQLite (Local Zero-Config)"}
                </span>
              </div>

              {/* Quick Role Switcher Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleQuickSwitchRole}
                className="gap-1.5 text-xs h-8 px-2.5 rounded-lg border-primary/20 hover:bg-primary/5 text-primary"
                title="Ganti sudut pandang tampilan role"
              >
                <RefreshCw className="size-3.5" />
                <span className="hidden md:inline">Ganti Role:</span>
                <span className="font-semibold">
                  {variant === "admin" ? "Ke Karyawan" : "Ke HR Admin"}
                </span>
              </Button>

              {/* User Avatar */}
              <Avatar className="size-8">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
                  {userName
                    .split(" ")
                    .map((s) => s[0])
                    .slice(0, 2)
                    .join("")}
                </AvatarFallback>
              </Avatar>

              <div className="hidden md:flex flex-col text-left">
                <span className="text-xs font-semibold text-foreground line-clamp-1">
                  {userName}
                </span>
                <span className="text-[10px] text-muted-foreground capitalize">
                  {variant === "admin" ? "HR Administrator" : "Karyawan"}
                </span>
              </div>

              {/* Logout Button */}
              <Button
                size="icon"
                variant="ghost"
                onClick={logout}
                className="size-8 text-muted-foreground hover:text-destructive"
                title="Keluar"
              >
                <LogOut className="size-4" />
              </Button>
            </div>
          </header>

          <main className="flex-1 p-4 lg:p-8 space-y-6">{children}</main>
        </div>
      </div>
    </div>
  );
}

function SidebarContent({
  nav,
  variant,
  userName,
  userEmail,
  onNavigate,
}: {
  nav: NavItem[];
  variant: "member" | "admin";
  userName: string;
  userEmail: string;
  onNavigate?: () => void;
}) {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 lg:p-6 border-b">
        <BrandMark />
      </div>

      <div className="px-4 py-3 border-b bg-muted/20">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold tracking-wider uppercase text-muted-foreground">
            {variant === "admin" ? "Modul Manajemen HR" : "Portal Mandiri Karyawan"}
          </span>
          <Badge
            variant={variant === "admin" ? "default" : "secondary"}
            className="text-[10px] h-5 px-1.5"
          >
            {variant === "admin" ? "Admin HR" : "Karyawan"}
          </Badge>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {nav.map((item) => {
          const Icon = item.icon;
          const isActive = item.exact
            ? currentPath === item.to
            : currentPath.startsWith(item.to);

          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
              )}
            >
              <Icon className="size-4 shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t space-y-3">
        <div className="flex items-center gap-3">
          <Avatar className="size-9">
            <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
              {userName
                .split(" ")
                .map((s) => s[0])
                .slice(0, 2)
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col min-w-0 flex-1">
            <p className="text-xs font-medium text-foreground truncate">{userName}</p>
            <p className="text-[10px] text-muted-foreground truncate">{userEmail}</p>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          className="w-full gap-2 text-xs text-muted-foreground hover:text-destructive hover:border-destructive/30"
          onClick={logout}
        >
          <LogOut className="size-3.5" />
          Keluar Sesi
        </Button>
      </div>
    </div>
  );
}

export function BrandMark() {
  return (
    <Link to="/" className="flex items-center gap-2.5 group">
      <div className="size-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground shadow-sm group-hover:scale-105 transition-transform">
        <Users className="size-4.5" />
      </div>
      <div className="flex flex-col">
        <span className="font-bold text-sm tracking-tight text-foreground flex items-center gap-1.5">
          Mrhands Lab
          <span className="text-[10px] bg-primary/10 text-primary font-semibold px-1.5 py-0.2 rounded">
            App Demo
          </span>
        </span>
        <span className="text-[10px] text-muted-foreground">Presensi & Monitoring</span>
      </div>
    </Link>
  );
}
