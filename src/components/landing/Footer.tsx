import { useI18n } from "@/lib/i18n";
import { Eye } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function Footer({ visitors }: { visitors: number }) {
  const { t } = useI18n();
  return (
    <footer className="border-t border-border bg-card/50 py-8">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 text-sm text-muted-foreground md:flex-row">
        <div>© {new Date().getFullYear()} Portfolio. {t("footer.rights")}.</div>
        <div className="flex items-center gap-4">
          <span className="inline-flex items-center gap-1.5">
            <Eye className="h-4 w-4 text-primary-glow" />
            {visitors.toLocaleString()} {t("footer.visitors").toLowerCase()}
          </span>
          <Link to="/login" className="text-xs hover:text-foreground">{t("nav.admin")}</Link>
        </div>
      </div>
    </footer>
  );
}