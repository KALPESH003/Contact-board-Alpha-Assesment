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
  const groups = useMemo(
    () => groupByStage(selectContacts(contacts, { query, stage: null, sort: null })),
    [contacts, query],
  );

  function move(id: string, stage: Stage) {
    moveContact(id, stage);
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
