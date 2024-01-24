import { Box, Grid, Pagination,  Typography } from "@mui/material"
import Layout from "../../components/layout/Layout"
import { useEffect, useState } from "react"
import { CajaFormDialog } from "./components/CajaFormDialog"
import { ICaja } from "../../interfaces/caja/Caja"
import TableHeader from "../../components/TableHeader"
import { DataGrid, GridColDef } from "@mui/x-data-grid"
import { addCaja, getCaja } from "../../services/caja/Caja.service"
import paginationNro from "../../config/paginationNro"
import { toast } from "react-toastify"
import { DateRangeFilter } from "../../components/DateRangeFilter"
import {format, startOfMonth, endOfMonth } from "date-fns"

  

export const CajaPage = () => {
    const [openDialogForm,setOpenDialogForm]= useState(false)
    const [loading, setLoading] = useState(false)
    const [caja,setCaja]= useState<ICaja[]>([])
// Variables para paginacion
    const [page, setPage] = useState<number>(1)
    const [pageNro, setPageNro] = useState<number>(0)
    const [refres,setRefres] = useState<number>(1)
    const [total,setTotal] = useState<number>(0)

// variable para filter
const [dataFilter, setDataFilter] = useState([
    {
        startDate: startOfMonth(new Date()),
        endDate: endOfMonth(new Date()),
        key: 'selection'
    }
]);
const [filteredRows,setFilterdRows] = useState<ICaja[]>([])
useEffect(() => {
   setFilterdRows( caja.filter((row) => {
        const date = new Date(row.fecha);
        return (!dataFilter[0].startDate || date >= dataFilter[0].startDate) && (!dataFilter[0].endDate || date <= dataFilter[0].endDate);
    }))
  
}, [dataFilter[0],caja])



    const handleOnClose=()=>{
        setOpenDialogForm(false)
    }
    useEffect(() => {
        getCajaF()
    }, [page,refres])

    const getCajaF = async () => {
        setLoading(true)
        try {
            const response = await getCaja(page)
            setPageNro(Math.ceil((response.total/paginationNro.paginationNro)))
            setCaja(response.resultado)
            setTotal(response.resultado.reduce((a, b) => a + (b.tipo_ingreso.descripcion==='ingreso'? Number(b.monto):Number('-'+b.monto)), 0))
        } catch (error) {
            toast.error('Error de listado')
        }
        setLoading(false)
    }
    

    const columns: GridColDef[] = [
        {
            flex: 0.10,
            field: 'id',
            headerName: 'Id'
        },
        {
            flex: 0.10,
            field: 'fecha',
            headerName: 'Fecha',
            type: 'date',
            valueFormatter: (params) => format(new Date(params.value), 'dd/MM/yyyy'),
            filterable:true
        },
        {
            flex: 0.10,
            field: 'motivo',
            headerName: 'Motivo'
        },
        {
            flex: 0.10,
            field: 'tipo_ingreso',
            headerName: 'Tipo de operacion',
            valueGetter: (params) => params.row.tipo_ingreso.descripcion
        },
        {
            flex: 0.10,
            field: 'monto',
            headerName: 'Monto'
        },
    ]
    const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
      }; 

      const onSubmitForm = async (data:any) => {
        await addCaja(data)
        setRefres(refres?0:1)
        handleOnClose(); 
      };
    
    
  return (
    <Layout>
    <>
        <Grid container spacing={3}>
            <Grid item lg={12}>
            <Box display="flex" justifyContent="space-between">
                <Box display={"flex"} >
                    <Box marginRight={2}>
                        <TableHeader onAdd={() => setOpenDialogForm(true)}/>
                    </Box>
                    <DateRangeFilter dateRange={dataFilter} setDateRange={setDataFilter}/>
                </Box>
           
                <Typography variant="h5">
                    Total Caja: {total} Gs
                </Typography>
            </Box>
                <Box sx={{ height: 400 }}>
                    <DataGrid
                        columns={columns} 
                        rows={filteredRows} 
                        loading={loading}
                        hideFooter={true}
                    />
                </Box>
                <Box sx={{borderTop:'1px solid rgba(224, 224, 224, 1);',display:'flex',justifyContent:'center',alignItems:'center'}}>
                    <Pagination sx={{marginTop:'1%'}} count={pageNro} page={page} onChange={handleChange}/>
                </Box>
            </Grid>
        </Grid>
        <CajaFormDialog onSubmit={onSubmitForm} open={openDialogForm} onClose={handleOnClose}/>
           
        {/* <ViewAuditoria onClose={handleTradabilityOnClose} open={openAuditoria} data={auditoriaData}/>   */}
    </>
</Layout>
  )
}

