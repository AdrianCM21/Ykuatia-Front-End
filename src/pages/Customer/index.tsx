import { Box, Grid, Pagination } from "@mui/material"
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
import { useDispatch } from "react-redux";
import { resetError422 } from "../../redux/error422Slice";
const Customer = () => {
// Llamado a Variables del redux
    const dispatch =useDispatch()
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
            field: 'ruc',
            headerName: 'RUC'
        },
        {
            flex: 0.25,
            field: 'razon_social',
            headerName: 'Razón Social'
        },
        {
            flex: 0.25,
            field: 'nombre_fantasia',
            headerName: 'Nombre Fantasía'
        },
        {
            flex: 0.25,
            field: 'telefono',
            headerName: 'Teléfono'
        },
        {
            flex: 0.25,
            field: 'celular',
            headerName: 'Celular'
        },
        {
            field: 'actions',
            headerName: 'Acciones',
            type: 'actions',
            getActions: (params) => [
              <GridActionsCellItem
                icon={<DeleteIcon />}
                label="Delete"
                onClick={() => {
                    setCurrent(params.row)
                    setOpenDeleteDialog(true)
                }}
              />
            ],
          },
    ]

    useEffect(() => {
        getCustomers()
    }, [page])

    const getCustomers = async () => {
        setLoading(true)
        try {
            const response = await CustomerService.getCustomers(page)
            setPageNro(Math.ceil((response.total/paginationNro.paginationNro)))
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
            const response = await CustomerService.updateCustomer(formFields)
            setCustomers(customers.map(customer => customer.id == response.id ? response : customer))

            toast.success('Cliente actualizado correctamente');
          } else {
            console.log(formFields)
            const response = await CustomerService.addCustomer(formFields)
            
            setCustomers([response, ...customers])
            
            toast.success('Cliente agregado correctamente')
          }
        } catch (error) {
            //@ts-ignore
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
        setCurrent(row.row)
        setOpenAddEditDialog(true)
    };

    const handOnClose = () => {
        setCurrent(undefined)
        setOpenAddEditDialog(false)
    };

    const handleDeleteSubmit = async () => {
        setDeleteLoading(true);
        try {
            const response = await CustomerService.deleteCustomer(String(current?.id))
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
    
    return (
        <Layout
            sectionTitle="CLIENTES"
        >
            <>
                <Grid container spacing={3}>
                    <Grid item lg={12}>
                        <TableHeader onAdd={() => setOpenAddEditDialog(true)}/>
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
            </>
        </Layout>    
    )
}

export default Customer

