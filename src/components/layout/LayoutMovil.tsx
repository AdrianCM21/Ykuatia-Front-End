import * as React from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { LogoutButtonMovil } from './LogoutBottonMovil';
import { scrollAppToTop } from '../../utils/scrollToTop';

interface IProps {
  children: React.ReactElement;
  sectionTitle?: string;
  Action?: () => void;
  actionText?: string;
}

export const LayoutMovil = ({ children, sectionTitle, Action, actionText }: IProps) => {
  const location = useLocation();

  React.useEffect(() => {
    scrollAppToTop();
  }, [location.pathname, sectionTitle]);

  const navItems = [
    { to: '/campo/factura', label: 'Cargar consumo' },
    { to: '/campo/mapa', label: 'Mapa' },
  ];

  return (
    <>
      <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
          <Toolbar sx={{ gap: 1, justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
              <Box
                component="img"
                src="/brand/ykuatia-logo.png"
                alt="Ykuatia"
                sx={{
                  width: 34,
                  height: 34,
                  borderRadius: 1.2,
                  bgcolor: 'rgba(255,255,255,0.92)',
                  objectFit: 'cover',
                  p: 0.35,
                  flexShrink: 0,
                }}
              />
              <Box sx={{ display: 'flex', gap: 0.5, overflowX: 'auto' }}>
                {navItems.map((item) => {
                  const selected = location.pathname === item.to;
                  return (
                    <Button
                      key={item.to}
                      component={RouterLink}
                      to={item.to}
                      size="small"
                      sx={{
                        color: '#fff',
                        bgcolor: selected ? 'rgba(255,255,255,0.18)' : 'transparent',
                        whiteSpace: 'nowrap',
                        px: 1.5,
                        '&:hover': { bgcolor: 'rgba(255,255,255,0.22)' },
                      }}
                    >
                      {item.label}
                    </Button>
                  );
                })}
              </Box>
            </Box>
            <LogoutButtonMovil />
          </Toolbar>
        </AppBar>

        <Box
          id="yk-main-scroll"
          component="main"
          sx={{
            background:
              'radial-gradient(circle at top left, rgba(94,200,200,0.25), transparent 35%), #E8F2F2',
            flexGrow: 1,
            height: '100vh',
            overflowY: 'auto',
            overflowX: 'hidden',
          }}
        >
          <Toolbar />
          <Container maxWidth="lg" sx={{ mt: 3, mb: 4 }} className="yk-fade-up">
            {sectionTitle ? (
              Action ? (
                <Box
                  sx={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 1,
                    mb: 2,
                    flexWrap: 'wrap',
                  }}
                >
                  <Typography variant="h5" className="yk-brand-title">
                    {sectionTitle}
                  </Typography>
                  <Button variant="contained" onClick={Action}>
                    {actionText || 'Acción'}
                  </Button>
                </Box>
              ) : (
                <Typography variant="h5" className="yk-brand-title" sx={{ mb: 2 }}>
                  {sectionTitle}
                </Typography>
              )
            ) : null}
            <Paper
              sx={{
                p: { xs: 2, md: 3 },
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 3,
                bgcolor: 'rgba(255,255,255,0.94)',
              }}
            >
              {children}
            </Paper>
          </Container>
        </Box>
      </Box>
      <ToastContainer position="bottom-center" />
    </>
  );
};
