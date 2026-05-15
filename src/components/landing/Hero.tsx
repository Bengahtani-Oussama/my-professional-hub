import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { ArrowRight, Download } from "lucide-react";
import type { Settings } from "@/lib/types";

export function Hero({ settings }: { settings: Settings }) {
  const { t, pickLocalized } = useI18n();
  const name = pickLocalized(settings.siteTitle).split("—")[0]?.trim() || "Your Name";
  return (
    <section className="relative isolate overflow-hidden bg-gradient-hero pt-32 pb-24 md:pt-40 md:pb-36">
      {/* Decorative orbs */}
      <div aria-hidden className="pointer-events-none absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-primary/30 blur-[120px]" />
      <div aria-hidden className="pointer-events-none absolute -bottom-32 -left-40 h-[400px] w-[400px] rounded-full bg-primary-glow/20 blur-[120px]" />

      <div className="container relative z-10 mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary-glow"
          >
            <span className="h-2 w-2 animate-pulse rounded-full bg-primary-glow" />
            Available for new opportunities
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl font-bold tracking-tight md:text-7xl"
          >
            {t("hero.greeting")}{" "}
            <span className="text-gradient">{name}</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-xl font-medium text-muted-foreground md:text-2xl"
          >
            {t("hero.role")}
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground md:text-lg"
          >
            {t("hero.subtitle")}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-4"
          >
            <Button asChild size="lg" className="bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-90">
              <a href="#projects" className="gap-2">
                {t("hero.cta")} <ArrowRight className="h-4 w-4 rtl:rotate-180" />
              </a>
            </Button>
            {settings.resumeUrl ? (
              <Button asChild size="lg" variant="outline" className="border-border bg-card/50">
                <a href={settings.resumeUrl} target="_blank" rel="noreferrer" className="gap-2">
                  <Download className="h-4 w-4" /> {t("nav.downloadCV")}
                </a>
              </Button>
            ) : (
              <Button asChild size="lg" variant="outline" className="border-border bg-card/50">
                <a href="#contact">{t("hero.cta2")}</a>
              </Button>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}