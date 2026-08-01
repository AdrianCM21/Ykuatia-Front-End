import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  ReactNode,
} from 'react';
import { jwtDecode } from 'jwt-decode';
import { JwtPayload } from '../interfaces/auth/JwtPayload';
import ILoginData from '../interfaces/auth/ILoginData';
import { loginRequest } from '../services/auth/auth';
import { TOKEN_KEY } from '../config/authStorage';
import { AppPerm, can as canPerm, isOfficeRole, isPresidenteRole } from '../utils/permissions';

type AuthContextValue = {
  token: string | null;
  rol: string | null;
  juntaId: number | null;
  isAdmin: boolean;
  isCampo: boolean;
  isAloneCampo: boolean;
  isAuthenticated: boolean;
  can: (perm: AppPerm) => boolean;
  login: (data: ILoginData) => Promise<{ ok: boolean; isAloneCampo: boolean }>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const readToken = (): string | null => localStorage.getItem(TOKEN_KEY);

const decodePayload = (token: string | null): JwtPayload | null => {
  if (!token) {
    return null;
  }
  try {
    return jwtDecode<JwtPayload>(token);
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(() => readToken());

  const payload = useMemo(() => decodePayload(token), [token]);
  const rol = payload?.rol ?? null;
  const juntaId = payload?.juntaId ?? null;
  const isAdmin = isPresidenteRole(rol);
  const isCampo = isOfficeRole(rol) || rol === 'agente de campo';
  const isAloneCampo = rol === 'agente de campo';
  const isAuthenticated = isOfficeRole(rol);

  const can = useCallback((perm: AppPerm) => canPerm(rol, perm), [rol]);

  const login = useCallback(async (data: ILoginData) => {
    const newToken = await loginRequest(data);
    if (!newToken) {
      return { ok: false, isAloneCampo: false };
    }
    localStorage.setItem(TOKEN_KEY, newToken);
    setToken(newToken);
    const decoded = decodePayload(newToken);
    return {
      ok: true,
      isAloneCampo: decoded?.rol === 'agente de campo',
    };
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
  }, []);

  const value = useMemo(
    () => ({
      token,
      rol,
      juntaId,
      isAdmin,
      isCampo,
      isAloneCampo,
      isAuthenticated,
      can,
      login,
      logout,
    }),
    [token, rol, juntaId, isAdmin, isCampo, isAloneCampo, isAuthenticated, can, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};
