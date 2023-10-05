import ITaxPayerActivity from "./taxpayer/TaxPayerActivity"
import ITaxPayerEstablishment from "./taxpayer/TaxPayerEstablishment"

export default interface ITaxPayer {
    version: number
    fechaFirmaDigital: string
    ruc: string
    razonSocial: string
    nombreFantasia: string
    actividadesEconomicas: ITaxPayerActivity[]
    timbradoNumero: string
    timbradoFecha: string
    tipoContribuyente: number
    tipoRegimen: number
    establecimientos: ITaxPayerEstablishment[]
}