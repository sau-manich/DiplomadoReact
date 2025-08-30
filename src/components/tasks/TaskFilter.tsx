/* eslint-disable react-hooks/exhaustive-deps */
import {
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Toolbar,
} from '@mui/material';
import type { TaskFilterDoneType } from './type';
import { useEffect, useState } from 'react';
import { Search as SearchIcon } from '@mui/icons-material';
import { Clear as ClearIcon } from '@mui/icons-material';

interface Props {
  filterStatus: TaskFilterDoneType;
  setFilterStatus: (status: TaskFilterDoneType) => void;
  setSearch: (search: string) => void;
}

export const TaskFilter = ({
  filterStatus,
  setFilterStatus,
  setSearch,
}: Props) => {
  const [searchFilter, setSearchFilter] = useState('');

  useEffect(() => {
    const handler = setTimeout(() => {
      setSearch(searchFilter);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchFilter]);

  return (
    <Paper elevation={1} sx={{ p: 2, mb: 3, borderRadius: 3 }}>
      <Toolbar sx={{ gap: 2, flexWrap: 'wrap' }}>
        <TextField
          placeholder="Buscar tarea..."
          value={searchFilter}
          onChange={(e) => setSearchFilter(e.target.value)}
          size="small"
          sx={{ minWidth: 300 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
            endAdornment: searchFilter && (
              <InputAdornment position="end">
                <IconButton size="small" onClick={() => setSearchFilter('')}>
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Estado</InputLabel>
          <Select
            value={filterStatus}
            label="Estado"
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <MenuItem value="all">Todas</MenuItem>
            <MenuItem value="true">Completadas</MenuItem>
            <MenuItem value="false">Pendientes</MenuItem>
          </Select>
        </FormControl>
      </Toolbar>
    </Paper>
  );
};
