import { ReactNode, useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import GroupIcon from '@mui/icons-material/Group';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PaymentIcon from '@mui/icons-material/Payment';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import MapIcon from '@mui/icons-material/Map';
import BarChartIcon from '@mui/icons-material/BarChart';
import SettingsIcon from '@mui/icons-material/Settings';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import Layout from '../../components/layout/Layout';
import { useAuth } from '../../context/AuthContext';
import { getReporteResumen } from '../../services/reportes/reportes.service';
import { getCajaResumen } from '../../services/caja/Caja.service';
import { format } from 'date-fns';

type QuickAction = {
  to: string;
  title: string;
  description: string;
  icon: ReactNode;
  show: boolean;
  delayClass: string;
};

const Home = () => {
  const { rol, can } = useAuth();
  const [kpis, setKpis] = useState({ morosos: 0, cobranzaPct: 0, saldoDia: 0 });

  useEffect(() => {
    if (!can('estadisticas')) return;
    const hoy = format(new Date(), 'yyyy-MM-dd');
    Promise.all([
      getReporteResumen({ desde: `${new Date().getFullYear()}-01-01`, hasta: hoy }),
      getCajaResumen({ desdeFecha: hoy, hastaFecha: hoy }),
    ])
      .then(([resumen, cajaDia]) => {
        setKpis({
          morosos: resumen.morosos,
          cobranzaPct: resumen.cobranzaPct,
          saldoDia: cajaDia.saldo,
        });
      })
      .catch(() => undefined);
  }, [can]);

  const actions: QuickAction[] = [
    {
      to: '/pagos',
      title: 'Cobrar',
      description: 'Registrar pagos de facturas pendientes.',
      icon: <PaymentIcon fontSize="large" />,
      show: can('pagos'),
      delayClass: 'yk-delay-1',
    },
    {
      to: '/facturas',
      title: 'Facturas',
      description: 'Ver boletas y cargar consumos.',
      icon: <AssignmentIcon fontSize="large" />,
      show: can('facturas'),
      delayClass: 'yk-delay-2',
    },
    {
      to: '/clientes',
      title: 'Clientes',
      description: 'Vecinos de la junta.',
      icon: <GroupIcon fontSize="large" />,
      show: can('clientes'),
      delayClass: 'yk-delay-3',
    },
    {
      to: '/caja',
      title: 'Caja',
      description: 'Ingresos, egresos y cierres.',
      icon: <AttachMoneyIcon fontSize="large" />,
      show: can('caja'),
      delayClass: 'yk-delay-4',
    },
    {
      to: '/morosos',
      title: 'Deudas atrasadas',
      description: 'Quién debe y exportar listado.',
      icon: <WarningAmberIcon fontSize="large" />,
      show: can('morosos'),
      delayClass: 'yk-delay-1',
    },
    {
      to: '/estadisticas',
      title: 'Reportes',
      description: 'Cobranza, recaudación y consumo.',
      icon: <BarChartIcon fontSize="large" />,
      show: can('estadisticas'),
      delayClass: 'yk-delay-2',
    },
    {
      to: '/mapas',
      title: 'Mapa',
      description: 'Ubicar clientes en la zona.',
      icon: <MapIcon fontSize="large" />,
      show: can('mapas'),
      delayClass: 'yk-delay-3',
    },
    {
      to: '/auditoria',
      title: 'Historial',
      description: 'Qué se hizo y cuándo.',
      icon: <FactCheckIcon fontSize="large" />,
      show: can('auditoria'),
      delayClass: 'yk-delay-4',
    },
    {
      to: '/configuracion',
      title: 'Junta y tarifas',
      description: 'Precios, boleta y datos de la junta.',
      icon: <SettingsIcon fontSize="large" />,
      show: can('config'),
      delayClass: 'yk-delay-1',
    },
    {
      to: '/usuarios',
      title: 'Usuarios',
      description: 'Quién puede entrar al sistema.',
      icon: <ManageAccountsIcon fontSize="large" />,
      show: can('usuarios'),
      delayClass: 'yk-delay-2',
    },
  ];

  const visibleActions = actions.filter((action) => action.show);

  return (
    <Layout bare>
      <>
        <Box
          className="yk-fade-in relative overflow-hidden rounded-3xl"
          sx={{
            minHeight: { xs: 220, md: 280 },
            backgroundImage: 'url(/brand/home-water.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            mb: 3,
          }}
        >
          <Box
            className="absolute inset-0"
            sx={{
              background:
                'linear-gradient(100deg, rgba(8,49,56,0.78) 0%, rgba(11,110,110,0.55) 55%, rgba(31,78,121,0.35) 100%)',
            }}
          />
          <Box className="relative z-10 flex h-full min-h-[220px] flex-col justify-end p-6 md:min-h-[280px] md:p-10">
            <Box className="mb-4 flex items-center gap-3">
              <img
                src="/brand/ykuatia-logo.png"
                alt="Ykuatia ñangareko"
                className="h-14 w-14 rounded-2xl bg-white/90 object-cover p-1.5 shadow-md md:h-16 md:w-16"
              />
              <Typography
                component="p"
                className="yk-brand-title"
                sx={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.95rem', m: 0 }}
              >
                Junta de saneamiento
              </Typography>
            </Box>
            <Typography
              component="h1"
              className="yk-brand-title yk-fade-up"
              sx={{
                color: '#fff',
                fontSize: { xs: '2rem', md: '2.8rem' },
                lineHeight: 1.05,
                maxWidth: 640,
              }}
            >
              Ykuatia ñangareko
            </Typography>
            <Typography
              className="yk-fade-up yk-delay-1"
              sx={{
                mt: 1.5,
                color: 'rgba(255,255,255,0.92)',
                maxWidth: 520,
                fontSize: { xs: '1rem', md: '1.1rem' },
              }}
            >
              Bienvenido{rol ? `, ${rol}` : ''}. Elegí una tarea para empezar el día.
            </Typography>
            {can('estadisticas') && (
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 2 }}>
                <Chip
                  sx={{ bgcolor: 'rgba(255,255,255,0.92)' }}
                  label={`${kpis.morosos} morosos`}
                />
                <Chip
                  sx={{ bgcolor: 'rgba(255,255,255,0.92)' }}
                  label={`Cobranza ${kpis.cobranzaPct}%`}
                />
                <Chip
                  sx={{ bgcolor: 'rgba(255,255,255,0.92)' }}
                  label={`Saldo hoy ${kpis.saldoDia.toLocaleString('es-PY')} Gs`}
                />
              </Stack>
            )}
          </Box>
        </Box>

        <Typography
          component="h2"
          className="yk-brand-title yk-fade-up yk-delay-1"
          sx={{ mb: 2, fontSize: '1.4rem' }}
        >
          Accesos rápidos
        </Typography>

        <Box
          sx={{
            display: 'grid',
            gap: 2,
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
            },
          }}
        >
          {visibleActions.map((action) => (
            <Box
              key={action.to}
              component={RouterLink}
              to={action.to}
              className={`yk-action-tile yk-fade-up ${action.delayClass}`}
              sx={{
                textDecoration: 'none',
                color: 'inherit',
                display: 'flex',
                flexDirection: 'column',
                gap: 1.5,
                p: 2.5,
                borderRadius: 3,
                border: '1px solid rgba(11, 110, 110, 0.12)',
                bgcolor: 'rgba(255,255,255,0.95)',
                minHeight: 160,
              }}
            >
              <Box sx={{ color: 'primary.main' }}>{action.icon}</Box>
              <Typography className="yk-brand-title" sx={{ fontSize: '1.25rem' }}>
                {action.title}
              </Typography>
              <Typography sx={{ color: 'text.secondary', flexGrow: 1 }}>
                {action.description}
              </Typography>
              <Button size="small" sx={{ alignSelf: 'flex-start', px: 0 }}>
                Abrir →
              </Button>
            </Box>
          ))}
        </Box>
      </>
    </Layout>
  );
};

export default Home;
