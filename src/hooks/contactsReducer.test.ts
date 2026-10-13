import { describe, expect, it } from 'vitest';
import { SEED_CONTACTS } from '../data/contacts';
import { groupByStage } from '../lib/groupByStage';
import { selectContacts } from '../lib/filterContacts';
import { createInitialState, reducer } from './contactsReducer';

const fresh = () => createInitialState(SEED_CONTACTS);

describe('save / cancel', () => {
  it('commits stage and notes only on save, and closes the panel', () => {
    let s = reducer(fresh(), { type: 'open', id: 'c-001' });
    s = reducer(s, { type: 'save', id: 'c-001', patch: { stage: 'Customer', notes: '  Signed.  ' } });
    const c = s.contacts.find((x) => x.id === 'c-001')!;
    expect(c.stage).toBe('Customer');
    expect(c.notes).toBe('Signed.');
    expect(s.selectedId).toBeNull();
    expect(s.notice?.text).toBe('Moved Amara Okafor to Customer.');
  });

  it('closing without saving leaves the store untouched', () => {
    const before = fresh();
    const s = reducer(reducer(before, { type: 'open', id: 'c-001' }), { type: 'close' });
    expect(s.contacts).toBe(before.contacts);
  });

  it('blank notes become undefined, and a no-op save changes nothing', () => {
    const s = reducer(fresh(), { type: 'save', id: 'c-001', patch: { notes: '   ' } });
    expect(s.contacts.find((x) => x.id === 'c-001')!.notes).toBeUndefined();
    const same = reducer(s, { type: 'save', id: 'c-002', patch: { stage: 'Prospect' } });
    expect(same.contacts).toBe(s.contacts);
    expect(same.notice).toBe(s.notice);
  });

  it('ignores unknown ids', () => {
    const s = reducer(fresh(), { type: 'open', id: 'nope' });
    expect(s.selectedId).toBeNull();
  });
});

describe('sync between views', () => {
  it('a saved stage change moves the record between groups without duplicating it', () => {
    const s = reducer(fresh(), { type: 'save', id: 'c-001', patch: { stage: 'Customer' } });
    const groups = groupByStage(s.contacts);
    expect(groups.Customer.map((c) => c.id)).toEqual(['c-001']);
    expect(groups.Lead.some((c) => c.id === 'c-001')).toBe(false);
    const total = Object.values(groups).reduce((n, g) => n + g.length, 0);
    expect(total).toBe(SEED_CONTACTS.length);
  });

  it('keeps record order stable after edits (no row jumping)', () => {
    const s = reducer(fresh(), { type: 'save', id: 'c-005', patch: { stage: 'Lead' } });
    expect(s.contacts.map((c) => c.id)).toEqual(SEED_CONTACTS.map((c) => c.id));
  });

  it('survives many repeated edits and view switches', () => {
    let s = fresh();
    const stages = ['Prospect', 'Qualified', 'Customer', 'Lead'] as const;
    for (let i = 0; i < 40; i++) {
      s = reducer(s, { type: 'setView', view: i % 2 ? 'board' : 'table' });
      s = reducer(s, { type: 'move', id: 'c-003', stage: stages[i % 4] });
    }
    expect(s.contacts).toHaveLength(SEED_CONTACTS.length);
    expect(new Set(s.contacts.map((c) => c.id)).size).toBe(SEED_CONTACTS.length);
  });
});

describe('move and undo', () => {
  it('move does not close an open panel; undo restores the previous record', () => {
    let s = reducer(fresh(), { type: 'open', id: 'c-002' });
    s = reducer(s, { type: 'move', id: 'c-001', stage: 'Qualified' });
    expect(s.selectedId).toBe('c-002');
    s = reducer(s, { type: 'undo' });
    expect(s.contacts.find((c) => c.id === 'c-001')!.stage).toBe('Lead');
    expect(s.notice?.undo).toBeUndefined();
  });
});

describe('search, filter, sort', () => {
  const base = { query: '', stage: null, sort: null } as const;

  it('matches every term across all fields, including labels and notes', () => {
    expect(selectContacts(SEED_CONTACTS, { ...base, query: 'tender security' }).map((c) => c.id)).toEqual(['c-006']);
    expect(selectContacts(SEED_CONTACTS, { ...base, query: 'LISBON' }).map((c) => c.id)).toEqual(['c-001']);
  });

  it('filters by stage and reports an empty Customer group', () => {
    expect(selectContacts(SEED_CONTACTS, { ...base, stage: 'Customer' })).toEqual([]);
  });

  it('sorts blanks last in both directions', () => {
    const asc = selectContacts(SEED_CONTACTS, { ...base, sort: { key: 'owner', dir: 'asc' } });
    const desc = selectContacts(SEED_CONTACTS, { ...base, sort: { key: 'owner', dir: 'desc' } });
    expect(asc[asc.length - 1].id).toBe('c-009');
    expect(desc[desc.length - 1].id).toBe('c-009');
  });

  it('cycles sort none -> asc -> desc -> none', () => {
    let s = reducer(fresh(), { type: 'toggleSort', key: 'name' });
    expect(s.sort).toEqual({ key: 'name', dir: 'asc' });
    s = reducer(s, { type: 'toggleSort', key: 'name' });
    expect(s.sort).toEqual({ key: 'name', dir: 'desc' });
    s = reducer(s, { type: 'toggleSort', key: 'name' });
    expect(s.sort).toBeNull();
  });
});
