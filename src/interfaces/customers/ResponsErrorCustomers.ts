
interface IResponseError{
   msg:string
   param:string
   location:string
   value:string
}

export default interface IResponseErrorCustomer{
    cedula:IResponseError
    direccion:IResponseError
    telefono:IResponseError
    nombre:IResponseError
    longitud:IResponseError
    latitud:IResponseError
    
}