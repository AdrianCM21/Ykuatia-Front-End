import React from 'react'
import { MapComponent } from './components/MapsComponent'
import { getCustomers } from '../../../services/Customers/CustomerService'
import { LayoutMovil } from '../../../components/layout/LayoutMovil'


export const MapsMainScreenMovil = () => {

  const [locacion, setLocacion] = React.useState<{cliente:string, posicion:[number,number]}[]>([])
  React.useEffect(() => {
    const getCustomersF = async () => {
      try {
        const response = await getCustomers(1)
        setLocacion(response.resultado.map((customer) => {
          return {
            cliente: customer.nombre,
            posicion: customer.locacion ? customer.locacion.split(',').map(Number) as [number, number] : [0, 0]
          }
        }))
      } catch (error) {
        console.log(error)
      }
    }
    getCustomersF()
  }, [])

  return (
    <LayoutMovil>
        <MapComponent locations={locacion} />
    </LayoutMovil>
  )
}

