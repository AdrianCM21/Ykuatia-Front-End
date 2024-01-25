import React, { useEffect, useState } from "react";
import { Drawer,  Button,Paper, Container} from "@mui/material";
import { DataGrid, esES, GridColDef } from '@mui/x-data-grid';
import { IInvoice } from "../../interfaces/invoices/IInvoices";
import { envioConsumo, getInvoices } from "../../services/invoices/invoices.service";
import { FormCompletadoConsumo } from "../Invoices/components/formCompletadoConsumo";
import { toast } from "react-toastify";
import { LayoutMovil } from "../../components/layout/LayoutMovil";


const CampoPage = () => {
    const [openFormDrawer, setOpenFormDrawer] = useState(false);
    const [idInvoice, setIdInvoice] = useState<number>(0);
    const [loadingForm, setLoadingForm] = useState(false);
    const [datosTable, setDatosTable] = useState<IInvoice[]>([]);

    useEffect(() => {
        getInvoice();
    }, []);

    const getInvoice = async () => {
        try {
            const response = await getInvoices(1);
            setDatosTable(response.resultado.filter((invoice) => invoice.estado === 'pendiente a carga de consumo'));
        } catch (error) {
            toast.error('Error de listado');
        }
    };

    const handleFormDrawerOpen = async (id: number) => {
        await setIdInvoice(id);
        setOpenFormDrawer(true);
    };

    const onSubmit = async (dataInvoice: any) => {
        try {
            setLoadingForm(true);
            const response = await envioConsumo(dataInvoice.id, dataInvoice.consumo);
            setDatosTable(datosTable.filter((d) => d.id !== response.message.id));
            setLoadingForm(false);
        } catch (error) {
            console.log(error);
        }
        handleFormDrawerClose();
    };

    const handleFormDrawerClose = () => {
        setOpenFormDrawer(false);
    };

    // Define las columnas de tu tabla
    const columns: GridColDef[] = [
        {
            flex: 0.25,
            field: 'cliente',
            headerName: 'Nombre del cliente',
            valueGetter: (params) => (params.row.cliente as any)?.nombre
        },
        {
            flex: 0.25,
            field: 'action',
            headerName: 'Action',
            renderCell: (params: any) => (
                <Button variant="contained" color="primary" onClick={() => handleFormDrawerOpen(params.row.id)}>
                    Cargar Consumo
                </Button>
            ),
        }
    ];

    return (
      <LayoutMovil>
        <div style={{ display: 'flex', flexDirection: 'column' }}>

            <Drawer
                anchor="right"
                open={true}
                PaperProps={{ style: { width: '100vw' } }}
            >


                <Container style={{ flexGrow: 1, padding: '16px' }}>
             
                    <Paper  style={{ marginTop:'4em',height: 'calc(100vh - 74px)', width: '100%' }}>
                        <DataGrid
                            rows={datosTable}
                            columns={columns}
                            localeText={esES.components.MuiDataGrid.defaultProps.localeText}
                            hideFooter={true}
                            disableColumnMenu={true}
                        />
                    </Paper>
                </Container>
            </Drawer>

            <FormCompletadoConsumo loading={loadingForm} onSubmit={onSubmit} idInvoice={idInvoice} open={openFormDrawer} onClose={handleFormDrawerClose} />
        </div>
        </LayoutMovil>
    );
};

export {CampoPage};
