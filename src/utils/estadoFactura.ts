const LABELS: Record<string, string> = {
  'pendiente a pago': 'Pendiente de pago',
  'parcialmente pagado': 'Pago parcial',
  'pendiente a carga de consumo': 'Pendiente de consumo',
  pagado: 'Pagada',
};

export const labelEstadoFactura = (estado: string): string => LABELS[estado] || estado;
