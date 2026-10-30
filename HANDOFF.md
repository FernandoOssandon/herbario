# Herbario v0.1 — Handoff de diseño a desarrollo

> Destinatario: Claude Code (o quien implemente).
> Fecha: 27 de octubre de 2026 · Diseño: lienzo «Herbario», dirección B «Pleno sol».
> Stack acordado: React 18 + Vite + TypeScript, PWA offline sin backend.

**Contenido del paquete**

```
herbario-handoff/
├── HANDOFF.md              ← este documento (la especificación)
├── CLAUDE.md               ← reglas para el agente; copiar a la raíz del repo
├── design/
│   ├── tokens.css          ← variables de diseño claro/oscuro, listas para importar
│   ├── README.md           ← cómo leer las maquetas
│   └── artboards/*.dc.html ← maquetas fuente (pantallas, componentes, prototipos)
└── data/
    ├── seed-catalog.json   ← catálogo inicial de especies (BORRADOR sin verificar)
    └── seed-demo.json      ← datos de demo (solo desarrollo y pruebas)
```

---

## 0. Cómo usar este documento

1. Lee el documento completo una vez. Después trabaja **por hitos (§12)**, en orden.
2. Las secciones §5–§9 son la fuente de verdad visual y de comportamiento. Si una maqueta y este texto no coinciden, **manda el texto**; anota la diferencia en `DECISIONES.md`.
3. Cada pantalla trae **criterios de aceptación** (CA). Un hito no está terminado hasta que todos sus CA pasan y tienen prueba (unitaria o e2e) cuando se indica.
4. Palabras clave: **DEBE** = obligatorio en v0.1; **DEBERÍA** = hazlo si no complica; **PUEDE** = opcional, solo si sobra tiempo.

---

## 1. Producto

### 1.1 Qué es
Una PWA instalable que acompaña un plan personal de herbología: aprender a cuidar plantas en un departamento, armar un botiquín herbal casero y, con el tiempo, escribir un libro de hierbas medicinales.

Tres pilares: **APRENDER**, **CUIDAR** y **REGISTRAR**. Idea central: *lo que se registra en el diario alimenta la historia de cada planta, y esas fichas alimentarán el libro.* Por eso el diario es la única fuente de eventos: cuidados, fotos y notas son todas entradas del diario.

### 1.2 Usuaria y contexto
- Una persona en un departamento de la zona central de Chile. Plantas en cocina y living (interior) y en un balcón.
- Ratos cortos, a menudo **con una mano**, en el balcón y **a pleno sol**.
- La **foto** es la forma principal de registrar. **Registrar algo debe tomar menos de 15 segundos.**
- Español de Chile. **Hemisferio sur**: primavera sep–nov, verano dic–feb, otoño mar–may, invierno jun–ago.
- iPhone como dispositivo principal (Safari, instalada en la pantalla de inicio). Debe funcionar también en Android/Chrome.

### 1.3 Principios (no negociables)
1. **Una mano:** acciones principales en la mitad inferior; objetivos táctiles ≥ 44 px; botones primarios de 56 px.
2. **Pleno sol:** contraste WCAG AA como mínimo (los pares principales superan 7:1). Respetar el tamaño de texto del sistema.
3. **La seguridad se ve:** la toxicidad nunca queda escondida; siempre con ícono + texto, nunca solo color.
4. **Enseñar, no mandar:** el riego se *revisa* con el dedo; la app no ordena regar por calendario.
5. **Tono cálido y didáctico:** cada estado vacío enseña algo y nunca regaña.
6. **Privado y offline:** todos los datos y fotos viven solo en el teléfono. Sin cuentas, sin red, sin analytics.

---

## 2. Alcance v0.1

### 2.1 Dentro
| # | Pantalla / función | Maqueta |
|---|---|---|
| 1 | Hoy (con banner de estación, tareas agrupadas, aviso de respaldo, estado vacío) | `Hoy`, `HoyVacio` |
| 2 | Hoja inferior «Revisar riego» | `RevisarRiego`, `ProtoRiego` |
| 3 | Mi jardín (lista con filtros) | `Jardin` |
| 4 | Detalle de planta | `DetallePlanta` |
| 5 | Asistente «Nueva planta» (3 pasos + resumen) | `NuevaFoto`, `NuevaEspecie`, `NuevaUbicacion`, `NuevaResumen` |
| 6 | Diario (lista + editor) | `Diario`, `EntradaEditor` |
| 7 | Registro rápido (botón «+», Foto rápida, Nota rápida, Regué) | `RegistroRapido`, `ProtoFoto` |
| 8 | Ficha de especie (solo lectura) | `FichaEspecie` |
| 9 | Ajustes y respaldo | `Ajustes` |
| — | Herbario › Especies (lista simple, **sin maqueta**: ver §8.10) | — |
| — | Aprender, Herbario › Botiquín, Herbario › Libro como «próximamente» | `EmptyState` variante `pronto` |
| — | Editor de ubicaciones (**sin maqueta**: ver §8.9.1) | — |
| — | Modo claro y oscuro, PWA instalable y offline | todas |

### 2.2 Fuera (no construir)
Contenido de Aprender, Botiquín y Libro; sincronización o cuentas; notificaciones push; identificación automática de plantas por foto; clima automático; compartir con otras personas; múltiples usuarios; idiomas distintos de es-CL.

---

## 3. Arquitectura y stack

| Necesidad | Elección | Nota |
|---|---|---|
| UI | React 18 + TypeScript (`strict: true`) | Componentes de función, sin clases |
| Build | Vite | |
| Rutas | `react-router-dom` (v6.4+ con `createBrowserRouter`) | Hojas inferiores como estado de ruta (ver §8) |
| Datos | Dexie 4 + `dexie-react-hooks` (`useLiveQuery`) | IndexedDB; fotos como `Blob` |
| PWA | `vite-plugin-pwa` (Workbox, `registerType: 'prompt'`) | App shell precacheado |
| Estilos | CSS Modules + `design/tokens.css` | Sin Tailwind ni librerías de UI |
| Fuentes | `@fontsource/young-serif`, `@fontsource-variable/nunito` | Autoalojadas: funcionan offline |
| Fechas | `date-fns` + locale `es` | Zona horaria del dispositivo |
| Respaldo | `jszip` | Export/import `.zip` |
| IDs | `crypto.randomUUID()` | |
| Pruebas | Vitest + Testing Library; Playwright + `@axe-core/playwright` | Viewport 390×844 |

**Reglas de arquitectura**
- `src/domain/` contiene lógica pura (estaciones, programación de tareas, avisos de luz, toxicidad, validación de respaldo). Sin React ni Dexie. 100 % con pruebas unitarias.
- `src/db/` define el esquema Dexie, migraciones, seeds y repositorios (funciones `getX`, `saveX`).
- `src/ui/` componentes reutilizables (§7). `src/screens/` pantallas. `src/copy/es-CL.ts` todos los textos.
- No hay estado global aparte de la base de datos y la URL. Estado efímero (hoja abierta, selección) en el componente o en la URL.
- Toda escritura que toque varias tablas va en una transacción Dexie.

---

## 4. Estructura sugerida del repositorio

```
herbario/
├── CLAUDE.md  HANDOFF.md  DECISIONES.md
├── design/            ← copiar tal cual desde este paquete
├── data/              ← seeds
├── public/
│   ├── icons/         ← icon-192.png, icon-512.png, icon-maskable-512.png, apple-touch-icon-180.png
│   └── favicon.svg
├── src/
│   ├── main.tsx  App.tsx  router.tsx
│   ├── copy/es-CL.ts
│   ├── domain/        ← seasons.ts, schedule.ts, light.ts, toxicity.ts, backup.ts (+ *.test.ts)
│   ├── db/            ← schema.ts, migrations.ts, seed.ts, repos/*.ts
│   ├── media/         ← camera.ts, imageProcessing.ts
│   ├── ui/            ← icons.tsx y componentes de §7 (cada uno con .module.css)
│   ├── screens/       ← Hoy/, Jardin/, PlantDetail/, NewPlant/, Diario/, EntryEditor/,
│   │                     QuickPhoto/, Species/, SpeciesDetail/, Settings/, ComingSoon/
│   └── dev/           ← /dev/componentes y /dev/seed (solo en desarrollo)
└── e2e/               ← quick-photo.spec.ts, water-check.spec.ts, new-plant.spec.ts, a11y.spec.ts
```

