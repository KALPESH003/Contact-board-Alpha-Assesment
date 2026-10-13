interface Props {
<<<<<<< HEAD
  /** Screen-reader text, e.g. "No notes". */
  label?: string;
}

/** Placeholder for a missing field value. Visually a dash, audibly "No …". */
=======
  label?: string;
}

>>>>>>> e3008d5 (Initial commit for Contact Board Alpha Assessment)
export function Empty({ label = 'Empty' }: Props) {
  return (
    <span className="text-muted/70">
      <span aria-hidden="true">—</span>
      <span className="sr-only">{label}</span>
    </span>
  );
}
