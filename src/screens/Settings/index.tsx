import { ThemeSwitcher } from '../../ui/ThemeSwitcher/ThemeSwitcher';

// Solo la sección "Tema" de HANDOFF.md §8.9 está adelantada en M0 (ver
// design.md del change m0-base-proyecto, Decisión 3). El resto de Ajustes
// (Tu casa, Respaldo, Almacenamiento, Instalar) llega en M7.
export function Settings() {
  return (
    <main>
      <h1>Ajustes</h1>
      <section>
        <h2>Tema</h2>
        <ThemeSwitcher />
        <p>El tamaño de letra sigue el de tu teléfono.</p>
      </section>
    </main>
  );
}
