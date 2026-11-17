import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  CalendarCheck,
  Search,
  Filter,
  Download,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileQuestion,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAttendances } from "@/services/employee-service";
import { formatDateIndo, AttendanceStatus } from "@/lib/employee-data";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/attendance")({
  head: () => ({ meta: [{ title: "Monitoring Presensi · Mrhands Lab App Demo" }] }),
  component: AdminAttendancePage,
});

function AdminAttendancePage() {
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const { data: attendances = [] } = useQuery({
    queryKey: ["attendances-list"],
    queryFn: getAttendances,
  });

  const filtered = attendances.filter((att) => {
    const matchSearch =
      att.employee_name.toLowerCase().includes(search.toLowerCase()) ||
      att.nip.toLowerCase().includes(search.toLowerCase()) ||
      att.division.toLowerCase().includes(search.toLowerCase());
    const matchStatus = selectedStatus === "all" || att.status === selectedStatus;
    return matchSearch && matchStatus;
  });

  const countHadir = attendances.filter((a) => a.status === "Hadir").length;
  const countTerlambat = attendances.filter((a) => a.status === "Terlambat").length;
  const countIzin = attendances.filter((a) => a.status === "Izin" || a.status === "Sakit").length;
  const countCuti = attendances.filter((a) => a.status === "Cuti").length;

  const handleExportCSV = () => {
    const headers = "Tanggal,NIP,Nama,Divisi,Jam Masuk,Jam Keluar,Status,Catatan\n";
    const rows = filtered
      .map(
        (a) =>
          `"${a.date}","${a.nip}","${a.employee_name}","${a.division}","${a.check_in || "-"}","${a.check_out || "-"}","${a.status}","${a.notes || "-"}"`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Rekap_Presensi_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Rekap presensi berhasil diekspor!");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader
          title="Manajemen Presensi & Absensi"
          description="Pemantauan log kehadiran harian pegawai, jam masuk/pulang, dan catatan dispensasi."
        />
        <Button variant="outline" size="sm" onClick={handleExportCSV} className="gap-2 text-xs">
          <Download className="size-3.5" /> Export Rekap Presensi
        </Button>
      </div>

      {/* Attendance Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-sm border-border/80">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Tepat Waktu</p>
              <h3 className="text-xl font-bold text-foreground mt-0.5">{countHadir} Orang</h3>
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
              <h3 className="text-xl font-bold text-amber-600 mt-0.5">{countTerlambat} Orang</h3>
            </div>
            <div className="size-9 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <Clock className="size-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border/80">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Izin & Sakit</p>
              <h3 className="text-xl font-bold text-blue-600 mt-0.5">{countIzin} Orang</h3>
            </div>
            <div className="size-9 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center">
              <FileQuestion className="size-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border/80">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Sedang Cuti</p>
              <h3 className="text-xl font-bold text-foreground mt-0.5">{countCuti} Orang</h3>
            </div>
            <div className="size-9 rounded-lg bg-purple-500/10 text-purple-600 flex items-center justify-center">
              <Calendar className="size-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter and Table */}
      <Card className="shadow-sm border-border/80">
        <CardContent className="p-4 flex flex-col sm:flex-row gap-3 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Cari nama pegawai atau divisi..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 text-xs"
            />
          </div>

          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="h-9 text-xs w-[160px]">
              <SelectValue placeholder="Semua Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="Hadir">Tepat Waktu (Hadir)</SelectItem>
              <SelectItem value="Terlambat">Terlambat</SelectItem>
              <SelectItem value="Izin">Izin / Dinas</SelectItem>
              <SelectItem value="Sakit">Sakit</SelectItem>
              <SelectItem value="Cuti">Cuti</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>

        <div className="overflow-x-auto border-t">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b bg-muted/30 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                <th className="py-3 px-4">Pegawai</th>
                <th className="py-3 px-4">Tanggal</th>
                <th className="py-3 px-4">Jam Masuk</th>
                <th className="py-3 px-4">Jam Keluar</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Keterangan / Catatan</th>
              </tr>
            </thead>
            <tbody className="divide-y text-xs text-foreground">
              {filtered.map((att) => (
                <tr key={att.id} className="hover:bg-muted/30 transition-colors">
                  <td className="py-3 px-4">
                    <p className="font-semibold">{att.employee_name}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {att.division} · NIP: {att.nip}
                    </p>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">{formatDateIndo(att.date)}</td>
                  <td className="py-3 px-4 font-mono font-medium">{att.check_in || "-"}</td>
                  <td className="py-3 px-4 font-mono font-medium">{att.check_out || "-"}</td>
                  <td className="py-3 px-4">
                    <Badge
                      variant={
                        att.status === "Hadir"
                          ? "default"
                          : att.status === "Terlambat"
                            ? "secondary"
                            : "outline"
                      }
                      className="text-[10px]"
                    >
                      {att.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">{att.notes || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
