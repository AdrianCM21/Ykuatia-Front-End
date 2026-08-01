import { AxiosResponse } from 'axios';
import axios from '../../config/axios';
import { ICaja, ICajaResponose } from '../../interfaces/caja/Caja';
import paginationNro from '../../config/paginationNro';
import { downloadBlob } from '../../utils/downloadBlob';

export type CajaListParams = {
  page?: number;
  q?: string;
  desdeFecha?: string;
  hastaFecha?: string;
  limit?: number;
};

export type CajaResumen = {
  ingresos: number;
  egresos: number;
  saldo: number;
};

export type CierreCaja = {
  id: number;
  periodo_tipo: 'dia' | 'mes';
  periodo: string;
  ingresos: number;
  egresos: number;
  saldo: number;
  activo: boolean;
  cerrado_en: string;
  reabierto_en: string | null;
  notas: string | null;
  usuario?: { Nombre: string } | null;
};

export const getCaja = async (params: CajaListParams = {}) => {
  const page = params.page ?? 1;
  const { data: response }: AxiosResponse<ICajaResponose> = await axios.get('/api/caja', {
    params: {
      page,
      limit: params.limit ?? paginationNro.paginationNro,
      q: params.q || undefined,
      desdeFecha: params.desdeFecha,
      hastaFecha: params.hastaFecha,
    },
  });
  return response;
};

export const getCajaResumen = async (params: {
  desdeFecha?: string;
  hastaFecha?: string;
}): Promise<CajaResumen> => {
  const { data }: AxiosResponse<CajaResumen> = await axios.get('/api/caja/resumen', { params });
  return data;
};

export const addCaja = async (data: Partial<ICaja> & Record<string, unknown>) => {
  const { data: response }: AxiosResponse<ICaja> = await axios.post('/api/caja', data);
  return response;
};

export const listCierres = async (page = 1) => {
  const { data }: AxiosResponse<{ resultado: CierreCaja[]; total: number }> = await axios.get(
    '/api/caja/cierres',
    { params: { page, limit: 20 } }
  );
  return data;
};

export const crearCierre = async (payload: {
  tipo: 'dia' | 'mes';
  periodo: string;
  notas?: string;
}) => {
  const { data }: AxiosResponse<CierreCaja> = await axios.post('/api/caja/cierres', payload);
  return data;
};

export const reabrirCierre = async (id: number) => {
  const { data }: AxiosResponse<CierreCaja> = await axios.post(`/api/caja/cierres/${id}/reabrir`);
  return data;
};

export const exportCierreCsv = async (id: number) => {
  const { data: blob } = await axios.get(`/api/caja/cierres/${id}/export.csv`, {
    responseType: 'blob',
  });
  downloadBlob(new Blob([blob], { type: 'text/csv;charset=utf-8' }), `cierre-${id}.csv`);
};
