import ICustomertypes from "./CustomersTypes"

export default interface ICustomer {
    id?: number
    cedula: string
    nombre: string
    direccion: string
    telefono:string
    tipoCliente: string
    
}