import { createBrowserRouter, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import Customer from "../pages/Customer/Customer.page";
import { SignIn } from "../pages/auth/SingIn";
import { isAuthenticated } from "../services/auth/auth";
import { Invoices } from "../pages/Invoices/Invoices.page";
import { MapsMainScreen } from "../pages/mapas/MapsMainScreen";
import { Pagos } from "../pages/pagos/Pagos.page";
import { EstadisticaPage } from "../pages/estadisticas/Estadistica.page";
import { CajaPage } from "../pages/caja/Caja.page";


export const router = createBrowserRouter([
  {
    path: '/',
    element: isAuthenticated() ? <Home /> : <Navigate to="/login" />,
  },
  {
    path:'/pagos',
    element: isAuthenticated() ? <Pagos /> : <Navigate to="/login" />,
  },
  {
    path: 'estadisticas',
    element: isAuthenticated() ? <EstadisticaPage/> : <Navigate to="/login" />,
  },
  {
    path: 'clientes',
    element: isAuthenticated() ? <Customer /> : <Navigate to="/login" />,
  },
  {
    path: 'facturas',
    element: isAuthenticated() ? <Invoices /> : <Navigate to="/login" />,
  },
  {
    path: 'caja',
    element: isAuthenticated() ? <CajaPage /> : <Navigate to="/login" />,
  },
  {
    path: 'login',
    element: !isAuthenticated() ? <SignIn /> : <Navigate to="/" />,
  },
  {
    path: 'mapas',
    element: isAuthenticated() ? <MapsMainScreen /> : <Navigate to="/login" />,
  }
]);