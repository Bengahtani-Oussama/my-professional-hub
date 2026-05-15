import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { messagesApi } from "@/lib/api";
import type { Message } from "@/lib/types";
import { useI18n } from "@/lib/i18n";
import { PageHeader } from "@/components/admin/PageHeader";
import { Button } from "@/components/ui/button";
import { Mail, Reply, Trash2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/messages")({
  component: MessagesAdmin,
});

function MessagesAdmin() {
  const { t } = useI18n();
  const [items, setItems] = useState<Message[]>([]);
  const [active, setActive] = useState<Message | null>(null);

  const refresh = () => messagesApi.list().then(setItems);
  useEffect(() => { refresh(); }, []);

  const toggleStatus = async (m: Message) => {
    await messagesApi.setStatus(m._id, m.status === "unread" ? "replied" : "unread");
    refresh();
  };
  const del = async (id: string) => {
    if (!confirm(t("admin.confirmDelete"))) return;
    await messagesApi.remove(id); setActive(null); refresh();
    toast.success("Deleted");
  };

  return (
    <div>
      <PageHeader title={t("admin.messages")} description={`${items.filter((m) => m.status === "unread").length} unread`} />
      <div className="grid gap-4 lg:grid-cols-[1fr_2fr]">
        <div className="space-y-2">
          {items.length === 0 && (
            <div className="rounded-2xl border border-dashed border-border p-12 text-center text-sm text-muted-foreground">No messages.</div>
          )}
          {items.map((m) => (
            <button
              key={m._id}
              onClick={() => setActive(m)}
              className={`w-full rounded-xl border p-4 text-start transition-all ${
                active?._id === m._id ? "border-primary bg-primary/10" : "border-border bg-gradient-card hover:border-primary/40"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium">{m.name}</span>
                {m.status === "unread" && <span className="h-2 w-2 rounded-full bg-primary-glow" />}
              </div>
              <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">{m.email}</p>
              <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{m.message}</p>
              <p className="mt-2 text-xs text-muted-foreground">{new Date(m.createdAt).toLocaleString()}</p>
            </button>
          ))}
        </div>

        <div className="rounded-2xl border border-border bg-gradient-card p-6">
          {!active ? (
            <div className="flex h-full min-h-[300px] flex-col items-center justify-center text-center text-muted-foreground">
              <Mail className="mb-3 h-8 w-8" /> Select a message to view.
            </div>
          ) : (
            <div>
              <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold">{active.name}</h2>
                  <a href={`mailto:${active.email}`} className="text-sm text-primary-glow hover:underline">{active.email}</a>
                  <p className="mt-1 text-xs text-muted-foreground">{new Date(active.createdAt).toLocaleString()}</p>
                </div>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase ${
                  active.status === "unread" ? "bg-primary/20 text-primary-glow" : "bg-secondary text-muted-foreground"
                }`}>
                  {active.status}
                </span>
              </div>
              <div className="rounded-lg bg-card/50 p-4 text-sm leading-relaxed whitespace-pre-wrap">{active.message}</div>
              <div className="mt-6 flex gap-2">
                <Button asChild className="bg-gradient-primary text-primary-foreground">
                  <a href={`mailto:${active.email}?subject=Re: your message`} className="gap-2"><Reply className="h-4 w-4" /> Reply</a>
                </Button>
                <Button variant="outline" onClick={() => toggleStatus(active)}>
                  Mark as {active.status === "unread" ? "replied" : "unread"}
                </Button>
                <Button variant="ghost" onClick={() => del(active._id)} className="ms-auto text-destructive"><Trash2 className="h-4 w-4" /></Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}