---

## 5. Sistema visual

Valores exactos en `design/tokens.css`; hoja visual en `design/artboards/Estilos.dc.html`.

### 5.1 Color
- **Base:** fondo crema `--color-bg`, superficies blancas, tinta casi negra verdosa.
- **Marca:** hoja (`--color-leaf`) para lo primario; terracota (`--color-terra`) para lo secundario y el botón «+».
- **Reservados:** ámbar = tarea atrasada y toxicidad «precaución»; rojo = toxicidad «tóxica». **Nada más usa rojo ni ámbar.**
- **Azul:** solo estado «en observación» y cajas didácticas («Cómo revisar la tierra», consejos).
- **Estaciones:** cada estación tiene su color de banner (variables `--season-*`).
- **Modo oscuro:** mismas variables redefinidas. En oscuro, los botones primarios son verde claro con texto oscuro.

### 5.2 Tema
- `Settings.theme`: `'system' | 'light' | 'dark'`. Con `system` no se pone atributo; con los otros, `document.documentElement.dataset.theme = 'light' | 'dark'`.
- Actualizar `<meta name="theme-color">` al cambiar de tema (`#F7F4EC` claro, `#0E110D` oscuro).

### 5.3 Tipografía
- **Young Serif** (400) para títulos de pantalla, títulos de sección y el banner de estación.
- **Nunito** (variable, 500–800) para toda la interfaz. Peso base 600; nombres de planta 800.
- Escala en `rem` (ver tokens). `html { font: -apple-system-body }` hace que en iOS la base siga Dynamic Type; en el resto, 1rem = 16 px por defecto del navegador. **Nunca** fijes tamaños en `px` para texto.
- Con texto agrandado, las tarjetas crecen en alto (nunca recortar texto ni usar `text-overflow` en nombres de planta o toxicidad).

### 5.4 Espaciado y forma
Base 4 (`--space-*`). Margen lateral de pantalla 16 px. Radios: chips 10, fotos 14, campos 16, tarjetas 20, banner 22, hojas 28, botón «+» 22.

### 5.5 Íconos
Línea, cuadrícula 24, trazo 2, `currentColor`. Rutas exactas en `Estilos.dc.html`. Set mínimo para `src/ui/icons.tsx`:

| Grupo | Íconos |
|---|---|
| Tareas | `riego` (gota), `poda` (tijera), `abono` (hoja), `plagas` (lupa), `cosecha` (cesta), `rotar` (flechas circulares), `polinizar` (flor) |
| Diario | `foto` (cámara), `nota` (lápiz), `observacion` (ojo), `problema` (bicho), `preparacion` (mortero), `aprendizaje` (ampolleta), `hito` (bandera), `clima` (nube) |
| Navegación | `hoy` (sol), `jardin` (maceta con brote), `diario` (cuaderno), `aprender` (libro abierto, trazo discontinuo), `herbario` (hoja prensada) |
| Otros | `ubicacion`, `luz`, `mascotas`, `respaldo`, `toxica` (triángulo), `precaucion` (círculo !), `noToxica` (escudo ✓), `desconocida` (círculo ?), `atrasada` (reloj), `perfil`, `mas`, `cerrar`, `check`, `chevronDer`, `chevronAbajo`, `atras`, `buscar`, `compartir`, `descargar`, `subir`, `candado`, `cruzMedica` |

Íconos decorativos: `aria-hidden="true"`. Botones de solo ícono: `aria-label` descriptivo («Revisar riego de Cuna de Moisés»).

---

## 6. Modelo de datos y lógica de dominio

### 6.1 Tipos

```ts
// src/domain/types.ts
export type Season = 'primavera' | 'verano' | 'otono' | 'invierno';
export type ToxLevel = 'no-toxica' | 'precaucion' | 'toxica' | 'desconocida';
export type LightLevel = 1 | 2 | 3 | 4;           // 1 baja · 2 media · 3 alta · 4 sol directo
export type TaskType = 'riego' | 'poda' | 'abono' | 'plagas' | 'cosecha' | 'rotar' | 'polinizar';
export type PlantStatus = 'activa' | 'observacion' | 'recuperacion' | 'plantin' | 'perdida';
export type EntryType = 'observacion' | 'cuidado' | 'problema' | 'cosecha' | 'preparacion' | 'aprendizaje' | 'hito';
export type SoilState = 'muy-seca' | 'seca' | 'humeda' | 'empapada';
export type TaskOutcome = 'hecho' | 'regue' | 'no-necesitaba' | 'manana';
export type ISODate = string;      // 'YYYY-MM-DD' (fecha local)
export type ISODateTime = string;  // ISO 8601 con zona

export interface Location {
  id: string; name: string; kind: 'interior' | 'exterior'; light: LightLevel;
  order: number; createdAt: ISODateTime;
}

export interface Species {
  id: string;                         // slug del nombre científico
  commonName: string; scientificName: string; family?: string; otherNames: string[];
  kind: 'comestible-medicinal' | 'ornamental';
  lightNeed: LightLevel;
  toxicity: { humans: ToxLevel; pets: ToxLevel; humansNote?: string; petsNote?: string };
  care: { light: string; water: string; temperature: string; humidity: string };
  usedParts: string; precautions: string[];
  carePlanTemplate: CarePlanTemplateItem[];
  status: 'catalogo' | 'por-confirmar';   // «crear especie a confirmar» → 'por-confirmar'
  verified: boolean; sources: string[];
  createdAt: ISODateTime; updatedAt: ISODateTime;
}

export interface CarePlanTemplateItem {
  type: TaskType;
  everyDaysBySeason: Partial<Record<Season, number>>;   // estación ausente = pausado esa estación
  note: string;
  onlyInterior?: boolean;                                // p. ej. rotar, polinizar
}

export interface Plant {
  id: string; nickname: string; speciesId: string; locationId: string;
  status: PlantStatus; coverPhotoId?: string; acquiredAt?: ISODate;
  lightWarningDismissedFor?: string;   // locationId para el que se descartó el aviso
  createdAt: ISODateTime; updatedAt: ISODateTime;
}

export interface CarePlanItem {
  id: string; plantId: string; type: TaskType; note: string; enabled: boolean;
  everyDaysBySeason: Partial<Record<Season, number>>;
  adjustDays: number;                  // ajuste aprendido (§6.4), puede ser negativo
  nextDueAt: ISODate; lastDoneAt?: ISODateTime;
  consecutiveNotNeeded: number;        // para el ajuste de riego
  createdAt: ISODateTime;
}

export interface JournalEntry {
  id: string; type: EntryType; text: string;
  plantIds: string[]; photoIds: string[]; tags: string[];
  weather?: { condition?: 'soleado' | 'nublado' | 'lluvia'; tempC?: number };
  task?: { carePlanItemId: string; taskType: TaskType; outcome: Exclude<TaskOutcome, 'manana'>; soil?: SoilState };
  source: 'manual' | 'foto-rapida' | 'nota-rapida' | 'tarea' | 'asistente';
  at: ISODateTime; createdAt: ISODateTime; updatedAt: ISODateTime;
}

export interface Photo {
  id: string; blob: Blob; thumb: Blob; mime: 'image/jpeg';
  width: number; height: number; bytes: number; takenAt: ISODateTime;
}

export interface Settings {
  id: 'singleton'; zone: 'chile-central'; hasPets: boolean;
  theme: 'system' | 'light' | 'dark';
  lastBackupAt?: ISODateTime; firstUseAt: ISODateTime;
  lastPhotoPlantId?: string; schemaVersion: number;
}
```

