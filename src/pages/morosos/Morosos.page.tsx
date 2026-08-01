import { useEffect, useState } from 'react';
import Layout from '../../components/layout/Layout';
import {
  Box,
  Button,
  Pagination,
  TextField,
  Typography,
  Chip,
  Stack,
  alpha,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { esES } from '@mui/x-data-grid/locales';
import { Link as RouterLink } from 'react-router-dom';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import {
  exportMorososCsv,
  getMorosos,
  Moroso,
  MorososResumen,
} from '../../services/reportes/reportes.service';
import paginationNro from '../../config/paginationNro';
import { formatGs } from '../../utils/formatGs';
import {
  chipColorBucket,
  labelBucketMora,
  NIVELES_MORA,
  MorosoBucket,
} from '../../utils/morososLabels';

const emptyResumen = (): MorososResumen => ({
  total_clientes: 0,
  deuda_total: 0,
  recargo_total: 0,
  por_bucket: {
    '0-30': { clientes: 0, deuda: 0 },
    '31-60': { clientes: 0, deuda: 0 },
    '61-90': { clientes: 0, deuda: 0 },
    '90+': { clientes: 0, deuda: 0 },
  },
});

const gridShellSx = {
  height: { xs: 420, md: 520 },
  border: '1px solid',
  borderColor: 'divider',
  borderRadius: 2,
  overflow: 'hidden',
  bgcolor: alpha('#fff', 0.7),
  '& .MuiDataGrid-row:hover': {
    bgcolor: alpha('#0B6E6E', 0.04),
  },
  '& .MuiDataGrid-cell': {
    display: 'flex',
    alignItems: 'center',
  },
};

export const MorososPage = () => {
  const [rows, setRows] = useState<Moroso[]>([]);
  const [resumen, setResumen] = useState<MorososResumen>(emptyResumen);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageNro, setPageNro] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [query, setQuery] = useState('');
  const [bucket, setBucket] = useState<MorosoBucket | ''>('');

  useEffect(() => {
    const t = setTimeout(() => {
      setPage(1);
      setQuery(searchText.trim());
    }, 350);
    return () => clearTimeout(t);
  }, [searchText]);

  useEffect(() => {
    load();
  }, [page, query, bucket]);

  const load = async () => {
    setLoading(true);
    try {
      const response = await getMorosos({
        page,
        q: query || undefined,
        bucket: bucket || undefined,
      });
      setRows(response.resultado);
      setTotal(response.total);
      setResumen(response.resumen || emptyResumen());
      setPageNro(Math.max(1, Math.ceil(response.total / paginationNro.paginationNro)));
    } catch {
      toast.error('Error al listar morosos');
    }
    setLoading(false);
  };

  const columns: GridColDef[] = [
    { field: 'nombre', headerName: 'Cliente', flex: 0.2 },
    { field: 'cedula', headerName: 'Cédula', flex: 0.1 },
    { field: 'telefono', headerName: 'Teléfono', flex: 0.11 },
    {
      field: 'monto_deuda',
      headerName: 'Deuda',
      flex: 0.12,
      valueGetter: (value) => formatGs(value as number),
    },
    {
      field: 'recargo_estimado',
      headerName: 'Mora est.',
      flex: 0.11,
      valueGetter: (value) => formatGs(Number(value || 0)),
    },
    {
      field: 'fecha_vencimiento',
      headerName: 'Venció',
      flex: 0.11,
      valueGetter: (value) =>
        value ? format(new Date(value as string), 'dd/MM/yyyy') : '-',
    },
    {
      field: 'dias_mora',
      headerName: 'Días vencida',
      flex: 0.1,
      valueGetter: (value) => `${value} d`,
    },
    {
      field: 'bucket',
      headerName: 'Nivel',
      flex: 0.12,
      renderCell: (params) => (
        <Chip
          size="small"
          label={labelBucketMora(String(params.value))}
          color={chipColorBucket(String(params.value))}
          variant={params.value === '90+' || params.value === '61-90' ? 'filled' : 'outlined'}
        />
      ),
    },
    {
      field: 'facturas_pendientes',
      headerName: 'Facturas',
      flex: 0.08,
    },
    {
      field: 'actions',
      headerName: 'Acción',
      flex: 0.12,
      sortable: false,
      renderCell: () => (
        <Button size="small" variant="contained" component={RouterLink} to="/pagos">
          Cobrar
        </Button>
      ),
    },
  ];

  const nivelCards = NIVELES_MORA.filter((n) => n.bucket !== '');

  return (
    <Layout sectionTitle="MOROSOS">
      <>
        <Typography color="text.secondary" mb={2} maxWidth={720}>
          Solo aparecen clientes con facturas <strong>ya vencidas</strong>. Tener deuda del mes
          actual todavía dentro del plazo de pago no cuenta como mora.
        </Typography>

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={1.5}
          mb={2}
          flexWrap="wrap"
          useFlexGap
        >
          <Chip
            color="primary"
            label={`${resumen.total_clientes} cliente${resumen.total_clientes === 1 ? '' : 's'} en mora`}
          />
          <Chip
            variant="outlined"
            label={`Deuda vencida: ${formatGs(resumen.deuda_total)}`}
          />
          <Chip
            variant="outlined"
            color="warning"
            label={`Mora est.: ${formatGs(resumen.recargo_total)}`}
          />
        </Stack>

        <Box
          display="grid"
          gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' }}
          gap={1.5}
          mb={2.5}
        >
          {nivelCards.map((nivel) => {
            const stats = resumen.por_bucket[nivel.bucket as MorosoBucket];
            const selected = bucket === nivel.bucket;
            return (
              <Box
                key={nivel.bucket}
                component="button"
                type="button"
                onClick={() => {
                  setPage(1);
                  setBucket((prev) => (prev === nivel.bucket ? '' : (nivel.bucket as MorosoBucket)));
                }}
                sx={{
                  textAlign: 'left',
                  cursor: 'pointer',
                  border: '1px solid',
                  borderColor: selected ? 'primary.main' : 'divider',
                  bgcolor: selected ? alpha('#0B6E6E', 0.08) : alpha('#fff', 0.7),
                  borderRadius: 2,
                  p: 1.75,
                  transition: 'border-color 0.15s, background 0.15s',
                  '&:hover': {
                    borderColor: 'primary.light',
                    bgcolor: alpha('#0B6E6E', 0.05),
                  },
                }}
              >
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={0.5}>
                  <Typography fontWeight={700}>{nivel.label}</Typography>
                  <Chip size="small" color={nivel.color} label={stats?.clientes ?? 0} />
                </Stack>
                <Typography variant="body2" color="text.secondary">
                  {nivel.hint}
                </Typography>
                <Typography variant="subtitle2" mt={1}>
                  {formatGs(stats?.deuda ?? 0)}
                </Typography>
              </Box>
            );
          })}
        </Box>

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={1.5}
          mb={2}
          alignItems={{ sm: 'center' }}
          justifyContent="space-between"
          flexWrap="wrap"
          useFlexGap
        >
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} useFlexGap flexWrap="wrap">
            <TextField
              size="small"
              label="Buscar nombre o cédula"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              sx={{ minWidth: { xs: '100%', sm: 260 } }}
            />
            {bucket && (
              <Chip
                label={`Filtro: ${labelBucketMora(bucket)}`}
                onDelete={() => {
                  setPage(1);
                  setBucket('');
                }}
                color="primary"
                variant="outlined"
              />
            )}
            <Chip label={`${total} en esta vista`} variant="outlined" />
          </Stack>
          <Button
            variant="outlined"
            onClick={() =>
              exportMorososCsv({ q: query || undefined, bucket: bucket || undefined }).catch(() =>
                toast.error('No se pudo exportar')
              )
            }
          >
            Exportar CSV
          </Button>
        </Stack>

        <Box sx={gridShellSx}>
          <DataGrid
            rows={rows}
            columns={columns}
            getRowId={(row) => row.id_cliente}
            loading={loading}
            hideFooter
            disableColumnMenu
            disableRowSelectionOnClick
            localeText={esES.components.MuiDataGrid.defaultProps.localeText}
            sx={{
              border: 0,
              '& .MuiDataGrid-cell': { py: 1 },
              '& .MuiDataGrid-columnHeaders': {
                bgcolor: alpha('#0B6E6E', 0.04),
              },
            }}
          />
        </Box>
        <Box display="flex" justifyContent="center" mt={2}>
          <Pagination count={pageNro} page={page} onChange={(_e, v) => setPage(v)} />
        </Box>
      </>
    </Layout>
  );
};
