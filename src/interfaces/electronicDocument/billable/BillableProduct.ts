import VatType from "../../../enums/VatType"

export default interface IBillableProduct {
    codigo: string
    descripcion: string
    observacion?: string
    cantidad: number
    precioUnitario: string
    cambio?: number
    descuento?: number
    anticipo?: number
    ivaTipo: VatType
    ivaBase: number
    iva: number
}