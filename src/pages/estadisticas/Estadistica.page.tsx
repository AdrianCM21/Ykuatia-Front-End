import {
  Box,
  Chip,
  Grid,
  Stack,
  TextField,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import { useEffect, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import Layout from '../../components/layout/Layout';
import { getDashboard, DashboardData } from '../../services/reportes/reportes.service';
import { toast } from 'react-toastify';
import { format, subMonths } from 'date-fns';
import { Link as RouterLink } from 'react-router-dom';

export const EstadisticaPage = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(false);
  const [desde, setDesde] = useState(format(subMonths(new Date(), 5), 'yyyy-MM-dd'));
  const [hasta, setHasta] = useState(format(new Date(), 'yyyy-MM-dd'));

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    try {
      setData(await getDashboard({ desde, hasta }));
    } catch {
      toast.error('No se pudo cargar el dashboard');
    }
    setLoading(false);
  };

  const kpis = data?.kpis;

  return (
    <Layout sectionTitle="DASHBOARD">
      <>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} mb={2} alignItems="center">
          <TextField
            type="date"
            size="small"
            label="Desde"
            InputLabelProps={{ shrink: true }}
            value={desde}
            onChange={(e) => setDesde(e.target.value)}
          />
          <TextField
            type="date"
            size="small"
            label="Hasta"
            InputLabelProps={{ shrink: true }}
            value={hasta}
            onChange={(e) => setHasta(e.target.value)}
          />
          <Button variant="contained" onClick={load} disabled={loading}>
            Actualizar
          </Button>
        </Stack>

        <Typography color="text.secondary" mb={2}>
          Período {data?.desde?.slice(0, 10) || '-'} a {data?.hasta?.slice(0, 10) || '-'}.
          {loading ? ' Cargando…' : ''}
        </Typography>

        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap mb={3}>
          <Chip
            color="primary"
            label={`Cobrado ${Number(kpis?.cobradoPeriodo || 0).toLocaleString('es-PY')} Gs`}
          />
          <Chip
            color="warning"
            label={`Deuda ${Number(kpis?.deudaTotal || 0).toLocaleString('es-PY')} Gs`}
          />
          <Chip
            label={`Mora est. ${Number(kpis?.recargoEstimado || 0).toLocaleString('es-PY')} Gs`}
          />
          <Chip label={`${kpis?.facturasAbiertas ?? 0} facturas abiertas`} />
          <Chip
            color="success"
            label={`Mes actual ${Number(kpis?.cobradoMesActual || 0).toLocaleString('es-PY')} Gs`}
          />
          <Chip
            label={`Mes ant. ${Number(kpis?.cobradoMesAnterior || 0).toLocaleString('es-PY')} Gs`}
          />
          {kpis?.variacionMesPct != null && (
            <Chip
              color={kpis.variacionMesPct >= 0 ? 'success' : 'error'}
              label={`Var. mes ${kpis.variacionMesPct}%`}
            />
          )}
        </Stack>

        <Grid container spacing={3}>
          <Grid item xs={12} md={7}>
            <Typography fontWeight={700} mb={1}>
              Serie de cobranza
            </Typography>
            <Box sx={{ width: '100%', height: 280 }}>
              <ResponsiveContainer>
                <LineChart data={data?.serieCobranza || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="periodo" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="total" stroke="#0B6E6E" name="Cobrado" />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Grid>
          <Grid item xs={12} md={5}>
            <Typography fontWeight={700} mb={1}>
              Deuda por aging
            </Typography>
            <Box sx={{ width: '100%', height: 280 }}>
              <ResponsiveContainer>
                <BarChart data={data?.cobranzaPorBucket || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="bucket" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="monto" fill="#1F4E79" name="Deuda" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
              <Typography fontWeight={700}>Top deudas</Typography>
              <Button component={RouterLink} to="/morosos" size="small">
                Ver morosos
              </Button>
            </Box>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Cliente</TableCell>
                  <TableCell>Deuda</TableCell>
                  <TableCell>Mora est.</TableCell>
                  <TableCell>Días</TableCell>
                  <TableCell>Aging</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(data?.topMorosos || []).map((m) => (
                  <TableRow key={m.id_cliente}>
                    <TableCell>{m.nombre}</TableCell>
                    <TableCell>{Number(m.monto_deuda).toLocaleString('es-PY')} Gs</TableCell>
                    <TableCell>
                      {Number(m.recargo_estimado || 0).toLocaleString('es-PY')} Gs
                    </TableCell>
                    <TableCell>{m.dias_mora}</TableCell>
                    <TableCell>
                      <Chip size="small" label={m.bucket} color="warning" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Grid>
        </Grid>
      </>
    </Layout>
  );
};
