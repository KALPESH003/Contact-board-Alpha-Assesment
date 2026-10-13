import type { DragEvent } from 'react';
import { STAGE_META } from '../data/stages';
import type { Contact, Stage } from '../types/contact';
import { ContactCard } from './ContactCard';
import { StageBadge } from './StageBadge';

interface Props {
  stage: Stage;
  contacts: Contact[];  filtering: boolean;
  selectedId: string | undefined;
  draggingId: string | null;
  isDropTarget: boolean;
  onOpen: (id: string) => void;
  onMove: (id: string, stage: Stage) => void;
  onDragStart: (id: string) => void;
  onDragEnd: () => void;
  onDragEnterColumn: (stage: Stage | null) => void;
  onDropOnColumn: (stage: Stage) => void;
}

export function BoardColumn(props: Props) {
  const { stage, contacts, filtering, selectedId, draggingId, isDropTarget } = props;
  const headingId = `column-${stage}`;
  const meta = STAGE_META[stage];

  function onDragOver(event: DragEvent<HTMLElement>) {
    if (!draggingId) return;
    event.preventDefault(); // marks the column as a valid drop target
    event.dataTransfer.dropEffect = 'move';
  }

  function onDragLeave(event: DragEvent<HTMLElement>) {    if (event.currentTarget.contains(event.relatedTarget as Node | null)) return;
    props.onDragEnterColumn(null);
  }

  return (
    <section
      aria-labelledby={headingId}
      onDragEnter={() => draggingId && props.onDragEnterColumn(stage)}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={(event) => {
        event.preventDefault();
        props.onDropOnColumn(stage);
      }}
      className={`flex min-w-0 flex-col rounded-xl p-2 transition-colors ${
        isDropTarget ? 'bg-accent-soft ring-2 ring-inset ring-accent/40' : 'bg-column'
      }`}
    >
      <h2 id={headingId} className="flex items-center gap-2 px-1 pb-2 pt-1 text-sm">
        <StageBadge stage={stage} />
        <span className="tabular-nums text-muted">
          <span className="sr-only">Contacts: </span>
          {contacts.length}
        </span>
      </h2>

      {contacts.length === 0 ? (
        <div className="rounded-lg border border-dashed border-stone-300 bg-canvas/60 px-3 py-8 text-center">
          {filtering ? (
            <p className="text-sm text-muted">No matches in this stage</p>
          ) : (
            <>
              <p className="text-sm font-medium text-ink">{meta.emptyTitle}</p>
              <p className="mt-1 text-xs text-muted">{meta.emptyHint}</p>
              <p className="mt-2 text-xs text-muted">{isDropTarget ? 'Release to move here' : 'Drop a card here'}</p>
            </>
          )}
        </div>
      ) : (
        <ul className="flex flex-col gap-2">
          {contacts.map((contact) => (
            <ContactCard
              key={contact.id}
              contact={contact}
              selected={contact.id === selectedId}
              dragging={contact.id === draggingId}
              onOpen={props.onOpen}
              onMove={props.onMove}
              onDragStart={props.onDragStart}
              onDragEnd={props.onDragEnd}
            />
          ))}
        </ul>
      )}
    </section>
  );
}
