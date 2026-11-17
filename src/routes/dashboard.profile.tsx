import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  UserCheck,
  Mail,
  Phone,
  Building,
  CreditCard,
  Calendar,
  GraduationCap,
  MapPin,
  Shield,
  FileBadge,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/page-header";
import { useSession } from "@/store/session-store";
import { getEmployeeByNip } from "@/services/employee-service";
import { formatDateIndo, formatRupiah } from "@/lib/employee-data";

export const Route = createFileRoute("/dashboard/profile")({
  head: () => ({ meta: [{ title: "Profil Saya · Mrhands Lab App Demo" }] }),
  component: DashboardProfilePage,
});

function DashboardProfilePage() {
  const session = useSession();
  const nip = session?.user.nip || "";

  const { data: employee } = useQuery({
    queryKey: ["current-employee", nip],
    queryFn: () => getEmployeeByNip(nip),
    enabled: Boolean(nip),
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Biodata & Profil Kepegawaian"
        description="Informasi personal, riwayat penempatan, kontak darurat, dan rekening payroll."
      />

      <div className="grid gap-6 md:grid-cols-3">
        {/* Profile Card Summary */}
        <Card className="md:col-span-1 shadow-sm border-border/80 text-center">
          <CardContent className="pt-6 pb-6 flex flex-col items-center">
            <div className="size-24 rounded-full bg-primary text-primary-foreground font-bold text-2xl flex items-center justify-center shadow-md mb-4">
              {(session?.user.name || "Pegawai")
                .split(" ")
                .map((s) => s[0])
                .slice(0, 2)
                .join("")}
            </div>

            <h3 className="font-bold text-base text-foreground">{session?.user.name}</h3>
            <p className="text-xs text-muted-foreground font-mono mt-0.5">NIP: {nip}</p>

            <div className="flex flex-wrap gap-1.5 justify-center mt-3">
              <Badge variant="default" className="text-[10px]">
                {employee?.status || "Aktif"}
              </Badge>
              <Badge variant="outline" className="text-[10px]">
                {employee?.employment_type || "Pegawai Tetap"}
              </Badge>
            </div>

            <div className="w-full border-t mt-6 pt-4 space-y-2.5 text-left text-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Divisi</span>
                <span className="font-medium text-foreground">{employee?.division || "-"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Jabatan</span>
                <span className="font-medium text-foreground">{employee?.position || "-"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Tanggal Masuk</span>
                <span className="font-medium text-foreground">
                  {formatDateIndo(employee?.join_date || "2020-01-01")}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Sisa Kuota Cuti</span>
                <span className="font-semibold text-primary">{employee?.remaining_leave ?? 9} Hari</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Sections */}
        <div className="md:col-span-2 space-y-6">
          <Card className="shadow-sm border-border/80">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Kontak & Identitas Pribadi</CardTitle>
              <CardDescription className="text-xs">
                Data komunikasi resmi yang terdaftar pada sistem kepegawaian
              </CardDescription>
            </CardHeader>
            <CardContent className="grid sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 rounded-lg border bg-card space-y-1">
                <span className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                  <Mail className="size-3.5 text-primary" /> Email Kantor
                </span>
                <p className="font-medium text-foreground">{session?.user.email || employee?.email}</p>
              </div>

              <div className="p-3 rounded-lg border bg-card space-y-1">
                <span className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                  <Phone className="size-3.5 text-primary" /> Nomor Telepon / WA
                </span>
                <p className="font-medium text-foreground">{employee?.phone || "0812-3456-7890"}</p>
              </div>

              <div className="p-3 rounded-lg border bg-card space-y-1">
                <span className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                  <GraduationCap className="size-3.5 text-primary" /> Pendidikan Terakhir
                </span>
                <p className="font-medium text-foreground">
                  {employee?.education || "S1 Teknik Informatika"}
                </p>
              </div>

              <div className="p-3 rounded-lg border bg-card space-y-1">
                <span className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                  <CreditCard className="size-3.5 text-primary" /> Rekening Gaji (Payroll)
                </span>
                <p className="font-medium text-foreground">
                  {employee?.bank_name || "BCA"} - {employee?.bank_account || "5430098765"}
                </p>
              </div>

              <div className="sm:col-span-2 p-3 rounded-lg border bg-card space-y-1">
                <span className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                  <MapPin className="size-3.5 text-primary" /> Alamat Domisili
                </span>
                <p className="font-medium text-foreground">
                  {employee?.address || "Jl. Veteran No. 45, Jakarta"}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-border/80">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Status Hak & Tunjangan Pegawai</CardTitle>
              <CardDescription className="text-xs">
                Fasilitas dan kompensasi kerja yang berlaku
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-lg border bg-card">
                <div>
                  <p className="font-semibold text-foreground">BPJS Ketenagakerjaan & Kesehatan</p>
                  <p className="text-[11px] text-muted-foreground">JKK, JKM, JHT, JP, dan JKN</p>
                </div>
                <Badge variant="default" className="text-[10px]">
                  Aktif Terdaftar
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border bg-card">
                <div>
                  <p className="font-semibold text-foreground">Skema Kerja Fleksibel (Hybrid)</p>
                  <p className="text-[11px] text-muted-foreground">3 Hari WFO, 2 Hari WFH</p>
                </div>
                <Badge variant="outline" className="text-[10px]">
                  Berlaku
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
