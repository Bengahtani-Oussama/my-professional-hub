import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";

export function PageHeader({
  title, description, onCreate,
}: {
  title: string;
  description?: string;
  onCreate?: () => void;
}) {
  const { t } = useI18n();
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      {onCreate && (
        <Button onClick={onCreate} className="bg-gradient-primary text-primary-foreground hover:opacity-90 gap-2">
          <Plus className="h-4 w-4" /> {t("admin.create")}
        </Button>
      )}
    </div>
  );
}