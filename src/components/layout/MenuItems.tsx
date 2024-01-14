import * as React from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { useState } from "react";
import AssignmentIcon from '@mui/icons-material/Assignment';
import BusinessIcon from "@mui/icons-material/Business";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import HomeIcon from "@mui/icons-material/Home";
import GroupIcon from "@mui/icons-material/Group";
import PersonIcon from "@mui/icons-material/Person";
import InventoryIcon from "@mui/icons-material/Inventory";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";

import { styled } from "@mui/system";
import { Typography } from "@mui/material";

const CustomListItemButton = styled(ListItemButton)(({ theme, selected }) => ({
  color: selected ? theme.palette.primary.main : theme.palette.text.primary,
  margin: 0,
  padding: 0,
}));

export const MainMenuItems = () => {
  const [showFacturaOptions, setShowFacturaOptions] = useState(false);
  const location = useLocation();

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
      <RouterLink
        to="/facturas"
        style={{ textDecoration: "none", color: "inherit" }}
      >
        <CustomListItemButton selected={location.pathname === "/facturas"}>
          <ListItemButton >
            <ListItemIcon>
            <AssignmentIcon />
            </ListItemIcon>
            <ListItemText>facturas</ListItemText>
          </ListItemButton>
        </CustomListItemButton>
      </RouterLink>
      <RouterLink
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
      </RouterLink>


      <ListItemButton></ListItemButton>
    </React.Fragment>
  );
};
