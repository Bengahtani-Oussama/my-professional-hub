import type { ReactNode } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import type { ApiError, FieldErrorInfo } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useI18n, translateApiError, translateFieldError } from "@/lib/i18n";

/**
 * Render-prop wrapper that handles loading + error states for a query.
 * Children only render once data is present.
 */
export function QueryState<T>({
  loading,
  error,
  data,
  onRetry,
  loadingFallback,
  emptyFallback,
  children,
}: {
  loading: boolean;
  error: ApiError | null;
  data: T | null;
  onRetry?: () => void;
  loadingFallback?: ReactNode;
  emptyFallback?: ReactNode;
  children: (data: T) => ReactNode;
}) {
  if (loading && !data) return <>{loadingFallback ?? <DefaultSkeleton />}</>;
  if (error && !data) return <ErrorPanel error={error} onRetry={onRetry} />;
  if (!data) return <>{emptyFallback ?? null}</>;
  return <>{children(data)}</>;
}

export function DefaultSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-20 w-full rounded-2xl" />
      ))}
    </div>
  );
}

export function ErrorPanel({ error, onRetry }: { error: ApiError; onRetry?: () => void }) {
  const { t } = useI18n();
  return (
    <div
      role="alert"
      className="rounded-2xl border border-destructive/40 bg-destructive/10 p-6 text-sm"
    >
      <div className="flex items-start gap-3">
        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
        <div className="flex-1">
          <p className="font-medium text-foreground">{t("errors.title")}</p>
          <p className="mt-1 text-muted-foreground">{translateApiError(error, t)}</p>
        </div>
        {onRetry && (
          <Button size="sm" variant="outline" onClick={onRetry} className="gap-2">
            <RefreshCw className="h-3.5 w-3.5" /> {t("errors.retry")}
          </Button>
        )}
      </div>
    </div>
  );
}

/**
 * Inline field error text — pair with form inputs.
 * Accepts either a translated `message` string, a `FieldErrorInfo` from
 * an `ApiError.fieldErrors` map, or the raw `error` prop.
 */
export function FieldError({
  error,
  message,
}: {
  error?: FieldErrorInfo | string;
  message?: string;
}) {
  const { t } = useI18n();
  const text = message ?? translateFieldError(error, t);
  if (!text) return null;
  return <p className="mt-1 text-xs text-destructive">{text}</p>;
}