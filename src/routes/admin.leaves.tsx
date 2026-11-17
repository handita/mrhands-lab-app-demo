import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  CalendarDays,
  Search,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
  Check,
  X,
  FileText,
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
import { getLeaveRequests, reviewLeaveRequest } from "@/services/employee-service";
import { formatDateIndo, LeaveRequest } from "@/lib/employee-data";
import { useSession } from "@/store/session-store";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/leaves")({
  head: () => ({ meta: [{ title: "Persetujuan Cuti · Mrhands Lab App Demo" }] }),
  component: AdminLeavesPage,
});

function AdminLeavesPage() {
  const queryClient = useQueryClient();
  const session = useSession();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: leaves = [] } = useQuery({
    queryKey: ["leaves-list"],
    queryFn: getLeaveRequests,
  });

  const reviewMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: "Disetujui" | "Ditolak" }) =>
      reviewLeaveRequest(id, status, session?.user.name || "HR Administrator"),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["leaves-list"] });
      queryClient.invalidateQueries({ queryKey: ["hr-metrics"] });
      toast.success(
        `Permohonan cuti berhasil ${variables.status === "Disetujui" ? "disetujui" : "ditolak"}`
      );
    },
    onError: (err: any) => {
      toast.error(err?.message || "Gagal memproses permohonan");
    },
  });

  const filtered = leaves.filter((l) => {
    const matchSearch =
      l.employee_name.toLowerCase().includes(search.toLowerCase()) ||
      l.nip.toLowerCase().includes(search.toLowerCase()) ||
      l.division.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || l.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const pendingCount = leaves.filter((l) => l.status === "Menunggu Persetujuan").length;
  const approvedCount = leaves.filter((l) => l.status === "Disetujui").length;
  const rejectedCount = leaves.filter((l) => l.status === "Ditolak").length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Persetujuan & Manajemen Cuti"
        description="Verifikasi permohonan izin dan cuti kerja yang diajukan oleh seluruh pegawai."
      />

      {/* Summary KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="shadow-sm border-border/80">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Menunggu Persetujuan</p>
              <h3 className="text-xl font-bold text-amber-600 mt-0.5">{pendingCount} Permohonan</h3>
            </div>
            <div className="size-9 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <Clock className="size-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border/80">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Telah Disetujui</p>
              <h3 className="text-xl font-bold text-emerald-600 mt-0.5">{approvedCount} Selesai</h3>
            </div>
            <div className="size-9 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <CheckCircle className="size-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border/80">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Permohonan Ditolak</p>
              <h3 className="text-xl font-bold text-destructive mt-0.5">{rejectedCount} Berkas</h3>
            </div>
            <div className="size-9 rounded-lg bg-destructive/10 text-destructive flex items-center justify-center">
              <XCircle className="size-5" />
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

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-9 text-xs w-[180px]">
              <SelectValue placeholder="Semua Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="Menunggu Persetujuan">Menunggu Persetujuan</SelectItem>
              <SelectItem value="Disetujui">Disetujui</SelectItem>
              <SelectItem value="Ditolak">Ditolak</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>

        <div className="overflow-x-auto border-t">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b bg-muted/30 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                <th className="py-3 px-4">Pegawai</th>
                <th className="py-3 px-4">Jenis Cuti</th>
                <th className="py-3 px-4">Periode & Durasi</th>
                <th className="py-3 px-4">Alasan / Keperluan</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y text-xs text-foreground">
              {filtered.map((leave) => (
                <tr key={leave.id} className="hover:bg-muted/30 transition-colors">
                  <td className="py-3 px-4">
                    <p className="font-semibold">{leave.employee_name}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {leave.division} · NIP: {leave.nip}
                    </p>
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant="outline" className="text-[10px]">
                      {leave.leave_type}
                    </Badge>
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-medium">
                      {formatDateIndo(leave.start_date)} - {formatDateIndo(leave.end_date)}
                    </p>
                    <p className="text-[11px] text-muted-foreground">{leave.total_days} hari kerja</p>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground max-w-xs">{leave.reason}</td>
                  <td className="py-3 px-4">
                    <Badge
                      variant={
                        leave.status === "Disetujui"
                          ? "default"
                          : leave.status === "Menunggu Persetujuan"
                            ? "secondary"
                            : "destructive"
                      }
                      className="text-[10px]"
                    >
                      {leave.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-right">
                    {leave.status === "Menunggu Persetujuan" ? (
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => reviewMutation.mutate({ id: leave.id, status: "Disetujui" })}
                          className="h-7 px-2.5 text-[11px] gap-1 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 border-emerald-200"
                        >
                          <Check className="size-3" /> Setujui
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => reviewMutation.mutate({ id: leave.id, status: "Ditolak" })}
                          className="h-7 px-2.5 text-[11px] gap-1 text-destructive hover:bg-destructive/10 border-destructive/20"
                        >
                          <X className="size-3" /> Tolak
                        </Button>
                      </div>
                    ) : (
                      <span className="text-[10px] text-muted-foreground">
                        {leave.reviewed_by ? `Oleh: ${leave.reviewed_by.split(",")[0]}` : "Telah diproses"}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
