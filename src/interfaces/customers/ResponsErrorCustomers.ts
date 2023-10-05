import ICustomer from "./Customer";

interface IResponseError{
   msg:string
   param:string
   location:string
   value:string
}

export default interface IResponseErrorCustomer{
    ruc:IResponseError
    direccion:IResponseError
    email:IResponseError
    telefono:IResponseError
    celular:IResponseError
    razon_social:IResponseError
    nombre_fantasia:IResponseError
    ciudad:IResponseError
    departamento:IResponseError
    distrito:IResponseError
    
}