import type { AlertColor } from '@mui/material';
import { createContext } from 'react';

export interface AlertType {
  message: string;
  severity?: AlertColor;
}

interface AlertContextType {
  showAlert: (message: string, severity?: AlertColor) => void;
}

export const AlertContext = createContext<AlertContextType | null>(null);
