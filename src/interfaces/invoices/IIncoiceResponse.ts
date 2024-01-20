import { IInvoice } from "./IInvoices";

export interface IInvoiceResponose {
    resultado: IInvoice[]
    total: number

}

export interface IInvoiceCargaConsumoResponse {
    message:IInvoice
}