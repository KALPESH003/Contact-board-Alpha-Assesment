import { useId, useRef, useState, type FormEvent, type KeyboardEvent } from 'react';
import { STAGES, STAGE_META } from '../data/stages';
import { useContacts } from '../hooks/useContacts';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { cleanLabels, present } from '../lib/text';
import type { Contact, Stage } from '../types/contact';
import { Avatar } from './Avatar';
import { Empty } from './Empty';
import { CloseIcon } from './icons';
import { LabelList } from './LabelList';

const NOTES_MAX = 1000;

/** Shell: renders nothing when closed, and re-mounts per contact (fresh draft). */
export function DetailsPanel() {
  const { selectedContact } = useContacts();
  if (!selectedContact) return null;
  return <PanelContent key={selectedContact.id} contact={selectedContact} />;
}

function PanelContent({ contact }: { contact: Contact }) {
  const { saveContact, closePanel } = useContacts();
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const notesId = useId();

  // Draft state lives only here. Nothing reaches the shared store until Save,
  // and unmounting the panel (Cancel, Esc, backdrop, X) throws the draft away.
  const [stage, setStage] = useState<Stage>(contact.stage);
  const [notes, setNotes] = useState(contact.notes ?? '');

  const dirty = stage !== contact.stage || notes.trim() !== (contact.notes ?? '').trim();

  useFocusTrap(panelRef, {
    onEscape: closePanel,
    returnFocusSelector: `[data-contact-id="${contact.id}"]`,
  });

  function handleSave(event?: FormEvent) {
    event?.preventDefault();
    if (!dirty) return;
    saveContact(contact.id, { stage, notes });
  }

  function onNotesKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) handleSave();
  }

  const role = present(contact.role);
  const company = present(contact.company);
  const subtitle = [role, company].filter(Boolean).join(' at ');

  return (
    <div className="fixed inset-0 z-40">
      <div className="absolute inset-0 bg-ink/30 motion-safe:animate-fade-in" onClick={closePanel} aria-hidden="true" />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="absolute inset-y-0 right-0 flex w-full max-w-[480px] flex-col bg-canvas shadow-panel outline-none motion-safe:animate-slide-in"
      >
        <header className="flex items-start gap-3 border-b border-line px-5 py-4">
          <Avatar name={contact.name} size="lg" />
          <div className="min-w-0 flex-1">
            <h2 id={titleId} className="break-words text-lg font-semibold leading-6">
              {contact.name}
            </h2>
            {subtitle && <p className="mt-0.5 break-words text-sm text-muted">{subtitle}</p>}
          </div>
          <button
            type="button"
            onClick={closePanel}
            aria-label="Close details without saving"
            className="focus-ring -mr-1 rounded p-1.5 text-muted hover:bg-hover hover:text-ink"
          >
            <CloseIcon />
          </button>
        </header>

        <form onSubmit={handleSave} className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 space-y-6 overflow-y-auto px-5 py-5">
            <dl className="grid grid-cols-[88px_minmax(0,1fr)] gap-x-3 gap-y-3 text-sm">
              <dt className="text-muted">Email</dt>
              <dd className="break-words">
                {present(contact.email) ? (
                  <a
                    href={`mailto:${contact.email}`}
                    className="focus-ring rounded text-accent underline-offset-2 hover:underline"
                  >
                    {contact.email}
                  </a>
                ) : (
                  <Empty label="No email" />
                )}
              </dd>

              <dt className="text-muted">Company</dt>
              <dd className="break-words">{company ?? <Empty label="No company" />}</dd>

              <dt className="text-muted">Role</dt>
              <dd className="break-words">{role ?? <Empty label="No role" />}</dd>

              <dt className="text-muted">Owner</dt>
              <dd className="break-words">{present(contact.owner) ?? <Empty label="No owner" />}</dd>

              <dt className="text-muted">Labels</dt>
              <dd>
                {cleanLabels(contact.labels).length > 0 ? (
                  <LabelList labels={contact.labels} max={50} wrap />
                ) : (
                  <Empty label="No labels" />
                )}
              </dd>
            </dl>

            <hr className="border-line" />

            <fieldset>
              <legend className="mb-2 text-sm font-medium">Stage</legend>
              <div className="flex flex-wrap gap-1.5">
                {STAGES.map((option) => (
                  <label key={option} className="relative">
                    <input
                      type="radio"
                      name="stage"
                      value={option}
                      checked={stage === option}
                      onChange={() => setStage(option)}
                      className="peer sr-only"
                    />
                    <span
                      className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-line px-3 py-1 text-sm text-ink transition-colors hover:bg-hover peer-focus-visible:ring-2 peer-focus-visible:ring-accent peer-focus-visible:ring-offset-1 ${STAGE_META[option].selected}`}
                    >
                      <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${STAGE_META[option].dot}`} />
                      {option}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div>
              <div className="mb-2 flex items-baseline justify-between">
                <label htmlFor={notesId} className="text-sm font-medium">
                  Notes
                </label>
                <span className="text-xs tabular-nums text-muted" aria-hidden="true">
                  {notes.length}/{NOTES_MAX}
                </span>
              </div>
              <textarea
                id={notesId}
                value={notes}
                maxLength={NOTES_MAX}
                rows={7}
                onChange={(e) => setNotes(e.target.value)}
                onKeyDown={onNotesKeyDown}
                placeholder="Add context, next steps or anything worth remembering"
                className="focus-ring block w-full resize-y rounded-md border border-line bg-canvas px-3 py-2 text-sm leading-5 placeholder:text-muted/70"
              />
            </div>
          </div>

          <footer className="flex items-center justify-between gap-3 border-t border-line px-5 py-3">
            <p role="status" className="text-xs text-muted">
              {dirty ? 'Unsaved changes' : ''}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={closePanel}
                className="focus-ring rounded-md border border-line px-3 py-1.5 text-sm hover:bg-hover"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!dirty}
                className="focus-ring rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-white hover:bg-accent-dark disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-accent"
              >
                Save changes
              </button>
            </div>
          </footer>
        </form>
      </div>
    </div>
  );
}
