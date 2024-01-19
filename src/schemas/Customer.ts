import * as yup from 'yup';

const schema = yup.object().shape({
    id: yup.number().optional(),
    cedula: yup.string().required('Campo requerido').label('Cedula'),
    nombre: yup.string().required('Campo requerido').label('Nombre'),
    tipoCliente:yup.string().required('Campo requerido').label('Tipo Cliente'),
    telefono: yup.string().required('Campo requerido').label('Teléfono'),
    direccion: yup.string().required('Campo requerido').label('Direccion'),




})

export default schema