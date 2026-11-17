import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Megaphone, Plus, Bell, Pin, Calendar, Tag } from "lucide-react";
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
import { getAnnouncements, createAnnouncement } from "@/services/employee-service";
import { formatDateIndo, Announcement } from "@/lib/employee-data";
import { useSession } from "@/store/session-store";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/announcements")({
  head: () => ({ meta: [{ title: "Pengumuman Kantor · Mrhands Lab App Demo" }] }),
  component: AdminAnnouncementsPage,
});

function AdminAnnouncementsPage() {
  const queryClient = useQueryClient();
  const session = useSession();
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    title: "",
    category: "Pemberitahuan" as "Pemberitahuan" | "Kebijakan" | "Acara" | "Penting",
    content: "",
    author: session?.user.name || "Divisi SDM & Operasional",
    is_pinned: false,
  });

  const { data: announcements = [] } = useQuery({
    queryKey: ["announcements-list"],
    queryFn: getAnnouncements,
  });

  const createMutation = useMutation({
    mutationFn: createAnnouncement,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["announcements-list"] });
      toast.success("Pengumuman berhasil disiarkan ke seluruh pegawai!");
      setModalOpen(false);
      setForm({
        title: "",
        category: "Pemberitahuan",
        content: "",
        author: session?.user.name || "Divisi SDM & Operasional",
        is_pinned: false,
      });
    },
    onError: (err: any) => {
      toast.error(err?.message || "Gagal menerbitkan pengumuman");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) {
      toast.error("Judul dan konten pengumuman wajib diisi");
      return;
    }
    createMutation.mutate(form);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader
          title="Pengumuman & Kebijakan Kantor"
          description="Publikasikan informasi resmi, perubahan aturan kerja, dan agenda perusahaan."
        />
        <Button size="sm" onClick={() => setModalOpen(true)} className="gap-2 text-xs">
          <Plus className="size-3.5" /> Buat Pengumuman Baru
        </Button>
      </div>

      <div className="grid gap-4">
        {announcements.map((ann) => (
          <Card key={ann.id} className="shadow-sm border-border/80">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs bg-primary/5 text-primary">
                    {ann.category}
                  </Badge>
                  {ann.is_pinned && (
                    <Badge variant="secondary" className="text-[10px] gap-1">
                      <Pin className="size-3" /> Disematkan
                    </Badge>
                  )}
                </div>
                <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <Calendar className="size-3.5" /> {formatDateIndo(ann.published_at)}
                </span>
              </div>
              <CardTitle className="text-base mt-2">{ann.title}</CardTitle>
              <CardDescription className="text-xs">
                Diterbitkan oleh: <span className="font-semibold">{ann.author}</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-foreground/90 whitespace-pre-line leading-relaxed">
                {ann.content}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal Buat Pengumuman */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base">Terbitkan Pengumuman Baru</DialogTitle>
            <DialogDescription className="text-xs">
              Pesan ini akan tampil di beranda seluruh pegawai dan panel manajemen
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-3 pt-2 text-xs">
            <div className="space-y-1">
              <Label className="text-xs">Kategori Informasi</Label>
              <Select
                value={form.category}
                onValueChange={(val: any) => setForm({ ...form, category: val })}
              >
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pemberitahuan">Pemberitahuan Umum</SelectItem>
                  <SelectItem value="Kebijakan">Kebijakan & Peraturan</SelectItem>
                  <SelectItem value="Acara">Acara & Kegiatan</SelectItem>
                  <SelectItem value="Penting">Penting / Mendesak</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label htmlFor="title" className="text-xs">
                Judul Pengumuman
              </Label>
              <Input
                id="title"
                required
                placeholder="Contoh: Jadwal Libur Bersama Idul Fitri"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="content" className="text-xs">
                Isi Pengumuman
              </Label>
              <Textarea
                id="content"
                required
                rows={4}
                placeholder="Tuliskan detail pengumuman secara lengkap di sini..."
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="pinned"
                checked={form.is_pinned}
                onChange={(e) => setForm({ ...form, is_pinned: e.target.checked })}
                className="rounded border-border text-primary"
              />
              <Label htmlFor="pinned" className="text-xs cursor-pointer">
                Sematkan di bagian teratas (Pinned)
              </Label>
            </div>

            <DialogFooter className="pt-3">
              <Button type="button" variant="outline" size="sm" onClick={() => setModalOpen(false)}>
                Batal
              </Button>
              <Button type="submit" size="sm" disabled={createMutation.isPending}>
                {createMutation.isPending ? "Menerbitkan..." : "Terbitkan Pengumuman"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
