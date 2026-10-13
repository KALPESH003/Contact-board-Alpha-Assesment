import { useLayoutEffect, useMemo, useRef } from 'react';
import { BoardView } from './components/BoardView';
import { DetailsPanel } from './components/DetailsPanel';
import { ErrorBoundary } from './components/ErrorBoundary';
import { PeopleIcon } from './components/icons';
import { TableView } from './components/TableView';
import { Toast } from './components/Toast';
import { Toolbar } from './components/Toolbar';
import { ViewSwitcher } from './components/ViewSwitcher';
import { ContactsProvider, useContacts } from './hooks/useContacts';
import { useScrollMemory } from './hooks/useScrollMemory';
import { selectContacts } from './lib/filterContacts';

function Shell() {
  const { contacts, view, setView, selectedContact, query, stageFilter } = useContacts();
  const { ref: scrollRef, onScroll } = useScrollMemory<HTMLElement>(view);
  const pageRef = useRef<HTMLDivElement>(null);
  const panelOpen = selectedContact !== null;

<<<<<<< HEAD
  // While the panel is open the page behind it is inert: no focus, no clicks,
  // hidden from assistive tech. A layout effect (not useEffect) so inert is
  // lifted before the panel's cleanup tries to return focus to the opener.
=======
>>>>>>> e3008d5 (Initial commit for Contact Board Alpha Assessment)
  useLayoutEffect(() => {
    const el = pageRef.current;
    if (!el) return;
    if (panelOpen) el.setAttribute('inert', '');
    else el.removeAttribute('inert');
  }, [panelOpen]);

<<<<<<< HEAD
  // The board always shows all four stages, so the stage filter only counts in the table.
=======
>>>>>>> e3008d5 (Initial commit for Contact Board Alpha Assessment)
  const shown = useMemo(
    () => selectContacts(contacts, { query, stage: view === 'table' ? stageFilter : null, sort: null }).length,
    [contacts, query, stageFilter, view],
  );
  const total = contacts.length;
  const noun = total === 1 ? 'person' : 'people';
  const countLabel = shown === total ? `${total} ${noun}` : `${shown} of ${total} ${noun}`;

  return (
    <>
<<<<<<< HEAD
      {/* Blurred backdrop. Swap public/backdrop.svg for any photo to restyle. */}
=======
>>>>>>> e3008d5 (Initial commit for Contact Board Alpha Assessment)
      <div
        aria-hidden="true"
        className="fixed inset-[-4%] -z-10 bg-cover bg-center blur-[18px] saturate-[1.15]"
        style={{ backgroundImage: `url(${import.meta.env.BASE_URL}backdrop.svg)` }}
      />
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 bg-black/10" />
<<<<<<< HEAD
      {/* Thin inset frame, only where there is room for it. */}
=======
>>>>>>> e3008d5 (Initial commit for Contact Board Alpha Assessment)
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-[30px] hidden rounded-[3px] border border-white/60 xl:block"
      />

      <div ref={pageRef} className="flex h-dvh min-h-0 flex-col gap-3 p-3 md:p-5 xl:p-[42px]">
        <header className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-xl bg-white/80 px-4 py-2.5 shadow-glass ring-1 ring-white/70 backdrop-blur-xl">
          <h1 className="text-xl font-medium tracking-tight">Contacts</h1>
          <p className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs text-muted ring-1 ring-line">
            <PeopleIcon />
            <span aria-live="polite">{countLabel}</span>
          </p>
          <div className="ml-auto">
            <ViewSwitcher view={view} onChange={setView} />
          </div>
        </header>

        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl bg-white shadow-sheet ring-1 ring-white/70">
          <Toolbar />
          <main
            id="view-panel"
            role="tabpanel"
            aria-labelledby={`tab-${view}`}
            ref={scrollRef}
            onScroll={onScroll}
            className="relative min-h-0 flex-1 overflow-auto"
          >
            <ErrorBoundary key={view} label={view === 'table' ? 'table' : 'board'}>
              {view === 'table' ? <TableView /> : <BoardView />}
            </ErrorBoundary>
          </main>
        </div>
      </div>

      <DetailsPanel />
      <Toast />
    </>
  );
}

export default function App() {
  return (
    <ContactsProvider>
      <Shell />
    </ContactsProvider>
  );
}
