import { createBrowserRouter, Navigate } from 'react-router-dom';

import { MainLayout } from './ui/MainLayout/MainLayout';
import { Hoy } from './screens/Hoy';
import { Jardin } from './screens/Jardin';
import { PlantDetail } from './screens/PlantDetail';
import { NewPlant } from './screens/NewPlant';
import { Diario } from './screens/Diario';
import { EntryEditor } from './screens/EntryEditor';
import { QuickPhoto } from './screens/QuickPhoto';
import { Species } from './screens/Species';
import { SpeciesDetail } from './screens/SpeciesDetail';
import { ComingSoon } from './screens/ComingSoon';
import { Settings } from './screens/Settings';
import { SettingsLocations } from './screens/Settings/Locations';
import { DevComponentes } from './dev/DevComponentes';
import { DevSeed } from './dev/DevSeed';

// Rutas de HANDOFF.md §8. Las 5 secciones principales viven bajo
// `MainLayout` (con NavBar); el resto es pantalla completa, sin NavBar.
export const router = createBrowserRouter([
  {
    path: '/',
    children: [
      { index: true, element: <Navigate to="/hoy" replace /> },
      {
        element: <MainLayout />,
        children: [
          { path: 'hoy', element: <Hoy /> },
          { path: 'jardin', element: <Jardin /> },
          { path: 'diario', element: <Diario /> },
          { path: 'aprender', element: <ComingSoon variant="aprender" /> },
          { path: 'herbario/especies', element: <Species /> },
          { path: 'herbario/botiquin', element: <ComingSoon variant="botiquin" /> },
          { path: 'herbario/libro', element: <ComingSoon variant="libro" /> },
        ],
      },
      { path: 'jardin/:plantId', element: <PlantDetail /> },
      { path: 'nueva-planta', element: <NewPlant /> },
      { path: 'nueva-planta/listo/:plantId', element: <NewPlant /> },
      { path: 'diario/nueva', element: <EntryEditor /> },
      { path: 'diario/:entryId', element: <EntryEditor /> },
      { path: 'foto-rapida', element: <QuickPhoto /> },
      { path: 'herbario/especies/:speciesId', element: <SpeciesDetail /> },
      { path: 'ajustes', element: <Settings /> },
      { path: 'ajustes/ubicaciones', element: <SettingsLocations /> },
      ...(import.meta.env.DEV
        ? [
            { path: 'dev/componentes', element: <DevComponentes /> },
            { path: 'dev/seed', element: <DevSeed /> },
          ]
        : []),
    ],
  },
]);
