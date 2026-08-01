import axios from '../../config/axios';
import { AxiosResponse } from 'axios';
import paginationNro from '../../config/paginationNro';
import {
  IInvoiceCargaConsumoResponse,
  IInvoiceResponose,
} from '../../interfaces/invoices/IIncoiceResponse';
import { toast } from 'react-toastify';
import { assertPdfBlob, downloadBlob, openBlob } from '../../utils/downloadBlob';

export type InvoiceListParams = {
  page?: number;
  q?: string;
  limit?: number;
};

export const getInvoices = async (params: InvoiceListParams | number = 1) => {
  const page = typeof params === 'number' ? params : params.page ?? 1;
  const q = typeof params === 'number' ? undefined : params.q;
  const limit =
    typeof params === 'number' ? paginationNro.paginationNro : params.limit ?? paginationNro.paginationNro;

  const { data: response }: AxiosResponse<IInvoiceResponose> = await axios.get('/api/facturas', {
    params: { page, limit, q: q || undefined },
  });
  return response;
};

export const downloadInvoice = async (id: number): Promise<void> => {
  try {
    const { data: blob, status } = await axios.get(`/api/facturas/descargar`, {
      params: { id },
      responseType: 'blob',
      validateStatus: (s) => s < 400 || s === 404,
    });
    if (status === 404) {
      toast.info('No tiene facturas pendientes');
      return;
    }
    const pdf = await assertPdfBlob(blob);
    downloadBlob(pdf, 'boleta.pdf');
    toast.success('Descarga exitosa');
  } catch (error: any) {
    toast.error(error?.message || 'Error al descargar boleta');
    return Promise.reject(error);
  }
};

export const downloadInvoices = async (): Promise<void> => {
  try {
    const { data: blob } = await axios.get('/api/facturas/descargar', { responseType: 'blob' });
    const pdf = await assertPdfBlob(blob);
    downloadBlob(pdf, 'boletas.pdf');
    toast.success('Descarga exitosa');
  } catch (error: any) {
    toast.error(error?.message || 'Error al descargar boletas');
    return Promise.reject(error);
  }
};

export const downloadRecibo = async (ids: number[]): Promise<void> => {
  try {
    const { data: blob } = await axios.get('/api/facturas/recibo', {
      params: { ids: ids.join(',') },
      responseType: 'blob',
    });
    const pdf = await assertPdfBlob(blob);
    downloadBlob(pdf, 'recibo.pdf');
    openBlob(pdf);
  } catch (error: any) {
    toast.error(error?.message || 'Error al descargar recibo');
    return Promise.reject(error);
  }
};

export const generarMes = async () => {
  const { data } = await axios.post('/api/facturas/generar-mes');
  return data as { message: string; generadas: number; omitidas: number };
};

export const checkInvoices = async (): Promise<boolean> => {
  try {
    const { data: response }: AxiosResponse<IInvoiceResponose> = await axios.get('/api/facturas', {
      params: { page: 1, limit: 30, q: 'pendiente a carga' },
    });
    return response.resultado.some((invoice) => invoice.estado === 'pendiente a carga de consumo');
  } catch {
    return false;
  }
};

export const envioConsumo = async (
  id: number,
  consumo: number
): Promise<IInvoiceCargaConsumoResponse> => {
  const response: AxiosResponse<IInvoiceCargaConsumoResponse> = await axios.post(
    `/api/facturas/${id}`,
    { consumo }
  );
  toast.success('Consumo enviado');
  return response.data;
};

export type PagoItem = {
  id: number;
  monto?: number;
  incluirMora?: boolean;
  id_plan?: number | null;
};

export type MovimientoPago = {
  id: number;
  motivo: string;
  fecha: string;
  monto: number;
  factura?: {
    id: number;
    anio_mes?: string;
    cliente?: { id: number; nombre: string; cedula: string };
  } | null;
  plan?: { id: number; cuotas: number; cuotas_pagadas: number } | null;
};

export const pagos = async (pagosList: PagoItem[]) => {
  const response = await axios.post(`/api/facturapagos`, { pagos: pagosList });
  toast.success('Pago registrado');
  return response.data as { message: string; pagadas: number[] };
};

export const listMovimientosPago = async (params?: { id_cliente?: number; limit?: number }) => {
  const { data }: AxiosResponse<{ resultado: MovimientoPago[] }> = await axios.get(
    '/api/facturapagos/movimientos',
    { params }
  );
  return data.resultado;
};

export const revertirAbono = async (id_transaccion: number) => {
  const { data } = await axios.post('/api/facturapagos/revertir', { id_transaccion });
  toast.success('Abono revertido');
  return data;
};
