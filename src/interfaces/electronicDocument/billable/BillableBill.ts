interface IBillableBillDncp {
    modalidad: string
    entidad: number
    año: number
    secuencia: number
    fecha: string
}

export default interface IBillableBill  {
    presencia: number
    fechaEnvio: string
    dncp?: IBillableBillDncp
}