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

export const MayorDeudaGuaranies: React.FC<DialogComponentProps> = ({ open, handleClose, title,data }) => {
    const [mayorDeuda, setMayorDeuda] = useState<any[]>([]);
    const [maxDeuda, setMaxDeuda] = useState<number>(0);
    useEffect(() => {
        getDataDeudas(data);
    }, [data]);
    const getDataDeudas=(data:ICustomer[])=>{
        if (!data) {
            return;
        }
        const result = data.map((item) => {
            const sum = item.factura.reduce((a, b) => a + Number(b.monto), 0);
            return {cliente:item.nombre, deuda:sum}
        });
        setMayorDeuda(result);
        setMaxDeuda(Math.max(...result.map(item => item.deuda)));    
    }

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="lg">
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <ResponsiveContainer width="95%" height={400}>
                    <BarChart data={mayorDeuda}>
                        <CartesianGrid strokeDasharray="14 14" />
                        <XAxis dataKey="cliente">
                            <Label value="Clientes" offset={-5} position="insideBottom" />
                        </XAxis>
                        <YAxis  domain={[0, maxDeuda]} scale="auto">
                            <Label value="Deuda (Guaraníes)" angle={-90} position="insideLeft" />
                        </YAxis>
                        <Tooltip />
                        <Legend verticalAlign="top" wrapperStyle={{ lineHeight: '40px' }} />
                        <Bar dataKey="deuda" fill="#4682B4" name="Deuda" />
                    </BarChart>
                </ResponsiveContainer>
            </DialogContent>
        </Dialog>
    );
};