import axios from "../config/axios";
import IElectronicDocument from "../interfaces/electronicDocument/ElectronicDocument";

export const addInvoice = async (data: IElectronicDocument) => {
    try {
        const response = await axios.post('/api/electronic-document/create', data)

        return response
    } catch (error) {
        return Promise.reject(error)
    }
}