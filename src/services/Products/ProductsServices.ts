import axios from "../../config/axios";
import { AxiosResponse } from "axios";
import IProduct from "../../interfaces/products";
import paginationNro from "../../config/paginationNro";
import IResponseProducts from "../../interfaces/products/ResponsProducts";

const getProducts = async (page:number) => {
    try {
        const { data: response}: AxiosResponse<IResponseProducts> = await axios.get('/api/product',{params: {
            desde: paginationNro.paginationNro*(page-1)
           }})
           console.log(response)
        return response
    } catch (error) {
        return Promise.reject(error)
    }
}


const addProduct = async (data: IProduct) => {
    try {
        const { data: response}: AxiosResponse<IProduct> = await axios.post('/api/product', data)

        return response
    } catch (error) {
        return Promise.reject(error)
    }
}

const updateProduct = async (data: IProduct) => {
    const { id } = data
    const { id: _, ...values } = data

    try {
        const { data: response}: AxiosResponse<IProduct> = await axios.put('/api/product/'+id, values)
        return response
    } catch (error) {

        return Promise.reject(error)
    }
}

const deleteProduct = async (id: string) => {
    try {
        const { data: response}: AxiosResponse = await axios.delete('/api/product/'+id)

        return response
    } catch (error) {
        
        return Promise.reject(error)
    }
}

export { getProducts, addProduct, updateProduct, deleteProduct }