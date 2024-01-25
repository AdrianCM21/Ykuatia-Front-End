// CompletadoConsumo.tsx
import { Dialog, DialogTitle, DialogContent, IconButton, Button } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { DataGrid, esES, GridColDef } from '@mui/x-data-grid';
import { IInvoice } from "../../../interfaces/invoices/IInvoices";
import { useState } from 'react';
import { FormCompletadoConsumo } from "./formCompletadoConsumo";
import { envioConsumo } from "../../../services/invoices/invoices.service";
import { format} from "date-fns";


interface IProps {
    open: boolean
    onClose: () => void
    oneCustomer?: number
    data:IInvoice[]
}

export const CompletadoConsumo = ({ data, open, onClose }: IProps) => {
    const [openFormDialog, setOpenFormDialog] = useState(false);
    const [idInvoice, setIdInvoice] = useState<number>(0);
    const [loadingForm, setLoadingForm] = useState(false);
    const [datosTable, setDatosTable] = useState<IInvoice[]>(data);

    const handleDialogClose = (
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        reason: "backdropClick" | "escapeKeyDown"
    ) => {
        onClose();
    };

    const handleFormDialogOpen = async(id:number) => {
        await setIdInvoice(id);
  
        setOpenFormDialog(true);
    };
    const onSubmit = async (dataInvoice: any) => {
        try {
            setLoadingForm(true)
            const response = await envioConsumo(dataInvoice.id,dataInvoice.consumo) 
            setDatosTable(data.filter((d)=>{return d.id !== response.message.id}))
            setLoadingForm(false)
                   
        } catch (error) {
            console.log(error)
        }
        handleFormDialogClose()
        
    };

    const handleFormDialogClose = () => {
        setOpenFormDialog(false);
    };

    // Define las columnas de tu tabla
    const columns: GridColDef[] = [
        { 
            flex: 0.25,
            field: 'id',
            headerName: 'ID',
        },
        {
            flex: 0.25,
            field: 'cliente',
            headerName: 'Nombre del cliente',
            valueGetter: (params) => params.row.cliente.nombre
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
            field: 'action',
            headerName: 'Action',
            renderCell: (params:any) => (
                <Button key={params.row.id} onClick={() => handleFormDialogOpen(params.row.id)}>Cargar Consumo</Button>
            ),
        }
    ];

    return (
        <>
            <Dialog
                fullWidth
                open={open}
                maxWidth='lg'
                scroll='body'
                onClose={handleDialogClose}
            >
                <DialogTitle sx={{display:'flex', justifyContent:'space-between'}}>
                    <></>
                    {'Cargar Consumos'} 
                    <IconButton edge="end" color="inherit" onClick={onClose} aria-label="close">
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                   
                    <div style={{ height: 400, width: '100%' }}>
                        <DataGrid
                            rows={datosTable}
                            columns={columns}
                            localeText={esES.components.MuiDataGrid.defaultProps.localeText}
                            hideFooter={true}
                            disableColumnMenu={true}
                        />
                    </div>
                </DialogContent>
            </Dialog>

            <FormCompletadoConsumo loading={loadingForm} onSubmit={onSubmit} idInvoice={idInvoice} open={openFormDialog} onClose={handleFormDialogClose} />
        </>
    )
};