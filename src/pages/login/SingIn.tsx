import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import ILoginData from '../../interfaces/auth/ILoginData';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../../context/AuthContext';

export const SignIn = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const defaultValues = {
    email: '',
    password: '',
  };
  const { handleSubmit, control, formState } = useForm({ defaultValues });

  const onSubmit: SubmitHandler<ILoginData> = async (formFields: ILoginData) => {
    try {
      const result = await login(formFields);
      if (!result.ok) {
        return;
      }
      navigate(result.isAloneCampo ? '/campo/factura' : '/');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Box className="relative min-h-screen overflow-hidden">
        <Box
          aria-hidden
          className="yk-fade-in absolute inset-0"
          sx={{
            backgroundImage: 'url(/brand/login-hero.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <Box
          aria-hidden
          className="absolute inset-0"
          sx={{
            background:
              'linear-gradient(105deg, rgba(8, 40, 48, 0.72) 0%, rgba(11, 110, 110, 0.45) 48%, rgba(31, 78, 121, 0.35) 100%)',
          }}
        />

        <Box className="relative z-10 flex min-h-screen flex-col lg:flex-row">
          <Box className="flex flex-1 flex-col justify-end px-6 py-10 text-white md:px-12 lg:justify-center lg:py-16">
            <img
              src="/brand/ykuatia-logo.png"
              alt="Ykuatia ñangareko"
              className="yk-fade-up mb-6 h-20 w-20 rounded-2xl bg-white/90 object-cover p-2 shadow-lg md:h-24 md:w-24"
            />
            <Typography
              component="h1"
              className="yk-brand-title yk-fade-up yk-delay-1"
              sx={{
                fontSize: { xs: '2.4rem', md: '3.4rem' },
                lineHeight: 1.05,
                color: '#fff',
                maxWidth: 520,
              }}
            >
              Ykuatia ñangareko
            </Typography>
            <Typography
              className="yk-fade-up yk-delay-2"
              sx={{
                mt: 2,
                maxWidth: 420,
                color: 'rgba(255,255,255,0.9)',
                fontSize: { xs: '1rem', md: '1.15rem' },
              }}
            >
              Cuidamos el agua de la comunidad: clientes, boletas y cobros en un solo lugar.
            </Typography>
          </Box>

          <Box className="flex flex-1 items-center justify-center px-4 pb-10 md:px-8 lg:px-12 lg:py-16">
            <Box
              component="form"
              onSubmit={handleSubmit(onSubmit)}
              className="yk-login-panel yk-fade-up yk-delay-3 w-full max-w-md rounded-2xl border border-white/40 p-6 shadow-xl md:p-8"
            >
              <Typography
                component="h2"
                className="yk-brand-title"
                sx={{ fontSize: '1.75rem', color: 'var(--yk-ink)', mb: 0.5 }}
              >
                Iniciar sesión
              </Typography>
              <Typography sx={{ color: 'text.secondary', mb: 3 }}>
                Ingresá con tu correo y contraseña para continuar.
              </Typography>

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
                    label="Correo electrónico"
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
                disabled={formState.isSubmitting}
                sx={{ mt: 3, mb: 1, py: 1.3 }}
              >
                {formState.isSubmitting ? 'Ingresando…' : 'Entrar'}
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
      <ToastContainer position="bottom-center" />
    </>
  );
};
