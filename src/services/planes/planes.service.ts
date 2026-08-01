import { AxiosResponse } from 'axios';
import axios from '../../config/axios';

export type PlanPago = {
  id: number;
  monto_total: number;
  cuotas: number;
  monto_cuota: number;
  cuotas_pagadas: number;
  estado: string;
  notas: string | null;
  cliente?: { id: number; nombre: string; cedula: string };
  factura?: { id: number; anio_mes?: string } | null;
};

export const getPlanes = async (params?: { id_cliente?: number; estado?: string }) => {
  const { data }: AxiosResponse<{ resultado: PlanPago[] }> = await axios.get('/api/planes-pago', {
    params,
  });
  return data.resultado;
};

export const createPlan = async (payload: {
  id_cliente: number;
  id_factura?: number | null;
  monto_total: number;
  cuotas: number;
  notas?: string;
}) => {
  const { data } = await axios.post('/api/planes-pago', payload);
  return data as PlanPago;
};

export const updatePlan = async (id: number, accion: 'marcar_cuota' | 'cancelar') => {
  const { data } = await axios.put(`/api/planes-pago/${id}`, { accion });
  return data as PlanPago;
};
