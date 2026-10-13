import { STAGE_META } from '../data/stages';
import type { Stage } from '../types/contact';

const FALLBACK = { dot: 'bg-stone-400', badge: 'bg-stone-100 text-stone-700' };

export function StageBadge({ stage }: { stage: Stage }) {
  const meta = STAGE_META[stage] ?? FALLBACK;
  return (
    <span
      className={`inline-flex max-w-full items-center gap-1.5 rounded px-1.5 py-0.5 text-xs font-medium leading-4 ${meta.badge}`}
    >
      <span aria-hidden="true" className={`h-1.5 w-1.5 shrink-0 rounded-full ${meta.dot}`} />
      <span className="truncate">{stage}</span>
    </span>
  );
}
