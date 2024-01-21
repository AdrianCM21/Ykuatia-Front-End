// FormDialog.tsx
import { LoadingButton } from "@mui/lab";
import { Dialog, DialogTitle, DialogContent,  DialogActions, Button,  Checkbox,  Typography, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Divider, Box } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import ICustomer from "../../../interfaces/customers/Customer";
import { format } from "date-fns";
import { useEffect, useState } from "react";


interface FormDialogProps {
    data:ICustomer | undefined;
    open: boolean;
    loading: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
}

export const PagoForm = ({data, loading ,open, onClose,onSubmit }: FormDialogProps) => {
    const [total, setTotal] = useState(0);
    const defaultValues = {
        id: data?.id ?? 0,
        factura: (data?.factura ?? []).map((factura) => ({
            id: factura?.id ?? 0,
            checked: false
        }))
    }
    const { control, handleSubmit,reset } = useForm({defaultValues});
    useEffect(() => {
        setTotal(0);
        reset({
            id: data?.id ?? 0,
            factura: (data?.factura ?? []).map((factura) => ({
                id: factura?.id ?? 0,
                checked: false
            }))
        });
    }, [data, reset]);

    const handleCheckboxChange = (checked:boolean, monto:number) => {
        setTotal(checked ? total + monto : total - monto);
    };
    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            sx={{ '.MuiPaper-root': { padding: '1rem' } }} // Agrega espaciado
        >
            <DialogTitle align="center" fontSize={25}>Realizar pago de factura</DialogTitle>
            <DialogContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Box mb={2}> {/* Agrega espaciado */}
                        <Typography variant="h6">Cliente: {data?.nombre}</Typography>
                    </Box>
                    <Divider /> {/* Línea de separación */}
                    <TableContainer>
                        <Table sx={{ border: '1px solid #ddd' }}> {/* Agrega un borde a la tabla */}
                            <TableHead>
                                <TableRow>
                                    <TableCell>Fecha de emicion</TableCell>
                                    <TableCell>Monto a pagar</TableCell>
                                    <TableCell>
                                        Pagar
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {data?.factura?.map((factura, index) => (
                                    <TableRow key={factura.id} sx={{ '&:nth-of-type(odd)': { backgroundColor: '#f9f9f9' } }}> {/* Agrega rayas a las filas */}
                                        <TableCell>{format(new Date(factura.Fecha_emicion), 'MM/yyyy')}</TableCell>
                                        <TableCell>{factura.monto}</TableCell>
                                        <TableCell>
                                            <Controller
                                                control={control}
                                                name={`factura.${index}.checked`}
                                                render={({ field }) => (
                                                    <Checkbox
                                                    {...field}
                                                    checked={field.value}
                                                    onChange={(e) => {
                                                        field.onChange(e.target.checked);
                                                        handleCheckboxChange(e.target.checked,Number( factura.monto));
                                                    }}
                                                />
                                                )}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Box mt={2}> {/* Agrega espaciado */}
                        <Typography variant="h6">Total a pagar: {total}</Typography>
                    </Box>
                    <DialogActions>
                        <Button onClick={onClose}>Cancelar</Button>
                        <LoadingButton loading={loading} type="submit" color="primary"> {/* Cambia el color del botón */}
                            Guardar
                        </LoadingButton>
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