import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { AppRouter } from './routes/AppRouter.tsx';
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import { AlertProvider, AuthProvider } from './contexts/index.ts';

const theme = createTheme({
  palette: {
    primary: {
      main: '#556cd6',
    },
    secondary: {
      main: '#19857b',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <AlertProvider>
          <AppRouter />
          <CssBaseline />
          <App />
        </AlertProvider>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>
);
