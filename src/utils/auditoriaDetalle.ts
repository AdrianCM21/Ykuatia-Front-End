export type DetalleParsed = Record<string, unknown>;

const LABELS: Record<string, string> = {
  monto: 'Monto',
  abonoFactura: 'Abono a factura',
  mora: 'Mora',
  saldoRestante: 'Saldo restante',
  estado: 'Estado',
  clienteId: 'Cliente',
  idPlan: 'Plan',
  idTransaccion: 'Movimiento',
  idFactura: 'Factura',
  idCliente: 'Cliente',
  montoTotal: 'Monto total',
  cuotas: 'Cuotas',
  cuotasPagadas: 'Cuotas pagadas',
  origen: 'Origen',
  montoMovimiento: 'Monto del movimiento',
  montoPagado: 'Monto pagado',
};

const formatValue = (key: string, value: unknown): string => {
  if (value == null || value === '') return '—';
  if (typeof value === 'boolean') return value ? 'Sí' : 'No';
  if (
    typeof value === 'number' ||
    (typeof value === 'string' &&
      /^(monto|abono|mora|saldo|precio)/i.test(key) &&
      !Number.isNaN(Number(value)))
  ) {
    const n = Number(value);
    if (
      /^(monto|abono|mora|saldo|precio)/i.test(key) &&
      !Number.isNaN(n)
    ) {
      return `${n.toLocaleString('es-PY')} Gs`;
    }
    return String(value);
  }
  if (typeof value === 'object') {
    try {
      return JSON.stringify(value);
    } catch {
      return String(value);
    }
  }
  return String(value);
};

export const parseDetalleAuditoria = (
  detalle: string | DetalleParsed | null | undefined
): DetalleParsed | null => {
  if (detalle == null || detalle === '') return null;
  if (typeof detalle === 'object') return detalle;
  try {
    const parsed = JSON.parse(detalle);
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return parsed as DetalleParsed;
    }
    return { valor: parsed };
  } catch {
    return { texto: detalle };
  }
};

export const entriesDetalleAuditoria = (
  detalle: string | DetalleParsed | null | undefined
): Array<{ key: string; label: string; value: string }> => {
  const parsed = parseDetalleAuditoria(detalle);
  if (!parsed) return [];
  return Object.entries(parsed).map(([key, value]) => ({
    key,
    label: LABELS[key] || key.replace(/_/g, ' '),
    value: formatValue(key, value),
  }));
};

/** Resumen corto para grilla (1–2 datos clave). */
export const resumenDetalleAuditoria = (
  accion: string,
  detalle: string | DetalleParsed | null | undefined
): string => {
  const entries = entriesDetalleAuditoria(detalle);
  if (!entries.length) return '—';

  const pick = (...keys: string[]) =>
    entries.filter((e) => keys.includes(e.key)).map((e) => `${e.label}: ${e.value}`);

  if (accion.includes('pago_revertido')) {
    const parts = pick('abonoFactura', 'estado');
    return parts.join(' · ') || entries.slice(0, 2).map((e) => e.value).join(' · ');
  }
  if (accion.includes('pago') || accion.includes('plan')) {
    const parts = pick('abonoFactura', 'monto', 'cuotasPagadas', 'estado', 'saldoRestante');
    return parts.slice(0, 2).join(' · ') || entries.slice(0, 2).map((e) => `${e.label}: ${e.value}`).join(' · ');
  }

  return entries
    .slice(0, 2)
    .map((e) => `${e.label}: ${e.value}`)
    .join(' · ');
};

export const labelAccionAuditoria = (accion: string): string => {
  const map: Record<string, string> = {
    'factura.pago': 'Cobro de factura',
    'factura.pago_revertido': 'Reverso de abono',
    'plan.crear': 'Alta de plan',
    'plan.cuota': 'Cuota de plan',
    'plan.cancelar': 'Cancelación de plan',
    'caja.cierre': 'Cierre de caja',
    'caja.reabrir': 'Reapertura de caja',
  };
  return map[accion] || accion.replace(/\./g, ' · ');
};
