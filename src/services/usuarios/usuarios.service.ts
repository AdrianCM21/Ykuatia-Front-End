import { AxiosResponse } from 'axios';
import axios from '../../config/axios';

export type UsuarioAdmin = {
  id: number;
  email: string;
  Nombre: string;
  rol: { id_rol: number; descripcion: string };
};

export type CreateUsuarioPayload = {
  email: string;
  password: string;
  Nombre: string;
  rol: string;
};

export type UpdateUsuarioPayload = {
  email?: string;
  Nombre?: string;
  rol?: string;
};

export const getUsuarios = async (): Promise<UsuarioAdmin[]> => {
  const { data }: AxiosResponse<UsuarioAdmin[]> = await axios.get('/api/usuarios');
  return data;
};

export const createUsuario = async (payload: CreateUsuarioPayload): Promise<UsuarioAdmin> => {
  const { data }: AxiosResponse<UsuarioAdmin> = await axios.post('/api/usuarios', payload);
  return data;
};

export const updateUsuario = async (
  id: number,
  payload: UpdateUsuarioPayload
): Promise<UsuarioAdmin> => {
  const { data }: AxiosResponse<UsuarioAdmin> = await axios.put(`/api/usuarios/${id}`, payload);
  return data;
};

export const resetUsuarioPassword = async (id: number, password: string) => {
  const { data } = await axios.put(`/api/usuarios/${id}/password`, { password });
  return data;
};

export const deleteUsuario = async (id: number) => {
  const { data } = await axios.delete(`/api/usuarios/${id}`);
  return data;
};
