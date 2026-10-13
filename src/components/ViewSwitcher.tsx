import type { KeyboardEvent, ReactNode } from 'react';
import type { ViewMode } from '../types/contact';
import { BoardIcon, TableIcon } from './icons';

interface Props {
  view: ViewMode;
  onChange: (view: ViewMode) => void;
}

const OPTIONS: { id: ViewMode; label: string; icon: ReactNode }[] = [
  { id: 'table', label: 'Table', icon: <TableIcon /> },
  { id: 'board', label: 'Board', icon: <BoardIcon /> },
];

export function ViewSwitcher({ view, onChange }: Props) {
  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const index = OPTIONS.findIndex((o) => o.id === view);
    let next = index;
    if (event.key === 'ArrowRight') next = (index + 1) % OPTIONS.length;
    else if (event.key === 'ArrowLeft') next = (index - 1 + OPTIONS.length) % OPTIONS.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = OPTIONS.length - 1;
    else return;

    event.preventDefault();
    onChange(OPTIONS[next].id);
    document.getElementById(`tab-${OPTIONS[next].id}`)?.focus();
  }

  return (
    <div
      role="tablist"
      aria-label="Contact view"
      onKeyDown={onKeyDown}
      className="inline-flex rounded-lg bg-white p-0.5 ring-1 ring-line"
    >
      {OPTIONS.map((option) => {
        const selected = option.id === view;
        return (
          <button
            key={option.id}
            id={`tab-${option.id}`}
            type="button"
            role="tab"
            aria-selected={selected}
            aria-controls="view-panel"
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(option.id)}
            className={`focus-ring inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm transition-colors ${
              selected
                ? 'bg-hover font-medium text-ink shadow-card ring-1 ring-line'
                : 'text-muted hover:text-ink'
            }`}
          >
            {option.icon}
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
