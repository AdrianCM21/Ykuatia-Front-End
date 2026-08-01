import { Button, Typography } from '@mui/material';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import { AppDialog } from './dialogs/AppDialog';

interface IProps {
  open: boolean;
  loading: boolean;
  onConfirm: () => void;
  onClose: () => void;
  oneCustomer?: number;
}

export const FormularioDescarga = ({ open, loading, onConfirm, onClose, oneCustomer }: IProps) => {
  return (
    <AppDialog
      open={open}
      onClose={onClose}
      disableClose={loading}
      eyebrow="Boletas"
      title="Descargar PDF"
      subtitle={
        oneCustomer
          ? 'Se descargará la boleta del cliente seleccionado.'
          : 'Se descargará el PDF con las facturas pendientes.'
      }
      maxWidth="xs"
      scrollable={false}
      actions={
        <>
          <Button size="large" variant="outlined" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button
            size="large"
            variant="contained"
            startIcon={<CloudDownloadIcon />}
            onClick={onConfirm}
            loading={loading}
          >
            Descargar
          </Button>
        </>
      }
    >
      <Typography variant="body2" color="text.secondary">
        El archivo se abrirá o guardará según la configuración de tu navegador.
      </Typography>
    </AppDialog>
  );
};
