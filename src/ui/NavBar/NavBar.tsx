import { Link, useLocation } from 'react-router-dom';
import styles from './NavBar.module.css';

interface Tab {
  to: string;
  label: string;
  isActive: (pathname: string) => boolean;
}

// Las 5 pestañas de HANDOFF.md §7.2. La fidelidad visual completa
// (íconos de §5.5) llega en M1 — ver design.md del change m0-base-proyecto.
const TABS: Tab[] = [
  { to: '/hoy', label: 'Hoy', isActive: (p) => p === '/hoy' },
  { to: '/jardin', label: 'Jardín', isActive: (p) => p === '/jardin' },
  { to: '/diario', label: 'Diario', isActive: (p) => p === '/diario' },
  { to: '/aprender', label: 'Aprender', isActive: (p) => p === '/aprender' },
  { to: '/herbario/especies', label: 'Herbario', isActive: (p) => p.startsWith('/herbario') },
];

export function NavBar() {
  const { pathname } = useLocation();

  return (
    <nav className={styles.navBar} aria-label="Navegación principal">
      {TABS.map((tab) => {
        const active = tab.isActive(pathname);
        return (
          <Link
            key={tab.to}
            to={tab.to}
            className={active ? `${styles.tab} ${styles.tabActive}` : styles.tab}
            aria-current={active ? 'page' : undefined}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
