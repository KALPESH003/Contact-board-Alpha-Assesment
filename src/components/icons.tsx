import type { SVGProps } from 'react';

const base: SVGProps<SVGSVGElement> = {
  width: 16,
  height: 16,
  viewBox: '0 0 16 16',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  focusable: false,
};

export const TableIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p}>
    <rect x="2" y="3" width="12" height="10" rx="1.5" />
    <path d="M2 6.5h12M2 9.8h12M6.5 6.5V13" />
  </svg>
);

export const BoardIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p}>
    <rect x="2" y="3" width="3.2" height="10" rx="1" />
    <rect x="6.4" y="3" width="3.2" height="6.5" rx="1" />
    <rect x="10.8" y="3" width="3.2" height="8.2" rx="1" />
  </svg>
);

export const CloseIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p}>
    <path d="M3.5 3.5l9 9M12.5 3.5l-9 9" />
  </svg>
);

export const BuildingIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p}>
    <rect x="3.5" y="2.5" width="9" height="11" rx="1" />
    <path d="M6 5.5h1M9 5.5h1M6 8h1M9 8h1M7 13.5v-2.5h2v2.5" />
  </svg>
);

export const SearchIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p}>
    <circle cx="7" cy="7" r="4.25" />
    <path d="M10.3 10.3L13.5 13.5" />
  </svg>
);

export const PeopleIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p}>
    <circle cx="6" cy="5.5" r="2.2" />
    <path d="M2 13c0-2.2 1.8-3.8 4-3.8s4 1.6 4 3.8" />
    <path d="M10.6 3.6a2.2 2.2 0 010 3.8M12 9.5c1.3.5 2.2 1.7 2.2 3.3" />
  </svg>
);

export const SortIcon = ({ dir, ...p }: SVGProps<SVGSVGElement> & { dir: 'asc' | 'desc' | null }) => (
  <svg {...base} width={12} height={12} {...p}>
    <path d="M4.5 6.5L8 3l3.5 3.5" opacity={dir === 'desc' ? 0.25 : 1} />
    <path d="M4.5 9.5L8 13l3.5-3.5" opacity={dir === 'asc' ? 0.25 : 1} />
  </svg>
);
