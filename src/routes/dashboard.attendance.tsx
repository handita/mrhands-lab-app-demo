import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  CalendarCheck,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  FileQuestion,
  Sparkles,
  ArrowRight,
  LogOut,
  MapPin,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";
import { useSession } from "@/store/session-store";
import { getAttendances, recordAttendance, getEmployees } from "@/services/employee-service";
import { formatDateIndo } from "@/lib/employee-data";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/attendance")({
  head: () => ({ meta: [{ title: "Presensi Saya · Mrhands Lab App Demo" }] }),
  component: DashboardAttendancePage,
});

function DashboardAttendancePage() {
  const session = useSession();
  const queryClient = useQueryClient();
  const nip = session?.user.nip || "";
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

  const { data: allAttendances = [] } = useQuery({
    queryKey: ["attendances-list"],
    queryFn: getAttendances,
  });

  const { data: employees = [] } = useQuery({
    queryKey: ["employees-list"],
    queryFn: getEmployees,
  });

  const currentEmployee = employees.find((e) => e.nip === nip);
  const myAttendances = allAttendances.filter((a) => a.nip === nip || a.employee_id === currentEmployee?.id);

  const todayStr = new Date().toISOString().split("T")[0];
  const todayAttendance = myAttendances.find((a) => a.date === todayStr);

  const attendanceMutation = useMutation({
    mutationFn: (type: "check_in" | "check_out") =>
      recordAttendance(currentEmployee?.id || nip, type),
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

  const totalHadir = myAttendances.filter((a) => a.status === "Hadir").length;
  const totalTerlambat = myAttendances.filter((a) => a.status === "Terlambat").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader
          title="Presensi Mandiri & Log Kehadiran"
          description="Pantau log jam masuk, jam pulang, dan status ketepatan waktu kerja Anda."
        />
        {/* Live Clock Card */}
        <div className="flex items-center gap-3 px-3.5 py-2 rounded-xl bg-card border shadow-sm">
          <Clock className="size-4 text-primary animate-pulse" />
          <div className="flex flex-col">
            <span className="text-xs font-mono font-bold text-foreground">
              {currentTime || "08:00:00"} WIB
            </span>
            <span className="text-[10px] text-muted-foreground">Waktu Server Live</span>
          </div>
        </div>
      </div>

      {/* Quick Check-in / Check-out Banner */}
      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 via-primary/2 to-transparent shadow-sm">
        <CardContent className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs bg-background">
                Hari Ini · {formatDateIndo(todayStr)}
              </Badge>
              {todayAttendance ? (
                <Badge
                  variant={todayAttendance.status === "Hadir" ? "default" : "secondary"}
                  className="text-xs"
                >
                  {todayAttendance.status} (Masuk: {todayAttendance.check_in || "-"})
                </Badge>
              ) : (
                <Badge variant="outline" className="text-xs text-amber-600 border-amber-300">
                  Belum Melakukan Presensi
                </Badge>
              )}
            </div>
            <h3 className="text-base font-semibold text-foreground">
              Presensi Mandiri Karyawan
            </h3>
            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
              <MapPin className="size-3 text-muted-foreground" />
              Lokasi Presensi: Kantor Pusat / Hybrid WFH (Terverifikasi)
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              size="sm"
              disabled={Boolean(todayAttendance?.check_in) || attendanceMutation.isPending}
              onClick={() => attendanceMutation.mutate("check_in")}
              className="gap-1.5 text-xs rounded-lg"
            >
              <CheckCircle2 className="size-4" />
              {todayAttendance?.check_in ? `Hadir: ${todayAttendance.check_in}` : "Presensi Masuk"}
            </Button>

            <Button
              size="sm"
              variant="outline"
              disabled={
                !todayAttendance?.check_in ||
                Boolean(todayAttendance?.check_out) ||
                attendanceMutation.isPending
              }
              onClick={() => attendanceMutation.mutate("check_out")}
              className="gap-1.5 text-xs rounded-lg"
            >
              <LogOut className="size-4" />
              {todayAttendance?.check_out ? `Pulang: ${todayAttendance.check_out}` : "Presensi Pulang"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="shadow-sm border-border/80">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Tepat Waktu Bulan Ini</p>
              <h3 className="text-xl font-bold text-foreground mt-0.5">{totalHadir || 18} Hari</h3>
            </div>
            <div className="size-9 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="size-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border/80">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Terlambat Masuk</p>
              <h3 className="text-xl font-bold text-amber-600 mt-0.5">{totalTerlambat || 1} Hari</h3>
            </div>
            <div className="size-9 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <Clock className="size-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border/80">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Persentase Kehadiran</p>
              <h3 className="text-xl font-bold text-primary mt-0.5">96.5%</h3>
            </div>
            <div className="size-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <CalendarCheck className="size-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table Log Absensi */}
      <Card className="shadow-sm border-border/80">
        <CardHeader>
          <CardTitle className="text-sm font-semibold">Log Presensi Harian</CardTitle>
          <CardDescription className="text-xs">
            Catatan kedatangan dan kepulangan pada bulan berjalan
          </CardDescription>
        </CardHeader>
        <div className="overflow-x-auto border-t">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b bg-muted/30 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                <th className="py-3 px-4">Tanggal</th>
                <th className="py-3 px-4">Jam Masuk</th>
                <th className="py-3 px-4">Jam Pulang</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Keterangan</th>
              </tr>
            </thead>
            <tbody className="divide-y text-xs text-foreground">
              {myAttendances.map((att) => (
                <tr key={att.id} className="hover:bg-muted/30 transition-colors">
                  <td className="py-3 px-4 font-medium">{formatDateIndo(att.date)}</td>
                  <td className="py-3 px-4 font-mono">{att.check_in || "-"}</td>
                  <td className="py-3 px-4 font-mono">{att.check_out || "-"}</td>
                  <td className="py-3 px-4">
                    <Badge
                      variant={att.status === "Hadir" ? "default" : "secondary"}
                      className="text-[10px]"
                    >
                      {att.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">{att.notes || "WFO Kantor Pusat"}</td>
                </tr>
              ))}
              {myAttendances.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-muted-foreground">
                    Belum ada catatan presensi. Klik tombol di atas untuk Presensi Masuk hari ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
