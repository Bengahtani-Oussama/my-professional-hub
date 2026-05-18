import { motion } from "framer-motion";
import { Section } from "./Section";
import { useI18n } from "@/lib/i18n";
import type { Project } from "@/lib/types";
import { ArrowRight, ExternalLink, Github } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function ProjectsSection({ items }: { items: Project[] }) {
  const { t, pickLocalized } = useI18n();
  const featured = items.filter((p) => p.featured);
  return (
    <Section id="projects" eyebrow={t("nav.projects")} title={t("section.projects")}>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {featured.map((p, i) => (
          <motion.article
            key={p._id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-gradient-card transition-all hover:border-primary/40 hover:shadow-glow"
          >
            <div className="aspect-video w-full overflow-hidden bg-secondary">
              {p.imageUrl ? (
                <img
                  src={p.imageUrl}
                  alt={pickLocalized(p.title)}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-primary/20 text-4xl font-bold text-gradient">
                  {pickLocalized(p.title).charAt(0)}
                </div>
              )}
            </div>
            <div className="flex flex-1 flex-col p-6">
              <h3 className="text-lg font-bold">{pickLocalized(p.title)}</h3>
              <p className="mt-2 flex-1 text-sm text-muted-foreground">{pickLocalized(p.description)}</p>
              {p.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {p.tags.slice(0, 4).map((tag) => (
                    <span key={tag} className="rounded-md bg-primary/10 px-2 py-0.5 text-xs text-primary-glow">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              <div className="mt-5 flex items-center gap-3">
                <Link
                  to="/projects/$id"
                  params={{ id: p._id }}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground hover:text-primary-glow"
                >
                  {t("common.viewDetails")}
                  <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" />
                </Link>
                {p.liveUrl && (
                  <a
                    href={p.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-glow hover:underline"
                  >
                    <ExternalLink className="h-3.5 w-3.5" /> Live
                  </a>
                )}
                {p.repoUrl && (
                  <a
                    href={p.repoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
                  >
                    <Github className="h-3.5 w-3.5" /> Code
                  </a>
                )}
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </Section>
  );
}