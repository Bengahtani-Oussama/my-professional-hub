import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { ApiError } from "./api";
import { translateApiError } from "./i18n-runtime";

function toApiError(e: unknown): ApiError {
  if (e instanceof ApiError) return e;
  if (e instanceof Error) return new ApiError({ message: e.message || "Something went wrong." });
  return new ApiError({ message: "Something went wrong." });
}

/**
 * Fetch a resource with built-in loading / error / refetch state.
 * `deps` works like useEffect dependencies — the query re-runs when they change.
 */
export function useApiQuery<T>(
  fn: () => Promise<T>,
  deps: ReadonlyArray<unknown> = [],
) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<ApiError | null>(null);
  const [loading, setLoading] = useState(true);
  const fnRef = useRef(fn);
  fnRef.current = fn;

  const run = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fnRef.current();
      setData(result);
    } catch (e) {
      setError(toApiError(e));
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    void run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, error, loading, refetch: run, setData } as const;
}

/**
 * Wraps an async action with loading + error state. By default any failure
 * raises a toast with a human-friendly message; pass `silent: true` to
 * handle errors yourself (e.g. when displaying inline field errors).
 */
export function useApiMutation<TArgs extends unknown[], TResult>(
  fn: (...args: TArgs) => Promise<TResult>,
  options: {
    successMessage?: string;
    onSuccess?: (result: TResult) => void;
    onError?: (error: ApiError) => void;
    silent?: boolean;
  } = {},
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const optsRef = useRef(options);
  optsRef.current = options;

  const mutate = useCallback(async (...args: TArgs): Promise<TResult | undefined> => {
    setLoading(true);
    setError(null);
    try {
      const result = await fn(...args);
      if (optsRef.current.successMessage) toast.success(optsRef.current.successMessage);
      optsRef.current.onSuccess?.(result);
      return result;
    } catch (e) {
      const err = toApiError(e);
      setError(err);
      if (!optsRef.current.silent) toast.error(translateApiError(err));
      optsRef.current.onError?.(err);
      return undefined;
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fn]);

  return { mutate, loading, error, reset: () => setError(null) } as const;
}