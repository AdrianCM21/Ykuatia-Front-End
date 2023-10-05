import axios from "../../config/axios";
import { AxiosResponse } from "axios";
import Iinvoice from "../../interfaces/invoice";
import ITradability from "../../interfaces/tradabilityAll";
import paginationNro from "../../config/paginationNro";
import IResponseInvoice from "../../interfaces/invoice/ResponseInvoice";


const getInvoices = async (page:number) => {
    try {
        const { data: response}: AxiosResponse<IResponseInvoice> = await axios.get('/api/Invoices',{params: {
            desde: paginationNro.paginationNro*(page-1)
           }})
        return response
    } catch (error) {
        return Promise.reject(error)
    }
}
const getAllTradeability= async () => {
    try {
        const { data: response}= await axios.get('/api/auditorias')
        
        return (response.map((e:any)=>{return([e.id_auditoria,e.historial_cambios.split(';')])}))
    } catch (error) {
        return Promise.reject(error)
    }
}
const downloadKude = async (kudeName:string) => {
    try {
        await axios.get(`/api/invoice_download/${kudeName}` , {responseType: 'blob'})
          .then(({data: blob}) => {
            let link = document.createElement('a');
            let url = URL.createObjectURL(blob);
            link.href = url;
            link.download = kudeName;
            link.click();
          });

    } catch (error) {
        return Promise.reject(error)
    }
}

const deleteInvoice = async (id: string) => {
    try {
        const { data: response}: AxiosResponse = await axios.delete('/api/invoices/'+id)

        return response
    } catch (error) {
        return Promise.reject(error)
    }
}

export  {getInvoices,downloadKude,deleteInvoice,getAllTradeability}