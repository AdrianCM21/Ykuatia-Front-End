import { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout"
import { Box } from "@mui/material";
import { ConfiguracionesForm } from "./ConfiguracionesForm";
import { ITipoCliente } from "../../interfaces/configuracion/configuracion";
import { getConfig, updateConfig } from "../../services/configuraciones/configuraciones.service";

export const ConfiguracionesPage =()=>{
    const [config,setConfig] = useState<ITipoCliente[]>([])
    const [refres, setRefres] = useState<number>(0)
    const [openDialog, setOpenDialog] = useState(false);
    const [loading,setLoading] = useState(false)

    useEffect(() => {
        getConfigF()

          
    }, [refres])
    const getConfigF= async()=>{
     try {
        const response = await getConfig()
        setConfig(response)
     } catch (error) {
        console.log(error)
     }
    }
    

    const handleOpenDialog = () => {
      setOpenDialog(true);
    };

    const onSubmit = async (data:any)=>{
        try {
            setLoading(true)
            await updateConfig(data)
            setLoading(false)
            setRefres(refres?0:1)
            handleCloseDialog()
        } catch (error) {
            console.log(error)
        }
        

    }
  
    const handleCloseDialog = () => {
      setOpenDialog(false);
    };
  
    return(
        <Layout>
            <Box>
                <ConfiguracionesForm loading={loading} onClose={handleCloseDialog} onOpen={handleOpenDialog} onSubmit={onSubmit} open={openDialog} data={config}/>
            </Box>
        </Layout>
    )
}