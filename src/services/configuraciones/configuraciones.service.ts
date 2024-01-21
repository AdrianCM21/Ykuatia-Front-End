import { AxiosResponse } from "axios"
import axios from "../../config/axios";
import { ICaja } from "../../interfaces/caja/Caja"
import { ITipoCliente } from "../../interfaces/configuracion/configuracion";

export const getConfig = async () => {
    try {
        const { data: response}: AxiosResponse<ITipoCliente[]> = await axios.get('/api/configuraciones')
        return response
    } catch (error) {
        return Promise.reject(error)
    }
}

export const updateConfig = async (data: ICaja) => {
    try {
        const { data: response}: AxiosResponse<ICaja> = await axios.put('/api/configuraciones', data)
       
        return response
    } catch (error) {
        console.log(error)
        return Promise.reject(error)
    }
}