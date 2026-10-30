# Spec Delta

## Purpose

Define el armazón de la aplicación: qué rutas existen, cómo se navega entre
ellas con la barra inferior, y cómo se elige y aplica el tema claro, oscuro o
según el sistema. Es la base sobre la que montan todas las pantallas de los
hitos siguientes (M1–M8).

## ADDED Requirements

### Requirement: Enrutamiento de pantallas

El sistema SHALL definir, con `react-router-dom` (`createBrowserRouter`), una
ruta para cada pantalla listada en HANDOFF.md §8, incluida la redirección de
`/` a `/hoy`, de modo que cada ruta resuelva en un componente de pantalla
(aunque su contenido sea un placeholder hasta los hitos M3–M8).

#### Scenario: Navegar directamente a una ruta válida
- **WHEN** la usuaria visita cualquiera de las rutas de HANDOFF.md §8 (por
  ejemplo `/jardin`, `/diario`, `/ajustes`)
- **THEN** la aplicación renderiza la pantalla correspondiente sin error de
  enrutamiento

#### Scenario: Redirección de la raíz
- **WHEN** la usuaria visita `/`
- **THEN** la aplicación redirige a `/hoy`

### Requirement: Navegación inferior entre las 5 secciones

El sistema SHALL mostrar una `NavBar` con 5 pestañas (Hoy, Jardín, Diario,
Aprender, Herbario) visible en las pantallas principales, que indique cuál
está activa y permita navegar a cualquiera de las otras cuatro.

#### Scenario: Cambiar de pestaña
- **WHEN** la usuaria toca una pestaña distinta a la activa
- **THEN** la aplicación navega a la ruta de esa sección y la pestaña tocada
  queda marcada como activa con `aria-current="page"`

#### Scenario: Pestaña "Aprender" marcada como próximamente
- **WHEN** la usuaria toca la pestaña "Aprender"
- **THEN** la aplicación navega a `/aprender` igual que cualquier otra
  pestaña, sin bloquear el toque

### Requirement: Selección de tema claro, oscuro o según el sistema

El sistema SHALL permitir elegir entre tema `system`, `light` y `dark`: con
`system` no fija ningún atributo de tema en `<html>` (se respeta
`prefers-color-scheme` del dispositivo); con `light` u `dark` fija
`document.documentElement.dataset.theme` al valor elegido y actualiza
`<meta name="theme-color">` al color correspondiente de HANDOFF.md §5.2.

#### Scenario: Elegir tema oscuro explícito
- **WHEN** la usuaria elige el tema "Oscuro"
- **THEN** `document.documentElement.dataset.theme` pasa a `"dark"` y
  `<meta name="theme-color">` pasa a `#0E110D`

#### Scenario: Elegir tema claro explícito
- **WHEN** la usuaria elige el tema "Claro"
- **THEN** `document.documentElement.dataset.theme` pasa a `"light"` y
  `<meta name="theme-color">` pasa a `#F7F4EC`

#### Scenario: Elegir tema según el sistema
- **WHEN** la usuaria elige el tema "Sistema"
- **THEN** la aplicación no fija `data-theme` en `<html>` y el aspecto sigue
  `prefers-color-scheme` del dispositivo
