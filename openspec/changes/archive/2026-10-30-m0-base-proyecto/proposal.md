# Proposal

## Why

El proyecto hoy es solo el paquete de handoff (`HANDOFF.md`, `CLAUDE.md`,
`design/`, `data/`): no existe todavía ningún código. Las 8 pantallas y la
lógica de dominio de los hitos M1–M8 necesitan un esqueleto común sobre el
cual montarse — proyecto Vite/React/TS inicializado, herramientas de calidad
configuradas, el sistema de diseño importado, el ruteo de todas las pantallas
(aunque vacías) y el cambio de tema. Sin esto, ningún hito siguiente tiene
dónde escribir su código.

## What Changes

- Inicializar el proyecto con Vite + React 18 + TypeScript (`strict: true`).
- Configurar ESLint, Prettier, Vitest y Playwright (sin specs de prueba
  todavía, solo la configuración ejecutable).
- Copiar `design/tokens.css` al árbol de estilos y autoalojar las fuentes
  `@fontsource/young-serif` y `@fontsource-variable/nunito`.
- Crear la estructura de carpetas de `HANDOFF.md` §4 (`src/domain`, `src/db`,
  `src/media`, `src/ui`, `src/screens`, `src/copy`, `src/dev`) con los
  archivos mínimos para que compilen (aún sin lógica de negocio).
- Configurar `react-router-dom` (`createBrowserRouter`) con todas las rutas de
  `HANDOFF.md` §8 apuntando a pantallas placeholder vacías.
- Implementar `NavBar` (5 pestañas: Hoy · Jardín · Diario · Aprender ·
  Herbario) y el cambio de tema `system | light | dark` (atributo
  `document.documentElement.dataset.theme` + `<meta name="theme-color">`).
- Dejar `npm run dev`, `npm run build`, `npm run test`, `npm run test:e2e` y
  `npm run lint` funcionando como describe `CLAUDE.md`.

No se agregan todavía: Dexie/IndexedDB, PWA/service worker, ni los
componentes de `HANDOFF.md` §7 (eso es M2 y M1 respectivamente). Las
pantallas son cáscaras vacías; su contenido real llega en M3–M8.

## Capabilities

### New Capabilities
- `app-shell`: el armazón de la aplicación — enrutamiento entre las pantallas
  de `HANDOFF.md` §8, navegación inferior (`NavBar`) y el sistema de tema
  claro/oscuro/sistema. Es el comportamiento durable que todas las pantallas
  futuras comparten (qué rutas existen, cómo se navega entre ellas, cómo se
  elige y persiste el tema), no el trabajo puntual de este change.

### Modified Capabilities
(ninguna — es el primer change del proyecto)

## Impact

- Archivos nuevos en la raíz: `package.json`, `vite.config.ts`,
  `tsconfig.json`, `.eslintrc`/`eslint.config.*`, `.prettierrc`,
  `playwright.config.ts`, `index.html`.
- `src/main.tsx`, `src/App.tsx`, `src/router.tsx`.
- `src/ui/NavBar/` (componente + `.module.css`).
- `src/screens/*` (una carpeta vacía por pantalla de §8, con un componente
  placeholder).
- `src/copy/es-CL.ts` (archivo inicial, aunque esté casi vacío).
- Dependencias nuevas: `react`, `react-dom`, `react-router-dom`,
  `@fontsource/young-serif`, `@fontsource-variable/nunito`, y como
  devDependencies: `vite`, `typescript`, `eslint` + plugins, `prettier`,
  `vitest`, `@testing-library/react`, `@playwright/test`.
- No afecta `design/`, `data/`, `HANDOFF.md` ni `CLAUDE.md` (solo se leen).
