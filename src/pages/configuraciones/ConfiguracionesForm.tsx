// ConfiguracionesPage.jsx

import { useForm, Controller } from "react-hook-form";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Input,
  IconButton,
} from "@mui/material";
import SettingsIcon from '@mui/icons-material/Settings';
import { LoadingButton } from "@mui/lab";
import { useEffect } from "react";
import { ITipoCliente } from "../../interfaces/configuracion/configuracion";

interface ConfiguracionesFormProps {
  loading: boolean;
  onSubmit: (data: any) => void;
  onOpen: () => void;
  open:boolean
  onClose: () => void;
  data:ITipoCliente[]
}

export const ConfiguracionesForm= ({ loading, onSubmit, onOpen, onClose,open,data }: ConfiguracionesFormProps) => {
  const { control,reset, handleSubmit } = useForm();
  useEffect(() => {

    reset({
      precioFijo: data.length>1 ?data[0].tarifa: 0,
      precioPorLitro:data.length>1 ?data[1].tarifa: 0,
    });
}, [data, reset]);

  return (
      <Box p={3}>
        <IconButton color="primary" onClick={onOpen}>
          <SettingsIcon />
          Abrir Configuraciones
        </IconButton>
        <Dialog open={open} onClose={onClose}>
          <DialogTitle>Configuraciones</DialogTitle>
          <DialogContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <FormControl fullWidth margin="normal">
                <InputLabel htmlFor="precio-fijo">Precio Fijo</InputLabel>
                <Controller
                  name="precioFijo"
                  control={control}
                  render={({ field }) => (
                    <Input id="precio-fijo" type="number" {...field} inputProps={{ min: 0, step: 1 }} />
                  )}
                />
              </FormControl>
              <FormControl fullWidth margin="normal">
                <InputLabel htmlFor="precio-por-litro">Precio por Litro</InputLabel>
                <Controller
                  name="precioPorLitro"
                  control={control}
                  render={({ field }) => (
                    <Input id="precio-por-litro" type="number" {...field} inputProps={{ min: 0, step: 0.01 }} />
                  )}
                />
              </FormControl>
              <Box mt={3}>
                <LoadingButton loading={loading} type="submit" variant="contained" color="primary" size="large">
                  Guardar Configuraciones
                </LoadingButton>
              </Box>
            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose}>Cerrar</Button>
          </DialogActions>
        </Dialog>
      </Box>
  );
};
