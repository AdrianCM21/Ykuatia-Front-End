import { Button, TextField, Stack, Typography } from '@mui/material';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { AppDialog } from '../../../components/dialogs/AppDialog';

interface FormDialogProps {
  open: boolean;
  loading: boolean;
  onClose: () => void;
  idInvoice: number;
  onSubmit: (data: { consumo: number; id: number }) => void;
}

type FormValues = {
  consumo: number;
  id: number;
};

export const FormCompletadoConsumo = ({
  loading,
  open,
  onClose,
  idInvoice,
  onSubmit,
}: FormDialogProps) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>();

  useEffect(() => {
    if (!open) return;
    reset({
      consumo: 0,
      id: idInvoice ?? 0,
    });
  }, [open, idInvoice, reset]);

  return (
    <AppDialog
      open={open}
      onClose={onClose}
      disableClose={loading}
      eyebrow="Factura"
      title="Cargar consumo"
      subtitle="Ingresá los m³ leídos del medidor para esta boleta."
      maxWidth="xs"
      actions={
        <>
          <Button onClick={onClose} disabled={loading} size="large" variant="outlined">
            Cancelar
          </Button>
          <Button
            form="consumo-form"
            type="submit"
            loading={loading}
            variant="contained"
            size="large"
          >
            Guardar consumo
          </Button>
        </>
      }
    >
      <form id="consumo-form" onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          <Typography variant="body2" color="text.secondary">
            Factura #{idInvoice}
          </Typography>
          <TextField
            autoFocus
            label="Consumo (m³)"
            type="number"
            fullWidth
            inputProps={{ min: 0, step: 1 }}
            {...register('consumo', {
              required: 'Ingresá el consumo',
              valueAsNumber: true,
              min: { value: 0, message: 'El consumo no puede ser negativo' },
            })}
            error={Boolean(errors.consumo)}
            helperText={errors.consumo?.message || 'Usá la lectura del medidor'}
          />
          <Controller
            name="id"
            control={control}
            render={({ field }) => <input type="hidden" {...field} />}
          />
        </Stack>
      </form>
    </AppDialog>
  );
};
