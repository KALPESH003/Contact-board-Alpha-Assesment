import type { DragEvent, KeyboardEvent } from 'react';
import { STAGES } from '../data/stages';
import { cleanLabels, present } from '../lib/text';
import type { Contact, Stage } from '../types/contact';
import { Avatar } from './Avatar';
import { BuildingIcon } from './icons';
import { LabelList } from './LabelList';

interface Props {
  contact: Contact;
  selected: boolean;
  dragging: boolean;
  onOpen: (id: string) => void;
  onMove: (id: string, stage: Stage) => void;
  onDragStart: (id: string) => void;
  onDragEnd: () => void;
}

export function ContactCard({ contact, selected, dragging, onOpen, onMove, onDragStart, onDragEnd }: Props) {
  const role = present(contact.role);
  const company = present(contact.company);
  const hasLabels = cleanLabels(contact.labels).length > 0;

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.target !== event.currentTarget) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onOpen(contact.id);
    } else if (event.altKey && (event.key === 'ArrowLeft' || event.key === 'ArrowRight')) {
      event.preventDefault();
      const target = STAGES[STAGES.indexOf(contact.stage) + (event.key === 'ArrowRight' ? 1 : -1)];
      if (target) onMove(contact.id, target);
    }
  }

  function handleDragStart(event: DragEvent<HTMLDivElement>) {
    event.dataTransfer.setData('text/plain', contact.id); // Firefox needs data to start a drag
    event.dataTransfer.effectAllowed = 'move';
    onDragStart(contact.id);
  }

  return (
    <li>
      <div
        role="button"
        tabIndex={0}
        draggable
        data-contact-id={contact.id}
        aria-label={`Open details for ${contact.name}`}
        aria-keyshortcuts="Alt+ArrowLeft Alt+ArrowRight"
        onClick={() => onOpen(contact.id)}
        onKeyDown={onKeyDown}
        onDragStart={handleDragStart}
        onDragEnd={onDragEnd}
        className={`focus-ring block w-full cursor-grab select-none rounded-lg border p-3 text-left shadow-card transition-[background-color,opacity,box-shadow] active:cursor-grabbing ${
          dragging ? 'opacity-40' : 'hover:shadow-md'
        } ${selected ? 'border-accent bg-accent-soft' : 'border-line bg-canvas hover:bg-hover'}`}
      >
        <span className="flex items-center gap-2.5">
          <Avatar name={contact.name} />
          <span className="min-w-0">
            <span className="block truncate text-sm font-medium">{contact.name}</span>
            <span className="block truncate text-xs text-muted" title={role}>
              {role ?? 'No role'}
            </span>
          </span>
        </span>

        <span className="mt-2.5 flex items-center gap-1.5 text-xs text-muted">
          <BuildingIcon className="shrink-0" />
          <span className="truncate" title={company}>
            {company ?? 'No company'}
          </span>
        </span>

        {hasLabels && (
          <span className="mt-2.5 block">
            <LabelList labels={contact.labels} max={2} wrap />
          </span>
        )}
      </div>
    </li>
  );
}
