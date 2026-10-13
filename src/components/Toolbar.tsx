import { useEffect, useMemo, useRef } from 'react';
import { STAGES, STAGE_META } from '../data/stages';
import { useContacts } from '../hooks/useContacts';
import { selectContacts } from '../lib/filterContacts';
import { groupByStage } from '../lib/groupByStage';
import { CloseIcon, SearchIcon } from './icons';

function isTypingTarget(target: EventTarget | null): boolean {
  return (
    target instanceof HTMLElement &&
    (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName))
  );
}

export function Toolbar() {
  const { contacts, view, query, setQuery, stageFilter, setStageFilter } = useContacts();
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== '/' || event.metaKey || event.ctrlKey || event.altKey) return;
      if (isTypingTarget(event.target) || document.querySelector('[role="dialog"]')) return;
      event.preventDefault();
      inputRef.current?.focus();
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  const counts = useMemo(() => {
    const groups = groupByStage(selectContacts(contacts, { query, stage: null, sort: null }));
    return STAGES.map((stage) => ({ stage, count: groups[stage].length }));
  }, [contacts, query]);
  const total = counts.reduce((n, c) => n + c.count, 0);

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-line px-4 py-2.5">
      <div className="relative w-full max-w-[260px] flex-1 basis-48">
        <SearchIcon className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-muted" />
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              if (query) {
                e.preventDefault();
                setQuery('');
              } else {
                inputRef.current?.blur();
              }
            }
          }}
          placeholder="Search contacts"
          aria-label="Search contacts"
          className="focus-ring h-8 w-full rounded-md border border-line bg-canvas pl-8 pr-14 text-sm placeholder:text-muted [&::-webkit-search-cancel-button]:hidden"
        />
        {query ? (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              inputRef.current?.focus();
            }}
            aria-label="Clear search"
            className="focus-ring absolute right-1.5 top-1/2 -translate-y-1/2 rounded p-1 text-muted hover:bg-hover hover:text-ink"
          >
            <CloseIcon width={12} height={12} />
          </button>
        ) : (
          <kbd
            aria-hidden="true"
            className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 rounded border border-line bg-hover px-1.5 text-[11px] leading-4 text-muted"
          >
            /
          </kbd>
        )}
      </div>

      {view === 'table' ? (
        <div role="group" aria-label="Filter by stage" className="flex flex-wrap items-center gap-1.5">
          <FilterChip active={stageFilter === null} onClick={() => setStageFilter(null)} label="All" count={total} />
          {counts.map(({ stage, count }) => (
            <FilterChip
              key={stage}
              active={stageFilter === stage}
              onClick={() => setStageFilter(stageFilter === stage ? null : stage)}
              label={stage}
              count={count}
              dot={STAGE_META[stage].dot}
            />
          ))}
        </div>
      ) : (
        <p className="hidden text-xs text-muted lg:block">
          Drag cards between columns, or focus a card and press{' '}
          <kbd className="rounded border border-line bg-hover px-1 text-[11px]">Alt</kbd>{' '}
          <kbd className="rounded border border-line bg-hover px-1 text-[11px]">←</kbd>{' '}
          <kbd className="rounded border border-line bg-hover px-1 text-[11px]">→</kbd>
        </p>
      )}
    </div>
  );
}

interface ChipProps {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
  dot?: string;
}

function FilterChip({ active, onClick, label, count, dot }: ChipProps) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`focus-ring inline-flex h-7 items-center gap-1.5 rounded-full border px-2.5 text-xs transition-colors ${
        active
          ? 'border-accent/30 bg-accent-soft font-medium text-accent-dark'
          : 'border-line text-muted hover:bg-hover hover:text-ink'
      }`}
    >
      {dot && <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${dot}`} />}
      {label}
      <span className="tabular-nums opacity-70">{count}</span>
    </button>
  );
}
