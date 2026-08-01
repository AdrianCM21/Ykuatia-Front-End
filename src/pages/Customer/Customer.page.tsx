import {
  Box,
  Button,
  Chip,
  Pagination,
  Stack,
  TextField,
  Typography,
  alpha,
} from '@mui/material';
import Layout from '../../components/layout/Layout';
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import DeleteIcon from '@mui/icons-material/Delete';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import PaymentIcon from '@mui/icons-material/Payment';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import { useEffect, useMemo, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { toast } from 'react-toastify';
import ICustomer from '../../interfaces/customers/Customer';
import * as CustomerService from '../../services/Customers/CustomerService';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { esES } from '@mui/x-data-grid/locales';
import CustomerAddEditDialog from './components/AddEditDialog';
import DeleteDialog from '../../components/DeleteDialog';
import paginationNro from '../../config/paginationNro';
import { format } from 'date-fns';
import { FormularioDescarga } from '../../components/FormularioDescarga';
import { downloadInvoice, downloadInvoices } from '../../services/invoices/invoices.service';
import { ViewAuditoria } from '../../components/auditoria/ViewAuditoria';
import { useAuth } from '../../context/AuthContext';
import { AppDialog } from '../../components/dialogs/AppDialog';

const tipoLabel = (row: ICustomer) => {
  const tipo = row.tipoCliente as unknown;
  if (tipo && typeof tipo === 'object' && 'descripcion' in tipo) {
    return String((tipo as { descripcion?: string }).descripcion || '—');
  }
  return tipo ? String(tipo) : '—';
};

const initialsOf = (nombre?: string) => {
  if (!nombre) return '?';
  return nombre
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('');
};

const Customer = () => {
  const { can } = useAuth();
  const canWrite = can('clientes_write');
  const canCobrar = can('pagos');

  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState<ICustomer[]>([]);
  const [current, setCurrent] = useState<ICustomer | undefined>(undefined);

  const [openAddEditDialog, setOpenAddEditDialog] = useState(false);
  const [addEditLoading, setAddEditLoading] = useState(false);

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [pageNro, setPageNro] = useState(0);
  const [refres, setRefres] = useState(1);
  const [searchText, setSearchText] = useState('');
  const [query, setQuery] = useState('');
  const [total, setTotal] = useState(0);

  const [downloadLoading, setDownloadLoading] = useState(false);
  const [openDescarga, setOpenDescarga] = useState(false);

  const [openAuditoria, setOpenAuditoria] = useState(false);
  const [auditoriaData, setAuditoriaData] = useState<string[]>([]);
  const [openLecturas, setOpenLecturas] = useState(false);
  const [lecturas, setLecturas] = useState<
    Array<{
      id: number;
      consumo: number;
      fecha: string;
      origen: string;
      factura?: { id: number; anio_mes?: string } | null;
    }>
  >([]);

  const conMedidor = useMemo(
    () => customers.filter((c) => Boolean(c.nro_medidor)).length,
    [customers]
  );

  const openEdit = (row: ICustomer) => {
    const tipo = row.tipoCliente as unknown;
    if (tipo && typeof tipo === 'object' && 'id_tipo' in tipo) {
      setCurrent({
        ...row,
        tipoCliente: String((tipo as { id_tipo: number | string }).id_tipo),
      });
    } else {
      setCurrent(row);
    }
    setOpenAddEditDialog(true);
  };

  const openCreate = () => {
    setCurrent(undefined);
    setOpenAddEditDialog(true);
  };

  const columns: GridColDef[] = [
    {
      field: 'nombre',
      headerName: 'Cliente',
      flex: 0.28,
      minWidth: 200,
      renderCell: (params) => (
        <Stack direction="row" spacing={1.25} alignItems="center" sx={{ py: 0.5 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: '10px',
              display: 'grid',
              placeItems: 'center',
              fontSize: 13,
              fontWeight: 700,
              color: 'primary.contrastText',
              backgroundImage: 'linear-gradient(135deg, #0B6E6E 0%, #1F4E79 100%)',
              flexShrink: 0,
            }}
          >
            {initialsOf(params.row.nombre)}
          </Box>
          <Box minWidth={0}>
            <Typography fontWeight={700} noWrap>
              {params.row.nombre}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap>
              CI {params.row.cedula}
            </Typography>
          </Box>
        </Stack>
      ),
    },
    {
      field: 'telefono',
      headerName: 'Contacto',
      flex: 0.16,
      minWidth: 130,
      renderCell: (params) => (
        <Box>
          <Typography variant="body2">{params.row.telefono || '—'}</Typography>
          <Typography variant="caption" color="text.secondary" noWrap>
            {params.row.direccion || 'Sin dirección'}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'nro_medidor',
      headerName: 'Medidor',
      flex: 0.12,
      minWidth: 110,
      renderCell: (params) =>
        params.row.nro_medidor ? (
          <Chip size="small" variant="outlined" label={params.row.nro_medidor} />
        ) : (
          <Typography variant="body2" color="text.secondary">
            —
          </Typography>
        ),
    },
    {
      field: 'tipoCliente',
      headerName: 'Tipo',
      flex: 0.12,
      minWidth: 110,
      renderCell: (params) => (
        <Chip size="small" color="primary" variant="outlined" label={tipoLabel(params.row)} />
      ),
    },
    {
      field: 'actions',
      headerName: 'Acciones',
      flex: 0.42,
      minWidth: 360,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={0.75} alignItems="center" flexWrap="wrap" useFlexGap>
          {canWrite && (
            <Button
              size="small"
              startIcon={<EditOutlinedIcon />}
              onClick={() => openEdit(params.row)}
            >
              Editar
            </Button>
          )}
          {canCobrar && (
            <Button
              size="small"
              startIcon={<PaymentIcon />}
              component={RouterLink}
              to="/pagos"
            >
              Cobrar
            </Button>
          )}
          <Button
            size="small"
            startIcon={<WaterDropIcon />}
            onClick={async () => {
              setCurrent(params.row);
              try {
                const res = await CustomerService.getLecturasCliente(params.row.id!);
                setLecturas(res.resultado);
                setOpenLecturas(true);
              } catch {
                toast.error('No se pudo cargar el historial de lecturas');
              }
            }}
          >
            Lecturas
          </Button>
          <Button
            size="small"
            startIcon={<HistoryEduIcon />}
            onClick={() => {
              const data = params.row.auditoria?.historial_cambios || '';
              setAuditoriaData(data ? data.split(';') : []);
              setOpenAuditoria(true);
            }}
          >
            Historial
          </Button>
          <Button
            size="small"
            startIcon={<CloudDownloadIcon />}
            onClick={() => {
              setCurrent(params.row);
              setOpenDescarga(true);
            }}
          >
            Boleta
          </Button>
          {canWrite && (
            <Button
              size="small"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() => {
                setCurrent(params.row);
                setOpenDeleteDialog(true);
              }}
            >
              Eliminar
            </Button>
          )}
        </Stack>
      ),
    },
  ];

  useEffect(() => {
    const t = setTimeout(() => {
      setPage(1);
      setQuery(searchText.trim());
    }, 350);
    return () => clearTimeout(t);
  }, [searchText]);

  useEffect(() => {
    getCustomers();
  }, [page, refres, query]);

  const getCustomers = async () => {
    setLoading(true);
    try {
      const response = await CustomerService.getCustomers({ page, q: query });
      setPageNro(Math.max(1, Math.ceil(response.total / paginationNro.paginationNro)));
      setTotal(response.total);
      setCustomers(response.resultado);
    } catch {
      toast.error('Error de listado');
    }
    setLoading(false);
  };

  const handleAddEditSubmit = async (formFields: ICustomer) => {
    setAddEditLoading(true);
    try {
      if (current) {
        await CustomerService.updateCliente(formFields);
        setRefres((v) => v + 1);
        toast.success('Cliente actualizado correctamente');
      } else {
        await CustomerService.addCliente(formFields);
        setRefres((v) => v + 1);
        toast.success('Cliente agregado correctamente');
      }
      setCurrent(undefined);
      setOpenAddEditDialog(false);
    } catch (error: any) {
      if (error?.response?.status === 422) {
        setAddEditLoading(false);
        return;
      }
      toast.error('Error al guardar. Por favor vuelve a intentar.');
    }
    setAddEditLoading(false);
  };

  const handleDeleteSubmit = async () => {
    setDeleteLoading(true);
    try {
      await CustomerService.deleteCliente(String(current?.id));
      setCustomers(customers.filter((customer) => customer.id != current?.id));
      setTotal((t) => Math.max(0, t - 1));
      toast.success('Eliminado correctamente');
    } catch {
      toast.error('No se pudo eliminar');
    }
    setCurrent(undefined);
    setDeleteLoading(false);
    setOpenDeleteDialog(false);
  };

  const handleDownloadSubmit = async () => {
    setDownloadLoading(true);
    try {
      if (current?.id) {
        await downloadInvoice(current.id);
      } else {
        await downloadInvoices();
      }
    } catch {
      toast.error('Error en la descarga');
    }
    setCurrent(undefined);
    setDownloadLoading(false);
    setOpenDescarga(false);
  };

  return (
    <Layout sectionTitle="CLIENTES">
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
            alignItems={{ md: 'center' }}
            spacing={2}
          >
            <Box>
              <Typography variant="h5" sx={{ fontFamily: '"Fraunces", Georgia, serif' }}>
                Vecinos de la junta
              </Typography>
              <Typography variant="body2" color="text.secondary" mt={0.5}>
                Buscá, editá datos, mirá lecturas o descargá boletas.
              </Typography>
            </Box>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              <Chip
                color="primary"
                variant="outlined"
                label={`${total} cliente${total === 1 ? '' : 's'}`}
              />
              <Chip
                variant="outlined"
                label={`${conMedidor} con medidor (página)`}
              />
            </Stack>
          </Stack>
        </Box>

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={1.5}
          justifyContent="space-between"
          alignItems={{ sm: 'center' }}
          mb={2}
        >
          <TextField
            size="small"
            label="Buscar"
            placeholder="Nombre, cédula o teléfono"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            sx={{ minWidth: { xs: '100%', sm: 320 } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" color="action" />
                </InputAdornment>
              ),
            }}
          />
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {canWrite && (
              <Button
                variant="contained"
                startIcon={<PersonAddAltIcon />}
                onClick={openCreate}
              >
                Nuevo cliente
              </Button>
            )}
            <Button
              variant="outlined"
              startIcon={<CloudDownloadIcon />}
              onClick={() => {
                setCurrent(undefined);
                setOpenDescarga(true);
              }}
            >
              Descargar boletas
            </Button>
          </Stack>
        </Stack>

        <Box
          sx={{
            height: 480,
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
          }}
        >
          <DataGrid
            columns={columns}
            rows={customers}
            localeText={esES.components.MuiDataGrid.defaultProps.localeText}
            disableColumnMenu
            loading={loading}
            hideFooter
            disableRowSelectionOnClick
            getRowHeight={() => 'auto'}
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
          <Pagination count={pageNro} page={page} onChange={(_e, value) => setPage(value)} />
        </Box>

        {openAddEditDialog && (
          <CustomerAddEditDialog
            open={openAddEditDialog}
            loading={addEditLoading}
            onSubmit={handleAddEditSubmit}
            onClose={() => {
              setCurrent(undefined);
              setOpenAddEditDialog(false);
            }}
            current={current}
          />
        )}

        {openDeleteDialog && (
          <DeleteDialog
            open={openDeleteDialog}
            loading={deleteLoading}
            onConfirm={handleDeleteSubmit}
            onClose={() => {
              setCurrent(undefined);
              setOpenDeleteDialog(false);
            }}
          />
        )}

        {openDescarga && (
          <FormularioDescarga
            open={openDescarga}
            loading={downloadLoading}
            onConfirm={handleDownloadSubmit}
            onClose={() => {
              setCurrent(undefined);
              setOpenDescarga(false);
            }}
            oneCustomer={current?.id}
          />
        )}

        <ViewAuditoria
          onClose={() => setOpenAuditoria(false)}
          open={openAuditoria}
          data={auditoriaData}
        />

        <AppDialog
          open={openLecturas}
          onClose={() => setOpenLecturas(false)}
          eyebrow="Consumo"
          title={`Lecturas — ${current?.nombre || ''}`}
          subtitle="Historial de m³ cargados para este cliente."
          maxWidth="sm"
          actions={
            <Button onClick={() => setOpenLecturas(false)} variant="contained" size="large">
              Cerrar
            </Button>
          }
        >
          {lecturas.length === 0 ? (
            <Typography color="text.secondary">Sin lecturas registradas.</Typography>
          ) : (
            <Box sx={{ height: 340 }}>
              <DataGrid
                rows={lecturas}
                columns={[
                  {
                    field: 'fecha',
                    headerName: 'Fecha',
                    flex: 0.3,
                    valueFormatter: (v) => format(new Date(v as string), 'dd/MM/yyyy'),
                  },
                  {
                    field: 'consumo',
                    headerName: 'm³',
                    flex: 0.2,
                    valueGetter: (v) => `${v}`,
                  },
                  { field: 'origen', headerName: 'Origen', flex: 0.25 },
                  {
                    field: 'factura',
                    headerName: 'Factura',
                    flex: 0.25,
                    valueGetter: (_v, row) =>
                      row.factura?.anio_mes || (row.factura?.id ? `#${row.factura.id}` : '—'),
                  },
                ]}
                hideFooter
                disableColumnMenu
              />
            </Box>
          )}
        </AppDialog>
      </>
    </Layout>
  );
};

export default Customer;
