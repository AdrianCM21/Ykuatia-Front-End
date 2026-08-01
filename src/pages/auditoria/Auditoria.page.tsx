import { useEffect, useState } from 'react';
import Layout from '../../components/layout/Layout';
import { Box, Button, Chip, Pagination, TextField, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { esES } from '@mui/x-data-grid/locales';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import { EventoAuditoria, getEventos } from '../../services/auditoria/auditoria.service';
import paginationNro from '../../config/paginationNro';
import {
  labelAccionAuditoria,
  resumenDetalleAuditoria,
} from '../../utils/auditoriaDetalle';
import { EventoDetalleDialog } from '../../components/auditoria/EventoDetalleDialog';

export const AuditoriaPage = () => {
  const [rows, setRows] = useState<EventoAuditoria[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageNro, setPageNro] = useState(1);
  const [searchText, setSearchText] = useState('');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<EventoAuditoria | null>(null);

  useEffect(() => {
    const t = setTimeout(() => {
      setPage(1);
      setQuery(searchText.trim());
    }, 350);
    return () => clearTimeout(t);
  }, [searchText]);

  useEffect(() => {
    load();
  }, [page, query]);

  const load = async () => {
    setLoading(true);
    try {
      const response = await getEventos({ page, q: query || undefined });
      setRows(response.resultado);
      setPageNro(Math.max(1, Math.ceil(response.total / paginationNro.paginationNro)));
    } catch {
      toast.error('Error al listar auditoría');
    }
    setLoading(false);
  };

  const columns: GridColDef[] = [
    {
      field: 'created_at',
      headerName: 'Cuándo',
      flex: 0.16,
      valueFormatter: (value) => format(new Date(value as string), 'dd/MM/yyyy HH:mm'),
    },
    {
      field: 'usuario',
      headerName: 'Quién',
      flex: 0.14,
      valueGetter: (_v, row) => row.usuario?.Nombre || 'Sistema',
    },
    {
      field: 'accion',
      headerName: 'Acción',
      flex: 0.18,
      renderCell: (params) => (
        <Chip
          size="small"
          variant="outlined"
          color="primary"
          label={labelAccionAuditoria(String(params.value || ''))}
        />
      ),
    },
    {
      field: 'entidad',
      headerName: 'Entidad',
      flex: 0.12,
      valueGetter: (_v, row) =>
        row.entidad_id != null ? `${row.entidad} #${row.entidad_id}` : row.entidad,
    },
    {
      field: 'detalle',
      headerName: 'Detalle',
      flex: 0.28,
      sortable: false,
      valueGetter: (_v, row) => resumenDetalleAuditoria(row.accion, row.detalle),
    },
    {
      field: 'actions',
      headerName: '',
      width: 110,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Button size="small" onClick={() => setSelected(params.row)}>
          Ver detalle
        </Button>
      ),
    },
  ];

  return (
    <Layout sectionTitle="AUDITORÍA">
      <>
        <Typography color="text.secondary" mb={2}>
          Registro de quién hizo qué y cuándo (pagos, caja, tarifas y más). Abrí el detalle para ver
          montos, planes y estados.
        </Typography>
        <TextField
          size="small"
          label="Buscar acción, detalle o usuario"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          sx={{ mb: 2, minWidth: 280 }}
        />
        <Box sx={{ height: 460 }}>
          <DataGrid
            rows={rows}
            columns={columns}
            loading={loading}
            hideFooter
            disableRowSelectionOnClick
            localeText={esES.components.MuiDataGrid.defaultProps.localeText}
            onRowDoubleClick={(params) => setSelected(params.row)}
          />
        </Box>
        <Box display="flex" justifyContent="center" mt={1}>
          <Pagination count={pageNro} page={page} onChange={(_e, v) => setPage(v)} />
        </Box>

        <EventoDetalleDialog
          open={Boolean(selected)}
          evento={selected}
          onClose={() => setSelected(null)}
        />
      </>
    </Layout>
  );
};
