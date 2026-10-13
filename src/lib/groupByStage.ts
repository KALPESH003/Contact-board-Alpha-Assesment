import type { Contact, Stage } from '../types/contact';

<<<<<<< HEAD
/**
 * Derives board columns from the single contacts array. Nothing is stored per
 * column, so a record can only ever exist in one place. Original order is kept
 * within each group.
 */
=======
>>>>>>> e3008d5 (Initial commit for Contact Board Alpha Assessment)
export function groupByStage(contacts: Contact[]): Record<Stage, Contact[]> {
  const groups: Record<Stage, Contact[]> = {
    Lead: [],
    Prospect: [],
    Qualified: [],
    Customer: [],
  };
  for (const contact of contacts) {
    groups[contact.stage]?.push(contact);
  }
  return groups;
}
