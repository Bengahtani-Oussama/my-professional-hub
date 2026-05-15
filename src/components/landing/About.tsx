import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import type { Settings } from "@/lib/types";
import { Mail, MapPin, Phone } from "lucide-react";

export function About({ settings }: { settings: Settings }) {
  const { t, pickLocalized } = useI18n();
  return (
    <section id="about" className="scroll-mt-24 py-24 md:py-32">
      <div className="container mx-auto px-4">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative mx-auto aspect-square w-full max-w-md"
          >
            <div className="absolute inset-0 rounded-3xl bg-gradient-primary opacity-20 blur-2xl" />
            <div className="relative h-full w-full overflow-hidden rounded-3xl border border-border bg-gradient-card shadow-elevated">
              {settings.profileImage ? (
                <img src={settings.profileImage} alt="Profile" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-8xl font-bold text-gradient">
                  {pickLocalized(settings.siteTitle).charAt(0) || "A"}
                </div>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary-glow">
              {t("section.about")}
            </div>
            <h2 className="mb-6 text-3xl font-bold md:text-5xl">
              Building <span className="text-gradient">digital products</span> that people love
            </h2>
            <p className="mb-4 text-lg leading-relaxed text-muted-foreground">
              {pickLocalized(settings.seoDescription) ||
                "I'm a full-stack engineer focused on shipping polished, accessible, performant web experiences. I love clean architecture, attention to detail, and turning ideas into products."}
            </p>
            <div className="mt-8 grid gap-3 text-sm">
              {settings.email && (
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Mail className="h-4 w-4 text-primary-glow" /> {settings.email}
                </div>
              )}
              {settings.phone && (
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Phone className="h-4 w-4 text-primary-glow" /> {settings.phone}
                </div>
              )}
              {pickLocalized(settings.location) && (
                <div className="flex items-center gap-3 text-muted-foreground">
                  <MapPin className="h-4 w-4 text-primary-glow" /> {pickLocalized(settings.location)}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}