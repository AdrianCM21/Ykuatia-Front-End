import * as yup from 'yup';

const schema = yup.object().shape({
    taxpayer: yup.object().shape({
        version: yup.number().required(),
        fechaFirmaDigital: yup.string().required(),
        ruc: yup.string().required(),
        razonSocial: yup.string().required(),
        nombreFantasia: yup.string().required(),
        actividadesEconomicas: yup.object().shape({
            codigo: yup.string().required(),
            descripcion: yup.string().required()
        }),
        timbradoNumero: yup.string().required(),
        timbradoFecha: yup.string().required(),
        tipoContribuyente: yup.number().required(), 
        tipoRegimen: yup.number().required(), 
        establecimientos: yup.object().shape({
            codigo: yup.string().required(),
            direccion: yup.string().required(), 
            numeroCasa: yup.string().required(), 
            complementoDireccion1: yup.string().required(), 
            complementoDireccion2: yup.string().required(),
            departamento: yup.number().required(),
            distrito: yup.number().required(),
            ciudad: yup.number().required(),
            ciudadDescripcion: yup.string().required(),
            telefono: yup.string().required(),
            email: yup.string().email().required(),
            denominacion: yup.string().required()
        })
    }),
    billable: yup.object().shape({
        tipoDocumento: yup.number().required(),
        establecimiento: yup.string().required(),
        punto: yup.string().required(),
        numero: yup.string().required(),
        codigoSeguridadAleatorio: yup.string().required(),
        descripcion: yup.string().required(),
        observacion: yup.string().required(),
        tipoContribuyente: yup.number().required(),
        fecha: yup.string().required(),
        tipoEmision: yup.number().required(),
        tipoTransaccion: yup.number().required(),
        tipoImpuesto: yup.number().required(),
        moneda: yup.string().required(),
        condicionAnticipo: yup.number().required(),
        condicionTipoCambio: yup.number().required(),
        cambio: yup.number().required(),
        cliente: yup.object().shape({
            contribuyente: yup.bool().required(),
            ruc: yup.string().required(),
            razonSocial: yup.string().required(),
            nombreFantasia: yup.string().required(),
            tipoOperacion: yup.number().required(),
            direccion: yup.string().required(),
            numeroCasa: yup.string().required(),
            departamento: yup.number().required(),
            distrito: yup.number().required(),
            ciudad: yup.number().required(),
            ciudadDescripcion: yup.string().required(),
            pais: yup.string().required(),
            tipoContribuyente: yup.number().required(),
            telefono:  yup.string().required(),
            celular: yup.string().required(),
            email: yup.string().required()
        }),
        factura: yup.object().shape({
            presencia: yup.number().required(),
            fechaEnvio: yup.string().required(),
            dncp: yup.object().shape({
                modalidad: yup.string().required(),
                entidad: yup.number().required(),
                año: yup.number().required(),
                secuencia: yup.number().required(),
                fecha: yup.string().required()
            })
        }),
        condicion: yup.object().shape({
            tipo: yup.number().required(),
            entregas: yup.array().required().of(
                yup.object().shape({
                    tipo: yup.number().required(),
                    monto: yup.number().required(),
                    moneda: yup.string().required(),
                    cambio: yup.string().required()
                })
            )
        }),
        items: yup.array().required().of(
            yup.object().shape({
                codigo: yup.string().required(), 
                descripcion: yup.string().required(), 
                observacion: yup.string().required(),
                cantidad: yup.number().required(),
                precioUnitario: yup.string().required(),
                cambio: yup.number().required(),
                descuento: yup.number().required(),
                anticipo: yup.number().required(),
                ivaTipo: yup.number().required(),
                ivaBase: yup.number().required(),
                iva: yup.number().required()
            })
        )
    })
});

export default schema