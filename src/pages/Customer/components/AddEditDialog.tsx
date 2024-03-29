import {  Button, Dialog, DialogActions, DialogContent, DialogTitle,  FormControl, FormHelperText, IconButton, TextField, Select, MenuItem,InputLabel, } from "@mui/material"
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import ICustomer from "../../../interfaces/customers/Customer";

import CloseIcon from '@mui/icons-material/Close'
import { LoadingButton } from "@mui/lab";
import {  useSelector } from "react-redux";
import IResponseErrorCustomer from "../../../interfaces/customers/ResponsErrorCustomers";
import FormHeader from "../../../components/FormHeader";
import { getTipoCliente } from "../../../services/Customers/CustomerService";
import ICustomertypes from "../../../interfaces/customers/CustomersTypes";
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';

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
        cedula: current?.cedula ?? '',
        nombre: current?.nombre ?? '',
        direccion: current?.direccion ?? '',
        telefono: current?.telefono ?? '',
        tipoCliente:current?.tipoCliente ?? '',
        locacion:current?.locacion?current.locacion: '',
        }

    //Obtencion de datos de tipo cliente para el select
    const [tipoCliente, setTipoCliente] = useState<ICustomertypes[]>([]);
    const [loadingSelect,setLoadingSelect] = useState<boolean>(true)

    const [position, setPosition] = useState<[number, number] | null>(current?.locacion?current.locacion.split(',').map(Number) as [number,number]:null);
    useEffect(() => {
      
    getTiposSelect()
      
    }, [])
  

    const getTiposSelect= async()=>{
        try {
            const response = await getTipoCliente()
            setTipoCliente(response)
            setLoadingSelect(false)
        } catch (error) {
            
        }
    }
    //@ts-ignore
    const error422:IResponseErrorCustomer=useSelector((state)=>state.error422)
    const {
        reset,
        control,
        handleSubmit,
        setValue,
        formState: { errors }
    } = useForm({
        defaultValues,
        mode: 'onChange',
        // resolver: yupResolver(schema)
    });
    const Markers = () => {
        useMapEvents({
            click: (e:any) => {
                const newPosition:[number,number] = [e.latlng.lat, e.latlng.lng];
                setPosition(newPosition);
                setValue('locacion', newPosition.join(',')); // Actualiza el valor de 'locacion'
            },
        });
    
        return position === null ? null : <Marker position={position} />;
    };

    const handleClose = () => {
        reset();
        onClose();
    };  


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
                {/* @ts-ignores */}
                <form onSubmit={handleSubmit(onSubmit)}>
                    <DialogContent sx={{ py: 0 }}>
                       
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <Controller
                                name='nombre'
                                control={control}
                                render={({ field: { value, onChange } }) => (
                                    <TextField
                                        value={value}
                                        label='Nombre'
                                        onChange={onChange}
                                        error={Boolean(errors.nombre)}
                                    />
                                )}
                            />
                            {errors.nombre && <FormHelperText sx={{ color: 'error.main' }}>{errors.nombre.message}</FormHelperText>}
                            {error422.nombre && <FormHelperText sx={{ color: 'error.main' }}>{error422.nombre.msg}</FormHelperText>}
                        </FormControl>    
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <Controller
                                name='cedula'
                                control={control}
                                render={({ field: { value, onChange } }) => (
                                    <TextField
                                        value={value}
                                        label='Cedula'
                                        onChange={onChange}
                                        error={Boolean(errors.cedula)}
                                    />
                                )}
                            />
                            {errors.cedula && <FormHelperText sx={{ color: 'error.main' }}>{errors.cedula.message}</FormHelperText>}
                            {error422.cedula && <FormHelperText sx={{ color: 'error.main' }}>{error422.cedula.msg}</FormHelperText>}

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
                            <InputLabel htmlFor="tipo-cliente-select">Tipo Cliente</InputLabel>
                            <Controller
                                name='tipoCliente'
                                control={control}
                                render={({ field: { value, onChange } }) => (
                                    <Select
                                        value={value}
                                        label='Tipo Cliente'
                                        onChange={onChange}
                                        inputProps={{
                                            id: 'tipo-cliente-select',
                                        }}
                                    >
                                        {loadingSelect ? (
                                            <MenuItem disabled>Cargando...</MenuItem>
                                        ) : (
                                            tipoCliente.map((tipo, index) => (
                                                <MenuItem key={index} value={tipo.id_tipo}>     
                                                    {tipo.descripcion}
                                                </MenuItem>
                                            ))
                                        )}
                                        
                                    </Select>
                                )}
                            />
                         {errors.tipoCliente && <FormHelperText sx={{ color: 'error.main' }}>{errors.tipoCliente.message}</FormHelperText>}
                        </FormControl>
                        {/* @ts-ignore */}
                        <MapContainer center={ [ -26.6324065, -55.51918569999999] as [number,number]} zoom={13} style={{ height: "58vh", width: "100%" }}>
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <Markers />
                        </MapContainer>
                        <Controller
                            name='locacion'
                            control={control}
                            render={({ field }) => (
                                <input
                                    type="hidden"
                                    {...field} // Propaga las propiedades del campo, incluyendo 'value'
                                />
                            )}
                        />
                       
                       
                    <Controller
                        name='id'
                        control={control}
                        render={({ field: { value} }) => (
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