### 6.2 Esquema Dexie (v1)
```ts
db.version(1).stores({
  locations: 'id, order',
  species:   'id, commonName, scientificName, status',
  plants:    'id, speciesId, locationId, status, updatedAt',
  carePlan:  'id, plantId, nextDueAt, [plantId+type]',
  journal:   'id, at, type, *plantIds, *tags',
  photos:    'id, takenAt',
  settings:  'id',
});
```
- Primer arranque: crear `Settings`, las 3 ubicaciones de `seed-catalog.json › defaultLocations` y todas las especies del catálogo.
- Las migraciones futuras van en `src/db/migrations.ts` y también se aplican al importar un respaldo con `schemaVersion` menor.

### 6.3 Estaciones (`domain/seasons.ts`)
- `seasonFor(date)`: meses 9–11 → primavera; 12, 1, 2 → verano; 3–5 → otoño; 6–8 → invierno.
- Consejo del banner por estación (texto exacto en `SeasonBanner.dc.html`):

| Estación | Título | Texto |
|---|---|---|
| Primavera | Buen momento para trasplantar | Las raíces se recuperan rápido con más horas de luz. |
| Verano | Riega temprano o al atardecer | En el balcón la tierra se seca en horas: revísala dos veces al día. |
| Otoño | Cosecha y seca tus hierbas | Corta antes de que florezcan y cuelga manojos a la sombra. |
| Invierno | Menos agua, más luz | Crecen lento: espacia el riego y acércalas a la ventana. |

### 6.4 Programación de tareas (`domain/schedule.ts`)
**Generar el plan** (al crear una planta o cambiar su especie o ubicación):
1. Por cada `carePlanTemplate` de la especie, crear un `CarePlanItem`. Omitir los `onlyInterior` si la ubicación es exterior.
2. Si la ubicación es **exterior** y el tipo es `riego`: multiplicar cada intervalo por 0,75 y redondear (mínimo 1).
3. `nextDueAt` = hoy para `riego`; hoy + intervalo para el resto. Si el ítem está pausado en la estación actual, `nextDueAt` = primer día de la próxima estación en que tenga intervalo.

**Intervalo vigente:** `interval(item, date) = max(1, everyDaysBySeason[seasonFor(date)] + adjustDays)`; `null` si la estación no tiene valor (pausado).

**Agrupar en Hoy** (solo plantas con estado ≠ `perdida` e ítems `enabled`):
- **Atrasadas:** `nextDueAt < hoy`. Etiqueta «Atrasada N día(s)».
- **Hoy:** `nextDueAt == hoy`.
- **Próximos 3 días:** `hoy < nextDueAt <= hoy + 3`. Etiqueta con día corto: «mié 28».
- Orden dentro de cada grupo: más atrasada primero → riego antes que el resto → nombre de planta.

**Resolver una tarea:**

| Resultado | `nextDueAt` | Entrada de diario |
|---|---|---|
| `hecho` (tareas que no son riego) | hoy + intervalo | `cuidado`, texto «{Tarea}» (editable luego) |
| `regue` | hoy + intervalo | `cuidado`, con `task.soil` si se respondió |
| `no-necesitaba` | hoy + max(1, round(intervalo / 2)) | `observacion`, texto «Tierra {estado}: no necesitaba agua» |
| `manana` | hoy + 1 | ninguna |

**Ajuste aprendido de riego (DEBE, simple):**
- 2 respuestas `no-necesitaba` seguidas → `adjustDays += 1` (máximo +7) y reiniciar el contador.
- Respuesta `muy-seca` → `adjustDays -= 1` (sin bajar el intervalo de 1).
- Al ajustar, el aviso de confirmación agrega: «Ajusté su revisión a cada N días».

**Deshacer:** cada resolución guarda el estado previo del ítem y la entrada creada; «Deshacer» (5 s en el aviso) restaura ambos en una transacción.

### 6.5 Aviso de luz (`domain/light.ts`)
- Mostrar si `location.light < species.lightNeed` y `plant.lightWarningDismissedFor !== plant.locationId`.
- Texto exacto: **«Esta ubicación probablemente es poco luminosa para esta planta»** + explicación de `species.care.light`.
- Acciones: «Mover a {ubicación}» (la de mayor luz que cumpla; si ninguna, «Cambiar ubicación») y «Ya tiene buena luz» (descarta para esa ubicación).
- Con las ubicaciones por defecto, también avisará en albahaca y tomate (cocina, luz media). Es correcto: la usuaria puede descartarlo.

### 6.6 Toxicidad (`domain/toxicity.ts`)
- `worstTox(sp)`: el peor nivel entre personas y mascotas (orden: tóxica > precaución > desconocida > no tóxica).
- **En tarjetas** (jardín, tareas, búsqueda): `ToxicityBadge` pequeño con el peor nivel si es `toxica` o `precaucion`. `no-toxica` no se muestra en tarjetas para no saturar; `desconocida` sí se muestra.
- **En detalle y ficha:** siempre las dos líneas (personas y mascotas), cualquiera sea el nivel.
- **Mascotas en casa (`Settings.hasPets`):** el nivel de mascotas se muestra primero y el aviso del asistente menciona mascotas en el título.
- **Especie por confirmar:** toxicidad `desconocida` en ambas, nunca «no tóxica» por defecto.

### 6.7 Aviso de respaldo
Mostrar en Hoy si hay al menos 1 planta y: `lastBackupAt` existe y fue hace más de 30 días, o no existe y `firstUseAt` fue hace más de 30 días. Texto: «Respaldo pendiente · Último: hace N días» (o «Aún no tienes respaldo»). El botón «Respaldar» lleva a Ajustes › Respaldo y enfoca «Exportar».

---

## 7. Componentes

Cada componente vive en `src/ui/<Nombre>/` con su `.module.css`, usa solo variables de `tokens.css` y se muestra en `/dev/componentes` con todas sus variantes, en claro y oscuro (equivalente a `Componentes.dc.html`).

### 7.1 Componentes pedidos en el brief

```ts
// ToxicityBadge — maqueta ToxicityBadge.dc.html
type ToxicityBadgeProps = {
  level: ToxLevel;
  target?: 'personas' | 'mascotas' | 'ambas';  // solo en size 'md'
  size?: 'sm' | 'md';                          // sm 24px alto · md 32px alto
};
// Texto: «Tóxica», «Precaución», «No tóxica», «Toxicidad desconocida»; en md + target: «Tóxica · mascotas».
// Colores: tóxica rojo con borde; precaución ámbar; no tóxica verde suave; desconocida neutro con borde punteado.
// Siempre ícono + texto. Nunca truncar. role implícito de texto (no es botón).

// CareTaskCard — maqueta CareTaskCard.dc.html
type CareTaskCardProps = {
  plantName: string; taskLabel: string; taskType: TaskType;
  state: 'pendiente' | 'atrasada' | 'hecha' | 'proxima';
  meta?: string;                 // «Atrasada 1 día» · «mié 28» · «10:24»
  tox?: ToxLevel;                // peor nivel; se muestra si es tóxica, precaución o desconocida
  photo?: Blob | null;           // miniatura 60×60 (44×44 en próxima)
  onAction?: () => void;         // riego → abre «Revisar riego»; otros → marca hecho
  onOpen?: () => void;           // tocar la tarjeta (fuera del botón) → detalle de planta
};
// Riego pendiente/atrasada: botón lleno 56×56 con gota. Otras: botón contorno 56×56 con check.
// Atrasada: borde 2px ámbar + chip ámbar con reloj. Hecha: check en círculo, nombre en tinta 2, tarea tachada.
// Próxima: compacta, sin botón, día a la derecha. La toxicidad se ve en TODOS los estados.

// PhotoPicker — maqueta PhotoPicker.dc.html
type PhotoPickerProps = {
  value: Blob[];                 // 0..n
  max?: number;                  // 1 en el asistente, 6 en el diario
  onChange: (photos: Blob[]) => void;
  hint?: string;                 // «Encuadra la planta completa, con su maceta»
};
// Vacío: recuadro punteado + «Tomar foto» (primario 56) + «Elegir de la galería» (secundario 48).
// Con foto: vista previa 230px alto, sello de hora, «Cambiar» y «Otra foto».
// Pie fijo: «Las fotos se guardan solo en este teléfono.»
// Usa <input type="file" accept="image/*" capture="environment"> y otro sin capture para galería.

// TimelineItem — maqueta TimelineItem.dc.html
type TimelineItemProps = {
  entry: JournalEntry; photoThumb?: Blob; isLast?: boolean; onOpen?: () => void;
};
// Riel izquierdo: círculo 40px con ícono del tipo + línea vertical (sin línea si isLast).
// Derecha: «27 oct · Observación» (13/800), título o primera línea (17/800), texto (15/600), foto 150px alto.

// SeasonBanner — maqueta SeasonBanner.dc.html
type SeasonBannerProps = { season: Season };  // texto de §6.3, ilustración de línea por estación

// SafetyNotice — maqueta SafetyNotice.dc.html
type SafetyNoticeProps = { context: 'planta' | 'preparacion' };
// Borde 2px tinta, ícono cruz médica, título «Cuándo consultar a un profesional», 3 viñetas por contexto,
// pie «Este aviso siempre está visible. La app enseña; no diagnostica.» SIN botón cerrar ni prop para ocultarlo.

// EmptyState — maqueta EmptyState.dc.html
type EmptyStateProps = {
  variant: 'hoy' | 'jardin' | 'diario' | 'especies' | 'pronto';
  onAction?: () => void;
};
// Ilustración de línea en círculo 112px, título Young Serif 22, texto didáctico, botón primario 52.

// Chip — maqueta Chip.dc.html
type ChipProps =
  | { kind: 'estado'; status: PlantStatus }              // punto de color + texto, 28px alto, no interactivo
  | { kind: 'etiqueta'; label: string; onRemove?: () => void }
  | { kind: 'filtro'; label: string; selected: boolean; onToggle: () => void };  // 44px, aria-pressed
// Estados: Activa · En observación · En recuperación · Plantín · Ya no está.
```

