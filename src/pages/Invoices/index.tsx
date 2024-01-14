import { Box, Grid, Pagination } from "@mui/material"
import Layout from "../../components/layout/Layout"
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { IInvoice } from "../../interfaces/invoices/IInvoices";
import * as InvoiceService from "../../services/invoices/invoices.service"
import { DataGrid, esES, GridRowParams, GridColDef, GridActionsCellItem } from '@mui/x-data-grid';
import TableHeader from "../../components/TableHeader";
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteDialog from "../../components/DeleteDialog";
import paginationNro from "../../config/paginationNro";
import { useDispatch } from "react-redux";
import { format } from 'date-fns';
import { resetError422 } from "../../redux/error422Slice";
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
            valueFormatter: (params) => format(new Date(params.value), 'dd/MM/yyyy')
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

  



    return (
        <Layout
            sectionTitle="FACTURAS"
        >
            <>
                <Grid container spacing={3}>
                    <Grid item lg={12}>
                        <TableHeader/>
                        <Box sx={{ height: 400 }}>
                            <DataGrid
                                columns={columns} 
                                rows={invoices} 
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


