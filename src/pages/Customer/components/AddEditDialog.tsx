import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, dividerClasses, FormControl, FormHelperText, Grid, IconButton, TextField, Select, MenuItem,InputLabel, } from "@mui/material"
import { useEffect, useState ,useRef} from "react";
import { Controller, useForm } from "react-hook-form";
import ICustomer from "../../../interfaces/customers/Customer";
import schema from "../../../schemas/Customer";
import { yupResolver } from "@hookform/resolvers/yup";
import CloseIcon from '@mui/icons-material/Close'
import { LoadingButton } from "@mui/lab";
import {  useSelector } from "react-redux";
import IResponseErrorCustomer from "../../../interfaces/customers/ResponsErrorCustomers";
import FormHeader from "../../../components/FormHeader";
import { datosUbicacion } from "../../../static/datosUbicacion";

interface IProps {
    open: boolean
    loading: boolean
    onSubmit: (formFields: ICustomer) => void
    onClose: () => void
    current?: ICustomer
}

const CustomerAddEditDialog = ({ open, loading, onSubmit, onClose, current }: IProps) => {
    
    const defaultValues = {
        id: current?.id ?? undefined,
        ruc: current?.ruc ?? '',
        email: current?.email ?? '',
        razon_social: current?.razon_social ?? '',
        nombre_fantasia: current?.nombre_fantasia ?? '',
        telefono: current?.telefono ?? '',
        celular: current?.celular ?? '',
        direccion: current?.direccion ?? '',
        departamento: current?.departamento ?? '', 
        distrito: current?.distrito ?? '', 
        ciudad: current?.ciudad ?? ''
          }

    //@ts-ignore
    const error422:IResponseErrorCustomer=useSelector((state)=>state.error422)
    const {
        reset,
        resetField,
        control,
        setValue,
        getValues,
        handleSubmit,
        watch,
        formState: { errors }
    } = useForm({
        defaultValues,
        mode: 'onChange',
        resolver: yupResolver(schema)
    });

    const handleClose = () => {
        reset();
        onClose();
    };  

        // llamada a las vari
        const [distritos, setDistritos] = useState<Object>({});
        const [ciudades, setCiudades] = useState<Object>({});
        const selectedDepartamento = watch('departamento');
        const selectedDistrito = watch('distrito');
        useEffect(() => {
            
            // Obtener distritos del departamento seleccionado
            if (selectedDepartamento) {
                //@ts-ignore
              const distritosDepartamento = datosUbicacion[selectedDepartamento]?.distritos;
              setDistritos(distritosDepartamento);
              // Obtener ciudades del distrito seleccionado
              if (selectedDistrito) {
                const ciudadesDistrito = (
                    //@ts-ignore
                  datosUbicacion[selectedDepartamento]?.distritos[selectedDistrito]?.ciudades
                );
                if(ciudadesDistrito){
                    setCiudades(ciudadesDistrito)
                }else{
                    setValue("distrito","")
                    setValue("ciudad","")
                }
              }
            }
          }, [selectedDepartamento, selectedDistrito, datosUbicacion]);
          
    
    return (
        <FormHeader open={open}>
            <Dialog
                fullWidth
                open={open}
                maxWidth='md'
                scroll="body"
                onClose={handleClose}
            >
                <DialogTitle sx={{ position: 'relative' }}>
                    {current ? 'EDITAR CLIENTE' : 'AGREGAR CLIENTE'}
                    <IconButton
                        size='small'
                        onClick={handleClose}
                        sx={{ position: 'absolute', right: '1rem', top: '1rem' }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <DialogContent sx={{ py: 0 }}>
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <Controller
                                name='ruc'
                                control={control}
                                render={({ field: { value, onChange } }) => (
                                    <TextField
                                        value={value}
                                        label='RUC'
                                        onChange={onChange}
                                        error={Boolean(errors.ruc)}
                                    />
                                )}
                            />
                            {errors.ruc && <FormHelperText sx={{ color: 'error.main' }}>{errors.ruc.message}</FormHelperText>}
                            {error422.ruc && <FormHelperText sx={{ color: 'error.main' }}>{error422.ruc.msg}</FormHelperText>}

                        </FormControl>
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <Controller
                                name='razon_social'
                                control={control}
                                render={({ field: { value, onChange } }) => (
                                    <TextField
                                        value={value}
                                        label='Razón Social'
                                        onChange={onChange}
                                        error={Boolean(errors.razon_social)}
                                    />
                                )}
                            />
                            {errors.razon_social && <FormHelperText sx={{ color: 'error.main' }}>{errors.razon_social.message}</FormHelperText>}
                            {error422.razon_social && <FormHelperText sx={{ color: 'error.main' }}>{error422.razon_social.msg}</FormHelperText>}
                        </FormControl>
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <Controller
                                name='nombre_fantasia'
                                control={control}
                                render={({ field: { value, onChange } }) => (
                                    <TextField
                                        value={value}
                                        label='Nombre Fantasía'
                                        onChange={onChange}
                                        error={Boolean(errors.nombre_fantasia)}
                                    />
                                )}
                            />
                            {errors.nombre_fantasia && <FormHelperText sx={{ color: 'error.main' }}>{errors.nombre_fantasia.message}</FormHelperText>}
                            {error422.nombre_fantasia && <FormHelperText sx={{ color: 'error.main' }}>{error422.nombre_fantasia.msg}</FormHelperText>}
                        </FormControl>
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <Controller
                                name='email'
                                control={control}
                                render={({ field: { value, onChange } }) => (
                                    <TextField
                                        value={value}
                                        label='Email'
                                        onChange={onChange}
                                        error={Boolean(errors.email)}
                                    />
                                )}
                            />
                            {errors.email && <FormHelperText sx={{ color: 'error.main' }}>{errors.email.message}</FormHelperText>}
                            {error422.email && <FormHelperText sx={{ color: 'error.main' }}>{error422.email.msg}</FormHelperText>}
                        </FormControl>
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <Controller
                                name='telefono'
                                control={control}
                                render={({ field: { value, onChange } }) => (
                                    <TextField
                                        value={value}
                                        label='Teléfono'
                                        onChange={onChange}
                                        error={Boolean(errors.telefono)}
                                    />
                                )}
                            />
                            {errors.telefono && <FormHelperText sx={{ color: 'error.main' }}>{errors.telefono.message}</FormHelperText>}
                            {error422.telefono && <FormHelperText sx={{ color: 'error.main' }}>{error422.telefono.msg}</FormHelperText>}
                        </FormControl>
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <Controller
                                name='celular'
                                control={control}
                                render={({ field: { value, onChange } }) => (
                                    <TextField
                                        value={value}
                                        label='Celular'
                                        onChange={onChange}
                                        error={Boolean(errors.celular)}
                                    />
                                )}
                            />
                            {errors.celular && <FormHelperText sx={{ color: 'error.main' }}>{errors.celular.message}</FormHelperText>}
                            {error422.celular && <FormHelperText sx={{ color: 'error.main' }}>{error422.celular.msg}</FormHelperText>}
                        </FormControl>
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <Controller
                                name='direccion'
                                control={control}
                                render={({ field: { value, onChange } }) => (
                                    <TextField
                                        value={value}
                                        label='Direccion'
                                        onChange={onChange}
                                        error={Boolean(errors.direccion)}
                                    />
                                )}
                            />
                            {errors.direccion && <FormHelperText sx={{ color: 'error.main' }}>{errors.direccion.message}</FormHelperText>}
                            {error422.direccion && <FormHelperText sx={{ color: 'error.main' }}>{error422.direccion.msg}</FormHelperText>}
                        </FormControl>
                        <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel>Departamento</InputLabel>
                    <Controller
                    name='departamento'
                    control={control}
                    render={({ field: { value, onChange } }) => (
                        <Select
                        value={value}
                        label='Departamento'
                        onChange={onChange}
                        error={Boolean(errors.departamento)}
                        >
                        {Object.entries(datosUbicacion).map(([cod,departamento]) => (
                            <MenuItem key={cod} value={cod}>
                            { departamento.departamento}
                            </MenuItem>
                        ))}
                        </Select>
                    )}
                    />
                    {errors.departamento && <FormHelperText sx={{ color: 'error.main' }}>{errors.departamento.message}</FormHelperText>}
                            {error422.departamento && <FormHelperText sx={{ color: 'error.main' }}>{error422.departamento.msg}</FormHelperText>}
                </FormControl>

                <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Distritos</InputLabel>
                    <Controller
                    name='distrito'
                    control={control}
                    render={({ field: { value, onChange } }) => (
                        <Select
                        value={value}
                        label='Distrito'
                        onChange={onChange}
                        error={Boolean(errors.distrito)}
                        >
                        {Object.entries(distritos).map(([cod,distrito]) => (
                            <MenuItem key={cod} value={cod}>
                            {distrito.distrito}
                            </MenuItem>
                        ))}
                        </Select>
                    )}
                    />
                    {errors.distrito && <FormHelperText sx={{ color: 'error.main' }}>{errors.distrito.message}</FormHelperText>}
                            {error422.distrito && <FormHelperText sx={{ color: 'error.main' }}>{error422.distrito.msg}</FormHelperText>}
                </FormControl>

                <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Ciudades</InputLabel>
                    <Controller
                    name='ciudad'
                    control={control}
                    render={({ field: { value, onChange } }) => (
                        <Select
                        value={value}
                        label='Ciudad'
                        onChange={onChange}
                        error={Boolean(errors.ciudad)}
                        >
                        {Object.entries(ciudades).map(([cod,ciudad]) => (
                            <MenuItem key={cod} value={cod}>
                            {ciudad.ciudad}
                            </MenuItem>
                        ))}
                        </Select>
                    )}
                    />
                    {errors.ciudad && <FormHelperText sx={{ color: 'error.main' }}>{errors.ciudad.message}</FormHelperText>}
                            {error422.ciudad && <FormHelperText sx={{ color: 'error.main' }}>{error422.ciudad.msg}</FormHelperText>}
                </FormControl>
                    <Controller
                        name='id'
                        control={control}
                        render={({ field: { value, onChange } }) => (
                            <input type={"hidden"} value={value}/>
                        )}
                    />
                </DialogContent>
                <DialogActions>
                    <LoadingButton size='large' type='submit' variant='contained' loading={loading}>
                        Guardar
                    </LoadingButton>
                    <Button size='large' variant='outlined' onClick={handleClose}>
                        Cancelar
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    </FormHeader>
    )
}

export default CustomerAddEditDialog