// import axios from "../../config/axios";
// import { AxiosResponse } from "axios";
// import ICustomer from "../../interfaces/customers/Customer";
// import paginationNro from "../../config/paginationNro";
// import IResponseCustomer from "../../interfaces/customers/ResponsCustomers";


// const getCustomers = async (page:number) => {
//     try {
//         const { data: response}: AxiosResponse<IResponseCustomer> = await axios.get('/api/customers',{params: {
//             desde: paginationNro.paginationNro*(page-1)
//            }})
    
//         return response
//     } catch (error) {
//         return Promise.reject(error)
//     }
// }

// const getCustomerRuc =async(ruc:string)=>{
//     try {
//         const { data: response}: AxiosResponse<ICustomer[]> = await axios.get('/api/customersruc/'+ruc)

//         return response
//     } catch (error) {
//         return Promise.reject(error)
//     }
// }
// const addCustomer = async (data: ICustomer) => {
//     try {
//         const { data: response}: AxiosResponse<ICustomer> = await axios.post('/api/customers', data)

//         return response
//     } catch (error) {
//         return Promise.reject(error)
//     }
// }

// const updateCustomer = async (data: ICustomer) => {
//     const { id } = data
//     const { id: _, ...values } = data

//     try {
//         const { data: response}: AxiosResponse<ICustomer> = await axios.put('/api/customers/'+id, values)

//         return response
//     } catch (error) {

//         return Promise.reject(error)
//     }
// }

// const deleteCustomer = async (id: string) => {
//     try {
//         const { data: response}: AxiosResponse = await axios.delete('/api/customers/'+id)

//         return response
//     } catch (error) {
        
//         return Promise.reject(error)
//     }
// }

// export { getCustomers, addCustomer, updateCustomer, deleteCustomer ,getCustomerRuc}