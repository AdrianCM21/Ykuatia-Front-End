import DocumentType from "../../enums/DocumentType"
import EmissionType from "../../enums/EmissionType"
import TransactionType from "../../enums/TransactionType"
import CurrencyType from "../../types/CurrencyType"
import IBillableBill from "./billable/BillableBill"
import IBillableClient from "./billable/BillableClient"
import IBillableCondition from "./billable/BillableCondition"
import IBillableProduct from "./billable/BillableProduct"

export default interface IBillable {
    tipoDocumento?: DocumentType
    establecimiento: string
    punto: string
    numero?: string
    codigoSeguridadAleatorio?: string
    descripcion: string
    observacion: string
    tipoContribuyente: number
    fecha: string
    tipoEmision: EmissionType
    tipoTransaccion?: TransactionType
    tipoImpuesto?: number
    moneda: CurrencyType
    condicionAnticipo?: number
    condicionTipoCambio?: number
    cambio: number
    cliente: IBillableClient
    factura: IBillableBill
    condicion: IBillableCondition
    items: IBillableProduct[]
}