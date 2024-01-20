import { createBrowserRouter, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import Customer from "../pages/Customer";
import { SignIn } from "../pages/auth/SingIn";
import { isAuthenticated } from "../services/auth/auth";
import { Invoices } from "../pages/Invoices";
import { MapsMainScreen } from "../pages/mapas/MapsMainScreen";


export const router = createBrowserRouter([
  {
    path: '/',
    element: isAuthenticated() ? <Home /> : <Navigate to="/login" />,
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
    path: 'login',
    element: !isAuthenticated() ? <SignIn /> : <Navigate to="/" />,
  },
  {
    path: 'mapas',
    element: isAuthenticated() ? <MapsMainScreen /> : <Navigate to="/login" />,
  }
]);