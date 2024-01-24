import React from 'react';
import Button from '@mui/material/Button';
import ExitToAppIcon from '@mui/icons-material/ExitToApp'; // Importa un icono de Material-UI
import { logout } from '../../services/auth/auth';
import { toast } from 'react-toastify';
export const LogoutButtonMovil = () => {
  const handleLogout = async() => {
    try {
      logout()
      toast.success('Sesion cerrada');
      location.reload()
    } catch (error) {
      toast.error('No se pudo cerrar sesion')
    }
  };

  return (
    <Button
      variant="outlined"
      sx={{color:'#fff'}}
      startIcon={<ExitToAppIcon />} // Agrega un icono de salida a la derecha del texto
      onClick={handleLogout}
    >
    </Button>
  );
};

