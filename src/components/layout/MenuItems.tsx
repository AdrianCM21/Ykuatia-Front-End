import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import AssignmentIcon from '@mui/icons-material/Assignment';
import HomeIcon from '@mui/icons-material/Home';
import AddIcon from '@mui/icons-material/Add';
import PersonIcon from '@mui/icons-material/Person';
import InventoryIcon from '@mui/icons-material/Inventory';
import Link from '@mui/material/Link';
import { Typography } from '@mui/material';

export const MainMenuItems = (
  <React.Fragment>
    <ListItemButton>
      <ListItemIcon>
        <HomeIcon />
      </ListItemIcon>
      <ListItemText>
        <Link href='/' underline='none'><Typography color={'#000'}>Inicio</Typography></Link>
      </ListItemText>
    </ListItemButton>

    <ListItemButton>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText>
        <Link href='/clientes' underline='none'><Typography color={'#000'}>Clientes</Typography></Link>
      </ListItemText>
    </ListItemButton>
    <ListItemButton></ListItemButton>
  </React.Fragment>
);