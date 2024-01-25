import {createSlice} from '@reduxjs/toolkit';
import IErrorResponse422 from '../interfaces/response/errors';
// Inicializamos las variable, En caso de querer implementar en otras partes del codigo añada el nombre de la variable e inicializela entre [], 
const initialState={
   cedula:[] ,telefono:[],nombre:[],direccion:[],longitud:[],latitud:[],codigo:[],iva:[],stock:[],limiteStock:[],precio:[],departamento:[],distrito:[],ciudad:[]}
export const error422Slice = createSlice({
    
    name:"error422",
    initialState,
    reducers:{
        addError422:(state,action)=>{
            
           action.payload.forEach((element:IErrorResponse422) => {
            //@ts-ignore
            state[element.param]=element
           });
        },
        resetError422:()=>{
            return(initialState)
        }
    }

})
export const {addError422,resetError422} = error422Slice.actions;
export default error422Slice.reducer
