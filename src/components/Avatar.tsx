import { avatarColor } from '../lib/colors';

interface Props {
  name: string;
  size?: 'sm' | 'md' | 'lg';
}

const SIZES = {
  sm: 'h-6 w-6 text-[10px]',
  md: 'h-8 w-8 text-xs',
  lg: 'h-10 w-10 text-sm',
};

export function Avatar({ name, size = 'md' }: Props) {
  const initials =
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join('')
      .toUpperCase() || '?';

  return (
    <span
      aria-hidden="true"
      className={`inline-flex shrink-0 items-center justify-center rounded-full font-semibold ring-1 ring-inset ring-black/5 ${SIZES[size]} ${avatarColor(name)}`}
    >
      {initials}
    </span>
  );
}
