// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'

// ** Icons Imports
import AddIcon from '@mui/icons-material/Add'

interface TableHeaderProps {
  onAdd?: () => void,
  Search?:JSX.Element
}

const TableHeader = ({ onAdd,Search }: TableHeaderProps) => {
  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' ,width:'100%'}}>
          <Box sx={{display: 'flex',width:'100%',justifyContent:'space-between',flexDirection:'row'}}>
            {onAdd&&<Button variant="outlined" sx={{ mb: 2 }} onClick={onAdd} startIcon={<AddIcon fontSize='small' />}>
              Agregar
            </Button>}
            {Search}
          </Box>
      </Box>
    </Box>
  )
}

export default TableHeader
