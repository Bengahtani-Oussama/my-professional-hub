import { useState } from "react";
import { motion } from "framer-motion";
import { Section } from "./Section";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { messagesApi } from "@/lib/api";
import { z } from "zod";
import { toast } from "sonner";
import { Github, Linkedin, Mail, Twitter } from "lucide-react";
import type { Settings } from "@/lib/types";

const Schema = z.object({
  name: z.string().trim().min(1).max(60),
  email: z.string().trim().email().max(255),
  message: z.string().trim().min(1).max(2000),
});

export function ContactSection({ settings }: { settings: Settings }) {
  const { t } = useI18n();
  const [data, setData] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = Schema.safeParse(data);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setLoading(true);
    try {
      await messagesApi.send(parsed.data);
      toast.success(t("contact.success"));
      setData({ name: "", email: "", message: "" });
    } catch {
      toast.error(t("contact.error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Section id="contact" eyebrow={t("nav.contact")} title={t("section.contact")}>
      <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-2xl font-bold">Let's build something great together.</h3>
          <p className="mt-3 text-muted-foreground">
            Whether you have an idea, a project, or just want to say hi — my inbox is open.
          </p>
          <div className="mt-6 space-y-3 text-sm">
            {settings.email && (
              <a href={`mailto:${settings.email}`} className="flex items-center gap-3 text-muted-foreground hover:text-foreground">
                <Mail className="h-4 w-4 text-primary-glow" /> {settings.email}
              </a>
            )}
          </div>
          <div className="mt-6 flex gap-3">
            {settings.socialLinks.github && (
              <a href={settings.socialLinks.github} target="_blank" rel="noreferrer" className="rounded-full border border-border bg-card p-3 transition-colors hover:bg-accent" aria-label="GitHub">
                <Github className="h-4 w-4" />
              </a>
            )}
            {settings.socialLinks.linkedin && (
              <a href={settings.socialLinks.linkedin} target="_blank" rel="noreferrer" className="rounded-full border border-border bg-card p-3 transition-colors hover:bg-accent" aria-label="LinkedIn">
                <Linkedin className="h-4 w-4" />
              </a>
            )}
            {settings.socialLinks.twitter && (
              <a href={settings.socialLinks.twitter} target="_blank" rel="noreferrer" className="rounded-full border border-border bg-card p-3 transition-colors hover:bg-accent" aria-label="Twitter">
                <Twitter className="h-4 w-4" />
              </a>
            )}
          </div>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          onSubmit={submit}
          className="space-y-4 rounded-2xl border border-border bg-gradient-card p-6 shadow-elevated"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              placeholder={t("contact.name")}
              value={data.name}
              onChange={(e) => setData({ ...data, name: e.target.value })}
              required
              maxLength={60}
            />
            <Input
              type="email"
              placeholder={t("contact.email")}
              value={data.email}
              onChange={(e) => setData({ ...data, email: e.target.value })}
              required
              maxLength={255}
            />
          </div>
          <Textarea
            placeholder={t("contact.message")}
            rows={5}
            value={data.message}
            onChange={(e) => setData({ ...data, message: e.target.value })}
            required
            maxLength={2000}
          />
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-90"
          >
            {loading ? "..." : t("contact.send")}
          </Button>
        </motion.form>
      </div>
    </Section>
  );
}