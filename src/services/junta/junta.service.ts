import { AxiosResponse } from 'axios';
import axios from '../../config/axios';
import { assertPdfBlob, createPdfObjectUrl } from '../../utils/downloadBlob';

export type JuntaConfig = {
  id: number;
  nombre: string;
  slogan: string;
  direccion: string;
  telefono: string;
  email: string;
  pie_boleta: string;
  pie_recibo: string;
  color_primario: string;
  color_secundario: string;
  logo_principal: string | null;
  logo_secundario: string | null;
  logo_principal_url?: string | null;
  logo_secundario_url?: string | null;
  margen_mm?: number;
  mostrar_timbrado?: boolean;
  timbrado?: string;
  ruc?: string;
  nro_boleta_actual?: number;
  dias_gracia?: number;
  mora_pct?: number;
  plantilla_boleta?: string;
  /** a4 | oficio */
  papel_boleta?: string;
  /** 2 | 4 — plantilla básica */
  boletas_por_pagina?: number;
  version: number;
};

export const getJunta = async (): Promise<JuntaConfig> => {
  const { data }: AxiosResponse<JuntaConfig> = await axios.get('/api/junta');
  return data;
};

export const updateJunta = async (payload: Partial<JuntaConfig>): Promise<JuntaConfig> => {
  const { data }: AxiosResponse<JuntaConfig> = await axios.put('/api/junta', payload);
  return data;
};

export const uploadJuntaLogo = async (
  file: File,
  tipo: 'principal' | 'secundario'
): Promise<JuntaConfig> => {
  const form = new FormData();
  form.append('logo', file);
  form.append('tipo', tipo);
  const { data }: AxiosResponse<JuntaConfig> = await axios.post('/api/junta/logo', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

export const removeJuntaLogo = async (
  tipo: 'principal' | 'secundario'
): Promise<JuntaConfig> => {
  const { data }: AxiosResponse<JuntaConfig> = await axios.delete('/api/junta/logo', {
    params: { tipo },
  });
  return data;
};

const draftForPreview = (draft: Partial<JuntaConfig>) => ({
  nombre: draft.nombre,
  slogan: draft.slogan,
  direccion: draft.direccion,
  telefono: draft.telefono,
  email: draft.email,
  pie_boleta: draft.pie_boleta,
  pie_recibo: draft.pie_recibo,
  color_primario: draft.color_primario,
  color_secundario: draft.color_secundario,
  logo_principal: draft.logo_principal,
  logo_secundario: draft.logo_secundario,
  margen_mm: draft.margen_mm,
  mostrar_timbrado: draft.mostrar_timbrado,
  timbrado: draft.timbrado,
  ruc: draft.ruc,
  plantilla_boleta: draft.plantilla_boleta,
  papel_boleta: draft.papel_boleta,
  boletas_por_pagina: draft.boletas_por_pagina,
});

/** Genera la boleta de ejemplo y devuelve un object URL para embeber (sin descargar). */
export const previewBoleta = async (draft: Partial<JuntaConfig>): Promise<string> => {
  const { data: blob } = await axios.post('/api/junta/boleta-preview', draftForPreview(draft), {
    responseType: 'blob',
  });
  const pdf = await assertPdfBlob(blob);
  return createPdfObjectUrl(pdf);
};
