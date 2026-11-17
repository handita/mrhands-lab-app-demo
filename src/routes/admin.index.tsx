import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  Users,
  CalendarCheck,
  CalendarDays,
  Banknote,
  TrendingUp,
  UserPlus,
  ArrowUpRight,
  Clock,
  Sparkles,
  Building,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";
import {
  formatCompact,
  formatRupiah,
  divisionChartData,
  attendanceTrendData,
  employmentTypeData,
  performanceRatingData,
  formatDateIndo,
} from "@/lib/employee-data";
import {
  getHRDashboardMetrics,
  getEmployees,
  getLeaveRequests,
  getAnnouncements,
} from "@/services/employee-service";

export const Route = createFileRoute("/admin/")({
  head: () => ({ meta: [{ title: "Overview Monitoring · Mrhands Lab App Demo" }] }),
  component: AdminOverview,
});

function AdminOverview() {
  const { data: metrics, isLoading: loadingMetrics } = useQuery({
    queryKey: ["hr-metrics"],
    queryFn: getHRDashboardMetrics,
    refetchInterval: 15000,
  });

  const { data: employees } = useQuery({
    queryKey: ["employees-list"],
    queryFn: getEmployees,
  });

  const { data: leaves } = useQuery({
    queryKey: ["leaves-list"],
    queryFn: getLeaveRequests,
  });

  const { data: announcements } = useQuery({
    queryKey: ["announcements-list"],
    queryFn: getAnnouncements,
  });

  const pendingLeaves = (leaves || []).filter((l) => l.status === "Menunggu Persetujuan");
  const recentEmployees = (employees || []).slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader
          title="Executive HR Dashboard"
          description="Ringkasan metrik sumber daya manusia, kehadiran harian, dan analitik organisasi."
        />
        <div className="flex items-center gap-2">
          <Link to="/admin/employees">
            <Button size="sm" className="gap-2 rounded-lg">
              <UserPlus className="size-4" />
              Kelola Karyawan
            </Button>
          </Link>
          <Link to="/admin/leaves">
            <Button size="sm" variant="outline" className="gap-2 rounded-lg">
              <CalendarDays className="size-4" />
              Review Cuti
              {pendingLeaves.length > 0 && (
                <Badge variant="destructive" className="ml-1 h-5 px-1.5 text-[10px]">
                  {pendingLeaves.length}
                </Badge>
              )}
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-sm border-border/80">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Total Karyawan Aktif
            </CardTitle>
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <Users className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {metrics ? metrics.activeEmployees : "10"}
              <span className="text-xs text-muted-foreground font-normal ml-1">orang</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <span className="text-emerald-600 font-medium">100% data terverifikasi</span>
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border/80">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Kehadiran Hari Ini
            </CardTitle>
            <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-600">
              <CalendarCheck className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {metrics ? `${metrics.attendanceRate}%` : "90%"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {metrics?.presentCount || 9} pegawai hadir tepat waktu
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border/80">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Pengajuan Cuti Pending
            </CardTitle>
            <div className="p-2 bg-amber-500/10 rounded-lg text-amber-600">
              <CalendarDays className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {metrics ? metrics.pendingLeaves : "2"}
              <span className="text-xs text-muted-foreground font-normal ml-1">permohonan</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Menunggu persetujuan manajemen</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border/80">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Total Payroll Bulanan
            </CardTitle>
            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-600">
              <Banknote className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {formatCompact(metrics?.totalPayrollMonthly || 145000000)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Periode aktif berjalan (Nett)</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Charts Row */}
      <div className="grid gap-6 lg:grid-cols-7">
        {/* Chart 1: Komposisi Divisi (BarChart) */}
        <Card className="lg:col-span-4 shadow-sm border-border/80">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-semibold">
                  Komposisi Karyawan per Departemen
                </CardTitle>
                <CardDescription className="text-xs">
                  Distribusi penempatan staf di seluruh unit kerja perusahaan
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-xs">
                Total 6 Unit
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={divisionChartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.25} />
                  <XAxis
                    dataKey="division"
                    tick={{ fontSize: 11, fill: "currentColor" }}
                    angle={-15}
                    textAnchor="end"
                  />
                  <YAxis tick={{ fontSize: 11, fill: "currentColor" }} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--color-card)",
                      borderColor: "var(--color-border)",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  />
                  <Bar
                    dataKey="total"
                    name="Total Karyawan"
                    fill="var(--color-primary)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Chart 2: Status Kepegawaian (Pie / Donut) */}
        <Card className="lg:col-span-3 shadow-sm border-border/80">
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Status Hubungan Kerja</CardTitle>
            <CardDescription className="text-xs">
              Perbandingan pegawai tetap (PKWTT) dan kontrak (PKWT)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[220px] w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--color-card)",
                      borderColor: "var(--color-border)",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  />
                  <Pie
                    data={employmentTypeData}
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {employmentTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-3 gap-2 pt-2 border-t text-center">
              {employmentTypeData.map((item) => (
                <div key={item.name} className="flex flex-col">
                  <span className="text-[11px] text-muted-foreground truncate">{item.name}</span>
                  <span className="text-sm font-bold text-foreground">{item.value} Org</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Second Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Chart 3: Tren Kehadiran & Lembur 6 Bulan (AreaChart) */}
        <Card className="shadow-sm border-border/80">
          <CardHeader>
            <CardTitle className="text-sm font-semibold">
              Tren Tingkat Kehadiran Pegawai (6 Bulan Terakhir)
            </CardTitle>
            <CardDescription className="text-xs">
              Persentase kehadiran tepat waktu dibanding ketidakhadiran & cuti
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[240px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={attendanceTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorKehadiran" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.6} />
                      <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.25} />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis domain={[80, 100]} tick={{ fontSize: 11 }} unit="%" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--color-card)",
                      borderColor: "var(--color-border)",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="kehadiran"
                    name="Tingkat Hadir (%)"
                    stroke="var(--color-primary)"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorKehadiran)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Chart 4: Rating Kinerja (BarChart) */}
        <Card className="shadow-sm border-border/80">
          <CardHeader>
            <CardTitle className="text-sm font-semibold">
              Distribusi Evaluasi Kinerja (KPI Semester)
            </CardTitle>
            <CardDescription className="text-xs">
              Rangkuman capaian sasaran kinerja individu seluruh pegawai
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[240px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={performanceRatingData}
                  layout="vertical"
                  margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} opacity={0.25} />
                  <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} />
                  <YAxis dataKey="rating" type="category" tick={{ fontSize: 11 }} width={120} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--color-card)",
                      borderColor: "var(--color-border)",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  />
                  <Bar
                    dataKey="count"
                    name="Jumlah Pegawai"
                    fill="var(--color-secondary)"
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Employees & Leave Requests Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Direktori Ringkas Pegawai */}
        <Card className="shadow-sm border-border/80">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-sm font-semibold">Daftar Karyawan Terbaru</CardTitle>
              <CardDescription className="text-xs">Profil pegawai terdaftar di sistem</CardDescription>
            </div>
            <Link to="/admin/employees">
              <Button variant="ghost" size="sm" className="text-xs gap-1">
                Lihat Semua <ArrowUpRight className="size-3.5" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentEmployees.map((emp) => (
              <div
                key={emp.id}
                className="flex items-center justify-between p-2.5 rounded-lg border bg-card hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="size-9 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center shrink-0 text-xs">
                    {emp.name
                      .split(" ")
                      .map((s) => s[0])
                      .slice(0, 2)
                      .join("")}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-foreground truncate">{emp.name}</p>
                    <p className="text-[11px] text-muted-foreground truncate">
                      {emp.position} · {emp.division}
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <Badge variant={emp.status === "Aktif" ? "default" : "secondary"} className="text-[10px]">
                    {emp.status}
                  </Badge>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{emp.employment_type}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Pengumuman Internal */}
        <Card className="shadow-sm border-border/80">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-sm font-semibold">Pengumuman & Kebijakan Internal</CardTitle>
              <CardDescription className="text-xs">Siaran informasi penting untuk seluruh unit kerja</CardDescription>
            </div>
            <Link to="/admin/announcements">
              <Button variant="ghost" size="sm" className="text-xs gap-1">
                Kelola <ArrowUpRight className="size-3.5" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {(announcements || []).map((ann) => (
              <div key={ann.id} className="p-3 rounded-lg border bg-card space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="outline" className="text-[10px] bg-primary/5 text-primary">
                    {ann.category}
                  </Badge>
                  <span className="text-[10px] text-muted-foreground">
                    {formatDateIndo(ann.published_at)}
                  </span>
                </div>
                <h4 className="text-xs font-semibold text-foreground">{ann.title}</h4>
                <p className="text-[11px] text-muted-foreground line-clamp-2">{ann.content}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
