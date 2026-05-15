import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { educationApi } from "@/lib/api";
import type { Education } from "@/lib/types";
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
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/education")({
  component: EducationAdmin,
});

const blank = (): Omit<Education, "_id"> => ({
  diploma: emptyLocalized(), institution: emptyLocalized(),
  duration: emptyLocalized(), location: emptyLocalized(),
  grade: emptyLocalized(), description: emptyLocalized(),
  achievements: emptyLocalizedArray(), subjects: emptyLocalizedArray(),
  order: 0,
});

function EducationAdmin() {
  const { t, pickLocalized } = useI18n();
  const [items, setItems] = useState<Education[]>([]);
  const [editing, setEditing] = useState<Education | (Omit<Education, "_id"> & { _id?: string }) | null>(null);

  const refresh = () => educationApi.list().then(setItems);
  useEffect(() => { refresh(); }, []);

  const save = async () => {
    if (!editing) return;
    try {
      if ("_id" in editing && editing._id) await educationApi.update(editing._id, editing as Education);
      else await educationApi.create(editing);
      toast.success("Saved");
      setEditing(null); refresh();
    } catch (e) { toast.error((e as Error).message); }
  };
  const del = async (id: string) => {
    if (!confirm(t("admin.confirmDelete"))) return;
    await educationApi.remove(id); refresh();
  };

  return (
    <div>
      <PageHeader title={t("admin.education")} description="Your academic background." onCreate={() => setEditing(blank())} />
      <div className="grid gap-3">
        {items.sort((a,b) => a.order - b.order).map((item) => (
          <div key={item._id} className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-gradient-card p-5">
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold">{pickLocalized(item.diploma) || "—"}</h3>
              <p className="text-sm text-primary-glow">{pickLocalized(item.institution)}</p>
              <p className="mt-1 text-xs text-muted-foreground">{pickLocalized(item.duration)} · {pickLocalized(item.location)}</p>
            </div>
            <div className="flex gap-1">
              <Button size="icon" variant="ghost" onClick={() => setEditing(item)}><Pencil className="h-4 w-4" /></Button>
              <Button size="icon" variant="ghost" onClick={() => del(item._id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border p-12 text-center text-sm text-muted-foreground">No education entries.</div>
        )}
      </div>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto bg-card">
          <DialogHeader><DialogTitle>{editing && "_id" in editing && editing._id ? t("admin.edit") : t("admin.create")} — {t("admin.education")}</DialogTitle></DialogHeader>
          {editing && (
            <div className="space-y-4">
              <LocalizedInput label="Diploma" value={editing.diploma} onChange={(v) => setEditing({ ...editing, diploma: v })} />
              <LocalizedInput label="Institution" value={editing.institution} onChange={(v) => setEditing({ ...editing, institution: v })} />
              <div className="grid gap-3 sm:grid-cols-2">
                <LocalizedInput label="Duration" value={editing.duration} onChange={(v) => setEditing({ ...editing, duration: v })} />
                <LocalizedInput label="Location" value={editing.location} onChange={(v) => setEditing({ ...editing, location: v })} />
              </div>
              <LocalizedInput label="Grade" value={editing.grade} onChange={(v) => setEditing({ ...editing, grade: v })} />
              <LocalizedInput label="Description" value={editing.description} onChange={(v) => setEditing({ ...editing, description: v })} multiline />
              <LocalizedListInput label="Achievements" value={editing.achievements} onChange={(v) => setEditing({ ...editing, achievements: v })} />
              <LocalizedListInput label="Subjects" value={editing.subjects} onChange={(v) => setEditing({ ...editing, subjects: v })} />
              <div className="space-y-2">
                <Label>Order</Label>
                <Input type="number" value={editing.order} onChange={(e) => setEditing({ ...editing, order: Number(e.target.value) })} />
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