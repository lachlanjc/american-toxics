import { useRef, useEffect } from "react";

export function useFocusable() {
  const inputRef = useRef<HTMLInputElement>(null);
  const focusInput = (e: KeyboardEvent) => {
    if (e.key === "/") inputRef.current?.focus();
  };
  useEffect(() => {
    document.addEventListener("keyup", focusInput);
    return () => {
      document.removeEventListener("keyup", focusInput);
    };
  }, []);

  return inputRef;
}
