interface ITipoCaja {
  id: number;
  id_tipo_ingreso?: number;
  descripcion: string;
}

export interface ICaja {
  id: number;
  motivo: string;
  fecha: string;
  monto: number;
  delete: boolean;
  tipo_ingreso: ITipoCaja;
  factura?: { id: number } | null;
}

export interface ICajaResponose {
  resultado: ICaja[];
  total: number;
  page?: number;
  limit?: number;
}
