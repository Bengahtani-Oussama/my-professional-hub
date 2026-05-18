import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { DetailView } from "@/components/landing/DetailView";
import { projectsApi, settingsApi } from "@/lib/api";
import { useI18n } from "@/lib/i18n";
import type { Project, Settings } from "@/lib/types";

export const Route = createFileRoute("/projects/$id")({
  component: ProjectDetailPage,
});

function ProjectDetailPage() {
  const { id } = Route.useParams();
  const { t } = useI18n();
  const [item, setItem] = useState<Project | null>(null);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    Promise.all([projectsApi.get(id), settingsApi.get()])
      .then(([it, st]) => {
        if (cancelled) return;
        setItem(it);
        setSettings(st);
      })
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!item || !settings) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-4 text-center">
        <h1 className="text-2xl font-semibold">{t("common.notFound")}</h1>
        <Link
          to="/"
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          {t("common.backToHome")}
        </Link>
      </div>
    );
  }

  return <DetailView item={item} eyebrow={t("nav.projects")} visitors={settings.visitorCount} />;
}