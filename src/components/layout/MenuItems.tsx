import * as React from "react";
import {  Link as RouterLink, useLocation } from "react-router-dom";
import AssignmentIcon from '@mui/icons-material/Assignment';
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import BarChartIcon from "@mui/icons-material/BarChart";
import MapIcon from '@mui/icons-material/Map';
import HomeIcon from "@mui/icons-material/Home";
import GroupIcon from "@mui/icons-material/Group";
import { styled } from "@mui/system";
import { Typography } from "@mui/material";
import Badge from "@mui/material/Badge";
import PaymentIcon from '@mui/icons-material/Payment';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';


import { checkInvoices } from "../../services/invoices/invoices.service";
import { isAuthenticated, isCampo } from "../../services/auth/auth";


const CustomListItemButton = styled(ListItemButton)(({ theme, selected }) => ({
  color: selected ? theme.palette.primary.main : theme.palette.text.primary,
  margin: 0,
  padding: 0,
}));

export const MainMenuItems = () => {
  // const [showFacturaOptions, setShowFacturaOptions] = useState(false);
  const location = useLocation();
  const [hasNotification, setHasNotification] = React.useState(false);
  
  React.useEffect( () => {
   checkNotificaniones()
  }, [location.pathname])

  const checkNotificaniones= async()=>{
    const result = await checkInvoices()
    setHasNotification(result)
  }

  

  return (
    <React.Fragment>
      <RouterLink to="/" style={{ textDecoration: "none", color: "inherit" }}>
        <CustomListItemButton selected={location.pathname === "/"}>
          <ListItemButton>
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText>
              <Typography color={"#000"}>Inicio</Typography>
            </ListItemText>
          </ListItemButton>
        </CustomListItemButton>
      </RouterLink>

      {isAuthenticated()&&<RouterLink
        to="/pagos"
        style={{ textDecoration: "none", color: "inherit" }}
      >
        <CustomListItemButton selected={location.pathname === "/pagos"}>
          <ListItemButton >
            <ListItemIcon>
            <PaymentIcon />
            </ListItemIcon>
            <ListItemText>Pagos</ListItemText>
          </ListItemButton>
        </CustomListItemButton>
      </RouterLink>}
      
      {isAuthenticated()&&<RouterLink
        to="/clientes"
        style={{ textDecoration: "none", color: "inherit" }}
      >
        <CustomListItemButton selected={location.pathname === "/clientes"}>
          <ListItemButton >
            <ListItemIcon>
            <GroupIcon />
            </ListItemIcon>
            <ListItemText>Usuarios</ListItemText>
          </ListItemButton>
        </CustomListItemButton>
      </RouterLink>}
      {isCampo()&&<RouterLink
        to="/facturas"
        style={{ textDecoration: "none", color: "inherit" }}
      >
        <CustomListItemButton selected={location.pathname === "/facturas"}>
          <ListItemButton>
            <ListItemIcon style={{ width: '24px', height: '24px' }}>
              <Badge color="error" variant="dot" invisible={!hasNotification}>
                <AssignmentIcon />
              </Badge>
            </ListItemIcon>
            <ListItemText>Facturas</ListItemText>
          </ListItemButton>
        </CustomListItemButton>
      </RouterLink>}
      {isAuthenticated()&&<RouterLink
        to="/caja"
        style={{ textDecoration: "none", color: "inherit" }}
      >
        <CustomListItemButton selected={location.pathname === "/caja"}>
          <ListItemButton >
            <ListItemIcon>
            <AttachMoneyIcon />
            </ListItemIcon>
            <ListItemText>Caja</ListItemText>
          </ListItemButton>
        </CustomListItemButton>
      </RouterLink>}

{isAuthenticated()&& <RouterLink
        to="/estadisticas"
        style={{ textDecoration: "none", color: "inherit" }}
      >
        <CustomListItemButton selected={location.pathname === "/estadisticas"}>
          <ListItemButton >
            <ListItemIcon>
              <BarChartIcon />
            </ListItemIcon>
            <ListItemText>Estadísticas</ListItemText>
          </ListItemButton>
        </CustomListItemButton>
      </RouterLink>}
      {isCampo()&& <RouterLink
        to="/mapas"
        style={{ textDecoration: "none", color: "inherit" }}
      >
        <CustomListItemButton selected={location.pathname === "/mapas"}>
          <ListItemButton >
            <ListItemIcon>
              <MapIcon />
            </ListItemIcon>
            <ListItemText>Mapas</ListItemText>
          </ListItemButton>
        </CustomListItemButton>
      </RouterLink>}


      <ListItemButton></ListItemButton>
    </React.Fragment>
  );
};
