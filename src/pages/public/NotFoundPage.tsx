import { Button, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export const NotFoundPage = () => {
  const navigate = useNavigate();
  return (
    <Container
      maxWidth="sm"
      sx={{
        height: '80vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
      }}
    >
      <Typography variant="h1" color="error">
        404
      </Typography>
      <Typography variant="h5">Pagina no encontrada</Typography>
      <Button
        variant="contained"
        color="primary"
        size="large"
        onClick={() => navigate('/')}
      >
        Ir al inicio
      </Button>
    </Container>
  );
};
