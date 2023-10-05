import IBillable from "./Billable"
import ITaxPayer from "./TaxPayer"

export default interface IElectronicDocument {
    taxpayer?: ITaxPayer
    billable: IBillable
}