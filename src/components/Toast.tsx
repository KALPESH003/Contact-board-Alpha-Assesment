import { useEffect } from 'react';
import { useContacts } from '../hooks/useContacts';

<<<<<<< HEAD
/**
 * Polite live region + short-lived confirmation. Stage changes carry an Undo,
 * so a mis-drop or a hasty save is one click from recovery.
 */
=======
>>>>>>> e3008d5 (Initial commit for Contact Board Alpha Assessment)
export function Toast() {
  const { notice, dismissNotice, undoLast } = useContacts();

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(dismissNotice, notice.undo ? 7000 : 4000);
    return () => window.clearTimeout(timer);
  }, [notice, dismissNotice]);

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center px-4"
    >
      {notice && (
        <div className="pointer-events-auto flex items-center gap-3 rounded-lg bg-ink py-2 pl-4 pr-2 text-sm text-white shadow-toast motion-safe:animate-fade-in">
          <p>{notice.text}</p>
          {notice.undo && (
            <button
              type="button"
              onClick={undoLast}
              className="focus-ring rounded-md px-2.5 py-1 font-medium text-sky-200 hover:bg-white/10 focus-visible:ring-offset-ink"
            >
              Undo
            </button>
          )}
        </div>
      )}
    </div>
  );
}
