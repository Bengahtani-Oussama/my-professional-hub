import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { experienceApi } from "@/lib/api";
import type { Experience } from "@/lib/types";
import { emptyLocalized, emptyLocalizedArray } from "@/lib/types";
import { useI18n } from "@/lib/i18n";
import { PageHeader } from "@/components/admin/PageHeader";
import { LocalizedInput, LocalizedListInput } from "@/components/admin/LocalizedInput";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/experience")({
  component: ExperienceAdmin,
});

const blank = (): Omit<Experience, "_id"> => ({
  title: emptyLocalized(),
  description: emptyLocalized(),
  imageUrl: "",
  tags: [],
  images: [],
  overview: emptyLocalized(),
  responsibilities: emptyLocalizedArray(),
  challenges: emptyLocalizedArray(),
  features: emptyLocalizedArray(),
  architecture: { title: emptyLocalized(), description: emptyLocalized() },
  stack: [],
  skills: [],
  repoUrl: "",
  liveUrl: "",
  featured: false,
  current: false,
  startDate: "",
  endDate: "",
});

function ExperienceAdmin() {
  const { t, pickLocalized } = useI18n();
  const [items, setItems] = useState<Experience[]>([]);
  const [editing, setEditing] = useState<Experience | (Omit<Experience, "_id"> & { _id?: string }) | null>(null);

  const refresh = () => experienceApi.list().then(setItems);
  useEffect(() => { refresh(); }, []);

  const save = async () => {
    if (!editing) return;
    try {
      if ("_id" in editing && editing._id) {
        await experienceApi.update(editing._id, editing as Experience);
        toast.success("Updated");
      } else {
        await experienceApi.create(editing);
        toast.success("Created");
      }
      setEditing(null);
      refresh();
    } catch (e) {
      toast.error((e as Error).message);
    }
  };
  const del = async (id: string) => {
    if (!confirm(t("admin.confirmDelete"))) return;
    await experienceApi.remove(id);
    refresh();
  };

  return (
    <div>
      <PageHeader title={t("admin.experience")} description="Manage your work history." onCreate={() => setEditing(blank())} />

      <div className="grid gap-3">
        {items.map((item) => (
          <div key={item._id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-gradient-card p-5">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">{pickLocalized(item.title) || "Untitled"}</h3>
                {item.current && <span className="rounded-full bg-primary/20 px-2 py-0.5 text-xs text-primary-glow">Current</span>}
                {item.featured && <span className="rounded-full bg-secondary px-2 py-0.5 text-xs">Featured</span>}
              </div>
              <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">{pickLocalized(item.description)}</p>
              {item.tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {item.tags.slice(0, 5).map((tag) => (
                    <span key={tag} className="rounded-md bg-secondary px-2 py-0.5 text-xs">{tag}</span>
                  ))}
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <Button size="icon" variant="ghost" onClick={() => setEditing(item)}><Pencil className="h-4 w-4" /></Button>
              <Button size="icon" variant="ghost" onClick={() => del(item._id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border p-12 text-center text-sm text-muted-foreground">
            No experience yet. Click "{t("admin.create")}" to add one.
          </div>
        )}
      </div>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto bg-card">
          <DialogHeader>
            <DialogTitle>{editing && "_id" in editing && editing._id ? t("admin.edit") : t("admin.create")} — {t("admin.experience")}</DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="space-y-4">
              <LocalizedInput label="Title" value={editing.title} onChange={(v) => setEditing({ ...editing, title: v })} />
              <LocalizedInput label="Description" value={editing.description} onChange={(v) => setEditing({ ...editing, description: v })} multiline />
              <LocalizedInput label="Overview" value={editing.overview} onChange={(v) => setEditing({ ...editing, overview: v })} multiline />
              <LocalizedListInput label="Responsibilities" value={editing.responsibilities} onChange={(v) => setEditing({ ...editing, responsibilities: v })} />
              <LocalizedListInput label="Challenges" value={editing.challenges} onChange={(v) => setEditing({ ...editing, challenges: v })} />
              <LocalizedListInput label="Features" value={editing.features} onChange={(v) => setEditing({ ...editing, features: v })} />
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-2"><Label>Start</Label><Input type="month" value={editing.startDate ?? ""} onChange={(e) => setEditing({ ...editing, startDate: e.target.value })} /></div>
                <div className="space-y-2"><Label>End</Label><Input type="month" value={editing.endDate ?? ""} onChange={(e) => setEditing({ ...editing, endDate: e.target.value })} /></div>
                <div className="space-y-2"><Label>Image URL</Label><Input value={editing.imageUrl} onChange={(e) => setEditing({ ...editing, imageUrl: e.target.value })} /></div>
                <div className="space-y-2"><Label>Tags (comma)</Label><Input value={editing.tags.join(", ")} onChange={(e) => setEditing({ ...editing, tags: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })} /></div>
                <div className="space-y-2"><Label>Stack (comma)</Label><Input value={editing.stack.join(", ")} onChange={(e) => setEditing({ ...editing, stack: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })} /></div>
                <div className="space-y-2"><Label>Skills (comma)</Label><Input value={editing.skills.join(", ")} onChange={(e) => setEditing({ ...editing, skills: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })} /></div>
                <div className="space-y-2"><Label>Repo URL</Label><Input value={editing.repoUrl ?? ""} onChange={(e) => setEditing({ ...editing, repoUrl: e.target.value })} /></div>
                <div className="space-y-2"><Label>Live URL</Label><Input value={editing.liveUrl ?? ""} onChange={(e) => setEditing({ ...editing, liveUrl: e.target.value })} /></div>
              </div>
              <div className="flex gap-6 pt-2">
                <label className="flex items-center gap-2 text-sm"><Switch checked={editing.featured} onCheckedChange={(v) => setEditing({ ...editing, featured: v })} /> Featured</label>
                <label className="flex items-center gap-2 text-sm"><Switch checked={!!editing.current} onCheckedChange={(v) => setEditing({ ...editing, current: v })} /> Current role</label>
              </div>
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