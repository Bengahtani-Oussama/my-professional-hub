import { useI18n } from "@/lib/i18n";
import { Languages } from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import type { Locale } from "@/lib/types";

const LABELS: Record<Locale, string> = {
  en: "English", fr: "Français", ar: "العربية",
  nl: "Nederlands", it: "Italiano", es: "Español", tr: "Türkçe",
};
const UI: Locale[] = ["en", "fr", "ar"];

export function LangSwitcher() {
  const { locale, setLocale } = useI18n();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Languages className="h-4 w-4" />
          <span className="uppercase text-xs font-semibold">{locale}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-card border-border">
        {UI.map((l) => (
          <DropdownMenuItem key={l} onClick={() => setLocale(l)} className={locale === l ? "bg-accent" : ""}>
            {LABELS[l]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}