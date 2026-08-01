export type AppPerm =
  | 'pagos'
  | 'clientes'
  | 'clientes_write'
  | 'facturas'
  | 'caja'
  | 'morosos'
  | 'estadisticas'
  | 'mapas'
  | 'config'
  | 'usuarios'
  | 'auditoria'
  | 'planes_write';

const PRESIDENTE = new Set<AppPerm>([
  'pagos',
  'clientes',
  'clientes_write',
  'facturas',
  'caja',
  'morosos',
  'estadisticas',
  'mapas',
  'config',
  'usuarios',
  'auditoria',
  'planes_write',
]);

const TESORERO = new Set<AppPerm>([
  'pagos',
  'clientes',
  'facturas',
  'caja',
  'morosos',
  'estadisticas',
  'mapas',
  'auditoria',
  'planes_write',
]);

const CAJERO = new Set<AppPerm>(['pagos', 'clientes', 'facturas', 'planes_write']);

export const isOfficeRole = (rol: string | null | undefined) =>
  rol === 'admin' ||
  rol === 'presidente' ||
  rol === 'tesorero' ||
  rol === 'cajero';

export const isPresidenteRole = (rol: string | null | undefined) =>
  rol === 'admin' || rol === 'presidente';

export const can = (rol: string | null | undefined, perm: AppPerm): boolean => {
  if (!rol) return false;
  if (rol === 'admin' || rol === 'presidente') return PRESIDENTE.has(perm);
  if (rol === 'tesorero') return TESORERO.has(perm);
  if (rol === 'cajero') return CAJERO.has(perm);
  return false;
};
