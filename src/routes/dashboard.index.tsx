import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  CalendarCheck,
  CalendarDays,
  Banknote,
  Clock,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  FileText,
  UserCheck,
  Building,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/page-header";
import { useSession } from "@/store/session-store";
import {
  getEmployeeByNip,
  getAttendances,
  getLeaveRequests,
  getPayrolls,
  getAnnouncements,
  recordAttendance,
} from "@/services/employee-service";
import { formatRupiah, formatDateIndo } from "@/lib/employee-data";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/")({
  head: () => ({ meta: [{ title: "Beranda Karyawan · Mrhands Lab App Demo" }] }),
  component: DashboardIndexPage,
});

function DashboardIndexPage() {
  const session = useSession();
  const queryClient = useQueryClient();
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
      );
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const nip = session?.user.nip || "";

  const { data: employee } = useQuery({
    queryKey: ["current-employee", nip],
    queryFn: () => getEmployeeByNip(nip),
    enabled: Boolean(nip),
  });

  const { data: attendances = [] } = useQuery({
    queryKey: ["attendances-list"],
    queryFn: getAttendances,
  });

  const { data: leaves = [] } = useQuery({
    queryKey: ["leaves-list"],
    queryFn: getLeaveRequests,
  });

  const { data: payrolls = [] } = useQuery({
    queryKey: ["payrolls-list"],
    queryFn: getPayrolls,
  });

  const { data: announcements = [] } = useQuery({
    queryKey: ["announcements-list"],
    queryFn: getAnnouncements,
  });

  const todayStr = new Date().toISOString().split("T")[0];
  const todayAttendance = attendances.find(
    (a) => (a.nip === nip || a.employee_id === employee?.id) && a.date === todayStr
  );

  const myLeaves = leaves.filter((l) => l.nip === nip || l.employee_id === employee?.id);
  const myLatestPayroll = payrolls.find((p) => p.nip === nip || p.employee_id === employee?.id);

  const attendanceMutation = useMutation({
    mutationFn: (type: "check_in" | "check_out") => recordAttendance(employee?.id || nip, type),
    onSuccess: (_, type) => {
      queryClient.invalidateQueries({ queryKey: ["attendances-list"] });
      queryClient.invalidateQueries({ queryKey: ["hr-metrics"] });
      toast.success(
        `Berhasil melakukan ${type === "check_in" ? "Presensi Masuk" : "Presensi Pulang"}!`
      );
    },
    onError: () => {
      toast.error("Gagal mencatat presensi");
    },
  });

  return (
    <div className="space-y-6">
      {/* Welcome Greeting Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-primary/80 p-6 sm:p-8 text-primary-foreground shadow-sm">
        <div className="relative z-10 max-w-2xl space-y-2">
          <Badge className="bg-white/20 hover:bg-white/30 text-white border-none text-[11px] mb-1">
            Portal Pegawai Mandiri
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Selamat Datang, {session?.user.name}!
          </h1>
          <p className="text-sm text-primary-foreground/90 leading-relaxed">
            {employee?.position || "Pegawai"} · {employee?.division || "Unit Kerja"}
          </p>
        </div>
        <div className="absolute right-6 top-1/2 -translate-y-1/2 hidden md:block opacity-10">
          <Building className="size-48" />
        </div>
      </div>

      {/* Quick Action: Live Attendance Presensi Hari Ini */}
      <Card className="border-primary/20 bg-card shadow-sm">
        <CardContent className="p-5 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="size-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Clock className="size-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-sm text-foreground">Presensi Kerja Hari Ini</h3>
                <span className="text-xs font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                  {currentTime || "--:--:--"} WIB
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Jam masuk: <strong className="text-foreground">{todayAttendance?.check_in || "Belum tap"}</strong>
                {" · "}
                Jam pulang: <strong className="text-foreground">{todayAttendance?.check_out || "Belum tap"}</strong>
                {todayAttendance?.status && (
                  <span className="ml-2 inline-flex items-center text-xs font-medium text-emerald-600">
                    ({todayAttendance.status})
                  </span>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <Button
              size="sm"
              disabled={Boolean(todayAttendance?.check_in) || attendanceMutation.isPending}
              onClick={() => attendanceMutation.mutate("check_in")}
              className="flex-1 md:flex-initial gap-1.5 text-xs rounded-lg"
            >
              <CalendarCheck className="size-4" />
              {todayAttendance?.check_in ? "Sudah Masuk" : "Presensi Masuk"}
            </Button>

            <Button
              size="sm"
              variant="outline"
              disabled={Boolean(todayAttendance?.check_out) || attendanceMutation.isPending}
              onClick={() => attendanceMutation.mutate("check_out")}
              className="flex-1 md:flex-initial gap-1.5 text-xs rounded-lg border-border"
            >
              <Clock className="size-4" />
              {todayAttendance?.check_out ? "Sudah Pulang" : "Presensi Pulang"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* KPI Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="shadow-sm border-border/80">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Sisa Kuota Cuti Tahunan
            </CardTitle>
            <div className="p-2 bg-purple-500/10 rounded-lg text-purple-600">
              <CalendarDays className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {employee?.remaining_leave ?? 9}
              <span className="text-xs text-muted-foreground font-normal ml-1">dari 12 hari</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-xs">
              <Link to="/dashboard/leaves" className="text-primary hover:underline flex items-center gap-1">
                Ajukan Cuti Baru <ArrowRight className="size-3" />
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border/80">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Tingkat Kehadiran Bulan Ini
            </CardTitle>
            <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-600">
              <CalendarCheck className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">96.5%</div>
            <div className="mt-2 flex items-center justify-between text-xs">
              <Link to="/dashboard/attendance" className="text-primary hover:underline flex items-center gap-1">
                Lihat Log Absensi <ArrowRight className="size-3" />
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border/80">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Gaji Bersih Bulan Terakhir
            </CardTitle>
            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-600">
              <Banknote className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {formatRupiah(myLatestPayroll?.net_salary || employee?.salary || 19500000)}
            </div>
            <div className="mt-2 flex items-center justify-between text-xs">
              <Link to="/dashboard/payroll" className="text-primary hover:underline flex items-center gap-1">
                Buka Slip Gaji <ArrowRight className="size-3" />
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row: Riwayat Cuti & Pengumuman */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Riwayat Pengajuan Cuti Saya */}
        <Card className="shadow-sm border-border/80">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-sm font-semibold">Pengajuan Cuti Terakhir Saya</CardTitle>
              <CardDescription className="text-xs">
                Status verifikasi izin & cuti kerja Anda
              </CardDescription>
            </div>
            <Link to="/dashboard/leaves">
              <Button variant="ghost" size="sm" className="text-xs gap-1">
                Semua Cuti <ArrowRight className="size-3.5" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {myLeaves.slice(0, 3).map((l) => (
              <div key={l.id} className="p-3 rounded-lg border bg-card flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs text-foreground">{l.leave_type}</span>
                    <Badge
                      variant={
                        l.status === "Disetujui"
                          ? "default"
                          : l.status === "Menunggu Persetujuan"
                            ? "secondary"
                            : "destructive"
                      }
                      className="text-[10px]"
                    >
                      {l.status}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1">
                    {formatDateIndo(l.start_date)} - {formatDateIndo(l.end_date)} ({l.total_days} hari)
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">
                    Alasan: {l.reason}
                  </p>
                </div>
              </div>
            ))}
            {myLeaves.length === 0 && (
              <div className="py-6 text-center text-xs text-muted-foreground">
                Belum ada pengajuan cuti yang tercatat.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pengumuman Kantor */}
        <Card className="shadow-sm border-border/80">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Siaran Informasi Kantor</CardTitle>
            <CardDescription className="text-xs">
              Pemberitahuan resmi terkini dari manajemen
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {announcements.slice(0, 2).map((ann) => (
              <div key={ann.id} className="p-3 rounded-lg border bg-card space-y-1">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-[10px] bg-primary/5 text-primary">
                    {ann.category}
                  </Badge>
                  <span className="text-[10px] text-muted-foreground">
                    {formatDateIndo(ann.published_at)}
                  </span>
                </div>
                <h4 className="text-xs font-semibold text-foreground pt-1">{ann.title}</h4>
                <p className="text-[11px] text-muted-foreground line-clamp-2">{ann.content}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
