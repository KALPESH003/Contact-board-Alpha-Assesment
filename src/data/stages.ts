import type { Stage } from '../types/contact';

export const STAGES: Stage[] = ['Lead', 'Prospect', 'Qualified', 'Customer'];

interface StageMeta {
  /** Colour of the small dot. */
  dot: string;
  /** Tinted pill used in the table, board headers and the panel. */
  badge: string;
  /** Applied to the radio pill in the panel when it is checked. */
  selected: string;
  emptyTitle: string;
  emptyHint: string;
}

// Full class strings (not interpolated) so Tailwind can see them at build time.
export const STAGE_META: Record<Stage, StageMeta> = {
  Lead: {
    dot: 'bg-stone-400',
    badge: 'bg-stone-100 text-stone-700',
    selected: 'peer-checked:border-stone-400 peer-checked:bg-stone-100 peer-checked:font-medium',
    emptyTitle: 'No leads',
    emptyHint: 'New contacts that have not replied yet show up here.',
  },
  Prospect: {
    dot: 'bg-sky-500',
    badge: 'bg-sky-100 text-sky-800',
    selected: 'peer-checked:border-sky-400 peer-checked:bg-sky-100 peer-checked:font-medium',
    emptyTitle: 'No prospects',
    emptyHint: 'Contacts you are in conversation with show up here.',
  },
  Qualified: {
    dot: 'bg-amber-500',
    badge: 'bg-amber-100 text-amber-900',
    selected: 'peer-checked:border-amber-400 peer-checked:bg-amber-100 peer-checked:font-medium',
    emptyTitle: 'No qualified contacts',
    emptyHint: 'Contacts with a confirmed need and budget show up here.',
  },
  Customer: {
    dot: 'bg-emerald-500',
    badge: 'bg-emerald-100 text-emerald-900',
    selected: 'peer-checked:border-emerald-400 peer-checked:bg-emerald-100 peer-checked:font-medium',
    emptyTitle: 'No customers yet',
    emptyHint: 'Open a contact and set its stage to Customer to move it here.',
  },
};
