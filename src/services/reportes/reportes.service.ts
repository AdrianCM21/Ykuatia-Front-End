import { AxiosResponse } from 'axios';
import axios from '../../config/axios';
import { downloadBlob } from '../../utils/downloadBlob';

export type MorosoBucket = '0-30' | '31-60' | '61-90' | '90+';

export type Moroso = {
  id_cliente: number;
  nombre: string;
  cedula: string;
  telefono: string;
  nro_medidor: string | null;
  monto_deuda: number;
  recargo_estimado?: number;
  facturas_pendientes: number;
  factura_mas_antigua: string;
  fecha_vencimiento?: string;
  dias_mora: number;
  bucket: MorosoBucket;
};

export type MorososResumen = {
  total_clientes: number;
  deuda_total: number;
  recargo_total: number;
  por_bucket: Record<MorosoBucket, { clientes: number; deuda: number }>;
};

export type DashboardData = {
  desde: string;
  hasta: string;
  kpis: {
    cobradoPeriodo: number;
    deudaTotal: number;
    recargoEstimado: number;
    facturasAbiertas: number;
    cobradoMesActual: number;
    cobradoMesAnterior: number;
    variacionMesPct: number | null;
  };
  serieCobranza: Array<{ periodo: string; total: number }>;
  cobranzaPorBucket: Array<{ bucket: string; monto: number }>;
  topMorosos: Moroso[];
};

export type ReporteResumen = {
  desde: string;
  hasta: string;
  cobranzaPct: number;
  totalFacturado: number;
  totalRecaudado: number;
  totalPendiente: number;
  m3Consumidos: number;
  ingresos: number;
  egresos: number;
  saldo: number;
  morosos: number;
  seriesMensuales: Array<{ mes: string; facturado: number; cobrado: number; m3: number }>;
};

export const getMorosos = async (params: {
  page?: number;
  q?: string;
  bucket?: string;
  limit?: number;
}) => {
  const { data }: AxiosResponse<{
    resultado: Moroso[];
    total: number;
    resumen: MorososResumen;
  }> = await axios.get('/api/reportes/morosos', { params });
  return data;
};

export const exportMorososCsv = async (params: { q?: string; bucket?: string }) => {
  const { data: blob } = await axios.get('/api/reportes/morosos/export.csv', {
    params,
    responseType: 'blob',
  });
  downloadBlob(new Blob([blob], { type: 'text/csv;charset=utf-8' }), 'morosos.csv');
};

export const getReporteResumen = async (params: { desde?: string; hasta?: string }) => {
  const { data }: AxiosResponse<ReporteResumen> = await axios.get('/api/reportes/resumen', {
    params,
  });
  return data;
};

export const getDashboard = async (params: { desde?: string; hasta?: string }) => {
  const { data }: AxiosResponse<DashboardData> = await axios.get('/api/reportes/dashboard', {
    params,
  });
  return data;
};
