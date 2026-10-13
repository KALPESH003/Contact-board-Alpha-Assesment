import { useContacts } from '../hooks/useContacts';
export function NoResults({ compact = false }: { compact?: boolean }) {
  const { query, stageFilter, clearFilters } = useContacts();
  const parts = [query.trim() && `“${query.trim()}”`, stageFilter && `the ${stageFilter} stage`].filter(Boolean);

  return (
    <div className={`text-center ${compact ? 'py-6' : 'py-16'}`}>
      <p className="text-sm font-medium">No contacts found</p>
      {parts.length > 0 && <p className="mt-1 text-sm text-muted">Nothing matches {parts.join(' in ')}.</p>}
      <button
        type="button"
        onClick={clearFilters}
        className="focus-ring mt-3 rounded-md border border-line px-3 py-1.5 text-sm hover:bg-hover"
      >
        Clear search and filters
      </button>
    </div>
  );
}
