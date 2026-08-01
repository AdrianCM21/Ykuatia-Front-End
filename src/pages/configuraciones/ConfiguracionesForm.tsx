import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  Box,
  Button,
  Grid,
  InputAdornment,
  Slider,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import HomeWorkOutlinedIcon from '@mui/icons-material/HomeWorkOutlined';
import WaterDropOutlinedIcon from '@mui/icons-material/WaterDropOutlined';
import CalculateOutlinedIcon from '@mui/icons-material/CalculateOutlined';
import { ITipoCliente } from '../../interfaces/configuracion/configuracion';

type TarifasForm = {
  precioFijo: number;
  precioPorLitro: number;
};

type Props = {
  loading: boolean;
  data: ITipoCliente[];
  onSubmit: (data: TarifasForm) => void;
};

const formatGs = (value: number) => `${Number(value || 0).toLocaleString('es-PY')} Gs`;

const pickTarifa = (data: ITipoCliente[], kind: 'fija' | 'variable') => {
  const byDesc = data.find((t) =>
    kind === 'fija'
      ? /fija/i.test(t.descripcion)
      : /variable|consumo|litro|m3|m³/i.test(t.descripcion)
  );
  if (byDesc) return Number(byDesc.tarifa || 0);
  if (kind === 'fija') return Number(data[0]?.tarifa || 0);
  return Number(data[1]?.tarifa || 0);
};

