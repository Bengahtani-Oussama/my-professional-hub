import { motion } from "framer-motion";
import { Section } from "./Section";
import { useI18n } from "@/lib/i18n";
import type { Experience } from "@/lib/types";
import { Briefcase } from "lucide-react";

export function ExperienceSection({ items }: { items: Experience[] }) {
  const { t, pickLocalized } = useI18n();
  return (
    <Section id="experience" eyebrow={t("nav.experience")} title={t("section.experience")}>
      <div className="relative mx-auto max-w-3xl">
        <div className="absolute inset-y-0 start-4 w-px bg-gradient-to-b from-primary via-border to-transparent md:start-1/2" />
        <div className="space-y-12">
          {items.map((exp, i) => (
            <motion.div
              key={exp._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`relative grid gap-6 md:grid-cols-2 md:gap-12 ${
                i % 2 === 0 ? "" : "md:[&>*:first-child]:order-2"
              }`}
            >
              <div className="ms-12 md:ms-0">
                <div className="absolute start-4 top-2 z-10 -translate-x-1/2 rounded-full bg-gradient-primary p-2 shadow-glow rtl:translate-x-1/2 md:start-1/2">
                  <Briefcase className="h-3.5 w-3.5 text-primary-foreground" />
                </div>
                <div className="rounded-2xl border border-border bg-gradient-card p-6 shadow-elevated transition-all hover:border-primary/40 hover:shadow-glow">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    {exp.current && (
                      <span className="rounded-full bg-primary/20 px-2 py-0.5 text-xs font-medium text-primary-glow">
                        Current
                      </span>
                    )}
                    {exp.startDate && (
                      <span className="text-xs text-muted-foreground">
                        {exp.startDate} — {exp.endDate ?? "Present"}
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold">{pickLocalized(exp.title)}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{pickLocalized(exp.description)}</p>
                  {exp.tags.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {exp.tags.map((tag) => (
                        <span key={tag} className="rounded-md bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="hidden md:block" />
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}