import { useCallback, useLayoutEffect, useRef } from 'react';
<<<<<<< HEAD

/**
 * Remembers scroll offsets per key (here: per view) for one scroll container.
 * Switching from table to board and back lands you where you left off.
 *
 * Closing the details panel needs no help: the panel is an overlay, so the
 * scroll container stays mounted and keeps its offset.
 */
=======
>>>>>>> e3008d5 (Initial commit for Contact Board Alpha Assessment)
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