export const ConfiguracionesForm = ({ loading, data, onSubmit }: Props) => {
  const [ejemploM3, setEjemploM3] = useState(12);
  const { control, handleSubmit, reset, watch, formState } = useForm<TarifasForm>({
    defaultValues: { precioFijo: 0, precioPorLitro: 0 },
  });

  const precioFijo = Number(watch('precioFijo') || 0);
  const precioPorLitro = Number(watch('precioPorLitro') || 0);

  useEffect(() => {
    reset({
      precioFijo: pickTarifa(data, 'fija'),
      precioPorLitro: pickTarifa(data, 'variable'),
    });
  }, [data, reset]);

  const estimados = useMemo(() => {
    const variable = Math.round(precioPorLitro * ejemploM3);
    return {
      fija: precioFijo,
      variable,
      totalVariable: variable,
    };
  }, [precioFijo, precioPorLitro, ejemploM3]);

  const dirty = formState.isDirty;

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        maxWidth: 960,
        animation: 'ykTarifaIn 420ms ease both',
        '@keyframes ykTarifaIn': {
          from: { opacity: 0, transform: 'translateY(10px)' },
          to: { opacity: 1, transform: 'none' },
        },
      }}
    >
      <Stack spacing={0.5} mb={3}>
        <Typography
          sx={{
            fontFamily: '"Fraunces", Georgia, serif',
            fontSize: { xs: '1.55rem', md: '1.85rem' },
            fontWeight: 600,
            color: 'text.primary',
          }}
        >
          Tarifas de facturación
        </Typography>
        <Typography color="text.secondary" maxWidth={560}>
          Definí cuánto cobra la junta por conexión fija y por metro cúbico. Los cambios aplican a
          las próximas boletas generadas.
        </Typography>
      </Stack>

      <Grid container spacing={2.5}>
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              height: '100%',
              p: { xs: 2.5, md: 3 },
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider',
              background:
                'linear-gradient(160deg, rgba(11,110,110,0.08) 0%, rgba(255,255,255,0.96) 42%)',
              transition: 'transform 220ms ease, box-shadow 220ms ease',
              '&:focus-within': {
                transform: 'translateY(-2px)',
                boxShadow: '0 12px 28px rgba(11,110,110,0.12)',
              },
            }}
          >
            <Stack direction="row" spacing={1.5} alignItems="center" mb={2}>
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: 2,
                  display: 'grid',
                  placeItems: 'center',
                  bgcolor: 'rgba(11,110,110,0.12)',
                  color: 'primary.main',
                }}
              >
                <HomeWorkOutlinedIcon />
              </Box>
              <Box>
                <Typography fontWeight={700}>Tarifa fija</Typography>
                <Typography variant="body2" color="text.secondary">
                  Monto mensual por conexión
                </Typography>
              </Box>
            </Stack>

            <Controller
              name="precioFijo"
              control={control}
              rules={{ required: true, min: 0 }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  type="number"
                  label="Monto mensual"
                  disabled={loading}
                  inputProps={{ min: 0, step: 100 }}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">Gs</InputAdornment>,
                  }}
                  helperText="Se usa para clientes de tipo «Tarifa fija»."
                />
              )}
            />

            <Box mt={2.5}>
              <Typography variant="caption" color="text.secondary">
                Vista previa mensual
              </Typography>
              <Typography
                sx={{
                  fontFamily: '"Fraunces", Georgia, serif',
                  fontSize: '1.75rem',
                  fontWeight: 600,
                  color: 'primary.main',
                  lineHeight: 1.2,
                }}
              >
                {formatGs(estimados.fija)}
              </Typography>
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box
            sx={{
              height: '100%',
              p: { xs: 2.5, md: 3 },
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider',
              background:
                'linear-gradient(160deg, rgba(31,78,121,0.08) 0%, rgba(255,255,255,0.96) 42%)',
              transition: 'transform 220ms ease, box-shadow 220ms ease',
              '&:focus-within': {
                transform: 'translateY(-2px)',
                boxShadow: '0 12px 28px rgba(31,78,121,0.12)',
              },
            }}
          >
            <Stack direction="row" spacing={1.5} alignItems="center" mb={2}>
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: 2,
                  display: 'grid',
                  placeItems: 'center',
                  bgcolor: 'rgba(31,78,121,0.12)',
                  color: 'secondary.main',
                }}
              >
                <WaterDropOutlinedIcon />
              </Box>
              <Box>
                <Typography fontWeight={700}>Tarifa por consumo</Typography>
                <Typography variant="body2" color="text.secondary">
                  Precio por m³ medido
                </Typography>
              </Box>
            </Stack>

            <Controller
              name="precioPorLitro"
              control={control}
              rules={{ required: true, min: 0 }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  type="number"
                  label="Precio por m³"
                  disabled={loading}
                  inputProps={{ min: 0, step: 1 }}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">Gs / m³</InputAdornment>,
                  }}
                  helperText="Se usa para clientes de tipo «Tarifa variable»."
                />
              )}
            />

            <Box mt={2.5}>
              <Typography variant="caption" color="text.secondary">
                Ejemplo con {ejemploM3} m³
              </Typography>
              <Typography
                sx={{
                  fontFamily: '"Fraunces", Georgia, serif',
                  fontSize: '1.75rem',
                  fontWeight: 600,
                  color: 'secondary.main',
                  lineHeight: 1.2,
                }}
              >
                {formatGs(estimados.variable)}
              </Typography>
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Box
            sx={{
              p: { xs: 2.5, md: 3 },
              borderRadius: 3,
              border: '1px dashed',
              borderColor: 'rgba(11,110,110,0.28)',
              background:
                'radial-gradient(circle at top right, rgba(11,110,110,0.1), transparent 45%), #fff',
            }}
          >
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              spacing={2}
              justifyContent="space-between"
              alignItems={{ xs: 'stretch', md: 'center' }}
            >
              <Stack direction="row" spacing={1.5} alignItems="center">
                <CalculateOutlinedIcon color="primary" />
                <Box>
                  <Typography fontWeight={700}>Simulador rápido</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Mové el consumo para ver el impacto de la tarifa variable.
                  </Typography>
                </Box>
              </Stack>

              <Box sx={{ minWidth: { md: 280 }, px: { md: 1 } }}>
                <Stack direction="row" justifyContent="space-between" mb={0.5}>
                  <Typography variant="body2" color="text.secondary">
                    Consumo de ejemplo
                  </Typography>
                  <Typography variant="body2" fontWeight={700}>
                    {ejemploM3} m³
                  </Typography>
                </Stack>
                <Slider
                  value={ejemploM3}
                  min={1}
                  max={60}
                  step={1}
                  onChange={(_e, value) => setEjemploM3(Number(value))}
                  valueLabelDisplay="auto"
                  valueLabelFormat={(v) => `${v} m³`}
                />
              </Box>

              <Box textAlign={{ xs: 'left', md: 'right' }}>
                <Typography variant="caption" color="text.secondary">
                  Boleta variable estimada
                </Typography>
                <Typography fontWeight={700} fontSize="1.25rem">
                  {formatGs(estimados.totalVariable)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {ejemploM3} m³ × {formatGs(precioPorLitro)}
                </Typography>
              </Box>
            </Stack>
          </Box>
        </Grid>
      </Grid>

      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={1.5}
        mt={3}
        alignItems={{ xs: 'stretch', sm: 'center' }}
      >
        <Button
          type="submit"
          variant="contained"
          size="large"
          loading={loading}
          disabled={loading || !dirty}
          sx={{ minWidth: 200 }}
        >
          Guardar tarifas
        </Button>
        <Typography variant="body2" color="text.secondary">
          {dirty
            ? 'Hay cambios sin guardar.'
            : 'Las tarifas actuales ya están guardadas.'}
        </Typography>
      </Stack>
    </Box>
  );
};
