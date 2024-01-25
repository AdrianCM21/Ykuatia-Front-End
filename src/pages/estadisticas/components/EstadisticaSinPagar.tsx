import { Dialog, DialogTitle, DialogContent } from '@mui/material';
import { BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar, ResponsiveContainer, Label } from 'recharts';
import ICustomer from '../../../interfaces/customers/Customer';
import { useEffect, useState } from 'react';

interface DialogComponentProps {
    open: boolean;
    handleClose: () => void;
    title: string;
    data:ICustomer[];
}

export const SinPagar: React.FC<DialogComponentProps> = ({ open, handleClose, title,data }) => {
    const [mayorConsumo, setMayorConsumo] = useState<any[]>([]);
    const [maxConsumo, setMaxConsumo] = useState<number>(0);
    useEffect(() => {
        getDataDeudas(data);
    }, [data]);
    const getDataDeudas=(data:ICustomer[])=>{
        if (!data) {
            return;
        }
        const result = data.map((item) => {
            const count = item.factura.length;
            return {cliente:item.nombre,numeroFactura:count}
        });
        setMayorConsumo(result);
        setMaxConsumo(Math.max(...result.map(item => item.numeroFactura)));    }


    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="lg">
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <ResponsiveContainer width="95%" height={400}>
                    <BarChart data={mayorConsumo}>
                        <CartesianGrid strokeDasharray="14 14" />
                        <XAxis dataKey="cliente">
                            <Label value="Clientes" offset={-5} position="insideBottom" />
                        </XAxis>
                        <YAxis domain={[0, maxConsumo]}>
                        <Label value="Facturas adeudadas" angle={-90} position="insideLeft" />
                        </YAxis>
                        <Tooltip />
                        <Legend verticalAlign="top" wrapperStyle={{ lineHeight: '40px' }} />
                        <Bar dataKey="numeroFactura" fill="#4682B4" name="Facturas Adeudadas" />
                    </BarChart>
                </ResponsiveContainer>
            </DialogContent>
        </Dialog>
    );
};