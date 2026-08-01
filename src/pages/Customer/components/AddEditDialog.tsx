import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  alpha,
} from '@mui/material';
import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { Controller, useForm } from 'react-hook-form';
import ICustomer from '../../../interfaces/customers/Customer';
import CloseIcon from '@mui/icons-material/Close';
import PlaceIcon from '@mui/icons-material/Place';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import WaterDropOutlinedIcon from '@mui/icons-material/WaterDropOutlined';
import { useSelector } from 'react-redux';
import IResponseErrorCustomer from '../../../interfaces/customers/ResponsErrorCustomers';
import FormHeader from '../../../components/FormHeader';
import { getTipoCliente } from '../../../services/Customers/CustomerService';
import ICustomertypes from '../../../interfaces/customers/CustomersTypes';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';

const DEFAULT_CENTER: [number, number] = [-26.6324065, -55.5191857];

type FormFields = {
  id?: number;
  cedula: string;
  nombre: string;
  direccion: string;
  telefono: string;
  tipoCliente: string | number;
  locacion: string;
  nro_medidor: string;
};

interface IProps {
  open: boolean;
  loading: boolean;
  onSubmit: (formFields: ICustomer) => void;
  onClose: () => void;
  current?: ICustomer;
}

const parseLocacion = (locacion?: string | null): [number, number] | null => {
  if (!locacion) return null;
  const parts = locacion.split(',').map(Number);
  if (parts.length !== 2 || parts.some((n) => Number.isNaN(n))) return null;
  return [parts[0], parts[1]];
};

const LocationPicker = ({
  position,
  onPick,
}: {
  position: [number, number] | null;
  onPick: (coords: [number, number]) => void;
}) => {
  useMapEvents({
    click: (e) => {
      onPick([e.latlng.lat, e.latlng.lng]);
    },
  });
  return position ? <Marker position={position} /> : null;
};

const SectionTitle = ({
  icon,
  title,
  subtitle,
}: {
  icon: ReactNode;
  title: string;
  subtitle?: string;
}) => (
  <Stack direction="row" spacing={1.25} alignItems="flex-start" mb={1.5}>
    <Box
      sx={{
        width: 34,
        height: 34,
        borderRadius: '10px',
        display: 'grid',
        placeItems: 'center',
        bgcolor: alpha('#0B6E6E', 0.1),
        color: 'primary.main',
        flexShrink: 0,
      }}
    >
      {icon}
    </Box>
    <Box>
      <Typography fontWeight={700}>{title}</Typography>
      {subtitle ? (
        <Typography variant="caption" color="text.secondary">
          {subtitle}
        </Typography>
      ) : null}
    </Box>
  </Stack>
);

