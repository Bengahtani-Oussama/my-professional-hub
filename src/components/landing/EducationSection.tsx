import { motion } from "framer-motion";
import { Section } from "./Section";
import { useI18n } from "@/lib/i18n";
import type { Education } from "@/lib/types";
import { GraduationCap, MapPin } from "lucide-react";

export function EducationSection({ items }: { items: Education[] }) {
  const { t, pickLocalized } = useI18n();
  return (
    <Section id="education" eyebrow={t("nav.education")} title={t("section.education")}>
      <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
        {items.sort((a, b) => a.order - b.order).map((e, i) => (
          <motion.div
            key={e._id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="rounded-2xl border border-border bg-gradient-card p-6 transition-all hover:border-primary/40 hover:shadow-glow"
          >
            <div className="mb-3 inline-flex rounded-lg bg-primary/15 p-2 text-primary-glow">
              <GraduationCap className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold">{pickLocalized(e.diploma)}</h3>
            <p className="text-sm font-medium text-primary-glow">{pickLocalized(e.institution)}</p>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              <span>{pickLocalized(e.duration)}</span>
              {pickLocalized(e.location) && (
                <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" /> {pickLocalized(e.location)}</span>
              )}
              {pickLocalized(e.grade) && <span>· {pickLocalized(e.grade)}</span>}
            </div>
            {pickLocalized(e.description) && (
              <p className="mt-3 text-sm text-muted-foreground">{pickLocalized(e.description)}</p>
            )}
          </motion.div>
        ))}
      </div>
    </Section>
  );
}