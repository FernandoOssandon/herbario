# Referencias de diseño

Estos archivos `.dc.html` son la fuente del lienzo de diseño «Herbario» (dirección B · «Pleno sol»). **No son código de producción**: son maquetas HTML con una capa de plantillas propia. Úsalos para leer valores exactos (tamaños, espaciados, colores, textos, orden de elementos), no para copiarlos tal cual.

## Cómo leerlos

- Todo el estilo está en atributos `style="…"` en línea. Los valores `{{t.algo}}` son colores del tema: búscalos en el objeto `L` (claro) o `D` (oscuro) dentro del `<script type="text/x-dc">` al final del archivo; equivalen a las variables de `tokens.css`.
- `<dc-import name="CareTaskCard" … >` monta otro artboard como componente; sus atributos son las props (en kebab-case → camelCase).
- `<sc-for>` repite y `<sc-if>` condiciona; los datos salen de `renderVals()`.
- Cada pantalla tiene una prop `dark` que cambia al tema oscuro.

## Mapa

| Archivo | Qué es | HANDOFF |
|---|---|---|
| `Estilos.dc.html` | Paleta, tipografía, íconos (rutas SVG), espaciado | §5 |
| `Componentes.dc.html` | Hoja con todas las variantes | §7 |
| `ToxicityBadge`, `Chip`, `CareTaskCard`, `SeasonBanner`, `SafetyNotice`, `EmptyState`, `TimelineItem`, `PhotoPicker`, `NavBar` | Componentes individuales con sus props | §7 |
| `Hoy`, `HoyVacio` | Pantalla 1 | §8.1 |
| `RevisarRiego` | Pantalla 2 (hoja inferior) | §8.2 |
| `Jardin` | Pantalla 3 | §8.3 |
| `DetallePlanta` | Pantalla 4 | §8.4 |
| `NuevaFoto`, `NuevaEspecie`, `NuevaUbicacion`, `NuevaResumen` | Pantalla 5 (asistente) | §8.5 |
| `Diario`, `EntradaEditor` | Pantalla 6 | §8.6 |
| `RegistroRapido` | Pantalla 7 | §8.7 |
| `FichaEspecie` | Pantalla 8 | §8.8 |
| `Ajustes` | Pantalla 9 | §8.9 |
| `ProtoRiego`, `ProtoFoto` | Prototipos con comportamiento real (estado, transiciones, textos de confirmación) | §9 |

Los íconos: copia las rutas `<path>` de `Estilos.dc.html` (sección «Íconos») a `src/ui/icons.tsx`. Cuadrícula de 24, trazo 2, puntas y uniones redondeadas, `stroke="currentColor"`, `fill="none"`.
