import { useState, useTransition } from "react";
import Fuse, { IFuseOptions } from "fuse.js";

export function useFuse<T>({
  data,
  options,
}: {
  data: Array<T>;
  options: IFuseOptions<T>;
}) {
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Array<T>>([]);

  const fuseOptions = {
    threshold: 0.2,
    ...options,
  };

  const fuse = new Fuse(data, fuseOptions);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);

    startTransition(() => {
      if (newQuery.length > 1) {
        const newResults = fuse.search(newQuery).map((result) => result.item);
        setResults(newResults ?? []);
      }
    });
  };

  const reset = () => setQuery("");

  return { results, handleSearch, query, reset, isPending };
}
