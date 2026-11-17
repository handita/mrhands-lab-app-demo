import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  CalendarDays,
  Plus,
  Clock,
  CheckCircle,
  XCircle,
  Calendar,
  Send,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSession } from "@/store/session-store";
import {
  getLeaveRequests,
  submitLeaveRequest,
  getEmployeeByNip,
} from "@/services/employee-service";
import { formatDateIndo, LeaveType } from "@/lib/employee-data";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/leaves")({
  head: () => ({ meta: [{ title: "Pengajuan Cuti · Mrhands Lab App Demo" }] }),
  component: DashboardLeavesPage,
});

function DashboardLeavesPage() {
  const session = useSession();
  const queryClient = useQueryClient();
  const nip = session?.user.nip || "";

  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    leave_type: "Tahunan" as LeaveType,
    start_date: "",
    end_date: "",
    total_days: 1,
    reason: "",
  });

  const { data: employee } = useQuery({
    queryKey: ["current-employee", nip],
    queryFn: () => getEmployeeByNip(nip),
    enabled: Boolean(nip),
  });

  const { data: allLeaves = [] } = useQuery({
    queryKey: ["leaves-list"],
    queryFn: getLeaveRequests,
  });

  const myLeaves = allLeaves.filter((l) => l.nip === nip || l.employee_id === employee?.id);

  const submitMutation = useMutation({
    mutationFn: submitLeaveRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leaves-list"] });
      queryClient.invalidateQueries({ queryKey: ["hr-metrics"] });
      toast.success("Pengajuan cuti berhasil dikirim ke atasan/HR!");
      setModalOpen(false);
      setForm({
        leave_type: "Tahunan",
        start_date: "",
        end_date: "",
        total_days: 1,
        reason: "",
      });
    },
    onError: (err: any) => {
      toast.error(err?.message || "Gagal mengirim pengajuan cuti");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.start_date || !form.end_date || !form.reason.trim()) {
      toast.error("Harap lengkapi tanggal dan alasan cuti");
      return;
    }

    submitMutation.mutate({
      employee_id: employee?.id || nip,
      employee_name: session?.user.name || "Pegawai",
      nip: nip,
      division: employee?.division || "Operasional",
      leave_type: form.leave_type,
      start_date: form.start_date,
      end_date: form.end_date,
      total_days: Number(form.total_days) || 1,
      reason: form.reason,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader
          title="Pengajuan & Kuota Cuti Kerja"
          description="Ajukan permohonan istirahat tahunan, izin sakit, atau alasan penting lainnya."
        />
        <Button size="sm" onClick={() => setModalOpen(true)} className="gap-2 text-xs">
          <Plus className="size-3.5" /> Ajukan Cuti Baru
        </Button>
      </div>

      {/* Leave Balance Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="shadow-sm border-border/80">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Sisa Cuti Tahunan</p>
              <h3 className="text-2xl font-bold text-primary mt-0.5">
                {employee?.remaining_leave ?? 9}{" "}
                <span className="text-xs font-normal text-muted-foreground">/ 12 Hari</span>
              </h3>
            </div>
            <div className="size-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <CalendarDays className="size-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border/80">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Cuti Telah Terpakai</p>
              <h3 className="text-2xl font-bold text-foreground mt-0.5">
                {12 - (employee?.remaining_leave ?? 9)}{" "}
                <span className="text-xs font-normal text-muted-foreground">Hari</span>
              </h3>
            </div>
            <div className="size-9 rounded-lg bg-muted text-muted-foreground flex items-center justify-center">
              <CheckCircle className="size-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border/80">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Permohonan Pending</p>
              <h3 className="text-2xl font-bold text-amber-600 mt-0.5">
                {myLeaves.filter((l) => l.status === "Menunggu Persetujuan").length}
              </h3>
            </div>
            <div className="size-9 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <Clock className="size-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* History Table */}
      <Card className="shadow-sm border-border/80">
        <CardHeader>
          <CardTitle className="text-sm font-semibold">Riwayat Pengajuan Cuti Anda</CardTitle>
          <CardDescription className="text-xs">
            Daftar seluruh permohonan yang pernah Anda ajukan ke manajemen
          </CardDescription>
        </CardHeader>
        <div className="overflow-x-auto border-t">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b bg-muted/30 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                <th className="py-3 px-4">Tgl Pengajuan</th>
                <th className="py-3 px-4">Jenis Cuti</th>
                <th className="py-3 px-4">Periode</th>
                <th className="py-3 px-4">Durasi</th>
                <th className="py-3 px-4">Alasan</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y text-xs text-foreground">
              {myLeaves.map((l) => (
                <tr key={l.id} className="hover:bg-muted/30 transition-colors">
                  <td className="py-3 px-4 text-muted-foreground">{formatDateIndo(l.submitted_at)}</td>
                  <td className="py-3 px-4">
                    <Badge variant="outline" className="text-[10px]">
                      {l.leave_type}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 font-medium">
                    {formatDateIndo(l.start_date)} - {formatDateIndo(l.end_date)}
                  </td>
                  <td className="py-3 px-4">{l.total_days} hari kerja</td>
                  <td className="py-3 px-4 text-muted-foreground max-w-xs">{l.reason}</td>
                  <td className="py-3 px-4 text-right">
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
                  </td>
                </tr>
              ))}
              {myLeaves.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-muted-foreground">
                    Belum ada pengajuan cuti yang tercatat. Klik tombol "Ajukan Cuti Baru" di atas.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal Form Pengajuan Cuti */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base">Formulir Pengajuan Cuti</DialogTitle>
            <DialogDescription className="text-xs">
              Lengkapi rincian tanggal dan alasan cuti kerja Anda
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-3 pt-2 text-xs">
            <div className="space-y-1">
              <Label className="text-xs">Jenis Cuti</Label>
              <Select
                value={form.leave_type}
                onValueChange={(val: any) => setForm({ ...form, leave_type: val })}
              >
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Tahunan">Cuti Tahunan</SelectItem>
                  <SelectItem value="Sakit">Cuti Sakit (Disertai Surat Dokter)</SelectItem>
                  <SelectItem value="Melahirkan">Cuti Melahirkan / Bersalin</SelectItem>
                  <SelectItem value="Khusus / Alasan Penting">Cuti Alasan Penting / Menikah</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="start" className="text-xs">
                  Tanggal Mulai
                </Label>
                <Input
                  id="start"
                  type="date"
                  required
                  value={form.start_date}
                  onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="end" className="text-xs">
                  Tanggal Selesai
                </Label>
                <Input
                  id="end"
                  type="date"
                  required
                  value={form.end_date}
                  onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="days" className="text-xs">
                Jumlah Hari Kerja
              </Label>
              <Input
                id="days"
                type="number"
                min={1}
                max={12}
                required
                value={form.total_days}
                onChange={(e) => setForm({ ...form, total_days: Number(e.target.value) })}
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="reason" className="text-xs">
                Alasan / Keperluan Cuti
              </Label>
              <Textarea
                id="reason"
                required
                rows={3}
                placeholder="Contoh: Mengikuti acara keluarga di luar kota"
                value={form.reason}
                onChange={(e) => setForm({ ...form, reason: e.target.value })}
              />
            </div>

            <DialogFooter className="pt-3">
              <Button type="button" variant="outline" size="sm" onClick={() => setModalOpen(false)}>
                Batal
              </Button>
              <Button type="submit" size="sm" disabled={submitMutation.isPending} className="gap-1.5">
                <Send className="size-3.5" />
                {submitMutation.isPending ? "Mengirim..." : "Kirim Pengajuan"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
