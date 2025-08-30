import {
  Box,
  Toolbar,
  Container,
} from '@mui/material';
import { useAuth } from '../../hooks';
import {
  Person as PersonIcon,
  Assignment as TaskIcon,
  Group as UsersIcon,   // 👈 import icono para usuarios
} from '@mui/icons-material';
import { Header } from './Header';
import type { MenuType } from './types';
import { Menu } from './Menu';
import { Footer } from './Footer';

interface Props {
  children: React.ReactNode;
}

export const Layout = ({ children }: Props) => {
  const { logout, user } = useAuth();

  const menuOptions: MenuType[] = [
    { text: 'Mi Perfil', icon: <PersonIcon />, path: '/perfil' },
    { text: 'Mis Tareas', icon: <TaskIcon />, path: '/tasks' },
    { text: 'Usuarios', icon: <UsersIcon />, path: '/usuarios' },  // 👈 agregado
  ];

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Barra superior */}
      <Header
        username={user?.username}
        logout={logout}
        menuOptions={menuOptions}
      />

      {/* Espaciador para el AppBar fixed */}
      <Toolbar />

      {/* Contenedor principal (Drawer + contenido) */}
      <Box sx={{ flex: 1, display: 'flex' }}>
        {/* Menú lateral */}
        <Menu menuOptions={menuOptions} />

        {/* Contenido */}
        <Container sx={{ flex: 1, py: 3 }}>{children}</Container>
      </Box>

      {/* Footer */}
      <Footer message="© 2025 Mi App" />
    </Box>
  );
};
