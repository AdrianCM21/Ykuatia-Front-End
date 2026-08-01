import { useEffect, useMemo, useState } from 'react';
import Layout from '../../components/layout/Layout';
import { MapComponent, MapLocation } from './components/MapsComponent';
import { getCustomers } from '../../services/Customers/CustomerService';
import {
  Alert,
  Box,
  Chip,
  InputAdornment,
  List,
  ListItemButton,
  ListItemText,
  Stack,
  TextField,
  Typography,
  alpha,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PlaceIcon from '@mui/icons-material/Place';
import ICustomer from '../../interfaces/customers/Customer';
import { toast } from 'react-toastify';
import type { LatLngTuple } from 'leaflet';

const isValidLocacion = (locacion?: string | null): locacion is string => {
  if (!locacion) return false;
  const parts = locacion.split(',').map(Number);
  if (parts.length !== 2 || parts.some((n) => Number.isNaN(n))) return false;
  if (parts[0] === 0 && parts[1] === 0) return false;
  return true;
};

const toLocation = (customer: ICustomer): MapLocation | null => {
  if (!customer.id || !isValidLocacion(customer.locacion)) return null;
  const posicion = customer.locacion.split(',').map(Number) as LatLngTuple;
  return {
    id: customer.id,
    cliente: customer.nombre,
    cedula: customer.cedula,
    telefono: customer.telefono,
    direccion: customer.direccion,
    medidor: customer.nro_medidor,
    posicion,
  };
};

export const MapsMainScreen = () => {
  const [customers, setCustomers] = useState<ICustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [selectedId, setSelectedId] = useState<number | null>(null);

  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);
      try {
        const all: ICustomer[] = [];
        let page = 1;
        let total = Infinity;
        while (all.length < total && page <= 20) {
          const response = await getCustomers({ page, limit: 100 });
          total = response.total;
          all.push(...response.resultado);
          if (!response.resultado.length) break;
          page += 1;
        }
        setCustomers(all);
      } catch {
        toast.error('No se pudieron cargar los clientes del mapa');
      } finally {
        setLoading(false);
      }
    };
    loadAll();
  }, []);

  const filtered = useMemo(() => {
    const q = searchText.trim().toLowerCase();
    if (!q) return customers;
    return customers.filter(
      (c) =>
        c.nombre.toLowerCase().includes(q) ||
        c.cedula?.toLowerCase().includes(q) ||
        c.telefono?.toLowerCase().includes(q) ||
        c.nro_medidor?.toLowerCase().includes(q)
    );
  }, [customers, searchText]);

  const locations = useMemo(
    () => filtered.map(toLocation).filter((l): l is MapLocation => Boolean(l)),
    [filtered]
  );

  const sinUbicacion = useMemo(
    () => filtered.filter((c) => !isValidLocacion(c.locacion)).length,
    [filtered]
  );

  const focus = useMemo<LatLngTuple | null>(() => {
    if (selectedId == null) return null;
    return locations.find((l) => l.id === selectedId)?.posicion ?? null;
  }, [selectedId, locations]);

  const listWithLocation = useMemo(
    () => filtered.filter((c) => isValidLocacion(c.locacion)),
    [filtered]
  );

  return (
    <Layout sectionTitle="MAPA">
      <>
        <Box
          sx={{
            mb: 2.5,
            p: 2.5,
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'divider',
            background:
              'linear-gradient(135deg, rgba(11,110,110,0.08) 0%, rgba(31,78,121,0.06) 50%, rgba(255,255,255,0.9) 100%)',
          }}
        >
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            justifyContent="space-between"
            spacing={2}
            alignItems={{ md: 'center' }}
          >
            <Box>
              <Typography variant="h5" sx={{ fontFamily: '"Fraunces", Georgia, serif' }}>
                Ubicación de vecinos
              </Typography>
              <Typography variant="body2" color="text.secondary" mt={0.5}>
                Buscá un cliente y centrá el mapa en su casa.
              </Typography>
            </Box>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              <Chip
                color="primary"
                variant="outlined"
                icon={<PlaceIcon />}
                label={`${locations.length} en el mapa`}
              />
              <Chip
                variant="outlined"
                label={`${sinUbicacion} sin ubicación`}
                color={sinUbicacion ? 'warning' : 'default'}
              />
              <Chip variant="outlined" label={`${filtered.length} filtrados`} />
            </Stack>
          </Stack>
        </Box>

        <TextField
          size="small"
          fullWidth
          label="Buscar"
          placeholder="Nombre, cédula, teléfono o medidor"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          sx={{ mb: 2, maxWidth: 420 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" color="action" />
              </InputAdornment>
            ),
          }}
        />

        {!loading && !locations.length && (
          <Alert severity="info" sx={{ mb: 2 }}>
            No hay clientes con ubicación marcada
            {searchText ? ' para esta búsqueda' : ''}. Podés cargar la ubicación al editar un
            cliente.
          </Alert>
        )}

        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="stretch">
          <Box
            sx={{
              width: { xs: '100%', md: 320 },
              flexShrink: 0,
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
              bgcolor: alpha('#fff', 0.75),
              display: 'flex',
              flexDirection: 'column',
              maxHeight: { xs: 280, md: 560 },
              overflow: 'hidden',
            }}
          >
            <Box px={2} py={1.5} borderBottom="1px solid" borderColor="divider">
              <Typography fontWeight={700}>Clientes ubicados</Typography>
              <Typography variant="caption" color="text.secondary">
                Tocá uno para centrar el mapa
              </Typography>
            </Box>
            <List dense sx={{ overflowY: 'auto', flex: 1, py: 0 }}>
              {listWithLocation.map((c) => (
                <ListItemButton
                  key={c.id}
                  selected={selectedId === c.id}
                  onClick={() => setSelectedId(c.id!)}
                >
                  <ListItemText
                    primary={c.nombre}
                    secondary={`CI ${c.cedula}${c.nro_medidor ? ` · Med. ${c.nro_medidor}` : ''}`}
                    primaryTypographyProps={{ fontWeight: selectedId === c.id ? 700 : 500 }}
                  />
                </ListItemButton>
              ))}
              {!listWithLocation.length && (
                <Box px={2} py={3}>
                  <Typography variant="body2" color="text.secondary">
                    {loading ? 'Cargando…' : 'Sin resultados con ubicación.'}
                  </Typography>
                </Box>
              )}
            </List>
          </Box>

          <Box
            sx={{
              flex: 1,
              minHeight: { xs: 360, md: 560 },
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
              overflow: 'hidden',
              bgcolor: alpha('#fff', 0.5),
            }}
          >
            <MapComponent locations={locations} focus={focus} height="100%" />
          </Box>
        </Stack>
      </>
    </Layout>
  );
};
