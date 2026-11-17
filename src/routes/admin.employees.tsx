import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Users,
  Search,
  Plus,
  Filter,
  Download,
  Eye,
  Edit,
  Mail,
  Phone,
  Building,
  GraduationCap,
  CreditCard,
  Calendar,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
  Employee,
  formatRupiah,
  formatDateIndo,
  getStatusBadgeVariant,
} from "@/lib/employee-data";
import { getEmployees, addEmployee } from "@/services/employee-service";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/employees")({
  head: () => ({ meta: [{ title: "Data Karyawan · Mrhands Lab App Demo" }] }),
  component: AdminEmployeesPage,
});

function AdminEmployeesPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [selectedDivision, setSelectedDivision] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [activeEmployee, setActiveEmployee] = useState<Employee | null>(null);

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newEmp, setNewEmp] = useState<Omit<Employee, "id">>({
    nip: "",
    name: "",
    email: "",
    phone: "",
    role: "member",
    division: "Teknologi Informasi",
    position: "Software Developer",
    employment_type: "Tetap",
    status: "Aktif",
    join_date: new Date().toISOString().split("T")[0],
    salary: 12000000,
    remaining_leave: 12,
    bank_name: "BCA",
    bank_account: "",
    education: "S1 Teknik Informatika",
    address: "",
  });

  const { data: employees = [], isLoading } = useQuery({
    queryKey: ["employees-list"],
    queryFn: getEmployees,
  });

  const createMutation = useMutation({
    mutationFn: addEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees-list"] });
      queryClient.invalidateQueries({ queryKey: ["hr-metrics"] });
      toast.success("Karyawan baru berhasil ditambahkan!");
      setAddModalOpen(false);
    },
    onError: (err: any) => {
      toast.error(err?.message || "Gagal menambahkan karyawan");
    },
  });

  const filteredEmployees = employees.filter((emp) => {
    const matchSearch =
      emp.name.toLowerCase().includes(search.toLowerCase()) ||
      emp.nip.toLowerCase().includes(search.toLowerCase()) ||
      emp.position.toLowerCase().includes(search.toLowerCase());
    const matchDivision = selectedDivision === "all" || emp.division === selectedDivision;
    const matchStatus = selectedStatus === "all" || emp.status === selectedStatus;
    return matchSearch && matchDivision && matchStatus;
  });

  const handleExportCSV = () => {
    const headers = "NIP,Nama,Email,No HP,Divisi,Jabatan,Status,Jenis,Gaji,Sisa Cuti\n";
    const rows = filteredEmployees
      .map(
        (e) =>
          `"${e.nip}","${e.name}","${e.email}","${e.phone}","${e.division}","${e.position}","${e.status}","${e.employment_type}",${e.salary},${e.remaining_leave}`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Data_Karyawan_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Data berhasil diekspor ke CSV!");
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmp.nip.trim() || !newEmp.name.trim() || !newEmp.email.trim()) {
      toast.error("Lengkapi NIP, Nama, dan Email");
      return;
    }
    createMutation.mutate(newEmp);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader
          title="Direktori Data Karyawan"
          description="Kelola seluruh berkas informasi, riwayat kepegawaian, jabatan, dan dokumen staf."
        />
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExportCSV} className="gap-2 text-xs">
            <Download className="size-3.5" /> Export CSV
          </Button>
          <Button size="sm" onClick={() => setAddModalOpen(true)} className="gap-2 text-xs">
            <Plus className="size-3.5" /> Tambah Karyawan
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <Card className="shadow-sm border-border/80">
        <CardContent className="p-4 flex flex-col md:flex-row gap-3 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Cari berdasarkan nama, NIP, atau jabatan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 text-xs"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <Select value={selectedDivision} onValueChange={setSelectedDivision}>
              <SelectTrigger className="h-9 text-xs w-[180px]">
                <SelectValue placeholder="Semua Divisi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Divisi</SelectItem>
                <SelectItem value="Teknologi Informasi">Teknologi Informasi</SelectItem>
                <SelectItem value="Sumber Daya Manusia (SDM)">SDM & Operasional</SelectItem>
                <SelectItem value="Keuangan & Akuntansi">Keuangan</SelectItem>
                <SelectItem value="Pemasaran & Komunikasi">Pemasaran</SelectItem>
                <SelectItem value="Layanan Pelanggan">Layanan Pelanggan</SelectItem>
                <SelectItem value="Operasional">Operasional</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="h-9 text-xs w-[140px]">
                <SelectValue placeholder="Semua Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="Aktif">Aktif</SelectItem>
                <SelectItem value="Cuti">Cuti</SelectItem>
                <SelectItem value="Nonaktif">Nonaktif</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Employee Table */}
      <Card className="shadow-sm border-border/80 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b bg-muted/30 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                <th className="py-3 px-4">Pegawai</th>
                <th className="py-3 px-4">Divisi & Jabatan</th>
                <th className="py-3 px-4">Status & Jenis</th>
                <th className="py-3 px-4">Tgl Bergabung</th>
                <th className="py-3 px-4">Sisa Cuti</th>
                <th className="py-3 px-4">Gaji Pokok</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y text-xs text-foreground">
              {filteredEmployees.map((emp) => (
                <tr key={emp.id} className="hover:bg-muted/30 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="size-9 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center shrink-0">
                        {emp.name
                          .split(" ")
                          .map((s) => s[0])
                          .slice(0, 2)
                          .join("")}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{emp.name}</p>
                        <p className="text-[11px] text-muted-foreground font-mono">
                          NIP: {emp.nip}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-medium">{emp.position}</p>
                    <p className="text-[11px] text-muted-foreground">{emp.division}</p>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex flex-col gap-1 items-start">
                      <Badge variant={emp.status === "Aktif" ? "default" : "secondary"} className="text-[10px]">
                        {emp.status}
                      </Badge>
                      <span className="text-[10px] text-muted-foreground">{emp.employment_type}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">{formatDateIndo(emp.join_date)}</td>
                  <td className="py-3 px-4">
                    <span className="font-semibold">{emp.remaining_leave}</span>{" "}
                    <span className="text-[11px] text-muted-foreground">hari</span>
                  </td>
                  <td className="py-3 px-4 font-mono font-medium">{formatRupiah(emp.salary)}</td>
                  <td className="py-3 px-4 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setActiveEmployee(emp);
                        setDetailModalOpen(true);
                      }}
                      className="gap-1 text-xs h-7 px-2"
                    >
                      <Eye className="size-3.5" /> Detail
                    </Button>
                  </td>
                </tr>
              ))}
              {filteredEmployees.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-muted-foreground">
                    Tidak ada data karyawan yang sesuai dengan kriteria filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal Detail Karyawan */}
      <Dialog open={detailModalOpen} onOpenChange={setDetailModalOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-base">Informasi Lengkap Pegawai</DialogTitle>
            <DialogDescription className="text-xs">
              Profil resmi, kontak, dan riwayat penempatan kerja
            </DialogDescription>
          </DialogHeader>

          {activeEmployee && (
            <div className="space-y-4 pt-2 text-xs">
              <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/40 border">
                <div className="size-14 rounded-full bg-primary text-primary-foreground font-bold text-lg flex items-center justify-center">
                  {activeEmployee.name
                    .split(" ")
                    .map((s) => s[0])
                    .slice(0, 2)
                    .join("")}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground">{activeEmployee.name}</h3>
                  <p className="text-muted-foreground font-mono">NIP: {activeEmployee.nip}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-[10px]">
                      {activeEmployee.division}
                    </Badge>
                    <Badge variant="default" className="text-[10px]">
                      {activeEmployee.employment_type}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3 rounded-lg border bg-card space-y-1">
                  <span className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                    <Mail className="size-3.5" /> Email Perusahaan
                  </span>
                  <p className="font-medium text-foreground">{activeEmployee.email}</p>
                </div>

                <div className="p-3 rounded-lg border bg-card space-y-1">
                  <span className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                    <Phone className="size-3.5" /> Nomor WhatsApp/HP
                  </span>
                  <p className="font-medium text-foreground">{activeEmployee.phone}</p>
                </div>

                <div className="p-3 rounded-lg border bg-card space-y-1">
                  <span className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                    <CreditCard className="size-3.5" /> Rekening Payroll
                  </span>
                  <p className="font-medium text-foreground">
                    {activeEmployee.bank_name} - {activeEmployee.bank_account}
                  </p>
                </div>

                <div className="p-3 rounded-lg border bg-card space-y-1">
                  <span className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                    <Calendar className="size-3.5" /> Tanggal Masuk
                  </span>
                  <p className="font-medium text-foreground">
                    {formatDateIndo(activeEmployee.join_date)}
                  </p>
                </div>

                <div className="p-3 rounded-lg border bg-card space-y-1">
                  <span className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                    <GraduationCap className="size-3.5" /> Pendidikan Terakhir
                  </span>
                  <p className="font-medium text-foreground">{activeEmployee.education || "-"}</p>
                </div>

                <div className="p-3 rounded-lg border bg-card space-y-1">
                  <span className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                    <CheckCircle className="size-3.5" /> Sisa Kuota Cuti Tahunan
                  </span>
                  <p className="font-medium text-foreground">
                    {activeEmployee.remaining_leave} Hari Kerja
                  </p>
                </div>
              </div>

              {activeEmployee.address && (
                <div className="p-3 rounded-lg border bg-card space-y-1">
                  <span className="text-[11px] text-muted-foreground">Alamat Domisili</span>
                  <p className="font-medium text-foreground">{activeEmployee.address}</p>
                </div>
              )}
            </div>
          )}

          <DialogFooter className="pt-2">
            <Button variant="outline" size="sm" onClick={() => setDetailModalOpen(false)}>
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Tambah Karyawan Baru */}
      <Dialog open={addModalOpen} onOpenChange={setAddModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-base">Tambah Karyawan Baru</DialogTitle>
            <DialogDescription className="text-xs">
              Masukkan data pokok kepegawaian untuk didaftarkan ke sistem
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddSubmit} className="space-y-3 pt-2 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="nip" className="text-xs">
                  NIP Pegawai
                </Label>
                <Input
                  id="nip"
                  required
                  placeholder="Contoh: 1995..."
                  value={newEmp.nip}
                  onChange={(e) => setNewEmp({ ...newEmp, nip: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="name" className="text-xs">
                  Nama Lengkap
                </Label>
                <Input
                  id="name"
                  required
                  placeholder="Nama & Gelar"
                  value={newEmp.name}
                  onChange={(e) => setNewEmp({ ...newEmp, name: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="email" className="text-xs">
                  Email Kantor
                </Label>
                <Input
                  id="email"
                  type="email"
                  required
                  placeholder="nama@perusahaan.co.id"
                  value={newEmp.email}
                  onChange={(e) => setNewEmp({ ...newEmp, email: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="phone" className="text-xs">
                  Nomor HP
                </Label>
                <Input
                  id="phone"
                  required
                  placeholder="0812..."
                  value={newEmp.phone}
                  onChange={(e) => setNewEmp({ ...newEmp, phone: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Divisi / Unit</Label>
                <Select
                  value={newEmp.division}
                  onValueChange={(val) => setNewEmp({ ...newEmp, division: val })}
                >
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Teknologi Informasi">Teknologi Informasi</SelectItem>
                    <SelectItem value="Sumber Daya Manusia (SDM)">SDM & Operasional</SelectItem>
                    <SelectItem value="Keuangan & Akuntansi">Keuangan</SelectItem>
                    <SelectItem value="Pemasaran & Komunikasi">Pemasaran</SelectItem>
                    <SelectItem value="Layanan Pelanggan">Layanan Pelanggan</SelectItem>
                    <SelectItem value="Operasional">Operasional</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label htmlFor="pos" className="text-xs">
                  Jabatan / Posisi
                </Label>
                <Input
                  id="pos"
                  required
                  value={newEmp.position}
                  onChange={(e) => setNewEmp({ ...newEmp, position: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Status Hubungan Kerja</Label>
                <Select
                  value={newEmp.employment_type}
                  onValueChange={(val: any) => setNewEmp({ ...newEmp, employment_type: val })}
                >
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Tetap">Tetap (PKWTT)</SelectItem>
                    <SelectItem value="Kontrak">Kontrak (PKWT)</SelectItem>
                    <SelectItem value="Probasi">Probasi</SelectItem>
                    <SelectItem value="Magang">Magang</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label htmlFor="sal" className="text-xs">
                  Gaji Pokok (IDR)
                </Label>
                <Input
                  id="sal"
                  type="number"
                  required
                  value={newEmp.salary}
                  onChange={(e) => setNewEmp({ ...newEmp, salary: Number(e.target.value) })}
                />
              </div>
            </div>

            <DialogFooter className="pt-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setAddModalOpen(false)}
              >
                Batal
              </Button>
              <Button type="submit" size="sm" disabled={createMutation.isPending}>
                {createMutation.isPending ? "Menyimpan..." : "Simpan Karyawan"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
