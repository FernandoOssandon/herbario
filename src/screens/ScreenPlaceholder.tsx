interface ScreenPlaceholderProps {
  title: string;
  note?: string;
}

// Cáscara mínima para las pantallas de M0. El contenido real de cada una
// llega con su hito (HANDOFF.md §12) — ver proposal.md del change
// m0-base-proyecto.
export function ScreenPlaceholder({ title, note }: ScreenPlaceholderProps) {
  return (
    <main>
      <h1>{title}</h1>
      {note ? <p>{note}</p> : null}
    </main>
  );
}