### 7.2 Componentes de soporte (también necesarios)
- **`NavBar`** — 5 pestañas: Hoy · Jardín · Diario · Aprender · Herbario. Activa: píldora verde suave detrás del ícono + texto 800 + `aria-current="page"`. Aprender lleva la etiqueta «pronto» y el ícono de trazo discontinuo, pero se puede tocar (abre su estado «próximamente»). Respeta `env(safe-area-inset-bottom)`.
- **`Fab`** — botón «+» terracota 64×64, radio 22, sombra `--shadow-fab`, a 18 px del borde derecho y 20 px sobre la `NavBar`. Visible en: Hoy, Jardín, Detalle de planta, Diario, Herbario › Especies, Ficha de especie. **No** en: asistente, editor de entrada, cámara, Ajustes, hojas abiertas.
- **`BottomSheet`** — fondo `--color-scrim` (tocar cierra), hoja con radio 28 arriba, asa 40×5, botón cerrar 44. Atrapa el foco, cierra con Escape y con el botón «atrás» (la hoja abierta vive en la URL). Animación de 240 ms; sin animación con `prefers-reduced-motion`.
- **`Toast`** — fondo tinta, texto fondo, 18 px de radio, sobre la `NavBar`. `role="status"`. Botón opcional («Deshacer», «Agregar nota»). Dura 5 s; no desaparece mientras tiene el foco.
- **`ScreenHeader`** — título Young Serif 34 + subtítulo 16/700, acciones a la derecha (botones de 48). Variante con botón «atrás» circular para pantallas internas.
- **`WizardHeader`** — botón cerrar/atrás + «Nueva planta · paso N de 3» + barra de progreso de 3 segmentos.
- **`ListRow`**, **`Switch`** (`<input type="checkbox" role="switch">`), **`SegmentedControl`** (radios), **`TextField`**, **`TextArea`**, **`SoilOption`** (botón con `aria-pressed`, 72 px alto), **`PlantThumb`** (miniatura con placeholder de hoja si no hay foto), **`InfoBox`** (azul, didáctico), **`WarnBox`** (terracota; p. ej. aviso de luz), **`DangerBox`** (rojo; solo toxicidad).

---

## 8. Pantallas

### Rutas

| Ruta | Pantalla |
|---|---|
| `/` | redirige a `/hoy` |
| `/hoy` · `?revisar={carePlanItemId}` · `?registro=1` | Hoy · hoja Revisar riego · hoja Registro rápido |
| `/jardin` · `/jardin/:plantId` | Mi jardín · Detalle de planta |
| `/nueva-planta?paso=foto\|especie\|ubicacion` · `/nueva-planta/listo/:plantId` | Asistente · Resumen |
| `/diario` · `/diario/nueva` · `/diario/:entryId` | Diario · Editor (nueva / editar) |
| `/foto-rapida?planta={plantId}` | Cámara de Foto rápida (pantalla completa) |
| `/aprender` | Próximamente |
| `/herbario/especies` · `/herbario/especies/:speciesId` · `/herbario/botiquin` · `/herbario/libro` | Herbario |
| `/ajustes` · `/ajustes/ubicaciones` | Ajustes · Ubicaciones |
| `/dev/componentes` · `/dev/seed` | Solo en `import.meta.env.DEV` |

Las hojas `?revisar` y `?registro` pueden abrirse sobre cualquier pantalla con `Fab`, no solo Hoy.

### 8.1 Hoy — `Hoy.dc.html`, `HoyVacio.dc.html`
**Contenido, de arriba a abajo:** título «Hoy» + fecha larga («Martes 27 de octubre»); botón perfil 48 px → `/ajustes`. `SeasonBanner` de la estación actual. Aviso de respaldo (§6.7) si corresponde. Grupos «Atrasadas · N» (encabezado en ámbar), «Hoy · N» y «Próximos 3 días» (plegado por defecto: botón con borde punteado «Próximos 3 días · N tareas» y flecha; al tocar se despliega con `CareTaskCard` en estado `proxima`). `Fab` y `NavBar`.

**Estado vacío** (sin atrasadas ni tareas de hoy): `EmptyState` variante `hoy` («Todo al día» + consejo sobre revisar el revés de las hojas; acción «Anotar una observación» → `/diario/nueva?tipo=observacion`). Se mantienen el banner y «Próximos 3 días».

**Sin plantas:** `EmptyState` variante `jardin` con acción «Agregar planta».

**CA**
- [ ] Una tarea con `nextDueAt` de ayer aparece en Atrasadas con «Atrasada 1 día» y borde ámbar.
- [ ] Tocar el botón de gota abre la hoja Revisar riego para ese ítem; tocar el check marca hecha, muestra el aviso con «Deshacer» y la tarjeta pasa a estado hecha hasta el día siguiente.
- [ ] La Cuna de Moisés muestra «Tóxica» en su tarjeta en cualquier estado.
- [ ] El aviso de respaldo aparece y desaparece según §6.7.
- [ ] El banner cambia a «Verano» el 1 de diciembre (prueba unitaria de `seasonFor`).

### 8.2 Revisar riego (hoja inferior) — `RevisarRiego.dc.html`, `ProtoRiego.dc.html`
**Contenido:** miniatura + nombre + «{Ubicación} · último riego hace N días» + `ToxicityBadge sm` si aplica + cerrar. Caja azul didáctica: «Mete un dedo en la tierra hasta la segunda falange (unos 3 cm). La superficie engaña: lo que importa está abajo.» Pregunta «¿Cómo estaba la tierra?» con 4 `SoilOption` en cuadrícula 2×2:

| Opción | Ayuda | Consejo que aparece | Botón recomendado |
|---|---|---|---|
| Muy seca | Se despega de la maceta | Muy seca: riega ya, en dos tandas, para que el agua no se escape por los bordes. | Regué |
| Seca | Seca a 3 cm, suelta | Seca: buen momento. Riega hasta que salga agua por abajo y bota lo que quede en el plato. | Regué |
| Húmeda | Fresca, se pega al dedo | Húmeda: todavía no. Te volvemos a preguntar en N días. | No necesitaba |
| Empapada | Escurre agua o huele | Empapada: no riegues. Vacía el plato; el exceso de agua pudre las raíces. | No necesitaba |

Sin selección: «Elige cómo estaba la tierra y te digo qué hacer.» Acciones: **Regué** (56, ancho completo), **No necesitaba** y **Mañana** (52, mitad cada uno). El botón recomendado se pinta como primario; el otro como secundario. Todas las acciones funcionan aunque no se elija estado de la tierra (se guarda sin `soil`).

