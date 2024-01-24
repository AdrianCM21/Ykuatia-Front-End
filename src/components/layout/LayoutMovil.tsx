import * as React from 'react';
import {  Link as RouterLink } from "react-router-dom";
import {  createTheme, ThemeProvider } from '@mui/material/styles';
import ListItemButton from "@mui/material/ListItemButton";
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Badge from '@mui/material/Badge';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button, ListItemText } from '@mui/material';
import { styled } from "@mui/system";
import { LogoutButtonMovil } from './LogoutBottonMovil';
interface IProps {
    children: JSX.Element
    sectionTitle?: string
    Action?:() => void
    actionText?:string
  }

const mdTheme = createTheme();
const CustomListItemButton = styled(ListItemButton)(({ theme, selected }) => ({
    color: selected ? theme.palette.primary.main : theme.palette.text.primary,
    margin: 0,
    padding: 0,
  }));

export const LayoutMovil = ({ children, sectionTitle, Action, actionText }:IProps) => {
  return (
    <ThemeProvider theme={mdTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="absolute" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
          <Toolbar sx={{ pr: '24px',display:'flex',justifyContent:'space-between',flexDirection:'row'}}>

            <React.Fragment>

            
            <RouterLink to="/campo/factura" style={{ textDecoration: "none", color: "inherit" }}>
        <CustomListItemButton selected={location.pathname === "/campo/factura"}>
          <ListItemButton>
            <ListItemText>
              <Typography color={"#fff"}>Carga Facturas</Typography>
            </ListItemText>
          </ListItemButton>
        </CustomListItemButton>
      </RouterLink>

     <RouterLink
        to="/campo/mapa"
        style={{ textDecoration: "none", color: "inherit" }}
      >
        <CustomListItemButton selected={location.pathname === "/campo/mapa"}>
          <ListItemButton >

            <Typography color={"#fff"}>Mapas</Typography>
          </ListItemButton>
        </CustomListItemButton>
      </RouterLink>
      </React.Fragment>
            <Badge color="secondary">
              <LogoutButtonMovil />
            </Badge>
          </Toolbar>
        </AppBar>
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
          }}
        >
          <Toolbar />
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            {sectionTitle ? (Action ? (
              <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', padding: '0px 5%' }}>
                <Typography variant="h2">{sectionTitle}</Typography>
                <div><Button variant="contained" onClick={() => { Action() }}>{actionText ? actionText : 'Action'}</Button></div>
              </Box>) : <Typography variant="h2">{sectionTitle}</Typography>) : ''}
            <Paper
              sx={{
                p: 3,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {children}
            </Paper>
          </Container>
        </Box>
      </Box>
      <ToastContainer />
    </ThemeProvider>
  );
}

