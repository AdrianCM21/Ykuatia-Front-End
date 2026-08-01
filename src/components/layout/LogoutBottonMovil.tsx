import IconButton from '@mui/material/IconButton';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';

export const LogoutButtonMovil = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    try {
      logout();
      toast.success('Sesión cerrada');
      navigate('/login');
    } catch {
      toast.error('No se pudo cerrar sesión');
    }
  };

  return (
    <IconButton
      aria-label="cerrar sesión"
      onClick={handleLogout}
      sx={{
        color: '#fff',
        border: '1px solid rgba(255,255,255,0.45)',
        borderRadius: 2,
      }}
    >
      <ExitToAppIcon />
    </IconButton>
  );
};
