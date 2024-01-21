import React from 'react'
import Layout from '../../components/layout/Layout'
import { MapComponent } from './components/MapsComponent'
import { getCustomers } from '../../services/Customers/CustomerService'


export const MapsMainScreen = () => {

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
    <Layout>
        <MapComponent locations={locacion} />
    </Layout>
  )
}

