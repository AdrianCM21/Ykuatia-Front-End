import {createSlice} from '@reduxjs/toolkit';
// Inicializamos las variable, En caso de querer implementar en otras partes del codigo añada el nombre de la variable e inicializela entre [], 
const initialState={admin:false,campo:false}
export const accessGlobal = createSlice({
    
    name:"access",
    initialState,
    reducers:{
        isAdmin:(state,action)=>{
            console.log(action.payload)
            
            state.admin= action.payload
        },
        isCampo:(state,action)=>{
            
            state.campo= action.payload
        }
    }

})
export const {isAdmin,isCampo} = accessGlobal.actions;
export default accessGlobal.reducer
