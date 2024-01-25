import Button from '@mui/material/Button'
import LoadingButton from '@mui/lab/LoadingButton'
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete';

interface IProps {
  open: boolean
  loading: boolean
  onConfirm: () => void
  onClose: () => void
}

const DeleteDialog = ({ open, loading, onConfirm, onClose }: IProps) => {

  const handleDialogClose = (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    reason: "backdropClick" | "escapeKeyDown"
  ) => {
    onClose();
  };

  return (
    <>
      <Dialog
        fullWidth
        open={open}
        maxWidth='sm'
        scroll='body'
        onClose={handleDialogClose}
      >
        <DialogTitle>{'CONFIRMAR ELIMINACIÓN'}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {'Esta seguro de que desea eliminar el registro?'}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'right' }}>
          <LoadingButton size='large' color='error' type='submit' variant='contained' startIcon={<DeleteIcon />} onClick={onConfirm} loading={loading}>
            Eliminar
          </LoadingButton>
          <Button size='large' variant='outlined' onClick={onClose}>
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
};

export default DeleteDialog;
