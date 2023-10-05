import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import Customer from "../pages/Customer";
import { SignIn } from "../pages/auth/SingIn";



export const router = createBrowserRouter([
    {
      path: "/",
      element: <Home/>,
    },
    {
      path: "clientes",
      element: <Customer/>,
    },
    {
      path: "login",
      element: <SignIn/>,
    }
]);