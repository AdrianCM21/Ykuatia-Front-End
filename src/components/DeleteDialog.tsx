import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import { Typography } from '@mui/material';
import { AppDialog } from './dialogs/AppDialog';

interface IProps {
  open: boolean;
  loading: boolean;
  onConfirm: () => void;
  onClose: () => void;
  title?: string;
  description?: string;
}

const DeleteDialog = ({
  open,
  loading,
  onConfirm,
  onClose,
  title = 'Eliminar registro',
  description = 'Esta acción no se puede deshacer. ¿Confirmás que querés eliminar este registro?',
}: IProps) => {
  return (
    <AppDialog
      open={open}
      onClose={onClose}
      disableClose={loading}
      eyebrow="Confirmación"
      title={title}
      subtitle={description}
      maxWidth="xs"
      scrollable={false}
      actions={
        <>
          <Button size="large" variant="outlined" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button
            size="large"
            color="error"
            variant="contained"
            startIcon={<DeleteIcon />}
            onClick={onConfirm}
            loading={loading}
          >
            Eliminar
          </Button>
        </>
      }
    >
      <Typography variant="body2" color="text.secondary">
        Revisá que sea el registro correcto antes de continuar.
      </Typography>
    </AppDialog>
  );
};

export default DeleteDialog;
