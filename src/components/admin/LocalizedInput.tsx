import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { UI_LOCALES, type LocalizedString, type LocalizedArray } from "@/lib/types";

const LABELS: Record<string, string> = { en: "English", fr: "Français", ar: "العربية" };

export function LocalizedInput({
  label, value, onChange, multiline = false,
}: {
  label: string;
  value: LocalizedString;
  onChange: (v: LocalizedString) => void;
  multiline?: boolean;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Tabs defaultValue="en">
        <TabsList className="bg-secondary">
          {UI_LOCALES.map((l) => (
            <TabsTrigger key={l} value={l}>{LABELS[l]}</TabsTrigger>
          ))}
        </TabsList>
        {UI_LOCALES.map((l) => (
          <TabsContent key={l} value={l} className="mt-2">
            {multiline ? (
              <Textarea
                rows={4}
                dir={l === "ar" ? "rtl" : "ltr"}
                value={value[l] ?? ""}
                onChange={(e) => onChange({ ...value, [l]: e.target.value })}
              />
            ) : (
              <Input
                dir={l === "ar" ? "rtl" : "ltr"}
                value={value[l] ?? ""}
                onChange={(e) => onChange({ ...value, [l]: e.target.value })}
              />
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

export function LocalizedListInput({
  label, value, onChange,
}: {
  label: string;
  value: LocalizedArray;
  onChange: (v: LocalizedArray) => void;
}) {
  return (
    <div className="space-y-2">
      <Label>{label} <span className="text-xs text-muted-foreground">(one per line)</span></Label>
      <Tabs defaultValue="en">
        <TabsList className="bg-secondary">
          {UI_LOCALES.map((l) => (
            <TabsTrigger key={l} value={l}>{LABELS[l]}</TabsTrigger>
          ))}
        </TabsList>
        {UI_LOCALES.map((l) => (
          <TabsContent key={l} value={l} className="mt-2">
            <Textarea
              rows={4}
              dir={l === "ar" ? "rtl" : "ltr"}
              value={(value[l] ?? []).join("\n")}
              onChange={(e) =>
                onChange({ ...value, [l]: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean) })
              }
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}