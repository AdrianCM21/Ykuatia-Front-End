import CurrencyType from "../../../types/CurrencyType"

interface IBillableConditionPayment {
    tipo: number
    monto: number
    moneda: CurrencyType
    cambio: string
}

export default interface IBillableCondition {
    tipo: number
    entregas?: IBillableConditionPayment[]
}