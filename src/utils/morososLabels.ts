export type MorosoBucket = '0-30' | '31-60' | '61-90' | '90+';

export type MorosoNivel = {
  bucket: MorosoBucket | '';
  label: string;
  hint: string;
  color: 'default' | 'warning' | 'error' | 'success' | 'info';
};

/** Niveles de atraso desde la fecha de vencimiento (no desde la emisión). */
export const NIVELES_MORA: MorosoNivel[] = [
  {
    bucket: '',
    label: 'Todos',
    hint: 'Clientes con al menos una factura vencida',
    color: 'default',
  },
  {
    bucket: '0-30',
    label: 'Reciente',
    hint: 'Hasta 30 días después del vencimiento',
    color: 'info',
  },
  {
    bucket: '31-60',
    label: 'Atención',
    hint: 'Entre 31 y 60 días vencidos',
    color: 'warning',
  },
  {
    bucket: '61-90',
    label: 'Grave',
    hint: 'Entre 61 y 90 días vencidos',
    color: 'error',
  },
  {
    bucket: '90+',
    label: 'Crítico',
    hint: 'Más de 90 días vencidos',
    color: 'error',
  },
];

export const labelBucketMora = (bucket: string): string =>
  NIVELES_MORA.find((n) => n.bucket === bucket)?.label || bucket;

export const chipColorBucket = (
  bucket: string
): 'default' | 'warning' | 'error' | 'info' | 'success' =>
  NIVELES_MORA.find((n) => n.bucket === bucket)?.color || 'default';
