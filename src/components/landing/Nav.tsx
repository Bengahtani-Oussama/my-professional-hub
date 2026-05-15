import { Link } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import { LangSwitcher } from "@/components/LangSwitcher";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

const sections = [
  { id: "about", key: "nav.about" },
  { id: "experience", key: "nav.experience" },
  { id: "projects", key: "nav.projects" },
  { id: "skills", key: "nav.skills" },
  { id: "education", key: "nav.education" },
  { id: "contact", key: "nav.contact" },
];

export function Nav() {
  const { t } = useI18n();
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "glass shadow-elevated" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="font-display text-lg font-bold tracking-tight">
          <span className="text-gradient">Portfolio</span>
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          {sections.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {t(s.key)}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <LangSwitcher />
          <Button asChild size="sm" className="bg-gradient-primary text-primary-foreground hover:opacity-90">
            <a href="#contact">{t("nav.contact")}</a>
          </Button>
        </div>
      </div>
    </header>
  );
}