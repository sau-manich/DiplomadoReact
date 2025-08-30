import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import type { TaskType } from './type';
import { useActionState } from 'react';
import type { ActionState } from '../../interfaces';
import type { TaskFormValues } from '../../models';
import { createInitialState } from '../../helpers';

export type TaskActionState = ActionState<TaskFormValues>;

interface Props {
  open: boolean;
  task?: TaskType | null;
  onClose: () => void;
  handleCreateEdit: (
    _: TaskActionState | undefined,
    formData: FormData
  ) => Promise<TaskActionState | undefined>;
}
export const TaskDialog = ({ onClose, open, task, handleCreateEdit }: Props) => {
  const initialState = createInitialState<TaskFormValues>();

  const [state, submitAction, isPending] = useActionState(
    handleCreateEdit,
    initialState
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth={'sm'} fullWidth>
      <DialogTitle>{task ? 'Editar tarea' : 'Nueva tarea'}</DialogTitle>
      <Box key={task?.id ?? 'new'} component={'form'} action={submitAction}>
        <DialogContent>
          <TextField
            name="name"
            autoFocus
            margin="dense"
            label="Nombre de la tarea"
            fullWidth
            required
            variant="outlined"
            disabled={isPending}
            defaultValue={state?.formData?.name || task?.name || ''}
            error={!!state?.errors?.name}
            helperText={state?.errors?.name}
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={onClose} color="inherit" disabled={isPending}>
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isPending}
            startIcon={isPending ? <CircularProgress /> : null}
          >
            {task ? 'Actualizar' : 'Crear'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};
