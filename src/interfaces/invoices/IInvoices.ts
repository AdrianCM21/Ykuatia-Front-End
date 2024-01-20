import { IAuditoria } from "../customers/Customer"

export interface IInvoice {
    id?: number
    estado: string
    Fecha_emicion: string
    monto: number
    cliente: JSON
    auditoria:IAuditoria
    
}