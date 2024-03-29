import { Badge, Box, Button, Grid, Pagination } from "@mui/material"
import Layout from "../../components/layout/Layout"
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { IInvoice } from "../../interfaces/invoices/IInvoices";
import * as InvoiceService from "../../services/invoices/invoices.service"
import { DataGrid, esES,GridColDef, GridRowsProp, GridSortModel, GridValueGetterParams } from '@mui/x-data-grid';
import TableHeader from "../../components/TableHeader";
import paginationNro from "../../config/paginationNro";

// import { useDispatch } from "react-redux";
import { format, startOfMonth } from 'date-fns';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { DateRangeFilter } from "../../components/DateRangeFilter";
import { CompletadoConsumo } from "./components/completadoConsumo";
export const Invoices = () => {
// Llamado a Variables del redux
    // const dispatch =useDispatch()
//Inicializacion de estados
    const [loading, setLoading] = useState(false)
    const [invoices, setInvoices] = useState<IInvoice[]>([])
    const [hasNotification, setHasNotification] = useState(false);
  
    
    // Variables para paginacion
  const [page, setPage] = useState<number>(1)
  const [pageNro, setPageNro] = useState<number>(0)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [refres,setRefres] = useState<number>(1)
  

  //Variables para descarga
    const [openCompletadoConsumo, setOpenCompletadoConsumo] = useState(false);




    
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
            valueFormatter: (params) => format(new Date(params.value), 'MM/yyyy'),
            filterable:true
        },
        {
            flex: 0.25,
            field: 'estado',
            headerName: 'Estado',
            sortComparator: (v1, v2, cellParams1, cellParams2) => {
                if (cellParams1.value === 'pendiente a pago' && cellParams2.value !== 'pendiente a pago') {
                    return -1;
                } else if (cellParams1.value !== 'pendiente a pago' && cellParams2.value === 'pendiente a pago') {
                    return 1;
                } else {
                    return cellParams1.value.localeCompare(cellParams2.value);
                }
            }
        },
      
        {
            flex: 0.25,
            field: 'monto',
            headerName: 'Monto a pagar',
            valueGetter: (params: GridValueGetterParams) => (
                `${params.value} Gs`
            ),
        },
        {
            flex: 0.25,
            field: 'cliente',
            headerName: 'Nombre del cliente',
            valueGetter: (params) => params.row.cliente.nombre
        }
    ]

    const sortModel: GridSortModel = [
        {
            field: 'estado',
            sort: 'asc',
        },
    ];

    useEffect(() => {
        getInvoices()
        checkNotificaniones()
        
    }, [page,refres])
    const checkNotificaniones= async()=>{
        const result = await InvoiceService.checkInvoices()
        setHasNotification(result)
      }
    
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

//Funciones de descarga 

const handleOpen = () => {
    setOpenCompletadoConsumo(true);
};


return (
    <Layout
        sectionTitle="FACTURAS"
    >
        <>
            <Grid container spacing={3}>
                <Grid item lg={12}>
                    <TableHeader/>
                    <Box display="flex" justifyContent="space-between">
                        <DateRangeFilter dateRange={dateRange} setDateRange={setDateRange}/>
                        <Box>
                        <Badge color="error"  
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }} 
                            variant="dot" invisible={!hasNotification}>
                            <Button variant="contained" color="primary" onClick={handleOpen}>
                                Completa consumo factura
                            </Button>
                        </Badge>
                        </Box>
                       
                    </Box>
                    
                    <Box sx={{ height: 400 }}>
                        <DataGrid
                            columns={columns} 
                            rows={filteredRows} 
                            localeText={esES.components.MuiDataGrid.defaultProps.localeText}
                            disableColumnMenu={true}
                            loading={loading}
                            hideFooter={true}
                            sortModel={sortModel}
                        />
                    </Box>
                    <Box sx={{borderTop:'1px solid rgba(224, 224, 224, 1);',display:'flex',justifyContent:'center',alignItems:'center'}}>
                        <Pagination sx={{marginTop:'1%'}} count={pageNro} page={page} onChange={handleChange}/>
                    </Box>
                </Grid>
            </Grid>
            {openCompletadoConsumo &&
                <CompletadoConsumo
                   open={openCompletadoConsumo}
                    onClose={() => {
                        setOpenCompletadoConsumo(false)
                        setRefres(refres?0:1)
                    }}
                    data={invoices.filter((invoice) => invoice.estado === 'pendiente a carga de consumo')}

                />
            }
        </> 
    </Layout>    
)
}


