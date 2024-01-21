// EstadisticaPage.tsx
import { Grid, Card as MuiCard, CardContent, Typography } from '@mui/material';
import { styled } from '@mui/system';
import { useEffect, useState } from 'react';
import { BarChart, Bar, LineChart } from 'recharts';
import Layout from '../../components/layout/Layout';

import { getCustomersFactura } from '../../services/Customers/CustomerService';
import ICustomer from '../../interfaces/customers/Customer';
import { MayorConsumo } from './components/EstadisticaMayorConsumo';
import { SinPagar } from './components/EstadisticaSinPagar';
import { ClientesAntiguos } from './components/EstadisticaClientesAntiguos';
import { MayorDeudaGuaranies } from './components/EstadisticaMayorDeudaGuaranies';
import { getInvoices } from '../../services/invoices/invoices.service';
import { IInvoice } from '../../interfaces/invoices/IInvoices';
import { Line } from 'recharts';


const Card = styled(MuiCard)(() => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
}));

const Chart = styled(BarChart)(() => ({
    marginTop: '20px',
}));

export const EstadisticaPage = () => {
    const [customers, setCustomers] = useState<ICustomer[]>([]); 
    const [facturas, setFacturas] = useState<IInvoice[]>([]);

    const [openDialog, setOpenDialog] = useState({ consumo: false, pago: false, antiguo: false, mayorDeudaGuarani: false });

    const data = [
        {name: 'Page A', uv: 4000, pv: 2400, amt: 4400},
        {name: 'Page B', uv: 5000, pv: 3398, amt: 2210},
        {name: 'Page C', uv: 3000, pv: 1398, amt: 5210},
        {name: 'Page D', uv: 2000, pv: 9800, amt: 2290},
        {name: 'Page E', uv: 2780, pv: 3908, amt: 2000},
    ];

    const handleOpen = (dialog:any) => {
        setOpenDialog({ ...openDialog, [dialog]: true });
    };

    const handleClose = (dialog:any) => {
        setOpenDialog({ ...openDialog, [dialog]: false });
    };

    // llamada a la api para obtener los datos de las estadisticas
    useEffect(() => {
        getCustomersF();
        getFacturasF();
    }, []);
    const getCustomersF = async () => {
        try {
            const response = await getCustomersFactura();
            setCustomers(response.resultado);
        } catch (error) {
            console.log(error)
        }
    }
    const getFacturasF = async () => {
        try {
            const response = await getInvoices(1);
            setFacturas(response.resultado);
        } catch (error) {
            console.log(error)
        }
    }


    return (
        <Layout>
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <Card onClick={() => handleOpen('pago')}>
                        <CardContent>
                            <Typography variant="h5">Facturas sin pagar</Typography>
                            <Chart width={250} height={150} data={data}>
                                <Bar dataKey="pv" fill="#4682B4" />
                            </Chart>
                        </CardContent>
                    </Card>
                    <SinPagar data={customers} open={openDialog.pago} handleClose={() => handleClose('pago')} title="Estadisticas de facturas sin pagar" />
                </Grid>
                <Grid item xs={6}>
                <Card onClick={() => handleOpen('consumo')}>
                    <CardContent>
                        <Typography variant="h5">Mayor consumo</Typography>
                        <LineChart width={250} height={150} data={data}>
                            <Line type="monotone" dataKey="uv" stroke="#4682B4" />
                        </LineChart>
                    </CardContent>
                </Card>
                    <MayorConsumo data={facturas} open={openDialog.consumo} handleClose={() => handleClose('consumo')} title="Estadísticas de Mayor consumo" />
                </Grid>
                <Grid item xs={6}>
                    <Card onClick={() => handleOpen('antiguo')}>
                        <CardContent>
                            <Typography variant="h5">Cliente más antiguo</Typography>
                            <Chart width={250} height={150} data={data}>
                                <Bar dataKey="amt" fill="#4682B4" />
                            </Chart>
                        </CardContent>
                    </Card>
                    <ClientesAntiguos data={customers} open={openDialog.antiguo} handleClose={() => handleClose('antiguo')} title="Estadísticas de Cliente más antiguo" />
                </Grid>
                <Grid item xs={6}>
                    <Card onClick={() => handleOpen('mayorDeudaGuarani')}>
                        <CardContent>
                            <Typography variant="h5">Mayor deuda en guaranies</Typography>
                            <Chart width={250} height={150} data={data}>
                                <Bar dataKey="uv" fill="#4682B4" />
                            </Chart>
                        </CardContent>
                    </Card>
                    <MayorDeudaGuaranies data={customers} open={openDialog.mayorDeudaGuarani} handleClose={() => handleClose('mayorDeudaGuarani')} title="Estadísticas de mayor deuda en guaranies" />
                </Grid>
            </Grid>
        </Layout>
    );
};