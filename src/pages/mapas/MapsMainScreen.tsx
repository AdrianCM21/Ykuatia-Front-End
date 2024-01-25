import React, { useEffect, useState } from 'react'
import Layout from '../../components/layout/Layout'
import { MapComponent } from './components/MapsComponent'
import { getCustomers } from '../../services/Customers/CustomerService'
import { TextField } from '@mui/material'
import ICustomer from '../../interfaces/customers/Customer'


export const MapsMainScreen = () => {

  const [locacion, setLocacion] = React.useState<{cliente:string, posicion:[number,number]}[]>([])
  const [customers,setCustomers ]=React.useState<ICustomer[]>([])
  const [searchText, setSearchText] = useState<string>('');
  const [customerFilter, setCustomerFilter] = useState<ICustomer[]>([]);

  React.useEffect(() => {
    const getCustomersF = async () => {
      try {
        const response = await getCustomers(1)
        await setCustomers(response.resultado)
        setCustomerFilter(response.resultado)
      
      } catch (error) {
        console.log(error)
      }
    }
    getCustomersF()
  }, [])




  const handleSearch = async(event:any,setSearchText:React.Dispatch<React.SetStateAction<string>>) => {
    const searchText = event.target.value.toLowerCase();
    setSearchText(searchText);
    const filtered = customers.filter((item) =>
      item['nombre'].toLowerCase().includes(searchText)
    );
    setCustomerFilter(filtered)
  };
  useEffect(() => {
    setLocacion(customerFilter.map((customer) => {
      return {
        cliente: customer.nombre,
        posicion: customer.locacion ? customer.locacion.split(',').map(Number) as [number, number] : [0, 0]
      }
    }))
  

  }, [customers,[searchText]])
  

  return (
    <Layout>
      <>
      <TextField
                            label="Buscar por nombre"
                            value={searchText}
                            onChange={(e) => handleSearch(e,setSearchText)}
                            />
        <MapComponent locations={locacion} />
      </>
      
    </Layout>
  )
}

