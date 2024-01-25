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

  // Variables para busqueda
    const [searchText, setSearchText] = useState<string>('');
    const [customerFilter, setCustomerFilter] = useState<ICustomer[]>([]);

  // Variables para Formulario
  const [openFormDialog, setOpenFormDialog] = useState(false);
  const [loadingForm, setLoadingForm] = useState(false);
  const [customerData, setCustomerData] = useState<ICustomer>();


    const columns: GridColDef[] = [
        {
            flex: 0.10,
            field: 'id',
            headerName: 'Identificador'
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
            headerName: 'Accion',
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
            setCustomerFilter(response.resultado)
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
            return
                   
        } catch (error) {
            console.log(error)
        }
        handleFormDialogClose()
        
    };

    const handleFormDialogClose = () => {
        setOpenFormDialog(false);
    };

    //funciones de busqueda 
    const handleSearch = (event:any,setSearchText:React.Dispatch<React.SetStateAction<string>>) => {
        const searchText = event.target.value.toLowerCase();
        setSearchText(searchText);
    
        // Filtrar los elementos que coincidan con el texto de búsqueda
        const filtered = customers.filter((item) =>
          item['nombre'].toLowerCase().includes(searchText)
        );
        setCustomerFilter(filtered)
      };


    return (
        <Layout>
            <>
                <Grid container spacing={3}>
                    <Grid item lg={12}>
                        <Box sx={{marginBottom:'1.3em'}}>
                            <TextField
                            label="Buscar por nombre"
                            value={searchText}
                            onChange={(e) => handleSearch(e,setSearchText)}
                            />
                        </Box>
                   
                        <Box sx={{ height: 400 }}>
                            <DataGrid
                                columns={columns} 
                                rows={customerFilter} 
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

