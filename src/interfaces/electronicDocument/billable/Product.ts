import VatType from "../../../enums/VatType"

export default interface Product {
    codigo: string,
    name: string,
    quantity: number,
    unit_price: number,
    change: number,
    discount: number,
    advancement: number,
    vat_type: VatType,
    vat_base: number,
    vat: number
}