const CustomerAddEditDialog = ({ open, loading, onSubmit, onClose, current }: IProps) => {
  const [tipos, setTipos] = useState<ICustomertypes[]>([]);
  const [loadingSelect, setLoadingSelect] = useState(true);
  const [position, setPosition] = useState<[number, number] | null>(null);

  const defaultValues = useMemo<FormFields>(
    () => ({
      id: current?.id,
      cedula: current?.cedula ?? '',
      nombre: current?.nombre ?? '',
      direccion: current?.direccion ?? '',
      telefono: current?.telefono ?? '',
      tipoCliente: current?.tipoCliente ?? '',
      locacion: current?.locacion ?? '',
      nro_medidor: current?.nro_medidor ?? '',
    }),
    [current]
  );

  // @ts-expect-error redux slice tipado legacy
  const error422: IResponseErrorCustomer = useSelector((state) => state.error422);

  const serverError = (field: keyof IResponseErrorCustomer) => {
    const err = error422?.[field] as { msg?: string } | unknown;
    if (!err || Array.isArray(err)) return undefined;
    if (typeof err === 'object' && err !== null && 'msg' in err) {
      const msg = String((err as { msg?: string }).msg || '');
      return msg || undefined;
    }
    return undefined;
  };

  const {
    reset,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormFields>({
    defaultValues,
    mode: 'onTouched',
  });

  const locacion = watch('locacion');

  useEffect(() => {
    getTipoCliente()
      .then((response) => setTipos(response))
      .catch(() => undefined)
      .finally(() => setLoadingSelect(false));
  }, []);

  useEffect(() => {
    if (!open) return;
    reset(defaultValues);
    setPosition(parseLocacion(defaultValues.locacion));
  }, [open, defaultValues, reset]);

  const handleClose = () => {
    reset(defaultValues);
    onClose();
  };

  const mapCenter = position || DEFAULT_CENTER;

  return (
    <FormHeader open={open}>
      <Dialog
        fullWidth
        open={open}
        maxWidth="md"
        scroll="paper"
        onClose={loading ? undefined : handleClose}
        PaperProps={{
          sx: {
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
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
            flexShrink: 0,
            background:
              'linear-gradient(135deg, rgba(11,110,110,0.10) 0%, rgba(31,78,121,0.08) 55%, rgba(232,242,242,0.9) 100%)',
            borderBottom: '1px solid',
            borderColor: 'divider',
            position: 'relative',
          }}
        >
          <IconButton
            size="small"
            onClick={handleClose}
            disabled={loading}
            sx={{ position: 'absolute', right: 12, top: 12 }}
            aria-label="Cerrar"
          >
            <CloseIcon />
          </IconButton>
          <Typography variant="overline" color="text.secondary" letterSpacing={1}>
            Vecino de la junta
          </Typography>
          <Typography variant="h5">
            {current ? 'Editar cliente' : 'Nuevo cliente'}
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={0.5} pr={4}>
            {current
              ? 'Actualizá los datos del vecino y su ubicación en el mapa.'
              : 'Registrá al vecino con sus datos de contacto, medidor y ubicación.'}
          </Typography>
        </Box>

        <Box
          component="form"
          onSubmit={handleSubmit((values) => onSubmit(values as unknown as ICustomer))}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            minHeight: 0,
            overflow: 'hidden',
          }}
        >
          <DialogContent
            dividers
            sx={{
              px: 3,
              py: 2.5,
              flex: '1 1 auto',
              overflowY: 'auto',
            }}
          >
            <Box mb={3}>
              <SectionTitle
                icon={<PersonOutlineIcon fontSize="small" />}
                title="Datos personales"
                subtitle="Nombre, documento y cómo contactarlo"
              />
              <Grid container spacing={2}>
                <Grid item xs={12} sm={8}>
                  <Controller
                    name="nombre"
                    control={control}
                    rules={{ required: 'El nombre es obligatorio' }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Nombre y apellido"
                        error={Boolean(errors.nombre || serverError('nombre'))}
                        helperText={errors.nombre?.message || serverError('nombre')}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Controller
                    name="cedula"
                    control={control}
                    rules={{ required: 'La cédula es obligatoria' }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Cédula"
                        error={Boolean(errors.cedula || serverError('cedula'))}
                        helperText={errors.cedula?.message || serverError('cedula')}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="telefono"
                    control={control}
                    rules={{ required: 'El teléfono es obligatorio' }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Teléfono"
                        error={Boolean(errors.telefono || serverError('telefono'))}
                        helperText={errors.telefono?.message || serverError('telefono')}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="direccion"
                    control={control}
                    rules={{ required: 'La dirección es obligatoria' }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Dirección"
                        error={Boolean(errors.direccion || serverError('direccion'))}
                        helperText={errors.direccion?.message || serverError('direccion')}
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </Box>

            <Box mb={3}>
              <SectionTitle
                icon={<WaterDropOutlinedIcon fontSize="small" />}
                title="Servicio"
                subtitle="Tipo de cliente y número de medidor"
              />
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth error={Boolean(errors.tipoCliente)}>
                    <InputLabel id="tipo-cliente-label">Tipo de cliente</InputLabel>
                    <Controller
                      name="tipoCliente"
                      control={control}
                      rules={{ required: 'Elegí un tipo' }}
                      render={({ field }) => (
                        <Select
                          {...field}
                          labelId="tipo-cliente-label"
                          label="Tipo de cliente"
                          value={field.value ?? ''}
                        >
                          {loadingSelect ? (
                            <MenuItem disabled value="">
                              Cargando...
                            </MenuItem>
                          ) : (
                            tipos.map((tipo) => (
                              <MenuItem key={tipo.id_tipo} value={tipo.id_tipo}>
                                {tipo.descripcion}
                              </MenuItem>
                            ))
                          )}
                        </Select>
                      )}
                    />
                    {errors.tipoCliente && (
                      <FormHelperText>{errors.tipoCliente.message}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="nro_medidor"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Nº de medidor"
                        placeholder="Opcional"
                        helperText="Si todavía no tiene, podés dejarlo vacío"
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </Box>

            <Box>
              <SectionTitle
                icon={<PlaceIcon fontSize="small" />}
                title="Ubicación en el mapa"
                subtitle="Tocá el mapa para marcar la casa del vecino"
              />
              <Stack direction="row" spacing={1} alignItems="center" mb={1.25} flexWrap="wrap" useFlexGap>
                {locacion ? (
                  <Chip
                    size="small"
                    color="primary"
                    variant="outlined"
                    icon={<PlaceIcon />}
                    label={`Marcado: ${locacion}`}
                  />
                ) : (
                  <Chip size="small" variant="outlined" label="Sin ubicación marcada" />
                )}
                {locacion && (
                  <Button
                    size="small"
                    onClick={() => {
                      setPosition(null);
                      setValue('locacion', '');
                    }}
                  >
                    Quitar marca
                  </Button>
                )}
              </Stack>

              <Alert severity="info" sx={{ mb: 1.5 }}>
                Hacé click en el mapa para ubicar al cliente. Podés mover la marca tocando otro punto.
              </Alert>

              <Box
                sx={{
                  height: 280,
                  borderRadius: 2,
                  overflow: 'hidden',
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <MapContainer
                  key={`${open}-${current?.id ?? 'new'}-${mapCenter.join(',')}`}
                  center={mapCenter}
                  zoom={13}
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <LocationPicker
                    position={position}
                    onPick={(coords) => {
                      setPosition(coords);
                      setValue('locacion', coords.join(','), { shouldDirty: true });
                    }}
                  />
                </MapContainer>
              </Box>
            </Box>

            <Controller
              name="locacion"
              control={control}
              render={({ field }) => <input type="hidden" {...field} />}
            />
            <Controller
              name="id"
              control={control}
              render={({ field }) => (
                <input type="hidden" value={field.value ?? ''} onChange={field.onChange} />
              )}
            />
          </DialogContent>

          <DialogActions
            sx={{
              px: 3,
              py: 2,
              flexShrink: 0,
              borderTop: '1px solid',
              borderColor: 'divider',
              bgcolor: alpha('#0B6E6E', 0.03),
            }}
          >
            <Button size="large" variant="outlined" onClick={handleClose} disabled={loading}>
              Cancelar
            </Button>
            <Button size="large" type="submit" variant="contained" loading={loading}>
              {current ? 'Guardar cambios' : 'Crear cliente'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </FormHeader>
  );
};

export default CustomerAddEditDialog;
