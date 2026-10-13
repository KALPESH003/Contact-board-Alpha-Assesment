import { useEffect, useRef, type RefObject } from 'react';

const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

interface Options {
  onEscape: () => void;
  returnFocusSelector?: string;
}
export function useFocusTrap(containerRef: RefObject<HTMLElement>, options: Options) {
  const { returnFocusSelector } = options;
  const escapeRef = useRef(options.onEscape);
  useEffect(() => {
    escapeRef.current = options.onEscape;
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    container.focus({ preventScroll: true });

    const getFocusable = () =>
      Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => el.getAttribute('aria-hidden') !== 'true',
      );

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault();
        escapeRef.current();
        return;
      }
      if (event.key !== 'Tab') return;

      const nodes = getFocusable();
      if (nodes.length === 0) {
        event.preventDefault();
        container!.focus();
        return;
      }
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      const active = document.activeElement;
      const outside = !container!.contains(active);

      if (event.shiftKey) {
        if (active === first || active === container || outside) {
          event.preventDefault();
          last.focus();
        }
      } else if (active === last || outside) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      const target =
        (returnFocusSelector ? document.querySelector<HTMLElement>(returnFocusSelector) : null) ?? opener;
      if (target?.isConnected) target.focus({ preventScroll: true });
    };
  }, [containerRef, returnFocusSelector]);
}
