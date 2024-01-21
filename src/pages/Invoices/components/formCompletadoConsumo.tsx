// FormDialog.tsx
import { LoadingButton } from "@mui/lab";
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from "@mui/material";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

interface FormDialogProps {
    open: boolean;
    loading: boolean;
    onClose: () => void;
    idInvoice: number;
    onSubmit: (data: any) => void;
}


export const FormCompletadoConsumo = ({ loading ,open, onClose, idInvoice,onSubmit }: FormDialogProps) => {

 
    const { register,control, handleSubmit, formState: { errors }, reset } = useForm();

    useEffect(() => {
        reset({
            consumo: 0,
            id: idInvoice ?? 0
        });
    }, [idInvoice, reset]);


    return (
        <Dialog
            open={open}
            onClose={onClose}
        >
            <DialogTitle>Cargar Consumo</DialogTitle>
            <DialogContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="consumo"
                        label="Consumo"
                        type="number"
                        fullWidth
                        {...register("consumo", { required: true })}
                        error={errors.consumo ? true : false}
                        helperText={errors.consumo && "Este campo es requerido"}
                    />
                    <DialogActions>
                        <Button onClick={onClose}>Cancelar</Button>
                        <LoadingButton loading={loading}  type="submit">Guardar</LoadingButton>
                    </DialogActions>
                    <Controller
                        name='id'
                        control={control}
                        render={({ field: { value } }) => (
                            <input type={"hidden"} value={value}/>
                        )}
                    />
                </form>
            </DialogContent>
        </Dialog>
    );
};