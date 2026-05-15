import { motion } from "framer-motion";
import { Section } from "./Section";
import { useI18n } from "@/lib/i18n";
import type { Skill, SkillCategory } from "@/lib/types";

export function SkillsSection({ items }: { items: Skill[] }) {
  const { t, pickLocalized } = useI18n();
  const groups: { key: SkillCategory; label: string }[] = [
    { key: "frontend", label: t("skills.frontend") },
    { key: "backend", label: t("skills.backend") },
    { key: "tools", label: t("skills.tools") },
  ];
  return (
    <Section id="skills" eyebrow={t("nav.skills")} title={t("section.skills")}>
      <div className="grid gap-6 md:grid-cols-3">
        {groups.map((g, gi) => {
          const list = items
            .filter((s) => s.categoryKey === g.key)
            .sort((a, b) => a.order - b.order);
          return (
            <motion.div
              key={g.key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: gi * 0.1 }}
              className="rounded-2xl border border-border bg-gradient-card p-6"
            >
              <h3 className="mb-6 text-lg font-bold">{g.label}</h3>
              <div className="space-y-4">
                {list.length === 0 && (
                  <p className="text-sm text-muted-foreground">No skills yet.</p>
                )}
                {list.map((s) => (
                  <div key={s._id}>
                    <div className="mb-1.5 flex items-center justify-between text-sm">
                      <span className="font-medium">{pickLocalized(s.name)}</span>
                      <span className="text-muted-foreground">{s.percentage}%</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${s.percentage}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-full rounded-full bg-gradient-primary"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </Section>
  );
}