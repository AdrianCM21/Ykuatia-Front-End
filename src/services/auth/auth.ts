import axios from "../../config/axios";
import { AxiosResponse } from "axios";
import ILoginData from "../../interfaces/auth/ILoginData";
import { toast } from "react-toastify";
const login = async (data:ILoginData) => {
  try {
    const response: AxiosResponse = await axios.post('/api/login', data);
      toast.success('Inicio de sesión correcta');
      console.log(response)
      localStorage.setItem('x-token', response.data.token);
    return response;
  } catch (error) {
    //@ts-ignore
    if (error.response && error.response.status === 401) {
      toast.error('No estás autorizado para acceder a esta página');
      return error
    } else {
      toast.error('Hubo un error al iniciar sesión');
    }
  }
  };
const logout = () => {
    localStorage.removeItem('x-token');
  };
  
const isAuthenticated = () => {
    const accessToken = localStorage.getItem('x-token');
    return !!accessToken; 
  };

export {login,logout, isAuthenticated}