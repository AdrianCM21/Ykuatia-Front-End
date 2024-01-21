import { IInvoice } from "../invoices/IInvoices"

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
    fecha_creacion: string
    tipoCliente: string
    auditoria?:IAuditoria
    factura:IInvoice[]
    
}