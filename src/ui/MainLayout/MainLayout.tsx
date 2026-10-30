import { Outlet } from 'react-router-dom';

import { NavBar } from '../NavBar/NavBar';
import styles from './MainLayout.module.css';

// Envuelve las 5 secciones principales (Hoy, Jardín, Diario, Aprender,
// Herbario). Las pantallas de detalle, asistente, editor, cámara y Ajustes
// se montan fuera de este layout y no muestran NavBar — ver design.md del
// change m0-base-proyecto.
export function MainLayout() {
  return (
    <div className={styles.shell}>
      <div className={styles.content}>
        <Outlet />
      </div>
      <NavBar />
    </div>
  );
}
