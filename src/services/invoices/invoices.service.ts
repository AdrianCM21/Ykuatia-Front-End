import axios from "../../config/axios";
import { AxiosResponse } from "axios";
import paginationNro from "../../config/paginationNro";
import { IInvoiceCargaConsumoResponse, IInvoiceResponose } from "../../interfaces/invoices/IIncoiceResponse";
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

export const checkInvoices = async ():Promise<boolean> => {
    try {
        const { data: response }: AxiosResponse<IInvoiceResponose> = await axios.get('/api/facturas',{params: {desde:0}});
        const hasRejectedInvoice = response.resultado.some(invoice => invoice.estado === 'pendiente a carga de consumo');

        return hasRejectedInvoice;
    } catch (error) {
        return Promise.reject(error)
    }
}

export const envioConsumo = async (id:number,consumo:number):Promise<IInvoiceCargaConsumoResponse> => {
    try {
        const response: AxiosResponse<IInvoiceCargaConsumoResponse> = await axios.post(`/api/facturas/${id}`,{consumo})
        console.log(response)
        if (response.status !== 200) {
            toast.error('Error al enviar el consumo')
        }
        toast.success('Consumo enviado')
        return response.data
    } catch (error) {
        console.log(error)
        return Promise.reject(error)
    }
}

export const pagos= async (pagos:object[]) => {
    try {
       
        const response= await axios.post(`/api/facturapagos`,{pagos})
        console.log(response)
        if (response.status !== 200) {
            toast.error('Error al pagar la factura')
        }
        toast.success('Factura pagada')
        return response.data
    } catch (error) {
        console.log(error)
        return Promise.reject(error)
    }
}

