import { useMemo, useState } from 'react';
import { STAGES } from '../data/stages';
import { useContacts } from '../hooks/useContacts';
import { selectContacts } from '../lib/filterContacts';
import { groupByStage } from '../lib/groupByStage';
import type { Stage } from '../types/contact';
import { BoardColumn } from './BoardColumn';

export function BoardView() {
  const { contacts, query, selectedContact, openContact, moveContact } = useContacts();
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [overStage, setOverStage] = useState<Stage | null>(null);

  // Derived from the shared list on every change; never stored separately.
  // The board shows every stage, so only the search applies here.
  const groups = useMemo(
    () => groupByStage(selectContacts(contacts, { query, stage: null, sort: null })),
    [contacts, query],
  );

  function move(id: string, stage: Stage) {
    moveContact(id, stage);
    // The card re-mounts in its new column; hand focus back so keyboard users keep their place.
    requestAnimationFrame(() => document.querySelector<HTMLElement>(`[data-contact-id="${id}"]`)?.focus());
  }

  function endDrag() {
    setDraggingId(null);
    setOverStage(null);
  }

  function drop(stage: Stage) {
    const contact = contacts.find((c) => c.id === draggingId);
    endDrag();
    if (contact && contact.stage !== stage) moveContact(contact.id, stage);
  }

  return (
    // Four equal columns; below ~1100px the board scrolls horizontally instead
    // of squeezing cards into unreadable widths.
    <div className="grid min-w-[1100px] grid-cols-4 items-start gap-3 p-4">
      {STAGES.map((stage) => (
        <BoardColumn
          key={stage}
          stage={stage}
          contacts={groups[stage]}
          filtering={query.trim() !== ''}
          selectedId={selectedContact?.id}
          draggingId={draggingId}
          isDropTarget={draggingId !== null && overStage === stage}
          onOpen={openContact}
          onMove={move}
          onDragStart={setDraggingId}
          onDragEnd={endDrag}
          onDragEnterColumn={setOverStage}
          onDropOnColumn={drop}
        />
      ))}
    </div>
  );
}
