import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Alert,
  TextField,
  FormControlLabel,
  Switch,
  Chip,
  Stack,
  IconButton,
  Checkbox,
  LinearProgress,
  alpha,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { format } from 'date-fns';
import { useEffect, useMemo, useState } from 'react';
import ICustomer from '../../../interfaces/customers/Customer';
import { labelEstadoFactura } from '../../../utils/estadoFactura';
import { getPlanes, PlanPago } from '../../../services/planes/planes.service';
import { formatGs } from '../../../utils/formatGs';
import { facturaSaldo } from '../../../utils/facturaSaldo';

type FacturaCobro = {
  id: number;
  Fecha_emicion: string;
  anio_mes?: string;
  monto: number;
  monto_pagado?: number;
  estado: string;
  saldo?: number;
  recargo?: number;
  fecha_vencimiento?: string;
};

export type PagoFormValues = {
  id: number;
  factura: Array<{
    id: number;
    checked: boolean;
    monto: number;
    incluirMora: boolean;
    id_plan: number | null;
  }>;
};

type RowState = {
  id: number;
  checked: boolean;
  monto: number;
  incluirMora: boolean;
  id_plan: number | null;
};

interface FormDialogProps {
  data: ICustomer | undefined;
  open: boolean;
  loading: boolean;
  onClose: () => void;
  onSubmit: (data: PagoFormValues) => void;
}

const resolvePlanForFactura = (facturaId: number, planes: PlanPago[]): PlanPago | null => {
  const byFactura = planes.find((p) => p.factura?.id === facturaId);
  if (byFactura) return byFactura;
  if (planes.length === 1) return planes[0];
  return null;
};

const suggestedMonto = (saldo: number, plan: PlanPago | null) => {
  if (!plan) return saldo;
  return Math.min(saldo, Number(plan.monto_cuota) || saldo);
};

const estadoChipColor = (
  estado: string
): 'default' | 'warning' | 'info' | 'success' | 'error' => {
  if (estado === 'parcialmente pagado') return 'info';
  if (estado === 'pendiente a pago') return 'warning';
  if (estado === 'pagado') return 'success';
  return 'default';
};

const buildRows = (data: ICustomer | undefined, planes: PlanPago[]): RowState[] => {
  const facturas = (data?.factura || []) as FacturaCobro[];
  return facturas.map((factura) => {
    const plan = resolvePlanForFactura(factura.id, planes);
    const saldo = facturaSaldo(factura);
    return {
      id: factura.id,
      checked: false,
      monto: suggestedMonto(saldo, plan),
      incluirMora: false,
      id_plan: plan?.id ?? null,
    };
  });
};

