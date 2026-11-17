import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  User,
  Sparkles,
  Plus,
  FolderOpen,
  Calendar,
  Layers,
  Database,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/page-header";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSession } from "@/store/session-store";
import { getStarterItems, addStarterItem } from "@/services/starter-service";
import { formatRupiah, formatDateIndo } from "@/lib/starter-data";
import { toast } from "sonner";
import { isSupabaseConfigured } from "@/lib/supabase";

export const Route = createFileRoute("/dashboard/")({
  head: () => ({ meta: [{ title: "Portal Member · Mrhands Lab App Starter" }] }),
  component: DashboardIndexPage,
});

function DashboardIndexPage() {
  const session = useSession();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Development");
  const [value, setValue] = useState("10000000");

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["starter-items"],
    queryFn: getStarterItems,
  });

  const addItemMutation = useMutation({
    mutationFn: async () => {
      if (!title.trim()) throw new Error("Judul item tidak boleh kosong");
      return addStarterItem({
        title: title.trim(),
        category,
        value: Number(value) || 0,
        author: session?.user.name || "Member",
        status: "Aktif",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["starter-items"] });
      queryClient.invalidateQueries({ queryKey: ["starter-metrics"] });
      toast.success("Berhasil menambahkan item baru!");
      setTitle("");
      setValue("10000000");
    },
    onError: (err: any) => {
      toast.error(err?.message || "Gagal menambahkan item.");
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader
          title="Portal Pengguna (Member)"
          description="Area personal pengguna untuk menguji interaktivitas, mutasi data, dan dual-mode storage."
        />
        <Badge
          variant="outline"
          className={
            isSupabaseConfigured
              ? "bg-secondary/10 text-secondary border-secondary/20"
              : "bg-primary/10 text-primary border-primary/20"
          }
        >
          <Database className="size-3 mr-1" />
          Mode: {isSupabaseConfigured ? "Supabase Cloud" : "SQLite Local"}
        </Badge>
      </div>

      {/* User Welcome Banner */}
      <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-primary/20">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-foreground">
                  Halo, {session?.user.name || "Member Demo"} 👋
                </span>
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-[10px]">
                  {session?.user.role?.toUpperCase() || "MEMBER"}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Sesi Anda aktif di divisi <strong>{session?.user.division || "Umum"}</strong>. Ini adalah halaman starter kit kosongan siap kustomisasi.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="px-3 py-1.5 rounded-lg bg-card border border-border/80 text-xs">
                <span className="text-muted-foreground">Email: </span>
                <span className="font-medium text-foreground">{session?.user.email || "member@mrhands.id"}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Add Item */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Plus className="size-4 text-primary" />
              Uji Tambah Item Baru
            </CardTitle>
            <CardDescription className="text-xs">
              Uji coba TanStack Query useMutation dan persistence lokal / cloud.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                addItemMutation.mutate();
              }}
              className="space-y-4"
            >
              <div className="space-y-1.5">
                <Label htmlFor="item-title" className="text-xs">
                  Judul Proyek / Item
                </Label>
                <Input
                  id="item-title"
                  placeholder="Contoh: Modul Baru"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="item-cat" className="text-xs">
                  Kategori
                </Label>
                <Input
                  id="item-cat"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="item-val" className="text-xs">
                  Nilai Estimasi (Rp)
                </Label>
                <Input
                  id="item-val"
                  type="number"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full text-xs"
                disabled={addItemMutation.isPending}
              >
                {addItemMutation.isPending ? "Menyimpan..." : "Tambah ke Database"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Item List */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <FolderOpen className="size-4 text-secondary" />
              Daftar Item Terdaftar
            </CardTitle>
            <CardDescription className="text-xs">
              Menampilkan {items.length} item dari basis data aktif
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="py-8 text-center text-xs text-muted-foreground">Memuat data...</div>
            ) : items.length === 0 ? (
              <div className="py-8 text-center text-xs text-muted-foreground">
                Belum ada data item. Gunakan form di sebelah kiri untuk menambah data.
              </div>
            ) : (
              <div className="space-y-2.5">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-lg border border-border/70 bg-card hover:bg-muted/30 transition-colors flex items-center justify-between"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-foreground">{item.title}</span>
                        <Badge variant="outline" className="text-[10px]">
                          {item.category}
                        </Badge>
                      </div>
                      <div className="text-[11px] text-muted-foreground flex items-center gap-3">
                        <span>Author: {item.author}</span>
                        <span>•</span>
                        <span>{formatDateIndo(item.created_at)}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold text-foreground">{formatRupiah(item.value)}</div>
                      <Badge
                        variant="outline"
                        className={
                          item.status === "Aktif"
                            ? "bg-secondary/10 text-secondary border-secondary/20 text-[10px]"
                            : "text-[10px]"
                        }
                      >
                        {item.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
