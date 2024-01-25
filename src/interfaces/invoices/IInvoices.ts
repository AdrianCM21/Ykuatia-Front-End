import ICustomer, { IAuditoria } from "../customers/Customer"

export interface IInvoice {
    id?: number
    estado: string
    Fecha_emicion: string
    monto: number
    consumo: number
    cliente: ICustomer
    auditoria:IAuditoria
    
}