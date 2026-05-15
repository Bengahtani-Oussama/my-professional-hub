import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { projectsApi } from "@/lib/api";
import type { Project } from "@/lib/types";
import { emptyLocalized, emptyLocalizedArray } from "@/lib/types";
import { useI18n } from "@/lib/i18n";
import { PageHeader } from "@/components/admin/PageHeader";
import { LocalizedInput, LocalizedListInput } from "@/components/admin/LocalizedInput";
import { CloudinaryUpload, CloudinaryGallery } from "@/components/admin/CloudinaryUpload";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/projects")({
  component: ProjectsAdmin,
});

const blank = (): Omit<Project, "_id"> => ({
  title: emptyLocalized(), description: emptyLocalized(), imageUrl: "",
  tags: [], images: [], overview: emptyLocalized(),
  responsibilities: emptyLocalizedArray(), challenges: emptyLocalizedArray(), features: emptyLocalizedArray(),
  architecture: { title: emptyLocalized(), description: emptyLocalized() },
  stack: [], skills: [], repoUrl: "", liveUrl: "", featured: true,
});

function ProjectsAdmin() {
  const { t, pickLocalized } = useI18n();
  const [items, setItems] = useState<Project[]>([]);
  const [editing, setEditing] = useState<Project | (Omit<Project, "_id"> & { _id?: string }) | null>(null);

  const refresh = () => projectsApi.list().then(setItems);
  useEffect(() => { refresh(); }, []);

  const save = async () => {
    if (!editing) return;
    try {
      if ("_id" in editing && editing._id) await projectsApi.update(editing._id, editing as Project);
      else await projectsApi.create(editing);
      toast.success("Saved");
      setEditing(null); refresh();
    } catch (e) { toast.error((e as Error).message); }
  };
  const del = async (id: string) => {
    if (!confirm(t("admin.confirmDelete"))) return;
    await projectsApi.remove(id); refresh();
  };

  return (
    <div>
      <PageHeader title={t("admin.projects")} description="Showcase your best work." onCreate={() => setEditing(blank())} />
      <div className="grid gap-4 sm:grid-cols-2">
        {items.map((item) => (
          <div key={item._id} className="rounded-2xl border border-border bg-gradient-card p-5">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="font-semibold">{pickLocalized(item.title) || "Untitled"}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{pickLocalized(item.description)}</p>
              </div>
              <div className="flex gap-1">
                <Button size="icon" variant="ghost" onClick={() => setEditing(item)}><Pencil className="h-4 w-4" /></Button>
                <Button size="icon" variant="ghost" onClick={() => del(item._id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {item.featured && <span className="rounded-md bg-primary/15 px-2 py-0.5 text-xs text-primary-glow">Featured</span>}
              {item.tags.slice(0, 4).map((tag) => (<span key={tag} className="rounded-md bg-secondary px-2 py-0.5 text-xs">{tag}</span>))}
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="col-span-full rounded-2xl border border-dashed border-border p-12 text-center text-sm text-muted-foreground">
            No projects yet.
          </div>
        )}
      </div>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto bg-card">
          <DialogHeader><DialogTitle>{editing && "_id" in editing && editing._id ? t("admin.edit") : t("admin.create")} — {t("admin.projects")}</DialogTitle></DialogHeader>
          {editing && (
            <div className="space-y-4">
              <LocalizedInput label="Title" value={editing.title} onChange={(v) => setEditing({ ...editing, title: v })} />
              <LocalizedInput label="Description" value={editing.description} onChange={(v) => setEditing({ ...editing, description: v })} multiline />
              <LocalizedInput label="Overview" value={editing.overview} onChange={(v) => setEditing({ ...editing, overview: v })} multiline />
              <LocalizedListInput label="Features" value={editing.features} onChange={(v) => setEditing({ ...editing, features: v })} />
              <LocalizedListInput label="Challenges" value={editing.challenges} onChange={(v) => setEditing({ ...editing, challenges: v })} />
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="sm:col-span-2"><CloudinaryUpload label="Cover image" value={editing.imageUrl} onChange={(v) => setEditing({ ...editing, imageUrl: v })} /></div>
                <div className="space-y-2"><Label>Tags (comma)</Label><Input value={editing.tags.join(", ")} onChange={(e) => setEditing({ ...editing, tags: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })} /></div>
                <div className="space-y-2"><Label>Stack (comma)</Label><Input value={editing.stack.join(", ")} onChange={(e) => setEditing({ ...editing, stack: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })} /></div>
                <div className="space-y-2"><Label>Skills (comma)</Label><Input value={editing.skills.join(", ")} onChange={(e) => setEditing({ ...editing, skills: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })} /></div>
                <div className="space-y-2"><Label>Repo URL</Label><Input value={editing.repoUrl ?? ""} onChange={(e) => setEditing({ ...editing, repoUrl: e.target.value })} /></div>
                <div className="space-y-2"><Label>Live URL</Label><Input value={editing.liveUrl ?? ""} onChange={(e) => setEditing({ ...editing, liveUrl: e.target.value })} /></div>
              </div>
              <CloudinaryGallery label="Gallery images" value={editing.images} onChange={(v) => setEditing({ ...editing, images: v })} />
              <label className="flex items-center gap-2 pt-2 text-sm"><Switch checked={editing.featured} onCheckedChange={(v) => setEditing({ ...editing, featured: v })} /> Featured</label>
            </div>
          )}
          <DialogFooter>
            <Button variant="ghost" onClick={() => setEditing(null)}>{t("admin.cancel")}</Button>
            <Button className="bg-gradient-primary text-primary-foreground" onClick={save}>{t("admin.save")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}