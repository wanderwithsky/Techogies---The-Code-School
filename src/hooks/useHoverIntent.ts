import { useCallback, useEffect, useRef, useState } from "react";

export function useHoverIntent(closeDelay = 150) {
  const [open, setOpen] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clear = () => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  };

  const openNow = useCallback(() => {
    clear();
    setOpen(true);
  }, []);

  const closeSoon = useCallback(() => {
    clear();
    timer.current = setTimeout(() => setOpen(false), closeDelay);
  }, [closeDelay]);

  const closeNow = useCallback(() => {
    clear();
    setOpen(false);
  }, []);

  useEffect(() => () => clear(), []);

  return { open, setOpen, openNow, closeSoon, closeNow };
}