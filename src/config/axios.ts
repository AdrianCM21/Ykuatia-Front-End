import axios from 'axios';
import config from '.';
import { ResponseError422 } from '../services/ErrorHandlerService';
import { store } from '../redux/store';
import { resetError422 } from '../redux/error422Slice';


 const axiosGlogal= axios.create({
  baseURL: config.baseUrl,
  headers: {
    "x-api-key": config.apiKey
  },
})

axiosGlogal.interceptors.request.use((config) => {
  const token = localStorage.getItem('x-token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Estas funciones atrapan las respuestas de todas la peticines que realizes 
axiosGlogal.interceptors.response.use((response)=>{
  store.dispatch(resetError422(''))
  return response
}, (error)=> {
  //En caso de un error 422 se ejecuta automaticamente la funcion para manejarlas 
  if(error.response.status==422){
    ResponseError422(error.response.data.errors)
  }
  return(Promise.reject(error))
});
export default axiosGlogal
