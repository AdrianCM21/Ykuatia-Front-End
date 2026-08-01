import { AxiosResponse } from 'axios';
import axios from '../../config/axios';

export type EventoAuditoria = {
  id: number;
  created_at: string;
  accion: string;
  entidad: string;
  entidad_id: number | null;
  detalle: string | null;
  usuario?: { id: number; Nombre: string; email: string } | null;
};

export const getEventos = async (params: {
  page?: number;
  q?: string;
  entidad?: string;
  entidadId?: number;
  limit?: number;
}) => {
  const { data }: AxiosResponse<{ resultado: EventoAuditoria[]; total: number }> = await axios.get(
    '/api/auditoria',
    { params }
  );
  return data;
};
