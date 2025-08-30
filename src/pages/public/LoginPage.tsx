import React, { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useActionState } from 'react';
import { shemaLogin, type LoginFormValues } from '../../models';
import type { ActionState } from '../../interfaces';
import { createInitialState, hanleZodError } from '../../helpers';
import { useAlert, useAuth, useAxios } from '../../hooks';
import { Link, useNavigate } from 'react-router-dom';

export type LoginActionState = ActionState<LoginFormValues>;
const initialState = createInitialState<LoginFormValues>();
//const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const LoginPage = () => {
  const axios = useAxios();
  const { login } = useAuth();
  const { showAlert } = useAlert();
  const navigate = useNavigate();

  // Estado para mostrar/ocultar la contraseña
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault(); // evita que el botón quite el foco del input
  };

  const loginApi = async (
    _: LoginActionState | undefined,
    formData: FormData
  ) => {
    const rawData: LoginFormValues = {
      username: formData.get('username') as string,
      password: formData.get('password') as string,
    };
    try {
      shemaLogin.parse(rawData);
      //await delay(3000);
      const response = await axios.post('/login', rawData);
      if (!response?.data?.token) throw new Error('No existe el token');
      login(response.data.token, { username: rawData.username });
      navigate('/perfil');
    } catch (error) {
      const err = hanleZodError<LoginFormValues>(error, rawData);
      console.log('err', err);
      showAlert(err.message, 'error');
      return err;
    }
  };

  const [state, submitAction, isPending] = useActionState(
    loginApi,
    initialState
  );

  return (
    <Container
      maxWidth={false}
      sx={{
        backgroundColor: '#242424',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={{
          maxWidth: 'sm',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          textAlign: 'center',
          height: '100vh',
        }}
      >
        <Paper elevation={3} sx={{ padding: 4 }}>
          <Typography component={'h1'} variant="h4" gutterBottom>
            LOGIN
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Proyecto Diplomado con React 19
          </Typography>

          {/* Alerta */}
          {Object.keys(state?.errors ?? {}).length !== 0 && (
            <Alert severity="error">{state?.message}</Alert>
          )}

          <Box action={submitAction} component={'form'} sx={{ width: '100%' }}>
            <TextField
              name="username"
              margin="normal"
              required
              fullWidth
              label="Username"
              autoComplete="username"
              autoFocus
              type="text"
              disabled={isPending}
              defaultValue={state?.formData?.username}
              error={!!state?.errors?.username}
              helperText={state?.errors?.username}
            />
            <TextField
              name="password"
              margin="normal"
              required
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              disabled={isPending}
              defaultValue={state?.formData?.password}
              error={!!state?.errors?.password}
              helperText={state?.errors?.password}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                      onClick={handleTogglePassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                      size="large"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, height: 48 }}
              disabled={isPending}
              startIcon={
                isPending ? (
                  <CircularProgress size={20} color="inherit" />
                ) : null
              }
            >
              {isPending ? 'Cargando...' : 'Ingresar'}
            </Button>
            <Link to="/userRegister">Registrar nuevo usuario</Link>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};
