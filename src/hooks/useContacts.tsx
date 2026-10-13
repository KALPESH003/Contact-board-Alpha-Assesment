import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from 'react';
import { SEED_CONTACTS } from '../data/contacts';
import type { Contact, ContactPatch, SortKey, SortState, Stage, ViewMode } from '../types/contact';
import { createInitialState, reducer, type Notice } from './contactsReducer';

interface ContactsContextValue {
  contacts: Contact[];
  view: ViewMode;
  selectedContact: Contact | null;
  notice: Notice | null;
  query: string;
  stageFilter: Stage | null;
  sort: SortState | null;
  setView: (view: ViewMode) => void;
  openContact: (id: string) => void;
  closePanel: () => void;
  saveContact: (id: string, patch: ContactPatch) => void;
  moveContact: (id: string, stage: Stage) => void;
  undoLast: () => void;
  dismissNotice: () => void;
  setQuery: (query: string) => void;
  setStageFilter: (stage: Stage | null) => void;
  toggleSort: (key: SortKey) => void;
  clearFilters: () => void;
}

const ContactsContext = createContext<ContactsContextValue | null>(null);

const VIEW_KEY = 'contact-board:view';
function readStoredView(): ViewMode {
  try {
    const stored = window.localStorage.getItem(VIEW_KEY);
    return stored === 'board' ? 'board' : 'table';
  } catch {
    return 'table';
  }
}

interface ProviderProps {
  children: ReactNode;
  initialContacts?: Contact[];
}

export function ContactsProvider({ children, initialContacts = SEED_CONTACTS }: ProviderProps) {
  const [state, dispatch] = useReducer(reducer, undefined, () =>
    createInitialState(initialContacts, readStoredView()),
  );

  useEffect(() => {
    try {
      window.localStorage.setItem(VIEW_KEY, state.view);
    } catch {
    }
  }, [state.view]);
  const actions = useMemo(
    () => ({
      setView: (view: ViewMode) => dispatch({ type: 'setView', view }),
      openContact: (id: string) => dispatch({ type: 'open', id }),
      closePanel: () => dispatch({ type: 'close' }),
      saveContact: (id: string, patch: ContactPatch) => dispatch({ type: 'save', id, patch }),
      moveContact: (id: string, stage: Stage) => dispatch({ type: 'move', id, stage }),
      undoLast: () => dispatch({ type: 'undo' }),
      dismissNotice: () => dispatch({ type: 'dismissNotice' }),
      setQuery: (query: string) => dispatch({ type: 'setQuery', query }),
      setStageFilter: (stage: Stage | null) => dispatch({ type: 'setStageFilter', stage }),
      toggleSort: (key: SortKey) => dispatch({ type: 'toggleSort', key }),
      clearFilters: () => dispatch({ type: 'clearFilters' }),
    }),
    [],
  );

  const selectedContact = useMemo(
    () => state.contacts.find((c) => c.id === state.selectedId) ?? null,
    [state.contacts, state.selectedId],
  );

  const value = useMemo<ContactsContextValue>(
    () => ({
      contacts: state.contacts,
      view: state.view,
      selectedContact,
      notice: state.notice,
      query: state.query,
      stageFilter: state.stageFilter,
      sort: state.sort,
      ...actions,
    }),
    [state.contacts, state.view, state.notice, state.query, state.stageFilter, state.sort, selectedContact, actions],
  );

  return <ContactsContext.Provider value={value}>{children}</ContactsContext.Provider>;
}

export function useContacts(): ContactsContextValue {
  const ctx = useContext(ContactsContext);
  if (!ctx) throw new Error('useContacts must be used inside <ContactsProvider>');
  return ctx;
}
