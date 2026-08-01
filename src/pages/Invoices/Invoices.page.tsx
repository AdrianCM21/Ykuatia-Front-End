import {
  Badge,
  Box,
  Button,
  Grid,
  Pagination,
  TextField,
  Typography,
} from '@mui/material';
import Layout from '../../components/layout/Layout';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { IInvoice } from '../../interfaces/invoices/IInvoices';
import * as InvoiceService from '../../services/invoices/invoices.service';
import { DataGrid, GridColDef, GridSortModel } from '@mui/x-data-grid';
import { esES } from '@mui/x-data-grid/locales';
import paginationNro from '../../config/paginationNro';
import { format } from 'date-fns';
import { CompletadoConsumo } from './components/completadoConsumo';
import { labelEstadoFactura } from '../../utils/estadoFactura';
import { AppDialog } from '../../components/dialogs/AppDialog';

export const Invoices = () => {
  const [loading, setLoading] = useState(false);
  const [invoices, setInvoices] = useState<IInvoice[]>([]);
  const [hasNotification, setHasNotification] = useState(false);
  const [page, setPage] = useState(1);
  const [pageNro, setPageNro] = useState(0);
  const [total, setTotal] = useState(0);
  const [refres, setRefres] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [query, setQuery] = useState('');
  const [openCompletadoConsumo, setOpenCompletadoConsumo] = useState(false);
  const [confirmGenerar, setConfirmGenerar] = useState(false);
  const [generating, setGenerating] = useState(false);

  const columns: GridColDef[] = [
    { flex: 0.1, field: 'id', headerName: 'ID' },
    {
      flex: 0.15,
      field: 'anio_mes',
      headerName: 'Período',
      valueGetter: (_v, row) =>
        row.anio_mes || format(new Date(row.Fecha_emicion), 'yyyy-MM'),
    },
    {
      flex: 0.22,
      field: 'estado',
      headerName: 'Estado',
      valueGetter: (value) => labelEstadoFactura(String(value)),
    },
    {
      flex: 0.15,
      field: 'monto',
      headerName: 'Monto',
      valueGetter: (value) => `${Number(value).toLocaleString('es-PY')} Gs`,
    },
    {
      flex: 0.22,
      field: 'cliente',
      headerName: 'Cliente',
      valueGetter: (_v, row) => row.cliente?.nombre,
    },
    {
      flex: 0.22,
      field: 'actions',
      headerName: 'Acciones',
      sortable: false,
      renderCell: (params) => (
        <Button
          size="small"
          onClick={() => InvoiceService.downloadInvoice(params.row.cliente?.id || params.row.id)}
        >
          Boleta
        </Button>
      ),
    },
  ];

  const sortModel: GridSortModel = [{ field: 'estado', sort: 'asc' }];

  useEffect(() => {
    const t = setTimeout(() => {
      setPage(1);
      setQuery(searchText.trim());
    }, 350);
    return () => clearTimeout(t);
  }, [searchText]);

  useEffect(() => {
    getInvoices();
    checkNotificaciones();
  }, [page, refres, query]);

  const checkNotificaciones = async () => {
    const result = await InvoiceService.checkInvoices();
    setHasNotification(result);
  };

  const getInvoices = async () => {
    setLoading(true);
    try {
      const response = await InvoiceService.getInvoices({ page, q: query });
      setPageNro(Math.max(1, Math.ceil(response.total / paginationNro.paginationNro)));
      setTotal(response.total);
      setInvoices(response.resultado);
    } catch {
      toast.error('Error de listado');
    }
    setLoading(false);
  };

  const handleGenerarMes = async () => {
    setGenerating(true);
    try {
      const result = await InvoiceService.generarMes();
      toast.success(
        `Generadas: ${result.generadas}. Omitidas (ya existían): ${result.omitidas}.`
      );
      setConfirmGenerar(false);
      setRefres((v) => v + 1);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'No se pudo generar el mes');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <Layout sectionTitle="FACTURAS">
      <>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box display="flex" justifyContent="space-between" gap={2} flexWrap="wrap" mb={2}>
              <TextField
                size="small"
                label="Buscar cliente, cédula o estado"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                sx={{ minWidth: 280 }}
              />
              <Box display="flex" gap={1} flexWrap="wrap">
                <Button variant="outlined" onClick={() => InvoiceService.downloadInvoices()}>
                  Descargar boletas
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => setConfirmGenerar(true)}
                >
                  Generar facturas del mes
                </Button>
                <Badge color="error" variant="dot" invisible={!hasNotification}>
                  <Button variant="contained" onClick={() => setOpenCompletadoConsumo(true)}>
                    Completar consumo
                  </Button>
                </Badge>
              </Box>
            </Box>
            <Typography variant="body2" color="text.secondary" mb={1}>
              {total} facturas encontradas
            </Typography>
            <Box sx={{ height: 440 }}>
              <DataGrid
                columns={columns}
                rows={invoices}
                localeText={esES.components.MuiDataGrid.defaultProps.localeText}
                disableColumnMenu
                loading={loading}
                hideFooter
                sortModel={sortModel}
              />
            </Box>
            <Box display="flex" justifyContent="center" mt={1}>
              <Pagination count={pageNro} page={page} onChange={(_e, v) => setPage(v)} />
            </Box>
          </Grid>
        </Grid>

        {openCompletadoConsumo && (
          <CompletadoConsumo
            open={openCompletadoConsumo}
            onClose={() => {
              setOpenCompletadoConsumo(false);
              setRefres((v) => v + 1);
            }}
            data={invoices.filter((invoice) => invoice.estado === 'pendiente a carga de consumo')}
          />
        )}

        <AppDialog
          open={confirmGenerar}
          onClose={() => !generating && setConfirmGenerar(false)}
          disableClose={generating}
          eyebrow="Facturas"
          title="Generar facturas del mes"
          subtitle="Se crearán boletas solo para clientes que aún no tengan una del mes actual."
          maxWidth="xs"
          scrollable={false}
          actions={
            <>
              <Button disabled={generating} onClick={() => setConfirmGenerar(false)} size="large" variant="outlined">
                Cancelar
              </Button>
              <Button loading={generating} variant="contained" size="large" onClick={handleGenerarMes}>
                Generar
              </Button>
            </>
          }
        >
          <Typography variant="body2" color="text.secondary">
            Las facturas existentes del mes se omiten automáticamente.
          </Typography>
        </AppDialog>
      </>
    </Layout>
  );
};
