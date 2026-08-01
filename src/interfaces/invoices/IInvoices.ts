import ICustomer, { IAuditoria } from "../customers/Customer"

export interface IInvoice {
    id?: number
    estado: string
    Fecha_emicion: string
    anio_mes?: string
    monto: number
    monto_pagado?: number
    fecha_vencimiento?: string
    consumo: number
    saldo?: number
    recargo?: number
    cliente: ICustomer
    auditoria:IAuditoria
}