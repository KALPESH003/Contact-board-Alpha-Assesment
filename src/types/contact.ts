export type Stage = 'Lead' | 'Prospect' | 'Qualified' | 'Customer';

export type ViewMode = 'table' | 'board';

export interface Contact {
  id: string;
  name: string;
  email: string;
  company: string;
  role: string;
  owner: string;
  labels: string[];
  stage: Stage;
  notes?: string;
}

<<<<<<< HEAD
/** The only fields the details panel is allowed to change. */
=======
>>>>>>> e3008d5 (Initial commit for Contact Board Alpha Assessment)
export type ContactPatch = Partial<Pick<Contact, 'stage' | 'notes'>>;

export type SortKey = 'name' | 'email' | 'company' | 'role' | 'owner' | 'stage';

export interface SortState {
  key: SortKey;
  dir: 'asc' | 'desc';
}
