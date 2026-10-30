# Tasks

## 1. Scaffold del proyecto

- [x] 1.1 Inicializar el proyecto Vite (plantilla `react-ts`) en la raíz del repo con `package.json` (`name: "herbario"`) — verificar: `npm run build` corre sin errores con el `App` por defecto.
- [x] 1.2 Configurar `tsconfig.json` con `strict: true` — verificar: `npx tsc --noEmit` sin errores.
- [x] 1.3 Agregar `.gitignore` (`node_modules`, `dist`, `coverage`, `playwright-report`, `test-results`) — verificar: el archivo existe y lista esas rutas.

## 2. Herramientas de calidad

- [x] 2.1 Configurar ESLint (`eslint.config.js`, flat config) con `typescript-eslint` + `eslint-plugin-react-hooks` + `eslint-plugin-react-refresh` — verificar: `npm run lint` sin errores sobre el scaffold.
- [x] 2.2 Configurar Prettier (`.prettierrc`) — verificar: `npx prettier --check .` sin diferencias sobre los archivos de este change.
- [x] 2.3 Configurar Vitest + Testing Library (`vitest.config.ts` o sección en `vite.config.ts`) — verificar: `npm run test` ejecuta sin error de configuración.
- [x] 2.4 Configurar Playwright (`playwright.config.ts`, viewport 390×844, proyectos claro y oscuro) — verificar: `npm run test:e2e -- --list` enumera los specs sin error de configuración.
- [x] 2.5 Agregar a `package.json` los scripts `dev`, `build`, `test`, `test:e2e`, `lint` exactamente como los nombra `CLAUDE.md` — verificar: `npm run` los lista todos.

## 3. Estructura de carpetas y bitácora del repo

- [x] 3.1 Crear la estructura de `src/` de `HANDOFF.md` §4 (`domain/`, `db/`, `media/`, `ui/`, `screens/`, `copy/`, `dev/`) con un archivo mínimo por carpeta — verificar: `npm run build` sigue pasando.
- [x] 3.2 Crear `src/copy/es-CL.ts` con un objeto tipado mínimo exportado — verificar: se importa sin error desde una pantalla placeholder.
- [x] 3.3 Crear `DECISIONES.md` en la raíz con las decisiones de `design.md` de este change (tokens.css global, tema sin persistencia en M0, ESLint flat config, npm como gestor de paquetes, control de Tema adelantado en Ajustes) — verificar: el archivo existe y cada entrada referencia `m0-base-proyecto`.

## 4. Sistema visual

- [x] 4.1 Instalar `@fontsource/young-serif` y `@fontsource-variable/nunito` e importarlas en `src/main.tsx` — verificar: el texto se ve en Nunito/Young Serif en `npm run dev`.
- [x] 4.2 Importar `design/tokens.css` globalmente desde `src/main.tsx` — verificar: una regla `.module.css` de un placeholder que use `var(--color-leaf)` (u otra variable real del archivo) se aplica en el navegador.
- [x] 4.3 Crear el CSS base (reset mínimo + `html { font: -apple-system-body }` de `HANDOFF.md` §5.3) — verificar: inspección visual en `npm run dev`.

## 5. Enrutamiento y pantallas placeholder

- [x] 5.1 Crear `src/router.tsx` con `createBrowserRouter` y todas las rutas de `HANDOFF.md` §8 (incluida `/` → `/hoy` y `/dev/*` condicionadas a `import.meta.env.DEV`) — verificar: cumple los escenarios "Navegar directamente a una ruta válida" y "Redirección de la raíz" de `specs/app-shell/spec.md`.
- [x] 5.2 Crear un componente placeholder por pantalla en `src/screens/<Nombre>/index.tsx` (`<main><h1>{Nombre}</h1></main>`) para las 9 pantallas de §2.1 más Herbario (Especies/Botiquín/Libro) y Aprender — verificar: cada ruta renderiza su título sin error en consola.
- [x] 5.3 Agregar un test unitario (Vitest + Testing Library) que monta el router y verifica que `/` redirige a `/hoy` — verificar: `npm run test` pasa.

## 6. NavBar y tema

- [x] 6.1 Crear `src/ui/NavBar/` (`NavBar.tsx` + `.module.css`) con las 5 pestañas (Hoy, Jardín, Diario, Aprender, Herbario), `aria-current="page"` en la activa, y respeto de `env(safe-area-inset-bottom)` — verificar: cumple los escenarios "Cambiar de pestaña" y "Pestaña Aprender marcada como próximamente" de la spec.
- [x] 6.2 Montar `NavBar` en el layout raíz (`App.tsx`) visible en las pantallas principales — verificar: visible al navegar en `npm run dev`.
- [x] 6.3 Crear `useTheme()` (Context en `src/ui/theme/`) que aplique `document.documentElement.dataset.theme` y `<meta name="theme-color">` según la Decisión 4 de `design.md` — verificar: cumple los 3 escenarios de tema de la spec (oscuro, claro, sistema).
- [x] 6.4 Agregar el control segmentado Sistema/Claro/Oscuro dentro del placeholder de `Ajustes` (único contenido real adelantado de M7, ver Decisión 3 de `design.md`) — verificar: tocar cada opción cambia el tema visible en `npm run dev`.
- [x] 6.5 Agregar un test unitario de `useTheme()` cubriendo los 3 valores — verificar: `npm run test` pasa.

## 7. Verificación de integración (Definición de terminado de M0)

- [x] 7.1 Agregar `e2e/app-shell.spec.ts` (Playwright, 390×844) que navega por las 5 pestañas y cambia el tema a oscuro y de vuelta a sistema — verificar: `npm run test:e2e` pasa en claro y oscuro.
- [x] 7.2 Verificar en limpio el checklist de `HANDOFF.md` §12 (M0): `npm run build` sin errores, navegar entre las 5 pestañas, cambiar tema funciona — verificar: los tres puntos se confirman manualmente antes de archivar este change.
