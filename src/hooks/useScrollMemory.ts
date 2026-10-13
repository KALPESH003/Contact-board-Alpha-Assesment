import { useCallback, useLayoutEffect, useRef } from 'react';
export function useScrollMemory<T extends HTMLElement>(key: string) {
  const ref = useRef<T>(null);
  const positions = useRef<Record<string, { top: number; left: number }>>({});
  const activeKey = useRef(key);

  useLayoutEffect(() => {
    activeKey.current = key;
    const el = ref.current;
    if (!el) return;
    const saved = positions.current[key];
    el.scrollTo({ top: saved?.top ?? 0, left: saved?.left ?? 0 });
  }, [key]);

  const onScroll = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    positions.current[activeKey.current] = { top: el.scrollTop, left: el.scrollLeft };
  }, []);

  return { ref, onScroll };
}
