# Design

## Context

Repo vacío salvo el paquete de handoff (`HANDOFF.md`, `CLAUDE.md`, `design/`,
`data/`). No hay `package.json` ni código. Ver `proposal.md` para el porqué;
esto cubre cómo se arma el esqueleto.

## Goals / Non-Goals

**Goals:**
- Dejar `npm run dev|build|test|test:e2e|lint` funcionando tal como los
  declara `CLAUDE.md`.
- Dejar un lugar obvio (carpeta + archivo mínimo) para cada pieza que los
  hitos M1–M8 van a llenar, sin adivinar su contenido.
- Cumplir la definición de terminado de M0 (HANDOFF.md §12): build sin
  errores, navegar entre las 5 pestañas, cambiar tema funciona.

**Non-Goals:**
- Fidelidad visual pixel a pixel con las maquetas (`Componentes.dc.html`,
  `NavBar.dc.html`): eso es M1. El `NavBar` de M0 solo necesita navegar y
  marcar la pestaña activa correctamente.
- Dexie/IndexedDB, seeds, dominio (`domain/`) — M2.
- `vite-plugin-pwa`, manifest, service worker — M7.
- Cualquier contenido real de pantalla (Hoy, Jardín, Diario, etc.) más allá
  de un placeholder que confirme que la ruta resuelve — M3 a M8.

## Decisions

### 1. Carpetas de `HANDOFF.md` §4 creadas desde ya, con placeholders mínimos
Se crean `src/domain/`, `src/db/`, `src/media/`, `src/ui/`, `src/screens/`,
`src/copy/`, `src/dev/` aunque la mayoría quede casi vacía (un
`index.ts`/`.gitkeep` cuando no hay nada que poner todavía). Alternativa
descartada: crear solo lo que M0 usa y dejar que cada hito agregue su
carpeta — se descarta porque dispersa la estructura del repo en vez de
fijarla una sola vez, tal como la pide el propio handoff.

### 2. Pantallas placeholder desacopladas de los componentes de M1
Cada ruta de HANDOFF.md §8 apunta a un componente en `src/screens/<Nombre>/`
que por ahora solo renderiza `<main><h1>{Nombre de pantalla}</h1></main>`.
No se construyen `ScreenHeader`, `Fab` ni `BottomSheet` todavía (son de M1):
construirlos ahora obligaría a rehacerlos cuando M1 defina sus props reales
contra `Componentes.dc.html`.

### 3. El control de Tema se adelanta dentro del placeholder de Ajustes
La única pieza de contenido real que se adelanta de M7 es el control
segmentado Sistema/Claro/Oscuro de HANDOFF.md §8.9 ("Tema"), dentro de la
pantalla `Ajustes` (que si no, sería un placeholder vacío como las demás).
Razón: la propia definición de terminado de M0 exige que "cambiar tema
funciona", y no hay otro lugar sensato donde poner ese control. El resto de
Ajustes (Tu casa, Respaldo, Almacenamiento, Instalar) sigue como placeholder
hasta M7. Esto no es una excepción a "no adelantar pantallas de un hito
posterior": es la condición explícita de salida que el propio M0 declara.

### 4. Tema con React Context + atributo en `<html>`, sin persistencia todavía
`useTheme()` (Context en `src/ui/theme/`) guarda `'system' | 'light' | 'dark'`
en memoria (estado de React) y aplica el efecto de HANDOFF.md §5.2 sobre
`document.documentElement` y `<meta name="theme-color">`. **No se persiste
en esta etapa**: `Settings.theme` vive en Dexie recién desde M2, y
`CLAUDE.md`/HANDOFF.md §3 prohíben estado global fuera de la base de datos y
la URL — así que no se usa `localStorage` como atajo. Consecuencia aceptada:
el tema vuelve a `system` en cada recarga hasta que M2/M7 lo conecten a
`Settings`. Se deja anotado en `DECISIONES.md` para que M7 lo retome.

### 5. `design/tokens.css` se importa una sola vez, de forma global
Se importa en `src/main.tsx` (`import '../design/tokens.css'`) en vez de en
cada `.module.css`: son variables CSS de alcance global (`:root`), así que
importarlas por módulo sería redundante. Cada `.module.css` solo usa
`var(--lo-que-sea)`, tal como pide `CLAUDE.md`.

### 6. Fuentes autoalojadas vía `@fontsource`
`@fontsource/young-serif` (peso 400) y `@fontsource-variable/nunito`
(500–800) se importan también en `src/main.tsx`, consistente con "autoaloja-
das: funcionan offline" (HANDOFF.md §3).

### 7. Herramientas: ESLint flat config + Prettier + Vitest + Playwright
- ESLint con `eslint.config.js` (flat config, el formato actual de ESLint 9)
  más `typescript-eslint` y `eslint-plugin-react-hooks`. Alternativa
  descartada: `.eslintrc` legado — se evita porque Vite 5+ y las plantillas
  oficiales ya asumen flat config.
- Prettier con configuración por defecto (sin `.prettierrc` opinionado más
  allá de lo que ya use el repo), para no inventar un estilo no pedido.
- Vitest + Testing Library para unitarias; Playwright (proyecto
  `390x844`) para e2e. En M0 solo se deja la configuración y un smoke test
  de enrutamiento/tema (ver `tasks.md`); las specs de negocio
  (`water-check`, `quick-photo`, `new-plant`) llegan con sus hitos.
- Gestor de paquetes: `npm`, porque todos los comandos de `CLAUDE.md` están
  escritos como `npm run ...`.

### 8. `DECISIONES.md` se crea en este change, no se deja para después
`HANDOFF.md` §4 lo lista en la raíz del repo y `CLAUDE.md` instruye
anotar ahí cualquier decisión no especificada. Como este change ya toma
varias (arriba), se crea el archivo ahora con esas entradas en vez de
dejarlo para el primer hito que "lo necesite".

## Risks / Trade-offs

- **El `NavBar` y el control de tema de M0 son funcionales, no definitivos**
  → Mitigación: se construyen solo contra el contrato de comportamiento de
  `app-shell` (esta spec), no contra el detalle visual de
  `Componentes.dc.html`; M1 puede ajustar estilos sin tocar el contrato.
- **El tema no persiste entre recargas en M0** → Mitigación: documentado en
  `DECISIONES.md` y en este design; es consistente con que `Settings` no
  existe todavía (M2) y evita introducir un segundo lugar de estado global
  que luego haya que migrar a Dexie.
- **Adelantar el control de Tema dentro de Ajustes podría tentar a adelantar
  más contenido de M7** → Mitigación: `tasks.md` solo pide esa sección
  puntual; el resto de Ajustes queda explícitamente fuera en `proposal.md`.
