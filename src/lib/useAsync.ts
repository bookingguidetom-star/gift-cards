import { useCallback, useEffect, useState } from 'react';

interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useAsync<T>(
  asyncFn: () => Promise<T>,
  deps: ReadonlyArray<unknown> = [],
): AsyncState<T> & { refetch: () => void } {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  const run = useCallback(() => {
    let active = true;
    setState((s) => ({ ...s, loading: true, error: null }));
    asyncFn()
      .then((data) => {
        if (active) setState({ data, loading: false, error: null });
      })
      .catch((err: unknown) => {
        if (active) {
          setState({
            data: null,
            loading: false,
            error: err instanceof Error ? err.message : 'Something went wrong.',
          });
        }
      });
    return () => {
      active = false;
    };
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const cleanup = run();
    return cleanup;
  }, [run]);

  return { ...state, refetch: run };
}
