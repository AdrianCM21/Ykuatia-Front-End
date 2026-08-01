import axios from '../../config/axios';
import { AxiosResponse } from 'axios';
import ILoginData from '../../interfaces/auth/ILoginData';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';
import { JwtPayload } from '../../interfaces/auth/JwtPayload';
import { TOKEN_KEY } from '../../config/authStorage';

const loginRequest = async (data: ILoginData): Promise<string | null> => {
  try {
    const response: AxiosResponse<string> = await axios.post('/api/login', data);
    toast.success('Inicio de sesión correcta');
    return response.data;
  } catch (error: unknown) {
    const status = (error as { response?: { status?: number } })?.response?.status;
    if (status === 401) {
      toast.error('No estás autorizado para acceder a esta página');
    } else {
      toast.error('Hubo un error al iniciar sesión');
    }
    return null;
  }
};

/** @deprecated Prefer useAuth().login */
const login = async (data: ILoginData) => {
  const token = await loginRequest(data);
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
    return { status: 200, data: token };
  }
  return { status: 401 };
};

const clearToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

/** @deprecated Prefer useAuth().logout */
const logout = () => {
  clearToken();
};

const getPayload = (): JwtPayload | null => {
  const accessToken = localStorage.getItem(TOKEN_KEY);
  if (!accessToken) {
    return null;
  }
  try {
    return jwtDecode<JwtPayload>(accessToken);
  } catch {
    return null;
  }
};

const isAuthenticated = () => {
  const payload = getPayload();
  return payload?.rol === 'admin';
};

const isCampo = () => {
  const payload = getPayload();
  return payload?.rol === 'admin' || payload?.rol === 'agente de campo';
};

const isAloneCampo = () => {
  const payload = getPayload();
  return payload?.rol === 'agente de campo';
};

export {
  login,
  loginRequest,
  logout,
  clearToken,
  isCampo,
  isAuthenticated,
  isAloneCampo,
};
