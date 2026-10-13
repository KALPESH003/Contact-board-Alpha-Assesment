import { useMemo, type KeyboardEvent } from 'react';
import { useContacts } from '../hooks/useContacts';
import { selectContacts } from '../lib/filterContacts';
import { cleanLabels, present } from '../lib/text';
import type { SortKey } from '../types/contact';
import { Avatar } from './Avatar';
import { Empty } from './Empty';
import { SortIcon } from './icons';
import { LabelList } from './LabelList';
import { NoResults } from './NoResults';
import { StageBadge } from './StageBadge';

const COLUMNS: { key: string; label: string; width: number; sortKey?: SortKey }[] = [
  { key: 'name', label: 'Name', width: 240, sortKey: 'name' },
  { key: 'email', label: 'Email', width: 240, sortKey: 'email' },
  { key: 'company', label: 'Company', width: 200, sortKey: 'company' },
  { key: 'role', label: 'Role', width: 190, sortKey: 'role' },
  { key: 'owner', label: 'Owner', width: 140, sortKey: 'owner' },
  { key: 'labels', label: 'Labels', width: 230 },
  { key: 'stage', label: 'Stage', width: 130, sortKey: 'stage' },
  { key: 'notes', label: 'Notes', width: 320 },
];

const TOTAL_WIDTH = COLUMNS.reduce((sum, c) => sum + c.width, 0);

function TextCell({ value, empty }: { value: string | undefined; empty: string }) {
  const text = present(value);
  return text ? (
    <span className="block truncate" title={text}>
      {text}
    </span>
  ) : (
    <Empty label={empty} />
  );
}

export function TableView() {
  const { contacts, query, stageFilter, sort, selectedContact, openContact, toggleSort } = useContacts();
  const rows = useMemo(
    () => selectContacts(contacts, { query, stage: stageFilter, sort }),
    [contacts, query, stageFilter, sort],
  );

  // Up/Down moves between rows' name buttons, like a spreadsheet.
  function onBodyKeyDown(event: KeyboardEvent<HTMLTableSectionElement>) {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    const target = event.target as HTMLElement;
    if (!target.hasAttribute('data-contact-id')) return;
    const buttons = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('button[data-contact-id]'));
    const next = buttons[buttons.indexOf(target) + (event.key === 'ArrowDown' ? 1 : -1)];
    if (next) {
      event.preventDefault();
      next.focus();
    }
  }

  return (
    <table
      className="table-fixed border-separate border-spacing-0 text-sm"
      style={{ width: TOTAL_WIDTH, minWidth: '100%' }}
    >
      <caption className="sr-only">Contacts. Select a name to open its details.</caption>
      <colgroup>
        {COLUMNS.map((c) => (
          <col key={c.key} style={{ width: c.width }} />
        ))}
      </colgroup>
      <thead>
        <tr>
          {COLUMNS.map((c) => {
            const active = sort?.key === c.sortKey ? sort : null;
            const ariaSort = active ? (active.dir === 'asc' ? 'ascending' : 'descending') : c.sortKey ? 'none' : undefined;
            return (
              <th
                key={c.key}
                scope="col"
                aria-sort={ariaSort}
                className={`sticky top-0 h-9 border-b border-line bg-canvas p-0 text-left text-xs font-medium text-muted ${
                  c.key === 'name' ? 'left-0 z-30 border-r' : 'z-20'
                }`}
              >
                {c.sortKey ? (
                  <button
                    type="button"
                    onClick={() => toggleSort(c.sortKey!)}
                    className="focus-ring-inset group flex h-9 w-full items-center gap-1 px-3 text-left hover:text-ink"
                  >
                    {c.label}
                    <span className={active ? 'text-ink' : 'opacity-0 group-hover:opacity-60 group-focus-visible:opacity-60'}>
                      <SortIcon dir={active?.dir ?? null} />
                    </span>
                    <span className="sr-only">
                      {active ? `, sorted ${active.dir === 'asc' ? 'ascending' : 'descending'}. Activate to change.` : ', activate to sort'}
                    </span>
                  </button>
                ) : (
                  <span className="block px-3">{c.label}</span>
                )}
              </th>
            );
          })}
        </tr>
      </thead>
      <tbody onKeyDown={onBodyKeyDown}>
        {rows.length === 0 && (
          <tr>
            <td colSpan={COLUMNS.length} className="p-0">
              {/* Sticky so the message stays centred in view while the table scrolls sideways. */}
              <div className="sticky left-0 w-[min(100vw,100%)]">
                {contacts.length === 0 ? (
                  <p className="py-16 text-center text-sm text-muted">No contacts yet.</p>
                ) : (
                  <NoResults />
                )}
              </div>
            </td>
          </tr>
        )}
        {rows.map((contact) => {
          const selected = selectedContact?.id === contact.id;
          const bg = selected ? 'bg-accent-soft' : 'bg-canvas group-hover:bg-hover';
          const base = `h-11 border-b border-line ${bg}`;
          const cell = `${base} px-3`;

          return (
            <tr key={contact.id} className="group cursor-pointer" onClick={() => openContact(contact.id)}>
              <td className={`sticky left-0 z-10 border-r ${base}`}>
                <button
                  type="button"
                  data-contact-id={contact.id}
                  aria-label={`Open details for ${contact.name}`}
                  className="focus-ring-inset flex h-11 w-full items-center gap-2.5 px-3 text-left font-medium"
                >
                  <Avatar name={contact.name} size="sm" />
                  <span className="truncate">{contact.name}</span>
                </button>
              </td>
              <td className={cell}>
                <TextCell value={contact.email} empty="No email" />
              </td>
              <td className={cell}>
                <TextCell value={contact.company} empty="No company" />
              </td>
              <td className={cell}>
                <TextCell value={contact.role} empty="No role" />
              </td>
              <td className={cell}>
                <TextCell value={contact.owner} empty="No owner" />
              </td>
              <td className={cell}>
                {cleanLabels(contact.labels).length > 0 ? (
                  <LabelList labels={contact.labels} max={2} />
                ) : (
                  <Empty label="No labels" />
                )}
              </td>
              <td className={cell}>
                <StageBadge stage={contact.stage} />
              </td>
              <td className={`${cell} text-muted`}>
                <TextCell value={contact.notes} empty="No notes" />
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