**Al resolver:** cerrar hoja → aplicar §6.4 → aviso: «Riego registrado: {planta}. Próxima revisión: {día}.» / «Bien visto. Revisamos {planta} de nuevo el {día}.» / «Te recuerdo {planta} mañana.» con «Deshacer».

**CA**
- [ ] Ningún texto de la hoja dice «riega hoy» antes de que la usuaria responda.
- [ ] Elegir Húmeda o Empapada cambia el botón primario a «No necesitaba».
- [ ] e2e `water-check.spec.ts`: Hoy → gota en Cuna de Moisés → Seca → Regué → la tarjeta pasa a hecha, aparece el aviso, el diario tiene una entrada `cuidado` con `soil: 'seca'`; «Deshacer» revierte todo.
- [ ] El botón atrás del sistema cierra la hoja sin registrar nada.

### 8.3 Mi jardín — `Jardin.dc.html`
**Contenido:** título «Mi jardín» + «N plantas · M ubicaciones»; botón buscar 48 (filtra por apodo o especie) y botón «+ Planta» → asistente. Filtros:
- Fila de `Chip` filtro por ubicación con conteo: «Todas · 8», «Cocina · 2»… (selección única).
- Dos botones desplegables: **Tipo** (Todas / Comestibles y medicinales / Ornamentales) y **Estado** (Todos / Activa / En observación / En recuperación / Plantín / Ya no está). «Ya no está» oculto por defecto.
- Los filtros se guardan en la URL (`?ubicacion=&tipo=&estado=`).

**Tarjeta de planta** (toda la tarjeta es un enlace a `/jardin/:id`): foto 88×104 (o placeholder), apodo 18/800, especie en cursiva 14, ícono de ubicación + «{Ubicación} · {próxima tarea}» (próxima tarea en ámbar si está atrasada), fila con `Chip` estado + `ToxicityBadge sm` (regla §6.6).

**Orden:** primero las que tienen tareas atrasadas, luego por próxima tarea, luego alfabético.

**CA**
- [ ] Filtrar «Balcón» + «Ornamentales» muestra solo la Sansevieria (con demo).
- [ ] Sin resultados: mensaje «Ninguna planta coincide» + botón «Quitar filtros».
- [ ] Sin plantas: `EmptyState` variante `jardin`.

### 8.4 Detalle de planta — `DetallePlanta.dc.html`
**Contenido:**
1. **Portada** 290 px de alto con la foto de portada (o placeholder), botón atrás y botón «Más opciones» (48, sobre fondo superficie), sello «Foto del 27 oct · 12 fotos» (abre galería simple de las fotos de la planta, PUEDE ser v0.2).
2. Hoja que se superpone 24 px: apodo (Young Serif 32); enlace «*Nombre científico* · Ver ficha de la especie ›» → `/herbario/especies/:speciesId`; fila con `Chip` estado, chip de ubicación («Living · interior») y `ToxicityBadge md` (si personas y mascotas tienen el mismo nivel, uno con target `ambas`; si no, dos badges).
3. **Aviso de luz** (§6.5) en `WarnBox` terracota con «Mover a Balcón» (primario terracota) y «Ya tiene buena luz».
4. Acciones rápidas en 3 columnas (52 px): **Foto** (→ `/foto-rapida?planta=id`), **Nota** (→ `/diario/nueva?planta=id`), **Regué** (→ abre Revisar riego del ítem de riego de esta planta).
5. **Plan de cuidados** + botón «Editar». Filas: ícono, título («Revisar riego»), detalle («Cada 4 días · riega solo si está seca a 3 cm»), próxima fecha a la derecha. Pie: «Generado según la especie, la ubicación y la estación. El riego siempre empieza revisando la tierra.»
   - **Editar plan:** hoja con cada ítem: switch activo, intervalo de la estación actual (stepper −/+ de 1 a 60 días, botones de 44), nota; «Agregar cuidado» (tipo + intervalo). Guardar recalcula `nextDueAt` = `lastDoneAt` + nuevo intervalo (o hoy si nunca se hizo).
6. **Su historia:** `TimelineItem` de todas las entradas de diario con esta planta, más reciente primero; filtro «Todo ▾» por tipo de entrada. Paginación de 20 en 20 al desplazarse.

**Más opciones:** Editar planta (apodo, especie, ubicación, estado, fecha de llegada), Elegir portada (de sus fotos), Marcar «Ya no está» (estado `perdida`, oculta sus tareas), Eliminar planta (confirmación: «Se borra la planta y su plan. Las entradas del diario se conservan.»; las entradas pierden el vínculo).

**CA**
- [ ] Tomillo en Living muestra el aviso de luz; «Ya tiene buena luz» lo oculta y vuelve a aparecer si se cambia a otra ubicación con poca luz.
- [ ] «Mover a Balcón» cambia la ubicación, regenera el plan (rotar desaparece por ser solo interior, el riego se acorta) y muestra aviso «Moviste el tomillo al balcón. Ajusté su plan.»
- [ ] Una foto rápida de esta planta aparece arriba en «Su historia».

### 8.5 Asistente «Nueva planta» — `NuevaFoto`, `NuevaEspecie`, `NuevaUbicacion`, `NuevaResumen`
Pantalla completa sin `NavBar` ni `Fab`. `WizardHeader` con progreso. El estado del borrador se guarda en `sessionStorage` para sobrevivir a recargas; cerrar pregunta «¿Descartar esta planta?» si hay datos.

**Paso 1 · Foto.** «Empieza con una foto» + «Será su portada en el jardín y la primera página de su historia.» `PhotoPicker` (max 1). Caja azul: «Toma siempre la foto desde el mismo ángulo: así notarás cambios que día a día no se ven.» Pie: «Sin foto» (secundario) y «Siguiente ›» (primario).

**Paso 2 · Especie.** «¿Qué planta es?» Campo de búsqueda (etiqueta «Busca por nombre común o científico»), sin tildes ni mayúsculas (`normalize('NFD')`), busca en `commonName`, `scientificName` y `otherNames`. Resultados como opciones de radio (76 px): miniatura, nombre común, científico en cursiva, `ToxicityBadge sm` (peor nivel, **incluye** `no-toxica` aquí para que se pueda comparar). Al final, botón punteado **«¿No está? Crear especie a confirmar»**: pide nombre común (obligatorio) y científico (opcional); crea `Species` con `status: 'por-confirmar'`, toxicidad `desconocida`, `kind` elegido (comestible/medicinal u ornamental), `lightNeed: 3` y un plan mínimo de riego cada 3 días. Texto: «Se guarda con toxicidad «desconocida» hasta que la completes.» Pie: «Siguiente: ubicación ›» (deshabilitado sin selección).

**Paso 3 · Ubicación.** «¿Dónde va a vivir?» Campo «Apodo (opcional)» (por defecto el nombre común). Opciones de radio por ubicación: nombre + «Interior · luz media» / «Exterior · sol directo en la mañana». Botón «+ Nueva ubicación» (abre el formulario de §8.9.1 en hoja). Debajo, según §6.5: caja verde «Buena elección: …» si la luz alcanza, o `WarnBox` «Esta ubicación probablemente es poco luminosa para esta planta» si no (no bloquea). Pie: «Crear planta».

**Resumen** (`/nueva-planta/listo/:id`). Cerrar → Jardín. Foto + apodo + «*científico* · Ubicación». **Si la especie es tóxica o de precaución:** `DangerBox` (rojo solo si alguno es `toxica`; si solo hay precaución, caja ámbar) con `role="alert"`, título «Planta tóxica: déjala fuera del alcance de mascotas y niños», badges por destinatario y las notas de toxicidad. **Plan de cuidados generado** (lista de §8.4, solo lectura) + «Puedes editarlo después». **Si la especie es comestible-medicinal:** `SafetyNotice context="preparacion"`. Botones: «Ver mi planta» y «Agregar otra planta». Al crear, se agrega una entrada de diario `hito` «Llegó a casa» con la foto (source `asistente`).

