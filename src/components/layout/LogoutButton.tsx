import Button from '@mui/material/Button';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';

const LogoutButton = () => {
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
    <Button
      variant="outlined"
      startIcon={<ExitToAppIcon />}
      onClick={handleLogout}
      sx={{
        color: '#fff',
        borderColor: 'rgba(255,255,255,0.55)',
        '&:hover': {
          borderColor: '#fff',
          bgcolor: 'rgba(255,255,255,0.1)',
        },
      }}
    >
      Salir
    </Button>
  );
};

export default LogoutButton;
