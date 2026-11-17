import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Building2,
  Users,
  Search,
  ArrowRight,
  ShieldCheck,
  CalendarCheck,
  Award,
  Sparkles,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BrandMark } from "@/components/app-shell";
import { getEmployees } from "@/services/employee-service";
import {
  divisionChartData,
  employmentTypeData,
  formatDateIndo,
} from "@/lib/employee-data";

export const Route = createFileRoute("/transparency")({
  head: () => ({ meta: [{ title: "Direktori Tim & Statistik · Mrhands Lab App Demo" }] }),
  component: TransparencyPage,
});

function TransparencyPage() {
  const [search, setSearch] = useState("");

  const { data: employees = [] } = useQuery({
    queryKey: ["employees-list"],
    queryFn: getEmployees,
  });

  const filtered = employees.filter(
    (e) =>
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.division.toLowerCase().includes(search.toLowerCase()) ||
      e.position.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b bg-background/80 backdrop-blur px-4 lg:px-10 py-3.5">
        <BrandMark />
        <div className="flex items-center gap-3">
          <Link to="/login">
            <Button variant="ghost" size="sm" className="text-xs">
              Masuk Portal
            </Button>
          </Link>
          <Link to="/dashboard">
            <Button size="sm" className="gap-1.5 text-xs rounded-full">
              Buka Dashboard <ArrowRight className="size-3.5" />
            </Button>
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 lg:px-8 py-10 space-y-10">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <Badge className="bg-primary/10 text-primary border-none text-xs">
            Transparansi Organisasi & SDM
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Direktori Pegawai & Profil Talenta
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Mengenal lebih dekat tim profesional kami yang berdedikasi membangun keunggulan di setiap lini produk dan layanan.
          </p>
        </div>

        {/* Charts Section */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="shadow-sm border-border/80">
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Distribusi Karyawan per Divisi</CardTitle>
              <CardDescription className="text-xs">Jumlah anggota tim aktif pada setiap divisi</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[240px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={divisionChartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.25} />
                    <XAxis dataKey="division" tick={{ fontSize: 10 }} angle={-15} textAnchor="end" />
                    <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--color-card)",
                        borderColor: "var(--color-border)",
                        borderRadius: "8px",
                        fontSize: "12px",
                      }}
                    />
                    <Bar dataKey="total" name="Staf" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-border/80">
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Komposisi Hubungan Kerja</CardTitle>
              <CardDescription className="text-xs">Proporsi pegawai tetap, kontrak, dan probasi</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[200px] w-full flex items-center justify-center">
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
                    <Pie data={employmentTypeData} innerRadius={50} outerRadius={75} paddingAngle={5} dataKey="value">
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
                    <span className="text-[10px] text-muted-foreground truncate">{item.name}</span>
                    <span className="text-xs font-bold text-foreground">{item.value} Org</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search & Employee Directory Cards */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-foreground">Daftar Anggota Tim</h2>
              <p className="text-xs text-muted-foreground">Menampilkan {filtered.length} profil talenta terdaftar</p>
            </div>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Cari nama atau jabatan..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9 text-xs"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((emp) => (
              <Card key={emp.id} className="shadow-sm border-border/80 hover:shadow-md transition-shadow">
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="size-11 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center shrink-0">
                      {emp.name
                        .split(" ")
                        .map((s) => s[0])
                        .slice(0, 2)
                        .join("")}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-semibold text-xs text-foreground truncate">{emp.name}</h4>
                      <p className="text-[11px] text-muted-foreground truncate">{emp.position}</p>
                    </div>
                  </div>

                  <div className="pt-2 border-t space-y-1.5 text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Divisi:</span>
                      <span className="font-medium text-foreground">{emp.division}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      <Badge variant="outline" className="text-[10px] h-4.5 px-1.5">
                        {emp.employment_type}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Bergabung:</span>
                      <span className="text-muted-foreground">{formatDateIndo(emp.join_date)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
