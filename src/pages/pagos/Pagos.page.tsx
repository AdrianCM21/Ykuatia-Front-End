import { Box, Button, Grid,  TextField} from "@mui/material"
import Layout from "../../components/layout/Layout"
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ICustomer from "../../interfaces/customers/Customer";
import * as CustomerService from "../../services/Customers/CustomerService"
import { DataGrid, esES,  GridColDef } from '@mui/x-data-grid';
import { PagoForm } from "./components/PagoForm";
import { pagos } from "../../services/invoices/invoices.service";
export const Pagos = () => {
// Llamado a Variables del redux
    // const dispatch =useDispatch()
//Inicializacion de estados
    const [loading, setLoading] = useState(false)
    const [customers, setCustomers] = useState<ICustomer[]>([])
    // const [current, setCurrent] = useState<ICustomer | undefined>(undefined)
    

    // Variables para paginacion
  const [refres,setRefres] = useState<number>(1)
  const [openFormDialog, setOpenFormDialog] = useState(false);
  const [loadingForm, setLoadingForm] = useState(false);
  const [customerData, setCustomerData] = useState<ICustomer>();


    const columns: GridColDef[] = [
        {
            flex: 0.10,
            field: 'id',
            headerName: 'ID'
        },
        {
            flex: 0.25,
            field: 'nombre',
            headerName: 'Nombre'
        },
        {
            flex: 0.25,
            field: 'cedula',
            headerName: 'Cedula'
        },
        {
            flex: 0.25,
            field: 'action',
            align: 'center',
            headerAlign: 'center',
            headerName: 'Action',
            renderCell: (params:any) => (
                <Button  key={params.row.id} onClick={()=>handleFormDialogOpen(params.row)}>Realizar Pago</Button>
            )
        }     
    ]

    useEffect(() => {
        getCustomers()
    }, [refres])

    const getCustomers = async () => {
        setLoading(true)
        try {
            const response = await CustomerService.getCustomersFactura()
            setCustomers(response.resultado)
        } catch (error) {
            toast.error('Error de listado')
        }
        setLoading(false)
    }

    //funciones del formulario 

    const handleFormDialogOpen = async(data:ICustomer) => {
        setLoadingForm(false)
        
        await setCustomerData(data)

        setOpenFormDialog(true);
    };
    const onSubmit = async (dataInvoice: any) => {
        try {
            dataInvoice.factura = dataInvoice.factura.filter((factura:any)=>factura.checked===true)
            await pagos(dataInvoice.factura as object[])
            setRefres(refres?0:1)
            handleFormDialogClose()
                   
        } catch (error) {
            console.log(error)
        }
        // handleFormDialogClose()
        
    };

    const handleFormDialogClose = () => {
        setOpenFormDialog(false);
    };


    return (
        <Layout>
            <>
                <Grid container spacing={3}>
                    <Grid item lg={12}>
                        <Box sx={{marginBottom:'1.3em'}}>
                            <TextField
                            label="Buscar por nombre"
                        // value={search}
                        // onChange={(e) => setSearch(e.target.value)}
                            />
                        </Box>
                   
                        <Box sx={{ height: 400 }}>
                            <DataGrid
                                columns={columns} 
                                rows={customers} 
                                localeText={esES.components.MuiDataGrid.defaultProps.localeText}
                                disableColumnMenu={true}
                                loading={loading}
                                hideFooter={true}
                            />
                        </Box>
                    </Grid>
                </Grid>
                <PagoForm onClose={handleFormDialogClose} onSubmit={onSubmit} open={openFormDialog} loading={loadingForm} data={customerData}/>
            </>
        </Layout>    
    )
}

