import Condition from "../../../enums/Condition"
import Method from "../../../enums/Method"
import CurrencyType  from "../../../types/CurrencyType"

export default interface Payment {
    condition: Condition,
    method: Method,
    currency: CurrencyType,
    currency_exchange: number,
    amount: number,
}