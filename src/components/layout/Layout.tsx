import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import { Button } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MainMenuItems } from './MenuItems';
import LogoutButton from './LogoutButton';
import { scrollAppToTop } from '../../utils/scrollToTop';

interface IProps {
  children: React.ReactElement;
  sectionTitle?: string;
  Action?: () => void;
  actionText?: string;
  bare?: boolean;
}

const drawerWidth = 280;

const AppBar = styled(MuiAppBar)(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  width: '100%',
}));

const Drawer = styled(MuiDrawer)(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  [`& .MuiDrawer-paper`]: {
    width: drawerWidth,
    boxSizing: 'border-box',
    top: 64,
    height: 'calc(100% - 64px)',
    borderRight: '1px solid rgba(11, 110, 110, 0.12)',
    [theme.breakpoints.down('sm')]: {
      top: 56,
      height: 'calc(100% - 56px)',
    },
  },
}));

const Layout = ({ children, sectionTitle, Action, actionText, bare = false }: IProps) => {
  const { pathname } = useLocation();

  useEffect(() => {
    scrollAppToTop();
  }, [pathname, sectionTitle]);

  return (
    <>
      <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
        <AppBar position="fixed">
          <Toolbar sx={{ pr: 3, gap: 1.5 }}>
            <Box
              component="img"
              src="/brand/ykuatia-logo.png"
              alt=""
              sx={{
                width: 36,
                height: 36,
                borderRadius: 1.5,
                bgcolor: 'rgba(255,255,255,0.92)',
                objectFit: 'cover',
                p: 0.4,
                display: { xs: 'none', sm: 'block' },
              }}
            />
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              className="yk-brand-title"
              sx={{ flexGrow: 1, fontSize: { xs: '1.05rem', sm: '1.25rem' } }}
            >
              Ykuatia ñangareko
            </Typography>
            <LogoutButton />
          </Toolbar>
        </AppBar>

        <Drawer variant="permanent" open>
          <Box
            sx={{
              px: 2,
              py: 1.5,
              minHeight: 56,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 700, color: 'primary.dark', lineHeight: 1.2 }}
            >
              Oficina
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap>
              Accesos principales
            </Typography>
          </Box>
          <Divider />
          <List
            component="nav"
            disablePadding
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              minHeight: 0,
              height: '100%',
              py: 1,
              overflow: 'hidden',
            }}
          >
            <MainMenuItems />
          </List>
        </Drawer>

        <Box
          id="yk-main-scroll"
          component="main"
          sx={{
            background:
              'radial-gradient(circle at top right, rgba(94,200,200,0.22), transparent 32%), linear-gradient(180deg, #EAF5F5 0%, #E8F2F2 45%, #E3EEF3 100%)',
            flexGrow: 1,
            width: `calc(100% - ${drawerWidth}px)`,
            minWidth: 0,
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
                    gap: 2,
                    mb: 2,
                    flexWrap: 'wrap',
                  }}
                >
                  <Typography component="h2" variant="h5" className="yk-brand-title">
                    {sectionTitle}
                  </Typography>
                  <Button variant="contained" onClick={Action}>
                    {actionText || 'Acción'}
                  </Button>
                </Box>
              ) : (
                <Typography component="h2" variant="h5" className="yk-brand-title" sx={{ mb: 2 }}>
                  {sectionTitle}
                </Typography>
              )
            ) : null}

            {bare ? (
              children
            ) : (
              <Paper
                sx={{
                  p: { xs: 2, md: 3 },
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 3,
                  bgcolor: 'rgba(255,255,255,0.92)',
                }}
              >
                {children}
              </Paper>
            )}

            <Typography variant="body2" color="text.secondary" align="center" sx={{ pt: 3 }}>
              © {new Date().getFullYear()} Ykuatia ñangareko — Junta de saneamiento
            </Typography>
          </Container>
        </Box>
      </Box>
      <ToastContainer position="bottom-right" />
    </>
  );
};

export default Layout;
