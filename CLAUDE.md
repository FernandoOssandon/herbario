# Herbario — instrucciones para Claude Code

Herbario es una PWA personal (offline, sin backend) para cuidar plantas de departamento, llevar un diario y, más adelante, escribir un libro de hierbas. **La especificación completa está en `HANDOFF.md`. Léela entera antes de escribir código** y vuelve a ella al empezar cada hito.

## Reglas del proyecto

- **Stack fijo:** React 18 + Vite + TypeScript estricto, React Router, Dexie (IndexedDB) + `dexie-react-hooks`, `vite-plugin-pwa`, CSS Modules + `design/tokens.css`. No agregues librerías de UI ni de estado global sin una razón escrita en el PR.
- **Sin backend, sin analytics, sin llamadas de red** en tiempo de ejecución (salvo el service worker sirviendo su propio caché). Todo vive en el teléfono.
- **Idioma de la interfaz:** español de Chile, tuteo, tono cálido y didáctico. Identificadores de código en inglés; textos visibles en `src/copy/es-CL.ts`.
- **Estaciones del hemisferio sur.** Nunca uses lógicas de estación del norte.
- **Seguridad visible:** la toxicidad nunca se oculta, colapsa ni depende solo del color. `SafetyNotice` no tiene botón de cerrar ni ajuste para esconderlo.
- **Rojo y ámbar** solo para toxicidad y tareas atrasadas. Si necesitas otro aviso, usa terracota o azul.
- **Accesibilidad:** objetivos táctiles ≥ 44 px (acciones principales 56 px), contraste AA, tamaños en `rem`, elementos nativos (`button`, `a`, `input` + `label`), `aria-label` en botones de solo ícono.
- **El riego se revisa, no se ordena:** la app nunca dice «riega hoy»; dice «revisa la tierra».
- **Lógica de dominio pura** en `src/domain/` (sin React ni Dexie) y con pruebas unitarias.
- **Diseño:** las referencias visuales están en `design/artboards/` (archivos `.dc.html`, ver `design/README.md`). Copia valores exactos de ahí y de `tokens.css`; no inventes estilos nuevos.

## Comandos esperados

```bash
npm run dev        # servidor de desarrollo
npm run build      # build de producción (incluye service worker)
npm run test       # Vitest
npm run test:e2e   # Playwright (viewport 390×844)
npm run lint       # ESLint + tsc --noEmit
```

## Forma de trabajar

1. Sigue los hitos de `HANDOFF.md §12` en orden. Cada hito termina con su «Definición de terminado» cumplida y pruebas pasando.
2. Si algo no está especificado, elige la opción más simple coherente con los principios y anótala en `DECISIONES.md`. Si la decisión cambia lo que ve la usuaria, pregunta antes.
3. No completes datos de toxicidad, cuidados ni fuentes por tu cuenta: el catálogo en `data/seed-catalog.json` es un borrador que revisará la autora.