**CA**
- [ ] e2e `new-plant.spec.ts`: foto → buscar «mentha» → Poleo → Balcón → Crear: el resumen muestra la alerta de toxicidad y el aviso de seguridad; la planta aparece en Jardín con «Tóxica»; Hoy muestra «Revisar riego» del poleo hoy.
- [ ] Una especie creada «por confirmar» muestra «Toxicidad desconocida» en todas partes.
- [ ] Todo el asistente se completa con el pulgar: los botones de avance quedan en el pie.

### 8.6 Diario — `Diario.dc.html`, `EntradaEditor.dc.html`
**Lista:** título «Diario» + «N entradas desde {mes}»; buscar (texto y etiquetas) y «+ Entrada». Fila de `Chip` filtro por tipo (Todo, Observación, Cuidado, Problema, Cosecha, Preparación, Aprendizaje, Hito), desplazable en horizontal. Grupos por día («Hoy · martes 27», «Ayer · lunes 26», «Sábado 24», luego «12 de octubre»). Tarjeta: chip de tipo con ícono, planta(s), hora; texto; foto (150 px); etiquetas y clima si existen. Tocar → editor. Vacío: `EmptyState` variante `diario`.

**Editor** (`/diario/nueva` y `/diario/:id`): barra con «Cancelar», «Nueva entrada» / «Editar entrada» y fecha-hora (tocable para cambiarla). Campos:
- **Tipo**: cuadrícula 4 columnas de botones (68 px) con ícono; uno seleccionado (por defecto Observación, o `?tipo=`).
- **Fotos**: miniaturas 96 + «Agregar» (`PhotoPicker`, max 6).
- **¿Qué notaste?**: área de texto.
- **Plantas relacionadas**: chips eliminables + «+ Planta» (hoja con buscador y multiselección). Prellenado con `?planta=`.
- **Etiquetas**: `Chip` etiqueta + «+ Etiqueta» con autocompletar de etiquetas existentes. Minúsculas, sin `#`.
- **Anotar el clima** (switch, apagado por defecto): chips Soleado / Nublado / Lluvia + campo °C opcional. Manual: la app no consulta internet.
- Pie fijo: **«Guardar entrada»** (56). En edición, opción «Eliminar entrada» al final (con confirmación).
- Validación: debe haber texto **o** al menos una foto.

**CA**
- [ ] Una entrada con dos plantas aparece en «Su historia» de ambas.
- [ ] Los filtros por tipo y la búsqueda funcionan juntos.

### 8.7 Registro rápido — `RegistroRapido.dc.html`, `ProtoFoto.dc.html`
Tocar `Fab` abre la hoja (`?registro=1`); el `Fab` se convierte en botón cerrar (tinta, ×) en la misma posición. Opciones de 80 px:
1. **Foto rápida** (destacada, fondo terracota suave): «Dispara y listo. Va al diario de la planta.» → `/foto-rapida`.
2. **Nota rápida**: «Una línea ahora; la ordenas después.» → hoja con área de texto con foco automático, chips de planta sugerida (misma regla que la foto) y «Guardar» (crea `observacion`, source `nota-rapida`). Enlace «Más detalles» → editor completo con lo escrito.
3. **Regué**: «Marca qué plantas regaste y cómo estaba la tierra.» → hoja con las plantas que tienen ítem de riego (primero las atrasadas y de hoy) con casillas; selector opcional de estado de la tierra para todas; «Guardar» resuelve `regue` en cada una (§6.4) y muestra «Riego registrado en N plantas».

**Cámara de Foto rápida** (`/foto-rapida`): ver §9.1.

### 8.8 Ficha de especie — `FichaEspecie.dc.html`
Solo lectura. Botón atrás + «Herbario · Ficha de especie». Foto/ilustración + nombre común (Young Serif 30), científico en cursiva, «Familia {X} · {origen}», «También: {otros nombres}». Si `status === 'por-confirmar'`: chip «Por confirmar» y texto «Completa esta ficha cuando sepas más».

- **Toxicidad** (caja con borde rojo si algún nivel es tóxica; ámbar si precaución; neutro si no): fila «Personas» + `ToxicityBadge md` + nota; fila «Mascotas» + badge + nota. Siempre las dos filas.
- **Cuidados base**: cuadrícula 2×2 (Luz, Riego, Temperatura, Humedad) con ícono y texto.
- **Partes que se usan**: caja neutra.
- **Precauciones**: lista.
- **`SafetyNotice context="planta"`** (siempre presente en la ficha).
- **Mis plantas de esta especie**: filas con miniatura, apodo, ubicación y `Chip` estado → detalle. Si no hay: «Aún no tienes esta especie.»
- **Fuentes**: lista o «[Fuente por definir] · Cada ficha guarda sus fuentes: así el libro podrá citarlas.»
- `NavBar` con Herbario activo + `Fab`.

### 8.9 Ajustes y respaldo — `Ajustes.dc.html`
Botón atrás → Hoy. Secciones:
- **Tu casa:** Zona («Zona central de Chile · hemisferio sur», solo lectura en v0.1); Ubicaciones → `/ajustes/ubicaciones`; Mascotas en casa (switch; descripción «Destaca aún más las plantas tóxicas para ellas»).
- **Tema:** control segmentado Sistema / Claro / Oscuro + «El tamaño de letra sigue el de tu teléfono.»
- **Respaldo:** caja terracota «Último respaldo hace N días» / «Aún no tienes respaldo» + «Todo vive solo en este teléfono. Si se pierde, se pierde el jardín.»; **Exportar respaldo (.zip)** (primario); **Importar respaldo** (secundario); texto de ayuda. Detalle en §10.1.
- **Almacenamiento:** «X MB usados de ~Y disponible» (`navigator.storage.estimate()`), barra con fotos y datos, leyenda. Si `navigator.storage.persisted()` es falso, botón «Proteger mis datos» que llama a `persist()`.
- **Instalar en iPhone:** 4 pasos numerados: «Abre Herbario en **Safari**» · «Toca **Compartir**» (con ícono) · «Elige **Agregar a pantalla de inicio**» · «Toca **Agregar**. Listo: se abre como una app.» + «En Android: menú del navegador → Instalar app.» Si la app ya corre instalada (`display-mode: standalone` o `navigator.standalone`), mostrar «Herbario ya está instalada en este teléfono».
- Pie: «Herbario v{versión} · Funciona sin conexión.»

#### 8.9.1 Ubicaciones (sin maqueta)
Lista de `ListRow` con nombre y «Interior · luz media»; reordenar con botones subir/bajar (sin arrastrar). Formulario (hoja): Nombre, Interior/Exterior (segmentado), Luz (4 opciones de radio con la descripción de `lightScale`). Eliminar solo si no tiene plantas; si tiene, explicar «Mueve primero sus N plantas».

### 8.10 Herbario (sin maqueta salvo la ficha)
Encabezado «Herbario» + pestañas internas **Especies · Botiquín · Libro** (control segmentado de 3, Botiquín y Libro con etiqueta «pronto»).
- **Especies:** buscador + lista con el patrón de la tarjeta de jardín sin foto grande: nombre común, científico, `ToxicityBadge sm` (peor nivel, incluye no tóxica) y «N plantas» si tienes. Por confirmar primero, con su chip.
- **Botiquín** y **Libro**: `EmptyState variant="pronto"` («Esto viene pronto · Mientras tanto, registra en el diario tus cosechas y preparaciones: serán la base de esta sección.» → «Ir al diario»).

### 8.11 Aprender (próximamente)
`ScreenHeader` «Aprender» + `EmptyState variant="pronto"`.

---

## 9. Flujos clave (con prototipo)

