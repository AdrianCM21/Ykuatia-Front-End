import axios from "../../config/axios";
import { AxiosResponse } from "axios";
import paginationNro from "../../config/paginationNro";
import { IInvoiceResponose } from "../../interfaces/invoices/IIncoiceResponse";
import { toast } from "react-toastify";


export const getInvoices = async (page:number) => {
    try {
        const { data: response}: AxiosResponse<IInvoiceResponose> = await axios.get('/api/facturas',{params: {
            desde: paginationNro.paginationNro*(page-1)
           }})
        return response
    } catch (error) {
        return Promise.reject(error)
    }
}
export const downloadInvoice = async (id:number):Promise<void> => {
    try {
        const {data:blob,status} = await axios.get(`/api/facturas/descargar`, { params:{id},responseType: 'blob' , validateStatus: (status)=> {
            return status < 400 || status === 404;
        }});
        if (status !== 404) {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'factura';
            link.click();
            toast.success('Descarga exitosa')
        } else {
            toast.info('No tiene factura pendientes')
        }
    } catch (error) {
        console.log(error)
        return Promise.reject(error)
    }
}

export const downloadInvoices = async ():Promise<void> => {
    try {
        const { data: blob } = await axios.get('/api/facturas/descargar', { responseType: 'blob' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'facturas';
        link.click();
      
    } catch (error) {
        console.log(error)
        return Promise.reject(error)
    }
}

