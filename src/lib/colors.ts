<<<<<<< HEAD
// Full class strings so Tailwind can detect them.
=======
>>>>>>> e3008d5 (Initial commit for Contact Board Alpha Assessment)
const LABEL_COLORS = [
  'bg-rose-100 text-rose-900',
  'bg-orange-100 text-orange-900',
  'bg-yellow-100 text-yellow-900',
  'bg-lime-100 text-lime-900',
  'bg-teal-100 text-teal-900',
  'bg-indigo-100 text-indigo-900',
  'bg-fuchsia-100 text-fuchsia-900',
];

const AVATAR_COLORS = [
  'bg-rose-200 text-rose-900',
  'bg-orange-200 text-orange-900',
  'bg-amber-200 text-amber-900',
  'bg-emerald-200 text-emerald-900',
  'bg-sky-200 text-sky-900',
  'bg-indigo-200 text-indigo-900',
  'bg-fuchsia-200 text-fuchsia-900',
];

function hash(input: string): number {
  let h = 0;
  for (let i = 0; i < input.length; i++) {
    h = (h * 31 + input.charCodeAt(i)) >>> 0;
  }
  return h;
}

<<<<<<< HEAD
/** The same label text always gets the same colour, so labels stay recognisable. */
=======
>>>>>>> e3008d5 (Initial commit for Contact Board Alpha Assessment)
export const labelColor = (label: string) => LABEL_COLORS[hash(label.toLowerCase()) % LABEL_COLORS.length];
export const avatarColor = (name: string) => AVATAR_COLORS[hash(name) % AVATAR_COLORS.length];
