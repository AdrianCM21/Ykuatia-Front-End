
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Box,
  Typography,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';

interface Props {
  open:boolean
  onClose:()=>void
  onSubmit:(data:any)=>void
}

export const CajaFormDialog = ({ open, onClose,onSubmit }:Props) => {
  const { handleSubmit, control, register } = useForm();

 
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h5">Módulo de Caja</Typography>
      </DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl fullWidth variant="outlined" margin="normal">
            <InputLabel id="tipo-operacion-label">Tipo de Operación</InputLabel>
            <Controller
              name="tipo_transacion"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <Select
                  label="Tipo de Operación"
                  labelId="tipo-operacion-label"
                  {...field}
                >
                  <MenuItem value="2">Ingreso</MenuItem>
                  <MenuItem value="1">Egreso</MenuItem>
                </Select>
              )}
            />
          </FormControl>

          <TextField
            {...register('monto')}
            fullWidth
            label="Monto"
            variant="outlined"
            margin="normal"
            type="number"
          />

          <TextField
            {...register('motivo')}
            fullWidth
            label="Razón"
            variant="outlined"
            margin="normal"
          />

          <Box mt={2}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Agregar Operación
            </Button>
          </Box>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancelar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

