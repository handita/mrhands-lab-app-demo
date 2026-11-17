import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  Users,
  FolderOpen,
  DollarSign,
  TrendingUp,
  Activity,
  CheckCircle2,
  Database,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";
import { formatCompact, formatRupiah, formatDateIndo } from "@/lib/starter-data";
import { getStarterDashboardMetrics, getStarterItems } from "@/services/starter-service";
import { isSupabaseConfigured } from "@/lib/supabase";

export const Route = createFileRoute("/admin/")({
  head: () => ({ meta: [{ title: "Overview Admin · Mrhands Lab App Starter" }] }),
  component: AdminOverview,
});

const sampleChartData = [
  { bulan: "Jan", nilai: 12000000, items: 3 },
  { bulan: "Feb", nilai: 18000000, items: 5 },
  { bulan: "Mar", nilai: 24000000, items: 7 },
  { bulan: "Apr", nilai: 32000000, items: 8 },
  { bulan: "Mei", nilai: 45000000, items: 12 },
  { bulan: "Jun", nilai: 55000000, items: 15 },
];

function AdminOverview() {
  const { data: metrics } = useQuery({
    queryKey: ["starter-metrics"],
    queryFn: getStarterDashboardMetrics,
    refetchInterval: 15000,
  });

  const { data: items = [] } = useQuery({
    queryKey: ["starter-items"],
    queryFn: getStarterItems,
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader
          title="Dashboard Administrator"
          description="Ringkasan metrik sistem, status database dual-mode, dan manajemen data starter template."
        />
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className={
              isSupabaseConfigured
                ? "bg-secondary/10 text-secondary border-secondary/20"
                : "bg-primary/10 text-primary border-primary/20"
            }
          >
            <Database className="size-3 mr-1" />
            Mode: {isSupabaseConfigured ? "Supabase Cloud" : "SQLite Local"}
          </Badge>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground">Total Pengguna</CardTitle>
            <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <Users className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {metrics ? metrics.totalUsers : 0}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">Akun terdaftar dalam sistem</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground">Pengguna Aktif</CardTitle>
            <div className="size-8 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center">
              <CheckCircle2 className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {metrics ? metrics.activeUsers : 0}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">Status pengguna aktif</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground">Total Item Starter</CardTitle>
            <div className="size-8 rounded-lg bg-accent/30 text-foreground flex items-center justify-center">
              <FolderOpen className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {metrics ? metrics.totalItems : 0}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">Entitas data terdaftar</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground">Total Nilai Kumulatif</CardTitle>
            <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <DollarSign className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {metrics ? formatCompact(metrics.totalValue) : "Rp 0"}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              {metrics ? formatRupiah(metrics.totalValue) : "Rp 0"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="size-4 text-primary" />
              Tren Pertumbuhan Nilai Proyek (Recharts)
            </CardTitle>
            <CardDescription className="text-xs">
              Contoh implementasi grafik visualisasi responsive dengan tema OKLCH
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sampleChartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="starterColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.25} />
                  <XAxis dataKey="bulan" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${v / 1_000_000}Jt`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--color-card)",
                      borderColor: "var(--color-border)",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                    formatter={(val: any) => [formatRupiah(Number(val)), "Nilai Proyek"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="nilai"
                    stroke="var(--color-primary)"
                    fillOpacity={1}
                    fill="url(#starterColor)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* System Info Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Activity className="size-4 text-secondary" />
              Arsitektur Starter Template
            </CardTitle>
            <CardDescription className="text-xs">
              Komponen dan teknologi bawaan starter kit
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 rounded-lg border border-border/80 bg-muted/20 space-y-1">
              <div className="text-xs font-semibold text-foreground">TanStack Start & Router</div>
              <p className="text-[11px] text-muted-foreground">
                File-based routing dengan type safety penuh di direktori <code>src/routes/</code>.
              </p>
            </div>
            <div className="p-3 rounded-lg border border-border/80 bg-muted/20 space-y-1">
              <div className="text-xs font-semibold text-foreground">Tailwind CSS v4 OKLCH</div>
              <p className="text-[11px] text-muted-foreground">
                Tema modern dengan variabel OKLCH di <code>src/styles.css</code>.
              </p>
            </div>
            <div className="p-3 rounded-lg border border-border/80 bg-muted/20 space-y-1">
              <div className="text-xs font-semibold text-foreground">Dual-Mode Data Engine</div>
              <p className="text-[11px] text-muted-foreground">
                SQLite lokal untuk demo tanpa setup dan Supabase PostgreSQL untuk cloud live.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Starter Items Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Daftar Item Starter</CardTitle>
          <CardDescription className="text-xs">
            Contoh data in-memory/SQLite yang tersinkronisasi dengan state aplikasi
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border/60 text-muted-foreground">
                  <th className="pb-2 font-medium">Judul Proyek / Item</th>
                  <th className="pb-2 font-medium">Kategori</th>
                  <th className="pb-2 font-medium">Nilai</th>
                  <th className="pb-2 font-medium">Author</th>
                  <th className="pb-2 font-medium">Status</th>
                  <th className="pb-2 font-medium">Tanggal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-muted/30">
                    <td className="py-2.5 font-medium text-foreground">{item.title}</td>
                    <td className="py-2.5 text-muted-foreground">{item.category}</td>
                    <td className="py-2.5 font-medium text-foreground">{formatRupiah(item.value)}</td>
                    <td className="py-2.5 text-muted-foreground">{item.author}</td>
                    <td className="py-2.5">
                      <Badge
                        variant="outline"
                        className={
                          item.status === "Aktif"
                            ? "bg-secondary/10 text-secondary border-secondary/20"
                            : "bg-muted text-muted-foreground"
                        }
                      >
                        {item.status}
                      </Badge>
                    </td>
                    <td className="py-2.5 text-muted-foreground">{formatDateIndo(item.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
