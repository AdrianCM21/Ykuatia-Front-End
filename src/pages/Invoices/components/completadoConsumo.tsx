import { Box, Button } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { esES } from '@mui/x-data-grid/locales';
import { IInvoice } from '../../../interfaces/invoices/IInvoices';
import { useEffect, useState } from 'react';
import { FormCompletadoConsumo } from './formCompletadoConsumo';
import { envioConsumo } from '../../../services/invoices/invoices.service';
import { format } from 'date-fns';
import { AppDialog } from '../../../components/dialogs/AppDialog';
import { labelEstadoFactura } from '../../../utils/estadoFactura';

interface IProps {
  open: boolean;
  onClose: () => void;
  oneCustomer?: number;
  data: IInvoice[];
}

export const CompletadoConsumo = ({ data, open, onClose }: IProps) => {
  const [openFormDialog, setOpenFormDialog] = useState(false);
  const [idInvoice, setIdInvoice] = useState(0);
  const [loadingForm, setLoadingForm] = useState(false);
  const [datosTable, setDatosTable] = useState<IInvoice[]>(data);

  useEffect(() => {
    if (open) setDatosTable(data);
  }, [open, data]);

  const handleFormDialogOpen = (id: number) => {
    setIdInvoice(id);
    setOpenFormDialog(true);
  };

  const onSubmit = async (dataInvoice: { consumo: number; id: number }) => {
    try {
      setLoadingForm(true);
      const response = await envioConsumo(dataInvoice.id, dataInvoice.consumo);
      setDatosTable((prev) => prev.filter((d) => d.id !== response.message.id));
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingForm(false);
      setOpenFormDialog(false);
    }
  };

  const columns: GridColDef[] = [
    {
      field: 'Fecha_emicion',
      headerName: 'Período',
      flex: 0.2,
      valueGetter: (_v, row) =>
        row.anio_mes || (row.Fecha_emicion ? format(new Date(row.Fecha_emicion), 'MM/yyyy') : '—'),
    },
    {
      field: 'cliente',
      headerName: 'Cliente',
      flex: 0.3,
      valueGetter: (_v, row) => row.cliente?.nombre || '—',
    },
    {
      field: 'estado',
      headerName: 'Estado',
      flex: 0.25,
      valueGetter: (_v, row) => labelEstadoFactura(row.estado),
    },
    {
      field: 'action',
      headerName: 'Acción',
      flex: 0.25,
      sortable: false,
      renderCell: (params) => (
        <Button size="small" variant="contained" onClick={() => handleFormDialogOpen(params.row.id)}>
          Cargar consumo
        </Button>
      ),
    },
  ];

  return (
    <>
      <AppDialog
        open={open}
        onClose={onClose}
        eyebrow="Facturas"
        title="Cargar consumos pendientes"
        subtitle="Seleccioná una boleta y cargá los m³ del medidor."
        maxWidth="md"
        actions={
          <Button onClick={onClose} variant="contained" size="large">
            Cerrar
          </Button>
        }
      >
        <Box sx={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={datosTable}
            columns={columns}
            localeText={esES.components.MuiDataGrid.defaultProps.localeText}
            hideFooter
            disableColumnMenu
          />
        </Box>
      </AppDialog>

      <FormCompletadoConsumo
        loading={loadingForm}
        onSubmit={onSubmit}
        idInvoice={idInvoice}
        open={openFormDialog}
        onClose={() => setOpenFormDialog(false)}
      />
    </>
  );
};
