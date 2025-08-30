import {
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import type { ActionState } from '../../interfaces';
import { schemaUser, type UserFormValues } from '../../models';
import { createInitialState, hanleZodError } from '../../helpers';
import { useAlert, useAxios } from '../../hooks';
import { Link, useNavigate } from 'react-router-dom';
import { useActionState } from 'react';

type UserActionState = ActionState<UserFormValues>;
const initialState = createInitialState<UserFormValues>();
export const UserPage = () => {
  const axios = useAxios();
  const { showAlert } = useAlert();
  const navigate = useNavigate();

  const createUserApi = async (
    _: UserActionState | undefined,
    formData: FormData
  ) => {
    const rawData: UserFormValues = {
      username: formData.get('username') as string,
      password: formData.get('password') as string,
      confirmPassword: formData.get('confirmPassword') as string,
    };
    try {
      schemaUser.parse(rawData);
      await axios.post('/users', {
        username: rawData.username,
        password: rawData.password,
      });
      showAlert('Usuario creado', 'success');
      navigate('/login');
    } catch (error) {
      const err = hanleZodError<UserFormValues>(error, rawData);
      showAlert(err.message, 'error');
      return err;
    }
  };

  const [state, submitAction, isPending] = useActionState(
    createUserApi,
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
            Nuevo Usuario
          </Typography>

          {/*  {Object.keys(state?.errors ?? {}).length !== 0 && (
          <Alert severity="error">{state?.message}</Alert>
        )} */}

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
              type="password"
              disabled={isPending}
              defaultValue={state?.formData?.password}
              error={!!state?.errors?.password}
              helperText={state?.errors?.password}
            />
            <TextField
              name="confirmPassword"
              margin="normal"
              required
              fullWidth
              label="Repetir password"
              type="password"
              disabled={isPending}
              defaultValue={state?.formData?.confirmPassword}
              error={!!state?.errors?.confirmPassword}
              helperText={state?.errors?.confirmPassword}
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
              {isPending ? 'Cargando...' : 'Registrar'}
            </Button>
            <Link to="/login">Ir a login</Link>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};
