import { Button, Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText } from "@mui/material";
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import { LoadingButton } from "@mui/lab";


interface IProps {
    open: boolean
    loading: boolean
    onConfirm: () => void
    onClose: () => void
    oneCustomer?: number
  }

export const FormularioDescarga = ({ open, loading, onConfirm, onClose }: IProps) => {
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
            <DialogTitle>{'CONFIRMAR DESCARGA'}</DialogTitle>
            <DialogContent>
              <DialogContentText>
                {'Desea descargar el archivo PDF del Kude?'}
              </DialogContentText>
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'right' }}>
              <LoadingButton size='large' color='success' type='submit' variant='contained' startIcon={<CloudDownloadIcon />} onClick={onConfirm} loading={loading}>
                Descargar
              </LoadingButton>
              <Button size='large' variant='outlined' onClick={onClose}>
                Cancelar
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )
    };