import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Banknote,
  Search,
  Download,
  Eye,
  Building,
  CheckCircle2,
  FileSpreadsheet,
  Printer,
} from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";
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
import { getPayrolls } from "@/services/employee-service";
import { formatRupiah, formatCompact, payrollExpenseData, PayrollRecord } from "@/lib/employee-data";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/payroll")({
  head: () => ({ meta: [{ title: "Penggajian & Slip Gaji · Mrhands Lab App Demo" }] }),
  component: AdminPayrollPage,
});

function AdminPayrollPage() {
  const [search, setSearch] = useState("");
  const [activeSlip, setActiveSlip] = useState<PayrollRecord | null>(null);
  const [slipModalOpen, setSlipModalOpen] = useState(false);

  const { data: payrolls = [] } = useQuery({
    queryKey: ["payrolls-list"],
    queryFn: getPayrolls,
  });

  const filtered = payrolls.filter((p) => {
    return (
      p.employee_name.toLowerCase().includes(search.toLowerCase()) ||
      p.nip.toLowerCase().includes(search.toLowerCase()) ||
      p.division.toLowerCase().includes(search.toLowerCase())
    );
  });

  const totalNett = payrolls.reduce((acc, curr) => acc + curr.net_salary, 0);
  const totalBasic = payrolls.reduce((acc, curr) => acc + curr.basic_salary, 0);
  const totalAllowances = payrolls.reduce(
    (acc, curr) =>
      acc + curr.allowance_position + curr.allowance_transport + curr.allowance_meal + curr.bonus,
    0
  );
  const totalDeductions = payrolls.reduce(
    (acc, curr) => acc + curr.deduction_bpjs + curr.deduction_tax,
    0
  );

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader
          title="Rekapitulasi Penggajian (Payroll)"
          description="Rincian gaji pokok, tunjangan, potongan pajak, BPJS, dan penerbitan slip gaji pegawai."
        />
        <Button
          variant="outline"
          size="sm"
          onClick={() => toast.success("Daftar payroll siap diekspor!")}
          className="gap-2 text-xs"
        >
          <Download className="size-3.5" /> Export Laporan Payroll
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-sm border-border/80">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Total Pengeluaran Gaji (Nett)</p>
            <h3 className="text-xl font-bold text-foreground mt-1">{formatCompact(totalNett)}</h3>
            <p className="text-[11px] text-muted-foreground mt-1">Periode aktif Q4</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border/80">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Total Gaji Pokok</p>
            <h3 className="text-xl font-bold text-foreground mt-1">{formatCompact(totalBasic)}</h3>
            <p className="text-[11px] text-muted-foreground mt-1">Komponen dasar pegawai</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border/80">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Total Tunjangan & Bonus</p>
            <h3 className="text-xl font-bold text-emerald-600 mt-1">{formatCompact(totalAllowances)}</h3>
            <p className="text-[11px] text-muted-foreground mt-1">Jabatan, makan, transportasi</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border/80">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Total Potongan (BPJS + PPh)</p>
            <h3 className="text-xl font-bold text-destructive mt-1">{formatCompact(totalDeductions)}</h3>
            <p className="text-[11px] text-muted-foreground mt-1">Iuran wajib & pajak</p>
          </CardContent>
        </Card>
      </div>

      {/* Chart: Alokasi Biaya per Departemen */}
      <Card className="shadow-sm border-border/80">
        <CardHeader>
          <CardTitle className="text-sm font-semibold">
            Distribusi Biaya Penggajian per Departemen
          </CardTitle>
          <CardDescription className="text-xs">
            Alokasi anggaran belanja pegawai pada setiap unit operasional
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={payrollExpenseData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.25} />
                <XAxis dataKey="division" tick={{ fontSize: 11 }} angle={-10} textAnchor="end" />
                <YAxis
                  tick={{ fontSize: 11 }}
                  tickFormatter={(val) => `Rp ${(val / 1000000).toFixed(0)} Jt`}
                />
                <Tooltip
                  formatter={(val: any) => [formatRupiah(Number(val)), "Total Anggaran"]}
                  contentStyle={{
                    backgroundColor: "var(--color-card)",
                    borderColor: "var(--color-border)",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Bar
                  dataKey="totalGaji"
                  name="Total Gaji"
                  fill="var(--color-primary)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="shadow-sm border-border/80">
        <CardContent className="p-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Cari pegawai atau divisi..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 text-xs"
            />
          </div>
        </CardContent>

        <div className="overflow-x-auto border-t">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b bg-muted/30 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                <th className="py-3 px-4">Periode</th>
                <th className="py-3 px-4">Pegawai</th>
                <th className="py-3 px-4">Gaji Pokok</th>
                <th className="py-3 px-4">Tunjangan</th>
                <th className="py-3 px-4">Potongan</th>
                <th className="py-3 px-4">Gaji Bersih (Nett)</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Slip Gaji</th>
              </tr>
            </thead>
            <tbody className="divide-y text-xs text-foreground">
              {filtered.map((pay) => {
                const allowances =
                  pay.allowance_position + pay.allowance_transport + pay.allowance_meal + pay.bonus;
                const deductions = pay.deduction_bpjs + pay.deduction_tax;
                return (
                  <tr key={pay.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4 font-medium">{pay.period}</td>
                    <td className="py-3 px-4">
                      <p className="font-semibold">{pay.employee_name}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {pay.position} · {pay.division}
                      </p>
                    </td>
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
                          setSlipModalOpen(true);
                        }}
                        className="gap-1 text-xs h-7 px-2"
                      >
                        <Eye className="size-3.5" /> Lihat Slip
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal Cetak Slip Gaji */}
      <Dialog open={slipModalOpen} onOpenChange={setSlipModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base">Slip Gaji Digital</DialogTitle>
            <DialogDescription className="text-xs">
              Bukti pembayaran kompensasi resmi periode berjalan
            </DialogDescription>
          </DialogHeader>

          {activeSlip && (
            <div className="space-y-4 pt-2 text-xs border p-4 rounded-xl bg-card">
              <div className="border-b pb-3 text-center">
                <h3 className="font-bold text-sm tracking-tight">PT TEKNOLOGI KARYA NUSANTARA</h3>
                <p className="text-[11px] text-muted-foreground">
                  Periode Pembayaran: {activeSlip.period}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] border-b pb-3">
                <div>
                  <span className="text-muted-foreground">Nama:</span>
                  <p className="font-semibold">{activeSlip.employee_name}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">NIP:</span>
                  <p className="font-mono">{activeSlip.nip}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Jabatan:</span>
                  <p className="font-medium">{activeSlip.position}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Divisi:</span>
                  <p className="font-medium">{activeSlip.division}</p>
                </div>
              </div>

              <div className="space-y-2">
                <span className="font-semibold text-xs text-foreground">A. Penghasilan</span>
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
                    <span>Tunjangan Transportasi & Makan:</span>
                    <span className="font-mono text-foreground">
                      {formatRupiah(activeSlip.allowance_transport + activeSlip.allowance_meal)}
                    </span>
                  </div>
                  {activeSlip.bonus > 0 && (
                    <div className="flex justify-between text-emerald-600">
                      <span>Bonus Kinerja:</span>
                      <span className="font-mono">{formatRupiah(activeSlip.bonus)}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t">
                <span className="font-semibold text-xs text-foreground">B. Potongan</span>
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
                <span>GAJI BERSIH (TAKE HOME PAY):</span>
                <span className="font-mono text-primary text-base">
                  {formatRupiah(activeSlip.net_salary)}
                </span>
              </div>
            </div>
          )}

          <DialogFooter className="pt-2">
            <Button variant="outline" size="sm" onClick={() => setSlipModalOpen(false)}>
              Tutup
            </Button>
            <Button size="sm" onClick={handlePrint} className="gap-2">
              <Printer className="size-3.5" /> Cetak Slip Gaji
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
