interface IResponseError{
    msg:string
    param:string
    location:string
    value:string
 }
 
 export default interface IResponseErrorProducts{
    codigo:IResponseError
    stock:IResponseError
    limiteStock:IResponseError
    precio:IResponseError
    nombre:IResponseError
    iva:IResponseError
 }