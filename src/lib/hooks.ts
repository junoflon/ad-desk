"use client";

import { useState, useEffect, useCallback } from "react";

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useApi<T>(url: string | null, deps: unknown[] = []) {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    loading: !!url,
    error: null,
  });

  useEffect(() => {
    if (!url) return;
    setState((prev) => ({ ...prev, loading: true, error: null }));

    fetch(url)
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          setState({ data: json.data, loading: false, error: null });
        } else {
          setState({ data: null, loading: false, error: json.error });
        }
      })
      .catch((err) => {
        setState({ data: null, loading: false, error: err.message });
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, ...deps]);

  return state;
}

export function useMutation<TData, TBody = unknown>(url: string, method = "POST") {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(
    async (body?: TBody): Promise<TData | null> => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: body ? JSON.stringify(body) : undefined,
        });
        const json = await res.json();
        if (json.success) {
          setLoading(false);
          return json.data as TData;
        } else {
          setError(json.error);
          setLoading(false);
          return null;
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
        setLoading(false);
        return null;
      }
    },
    [url, method]
  );

  return { mutate, loading, error };
}
