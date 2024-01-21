import { AxiosResponse } from "axios"
import axios from "../../config/axios";
import { ICaja, ICajaResponose } from "../../interfaces/caja/Caja"
import paginationNro from "../../config/paginationNro";

export const getCaja = async (page:number) => {
    try {
        const { data: response}: AxiosResponse<ICajaResponose> = await axios.get('/api/caja',{params: {
            desde: paginationNro.paginationNro*(page-1)
           }})
        return response
    } catch (error) {
        return Promise.reject(error)
    }
}

export const addCaja = async (data: ICaja) => {
    try {
        const { data: response}: AxiosResponse<ICaja> = await axios.post('/api/caja', data)
       
        return response
    } catch (error) {
        console.log(error)
        return Promise.reject(error)
    }
}