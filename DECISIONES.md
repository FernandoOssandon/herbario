# Decisiones

Bitácora de decisiones no especificadas en `HANDOFF.md`, tomadas eligiendo la
opción más simple coherente con los principios del producto (`CLAUDE.md`).
Cada entrada referencia el change de OpenSpec donde se tomó.

## m0-base-proyecto

- **Gestor de paquetes: `npm`.** Todos los comandos de `CLAUDE.md` están
  escritos como `npm run ...`.
- **ESLint en formato flat config** (`eslint.config.js`) con
  `typescript-eslint` + `eslint-plugin-react-hooks` +
  `eslint-plugin-react-refresh`, en vez de `.eslintrc` legado.
- **`design/tokens.css` se importa una sola vez, de forma global**, desde
  `src/main.tsx`, en vez de en cada `.module.css` (son variables `:root` de
  alcance global).
- **El control de Tema (Sistema/Claro/Oscuro) de `HANDOFF.md` §8.9 se
  adelantó dentro del placeholder de Ajustes**, aunque el resto de esa
  pantalla es de M7. Razón: la propia definición de terminado de M0 exige
  que "cambiar tema funciona" y no hay otro lugar sensato para ese control.
- **El tema no persiste entre recargas todavía.** `Settings.theme` vive en
  Dexie recién desde M2; no se usa `localStorage` como atajo porque
  `HANDOFF.md` §3 prohíbe estado global fuera de la base de datos y la URL.
  El tema vuelve a `'system'` en cada recarga hasta que M2/M7 lo conecten a
  `Settings`. **Pendiente para M7:** leer/escribir `Settings.theme` en vez
  del estado en memoria de `ThemeProvider`.
- **`NavBar` solo envuelve las 5 secciones principales** (Hoy, Jardín,
  Diario, Aprender, Herbario). Las pantallas de detalle, el asistente, el
  editor de diario, la cámara y Ajustes se renderizan sin `NavBar`, como
  pantallas de ancho completo.
- **Fidelidad visual de `NavBar` y del control de Tema**: funcional, no
  definitiva. M1 la ajusta contra `Componentes.dc.html` y los íconos de
  `HANDOFF.md` §5.5 sin tocar el contrato de comportamiento de la capability
  `app-shell` (`openspec/specs/app-shell/spec.md`).
- Detalle completo de estas decisiones y sus alternativas descartadas en
  `openspec/changes/m0-base-proyecto/design.md` (o
  `openspec/changes/archive/m0-base-proyecto/design.md` una vez archivado).
