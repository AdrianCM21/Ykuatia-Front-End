import axios from "../../config/axios";
import { AxiosResponse } from "axios";
import ICustomer from "../../interfaces/customers/Customer";
import paginationNro from "../../config/paginationNro";
import { IInvoiceResponose } from "../../interfaces/invoices/IIncoiceResponse";


const getInvoices = async (page:number) => {
    try {
        const { data: response}: AxiosResponse<IInvoiceResponose> = await axios.get('/api/facturas',{params: {
            desde: paginationNro.paginationNro*(page-1)
           }})
           console.log(response)
        return response
    } catch (error) {
        return Promise.reject(error)
    }
}


export { getInvoices}