export const PagoForm = ({ data, loading, open, onClose, onSubmit }: FormDialogProps) => {
  const [confirming, setConfirming] = useState(false);
  const [planes, setPlanes] = useState<PlanPago[]>([]);
  const [rows, setRows] = useState<RowState[]>([]);
  const facturas = (data?.factura ?? []) as FacturaCobro[];

  useEffect(() => {
    if (!open || !data?.id) return;
    setConfirming(false);
    let cancelled = false;

    (async () => {
      let activos: PlanPago[] = [];
      try {
        activos = await getPlanes({ id_cliente: data.id, estado: 'activo' });
      } catch {
        activos = [];
      }
      if (cancelled) return;
      setPlanes(activos);
      setRows(buildRows(data, activos));
    })();

    return () => {
      cancelled = true;
    };
  }, [open, data?.id]);

  const planActivo = planes[0] || null;
  const deudaTotal = useMemo(
    () => facturas.reduce((acc, f) => acc + facturaSaldo(f), 0),
    [facturas]
  );

  const selectedRows = rows.filter((r) => r.checked);
  const selectedCount = selectedRows.length;

  const subtotalAbonos = selectedRows.reduce((acc, row) => acc + Number(row.monto || 0), 0);
  const subtotalMora = selectedRows.reduce((acc, row) => {
    if (!row.incluirMora) return acc;
    const factura = facturas.find((f) => f.id === row.id);
    return acc + Number(factura?.recargo || 0);
  }, 0);
  const total = subtotalAbonos + subtotalMora;

  const planProgress = planActivo
    ? Math.min(100, (Number(planActivo.cuotas_pagadas) / Number(planActivo.cuotas || 1)) * 100)
    : 0;

  const updateRow = (id: number, patch: Partial<RowState>) => {
    setConfirming(false);
    setRows((prev) => prev.map((row) => (row.id === id ? { ...row, ...patch } : row)));
  };

  const toggleRow = (factura: FacturaCobro, checked: boolean) => {
    const plan = resolvePlanForFactura(factura.id, planes);
    const saldo = facturaSaldo(factura);
    updateRow(factura.id, {
      checked,
      monto: checked ? suggestedMonto(saldo, plan) : facturaSaldo(factura),
      id_plan: plan?.id ?? null,
      incluirMora: checked ? false : false,
    });
  };

  const selectAll = () => {
    setConfirming(false);
    setRows((prev) =>
      prev.map((row) => {
        const factura = facturas.find((f) => f.id === row.id);
        if (!factura) return { ...row, checked: true };
        const plan = resolvePlanForFactura(factura.id, planes);
        return {
          ...row,
          checked: true,
          monto: suggestedMonto(facturaSaldo(factura), plan),
          id_plan: plan?.id ?? null,
        };
      })
    );
  };

  const clearAll = () => {
    setConfirming(false);
    setRows((prev) => prev.map((row) => ({ ...row, checked: false, incluirMora: false })));
  };

  const handleSubmit = () => {
    if (!selectedCount || !data) return;
    if (!confirming) {
      setConfirming(true);
      return;
    }
    onSubmit({
      id: data.id ?? 0,
      factura: rows,
    });
  };

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          overflow: 'hidden',
          border: '1px solid',
          borderColor: 'divider',
        },
      }}
    >
      <Box
        sx={{
          px: 3,
          pt: 2.5,
          pb: 2,
          background:
            'linear-gradient(135deg, rgba(11,110,110,0.10) 0%, rgba(31,78,121,0.08) 55%, rgba(232,242,242,0.9) 100%)',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography variant="overline" color="text.secondary" letterSpacing={1}>
              Cobrar a
            </Typography>
            <Typography variant="h5">{data?.nombre || 'Cliente'}</Typography>
            <Typography variant="body2" color="text.secondary">
              CI {data?.cedula || '—'} · deuda {formatGs(deudaTotal)}
            </Typography>
          </Box>
          <IconButton onClick={onClose} disabled={loading} size="small" aria-label="Cerrar">
            <CloseIcon />
          </IconButton>
        </Stack>

        {planActivo && (
          <Box
            sx={{
              mt: 2,
              px: 1.5,
              py: 1.25,
              borderRadius: 2,
              bgcolor: alpha('#1F4E79', 0.06),
            }}
          >
            <Stack direction="row" justifyContent="space-between" mb={0.75}>
              <Typography variant="body2">
                Plan: cuota de <strong>{formatGs(planActivo.monto_cuota)}</strong>
              </Typography>
              <Typography variant="body2" fontWeight={700}>
                {planActivo.cuotas_pagadas}/{planActivo.cuotas}
              </Typography>
            </Stack>
            <LinearProgress
              variant="determinate"
              value={planProgress}
              sx={{ height: 8, borderRadius: 99 }}
            />
            <Typography variant="caption" color="text.secondary" display="block" mt={0.75}>
              Al cobrar, se marca 1 cuota del plan automáticamente.
            </Typography>
          </Box>
        )}
      </Box>

      <DialogContent sx={{ px: 3, pt: 2.5, pb: 1 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1.5}>
          <Typography fontWeight={700}>1. Elegí qué facturas cobrar</Typography>
          <Stack direction="row" spacing={1}>
            <Button size="small" onClick={selectAll} disabled={loading || !facturas.length}>
              Todas
            </Button>
            <Button size="small" onClick={clearAll} disabled={loading || !selectedCount}>
              Ninguna
            </Button>
          </Stack>
        </Stack>

        <Alert severity="info" sx={{ mb: 2 }}>
          Marcá la factura, revisá el monto y tocá <strong>Cobrar</strong>. Si hay plan, el monto
          sugiere la cuota.
        </Alert>

        {confirming && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            Vas a cobrar <strong>{formatGs(total)}</strong> ({selectedCount} factura
            {selectedCount === 1 ? '' : 's'}). Tocá otra vez <strong>Confirmar cobro</strong>.
          </Alert>
        )}

        <Stack spacing={1.25}>
          {facturas.map((factura) => {
            const row = rows.find((r) => r.id === factura.id);
            if (!row) return null;

            const saldo = facturaSaldo(factura);
            const recargo = Number(factura.recargo || 0);
            const plan = resolvePlanForFactura(factura.id, planes);
            const periodo =
              factura.anio_mes || format(new Date(factura.Fecha_emicion), 'MM/yyyy');
            const restante = Math.max(0, saldo - Number(row.monto || 0));

            return (
              <Box
                key={factura.id}
                sx={{
                  border: '1px solid',
                  borderColor: row.checked ? 'primary.main' : 'divider',
                  bgcolor: row.checked ? alpha('#0B6E6E', 0.04) : 'background.paper',
                  borderRadius: 2,
                  px: 2,
                  py: 1.5,
                }}
              >
                <Stack direction="row" spacing={1.5} alignItems="flex-start">
                  <Checkbox
                    checked={row.checked}
                    disabled={loading}
                    onChange={(e) => toggleRow(factura, e.target.checked)}
                    sx={{ mt: 0.25 }}
                  />
                  <Box flex={1} minWidth={0}>
                    <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" mb={0.5}>
                      <Typography fontWeight={700}>{periodo}</Typography>
                      <Chip
                        size="small"
                        label={labelEstadoFactura(factura.estado)}
                        color={estadoChipColor(factura.estado)}
                        variant="outlined"
                      />
                      {plan && (
                        <Chip size="small" color="secondary" variant="outlined" label="Con plan" />
                      )}
                    </Stack>
                    <Typography variant="body2" color="text.secondary">
                      Factura #{factura.id}
                      {factura.fecha_vencimiento
                        ? ` · vence ${format(new Date(factura.fecha_vencimiento), 'dd/MM/yyyy')}`
                        : ''}
                    </Typography>
                    <Typography variant="body2" mt={0.25}>
                      Saldo: <strong>{formatGs(saldo)}</strong>
                      {recargo > 0 ? ` · mora posible ${formatGs(recargo)}` : ''}
                    </Typography>

                    {row.checked && (
                      <Box
                        mt={1.5}
                        pt={1.5}
                        borderTop="1px solid"
                        borderColor="divider"
                      >
                        <Typography variant="body2" fontWeight={600} mb={1}>
                          2. Monto a cobrar
                        </Typography>
                        <Stack
                          direction={{ xs: 'column', sm: 'row' }}
                          spacing={1}
                          alignItems={{ sm: 'center' }}
                        >
                          <TextField
                            label="Monto"
                            type="number"
                            size="small"
                            value={row.monto}
                            disabled={loading}
                            inputProps={{ min: 1, max: saldo, step: 1 }}
                            onChange={(e) => {
                              const value = Number(e.target.value);
                              updateRow(factura.id, {
                                monto: Number.isFinite(value) ? value : 0,
                              });
                            }}
                            sx={{ width: { xs: '100%', sm: 160 } }}
                          />
                          {plan && (
                            <Button
                              size="small"
                              variant="outlined"
                              disabled={loading}
                              onClick={() =>
                                updateRow(factura.id, {
                                  monto: suggestedMonto(saldo, plan),
                                })
                              }
                            >
                              Usar cuota ({formatGs(plan.monto_cuota)})
                            </Button>
                          )}
                          <Button
                            size="small"
                            variant="outlined"
                            disabled={loading}
                            onClick={() => updateRow(factura.id, { monto: saldo })}
                          >
                            Cobrar todo
                          </Button>
                          {recargo > 0 && (
                            <FormControlLabel
                              control={
                                <Switch
                                  size="small"
                                  checked={row.incluirMora}
                                  disabled={loading}
                                  onChange={(e) =>
                                    updateRow(factura.id, { incluirMora: e.target.checked })
                                  }
                                />
                              }
                              label={`Sumar mora (${formatGs(recargo)})`}
                            />
                          )}
                        </Stack>
                        {row.monto > 0 && row.monto < saldo && (
                          <Typography variant="caption" color="text.secondary" display="block" mt={1}>
                            Quedará pendiente {formatGs(restante)}
                            {plan ? ' · avanza 1 cuota del plan' : ''}.
                          </Typography>
                        )}
                        {row.monto > saldo && (
                          <Typography variant="caption" color="error" display="block" mt={1}>
                            El monto no puede superar el saldo ({formatGs(saldo)}).
                          </Typography>
                        )}
                      </Box>
                    )}
                  </Box>
                </Stack>
              </Box>
            );
          })}

          {!facturas.length && (
            <Alert severity="info">Este cliente no tiene facturas cobrables.</Alert>
          )}
        </Stack>
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          py: 2,
          borderTop: '1px solid',
          borderColor: 'divider',
          bgcolor: alpha('#0B6E6E', 0.03),
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 1.5,
        }}
      >
        <Box>
          <Typography variant="caption" color="text.secondary">
            {selectedCount
              ? `${selectedCount} factura${selectedCount === 1 ? '' : 's'} · abono ${formatGs(subtotalAbonos)}${
                  subtotalMora > 0 ? ` + mora ${formatGs(subtotalMora)}` : ''
                }`
              : 'Seleccioná al menos una factura'}
          </Typography>
          <Typography variant="h5" lineHeight={1.2} color="primary.dark">
            Total {formatGs(total)}
          </Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          <Button onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button
            loading={loading}
            variant="contained"
            disabled={
              !selectedCount ||
              loading ||
              selectedRows.some((r) => {
                const factura = facturas.find((f) => f.id === r.id);
                const saldo = factura ? facturaSaldo(factura) : 0;
                return !(r.monto > 0) || r.monto > saldo + 0.009;
              })
            }
            size="large"
            onClick={handleSubmit}
          >
            {confirming ? 'Confirmar cobro' : 'Cobrar'}
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
};
