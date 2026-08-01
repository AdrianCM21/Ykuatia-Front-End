/** Saldo pendiente de una factura (usa `saldo` si viene del API). */
export const facturaSaldo = (f: {
  monto: number;
  monto_pagado?: number;
  saldo?: number;
}): number =>
  f.saldo != null
    ? Number(f.saldo)
    : Math.max(0, Number(f.monto) - Number(f.monto_pagado || 0));
