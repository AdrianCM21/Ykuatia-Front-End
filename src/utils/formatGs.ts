export const formatGs = (value: number | string | null | undefined): string =>
  `${Number(value || 0).toLocaleString('es-PY')} Gs`;
