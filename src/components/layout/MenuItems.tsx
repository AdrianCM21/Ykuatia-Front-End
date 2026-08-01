import * as React from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import BarChartIcon from '@mui/icons-material/BarChart';
import MapIcon from '@mui/icons-material/Map';
import HomeIcon from '@mui/icons-material/Home';
import GroupIcon from '@mui/icons-material/Group';
import PaymentIcon from '@mui/icons-material/Payment';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import SettingsIcon from '@mui/icons-material/Settings';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { checkInvoices } from '../../services/invoices/invoices.service';
import { useAuth } from '../../context/AuthContext';
import { AppPerm } from '../../utils/permissions';

type MenuItem = {
  to: string;
  label: string;
  hint?: string;
  icon: React.ReactNode;
  perm?: AppPerm;
};

type MenuGroup = {
  id: string;
  title: string;
  items: MenuItem[];
};

const isActivePath = (pathname: string, to: string) => {
  if (to === '/') return pathname === '/';
  return pathname === to || pathname.startsWith(`${to}/`);
};

const ROLE_LABEL: Record<string, string> = {
  admin: 'Administrador',
  presidente: 'Presidente',
  tesorero: 'Tesorero',
  cajero: 'Cajero',
};

export const MainMenuItems = () => {
  const location = useLocation();
  const { can, isAuthenticated, rol } = useAuth();
  const [hasNotification, setHasNotification] = React.useState(false);

  React.useEffect(() => {
    if (!can('facturas')) return;
    const checkNotificaciones = async () => {
      const result = await checkInvoices();
      setHasNotification(result);
    };
    checkNotificaciones();
  }, [location.pathname, can]);

  const groups: MenuGroup[] = [
    {
      id: 'inicio',
      title: '',
      items: [{ to: '/', label: 'Inicio', hint: 'Resumen del día', icon: <HomeIcon /> }],
    },
    {
      id: 'cobranza',
      title: 'Cobranza',
      items: [
        {
          to: '/pagos',
          label: 'Cobrar',
          hint: 'Registrar pagos',
          icon: <PaymentIcon />,
          perm: 'pagos',
        },
        {
          to: '/facturas',
          label: 'Facturas',
          hint: 'Boletas y consumos',
          icon: (
            <Badge color="error" variant="dot" invisible={!hasNotification}>
              <AssignmentIcon />
            </Badge>
          ),
          perm: 'facturas',
        },
        {
          to: '/clientes',
          label: 'Clientes',
          hint: 'Vecinos de la junta',
          icon: <GroupIcon />,
          perm: 'clientes',
        },
      ],
    },
    {
      id: 'control',
      title: 'Dinero y control',
      items: [
        {
          to: '/caja',
          label: 'Caja',
          hint: 'Ingresos y cierres',
          icon: <AttachMoneyIcon />,
          perm: 'caja',
        },
        {
          to: '/morosos',
          label: 'Deudas atrasadas',
          hint: 'Quién debe y cuánto',
          icon: <WarningAmberIcon />,
          perm: 'morosos',
        },
        {
          to: '/estadisticas',
          label: 'Reportes',
          hint: 'Cobranza y números',
          icon: <BarChartIcon />,
          perm: 'estadisticas',
        },
        {
          to: '/mapas',
          label: 'Mapa',
          hint: 'Ubicación de clientes',
          icon: <MapIcon />,
          perm: 'mapas',
        },
      ],
    },
    {
      id: 'admin',
      title: 'Administración',
      items: [
        {
          to: '/configuracion',
          label: 'Junta y tarifas',
          hint: 'Precios y datos',
          icon: <SettingsIcon />,
          perm: 'config',
        },
        {
          to: '/usuarios',
          label: 'Usuarios',
          hint: 'Quién puede entrar',
          icon: <ManageAccountsIcon />,
          perm: 'usuarios',
        },
        {
          to: '/auditoria',
          label: 'Historial',
          hint: 'Qué se hizo y cuándo',
          icon: <FactCheckIcon />,
          perm: 'auditoria',
        },
      ],
    },
  ];

  const visibleGroups = groups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => !item.perm || (isAuthenticated && can(item.perm))),
    }))
    .filter((group) => group.items.length > 0);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
      <Box sx={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', px: 1, py: 0.5 }}>
        {visibleGroups.map((group) => (
          <Box key={group.id} sx={{ mb: 1.25 }}>
            {group.title ? (
              <Typography
                variant="caption"
                sx={{
                  display: 'block',
                  px: 1.5,
                  pt: 0.75,
                  pb: 0.75,
                  color: 'text.secondary',
                  fontWeight: 700,
                  letterSpacing: 0.6,
                  textTransform: 'uppercase',
                  fontSize: '0.68rem',
                }}
              >
                {group.title}
              </Typography>
            ) : null}

            {group.items.map((item) => {
              const selected = isActivePath(location.pathname, item.to);
              return (
                <ListItemButton
                  key={item.to}
                  component={RouterLink}
                  to={item.to}
                  selected={selected}
                  className="yk-nav-link"
                  sx={{
                    mb: 0.35,
                    borderRadius: 2,
                    minHeight: 48,
                    px: 1.5,
                    color: selected ? 'primary.main' : 'text.primary',
                    bgcolor: selected ? 'rgba(11, 110, 110, 0.12)' : 'transparent',
                    '&:hover': {
                      bgcolor: 'rgba(11, 110, 110, 0.08)',
                    },
                    '&.Mui-selected': {
                      bgcolor: 'rgba(11, 110, 110, 0.12)',
                    },
                    '&.Mui-selected:hover': {
                      bgcolor: 'rgba(11, 110, 110, 0.16)',
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 40,
                      color: selected ? 'primary.main' : 'text.secondary',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    secondary={item.hint}
                    primaryTypographyProps={{
                      fontWeight: selected ? 700 : 600,
                      fontSize: '0.95rem',
                      lineHeight: 1.25,
                      noWrap: true,
                    }}
                    secondaryTypographyProps={{
                      fontSize: '0.72rem',
                      noWrap: true,
                    }}
                  />
                </ListItemButton>
              );
            })}
          </Box>
        ))}
      </Box>

      <Box
        sx={{
          mx: 1,
          mb: 1,
          mt: 0.5,
          px: 1.5,
          py: 1.25,
          borderRadius: 2,
          bgcolor: 'rgba(11, 110, 110, 0.06)',
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Typography variant="caption" color="text.secondary" display="block">
          Sesión
        </Typography>
        <Typography variant="body2" fontWeight={700} noWrap>
          {ROLE_LABEL[rol || ''] || rol || '—'}
        </Typography>
      </Box>
    </Box>
  );
};
