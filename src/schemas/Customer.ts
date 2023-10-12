import * as yup from 'yup';

const schema = yup.object().shape({
    cedula: yup.string().required('Campo requerido').label('CEDULA'),
    nombre: yup.string().required('Campo requerido').label('Nombre'),
    longitud: yup.string().required('Campo requerido').label('Longitud'),
    latitud: yup.string().required('Campo requerido').label('Latitud'),
    telefono: yup.string().required('Campo requerido').label('Teléfono'),
    direccion: yup.string().required('Campo requerido').label('Direccion'),



})

export default schema