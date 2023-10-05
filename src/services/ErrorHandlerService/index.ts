import { toast } from "react-toastify"
import IErrorResponse422 from "../../interfaces/response/errors"
import { addError422, resetError422 } from "../../redux/error422Slice"
import { store } from "../../redux/store"
// En este manejador accedemos a las variable globlales 
const ResponseError422=(arrayErros:IErrorResponse422[])=>{
    // Reseteamos todos los errores anteriores
    store.dispatch(resetError422(''))
    // Enviamos la lista con los errores que nos mandan y se guardan en el redux
    store.dispatch(addError422(arrayErros))
    toast.error('Error en los datos enviados.')
}
//Importante para poder usar esta funcion agraga el nombre de tu input en el archivo redux/error422Slice.tsx y posterior en el formulario que vas a usar llama al store, HeaderForm y coloca como se realizo en el archivo pages/Customer/component/AddEditDialog.tsx :) 

export {ResponseError422}