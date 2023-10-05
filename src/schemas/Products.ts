import * as yup from 'yup';

const schema = yup.object().shape({
    nombre: yup.string().required('Campo requerido').label('NOMBRE'),
    codigo: yup.string().required('Campo requerido').label('CODIGO'),
    precio: yup.string().required('Campo requerido').label('PRECIO'),
    stock: yup.string().label('STOCK'),
    iva: yup.string().required('Campo requerido').label('IVA'),
    limiteStock: yup.string().required('Campo requerido').label('Stock ilimitado')
})

export default schema