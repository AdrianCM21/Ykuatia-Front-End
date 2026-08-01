import axios from '../../config/axios';
import { AxiosResponse } from 'axios';
import ICustomer from '../../interfaces/customers/Customer';
import paginationNro from '../../config/paginationNro';
import ICustomertypes from '../../interfaces/customers/CustomersTypes';
import { ICustomerResponose } from '../../interfaces/customers/CustomesResponse';

export type CustomerListParams = {
  page?: number;
  q?: string;
  limit?: number;
};

const getCustomers = async (params: CustomerListParams | number = 1) => {
  const page = typeof params === 'number' ? params : params.page ?? 1;
  const q = typeof params === 'number' ? undefined : params.q;
  const limit =
    typeof params === 'number'
      ? paginationNro.paginationNro
      : params.limit ?? paginationNro.paginationNro;

  const { data: response }: AxiosResponse<ICustomerResponose> = await axios.get('/api/cliente', {
    params: { page, limit, q: q || undefined },
  });
  return response;
};

const getCustomersFactura = async (params: CustomerListParams = {}) => {
  const { data: response }: AxiosResponse<ICustomerResponose> = await axios.get('/api/clientefactura', {
    params: {
      page: params.page ?? 1,
      limit: params.limit ?? paginationNro.paginationNro,
      q: params.q || undefined,
    },
  });
  return response;
};

const getTipoCliente = async () => {
  const { data: response }: AxiosResponse<ICustomertypes[]> = await axios.get('/api/clientetipo');
  return response;
};

const getLecturasCliente = async (id: number, page = 1) => {
  const { data } = await axios.get(`/api/cliente/${id}/lecturas`, {
    params: { page, limit: paginationNro.paginationNro },
  });
  return data as {
    resultado: Array<{
      id: number;
      consumo: number;
      fecha: string;
      origen: string;
      factura?: { id: number; anio_mes?: string } | null;
    }>;
    total: number;
  };
};

const addCliente = async (data: ICustomer) => {
  const { data: response }: AxiosResponse<ICustomer> = await axios.post('/api/cliente', data);
  return response;
};

const updateCliente = async (data: ICustomer) => {
  const { id, ...values } = data;
  const { data: response }: AxiosResponse<ICustomer> = await axios.put(`/api/cliente/${id}`, values);
  return response;
};

const deleteCliente = async (id: string) => {
  const { data: response }: AxiosResponse = await axios.delete(`/api/cliente/${id}`);
  return response;
};

export {
  getCustomers,
  addCliente,
  updateCliente,
  deleteCliente,
  getTipoCliente,
  getCustomersFactura,
  getLecturasCliente,
};
