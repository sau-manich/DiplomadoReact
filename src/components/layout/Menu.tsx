import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
} from '@mui/material';
import type { MenuType } from './types';
import { useNavigate } from 'react-router-dom';

interface Props {
  menuOptions: MenuType[];
}

export const Menu = ({ menuOptions }: Props) => {
  const drawerWidth = 250;
  const navigate = useNavigate();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: 'border-box',
          borderRight: '1px solid',
          borderColor: 'divider',
        },
        zIndex: 1
      }}
    >
      <Toolbar />

      {/* Menú de navegación */}
      <List sx={{ px: 1 }}>
        {menuOptions.map((option) => (
          <ListItem key={option.text} disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              onClick={() => navigate(option.path)}
              selected={location.pathname === option.path}
              sx={{
                borderRadius: 2,
                '&.Mui-selected': {
                  bgcolor: 'primary.main',
                  color: 'white',
                  '&:hover': { bgcolor: 'primary.dark' },
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color:
                    location.pathname === option.path
                      ? 'white'
                      : 'text.secondary',
                }}
              >
                {option.icon}
              </ListItemIcon>
              <ListItemText primary={option.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};
