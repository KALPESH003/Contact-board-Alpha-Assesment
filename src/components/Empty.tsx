interface Props {
  label?: string;
}
export function Empty({ label = 'Empty' }: Props) {
  return (
    <span className="text-muted/70">
      <span aria-hidden="true">—</span>
      <span className="sr-only">{label}</span>
    </span>
  );
}
