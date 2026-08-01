import axios from 'axios';
import { toast } from 'react-toastify';
import config from '.';
import { ResponseError422 } from '../services/ErrorHandlerService';
import { store } from '../redux/store';
import { resetError422 } from '../redux/error422Slice';
import { TOKEN_KEY } from './authStorage';

const axiosGlogal = axios.create({
  baseURL: config.baseUrl,
});

axiosGlogal.interceptors.request.use(
  (requestConfig) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      requestConfig.headers.Authorization = `Bearer ${token}`;
    }
    return requestConfig;
  },
  (error) => Promise.reject(error)
);

axiosGlogal.interceptors.response.use(
  (response) => {
    store.dispatch(resetError422());
    return response;
  },
  (error) => {
    const status = error.response?.status;

    if (status === 422 && error.response?.data?.errors) {
      ResponseError422(error.response.data.errors);
    }

    if (status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      if (window.location.pathname !== '/login') {
        window.location.assign('/login');
      }
    }

    if (status === 403) {
      toast.error('No tenés permiso para esta acción');
    }

    return Promise.reject(error);
  }
);

export default axiosGlogal;
