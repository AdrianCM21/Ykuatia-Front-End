import {
  Box,
  Button,
  Chip,
  Pagination,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
  alpha,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Layout from '../../components/layout/Layout';
import { useEffect, useState } from 'react';
import { CajaFormDialog } from './components/CajaFormDialog';
import { ICaja } from '../../interfaces/caja/Caja';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { esES } from '@mui/x-data-grid/locales';
import {
  addCaja,
  CierreCaja,
  crearCierre,
  exportCierreCsv,
  getCaja,
  getCajaResumen,
  CajaResumen,
  listCierres,
  reabrirCierre,
} from '../../services/caja/Caja.service';
import { revertirAbono } from '../../services/invoices/invoices.service';
import paginationNro from '../../config/paginationNro';
import { toast } from 'react-toastify';
import { DateRangeFilter } from '../../components/DateRangeFilter';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import { AppDialog } from '../../components/dialogs/AppDialog';
import { formatGs } from '../../utils/formatGs';

type CajaTab = 'movimientos' | 'cierres';

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

const dataGridSx = {
  border: 0,
  '& .MuiDataGrid-cell': { py: 1 },
  '& .MuiDataGrid-columnHeaders': {
    bgcolor: alpha('#0B6E6E', 0.04),
  },
};

export const CajaPage = () => {
  const [tab, setTab] = useState<CajaTab>('movimientos');
  const [openDialogForm, setOpenDialogForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [caja, setCaja] = useState<ICaja[]>([]);
  const [cierres, setCierres] = useState<CierreCaja[]>([]);
  const [page, setPage] = useState(1);
  const [pageNro, setPageNro] = useState(0);
  const [totalMovimientos, setTotalMovimientos] = useState(0);
  const [refres, setRefres] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [query, setQuery] = useState('');
  const [resumen, setResumen] = useState<CajaResumen>({ ingresos: 0, egresos: 0, saldo: 0 });
  const [confirmClose, setConfirmClose] = useState<'dia' | 'mes' | null>(null);
  const [closing, setClosing] = useState(false);
  const [dataFilter, setDataFilter] = useState([
    {
      startDate: startOfMonth(new Date()),
      endDate: endOfMonth(new Date()),
      key: 'selection',
    },
  ]);

  const desdeFecha = format(dataFilter[0].startDate, 'yyyy-MM-dd');
  const hastaFecha = format(dataFilter[0].endDate, 'yyyy-MM-dd');

  useEffect(() => {
    const t = setTimeout(() => {
      setPage(1);
      setQuery(searchText.trim());
    }, 350);
    return () => clearTimeout(t);
  }, [searchText]);

  useEffect(() => {
    loadData();
  }, [page, refres, query, desdeFecha, hastaFecha]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [list, totals, cierresRes] = await Promise.all([
        getCaja({ page, q: query, desdeFecha, hastaFecha }),
        getCajaResumen({ desdeFecha, hastaFecha }),
        listCierres(1),
      ]);
      setCaja(list.resultado);
      setTotalMovimientos(list.total);
      setPageNro(Math.max(1, Math.ceil(list.total / paginationNro.paginationNro)));
      setResumen(totals);
      setCierres(cierresRes.resultado);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Error de listado de caja');
    }
    setLoading(false);
  };

  const onRevertirAbono = async (id: number) => {
    if (!window.confirm('¿Revertir este abono? Se restará de la factura y del plan si aplica.')) {
      return;
    }
    try {
      await revertirAbono(id);
      setRefres((v) => v + 1);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'No se pudo revertir');
    }
  };

  const columns: GridColDef[] = [
    { flex: 0.08, field: 'id', headerName: 'Id' },
    {
      flex: 0.12,
      field: 'fecha',
      headerName: 'Fecha',
      valueFormatter: (value) => format(new Date(value as string), 'dd/MM/yyyy'),
    },
    { flex: 0.24, field: 'motivo', headerName: 'Motivo' },
    {
      flex: 0.12,
      field: 'tipo_ingreso',
      headerName: 'Tipo',
      valueGetter: (_v, row) => row.tipo_ingreso?.descripcion,
    },
    {
      flex: 0.12,
      field: 'monto',
      headerName: 'Monto',
      valueGetter: (value) => formatGs(value as number),
    },
    {
      flex: 0.14,
      field: 'factura',
      headerName: 'Origen',
      renderCell: (params) =>
        params.row.factura?.id ? (
          <Chip size="small" color="info" label={`Factura #${params.row.factura.id}`} />
        ) : (
          <Chip size="small" variant="outlined" label="Manual" />
        ),
    },
    {
      flex: 0.14,
      field: 'actions',
      headerName: 'Acción',
      sortable: false,
      renderCell: (params) =>
        params.row.factura?.id && !params.row.delete ? (
          <Button size="small" color="warning" onClick={() => onRevertirAbono(params.row.id)}>
            Revertir
          </Button>
        ) : null,
    },
  ];

  const cierreColumns: GridColDef[] = [
    { field: 'periodo_tipo', headerName: 'Tipo', flex: 0.1 },
    { field: 'periodo', headerName: 'Período', flex: 0.14 },
    {
      field: 'saldo',
      headerName: 'Saldo',
      flex: 0.14,
      valueGetter: (v) => formatGs(v as number),
    },
    {
      field: 'activo',
      headerName: 'Estado',
      flex: 0.12,
      valueGetter: (v) => (v ? 'Cerrado' : 'Reabierto'),
    },
    {
      field: 'actions',
      headerName: 'Acciones',
      flex: 0.28,
      sortable: false,
      renderCell: (params) => (
        <Box display="flex" gap={1}>
          <Button size="small" onClick={() => exportCierreCsv(params.row.id)}>
            CSV
          </Button>
          {params.row.activo && (
            <Button
              size="small"
              color="warning"
              onClick={async () => {
                try {
                  await reabrirCierre(params.row.id);
                  toast.success('Cierre reabierto');
                  setRefres((v) => v + 1);
                } catch (error: any) {
                  toast.error(error?.response?.data?.message || 'No se pudo reabrir');
                }
              }}
            >
              Reabrir
            </Button>
          )}
        </Box>
      ),
    },
  ];

  const onSubmitForm = async (data: any) => {
    try {
      await addCaja(data);
      toast.success('Movimiento registrado');
      setRefres((v) => v + 1);
      setOpenDialogForm(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'No se pudo registrar');
    }
  };

  const handleCerrar = async () => {
    if (!confirmClose) return;
    setClosing(true);
    try {
      const periodo =
        confirmClose === 'dia'
          ? format(new Date(), 'yyyy-MM-dd')
          : format(new Date(), 'yyyy-MM');
      await crearCierre({ tipo: confirmClose, periodo });
      toast.success(`Caja del ${confirmClose} cerrada`);
      setConfirmClose(null);
      setRefres((v) => v + 1);
      setTab('cierres');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'No se pudo cerrar');
    } finally {
      setClosing(false);
    }
  };

  const tabHint =
    tab === 'movimientos'
      ? 'Registrá ingresos y egresos del período. Los cobros de facturas aparecen acá automáticamente.'
      : 'Historial de cierres diarios o mensuales. Podés exportar CSV o reabrir si hace falta.';

  return (
    <Layout sectionTitle="CAJA">
      <>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} mb={2} flexWrap="wrap" useFlexGap>
          <Chip
            color="success"
            variant="outlined"
            label={`Ingresos: ${formatGs(resumen.ingresos)}`}
          />
          <Chip
            color="warning"
            variant="outlined"
            label={`Egresos: ${formatGs(resumen.egresos)}`}
          />
          <Chip color="primary" label={`Saldo: ${formatGs(resumen.saldo)}`} />
        </Stack>

        <Tabs
          value={tab}
          onChange={(_e, value: CajaTab) => setTab(value)}
          variant="scrollable"
          allowScrollButtonsMobile
          sx={{
            mb: 2,
            borderBottom: 1,
            borderColor: 'divider',
            minHeight: 48,
            '& .MuiTab-root': { textTransform: 'none', fontWeight: 600, minHeight: 48 },
          }}
        >
          <Tab
            value="movimientos"
            label={
              <Stack direction="row" alignItems="center" spacing={1}>
                <span>Movimientos</span>
                <Chip size="small" label={totalMovimientos} color="primary" variant="outlined" />
              </Stack>
            }
          />
          <Tab
            value="cierres"
            label={
              <Stack direction="row" alignItems="center" spacing={1}>
                <span>Cierres</span>
                <Chip size="small" label={cierres.length} variant="outlined" />
              </Stack>
            }
          />
        </Tabs>

        <Typography variant="body2" color="text.secondary" mb={2}>
          {tabHint}
        </Typography>

        {tab === 'movimientos' && (
          <>
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              spacing={1.5}
              justifyContent="space-between"
              alignItems={{ md: 'center' }}
              mb={2}
              flexWrap="wrap"
              useFlexGap
            >
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={1.5}
                alignItems={{ sm: 'center' }}
                flexWrap="wrap"
                useFlexGap
              >
                <Button
                  variant="contained"
                  startIcon={<AddIcon fontSize="small" />}
                  onClick={() => setOpenDialogForm(true)}
                >
                  Nuevo movimiento
                </Button>
                <DateRangeFilter dateRange={dataFilter} setDateRange={setDataFilter} />
                <TextField
                  size="small"
                  label="Buscar motivo"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  sx={{ minWidth: { xs: '100%', sm: 200 } }}
                />
              </Stack>
              <Stack direction="row" spacing={1}>
                <Button variant="outlined" onClick={() => setConfirmClose('dia')}>
                  Cerrar día
                </Button>
                <Button variant="contained" onClick={() => setConfirmClose('mes')}>
                  Cerrar mes
                </Button>
              </Stack>
            </Stack>

            <Box sx={gridShellSx}>
              <DataGrid
                columns={columns}
                rows={caja}
                loading={loading}
                hideFooter
                disableColumnMenu
                disableRowSelectionOnClick
                localeText={esES.components.MuiDataGrid.defaultProps.localeText}
                sx={dataGridSx}
              />
            </Box>
            <Box display="flex" justifyContent="center" mt={2}>
              <Pagination count={pageNro} page={page} onChange={(_e, v) => setPage(v)} />
            </Box>
          </>
        )}

        {tab === 'cierres' && (
          <>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
              flexWrap="wrap"
              gap={1}
            >
              <Typography variant="subtitle2" color="text.secondary">
                {cierres.length === 0
                  ? 'Todavía no hay cierres registrados'
                  : `${cierres.length} cierre${cierres.length === 1 ? '' : 's'} reciente${cierres.length === 1 ? '' : 's'}`}
              </Typography>
              <Stack direction="row" spacing={1}>
                <Button size="small" variant="outlined" onClick={() => setConfirmClose('dia')}>
                  Cerrar día
                </Button>
                <Button size="small" variant="contained" onClick={() => setConfirmClose('mes')}>
                  Cerrar mes
                </Button>
              </Stack>
            </Stack>
            <Box sx={gridShellSx}>
              <DataGrid
                rows={cierres}
                columns={cierreColumns}
                hideFooter
                disableColumnMenu
                disableRowSelectionOnClick
                localeText={esES.components.MuiDataGrid.defaultProps.localeText}
                sx={dataGridSx}
              />
            </Box>
          </>
        )}

        <CajaFormDialog
          onSubmit={onSubmitForm}
          open={openDialogForm}
          onClose={() => setOpenDialogForm(false)}
        />
        <AppDialog
          open={Boolean(confirmClose)}
          onClose={() => !closing && setConfirmClose(null)}
          disableClose={closing}
          eyebrow="Caja"
          title={`Cerrar caja del ${confirmClose || ''}`}
          subtitle="No se podrán registrar movimientos en ese período hasta reabrir."
          maxWidth="xs"
          scrollable={false}
          actions={
            <>
              <Button
                disabled={closing}
                onClick={() => setConfirmClose(null)}
                size="large"
                variant="outlined"
              >
                Cancelar
              </Button>
              <Button loading={closing} variant="contained" size="large" onClick={handleCerrar}>
                Confirmar cierre
              </Button>
            </>
          }
        >
          <Typography variant="body2" color="text.secondary">
            Revisá el resumen de ingresos y egresos antes de cerrar.
          </Typography>
        </AppDialog>
      </>
    </Layout>
  );
};
