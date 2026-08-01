import {
  Box,
  Button,
  Chip,
  MenuItem,
  Pagination,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
  alpha,
} from '@mui/material';
import { AppDialog } from '../../components/dialogs/AppDialog';
import Layout from '../../components/layout/Layout';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import ICustomer from '../../interfaces/customers/Customer';
import * as CustomerService from '../../services/Customers/CustomerService';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { esES } from '@mui/x-data-grid/locales';
import { PagoForm } from './components/PagoForm';
import {
  downloadRecibo,
  listMovimientosPago,
  MovimientoPago,
  pagos,
  revertirAbono,
} from '../../services/invoices/invoices.service';
import paginationNro from '../../config/paginationNro';
import {
  createPlan,
  getPlanes,
  PlanPago,
  updatePlan,
} from '../../services/planes/planes.service';
import { useAuth } from '../../context/AuthContext';
import { format } from 'date-fns';
import { facturaSaldo } from '../../utils/facturaSaldo';
import { formatGs } from '../../utils/formatGs';

type PagosTab = 'cobrar' | 'planes' | 'abonos';

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

export const Pagos = () => {
  const { can } = useAuth();
  const puedeOperar = can('pagos');
  const [tab, setTab] = useState<PagosTab>('cobrar');
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState<ICustomer[]>([]);
  const [page, setPage] = useState(1);
  const [pageNro, setPageNro] = useState(0);
  const [total, setTotal] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [query, setQuery] = useState('');
  const [refres, setRefres] = useState(0);
  const [openFormDialog, setOpenFormDialog] = useState(false);
  const [loadingForm, setLoadingForm] = useState(false);
  const [customerData, setCustomerData] = useState<ICustomer>();
  const [planes, setPlanes] = useState<PlanPago[]>([]);
  const [movimientos, setMovimientos] = useState<MovimientoPago[]>([]);
  const [openPlan, setOpenPlan] = useState(false);
  const [planForm, setPlanForm] = useState({
    id_cliente: '',
    id_factura: '',
    monto_total: '',
    cuotas: '3',
    notas: '',
  });

  const clientePlan = useMemo(
    () => customers.find((c) => String(c.id) === planForm.id_cliente),
    [customers, planForm.id_cliente]
  );

  const facturasCliente = useMemo(
    () =>
      (clientePlan?.factura || []) as Array<{
        id: number;
        anio_mes?: string;
        Fecha_emicion?: string;
        monto: number;
        monto_pagado?: number;
        saldo?: number;
        estado: string;
      }>,
    [clientePlan]
  );

  const columns: GridColDef[] = [
    { flex: 0.1, field: 'id', headerName: 'ID' },
    { flex: 0.3, field: 'nombre', headerName: 'Nombre' },
    { flex: 0.2, field: 'cedula', headerName: 'Cédula' },
    {
      flex: 0.2,
      field: 'deuda',
      headerName: 'Deuda',
      valueGetter: (_v, row) => {
        const sum = (row.factura || []).reduce(
          (
            acc: number,
            f: { monto: number; monto_pagado?: number; saldo?: number }
          ) => acc + facturaSaldo(f),
          0
        );
        return formatGs(sum);
      },
    },
    {
      flex: 0.28,
      field: 'action',
      headerName: 'Acción',
      sortable: false,
      renderCell: (params) => (
        <Button size="small" variant="contained" onClick={() => handleFormDialogOpen(params.row)}>
          Cobrar
        </Button>
      ),
    },
  ];

  const planeColumns: GridColDef[] = [
    {
      field: 'cliente',
      headerName: 'Cliente',
      flex: 0.22,
      valueGetter: (_v, row) => row.cliente?.nombre || '-',
    },
    {
      field: 'factura',
      headerName: 'Factura',
      flex: 0.12,
      valueGetter: (_v, row) => (row.factura?.id ? `#${row.factura.id}` : '-'),
    },
    {
      field: 'monto_total',
      headerName: 'Total',
      flex: 0.14,
      valueGetter: (v) => formatGs(v as number),
    },
    {
      field: 'cuotas',
      headerName: 'Cuotas',
      flex: 0.12,
      valueGetter: (_v, row) => `${row.cuotas_pagadas}/${row.cuotas}`,
    },
    { field: 'estado', headerName: 'Estado', flex: 0.1 },
    {
      field: 'actions',
      headerName: 'Acciones',
      flex: 0.2,
      sortable: false,
      renderCell: (params) =>
        puedeOperar ? (
          <Button
            size="small"
            color="warning"
            onClick={() =>
              updatePlan(params.row.id, 'cancelar')
                .then(() => {
                  toast.info('Plan cancelado');
                  loadPlanes();
                })
                .catch((e) => toast.error(e?.response?.data?.message || 'Error'))
            }
          >
            Cancelar
          </Button>
        ) : null,
    },
  ];

  const movimientoColumns: GridColDef[] = [
    {
      field: 'fecha',
      headerName: 'Fecha',
      flex: 0.14,
      valueFormatter: (v) =>
        v ? format(new Date(v as string), 'dd/MM/yyyy HH:mm') : '-',
    },
    {
      field: 'cliente',
      headerName: 'Cliente',
      flex: 0.22,
      valueGetter: (_v, row) => row.factura?.cliente?.nombre || '-',
    },
    {
      field: 'factura',
      headerName: 'Factura',
      flex: 0.12,
      valueGetter: (_v, row) => (row.factura?.id ? `#${row.factura.id}` : '-'),
    },
    {
      field: 'monto',
      headerName: 'Monto',
      flex: 0.14,
      valueGetter: (v) => formatGs(v as number),
    },
    {
      field: 'plan',
      headerName: 'Plan',
      flex: 0.12,
      valueGetter: (_v, row) =>
        row.plan?.id ? `${row.plan.cuotas_pagadas}/${row.plan.cuotas}` : '-',
    },
    {
      field: 'actions',
      headerName: 'Acción',
      flex: 0.14,
      sortable: false,
      renderCell: (params) =>
        puedeOperar ? (
          <Button size="small" color="warning" onClick={() => onRevertir(params.row.id)}>
            Revertir
          </Button>
        ) : null,
    },
  ];

  useEffect(() => {
    getCustomers();
    loadPlanes();
    loadMovimientos();
  }, [page, query, refres]);

  useEffect(() => {
    const t = setTimeout(() => {
      setPage(1);
      setQuery(searchText.trim());
    }, 350);
    return () => clearTimeout(t);
  }, [searchText]);

  const getCustomers = async () => {
    setLoading(true);
    try {
      const response = await CustomerService.getCustomersFactura({ page, q: query });
      setCustomers(response.resultado);
      setTotal(response.total);
      setPageNro(Math.max(1, Math.ceil(response.total / paginationNro.paginationNro)));
    } catch {
      toast.error('Error al listar clientes con deuda');
    }
    setLoading(false);
  };

  const loadPlanes = async () => {
    try {
      setPlanes(await getPlanes({ estado: 'activo' }));
    } catch {
      /* cajero puede listar; si falla no bloquea cobros */
    }
  };

  const loadMovimientos = async () => {
    try {
      setMovimientos(await listMovimientosPago({ limit: 15 }));
    } catch {
      /* opcional */
    }
  };

  const handleFormDialogOpen = (data: ICustomer) => {
    setCustomerData(data);
    setOpenFormDialog(true);
  };

  const onSubmit = async (dataInvoice: {
    factura: Array<{
      id: number;
      checked: boolean;
      monto: number;
      incluirMora: boolean;
      id_plan: number | null;
    }>;
  }) => {
    setLoadingForm(true);
    try {
      const selected = dataInvoice.factura
        .filter((factura) => factura.checked)
        .map((factura) => ({
          id: factura.id,
          monto: Number(factura.monto),
          incluirMora: Boolean(factura.incluirMora),
          id_plan: factura.id_plan,
        }));
      const result = await pagos(selected);
      if (result?.pagadas?.length) {
        try {
          await downloadRecibo(result.pagadas);
        } catch {
          toast.info('Pago OK. No se pudo descargar el recibo automáticamente.');
        }
      }
      setRefres((v) => v + 1);
      setOpenFormDialog(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'No se pudo completar el cobro');
    } finally {
      setLoadingForm(false);
    }
  };

  const onCreatePlan = async () => {
    try {
      await createPlan({
        id_cliente: Number(planForm.id_cliente),
        id_factura: planForm.id_factura ? Number(planForm.id_factura) : null,
        monto_total: Number(planForm.monto_total),
        cuotas: Number(planForm.cuotas),
        notas: planForm.notas || undefined,
      });
      toast.success('Plan creado');
      setOpenPlan(false);
      setPlanForm({ id_cliente: '', id_factura: '', monto_total: '', cuotas: '3', notas: '' });
      loadPlanes();
      setTab('planes');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'No se pudo crear el plan');
    }
  };

  const onSelectClientePlan = (idCliente: string) => {
    const cliente = customers.find((c) => String(c.id) === idCliente);
    const facturas = (cliente?.factura || []) as Array<{
      id: number;
      monto: number;
      monto_pagado?: number;
      saldo?: number;
    }>;
    const primera = facturas[0];
    const saldo = primera ? facturaSaldo(primera) : 0;
    setPlanForm((f) => ({
      ...f,
      id_cliente: idCliente,
      id_factura: primera ? String(primera.id) : '',
      monto_total: primera ? String(saldo) : '',
    }));
  };

  const onSelectFacturaPlan = (idFactura: string) => {
    const factura = facturasCliente.find((f) => String(f.id) === idFactura);
    setPlanForm((f) => ({
      ...f,
      id_factura: idFactura,
      monto_total: factura ? String(facturaSaldo(factura)) : f.monto_total,
    }));
  };

  const onRevertir = async (id: number) => {
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

  const tabHint =
    tab === 'cobrar'
      ? 'Buscá al cliente y cobrá total o parcial. Si hay plan activo, el monto sugiere la cuota.'
      : tab === 'planes'
        ? 'Acuerdos de cuotas activos. Al cobrar, la cuota avanza sola.'
        : 'Últimos cobros registrados. Podés revertir un abono si fue un error.';

  return (
    <Layout sectionTitle="PAGOS">
      <>
        <Tabs
          value={tab}
          onChange={(_e, value: PagosTab) => setTab(value)}
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
            value="cobrar"
            label={
              <Stack direction="row" alignItems="center" spacing={1}>
                <span>Cobrar</span>
                <Chip size="small" label={total} color="primary" variant="outlined" />
              </Stack>
            }
          />
          <Tab
            value="planes"
            label={
              <Stack direction="row" alignItems="center" spacing={1}>
                <span>Planes</span>
                <Chip size="small" label={planes.length} variant="outlined" />
              </Stack>
            }
          />
          <Tab
            value="abonos"
            label={
              <Stack direction="row" alignItems="center" spacing={1}>
                <span>Últimos abonos</span>
                <Chip size="small" label={movimientos.length} variant="outlined" />
              </Stack>
            }
          />
        </Tabs>

        <Typography variant="body2" color="text.secondary" mb={2}>
          {tabHint}
        </Typography>

        {tab === 'cobrar' && (
          <>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={1.5}
              alignItems={{ sm: 'center' }}
              justifyContent="space-between"
              mb={2}
            >
              <TextField
                label="Buscar por nombre o cédula"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                size="small"
                sx={{ minWidth: { xs: '100%', sm: 280 } }}
              />
              {puedeOperar && (
                <Button variant="outlined" onClick={() => setOpenPlan(true)}>
                  Nuevo plan de pago
                </Button>
              )}
            </Stack>
            <Box sx={gridShellSx}>
              <DataGrid
                columns={columns}
                rows={customers}
                localeText={esES.components.MuiDataGrid.defaultProps.localeText}
                disableColumnMenu
                loading={loading}
                hideFooter
                disableRowSelectionOnClick
                sx={dataGridSx}
              />
            </Box>
            <Box display="flex" justifyContent="center" mt={2}>
              <Pagination count={pageNro} page={page} onChange={(_e, v) => setPage(v)} />
            </Box>
          </>
        )}

        {tab === 'planes' && (
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
                {planes.length === 0
                  ? 'No hay planes activos'
                  : `${planes.length} plan${planes.length === 1 ? '' : 'es'} activo${planes.length === 1 ? '' : 's'}`}
              </Typography>
              {puedeOperar && (
                <Button size="small" variant="contained" onClick={() => setOpenPlan(true)}>
                  Nuevo plan
                </Button>
              )}
            </Stack>
            <Box sx={gridShellSx}>
              <DataGrid
                rows={planes}
                columns={planeColumns}
                localeText={esES.components.MuiDataGrid.defaultProps.localeText}
                hideFooter
                disableColumnMenu
                disableRowSelectionOnClick
                sx={dataGridSx}
              />
            </Box>
          </>
        )}

        {tab === 'abonos' && (
          <Box sx={gridShellSx}>
            <DataGrid
              rows={movimientos}
              columns={movimientoColumns}
              localeText={esES.components.MuiDataGrid.defaultProps.localeText}
              hideFooter
              disableColumnMenu
              disableRowSelectionOnClick
              sx={dataGridSx}
            />
          </Box>
        )}

        <PagoForm
          onClose={() => setOpenFormDialog(false)}
          onSubmit={onSubmit}
          open={openFormDialog}
          loading={loadingForm}
          data={customerData}
        />

        <AppDialog
          open={openPlan}
          onClose={() => setOpenPlan(false)}
          eyebrow="Planes"
          title="Nuevo plan de pago"
          subtitle="Elegí cliente y factura; el monto se sugiere con el saldo."
          maxWidth="sm"
          actions={
            <>
              <Button onClick={() => setOpenPlan(false)} size="large" variant="outlined">
                Cancelar
              </Button>
              <Button
                variant="contained"
                size="large"
                onClick={onCreatePlan}
                disabled={!planForm.id_cliente || !planForm.monto_total || !planForm.cuotas}
              >
                Crear plan
              </Button>
            </>
          }
        >
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              select
              label="Cliente"
              value={planForm.id_cliente}
              onChange={(e) => onSelectClientePlan(e.target.value)}
            >
              {customers.map((c) => (
                <MenuItem key={c.id} value={String(c.id)}>
                  {c.nombre} ({c.cedula})
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Factura"
              value={planForm.id_factura}
              onChange={(e) => onSelectFacturaPlan(e.target.value)}
              disabled={!planForm.id_cliente}
            >
              {facturasCliente.map((f) => (
                <MenuItem key={f.id} value={String(f.id)}>
                  #{f.id} · {f.anio_mes || '—'} · saldo {formatGs(facturaSaldo(f))}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Monto total"
              type="number"
              value={planForm.monto_total}
              onChange={(e) => setPlanForm((f) => ({ ...f, monto_total: e.target.value }))}
              helperText="Sugerido: saldo de la factura seleccionada"
            />
            <TextField
              label="Cuotas"
              type="number"
              value={planForm.cuotas}
              onChange={(e) => setPlanForm((f) => ({ ...f, cuotas: e.target.value }))}
              inputProps={{ min: 1, max: 60 }}
            />
            <TextField
              label="Notas"
              value={planForm.notas}
              onChange={(e) => setPlanForm((f) => ({ ...f, notas: e.target.value }))}
              multiline
              minRows={2}
            />
          </Box>
        </AppDialog>
      </>
    </Layout>
  );
};
