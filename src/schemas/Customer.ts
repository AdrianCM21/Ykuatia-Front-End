import * as yup from 'yup';

const schema = yup.object().shape({
    ruc: yup.string().required('Campo requerido').label('RUC'),
    razon_social: yup.string().required('Campo requerido').label('Razón Social'),
    nombre_fantasia: yup.string().required('Campo requerido').label('Nombre Fantasía'),
    email: yup.string().required('Campo requerido').label('Email'),
    telefono: yup.string().required('Campo requerido').label('Teléfono'),
    celular: yup.string().required('Campo requerido').label('Celular'),
    direccion: yup.string().required('Campo requerido').label('Direccion'),
    ciudad: yup.string().required('Campo requerido').label('Ciudad'),
    distrito: yup.string().required('Campo requerido').label('Distrito'),
    departamento: yup.string().required('Campo requerido').label('Departamento'),


})

export default schema