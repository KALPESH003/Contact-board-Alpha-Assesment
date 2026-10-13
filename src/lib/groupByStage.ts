import type { Contact, Stage } from '../types/contact';
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
