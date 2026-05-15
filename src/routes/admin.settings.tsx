import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { settingsApi } from "@/lib/api";
import type { Settings } from "@/lib/types";
import { useI18n } from "@/lib/i18n";
import { PageHeader } from "@/components/admin/PageHeader";
import { LocalizedInput } from "@/components/admin/LocalizedInput";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/settings")({
  component: SettingsAdmin,
});

function SettingsAdmin() {
  const { t } = useI18n();
  const [data, setData] = useState<Settings | null>(null);

  useEffect(() => { settingsApi.get().then(setData); }, []);

  if (!data) return <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />;

  const save = async () => {
    try { await settingsApi.update(data); toast.success("Settings saved"); }
    catch (e) { toast.error((e as Error).message); }
  };

  return (
    <div>
      <PageHeader title={t("admin.settings")} description="Personal info and site configuration." />
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-gradient-card p-6">
          <h2 className="mb-4 font-semibold">Site</h2>
          <div className="space-y-4">
            <LocalizedInput label="Site title" value={data.siteTitle} onChange={(v) => setData({ ...data, siteTitle: v })} />
            <LocalizedInput label="SEO description" value={data.seoDescription} onChange={(v) => setData({ ...data, seoDescription: v })} multiline />
            <div className="space-y-2"><Label>Logo URL</Label><Input value={data.siteLogo} onChange={(e) => setData({ ...data, siteLogo: e.target.value })} /></div>
            <div className="space-y-2"><Label>Profile image URL</Label><Input value={data.profileImage} onChange={(e) => setData({ ...data, profileImage: e.target.value })} /></div>
            <div className="space-y-2"><Label>Resume / CV URL</Label><Input value={data.resumeUrl} onChange={(e) => setData({ ...data, resumeUrl: e.target.value })} /></div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-gradient-card p-6">
          <h2 className="mb-4 font-semibold">Contact</h2>
          <div className="space-y-4">
            <div className="space-y-2"><Label>Email</Label><Input type="email" value={data.email} onChange={(e) => setData({ ...data, email: e.target.value })} /></div>
            <div className="space-y-2"><Label>Phone</Label><Input value={data.phone} onChange={(e) => setData({ ...data, phone: e.target.value })} /></div>
            <LocalizedInput label="Location" value={data.location} onChange={(v) => setData({ ...data, location: v })} />
          </div>

          <h2 className="mb-4 mt-6 font-semibold">Social links</h2>
          <div className="space-y-4">
            <div className="space-y-2"><Label>GitHub</Label><Input value={data.socialLinks.github} onChange={(e) => setData({ ...data, socialLinks: { ...data.socialLinks, github: e.target.value } })} /></div>
            <div className="space-y-2"><Label>LinkedIn</Label><Input value={data.socialLinks.linkedin} onChange={(e) => setData({ ...data, socialLinks: { ...data.socialLinks, linkedin: e.target.value } })} /></div>
            <div className="space-y-2"><Label>Twitter</Label><Input value={data.socialLinks.twitter} onChange={(e) => setData({ ...data, socialLinks: { ...data.socialLinks, twitter: e.target.value } })} /></div>
          </div>

          <p className="mt-6 text-xs text-muted-foreground">Visitor count: {data.visitorCount.toLocaleString()}</p>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <Button onClick={save} className="bg-gradient-primary text-primary-foreground">{t("admin.save")}</Button>
      </div>
    </div>
  );
}