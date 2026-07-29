import Fuse from 'fuse.js';
import type { IFuseOptions } from 'fuse.js';
import { useCallback, useMemo, useState, useTransition } from 'react';
import type { ChangeEvent } from 'react';

export function useFuse<T>({ data, options }: { data: T[]; options: IFuseOptions<T> }) {
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<T[]>([]);

  const fuseOptions = useMemo(
    () => ({
      threshold: 0.2,
      ...options,
    }),
    [options],
  );

  const fuse = useMemo(() => new Fuse(data, fuseOptions), [data, fuseOptions]);

  const handleSearch = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const newQuery = event.target.value;
      setQuery(newQuery);

      startTransition(() => {
        if (newQuery.length <= 1) {
          setResults([]);
          return;
        }

        setResults(fuse.search(newQuery).map((result) => result.item));
      });
    },
    [fuse],
  );

  const reset = useCallback(() => {
    setQuery("");
    setResults([]);
  }, []);

  return { handleSearch, isPending, query, reset, results };
}
