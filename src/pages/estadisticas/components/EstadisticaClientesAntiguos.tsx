import { Dialog, DialogTitle, DialogContent } from '@mui/material';
import { BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar, ResponsiveContainer, Label } from 'recharts';
import ICustomer from '../../../interfaces/customers/Customer';
import { useEffect, useState } from 'react';
import { differenceInMonths } from 'date-fns'; 

interface DialogComponentProps {
    open: boolean;
    handleClose: () => void;
    title: string;
    data:ICustomer[];
}

export const ClientesAntiguos: React.FC<DialogComponentProps> = ({ open, handleClose, title,data }) => {
    const [clientesAntiguos, setClientesAntiguos] = useState<any[]>([]);
    const [maxAntiguedad, setMaxAntiguedad] = useState<number>(0);
    useEffect(() => {
        getDataAntiguedad(data);
    }, [data]);
    const getDataAntiguedad=(data:ICustomer[])=>{
        if (!data) {
            return;
        }
        const result = data.map((item) => {
            const antiguedad = differenceInMonths(new Date(), new Date(item.fecha_creacion));
            console.log(antiguedad)
            return {cliente:item.nombre,antiguedad}
        });
        setClientesAntiguos(result);
        setMaxAntiguedad(Math.max(...result.map(item => item.antiguedad)));    
    }

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="lg">
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <ResponsiveContainer width="95%" height={400}>
                    <BarChart data={clientesAntiguos}>
                        <CartesianGrid strokeDasharray="14 14" />
                        <XAxis dataKey="cliente">
                            <Label value="Clientes" offset={-5} position="insideBottom" />
                        </XAxis>
                        <YAxis domain={[0, maxAntiguedad]}>
                            <Label value="Antigüedad (meses)" angle={-90} position="insideLeft" />
                        </YAxis>
                        <Tooltip />
                        <Legend verticalAlign="top" wrapperStyle={{ lineHeight: '40px' }} />
                        <Bar dataKey="antiguedad" fill="#4682B4" name="Antigüedad" />
                    </BarChart>
                </ResponsiveContainer>
            </DialogContent>
        </Dialog>
    );
};