import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n";
import {
  experienceApi, projectsApi, messagesApi, settingsApi,
} from "@/lib/api";
import type { Experience, Project, Message, Settings } from "@/lib/types";
import { Briefcase, FolderKanban, Mail, Eye, TrendingUp } from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
} from "recharts";

export const Route = createFileRoute("/admin/")({
  component: Dashboard,
});

function Dashboard() {
  const { t } = useI18n();
  const [experience, setExperience] = useState<Experience[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);

  useEffect(() => {
    Promise.all([
      experienceApi.list(), projectsApi.list(), messagesApi.list(), settingsApi.get(),
    ]).then(([e, p, m, s]) => { setExperience(e); setProjects(p); setMessages(m); setSettings(s); });
  }, []);

  const current = experience.find((e) => e.current);
  const stats = [
    { label: t("admin.totalExperience"), value: experience.length, icon: Briefcase, hint: `${experience.length} roles` },
    { label: t("admin.currentWork"), value: current ? "Yes" : "—", icon: TrendingUp, hint: current ? "Active" : "None" },
    { label: t("admin.totalProjects"), value: projects.filter((p) => p.featured).length, icon: FolderKanban, hint: `${projects.length} total` },
    { label: t("admin.totalMessages"), value: messages.length, icon: Mail, hint: `${messages.filter((m) => m.status === "unread").length} unread` },
  ];

  // mock chart data
  const chartData = Array.from({ length: 12 }, (_, i) => ({
    name: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][i],
    visitors: Math.round(50 + Math.random() * 200 + i * 10),
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t("admin.dashboard")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">Overview of your portfolio activity.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-border bg-gradient-card p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-muted-foreground">{s.label}</span>
              <div className="rounded-lg bg-primary/15 p-2 text-primary-glow">
                <s.icon className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 text-3xl font-bold">{s.value}</div>
            <div className="mt-1 text-xs text-muted-foreground">{s.hint}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-gradient-card p-6 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold">Visitors over time</h2>
            <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
              <Eye className="h-4 w-4 text-primary-glow" />
              {settings?.visitorCount ?? 0} total
            </span>
          </div>
          <div className="h-64">
            <ResponsiveContainer>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.62 0.22 275)" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="oklch(0.62 0.22 275)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.27 0.05 280)" vertical={false} />
                <XAxis dataKey="name" stroke="oklch(0.68 0.04 270)" fontSize={12} />
                <YAxis stroke="oklch(0.68 0.04 270)" fontSize={12} />
                <Tooltip
                  contentStyle={{ background: "oklch(0.17 0.05 280)", border: "1px solid oklch(0.27 0.05 280)", borderRadius: 12 }}
                  labelStyle={{ color: "oklch(0.97 0.01 270)" }}
                />
                <Area type="monotone" dataKey="visitors" stroke="oklch(0.62 0.22 275)" fill="url(#g)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-gradient-card p-6">
          <h2 className="mb-4 font-semibold">Recent messages</h2>
          <div className="space-y-3">
            {messages.slice(0, 5).map((m) => (
              <div key={m._id} className="rounded-lg border border-border bg-card/50 p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{m.name}</span>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
                    m.status === "unread" ? "bg-primary/20 text-primary-glow" : "bg-secondary text-muted-foreground"
                  }`}>
                    {m.status}
                  </span>
                </div>
                <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{m.message}</p>
              </div>
            ))}
            {messages.length === 0 && <p className="text-sm text-muted-foreground">No messages yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}