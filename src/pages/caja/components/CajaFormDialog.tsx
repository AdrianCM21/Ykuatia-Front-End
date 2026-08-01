import {
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Stack,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { AppDialog } from '../../../components/dialogs/AppDialog';
import { formatGs } from '../../../utils/formatGs';

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Record<string, unknown>) => void | Promise<void>;
}

type FormValues = {
  tipo_transacion: string;
  monto: string;
  motivo: string;
};

export const CajaFormDialog = ({ open, onClose, onSubmit }: Props) => {
  const { handleSubmit, control, register, reset, watch } = useForm<FormValues>({
    defaultValues: { tipo_transacion: '2', monto: '', motivo: '' },
  });
  const [loading, setLoading] = useState(false);
  const monto = Number(watch('monto') || 0);
  const tipo = watch('tipo_transacion');

  useEffect(() => {
    if (open) {
      reset({ tipo_transacion: '2', monto: '', motivo: '' });
      setLoading(false);
    }
  }, [open, reset]);

  const submit = async (data: FormValues) => {
    setLoading(true);
    try {
      await onSubmit(data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppDialog
      open={open}
      onClose={onClose}
      disableClose={loading}
      eyebrow="Caja"
      title="Registrar movimiento"
      subtitle="Anotá un ingreso o egreso manual del período abierto."
      maxWidth="sm"
      actions={
        <>
          <Button onClick={onClose} disabled={loading} size="large" variant="outlined">
            Cancelar
          </Button>
          <Button
            form="caja-movimiento-form"
            type="submit"
            loading={loading}
            variant="contained"
            size="large"
          >
            Guardar movimiento
          </Button>
        </>
      }
    >
      <form id="caja-movimiento-form" onSubmit={handleSubmit(submit)}>
        <Stack spacing={2}>
          <FormControl fullWidth required>
            <InputLabel id="tipo-operacion-label">Tipo de operación</InputLabel>
            <Controller
              name="tipo_transacion"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Select label="Tipo de operación" labelId="tipo-operacion-label" {...field}>
                  <MenuItem value="2">Ingreso</MenuItem>
                  <MenuItem value="1">Egreso</MenuItem>
                </Select>
              )}
            />
          </FormControl>

          <TextField
            {...register('monto', { required: true, min: 1 })}
            fullWidth
            label="Monto"
            type="number"
            inputProps={{ min: 1 }}
            required
            helperText={monto > 0 ? `${tipo === '1' ? 'Egreso' : 'Ingreso'} de ${formatGs(monto)}` : ' '}
          />

          <TextField
            {...register('motivo', { required: true, minLength: 2, maxLength: 80 })}
            fullWidth
            label="Motivo"
            required
            multiline
            minRows={2}
            inputProps={{ maxLength: 80 }}
            helperText="Máximo 80 caracteres"
          />
        </Stack>
      </form>
    </AppDialog>
  );
};
