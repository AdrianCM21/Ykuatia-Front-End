import { createBrowserRouter, Navigate } from 'react-router-dom';
import Home from '../pages/Home';
import Customer from '../pages/Customer/Customer.page';
import { SignIn } from '../pages/login/SingIn';
import { Invoices } from '../pages/Invoices/Invoices.page';
import { MapsMainScreen } from '../pages/mapas/MapsMainScreen';
import { Pagos } from '../pages/pagos/Pagos.page';
import { EstadisticaPage } from '../pages/estadisticas/Estadistica.page';
import { CajaPage } from '../pages/caja/Caja.page';
import { ConfiguracionesPage } from '../pages/configuraciones/Configuraciones.page';
import { UsuariosPage } from '../pages/usuarios/Usuarios.page';
import { MorososPage } from '../pages/morosos/Morosos.page';
import { AuditoriaPage } from '../pages/auditoria/Auditoria.page';
import { CampoPage } from '../pages/campo/compo.page';
import { MapsMainScreenMovil } from '../pages/campo/mapas/MapsMainScreen';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ProtectedRoute requireCampo redirectCampoTo="/campo/factura">
        <Home />
      </ProtectedRoute>
    ),
  },
  {
    path: '/pagos',
    element: (
      <ProtectedRoute requirePerm="pagos">
        <Pagos />
      </ProtectedRoute>
    ),
  },
  {
    path: 'estadisticas',
    element: (
      <ProtectedRoute requirePerm="estadisticas">
        <EstadisticaPage />
      </ProtectedRoute>
    ),
  },
  {
    path: 'clientes',
    element: (
      <ProtectedRoute requirePerm="clientes">
        <Customer />
      </ProtectedRoute>
    ),
  },
  {
    path: 'facturas',
    element: (
      <ProtectedRoute requirePerm="facturas">
        <Invoices />
      </ProtectedRoute>
    ),
  },
  {
    path: 'caja',
    element: (
      <ProtectedRoute requirePerm="caja">
        <CajaPage />
      </ProtectedRoute>
    ),
  },
  {
    path: 'login',
    element: (
      <ProtectedRoute requireGuest>
        <SignIn />
      </ProtectedRoute>
    ),
  },
  {
    path: 'mapas',
    element: (
      <ProtectedRoute requirePerm="mapas">
        <MapsMainScreen />
      </ProtectedRoute>
    ),
  },
  {
    path: 'campo/factura',
    element: (
      <ProtectedRoute requireCampo>
        <CampoPage />
      </ProtectedRoute>
    ),
  },
  {
    path: 'campo/mapa',
    element: (
      <ProtectedRoute requireCampo>
        <MapsMainScreenMovil />
      </ProtectedRoute>
    ),
  },
  {
    path: 'configuracion',
    element: (
      <ProtectedRoute requirePerm="config">
        <ConfiguracionesPage />
      </ProtectedRoute>
    ),
  },
  {
    path: 'usuarios',
    element: (
      <ProtectedRoute requirePerm="usuarios">
        <UsuariosPage />
      </ProtectedRoute>
    ),
  },
  {
    path: 'morosos',
    element: (
      <ProtectedRoute requirePerm="morosos">
        <MorososPage />
      </ProtectedRoute>
    ),
  },
  {
    path: 'auditoria',
    element: (
      <ProtectedRoute requirePerm="auditoria">
        <AuditoriaPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
