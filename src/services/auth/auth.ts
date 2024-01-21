import axios from "../../config/axios";
import { AxiosResponse } from "axios";
import ILoginData from "../../interfaces/auth/ILoginData";
import { toast } from "react-toastify";
import {jwtDecode} from "jwt-decode";
const login = async (data:ILoginData) => {
  try {
    const response: AxiosResponse = await axios.post('/api/login', data);
      toast.success('Inicio de sesión correcta');
      console.log(response.data)
      localStorage.setItem('x-token', response.data);

    return response;
  } catch (error:any) {
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
    if(!accessToken){
      return false
    }else{
      console.log(jwtDecode(accessToken))
      const rol=jwtDecode(accessToken)
      //@ts-ignore
      if(rol.rol==='admin'){
        return true
      }
      return false
    }

  };

const isCampo =()=>{
  const accessToken = localStorage.getItem('x-token');
    if(!accessToken){
      return false
    }else{
      console.log(jwtDecode(accessToken))
      const rol=jwtDecode(accessToken)
      //@ts-ignore
      if(rol.rol==='admin'|| rol.rol==='agente de campo'){
        return true
      }
      return false
    }

}

export {login,logout,isCampo, isAuthenticated}