### 9.1 Foto rápida — 3 toques, menos de 15 segundos (`ProtoFoto.dc.html`)
```
Toque 1: «+»            → hoja Registro rápido
Toque 2: «Foto rápida»  → cámara a pantalla completa, planta sugerida ya elegida
Toque 3: obturador      → foto guardada, vuelta a la pantalla anterior con aviso
```
**Cámara (`/foto-rapida`)** — fondo siempre oscuro (#0B0D0A) en ambos temas:
- Arriba: cerrar (48, fondo blanco 14 %) + «Foto rápida».
- Visor: `getUserMedia({ video: { facingMode: { ideal: 'environment' } }, audio: false })` en un `<video playsinline muted autoplay>`, radio 22, líneas de tercios al 18 %. Etiqueta «Mismo ángulo que la última vez» (PUEDE: superponer la última foto de esa planta al 25 % de opacidad como guía).
- «¿De qué planta? · sugerida por tu última foto» + fila desplazable de chips (44 px). **Planta sugerida:** la de `?planta=`; si no, `Settings.lastPhotoPlantId`; si no, la última planta con entrada en el diario. Luego el resto por actividad reciente. Última opción: «Sin planta».
- Abajo: miniatura de la última foto (abre galería del sistema → mismo flujo de guardado), obturador de 80 px (anillo de 5 px + círculo de 62), espacio vacío a la derecha.
- **Al disparar:** capturar el cuadro del video en un `canvas` (o `ImageCapture.takePhoto()` donde exista), procesar (§10.3), guardar `Photo` + `JournalEntry { type: 'observacion', text: '', photoIds: [id], plantIds: [planta], source: 'foto-rapida' }`, actualizar `lastPhotoPlantId`, volver atrás y mostrar aviso: «Foto guardada en el diario de {planta}.» con «Agregar nota» (→ editor de esa entrada) y «Listo».
- **Respaldo de cámara:** si `getUserMedia` no existe, se niega el permiso o falla, abrir `<input type="file" accept="image/*" capture="environment">` en su lugar. En iOS esto suma el toque «Usar foto» del sistema; es aceptable como respaldo, no como camino principal.
- Detener las pistas del `MediaStream` al salir de la ruta.

**CA**
- [ ] e2e `quick-photo.spec.ts` (con `--use-fake-device-for-media-stream`): 3 toques desde Hoy crean 1 foto y 1 entrada vinculada a la planta sugerida; el aviso aparece.
- [ ] Desde el detalle del Tomillo, la cámara abre con Tomillo elegido.
- [ ] Medido en un iPhone real: desde tocar «+» hasta ver el aviso, menos de 15 s (objetivo: menos de 6 s).
- [ ] Probado en iPhone con la app instalada en la pantalla de inicio (modo standalone): el permiso de cámara funciona y, si se niega, se usa el respaldo.

### 9.2 Revisar riego desde Hoy (`ProtoRiego.dc.html`)
```
Hoy → botón gota en la tarjeta → hoja «Revisar riego»
    → (opcional) elegir estado de la tierra → el consejo y el botón recomendado cambian
    → Regué | No necesitaba | Mañana
    → hoja se cierra → tarjeta cambia de estado → aviso con «Deshacer»
```
- La tarjeta resuelta queda visible en su grupo como «hecha» (Regué) o pasa a «Próximos 3 días» (No necesitaba / Mañana) hasta el siguiente render del día.
- Lógica completa en §6.4. Textos en §8.2.

---

## 10. Datos en el teléfono: respaldo, almacenamiento, fotos y PWA

### 10.1 Respaldo `.zip`
**Exportar:**
```
herbario-respaldo-2026-10-27.zip
├── manifest.json   { "app": "herbario", "appVersion": "0.1.0", "schemaVersion": 1,
│                     "exportedAt": "...", "counts": { "plants": 8, "journal": 42, "photos": 37 } }
├── data.json       { locations, species, plants, carePlan, journal, settings, photos: [metadatos sin blob] }
└── photos/
    ├── {id}.jpg
    └── {id}_thumb.jpg
```
- Generar con `jszip` (`compression: 'STORE'` para fotos JPEG, `DEFLATE` para JSON).
- Entregar con `navigator.share({ files: [file] })` si `navigator.canShare({ files })` es verdadero (en iPhone permite «Guardar en Archivos» o iCloud); si no, descarga con `<a download>`.
- Al completar (`share` resuelto o descarga iniciada) → `Settings.lastBackupAt = ahora` y aviso «Respaldo listo. Guárdalo fuera del teléfono.».
- Mostrar progreso si hay más de 20 fotos.

**Importar:**
- `<input type="file" accept=".zip,application/zip">`.
- Validar: `manifest.app === 'herbario'`, `schemaVersion <= actual` (aplicar migraciones si es menor), JSON bien formado, cada `photoId` referenciado tiene su archivo. Si falla: «Este archivo no es un respaldo de Herbario» o el detalle concreto; no tocar datos.
- Mostrar resumen («Respaldo del 23 de septiembre · 8 plantas · 42 entradas · 37 fotos») y confirmar con un botón destructivo: **«Reemplazar todo»** (texto: «Se borrará lo que hay ahora en este teléfono»).
- Reemplazar dentro de **una** transacción Dexie (`clear` + `bulkAdd` en todas las tablas). Si falla, nada cambia.

**CA**
- [ ] Prueba de ida y vuelta: exportar con datos demo → borrar base → importar → todo idéntico (incluido el contenido de las fotos, comparando tamaño y hash).
- [ ] Importar un zip corrupto no modifica la base.

### 10.2 Almacenamiento
- Llamar a `navigator.storage.persist()` al guardar la primera planta o foto.
- Ajustes muestra `estimate()` y el desglose: fotos = suma de `Photo.bytes`; datos = uso total − fotos.
- Si `QuotaExceededError` al guardar: aviso «No queda espacio para fotos. Exporta un respaldo y borra fotos antiguas desde el diario.» Sin perder el texto de la entrada.

### 10.3 Procesamiento de fotos (`media/imageProcessing.ts`)
- Decodificar con `createImageBitmap(file, { imageOrientation: 'from-image' })` (respeta la orientación EXIF).
- Foto: lado mayor 1600 px, JPEG calidad 0,82. Miniatura: lado mayor 400 px, JPEG 0,72.
- Al re-codificar se eliminan los metadatos EXIF (incluida la ubicación GPS): es deseable por privacidad.
- Procesar fuera del hilo principal si es posible (`OffscreenCanvas` en un worker); si no está disponible, en el hilo principal mostrando «Guardando…».
- Las listas usan siempre la miniatura; la foto grande solo en vista completa. Liberar `URL.createObjectURL` al desmontar.

### 10.4 PWA
- **Manifest:** `name: "Herbario"`, `short_name: "Herbario"`, `lang: "es-CL"`, `start_url: "/hoy"`, `scope: "/"`, `display: "standalone"`, `orientation: "portrait"`, `background_color: "#F7F4EC"`, `theme_color: "#2C5A2A"`, íconos 192, 512 y 512 maskable. Ícono provisorio: hoja de línea blanca sobre `#2C5A2A` (el definitivo queda pendiente, §14).
- **iOS:** `<link rel="apple-touch-icon" href="/icons/apple-touch-icon-180.png">`, `<meta name="apple-mobile-web-app-capable" content="yes">`, `<meta name="apple-mobile-web-app-status-bar-style" content="default">`, `viewport-fit=cover` y márgenes con `env(safe-area-inset-*)`.
- **Service worker:** precachear el app shell, fuentes e íconos. Sin caché de red en tiempo de ejecución (no hay red). Con una versión nueva, aviso «Hay una versión nueva de Herbario» + «Actualizar».
- **Offline:** la app completa funciona en modo avión desde la segunda carga.
- No mostrar banner propio de instalación en v0.1: las instrucciones viven en Ajustes.

---

## 11. Accesibilidad, tono y textos

### 11.1 Accesibilidad (DEBE)
- Contraste AA en todos los textos (ver tokens; no crear combinaciones nuevas sin medirlas).
- Objetivos táctiles ≥ 44×44; separación mínima de 8 px entre objetivos vecinos.
- Elementos nativos: `<button>`, `<a href>`, `<input>` + `<label>`, `<fieldset>`/`<legend>` en grupos de opciones. Nada de `div` con `onClick`.
- Hojas y diálogos: `role="dialog"`, `aria-modal="true"`, título enlazado, foco atrapado y devuelto al cerrar.
- Avisos: `role="status"`; alerta de toxicidad en el resumen: `role="alert"`.
- Toda información de color también va en texto o ícono (toxicidad, atrasada, estados).
- Pruebas con VoiceOver en iPhone para los dos flujos de §9, y `axe` sin violaciones serias en todas las rutas.
- Con texto del sistema al 200 %, ninguna pantalla recorta texto ni oculta botones (se permite desplazamiento).

### 11.2 Tono
- Tuteo, frases cortas, verbos concretos. Explica el porqué en una línea («La superficie engaña: lo que importa está abajo.»).
- Nunca regañar ni culpar: «Atrasada 1 día», no «¡Olvidaste regar!». Los estados vacíos enseñan algo.
- Nada de signos de exclamación dobles, ni emoji, ni tono «místico».
- Español de Chile neutro y cercano: «living», «balcón», «maceta», «plantín», «feria».

### 11.3 Formatos
- Fecha larga: «Martes 27 de octubre» (mayúscula inicial). Fecha corta: «27 oct». Día corto: «mié 28». Hora: «10:42».
- Relativos: «hoy», «ayer», «hace N días», «mañana».
- Números: coma decimal, «18 °C», «186 MB».

### 11.4 Glosario para la interfaz y el código
| Término en la app | Significado | En código |
|---|---|---|
| Revisar riego | Comprobar la humedad con el dedo antes de regar | `riego` |
| Despuntar | Cortar las puntas para que ramifique | `poda` |
| Ahilado | Tallos largos y débiles por falta de luz | (texto) |
| En observación | Planta con algo raro que se está siguiendo | `observacion` |
| En recuperación | Planta que se está reponiendo de un problema | `recuperacion` |
| Plantín | Planta joven recién trasplantada | `plantin` |
| Ya no está | Planta que murió o se regaló; queda su historia | `perdida` |
| Especie por confirmar | Especie creada por la usuaria, sin datos verificados | `por-confirmar` |

---

## 12. Hitos y definición de terminado

Cada hito: código + pruebas + revisión visual contra las maquetas en 390×844, claro y oscuro.

| Hito | Contenido | Definición de terminado |
|---|---|---|
| **M0 · Base** | Vite + React + TS, ESLint/Prettier, Vitest, Playwright, CSS Modules, tokens, fuentes autoalojadas, router con todas las rutas vacías, `NavBar`, tema claro/oscuro/sistema | `npm run build` sin errores; navegar entre las 5 pestañas; cambiar tema funciona |
| **M1 · Componentes** | `src/ui/` completo (§7) + íconos + `/dev/componentes` | Cada componente con todas sus variantes en claro y oscuro en `/dev/componentes`, coincide con `Componentes.dc.html`; axe sin violaciones |
| **M2 · Datos** | Esquema Dexie, seeds, repositorios, `domain/` (estaciones, programación, luz, toxicidad) + `/dev/seed` | Pruebas unitarias de §6.3–6.7 pasando, incluidos cambios de estación y ajuste de riego |
| **M3 · Jardín** | Mi jardín, Detalle de planta, Ficha de especie, Herbario › Especies, editor de plan | CA de §8.3, §8.4 y §8.8 |
| **M4 · Hoy** | Hoy, Revisar riego, deshacer, aviso de respaldo, estado vacío | CA de §8.1 y §8.2; e2e `water-check` |
| **M5 · Registrar** | Registro rápido, cámara de Foto rápida, procesamiento de fotos, Nota rápida, Regué múltiple, Diario y editor | CA de §8.6, §8.7 y §9.1; e2e `quick-photo` |
| **M6 · Nueva planta** | Asistente completo + especie por confirmar + ubicaciones | CA de §8.5; e2e `new-plant` |
| **M7 · Ajustes y PWA** | Ajustes, ubicaciones, respaldo export/import, almacenamiento, manifest, service worker, íconos | CA de §10.1; Lighthouse sin errores de instalabilidad; funciona en modo avión |
| **M8 · Pulido y QA** | Accesibilidad, textos, rendimiento, prueba en iPhone real | Checklist de §13.3 completo |

---

## 13. Pruebas

### 13.1 Unitarias (Vitest) — mínimo
- `seasonFor`: límites 31 ago/1 sep, 30 nov/1 dic, 28-29 feb/1 mar, 31 may/1 jun.
- `generatePlan`: interior vs exterior, `onlyInterior`, ítems pausados por estación.
- `resolveTask`: los 4 resultados, ajuste aprendido, mínimo de 1 día, deshacer.
- `groupTasks`: atrasadas, hoy, próximos 3 días, exclusión de plantas «Ya no está».
- `needsLightWarning` y descarte por ubicación.
- `worstTox` y reglas de visualización.
- `backup`: validación de manifest, ida y vuelta.

### 13.2 End-to-end (Playwright, 390×844, claro y oscuro)
`water-check.spec.ts`, `quick-photo.spec.ts`, `new-plant.spec.ts`, `backup.spec.ts`, `a11y.spec.ts` (axe en todas las rutas con datos demo).

### 13.3 Checklist manual en iPhone (M8)
- [ ] Instalar desde Safari con las instrucciones de Ajustes.
- [ ] Modo avión: abrir, registrar una foto y una nota, revisar un riego.
- [ ] Foto rápida en menos de 15 s, a pleno sol, con una mano.
- [ ] Texto del sistema en el tamaño más grande: nada se recorta.
- [ ] VoiceOver: completar Revisar riego y Foto rápida.
- [ ] Exportar respaldo a Archivos e importarlo de vuelta.
- [ ] Modo oscuro del sistema y forzado desde Ajustes.

---

## 14. Pendientes y decisiones abiertas

| Tema | Estado | Qué hacer en v0.1 |
|---|---|---|
| Número de teléfono del CITUC en `SafetyNotice` | Falta el dato | Dejar `[NÚMERO]` en `copy/es-CL.ts` con un `TODO`; la autora lo completa |
| Fuentes de cada especie | Vacías | Mostrar «[Fuente por definir]»; no inventar |
| Catálogo de especies (cuidados y toxicidad) | Borrador sin verificar (`verified: false`) | Usar tal cual; no agregar especies nuevas sin pedirlo |
| Nombre definitivo «Herbario» e ícono de la app | Provisorios | Ícono temporal descrito en §10.4 |
| Galería de fotos de una planta | Sin maqueta | PUEDE: cuadrícula simple de miniaturas; si no, v0.2 |
| Superposición de la última foto en la cámara | Idea | PUEDE (§9.1) |
| Pantallas sin maqueta: Herbario › Especies, Ubicaciones, editor de plan | Especificadas en texto | Seguir los patrones de las pantallas existentes |
| Notificaciones / recordatorios | Fuera de alcance | No implementar |

---

## Anexo A · Correspondencia maqueta → componente

| Maqueta (`design/artboards/`) | Pantalla en código | Componentes principales |
|---|---|---|
| `Hoy`, `HoyVacio` | `screens/Hoy` | `ScreenHeader`, `SeasonBanner`, `CareTaskCard`, `EmptyState`, `Fab`, `NavBar` |
| `RevisarRiego` | `screens/Hoy/WaterCheckSheet` | `BottomSheet`, `SoilOption`, `InfoBox`, `ToxicityBadge`, `Toast` |
| `Jardin` | `screens/Jardin` | `Chip` (filtro, estado), `ToxicityBadge`, `PlantThumb` |
| `DetallePlanta` | `screens/PlantDetail` | `WarnBox`, `Chip`, `ToxicityBadge`, `TimelineItem` |
| `Nueva*` | `screens/NewPlant` | `WizardHeader`, `PhotoPicker`, `ToxicityBadge`, `DangerBox`, `SafetyNotice` |
| `Diario`, `EntradaEditor` | `screens/Diario`, `screens/EntryEditor` | `Chip`, `PhotoPicker`, `Switch`, `TextArea` |
| `RegistroRapido`, `ProtoFoto` | `screens/QuickPhoto` + hoja de registro | `BottomSheet`, `Toast` |
| `FichaEspecie` | `screens/SpeciesDetail` | `ToxicityBadge`, `SafetyNotice` |
| `Ajustes` | `screens/Settings` | `ListRow`, `Switch`, `SegmentedControl` |
