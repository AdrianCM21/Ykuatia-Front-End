import { Box, Button, Dialog, DialogContent, DialogTitle, Grid, Pagination, TextField } from "@mui/material"
import Layout from "../../components/layout/Layout"
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { IInvoice } from "../../interfaces/invoices/IInvoices";
import * as InvoiceService from "../../services/invoices/invoices.service"
import { DataGrid, esES,GridColDef, GridRowsProp } from '@mui/x-data-grid';
import TableHeader from "../../components/TableHeader";
import paginationNro from "../../config/paginationNro";
import { useDispatch } from "react-redux";
import { format, startOfMonth } from 'date-fns';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { DateRangeFilter } from "../../components/DateRangeFilter";

export const Invoices = () => {
// Llamado a Variables del redux
    const dispatch =useDispatch()
//Inicializacion de estados
    const [loading, setLoading] = useState(false)
    const [invoices, setInvoices] = useState<IInvoice[]>([])
    
    // Variables para paginacion
  const [page, setPage] = useState<number>(1)
  const [pageNro, setPageNro] = useState<number>(0)
  const [refres,setRefres] = useState<number>(1)
    
  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  }; 

    const columns: GridColDef[] = [
        {
            flex: 0.25,
            field: 'id',
            headerName: 'ID'
        },
        {
            flex: 0.25,
            field: 'Fecha_emicion',
            headerName: 'Fecha de Emicion',
            type: 'date',
            valueFormatter: (params) => format(new Date(params.value), 'dd/MM/yyyy'),
            filterable:true
        },
        {
            flex: 0.25,
            field: 'estado',
            headerName: 'Estado'
        },
      
        {
            flex: 0.25,
            field: 'monto',
            headerName: 'Monto a pagar'
        },
        {
            flex: 0.25,
            field: 'cliente',
            headerName: 'Nombre del cliente',
            valueGetter: (params) => params.row.cliente.nombre
        }
    ]

    useEffect(() => {
        getInvoices()
    }, [page,refres])

    const getInvoices = async () => {
        setLoading(true)
        try {
            const response = await InvoiceService.getInvoices(page)
            setPageNro(Math.ceil((response.total/paginationNro.paginationNro)))
            setInvoices(response.resultado)
        } catch (error) {
            toast.error('Error de listado')
        }
        setLoading(false)
    }

  
//Prueba filtro date 

const [dateRange, setDateRange] = useState([
    {
        startDate: startOfMonth(new Date()),
        endDate: new Date(),
        key: 'selection'
    }
]);

const rows: GridRowsProp = invoices.map((invoice: IInvoice) => { 
    return {
        id: invoice.id,
        Fecha_emicion: invoice.Fecha_emicion,
        estado: invoice.estado,
        monto: invoice.monto,
        cliente: invoice.cliente
    }
})

const filteredRows: GridRowsProp = rows.filter((row) => {
    const date = new Date(row.Fecha_emicion);
    return (!dateRange[0].startDate || date >= dateRange[0].startDate) && (!dateRange[0].endDate || date <= dateRange[0].endDate);
});


return (
    <Layout
        sectionTitle="FACTURAS"
    >
        <>
            <Grid container spacing={3}>
                <Grid item lg={12}>
                    <TableHeader/>
                    <DateRangeFilter dateRange={dateRange} setDateRange={setDateRange}/>
                    <Box sx={{ height: 400 }}>
                        <DataGrid
                            columns={columns} 
                            rows={filteredRows} 
                            localeText={esES.components.MuiDataGrid.defaultProps.localeText}
                            disableColumnMenu={true}
                            loading={loading}
                            hideFooter={true}
                        />
                    </Box>
                    <Box sx={{borderTop:'1px solid rgba(224, 224, 224, 1);',display:'flex',justifyContent:'center',alignItems:'center'}}>
                        <Pagination sx={{marginTop:'1%'}} count={pageNro} page={page} onChange={handleChange}/>
                    </Box>
                </Grid>
            </Grid>
        </>
    </Layout>    
)
}


