import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Backdrop } from '@mui/material';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
interface IProps {
    onClose: () => void
    open: boolean
    data:string[]
  }
const style = {
  position: 'absolute',
  top: '49%',
  left: '58%',
  transform: 'translate(-50%, -50%)',
  width: '78vw',
  height:'70vh',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  borderRadius:'1.8%'
  
};

export const ViewAuditoria=({onClose,open,data }: IProps)=> {
  return (
    <Modal
    aria-labelledby="transition-modal-title"
    aria-describedby="transition-modal-description"
        open={open}
        onClose={onClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        >

    
        <Box sx={style}>
            <div style={{width:'100%',display:'flex',justifyContent: 'space-between',position:'sticky',borderBottom:'2px solid #000'}}>
                <div></div>
                <Typography id="modal-modal-title" variant="h5" component="h2">
            Auditoria
          </Typography>
          <Button onClick={onClose}>Salir</Button>
            </div>
            <Box sx={{width:'100%',height:'95%',overflow:'auto'}}>
            {data.map((e,index)=>{
                return(
                <ListItem  key={index} component="div" disablePadding>
                    <ListItemButton>
                         <ListItemText primary={e} />
                    </ListItemButton>
                </ListItem>)
            })
            }
            </Box>
        </Box>
    </Modal>
  );
}

