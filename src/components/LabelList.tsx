import { labelColor } from '../lib/colors';
import { cleanLabels } from '../lib/text';

interface Props {
  labels: string[] | undefined;
  /** Chips beyond this count collapse into "+N". */
  max?: number;
  /** `wrap` for cards, `nowrap` for table cells. */
  wrap?: boolean;
}

/** Renders nothing when there are no labels; callers decide what "empty" looks like. */
export function LabelList({ labels, max = 3, wrap = false }: Props) {
  const list = cleanLabels(labels);
  if (list.length === 0) return null;

  const shown = list.slice(0, max);
  const hidden = list.slice(max);

  return (
    <ul
      aria-label="Labels"
      className={`flex min-w-0 gap-1 ${wrap ? 'flex-wrap' : 'flex-nowrap overflow-hidden'}`}
    >
      {shown.map((label) => (
        <li key={label} className="min-w-0">
          <span
            title={label}
            className={`block max-w-[130px] truncate rounded px-1.5 py-0.5 text-xs leading-4 ${labelColor(label)}`}
          >
            {label}
          </span>
        </li>
      ))}
      {hidden.length > 0 && (
        <li className="shrink-0 self-center text-xs text-muted" title={hidden.join(', ')}>
          <span aria-hidden="true">+{hidden.length}</span>
          <span className="sr-only">plus {hidden.length} more: {hidden.join(', ')}</span>
        </li>
      )}
    </ul>
  );
}
