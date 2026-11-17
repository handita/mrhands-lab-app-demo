import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Banknote, Eye, Printer, Download, Calendar, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { useSession } from "@/store/session-store";
import { getPayrolls, getEmployeeByNip } from "@/services/employee-service";
import { formatRupiah, PayrollRecord, formatDateIndo } from "@/lib/employee-data";

export const Route = createFileRoute("/dashboard/payroll")({
  head: () => ({ meta: [{ title: "Slip Gaji Saya · Mrhands Lab App Demo" }] }),
  component: DashboardPayrollPage,
});

function DashboardPayrollPage() {
  const session = useSession();
  const nip = session?.user.nip || "";
  const [activeSlip, setActiveSlip] = useState<PayrollRecord | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const { data: employee } = useQuery({
    queryKey: ["current-employee", nip],
    queryFn: () => getEmployeeByNip(nip),
    enabled: Boolean(nip),
  });

  const { data: allPayrolls = [] } = useQuery({
    queryKey: ["payrolls-list"],
    queryFn: getPayrolls,
  });

  const myPayrolls = allPayrolls.filter(
    (p) => p.nip === nip || p.employee_id === employee?.id
  );

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Riwayat Slip Gaji & Kompensasi Saya"
        description="Dokumen bukti pembayaran gaji, rincian tunjangan, potongan iuran, dan take-home pay resmi."
      />

      {/* Info Banner */}
      <Card className="border-primary/20 bg-primary/5 shadow-sm">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <ShieldCheck className="size-5" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-foreground">
                Rekening Penggajian Terdaftar: {employee?.bank_name || "BCA"} -{" "}
                <span className="font-mono">{employee?.bank_account || "5430098765"}</span>
              </h4>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Gaji disalurkan otomatis setiap tanggal 25 setiap bulan berjalan.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payroll Table */}
      <Card className="shadow-sm border-border/80">
        <CardHeader>
          <CardTitle className="text-sm font-semibold">Daftar Periode Penggajian</CardTitle>
          <CardDescription className="text-xs">
            Klik "Lihat Slip Gaji" untuk melihat rincian komponen pendapatan Anda
          </CardDescription>
        </CardHeader>
        <div className="overflow-x-auto border-t">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b bg-muted/30 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                <th className="py-3 px-4">Periode</th>
                <th className="py-3 px-4">Gaji Pokok</th>
                <th className="py-3 px-4">Total Tunjangan</th>
                <th className="py-3 px-4">Potongan (BPJS & Pajak)</th>
                <th className="py-3 px-4">Take Home Pay</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y text-xs text-foreground">
              {myPayrolls.map((pay) => {
                const allowances =
                  pay.allowance_position + pay.allowance_transport + pay.allowance_meal + pay.bonus;
                const deductions = pay.deduction_bpjs + pay.deduction_tax;
                return (
                  <tr key={pay.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4 font-semibold">{pay.period}</td>
                    <td className="py-3 px-4 font-mono">{formatRupiah(pay.basic_salary)}</td>
                    <td className="py-3 px-4 font-mono text-emerald-600">+{formatRupiah(allowances)}</td>
                    <td className="py-3 px-4 font-mono text-destructive">-{formatRupiah(deductions)}</td>
                    <td className="py-3 px-4 font-mono font-bold text-foreground">
                      {formatRupiah(pay.net_salary)}
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="default" className="text-[10px]">
                        {pay.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setActiveSlip(pay);
                          setModalOpen(true);
                        }}
                        className="gap-1 text-xs h-7 px-2"
                      >
                        <Eye className="size-3.5" /> Buka Slip
                      </Button>
                    </td>
                  </tr>
                );
              })}
              {myPayrolls.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-muted-foreground">
                    Belum ada riwayat slip gaji untuk akun Anda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal Cetak Slip Gaji */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base">Slip Gaji Digital Pegawai</DialogTitle>
            <DialogDescription className="text-xs">
              Bukti resmi transfer kompensasi kerja periode berjalan
            </DialogDescription>
          </DialogHeader>

          {activeSlip && (
            <div className="space-y-4 pt-2 text-xs border p-4 rounded-xl bg-card">
              <div className="border-b pb-3 text-center">
                <h3 className="font-bold text-sm tracking-tight">PT TEKNOLOGI KARYA NUSANTARA</h3>
                <p className="text-[11px] text-muted-foreground">
                  Slip Gaji Periode: {activeSlip.period}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] border-b pb-3">
                <div>
                  <span className="text-muted-foreground">Nama Pegawai:</span>
                  <p className="font-semibold">{activeSlip.employee_name}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">NIP Pegawai:</span>
                  <p className="font-mono">{activeSlip.nip}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Posisi:</span>
                  <p className="font-medium">{activeSlip.position}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Unit / Divisi:</span>
                  <p className="font-medium">{activeSlip.division}</p>
                </div>
              </div>

              <div className="space-y-2">
                <span className="font-semibold text-xs text-foreground">A. Rincian Penghasilan</span>
                <div className="space-y-1 pl-2 text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Gaji Pokok:</span>
                    <span className="font-mono text-foreground">
                      {formatRupiah(activeSlip.basic_salary)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tunjangan Jabatan:</span>
                    <span className="font-mono text-foreground">
                      {formatRupiah(activeSlip.allowance_position)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tunjangan Transportasi:</span>
                    <span className="font-mono text-foreground">
                      {formatRupiah(activeSlip.allowance_transport)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tunjangan Uang Makan:</span>
                    <span className="font-mono text-foreground">
                      {formatRupiah(activeSlip.allowance_meal)}
                    </span>
                  </div>
                  {activeSlip.bonus > 0 && (
                    <div className="flex justify-between text-emerald-600">
                      <span>Bonus Kinerja Semester:</span>
                      <span className="font-mono">{formatRupiah(activeSlip.bonus)}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t">
                <span className="font-semibold text-xs text-foreground">B. Rincian Pemotongan</span>
                <div className="space-y-1 pl-2 text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Iuran BPJS Ketenagakerjaan & Kesehatan:</span>
                    <span className="font-mono text-destructive">
                      -{formatRupiah(activeSlip.deduction_bpjs)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>PPh 21 Pajak Penghasilan:</span>
                    <span className="font-mono text-destructive">
                      -{formatRupiah(activeSlip.deduction_tax)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t flex justify-between items-center text-sm font-bold bg-muted/40 p-2.5 rounded-lg">
                <span>GAJI BERSIH DITERIMA:</span>
                <span className="font-mono text-primary text-base">
                  {formatRupiah(activeSlip.net_salary)}
                </span>
              </div>
            </div>
          )}

          <DialogFooter className="pt-2">
            <Button variant="outline" size="sm" onClick={() => setModalOpen(false)}>
              Tutup
            </Button>
            <Button size="sm" onClick={handlePrint} className="gap-2">
              <Printer className="size-3.5" /> Cetak Dokumen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
