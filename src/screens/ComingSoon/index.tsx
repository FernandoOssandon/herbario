import { ScreenPlaceholder } from '../ScreenPlaceholder';

export type ComingSoonVariant = 'aprender' | 'botiquin' | 'libro';

const TITLES: Record<ComingSoonVariant, string> = {
  aprender: 'Aprender',
  botiquin: 'Herbario · Botiquín',
  libro: 'Herbario · Libro',
};

// Contenido real: EmptyState variante "pronto" de HANDOFF.md §8.10/§8.11 — M3.
export function ComingSoon({ variant }: { variant: ComingSoonVariant }) {
  return <ScreenPlaceholder title={TITLES[variant]} note="Esto viene pronto." />;
}
