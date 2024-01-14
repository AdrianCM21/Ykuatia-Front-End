import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import ILoginData from '../../interfaces/auth/ILoginData';
import { login } from '../../services/auth/auth';
import {useNavigate} from 'react-router';
import { ToastContainer } from 'react-toastify';
import { redirectTo } from '../../utils/redirecTo';


export const SignIn=()=> {
  const defaultValues = {
    email: '',
    password: '',
  }
  const { handleSubmit, control } = useForm({defaultValues});

  const onSubmit:SubmitHandler<ILoginData> = async (formFields: ILoginData) => {
    
    try {
        // const response = await login(formFields)
        console.log(response)
        if(response.status===200){
          location.reload()
        }
        
    } catch (error) {
      console.log("fawdsf")
      console.log(error)
    }
  };

  return (
      <Container component="main" maxWidth="xs">
        
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Iniciar sesión
          </Typography>
          
          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="email"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email"
                  autoComplete="email"
                  autoFocus
                />
              )}
            />
            <Controller
              name="password"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Contraseña"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                />
              )}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Iniciar Sesión
            </Button>
          </form>
        </Box>
        <ToastContainer/>
      </Container>
  );
}