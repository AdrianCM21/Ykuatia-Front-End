import React, { useEffect, useState } from "react";
import {
  Drawer,
  Button,
  Paper,
  Container,
  List,
  ListItem,
  Checkbox,
  ListItemText,
} from "@mui/material";
import { IInvoice } from "../../../interfaces/invoices/IInvoices";
import { envioConsumo, getInvoices } from "../../../services/invoices/invoices.service";

import { toast } from "react-toastify";
import { LayoutMovil } from "../../../components/layout/LayoutMovil";

export const NotificacionPage = () => {
  const [openFormDrawer, setOpenFormDrawer] = useState(false);
  const [loadingForm, setLoadingForm] = useState(false);
  const [datosTable, setDatosTable] = useState<IInvoice[]>([]);

  useEffect(() => {
    getInvoice();
  }, []);

  const getInvoice = async () => {
    try {
      const response = await getInvoices(1);
      setDatosTable(
        response.resultado
      );
    } catch (error) {
      toast.error("Error de listado");
    }
  };

//   const handleFormDrawerOpen = async (id: number) => {
//     await setIdInvoice(id);
//     setOpenFormDrawer(true);
//   };

//   const onSubmit = async (dataInvoice: any) => {
//     try {
//       setLoadingForm(true);
//       const response = await envioConsumo(
//         dataInvoice.id,
//         dataInvoice.consumo
//       );
//       setDatosTable(
//         datosTable.filter((d) => d.id !== response.message.id)
//       );
//       setLoadingForm(false);
//     } catch (error) {
//       console.log(error);
//     }
//     handleFormDrawerClose();
//   };

//   const handleFormDrawerClose = () => {
//     setOpenFormDrawer(false);
//   };

  return (
    <LayoutMovil>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <Drawer anchor="right" open={true} PaperProps={{ style: { width: '100vw' } }}>
          <Container style={{  padding: '16px' }}>
            <Paper style={{ marginTop: '4em', height: 'calc(100vh - 74px)', width: '100%' }}>
              
                {datosTable.map((invoice) => (
                    <List key={invoice.id}>
                  <ListItem >
                    <Checkbox />
                    <ListItemText
                      primary={invoice.cliente?.nombre}
                      secondary={`ID: ${invoice.id}`}
                    />

                  </ListItem>
                  </List>
                ))}
                <Button>Guardar</Button>
              
              
            </Paper>
          </Container>
        </Drawer>


      </div>
    </LayoutMovil>
  );
};

