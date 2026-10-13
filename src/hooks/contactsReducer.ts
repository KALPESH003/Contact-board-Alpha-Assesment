import { SEED_CONTACTS } from '../data/contacts';
import { present } from '../lib/text';
import type { Contact, ContactPatch, SortKey, SortState, Stage, ViewMode } from '../types/contact';

export interface Notice {
<<<<<<< HEAD
  /** Monotonic id so the toast timer restarts even when the text is identical. */
  seq: number;
  text: string;
  /** Snapshot of the record before the change; present when it can be undone. */
=======
  seq: number;
  text: string;
>>>>>>> e3008d5 (Initial commit for Contact Board Alpha Assessment)
  undo?: Contact;
}

export interface State {
<<<<<<< HEAD
  /** The single source of truth. Table and board are both derived from this. */
  contacts: Contact[];
  view: ViewMode;
  /** Only the id is stored; the record itself is always looked up fresh. */
=======
  contacts: Contact[];
  view: ViewMode;
>>>>>>> e3008d5 (Initial commit for Contact Board Alpha Assessment)
  selectedId: string | null;
  notice: Notice | null;
  noticeSeq: number;
  query: string;
  stageFilter: Stage | null;
  sort: SortState | null;
}

export type Action =
  | { type: 'setView'; view: ViewMode }
  | { type: 'open'; id: string }
  | { type: 'close' }
  | { type: 'save'; id: string; patch: ContactPatch }
  | { type: 'move'; id: string; stage: Stage }
  | { type: 'undo' }
  | { type: 'dismissNotice' }
  | { type: 'setQuery'; query: string }
  | { type: 'setStageFilter'; stage: Stage | null }
  | { type: 'toggleSort'; key: SortKey }
  | { type: 'clearFilters' };

export function createInitialState(contacts: Contact[] = SEED_CONTACTS, view: ViewMode = 'table'): State {
  return {
    contacts,
    view,
    selectedId: null,
    notice: null,
    noticeSeq: 0,
    query: '',
    stageFilter: null,
    sort: null,
  };
}

<<<<<<< HEAD
/**
 * Applies a Stage/Notes patch to one record. `source` decides whether the details
 * panel closes afterwards (Save) or stays as it is (drag / keyboard move).
 */
=======
>>>>>>> e3008d5 (Initial commit for Contact Board Alpha Assessment)
function commit(state: State, id: string, patch: ContactPatch, source: 'panel' | 'move'): State {
  const closing = source === 'panel' ? { selectedId: null } : {};
  const current = state.contacts.find((c) => c.id === id);
  if (!current) return { ...state, ...closing };

  const next: Contact = { ...current };
  if (patch.stage !== undefined) next.stage = patch.stage;
  if ('notes' in patch) next.notes = present(patch.notes);

  const stageChanged = next.stage !== current.stage;
  const notesChanged = next.notes !== current.notes;
  if (!stageChanged && !notesChanged) return { ...state, ...closing };

  const seq = state.noticeSeq + 1;
  const text = stageChanged ? `Moved ${next.name} to ${next.stage}.` : `Saved notes for ${next.name}.`;

  return {
    ...state,
    ...closing,
<<<<<<< HEAD
    // Replace by id: same array position, so rows do not jump around.
=======
>>>>>>> e3008d5 (Initial commit for Contact Board Alpha Assessment)
    contacts: state.contacts.map((c) => (c.id === id ? next : c)),
    noticeSeq: seq,
    notice: { seq, text, undo: current },
  };
}

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'setView':
      return state.view === action.view ? state : { ...state, view: action.view };

    case 'open':
<<<<<<< HEAD
      // Ignore ids that do not exist so the panel can never open on nothing.
=======
>>>>>>> e3008d5 (Initial commit for Contact Board Alpha Assessment)
      return state.contacts.some((c) => c.id === action.id) ? { ...state, selectedId: action.id } : state;

    case 'close':
      return state.selectedId === null ? state : { ...state, selectedId: null };

    case 'save':
      return commit(state, action.id, action.patch, 'panel');

    case 'move':
      return commit(state, action.id, { stage: action.stage }, 'move');

    case 'undo': {
      const snapshot = state.notice?.undo;
      if (!snapshot) return state;
      const seq = state.noticeSeq + 1;
      return {
        ...state,
        contacts: state.contacts.map((c) => (c.id === snapshot.id ? snapshot : c)),
        noticeSeq: seq,
        notice: { seq, text: `Undid changes to ${snapshot.name}.` },
      };
    }

    case 'dismissNotice':
      return state.notice ? { ...state, notice: null } : state;

    case 'setQuery':
      return state.query === action.query ? state : { ...state, query: action.query };

    case 'setStageFilter':
      return state.stageFilter === action.stage ? state : { ...state, stageFilter: action.stage };

    case 'toggleSort': {
      // none -> ascending -> descending -> none
      const { sort } = state;
      if (!sort || sort.key !== action.key) return { ...state, sort: { key: action.key, dir: 'asc' } };
      return { ...state, sort: sort.dir === 'asc' ? { key: action.key, dir: 'desc' } : null };
    }

    case 'clearFilters':
      return { ...state, query: '', stageFilter: null };
  }
}
