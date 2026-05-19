import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, ExternalLink, Github } from "lucide-react";
import { Nav } from "./Nav";
import { Footer } from "./Footer";
import { useI18n } from "@/lib/i18n";
import type { Experience } from "@/lib/types";
import { ImageCarousel } from "./ImageCarousel";

export function DetailView({
  item,
  eyebrow,
  visitors,
}: {
  item: Experience;
  eyebrow: string;
  visitors: number;
}) {
  const { t, pickLocalized, pickLocalizedArray } = useI18n();

  const overview = pickLocalized(item.overview) || pickLocalized(item.description);
  const responsibilities = pickLocalizedArray(item.responsibilities);
  const challenges = pickLocalizedArray(item.challenges);
  const features = pickLocalizedArray(item.features);
  const archTitle = pickLocalized(item.architecture?.title);
  const archDesc = pickLocalized(item.architecture?.description);

  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
            {t("common.backToHome")}
          </Link>

          <motion.header
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-6 max-w-3xl"
          >
            <div className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary-glow">
              {eyebrow}
            </div>
            <h1 className="text-3xl font-bold md:text-5xl">{pickLocalized(item.title)}</h1>
            {(item.startDate || item.current) && (
              <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                {item.current && (
                  <span className="rounded-full bg-primary/20 px-2 py-0.5 text-xs font-medium text-primary-glow">
                    Current
                  </span>
                )}
                {item.startDate && (
                  <span>
                    {item.startDate} — {item.endDate || "Present"}
                  </span>
                )}
              </div>
            )}
            {(item.liveUrl || item.repoUrl) && (
              <div className="mt-5 flex flex-wrap items-center gap-3">
                {item.liveUrl && (
                  <a
                    href={item.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-md bg-gradient-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
                  >
                    <ExternalLink className="h-4 w-4" /> {t("details.liveDemo")}
                  </a>
                )}
                {item.repoUrl && (
                  <a
                    href={item.repoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-md border border-border bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground hover:border-primary/40"
                  >
                    <Github className="h-4 w-4" /> {t("details.sourceCode")}
                  </a>
                )}
              </div>
            )}
          </motion.header>

          {item.imageUrl && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mt-10"
            >
              {item.images && item.images.length > 0 && (
                <Block title={t("details.gallery")}>
                  <ImageCarousel images={item.images} alt={pickLocalized(item.title)} />
                </Block>
              )}
            </motion.div>
          )}

          <div className="mt-12 grid gap-10 lg:grid-cols-3">
            <div className="space-y-10 lg:col-span-2">
              {overview && (
                <Block title={t("details.overview")}>
                  <p className="leading-relaxed text-muted-foreground">{overview}</p>
                </Block>
              )}
              {features.length > 0 && (
                <Block title={t("details.features")}>
                  <BulletList items={features} />
                </Block>
              )}
              {responsibilities.length > 0 && (
                <Block title={t("details.responsibilities")}>
                  <BulletList items={responsibilities} />
                </Block>
              )}
              {challenges.length > 0 && (
                <Block title={t("details.challenges")}>
                  <BulletList items={challenges} />
                </Block>
              )}
              {(archTitle || archDesc) && (
                <Block title={t("details.architecture")}>
                  {archTitle && <h3 className="text-lg font-semibold">{archTitle}</h3>}
                  {archDesc && (
                    <p className="mt-2 leading-relaxed text-muted-foreground">{archDesc}</p>
                  )}
                </Block>
              )}
            </div>

            <aside className="space-y-8">
              {item.stack && item.stack.length > 0 && (
                <Block title={t("details.stack")}>
                  <TagList items={item.stack} variant="primary" />
                </Block>
              )}
              {item.skills && item.skills.length > 0 && (
                <Block title={t("details.skills")}>
                  <TagList items={item.skills} variant="secondary" />
                </Block>
              )}
              {item.tags && item.tags.length > 0 && (
                <Block title="Tags">
                  <TagList items={item.tags} variant="secondary" />
                </Block>
              )}
            </aside>
          </div>
        </div>
      </main>
      <Footer visitors={visitors} />
    </div>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-4 text-xl font-bold">{title}</h2>
      <div className="rounded-2xl border border-border bg-gradient-card p-6 shadow-elevated">
        {children}
      </div>
    </section>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((it, i) => (
        <li key={i} className="flex gap-2 text-muted-foreground">
          <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary-glow" />
          <span className="leading-relaxed">{it}</span>
        </li>
      ))}
    </ul>
  );
}

function TagList({ items, variant }: { items: string[]; variant: "primary" | "secondary" }) {
  const cls =
    variant === "primary"
      ? "bg-primary/10 text-primary-glow"
      : "bg-secondary text-secondary-foreground";
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((it) => (
        <span key={it} className={`rounded-md px-2 py-0.5 text-xs ${cls}`}>
          {it}
        </span>
      ))}
    </div>
  );
}
