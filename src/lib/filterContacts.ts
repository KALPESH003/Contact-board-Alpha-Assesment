import { STAGES } from '../data/stages';
import type { Contact, SortState, Stage } from '../types/contact';

export interface ViewQuery {
  query: string;
  stage: Stage | null;
  sort: SortState | null;
}

function haystack(c: Contact): string {
  return [c.name, c.email, c.company, c.role, c.owner, c.stage, c.notes ?? '', ...(c.labels ?? [])]
    .join('\n')
    .toLowerCase();
}

<<<<<<< HEAD
/** Every whitespace-separated term must appear somewhere in the record. */
=======
>>>>>>> e3008d5 (Initial commit for Contact Board Alpha Assessment)
export function matchesQuery(contact: Contact, query: string): boolean {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return true;
  const text = haystack(contact);
  return terms.every((t) => text.includes(t));
}

function compare(a: Contact, b: Contact, sort: SortState): number {
  if (sort.key === 'stage') {
    return STAGES.indexOf(a.stage) - STAGES.indexOf(b.stage);
  }
  return a[sort.key].localeCompare(b[sort.key], undefined, { sensitivity: 'base' });
}

<<<<<<< HEAD
/**
 * Pure selector shared by both views: search -> stage filter -> sort.
 * Blank values always sort last, whatever the direction.
 */
=======
>>>>>>> e3008d5 (Initial commit for Contact Board Alpha Assessment)
export function selectContacts(contacts: Contact[], { query, stage, sort }: ViewQuery): Contact[] {
  let result = contacts.filter((c) => matchesQuery(c, query) && (stage === null || c.stage === stage));
  if (sort) {
    const dir = sort.dir === 'asc' ? 1 : -1;
    const blank = (c: Contact) => sort.key !== 'stage' && c[sort.key].trim() === '';
    result = [...result].sort((a, b) => {
      const ba = blank(a);
      const bb = blank(b);
      if (ba || bb) return ba === bb ? 0 : ba ? 1 : -1;
      return compare(a, b, sort) * dir;
    });
  }
  return result;
}
