export interface IAuditoria {
    id:number
    historial_cambios:string
}

export default interface ICustomer {
    id?: number
    cedula: string
    nombre: string
    direccion: string
    telefono:string
    tipoCliente: string
    auditoria:IAuditoria
    
}