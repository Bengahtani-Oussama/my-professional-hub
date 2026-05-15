import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { skillsApi } from "@/lib/api";
import type { Skill, SkillCategory } from "@/lib/types";
import { emptyLocalized } from "@/lib/types";
import { useI18n } from "@/lib/i18n";
import { PageHeader } from "@/components/admin/PageHeader";
import { LocalizedInput } from "@/components/admin/LocalizedInput";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/skills")({
  component: SkillsAdmin,
});

const CATEGORIES: { key: SkillCategory; label: string }[] = [
  { key: "frontend", label: "Frontend" },
  { key: "backend", label: "Backend" },
  { key: "tools", label: "Tools & Others" },
];

const blank = (): Omit<Skill, "_id"> => ({
  category: { ...emptyLocalized(), en: "Frontend" },
  categoryKey: "frontend",
  name: emptyLocalized(),
  percentage: 80,
  order: 0,
});

function SkillsAdmin() {
  const { t, pickLocalized } = useI18n();
  const [items, setItems] = useState<Skill[]>([]);
  const [editing, setEditing] = useState<Skill | (Omit<Skill, "_id"> & { _id?: string }) | null>(null);

  const refresh = () => skillsApi.list().then(setItems);
  useEffect(() => { refresh(); }, []);

  const save = async () => {
    if (!editing) return;
    try {
      if ("_id" in editing && editing._id) await skillsApi.update(editing._id, editing as Skill);
      else await skillsApi.create(editing);
      toast.success("Saved");
      setEditing(null); refresh();
    } catch (e) { toast.error((e as Error).message); }
  };
  const del = async (id: string) => {
    if (!confirm(t("admin.confirmDelete"))) return;
    await skillsApi.remove(id); refresh();
  };

  return (
    <div>
      <PageHeader title={t("admin.skills")} description="Your tech stack and proficiency." onCreate={() => setEditing(blank())} />

      <div className="grid gap-6 lg:grid-cols-3">
        {CATEGORIES.map((c) => (
          <div key={c.key} className="rounded-2xl border border-border bg-gradient-card p-5">
            <h3 className="mb-4 font-semibold">{c.label}</h3>
            <div className="space-y-3">
              {items.filter((s) => s.categoryKey === c.key).sort((a,b) => a.order - b.order).map((s) => (
                <div key={s._id} className="rounded-lg border border-border bg-card/50 p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="font-medium">{pickLocalized(s.name)}</div>
                      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-secondary">
                        <div className="h-full bg-gradient-primary" style={{ width: `${s.percentage}%` }} />
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground">{s.percentage}%</div>
                    </div>
                    <div className="flex gap-1">
                      <Button size="icon" variant="ghost" onClick={() => setEditing(s)}><Pencil className="h-3.5 w-3.5" /></Button>
                      <Button size="icon" variant="ghost" onClick={() => del(s._id)}><Trash2 className="h-3.5 w-3.5 text-destructive" /></Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-w-lg bg-card">
          <DialogHeader><DialogTitle>{editing && "_id" in editing && editing._id ? t("admin.edit") : t("admin.create")} — {t("admin.skills")}</DialogTitle></DialogHeader>
          {editing && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={editing.categoryKey} onValueChange={(v: SkillCategory) => {
                  const cat = CATEGORIES.find((c) => c.key === v);
                  setEditing({ ...editing, categoryKey: v, category: { ...emptyLocalized(), en: cat?.label ?? v } });
                }}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => (<SelectItem key={c.key} value={c.key}>{c.label}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
              <LocalizedInput label="Name" value={editing.name} onChange={(v) => setEditing({ ...editing, name: v })} />
              <div className="space-y-2">
                <Label>Proficiency: {editing.percentage}%</Label>
                <Slider min={0} max={100} step={5} value={[editing.percentage]} onValueChange={([v]) => setEditing({ ...editing, percentage: v })} />
              </div>
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