import { Box, Button, Grid, Pagination } from "@mui/material"
import Layout from "../../components/layout/Layout"
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ICustomer from "../../interfaces/customers/Customer";
import * as CustomerService from "../../services/Customers/CustomerService"
import { DataGrid, esES, GridRowParams, GridColDef, GridActionsCellItem } from '@mui/x-data-grid';
import CustomerAddEditDialog from "./components/AddEditDialog";
import TableHeader from "../../components/TableHeader";
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteDialog from "../../components/DeleteDialog";
import paginationNro from "../../config/paginationNro";
// import { useDispatch } from "react-redux";
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';

// import { resetError422 } from "../../redux/error422Slice";
import { FormularioDescarga } from "../../components/FormularioDescarga";
import { downloadInvoice, downloadInvoices } from "../../services/invoices/invoices.service";
const Customer = () => {
// Llamado a Variables del redux
    // const dispatch =useDispatch()
//Inicializacion de estados
    const [loading, setLoading] = useState(false)
    const [customers, setCustomers] = useState<ICustomer[]>([])
    const [current, setCurrent] = useState<ICustomer | undefined>(undefined)
    
    
    const [openAddEditDialog, setOpenAddEditDialog] = useState<boolean>(false);
    const [addEditLoading, setAddEditLoading] = useState<boolean>(false);
    
    const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
    const [deleteLoading, setDeleteLoading] = useState(false)

    // Variables para paginacion
  const [page, setPage] = useState<number>(1)
  const [pageNro, setPageNro] = useState<number>(0)
  const [refres,setRefres] = useState<number>(1)

   //Variables para descarga
   const [downloadLoading, setDownloadLoading] = useState(false);
   const [openDescarga, setOpenDescarga] = useState(false);

   
    
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
            field: 'telefono',
            headerName: 'Telefono'
        },
        {
            flex: 0.25,
            field: 'direccion',
            headerName: 'Direccion'
        },
        {
            flex: 0.25,
            field: 'tipoCliente',
            headerName: 'Tipo Cliente',
            valueGetter: (params) => params.row.tipoCliente ? params.row.tipoCliente.descripcion : ''
        },
        {
            field: 'actions',
            headerName: 'Acciones',
            type: 'actions',
            getActions: (params) => [
              <GridActionsCellItem key={params.row.id}
                icon={<DeleteIcon />}
                label="Delete"
                onClick={() => {
                    setCurrent(params.row)
                    setOpenDeleteDialog(true)
                }}
              />, <GridActionsCellItem key={params.row.id}
              icon={<CloudDownloadIcon/>}
              label="Descargar"
              onClick={() => {

                    setCurrent(params.row)
                    setOpenDescarga(true)
              }}
            />
            ],
          },
    ]

    useEffect(() => {
        getCustomers()
    }, [page,refres])

    const getCustomers = async () => {
        setLoading(true)
        try {
            const response = await CustomerService.getCustomers(page)
            //@ts-ignore
            setPageNro(Math.ceil((response.total/paginationNro.paginationNro)))
             //@ts-ignore
            setCustomers(response.resultado)
        } catch (error) {
            toast.error('Error de listado')
        }
        setLoading(false)
    }

    const handleAddEditSubmit = async (formFields: ICustomer) => {
        setAddEditLoading(true);
        
        try {
            
          if (current) {
            await CustomerService.updateCliente(formFields)
            setRefres(refres?0:1)

            toast.success('Cliente actualizado correctamente');
          } else {
            const response = await CustomerService.addCliente(formFields)
            
            setCustomers([response, ...customers])
            
            toast.success('Cliente agregado correctamente')
          }
        } catch (error: any) {
            
            if(error.response.status==422){
                setAddEditLoading(false)
                return
              }
            
            toast.error('Error al agregar. Por favor vuelve a intentar.')
        }
        setCurrent(undefined)
        setAddEditLoading(false)
        setOpenAddEditDialog(false)
    }

    const handleRowClick = (row: GridRowParams<ICustomer>) => {
//@ts-ignore
        if(row.row.tipoCliente && row.row.tipoCliente.id_tipo){
            //@ts-ignore
            setCurrent({...row.row,tipoCliente:row.row.tipoCliente.id_tipo})
        }else{
            setCurrent(row.row)
        }
       
        setOpenAddEditDialog(true)
    };

    const handOnClose = () => {
        setCurrent(undefined)
        setOpenAddEditDialog(false)
    };

    const handleDeleteSubmit = async () => {
        setDeleteLoading(true);
        try {
            await CustomerService.deleteCliente(String(current?.id))
            setCustomers(customers.filter(customer => customer.id != current?.id))
            toast.success('Eliminado correctamente');
        } catch (error) {
            toast.success('No se pudo eliminar');
        }
        setCurrent(undefined)
        setDeleteLoading(false);
        setOpenDeleteDialog(false);
    };

    const handleDeleteDialogOnClose = () => {
        setCurrent(undefined)
        setOpenDeleteDialog(false)
    }
    

    //Funciones de descarga 

const handleDownloadSubmit = async()=>{
    setDownloadLoading(true);
    try {
    if(current?.id){
        await downloadInvoice(current.id)
    }else{
        await downloadInvoices()
    }
    } catch (error) {
      toast.error('Error en la descarga')
    }
    setCurrent(undefined)
    setDownloadLoading(false);
    setOpenDescarga(false);
  };


    return (
        <Layout
            sectionTitle="CLIENTES"
        >
            <>
                <Grid container spacing={3}>
                    <Grid item lg={12}>
                    <Box display="flex" justifyContent="space-between">
                        <TableHeader onAdd={() => setOpenAddEditDialog(true)}/>
                        <Box>
                            <Button variant="contained" color="primary" onClick={()=>{setOpenDescarga(true)}}>
                                Abrir formulario de descarga
                            </Button>
                        </Box>

                    </Box>
                        <Box sx={{ height: 400 }}>
                            <DataGrid
                                columns={columns} 
                                rows={customers} 
                                localeText={esES.components.MuiDataGrid.defaultProps.localeText}
                                disableColumnMenu={true}
                                loading={loading}
                                onRowClick={handleRowClick}
                                hideFooter={true}
                            />
                        </Box>
                        <Box sx={{borderTop:'1px solid rgba(224, 224, 224, 1);',display:'flex',justifyContent:'center',alignItems:'center'}}>
                            <Pagination sx={{marginTop:'1%'}} count={pageNro} page={page} onChange={handleChange}/>
                        </Box>
                    </Grid>
                </Grid>
                {openAddEditDialog &&
                    <CustomerAddEditDialog
                        open={openAddEditDialog}
                        loading={addEditLoading}
                        onSubmit={handleAddEditSubmit}
                        onClose={handOnClose}
                        current={current}
                    />
                }
                {openDeleteDialog &&
                    <DeleteDialog
                        open={openDeleteDialog}
                        loading={deleteLoading}
                        onConfirm={handleDeleteSubmit}
                        onClose={handleDeleteDialogOnClose}
                    />
                }
                {openDescarga &&
                    <FormularioDescarga
                       open={openDescarga}
                        loading={downloadLoading}
                        onConfirm={handleDownloadSubmit}
                        onClose={() => setOpenDescarga(false)}
                        oneCustomer={current?.id}
                    />
                }
            </>
        </Layout>    
    )
}

export default Customer

