import { Dialog, DialogTitle, DialogContent } from '@mui/material';
import { CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Label, LineChart, Line } from 'recharts';
import { useEffect, useState } from 'react';
import { DateRangeFilter } from '../../../components/DateRangeFilter';
import { IInvoice } from '../../../interfaces/invoices/IInvoices';
import { endOfMonth, format, startOfMonth } from 'date-fns';

interface DialogComponentProps {
    open: boolean;
    handleClose: () => void;
    title: string;
    data:IInvoice[];
}

export const MayorConsumo: React.FC<DialogComponentProps> = ({ open, handleClose, title, data }) => {
    const [mayorConsumo, setMayorConsumo] = useState<any[]>([]);
    const [maxConsumo, setMaxConsumo] = useState<number>(0);
    const [rangoTiempo, setRangoTiempo] = useState<{ startDate: Date, endDate: Date, key: string }[]>([
        { 
            startDate: startOfMonth(new Date()), 
            endDate: endOfMonth(new Date()), 
            key: 'selection' 
        }
    ]);

    useEffect(() => {
        getDataMayorConsumo(data);
    }, [data, rangoTiempo]);

    const getDataMayorConsumo=(data:IInvoice[])=>{
        if (!data) {
            return;
        }
        const startDate = rangoTiempo[0].startDate;
        const endDate = rangoTiempo[0].endDate;

        const result = data.reduce<{ [key: string]: { fecha: string, consumo: number } }>((acc, item) => {
            const fechaEmision = new Date(item.Fecha_emicion);
            if (startDate && endDate && fechaEmision >= startDate && fechaEmision <= endDate) {
                const fechaFormateada = format(fechaEmision, 'MM/yyyy');
                if (!acc[fechaFormateada]) {
                    acc[fechaFormateada] = { fecha: fechaFormateada, consumo: 0 };
                }
                acc[fechaFormateada].consumo += Number(item.consumo);
            }
            return acc;
        }, {});

        const arrayResult = Object.values(result);
        setMayorConsumo(arrayResult);
        setMaxConsumo(Math.max(...arrayResult.map(item => item.consumo)));    
    }
    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="lg">
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <DateRangeFilter dateRange={rangoTiempo} setDateRange={setRangoTiempo} />
                <ResponsiveContainer width="95%" height={400}>
                    <LineChart data={mayorConsumo}>
                        <CartesianGrid strokeDasharray="14 14" />
                        <XAxis dataKey="fecha" offset={-5}/>
                           
                        <YAxis domain={[0, maxConsumo]}>
                            <Label value="Consumo (Lts)" angle={-90} position="insideLeft" />
                        </YAxis>
                        <Tooltip />
                        <Legend verticalAlign="top" wrapperStyle={{ lineHeight: '40px' }} />
                        <Line type="monotone" dataKey="consumo" stroke="#4682B4" name="Consumo" strokeWidth={3} />
                    </LineChart>
                </ResponsiveContainer>
            </DialogContent>
        </Dialog>
    );
};